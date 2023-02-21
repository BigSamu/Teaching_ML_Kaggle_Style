#############################################################
#                                                           #
#     unit_test.py -                                        # 
#        Unit testing for ML tooling code                   #
#                                                           #
#     Written by Matthew Sheldon & Stefan Tionanda          #
#                                                           #
#############################################################

import sklearn as skl
from sklearn.datasets import load_iris
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression
import unittest
import json
import pandas
import math

from ml_tools import data_load, model_export

class TestCommunityViolations(unittest.TestCase):
    def setUp(self):
        self.obj = data_load.CommunityViolations()
    
    def test_pull_data(self):
        # pull independent and dependent features
        df_in, df_dep = self.obj.pull_data()
        # no null values should exist
        self.assertFalse((df_in == "?").any(None))
        self.assertFalse((df_dep == "?").any(None))
        
        # make sure the desired dependent variabe is in the right place
        self.assertTrue("larcPerPop" in df_dep.columns)
        self.assertTrue("larcPerPop" not in df_in.columns)

        for col in self.obj.features_to_drop:
            # assert that no features that should be dropped exist in
            #   df_dep and df_in
            self.assertFalse(col in df_dep.columns)
            self.assertFalse(col in df_in.columns)
        
        # 319 entries on both sides
        self.assertEqual(df_dep.shape[0], 319)
        self.assertEqual(df_in.shape[0], 319)

        # 8 dependent features
        self.assertEqual(df_dep.shape[1], 8)

        # 95 independent features
        self.assertEqual(df_in.shape[1], 95)

class TestModelExport(unittest.TestCase):
    def setUp(self):
        self.iris = load_iris()
    
    def assert_dic_almost_equal(self, left, right):
        for k in left.keys():
            if type(left[k]) == list:
                self.assertListEqual(left[k], right[k])
            elif type(left[k]) == dict:
                self.assert_dic_almost_equal(left[k], right[k])
            else:
                self.assertAlmostEqual(left[k], right[k])

    def test_export_decision_tree(self):
        # [ ] Figure out a way to test this more thoroughly
        d_tree = DecisionTreeClassifier(random_state=1)
        d_tree.fit(self.iris.data, self.iris.target)

        export = model_export.export_decision_tree(d_tree)
        export_tree = json.loads(export)
        self.assertTrue("root" in export_tree.keys())
        self.assertTrue(type(export_tree["root"]["left"]) is dict)
    
    def test_export_logistic_regression(self):
        log_reg = LogisticRegression(random_state=1)
        log_reg.fit(self.iris.data, self.iris.target)

        def assertBetween(self, value, min, max):
            self.assertGreaterEqual(value, min)
            self.assertLessEqual(value, max)

        assertBetween(self, json.loads(model_export.export_logistic_regression(log_reg))['coefs']['0'], -0.430, -0.410)
        assertBetween(self, json.loads(model_export.export_logistic_regression(log_reg))['coefs']['1'], 0.960, 0.970)
        assertBetween(self, json.loads(model_export.export_logistic_regression(log_reg))['coefs']['2'],  -2.525, -2.515)
        assertBetween(self, json.loads(model_export.export_logistic_regression(log_reg))['intercept'], 9.800, 9.880)

class TestDataTransformations(unittest.TestCase):
    def setUp(self):
        self.obj = data_load.CommunityViolations()
        df_in, df_dep = self.obj.pull_data()
        self.column_of_interest = "larcPerPop"
        self.data = data_load.DataTransformer(self.obj, self.column_of_interest)
        
    def test_train_test_val_split(self): 
        self.data.generate()
        
        def assertBetween(self, value, min, max):
            self.assertGreaterEqual(value, min)
            self.assertLessEqual(value, max)

        assertBetween(self, len(self.data.x_train()), math.floor(319*0.5), math.ceil(319*0.5))
        assertBetween(self, len(self.data.y_train()), math.floor(319*0.5), math.ceil(319*0.5))
        assertBetween(self, len(self.data.x_test()), math.floor(319*0.4), math.ceil(319*0.4))
        assertBetween(self, len(self.data.y_test()), math.floor(319*0.4), math.ceil(319*0.4))
        assertBetween(self, len(self.data.x_val()), math.floor(319*0.1), math.ceil(319*0.1))
        assertBetween(self, len(self.data.y_val()), math.floor(319*0.1), math.ceil(319*0.1))

        # try another tts
        self.alt_data = data_load.DataTransformer(self.obj, self.column_of_interest, ttv_split=(0.3,0.3,0.4))
        assertBetween(self, len(self.alt_data.x_train()), math.floor(319*0.3), math.ceil(319*0.3))
        assertBetween(self, len(self.alt_data.y_train()), math.floor(319*0.3), math.ceil(319*0.3))
        assertBetween(self, len(self.alt_data.x_test()), math.floor(319*0.3), math.ceil(319*0.3))
        assertBetween(self, len(self.alt_data.y_test()), math.floor(319*0.3), math.ceil(319*0.3))
        assertBetween(self, len(self.alt_data.x_val()), math.floor(319*0.4), math.ceil(319*0.4))
        assertBetween(self, len(self.alt_data.y_val()), math.floor(319*0.4), math.ceil(319*0.4))
    
    def test_seeds(self):
        dt_alt1 = data_load.DataTransformer(self.obj, self.column_of_interest, random_seed=5)
        dt_alt2 = data_load.DataTransformer(self.obj, self.column_of_interest, random_seed=5)
        dt_alt3 = data_load.DataTransformer(self.obj, self.column_of_interest, random_seed=6)
        self.assertEqual(dt_alt1.x_train().iloc[5,5], dt_alt2.x_train().iloc[5,5])
        self.assertEqual(dt_alt1.x_test().iloc[5,5], dt_alt2.x_test().iloc[5,5])
        self.assertEqual(dt_alt1.x_val().iloc[5,5], dt_alt2.x_val().iloc[5,5])
        self.assertNotEqual(dt_alt1.x_train().iloc[5,5], dt_alt3.x_train().iloc[5,5])
    
    def test_project(self):
        dt_alt1 = data_load.DataTransformer(self.obj, self.column_of_interest)
        dt_alt1.project(["agePct65up", "medFamInc"])
        self.assertEqual(len(list(dt_alt1.x_train().columns)), 2)
        dt_alt1.clear()
        self.assertEqual(len(list(dt_alt1.x_train().columns)), 2)

if __name__ == "__main__":
    unittest.main()
    
