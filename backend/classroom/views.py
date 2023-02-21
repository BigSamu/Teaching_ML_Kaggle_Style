#############################################################
#                                                           #
#     views.py -                                            #
#        Corresponding views for classroom.models           #
#                                                           #
#     Written by Matthew Sheldon & Stefan Tionanda          #
#                                                           #
#############################################################

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework import status, viewsets, permissions
from django.contrib.auth.models import User

from django.http import HttpResponse, HttpResponseBadRequest
from django.template import loader
from django.shortcuts import render

from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from .serializers import *
from .models import *

import ml_models.serializers

import json
import random

from ml_tools import data_load, model_export

class AuthUserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = AuthUserSerializer
    permission_classes = [permissions.AllowAny]
    authentication_class = JSONWebTokenAuthentication

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_class = JSONWebTokenAuthentication

class ParticipantViewSet(viewsets.ModelViewSet):
    queryset = Participant.objects.all()
    serializer_class = ParticipantSerializer
    permission_classes = [permissions.AllowAny]
    authentication_class = JSONWebTokenAuthentication

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)
    def delete(self, request, pk, format=None):
        snippet = self.get_object(pk)
        snippet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT) 

class CohortViewSet(viewsets.ModelViewSet):
    queryset = Cohort.objects.all()
    serializer_class = CohortSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    authentication_class = JSONWebTokenAuthentication

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)
    def delete(self, request, pk, format=None):
        snippet = self.get_object(pk)
        snippet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT) 

class SubmissionViewSet(viewsets.ModelViewSet):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.AllowAny]
    authentication_class = JSONWebTokenAuthentication

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)
    def delete(self, request, pk, format=None):
        snippet = self.get_object(pk)
        snippet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT) 

class ParticipantDetailViewSet(viewsets.ModelViewSet):
    queryset = Participant.objects.all()
    serializer_class = ParticipantDetailSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    authentication_class = JSONWebTokenAuthentication

class CohortDetailViewSet(viewsets.ModelViewSet):
    queryset = Cohort.objects.all()
    serializer_class = CohortDetailSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    authentication_class = JSONWebTokenAuthentication

@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
@authentication_classes([JSONWebTokenAuthentication])
def disable_cohorts(request):
    """disable_cohorts -
        Mark all cohorts as being disabled..

        HTTP codes:
            - Success: HTTP 200
            - Failure:
                - Python error: HTTP 500
    """
    Cohort.objects.all().update(is_active=False)
    return Response(status=status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
@authentication_classes([JSONWebTokenAuthentication])
def enable_cohorts(request):
    """enable_cohorts -
        Mark all cohorts as being enabled..

        HTTP codes:
            - Success: HTTP 200
            - Failure:
                - Python error: HTTP 500
    """
    Cohort.objects.all().update(is_active=True)
    return Response(status=status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
@authentication_classes([JSONWebTokenAuthentication])
def clear_participants_from_cohort(request, cohort_pk):
    """clear_participants_from_cohort -
        Remove all participants from a particular cohort
    
        Parameters:
            - cohort_pk: cohort to clear from

        HTTP codes:
            - Success: HTTP 200
            - Failure:
                - Python error: HTTP 500
    """
    Participant.objects.filter(cohort=cohort_pk).delete()
    return Response(status=status.HTTP_202_ACCEPTED)

@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
@authentication_classes([JSONWebTokenAuthentication])
def clear_submissions_from_cohort(request, cohort_pk):
    """clear_submissions_from_cohort -
        Remove all submissions from a particular cohort
    
        Parameters:
            - cohort_pk: cohort to clear from

        HTTP codes:
            - Success: HTTP 200
            - Failure:
                - Python error: HTTP 500
    """
    participants = Participant.objects.filter(cohort=cohort_pk)
    for p in participants:
        Submission.objects.filter(participant=p).delete()
    return Response(status=status.HTTP_202_ACCEPTED)

@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
@authentication_classes([JSONWebTokenAuthentication])
def disable_cohort_comp(request, competition_no):
    """enable_cohort_comp -
        Mark all cohorts as being disabled for a particular competition..
    
        Parameters:
            - competition_no: number of the competition to enable.

        HTTP codes:
            - Success: HTTP 200
            - Failure:
                - Invalid competition #: HTTP 400
                - Python error: HTTP 500
    """
    if competition_no == 1:
        Cohort.objects.all().update(competition_1_access=False)
    elif  competition_no == 2:
        Cohort.objects.all().update(competition_2_access=False)
    else:
        return Response("Invalid competition number: {}".format(competition_no), 
                        status=status.HTTP_400_BAD_REQUEST)
    return Response(status=status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
@authentication_classes([JSONWebTokenAuthentication])
def enable_cohort_comp(request, competition_no):
    print(request.body)
    """enable_cohort_comp -
        Mark all cohorts as being enabled for a particular competition..
    
        Parameters:
            - competition_no: number of the competition to enable.
            
        HTTP codes:
            - Success: HTTP 200
            - Failure:
                - Invalid competition #: HTTP 400
                - Python error: HTTP 500
    """
    if competition_no == 1:
        Cohort.objects.all().update(competition_1_access=True)
    elif  competition_no == 2:
        Cohort.objects.all().update(competition_2_access=True)
    else:
        return Response("Invalid competition number: {}".format(competition_no), 
                        status=status.HTTP_400_BAD_REQUEST)
    return Response(status=status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
@authentication_classes([JSONWebTokenAuthentication])
def delete_cohorts(request):
    """delete_cohorts -
        Delete all cohorts, period (all participants are deleted as well).
    """
    Participant.objects.all().delete()
    Cohort.objects.all().delete()
    return Response(status=status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
@authentication_classes([JSONWebTokenAuthentication])
def delete_participants(request):
    """delete_participants -
        Delete all participants, period.
    """
    Participant.objects.all().delete()
    return Response(status=status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
@authentication_classes([JSONWebTokenAuthentication])
def delete_submissions(request):
    """delete_submissions -
        Delete all submissions, period.
    """
    Submission.objects.all().delete()
    return Response(status=status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
@authentication_classes([JSONWebTokenAuthentication])
def set_train_test_split(request, cohort_pk, competition_no):
    """set_train_test_split -
        Allows a competition administrator to set the train test split for a cohort
        
        Parameters:
            cohort_pk: primary key of the selected cohort
            competition_no: competition number (1 or 2)
        
        Body:
            train/test/validation: decimal proportion of the data to be allocated to each split
        
        HTTP codes:
            - Success: HTTP 200
            - Failure:
                - Invalid competition #: HTTP 400
                - Invalid train/test/val split: HTTP 400
                - Cohort or Scoring not found: HTTP 404
                - Python error: HTTP 500
    """
    if competition_no not in [1,2]:
        return Response("Invalid competition number: {}".format(competition_no), status=status.HTTP_400_BAD_REQUEST)
    try:
        cohort_obj = Cohort.objects.get(pk=cohort_pk)
    except Cohort.objects.DoesNotExist:
        return Response ("Cohort #{} not found".format(cohort_pk), status=status.HTTP_404_NOT_FOUND)
    train_pc = float(request.data["train"])
    test_pc = float(request.data["test"])
    val_pc = float(request.data["validation"])
    if (train_pc + test_pc + val_pc) != 1:
        return Response("Invalid train/test/validation split", status=status.HTTP_400_BAD_REQUEST)
    tts_query = ml_models.models.TrainTestSplit.objects.filter(train_percentage=train_pc,
                                                               test_percentage=test_pc,
                                                               validation_percentage=val_pc)
    tts_model = None
    if len(tts_query) == 0:
        tts_model = ml_models.models.TrainTestSplit.objects.create(train_percentage=train_pc,
                                                                   test_percentage=test_pc,
                                                                   validation_percentage=val_pc)
        tts_model.save()
    else:
        tts_model = tts_query[0]
    if competition_no == 1:
        cohort_obj.train_test_split_comp_1 = tts_model
    elif competition_no == 2:
        cohort_obj.train_test_split_comp_2 = tts_model
    cohort_obj.save()
    return Response(status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def get_scores_for_cohort(request, cohort_pk, competition_no):
    """get_scores_for_cohort -
        Allows a developer/tester to populate the database using real-world like testing data.
        
        Parameters:
            cohort_pk: primary key of the selected cohort
            competition_no: competition number (1 or 2)
        
        Returns:
            (dict): dictionaries of train/test/validation scores for each participant (indexed by pk) in
                    the cohort
        
        HTTP codes:
            - Success: HTTP 200
            - Failure:
                - Invalid competition #: HTTP 400
                - Cohort or Scoring not found: HTTP 404
                - Python error: HTTP 500
    """
    try:
        cohort_obj = Cohort.objects.get(pk=cohort_pk)
    except Cohort.objects.DoesNotExist:
        return Response ("Cohort #{} not found".format(cohort_pk), status=status.HTTP_404_NOT_FOUND)
    participants = Participant.objects.filter(cohort=cohort_obj)
    scoring_dict = {}
    if competition_no not in [1,2]:
        return Response("Invalid competition no", status=status.HTTP_400_BAD_REQUEST)
    for participant in participants:
        if competition_no == 1:
            if participant.final_submission_1 is None:
                continue
            comp_model = participant.final_submission_1.competition_model
        elif competition_no == 2:
            if participant.final_submission_2 is None:
                continue
            comp_model = participant.final_submission_2.competition_model
        if comp_model is None:
            continue
        try:
            scoring_dict[participant.pk] = {
                "train": ml_models.serializers.ScoringSerializer(
                            ml_models.models.Scoring.objects.get(competition_model=comp_model, data_type=1),
                            context={'request': request}).data,
                "test": ml_models.serializers.ScoringSerializer(
                            ml_models.models.Scoring.objects.get(competition_model=comp_model, data_type=2),
                            context={'request': request}).data,
                "validation": ml_models.serializers.ScoringSerializer(
                            ml_models.models.Scoring.objects.get(competition_model=comp_model, data_type=3),
                            context={'request': request}).data,
            }
        except Scoring.objects.DoesNotExist:
            return Response("Scoring not found for model.", status=status.HTTP_404_NOT_FOUND)
    return Response((scoring_dict), status=status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes([permissions.AllowAny])
@authentication_classes([JSONWebTokenAuthentication])
def populate_test_data(request):
    """populate_test_data -
        Allows a developer/tester to populate the database using real-world like testing data.
        
        Returns:
            [None]
        
        HTTP codes:
            - Success: HTTP 200
            - Failure:
                - Python error: HTTP 500
    """
    num_cohorts = 3
    cohorts = []

    for i in range(num_cohorts):
        cohort_name = "Cohort {}".format(round(random.random()*1000))
        cohorts.append(Cohort.objects.create(name=cohort_name, competition_1_access=True, competition_2_access=True,
                                    is_active=True))
    
    # randomly generate participant names, emails..
    first_names = ["Jamie", "Sammy", "Jen", "Courtney", "Tre", "Ronan", "Maximillian",
                   "Chase", "Emily", "Shane", "Mollie", "Barbara", "Jane", "Zain",
                   "Stacie", "Mitchell", "Marcus", "Chelsea", "Elliott", "Regan",
                   "Shirley", "Callum", "Marco", "Gail", "Mohammad", "Julien",
                   "Chester", "Shannon", "Montague", "Jonas", "Denise", "Eugene",
                   "Bea", "Ellice", "Hugo", "Raiden", "Catherine", "Waleed",
                   "Angelica", "Franklin","Joann", "Judith", "Morgan", "Max",
                   "Iris", "Bryn", "Kirstin", "Fred", "Chayden", "Lucy", "Shauna"]
    last_names = ["Curtis", "Mansell", "Austin", "Knapp", "Waynard", "Allan", "Golden",
                  "Plant", "Talbot", "Rossi", "Delacruz", "Michael", "Barrett", "MacKenna",
                  "Adam", "Gallagher", "Stanley", "McKinney", "Cannon", "Flores", "Norton",
                  "Mason", "Barnard", "Webb", "Down", "Schmidt", "Mack", "Duncan",
                  "Thomas", "Mill", "Castillo", "Gutierrez", "Blankenship", "Camacho",
                  "Potter", "Penn", "Halliday", "Mooney", "Higgens", "Coleman", "Dickson",
                  "Bonner", "Bailey", "Jensen", "Trujilo", "Travers", "Towner", "Dixon",
                  "McManus"]
    emails = ["gmail.com", "yahoo.com", "bellsouth.org", "ic.ac.uk", "outlook.com"]

    num_pariticipants_per_cohort = 20
    com_viol = data_load.CommunityViolations()
    ml_models.models.Feature.populate(com_viol)
    num_found = 0
    num_not_found = 0
    max_cached_length = 0
    num_starting_models = len(ml_models.models.CompetitionModel.objects.all())

    for i in range(num_cohorts):
        train_test_split_1 = cohorts[i].train_test_split_comp_1
        train_test_split_2 = cohorts[i].train_test_split_comp_2

        # add 20 participants per cohort
        for j in range(num_pariticipants_per_cohort):
            f_name = random.choice(first_names)
            l_name = random.choice(last_names)
            email = random.choice(emails)
            p = Participant.objects.create(first_name=f_name, last_name=l_name,
                                    username="{}.{}@{}".format(f_name.lower(),l_name.lower(), email),
                                    cohort=cohorts[i])

            # 50% chance they have a submission for competition 1
            if random.random() < 0.5:
                # Add at least one feature, and subsequent features with 10% chance of ending each time..
                feature_list = [random.choice(com_viol.independent_features)]
                while random.random() < 0.9:
                    feature_list.append(random.choice(com_viol.independent_features))
                feature_list = sorted(list(set(feature_list)))
                feature_len = len(feature_list)
                feature_list = json.dumps(feature_list)

                comp_filter = ml_models.models.CompetitionModel.objects.filter(features=feature_list, 
                            competition_no=1, model_type=1,
                            train_test_split=train_test_split_1)
                if not comp_filter.exists():
                    c_model_1 = ml_models.models.CompetitionModel.objects.create(status_cd = 1, competition_no=1,model_type=1,
                        features = feature_list)
                    c_model_1.train()
                    num_not_found += 1
                else:
                    c_model_1 = comp_filter[0]
                    num_found += 1
                    max_cached_length = max(feature_len, max_cached_length)

                sub = Submission.objects.create(participant=p, competition_model=c_model_1,competition_no=1,model_type=1)
                if random.random() < 0.5:
                    # 50% chance of making this submission final.
                    p.final_submission_1 = sub
                    p.save()

            # Do the same for competition 2, with identical logic and probabilities.
            if random.random() < 0.5:
                feature_list = [random.choice(com_viol.independent_features)]
                while random.random() < 0.9:
                    feature_list.append(random.choice(com_viol.independent_features))
                feature_list = sorted(list(set(feature_list)))
                feature_len = len(feature_list)
                feature_list = json.dumps(feature_list)
                model_type = round(random.random()+1)
                comp_filter = ml_models.models.CompetitionModel.objects.filter(features=feature_list,
                            competition_no=2, model_type=model_type,
                            train_test_split=train_test_split_2)
                if not comp_filter.exists():
                    c_model_2 = ml_models.models.CompetitionModel.objects.create(status_cd = 1, competition_no=2,model_type=model_type,
                        features=feature_list)
                    c_model_2.train()
                    num_not_found += 1
                else:
                    c_model_2 = comp_filter[0]
                    num_found += 1
                    max_cached_length = max(feature_len, max_cached_length)

                sub = Submission.objects.create(participant=p, competition_model=c_model_2,competition_no=2,model_type=model_type)
                if random.random() < 0.5:
                    p.final_submission_2 = sub
                    p.save()
    return Response(status=status.HTTP_200_OK)
