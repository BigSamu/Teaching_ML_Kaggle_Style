import json

from rest_framework import status
from rest_framework.test import APITestCase

from classroom.models import *
from classroom.views import *
from django.contrib.auth.models import User
from ml_models.models import *
from ml_models.views import *

import random

class TestViewsets(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="john", email="jlennon@beatles.com", password="glass onion"
        )

        all_features = list(data_load.CommunityViolations().pull_data()[0].columns)
        self.features = []
        while len(self.features) < 4:
            sel_feature = random.choice(all_features)
            if sel_feature not in self.features:
                self.features.append(sel_feature)
        
        self.set_model_lr = CompetitionModel.objects.create(
            status_cd=1,
            competition_no=1,
            model_type=1,
            features=json.dumps(self.features)
        )
        self.set_model_lr_2 = CompetitionModel.objects.create(
            status_cd=1,
            competition_no=1,
            model_type=1,
            features=json.dumps(self.features)
        )
        self.fail_model = CompetitionModel.objects.create(
            status_cd=1,
            competition_no=1,
            model_type=1,
            features=""
        )
        self.set_model_dt = CompetitionModel.objects.create(
            status_cd=1,
            competition_no=2,
            model_type=2,
            features=json.dumps(self.features)
        )
        self.set_model_dt_2 = CompetitionModel.objects.create(
            status_cd=1,
            competition_no=2,
            model_type=2,
            features=json.dumps(self.features)
        )
        self.sample_cohort = Cohort.objects.create(
            name="Sample",
            competition_1_access=True,
            competition_2_access=True,
            is_active=True
        )
        
        self.sample_participant = Participant.objects.create(
            first_name="John",
            last_name="Doe",
            username="john.doe",
            cohort=self.sample_cohort,
        )
        self.sample_submission_lr = Submission.objects.create(
            participant=self.sample_participant,
            competition_no=1,
            model_type=1
        )
        self.sample_submission_dt = Submission.objects.create(
            participant=self.sample_participant,
            competition_no=2,
            model_type=2
        )
        self.client.force_authenticate(self.user)

#    def test_train_model(self):
#        response = self.client.post(f"/ml_model/train/{1}/")
#        self.assertEqual(response.status_code, status.HTTP_200_OK)
#
#    def test_scoring(self):
#        response = self.client.get(f"/ml_model/score/{1}/{1}/")
#        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_set_model_type(self):
        response = self.client.post(f"/ml_model/set_model_type/{1}/{1}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

