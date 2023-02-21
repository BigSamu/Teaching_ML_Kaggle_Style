#############################################################
#                                                           #
#     models.py -                                           #
#        Django models for user-related features            #
#                                                           #
#     Written by Matthew Sheldon, Stefan Tionanda,          #
#                Ben Szekeres, Mia Hulla                    #
#                                                           #
#############################################################

from django.db import models
from django.contrib.auth.models import User

import ml_models.models

class Cohort(models.Model):
    name = models.CharField(max_length=64)
    competition_1_access = models.BooleanField()
    competition_2_access = models.BooleanField()
    is_active = models.BooleanField()
    train_test_split_comp_1  = models.ForeignKey(ml_models.models.TrainTestSplit, 
            null=True, blank=True, related_name="train_test_split_comp_1", on_delete=models.SET_NULL)
    train_test_split_comp_2  = models.ForeignKey(ml_models.models.TrainTestSplit, 
            null=True, blank=True, related_name="train_test_split_comp_2", on_delete=models.SET_NULL)
    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)

class Participant(models.Model):
    first_name = models.CharField(max_length=32)
    last_name = models.CharField(max_length=32)
    username     = models.CharField(max_length=64)
    cohort = models.ForeignKey(Cohort, on_delete=models.CASCADE, related_name="participants")
    final_submission_1 = models.ForeignKey('Submission', on_delete=models.SET_NULL, null=True, blank=True, related_name="participantf1")
    final_submission_2 = models.ForeignKey('Submission', on_delete=models.SET_NULL, null=True, blank=True, related_name="participantf2")
    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)

class Submission(models.Model):
    participant = models.ForeignKey(Participant, on_delete=models.CASCADE)
    competition_model = models.ForeignKey(ml_models.models.CompetitionModel,null=True,blank=True,on_delete=models.SET_NULL)
    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)
    competition_no = models.IntegerField(null=False,choices=[(1, "Competition 1"), (2, "Competition 2")])
    model_type = models.IntegerField(null=False, choices=[(1, "Logistic Regression"), (2, "Decision Tree")], default=1)