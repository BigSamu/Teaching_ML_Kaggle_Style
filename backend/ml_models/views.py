#############################################################
#                                                           #
#     views.py -                                            #
#        Corresponding views for ml_models.models           #
#                                                           #
#     Written by Matthew Sheldon & Stefan Tionanda          #
#                                                           #
#############################################################

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status, viewsets, permissions
from django.contrib.auth.models import User

from django.http import HttpResponse, HttpResponseBadRequest
from django.template import loader
from django.shortcuts import render
from rest_framework.renderers import JSONRenderer

from .serializers import *
from .models import *

import classroom.models
from classroom.serializers import SubmissionSerializer

import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), '../../MLTools'))

import time

# Configuration parameters..
FEATURE_THRESHOLD = 5

class CompetitionModelViewSet(viewsets.ModelViewSet):
    queryset = CompetitionModel.objects.all()
    serializer_class = CompetitionModelSerializer
    permission_classes = [permissions.AllowAny]

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    def delete(self, request, pk, format=None):
        snippet = self.get_object(pk)
        snippet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ScoringViewSet(viewsets.ModelViewSet):
    queryset = Scoring.objects.all()
    serializer_class = ScoringSerializer
    permission_classes = [permissions.AllowAny]

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    def delete(self, request, pk, format=None):
        snippet = self.get_object(pk)
        snippet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT) 

class FeatureViewSet(viewsets.ModelViewSet):
    queryset = Feature.objects.all()
    serializer_class = FeatureSerializer
    permission_classes = [permissions.AllowAny]

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    def delete(self, request, pk, format=None):
        snippet = self.get_object(pk)
        snippet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class TrainTestSplitViewSet(viewsets.ModelViewSet):
    queryset = Feature.objects.all()
    serializer_class = TrainTestSplitSerializer
    permission_classes = [permissions.AllowAny]

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    def delete(self, request, pk, format=None):
        snippet = self.get_object(pk)
        snippet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def train_model(request, submission_pk):
    try:
        competition_model = classroom.models.Submission.objects.get(pk=submission_pk).competition_model
    except classroom.models.Submission.DoesNotExist:
        return Response("Submission #{} not found".format(submission_pk), status=status.HTTP_404_NOT_FOUND)

    if competition_model.status_cd != 2:
        competition_model.train()
    return Response(status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def get_submission_score(request, submission_pk, score_type):
    try:
        competition_model = classroom.models.Submission.objects.get(pk=submission_pk).competition_model
    except classroom.models.Submission.DoesNotExist:
        return Response("Submission #{} not found".format(submission_pk), status=status.HTTP_404_NOT_FOUND)
    
    scores = Scoring.objects.get(competition_model=competition_model, data_type=score_type)
    return Response(ScoringSerializer(scores, context={'request': request}).data)

@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def create_submission(request, participant_pk, competition_no):
    try:
        participant_model = classroom.models.Participant.objects.get(pk=participant_pk)
    except classroom.models.Participant.DoesNotExist:
        return Response("Participant #{} not found".format(participant_pk), status=status.HTTP_404_NOT_FOUND)
    submission_model = classroom.models.Submission.objects.create(participant=participant_model,
                                                 competition_model=None, competition_no=competition_no,
                                                 model_type=1)
    submission_model.save()
    return Response(SubmissionSerializer(submission_model, context={'request': request}).data)

@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def get_latest_submission(request, participant_pk, competition_no):
    try:
        participant_model = classroom.models.Participant.objects.get(pk=participant_pk)
    except classroom.models.Participant.DoesNotExist:
        return Response("Participant #{} not found".format(participant_pk), status=status.HTTP_404_NOT_FOUND)
    submissions = classroom.models.Submission.objects.filter(participant=participant_model, 
                    competition_no=competition_no)
    submissions = submissions.order_by("-created_date")
    return Response(SubmissionSerializer(submissions[0], context={'request': request}).data)

@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def make_submission_final(request, submission_pk):
    """make_submission_final -
        Mark a submission as a "final submission" - which will be scored in comprison to the other
            cohorts.
        
        Parameters:
            submission_pk: primary key of the corresponding submission.
        
        Returns:
            [None]
        
        HTTP codes:
            - Success: HTTP 200
            - Failure: 
                - Submission not found: HTTP 404
                - Python error: HTTP 500
    """
    try:
        submission_model = classroom.models.Submission.objects.get(pk=submission_pk)
    except classroom.models.Submission.DoesNotExist:
        return Response("Submission #{} not found".format(submission_pk), status=status.HTTP_404_NOT_FOUND)
    participant = submission_model.participant
    if submission_model.competition_no == 1:
        participant.final_submission_1 = submission_model
    if submission_model.competition_no == 2:
        participant.final_submission_2 = submission_model
    participant.save()
    
    return Response(status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def set_features(request, submission_pk):
    """set_features -
        Allows the user to define which features correspond to a given submission. Can either find an existing
            model that matches, or will create a new one.
        
        Parameters:
            submission_pk: primary key of the corresponding submission.
            request["features"]: names of each feature to select.
        
        Returns:
            [None]
        
        HTTP codes:
            - Success: HTTP 200
            - Failure: 
                - Submission not found: HTTP 404
                - Python error: HTTP 500
    """
    try:
        submission_model = classroom.models.Submission.objects.get(pk=submission_pk)
    except classroom.models.Submission.DoesNotExist:
        return Response("Submission #{} not found".format(submission_pk), status=status.HTTP_404_NOT_FOUND)
    features  = request.data["features"]

    num_features = len(features)
    
    features = json.dumps(sorted(features))
    train_test_split = None
    if submission_model.competition_no == 1:
        train_test_split = submission_model.participant.cohort.train_test_split_comp_1
    elif submission_model.competition_no == 2:
        train_test_split = submission_model.participant.cohort.train_test_split_comp_2

    if num_features > FEATURE_THRESHOLD:
        # If there's greater than this number of features, then it's assumed that model recurrence is too
        #   unlikely to worry about.
        comp_filter = [] # This is a hack to pass the first if statement..
    else:
        # Otherwise, try and see if there's an existing model that matches..
        comp_filter = CompetitionModel.objects.filter(features=features, 
                competition_no=submission_model.competition_no, model_type=submission_model.model_type,
                train_test_split=train_test_split, serialization=b"", status_cd=2)


    if len(comp_filter) == 0:
        competition_model = CompetitionModel.objects.create(features=features,
                    competition_no=submission_model.competition_no, model_type=submission_model.model_type,
                    status_cd=1,serialization=b"", train_test_split=train_test_split)
        competition_model.save()
        submission_model.competition_model = competition_model
        submission_model.save()
    else:
        submission_model.competition_model = comp_filter[0]
        submission_model.save()
    return Response(status=status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def set_model_type(request, submission_pk, model_type):
    """set_model_type -
        Allows the user to define the type of model.
        
        Parameters:
            submission_pk: primary key of the corresponding submission.
            model_type: integer representing the type of model.
                - 1: Logistic Regression
                - 2: Decision Tree
        
        Returns:
            [None]
        
        HTTP codes:
            - Success: HTTP 200
            - Failure: 
                - Invalid model type, or not allowed in competition: HTTP 400
                - Submission not found: HTTP 404
                - Python error: HTTP 500
    """
    try:
        submission_model = classroom.models.Submission.objects.get(pk=submission_pk)
    except classroom.models.Submission.DoesNotExist:
        return Response("Submission #{} not found".format(submission_pk), status=status.HTTP_404_NOT_FOUND)
    if model_type not in [1,2]:
        return Response("Invalid model type", status=status.HTTP_400_BAD_REQUEST)
    if (submission_model.competition_no == 1) and (model_type == 2):
        return Response("No decision trees in comp 1", status=status.HTTP_400_BAD_REQUEST)

    submission_model.model_type = model_type
    submission_model.save()

    features = submission_model.competition_model.features
    train_test_split = None
    if submission_model.competition_no == 1:
        train_test_split = submission_model.participant.cohort.train_test_split_comp_1
    elif submission_model.competition_no == 2:
        train_test_split = submission_model.participant.cohort.train_test_split_comp_2

    comp_filter = CompetitionModel.objects.filter(features=features, 
                competition_no=submission_model.competition_no, model_type=submission_model.model_type,
                train_test_split=train_test_split, status_cd=2)

    if len(comp_filter) == 0:
        competition_model = CompetitionModel.objects.create(features=features,
                    competition_no=submission_model.competition_no, model_type=submission_model.model_type,
                    status_cd=1, serialization=b"", train_test_split=train_test_split)
        competition_model.save()
        submission_model.competition_model = competition_model
        submission_model.save()
    else:
        submission_model.competition_model = comp_filter[0]
        submission_model.save()
    
    return Response(status=status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def set_train_submission(request, submission_pk, model_type):
    """set_train_submission -
        Updates the features of a submission, sets model type, and trains the model.
        
        Parameters:
            submission_pk: primary key of the corresponding submission.
            model_type: integer representing the type of model.
                - 1: Logistic Regression
                - 2: Decision Tree
            request["features"]: names of each feature to select.
        
        Returns:
            [None]
        
        HTTP codes:
            - Success: HTTP 200
            - Failure: 
                - Invalid model type, or not allowed in competition: HTTP 400
                - Submission not found: HTTP 404
                - Python error: HTTP 500
    """
    try:
        submission_model = classroom.models.Submission.objects.get(pk=submission_pk)
    except classroom.models.Submission.DoesNotExist:
        return Response("Submission #{} not found".format(submission_pk), status=status.HTTP_404_NOT_FOUND)
    submission_model.model_type = model_type
    submission_model.save()

    features  = request.data["features"]

    num_features = len(features)
    
    features = json.dumps(sorted(features))
    train_test_split = None
    if submission_model.competition_no == 1:
        train_test_split = submission_model.participant.cohort.train_test_split_comp_1
    elif submission_model.competition_no == 2:
        train_test_split = submission_model.participant.cohort.train_test_split_comp_2

    if num_features > FEATURE_THRESHOLD:
        # If there's greater than this number of features, then it's assumed that model recurrence is too
        #   unlikely to worry about.
        comp_filter = [] # This is a hack to pass the first if statement..
    else:
        # Otherwise, try and see if there's an existing model that matches..
        comp_filter = CompetitionModel.objects.filter(features=features, 
                competition_no=submission_model.competition_no, model_type=submission_model.model_type,
                train_test_split=train_test_split, serialization=b"", status_cd=2)


    if len(comp_filter) == 0:
        competition_model = CompetitionModel.objects.create(features=features,
                    competition_no=submission_model.competition_no, model_type=submission_model.model_type,
                    status_cd=1,serialization=b"", train_test_split=train_test_split)
        competition_model.save()
        submission_model.competition_model = competition_model
        submission_model.save()
    else:
        submission_model.competition_model = comp_filter[0]
        submission_model.save()

    
    competition_model = submission_model.competition_model
    if competition_model.status_cd != 2:
        competition_model.train()

    return Response("",status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def get_model_features(request, submission_pk):
    """get_model_features -
        Returns all features corresponding to a certain submission.
        
        Parameters:
            submission_pk: primary key of the corresponding submission.
        
        Returns:
            (array): names of each feature used.
        
        HTTP codes:
            - Success: HTTP 200
            - Failure: 
                - Submission not found: HTTP 404
                - Python error: HTTP 500
    """
    try:
        sub_model = classroom.models.Submission.objects.get(pk=submission_pk)
    except classroom.models.Submission.DoesNotExist:
        return Response("Submission #{} not found".format(submission_pk), status=status.HTTP_404_NOT_FOUND)
    features = sub_model.competition_model.features
    return Response(features, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def get_serialization(request, submission_pk):
    """get_serialization -
        Returns the serialization of the << ML model itself >> from a submission.
        
        Parameters:
            submission_pk: primary key of the corresponding submission.
        
        Returns:
            (json-like): tree structure describing the ml model.
        
        HTTP codes:
            - Success: HTTP 200
            - Failure: 
                - Submission not found: HTTP 404
                - Python error: HTTP 500
    """
    try:
        sub_model = classroom.models.Submission.objects.get(pk=submission_pk)
    except classroom.models.Submission.DoesNotExist:
        return Response("Submission #{} not found".format(submission_pk), status=status.HTTP_404_NOT_FOUND)
    features = sub_model.competition_model.serialization
    return Response(features, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def get_visualization(request, submission_pk):
    """get_serialization -
        Returns the visualization of a particular decision tree from a submission
        
        Parameters:
            submission_pk: primary key of the corresponding submission.
        
        Returns:
            (string): svg visualization
        
        HTTP codes:
            - Success: HTTP 200
            - Failure: 
                - Not decision tree: HTTP 400
                - Submission not found: HTTP 404
                - Python error: HTTP 500
    """
    try:
        sub_model = classroom.models.Submission.objects.get(pk=submission_pk)
    except classroom.models.Submission.DoesNotExist:
        return Response("Submission #{} not found".format(submission_pk), status=status.HTTP_404_NOT_FOUND)
    if sub_model.competition_model.viz == "NOT BUILT":
        sub_model.competition_model.build_viz()
    visualization = sub_model.competition_model.viz
    return Response(visualization, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def data_io_benchmark(request):
    """data_io_benchmark -
        Dummy view to benchmark data-io in a request context

        HTTP codes:
            - Success: HTTP 200
            - Failure:
                - Python error: HTTP 500
    """
    cv = data_load.CommunityViolations()
    return Response(cv.pull_data(), status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def base_benchmark(request):
    """base_benchmark -
        Dummy view to benchmark an empty, bare-bones request.

        HTTP codes:
            - Success: HTTP 200
            - Failure:
                - Python error: HTTP 500
    """
    return Response(status=status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def submit_best_model(request, participant_pk, competition_no, data_type):
    """save_best_model -
        Change the final submission to the best-scoring model (in terms of accuracy).

        Returns:
            (int): pk of the selected model.
    """

    rel_submissions = classroom.models.Submission.objects.filter(participant=participant_pk, competition_no=competition_no)
    if len(rel_submissions) == 0:
        return Response("No submissions found", status=status.HTTP_404_NOT_FOUND)
    rel_comp_models = [sub.competition_model for sub in rel_submissions]
    scores = [Scoring.objects.get(data_type=data_type, competition_model=c_model)
                    for c_model in rel_comp_models]
    max_score = max(scores)
    best_sub = rel_submissions[scores.index(max_score)]
    if competition_no == 1:
        classroom.models.Participant.objects.get(pk=participant_pk).final_submission_1 = best_sub
    elif competition_no == 2:
        classroom.models.Participant.objects.get(pk=participant_pk).final_submission_2 = best_sub
    return Response(best_sub.pk, status=status.HTTP_200_OK)
