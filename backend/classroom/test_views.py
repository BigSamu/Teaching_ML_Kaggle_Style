#############################################################
#                                                           #
#     test_views.py -                                       #
#        Corresponding test for classroom.views             #
#                                                           #
#     Written by Matthew Sheldon & Stefan Tionanda          #
#                                                           #
#############################################################


import json

# from http import HTTPStatus
from os.path import join

from django.conf import settings
from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse

from classroom.models import *
from classroom.views import *
from django.contrib.auth.models import User


class TestViewsets(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="john", email="jlennon@beatles.com", password="glass onion"
        )
        self.sample_cohort = Cohort.objects.create(
            name="Sample",
            competition_1_access=True,
            competition_2_access=True,
            is_active=True,
        )
        self.sample_participant = Participant.objects.create(
            first_name="John",
            last_name="Doe",
            username="john.doe",
            cohort=self.sample_cohort,
        )
        self.sample_participant2 = Participant.objects.create(
            first_name="Doe",
            last_name="John",
            username="doe.john",
            cohort=self.sample_cohort,
        )
        self.sample_submission_lr = Submission.objects.create(
            participant=self.sample_participant, competition_no=1, model_type=1
        )
        self.sample_submission_dt = Submission.objects.create(
            participant=self.sample_participant, competition_no=2, model_type=2
        )

        self.client.force_authenticate(self.user)

    def test_disable_cohorts(self):
        response = self.client.post("/classroom/disable_cohorts/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_enable_cohorts(self):
        response = self.client.post("/classroom/enable_cohorts/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_clear_participants_from_cohort(self):
        response = self.client.post(f"/classroom/clear_participants/{1}/")
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)

    def test_clear_submissions_from_cohort(self):
        response = self.client.post(f"/classroom/clear_submissions/{1}/")
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)
    
    def test_disable_cohort_comp(self):
        response1 = self.client.post(f"/classroom/disable_comp_cohorts/{1}/")
        self.assertEqual(response1.status_code, status.HTTP_200_OK)

        response2 = self.client.post(f"/classroom/disable_comp_cohorts/{2}/")
        self.assertEqual(response2.status_code, status.HTTP_200_OK)

        response3 = self.client.post(f"/classroom/disable_comp_cohorts/{3}/")
        self.assertEqual(response3.status_code, status.HTTP_400_BAD_REQUEST)

    def test_enable_cohort_comp(self):
        response1 = self.client.post(f"/classroom/enable_comp_cohorts/{1}/")
        self.assertEqual(response1.status_code, status.HTTP_200_OK)

        response2 = self.client.post(f"/classroom/enable_comp_cohorts/{2}/")
        self.assertEqual(response2.status_code, status.HTTP_200_OK)

        response3 = self.client.post(f"/classroom/enable_comp_cohorts/{3}/")
        self.assertEqual(response3.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_cohorts(self):
        response = self.client.post("/classroom/delete_cohorts/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_participants(self):
        response = self.client.post("/classroom/delete_participants/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_submissions(self):
        response = self.client.post("/classroom/delete_submissions/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

#    def test_set_test_train_split(self):i
#        response1 = self.client.post(f"/classroom/set_train_test_split/{1}/{1}/")
#        self.assertEqual(response1.status_code, status.HTTP_200_OK)
#
#        response2 = self.client.post(f"/classroom/set_train_test_split/{1}/{2}/")
#        self.assertEqual(response2.status_code, status.HTTP_200_OK)
#
#        response3 = self.client.post(f"/classroom/set_train__test_split/{1}/{3}/")
#        self.assertEqual(response3.status_code, status.HTTP_400_BAD_REQUEST)
#
#        Cohort.objects.all().delete()
#        response4 = self.client.post(f"/classroom/set_train_test_split/{10}/{1}/")
#        self.assertEqual(response4.status_code, status.HTTP_404_NOT_FOUND)
#

    def test_get_scores_for_cohort(self):
        response1 = self.client.get(f"/classroom/get_scores_for_cohort/{1}/{1}/")
        self.assertEqual(response1.status_code, status.HTTP_200_OK)

        response2 = self.client.get(f"/classroom/get_scores_for_cohort/{1}/{2}/")
        self.assertEqual(response2.status_code, status.HTTP_200_OK)

        response3 = self.client.get(f"/classroom/get_scores_for_cohort/{1}/{3}/")
        self.assertEqual(response3.status_code, status.HTTP_400_BAD_REQUEST)
        
#        response4 = self.client.get(f"/classroom/get_scores_for_cohort/{10}/{1}/")
#        self.assertEqual(response4.status_code, status.HTTP_404_NOT_FOUND)

    def test_populate_test_data(self):
        response = self.client.post("/classroom/populate_test_data/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    
#    def test_cohort_get(self):
#        response = self.client.get("/classroom/cohort/")
#        print(response.json())

#    def test_participant_patch(self):
#        response = self.client.patch(
#            "/classroom/participant/{}/".format(self.sample_participant.pk),
#            {"first_name": "Doe"},
#            content_type="application/json",
#        )
#        self.assertEqual(response.status_code, status.HTTP_200_OK)
#        self.assertEqual(self.sample_participant.first_name, "Doe")
