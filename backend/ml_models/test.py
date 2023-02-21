#############################################################
#                                                           #
#     test_views.py -                                       #
#        Corresponding test for ml_models.views             #
#                                                           #
#     Written by Matthew Sheldon                            #
#                                                           #
#############################################################


import json
from http import HTTPStatus
from os.path import join
import random
from datetime import datetime as dtn

from django.conf import settings
from django.contrib.auth.models import User
from django.test import RequestFactory, TestCase, SimpleTestCase
from rest_framework.test import APIClient, force_authenticate

from classroom.models import *
from classroom.views import *
from ml_models.models import *
from ml_models.views import *

from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import confusion_matrix
import statsmodels.api as sm

import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), '../../MLTools'))

from ml_tools import data_load, model_export

class FeatureTestCase(TestCase):
    def test_populate(self):
        Feature.populate(data_load.CommunityViolations())
        all_features = Feature.objects.all()
        all_feature_names = [f.name for f in all_features]
        self.assertIn("PolicCars", all_feature_names)
        self.assertIn("LandArea", all_feature_names)
        self.assertIn("agePct12t21", all_feature_names)
        self.assertIn("numbUrban", all_feature_names)
        self.assertIn("pctWRetire", all_feature_names)
        self.assertTrue(len(all_feature_names) > 90)

        # populate is idempotent
        Feature.populate(data_load.CommunityViolations())
        all_features = Feature.objects.all()
        all_feature_names_2 = [f.name for f in all_features]
        self.assertEqual(len(all_feature_names), len(all_feature_names_2))
        self.assertEqual(all_feature_names[0], all_feature_names_2[0])
        self.assertEqual(all_feature_names[-1], all_feature_names_2[-1])
        self.assertEqual(all_feature_names[10], all_feature_names_2[10])

class CompetitionModelTestCase(TestCase):
    def setUp(self):
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

    def test_train_logreg(self):
        self.set_model_lr.train()
        scoring_filter = Scoring.objects.filter(competition_model=self.set_model_lr)
        # assert the existence of train, test, validation scores
        self.assertEqual(len(scoring_filter),3)
        self.assertIsNotNone(self.set_model_lr.serialization)
        self.assertEqual(self.set_model_lr.status_cd, 2)

    def test_train_dtree(self):
        self.set_model_dt.train()
        scoring_filter = Scoring.objects.filter(competition_model=self.set_model_dt)
        # assert the existence of train, test, validation scores
        self.assertEqual(len(scoring_filter),3)
        self.assertIsNotNone(self.set_model_dt.serialization)
        self.assertEqual(self.set_model_dt.status_cd, 2)

    def test_failure(self):
        try:
            self.fail_model.train()
        except Exception:
            self.assertEqual(self.fail_model.status_cd, 3)
            scoring_filter = Scoring.objects.filter(competition_model=self.set_model_lr)
            self.assertEqual(len(scoring_filter), 0)
            return
        # we should have had an exception
        self.assertTrue(False)
    
    def test_score_logreg(self):
        d_set = data_load.CommunityViolations()
        transformer = data_load.DataTransformer(d_set, "larcPerPop", normalize=True)
        transformer.project(self.features)

        ttv = (0.5,0.4,0.1)
        lreg = sm.Logit(transformer.y_train(), transformer.x_train()).fit(method='bfgs', maxiter=(10**10))
        lreg_train_res = confusion_matrix(round(lreg.predict(transformer.x_train())), transformer.y_train())

        self.set_model_lr_2.train()
        train_obj = Scoring.objects.get(competition_model=self.set_model_lr_2, data_type=1)

        self.assertGreaterEqual(train_obj.true_positives, lreg_train_res[1,1]-2)
        self.assertLessEqual(train_obj.true_positives, lreg_train_res[1,1]+2)
        self.assertGreaterEqual(train_obj.false_positives, lreg_train_res[0,1]-2)
        self.assertLessEqual(train_obj.false_positives, lreg_train_res[0,1]+2)

    def test_score_dtree(self):
        d_set = data_load.CommunityViolations()
        transformer = data_load.DataTransformer(d_set, "larcPerPop")
        transformer.project(self.features)

        ttv = (0.5,0.4,0.1)
        lreg = DecisionTreeClassifier()
        lreg.fit(transformer.x_train(), transformer.y_train())
        lreg_train_res = confusion_matrix(lreg.predict(transformer.x_train()), transformer.y_train())

        self.set_model_dt_2.train()
        train_obj = Scoring.objects.get(competition_model=self.set_model_dt_2, data_type=1)

        self.assertAlmostEqual(train_obj.true_positives, lreg_train_res[1,1])
        self.assertAlmostEqual(train_obj.false_positives, lreg_train_res[0,1])

class ViewTest(TestCase):
    def setUp(self):
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
            cohort = self.sample_cohort
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

        self.request_factory = RequestFactory()

    def test_train_model_ls(self):
        all_features = list(data_load.CommunityViolations().pull_data()[0].columns)
        model_features = []
        while len(model_features) < 4:
            sel_feature = random.choice(all_features)
            if sel_feature not in model_features:
                model_features.append(sel_feature)
        model_features = sorted(model_features)
        self.sample_submission_lr.competition_model = CompetitionModel.objects.create(
            competition_no=1,
            model_type=1,
            features=json.dumps(model_features),
            status_cd=1
        )
        
        first_run_time = dtn.now()
        self.request_factory.post("/ml_model/train/{}/".format(self.sample_submission_lr.pk))
        first_run_time = dtn.now() - first_run_time
        self.assertEqual(self.sample_submission_lr.competition_model.status_cd,1)
        self.assertIsNotNone(self.sample_submission_lr.competition_model.serialization)

        # repeated TRAINS shouldn't make a difference at N=4 features
        second_run_time = dtn.now()
        self.request_factory.post("/ml_model/train/{}/".format(self.sample_submission_lr.pk))
        second_run_time = dtn.now() - second_run_time

        self.assertLess(second_run_time, first_run_time*0.75)

    def test_train_model_dt(self):
        all_features = list(data_load.CommunityViolations().pull_data()[0].columns)
        model_features = []
        while len(model_features) < 4:
            sel_feature = random.choice(all_features)
            if sel_feature not in model_features:
                model_features.append(sel_feature)
        model_features = sorted(model_features)
        self.sample_submission_dt.competition_model = CompetitionModel.objects.create(
            competition_no=2,
            model_type=2,
            features=json.dumps(model_features),
            status_cd=1
        )
        
        first_run_time = dtn.now()
        self.request_factory.post("/ml_model/train/{}/".format(self.sample_submission_dt.pk))
        first_run_time = dtn.now() - first_run_time
        self.assertEqual(self.sample_submission_dt.competition_model.status_cd,1)
        self.assertIsNotNone(self.sample_submission_dt.competition_model.serialization)

        # repeated TRAINS shouldn't make a difference at N=4 features
        second_run_time = dtn.now()
        self.request_factory.post("/ml_model/train/{}/".format(self.sample_submission_dt.pk))
        second_run_time = dtn.now() - second_run_time

        self.assertLess(second_run_time, first_run_time*0.75)
    
    def test_make_submission_final(self):
        self.request_factory.post("/ml_model/make_submission_final/{}/".format(self.sample_submission_lr.pk))
        self.request_factory.post("/ml_model/make_submission_final/{}/".format(self.sample_submission_dt.pk))
        self.assertEqual(self.sample_participant.final_submission_1, self.sample_submission_lr.pk)
        self.assertEqual(self.sample_participant.final_submission_2, self.sample_submission_dt.pk)
