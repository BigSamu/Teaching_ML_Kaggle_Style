#############################################################
#                                                           #
#     serializers.py -                                      #
#        DJF Serializers for serializer models              #
#                                                           #
#     Written by Matthew Sheldon & Stefan Tionanda          #
#                                                           #
#############################################################

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *

import ml_models.serializers

class AuthUserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ("pk","url", "username", "password")

    def create(self, validated_data):
        user = User.objects.create_user(username=validated_data["username"],**validated_data)
        return user

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ("pk","url", "username", "username")

class CohortSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Cohort
        fields = ("pk","url","name","is_active","competition_1_access","competition_2_access","created_date", "modified_date")

class ParticipantSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Participant
        fields = ("pk","url","username","first_name","last_name","cohort","final_submission_1","final_submission_2","created_date", "modified_date")

class SubmissionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Submission
        fields = ("pk","url","participant", "competition_model","competition_no","model_type",
                  "created_date", "modified_date")

class SubmissionDetailSerializer(serializers.ModelSerializer):
    competition_model = ml_models.serializers.CompetitionModelDetailSerializer(read_only=True)
    class Meta:
        model = Submission
        fields = ("pk","url","participant", "competition_model","competition_no","model_type",
                  "created_date", "modified_date")

class ParticipantDetailSerializer(serializers.ModelSerializer):
    final_submission_1 = SubmissionDetailSerializer(read_only=True)
    final_submission_2 = SubmissionDetailSerializer(read_only=True)
    class Meta:
        model = Participant
        fields = ("pk","url","username","first_name","last_name","cohort","final_submission_1","final_submission_2","created_date", "modified_date")

class CohortDetailSerializer(serializers.ModelSerializer):
    participants = ParticipantDetailSerializer(many=True, read_only=True)
    class Meta:
        model = Cohort
        fields = ("pk","url","name","is_active","competition_1_access",
                  "competition_2_access","participants","created_date", "modified_date")