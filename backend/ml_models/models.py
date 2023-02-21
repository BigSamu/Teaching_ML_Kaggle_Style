#############################################################
#                                                           #
#     models.py -                                           #
#        Django models for ML training/scoring              #
#                                                           #
#     Written by Matthew Sheldon & Stefan Tionanda          #
#                & Ben Szekeres                             #
#                                                           #
#############################################################

from django.db import models

from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier, plot_tree
from sklearn.metrics import confusion_matrix
import statsmodels.api as sm
import matplotlib.pyplot as plt
from io import StringIO
import numpy as np
import json
import dill
import unicodedata

import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), '../../MLTools'))

from ml_tools import data_load, model_export

from backend.settings import *


class Feature(models.Model):
    """Feature - 
        Name of each feature in the data.

        Note: will also include a bias term - this is a "feature" that is always equal to 1.
    """
    name = models.CharField(max_length=64, null=False)
    comment = models.CharField(max_length=256, null=True)
    data_source = models.CharField(max_length=64, null=False)

    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)

    @staticmethod
    def populate(data_source):
        """Populate with all known elements in the data.
        """
        all_features = data_source.independent_features
        for feature in all_features:
            if len(Feature.objects.filter(name=feature)) == 0:
                Feature.objects.create(name=feature, 
                                       comment=data_source.feature_dict[feature],
                                       data_source=data_source.source_name)
    
    def __str__(self):
        name = self.name
        if name == "Intercept":
            name = "{INTERCEPT}"
        else:
            name = "[{}]".format(name)
        return name

class Scoring(models.Model):
    """Scoring - 
        Model performance scores for a particular model. Implemented as a confusion matrix.
    """
    competition_model = models.ForeignKey('CompetitionModel', null=False, on_delete=models.CASCADE, related_name="scorings")
    data_type = models.IntegerField(null=False, choices=[(1, "train"), (2, "test"), (3, "validation")])
    true_positives = models.IntegerField()
    false_positives = models.IntegerField()
    true_negatives = models.IntegerField()
    false_negatives = models.IntegerField()

    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)

    def accuracy(self):
        true_res = true_positives + true_negatives
        total = true_res + false_positives + false_negatives
        return true_res/total

class CompetitionModel(models.Model):
    """CompetitionModel - 
        Describes a specific complete Machine Learning model, independent of the user who submitted it.

        Valid for both Logistic Regression and Decision Tree Models
    """
    status_cd = models.IntegerField(null=False, choices=[(1,"Untrained"), (2, "Success"), (3, "Failure")])
    competition_no = models.IntegerField(null=False, choices=[(1, "Competition 1"), (2, "Competition 2")])
    train_test_split = models.ForeignKey('TrainTestSplit', null=True, blank=True, on_delete=models.SET_NULL)
    model_type = models.IntegerField(null=False, choices=[(1, "Logistic Regression"), (2, "Decision Tree")], default=1)
    features   = models.TextField()
    serialization = models.BinaryField()
    viz = models.TextField(null=True)

    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)

    def train(self):
        '''train -
            Loop through each node or log reg tree associated with the model and train accordingly.
        '''
        self.status_cd = 3 # assume failure at first..
        self.save()
        
        if self.train_test_split:
            ttv = (self.train_test_split.train_percentage,
                        self.train_test_split.test_percentage,
                        self.train_test_split.validation_percentage)
        else:
            if self.competition_no == 1:
                ttv = (0.5,0.5,0)
            else:
                ttv = (0.5,0.4,0.1)

        if self.model_type == 1:
            feature_list = json.loads(str(self.features))
            
            if len(feature_list) == 0:
                raise Exception("No features selected")

            cache = ComViolTransformerCache()
            transformer = cache.get_transformer("larcPerPop", ttv,1, normalize=True)
            transformer.project(feature_list)

            lreg = sm.Logit(transformer.y_train(), transformer.x_train()).fit(method='bfgs', maxiter=(10**10))
            self.score(lreg, transformer, pred_transform=round)
            self.serialization = dill.dumps(lreg)
            self.viz = "NOT BUILT"

        elif self.model_type == 2:
            feature_list = json.loads(str(self.features))
            
            if len(feature_list) == 0:
                raise Exception("No features selected")

            d_set = data_load.CommunityViolations()
            transformer = data_load.DataTransformer(d_set, "larcPerPop", ttv_split=ttv)
            transformer.project(feature_list)

            dtree = DecisionTreeClassifier()
            dtree.fit(transformer.x_train(), transformer.y_train())

            self.serialization = dill.dumps(dtree)

            self.score(dtree, transformer)
            self.viz = "NOT BUILT"

        
        self.status_cd = 2
        self.save()
    
    def build_viz(self):
        if self.model_type == 1:
            try:
                self.viz = dill.loads(self.serialization).summary().as_html()
            except:
                self.viz = "(Visualization Failed)"
        elif self.model_type == 2:
            try:
                dtree = dill.loads(self.serialization)
                feature_list = json.loads(str(self.features))
                plt.figure(figsize=(8,8))
                plot_tree(dtree, feature_names=feature_list, class_names=["Low Larceny Rate", "High Larceny Rate"], 
                        label="none", impurity=False)
                img_pipeline = StringIO()
                fig = plt.gcf()
                fig.tight_layout()
                fig.savefig(img_pipeline, format="svg", bbox_inches='tight')
                img_pipeline.seek(0)
                self.viz = img_pipeline.getvalue()
                self.save()
                img_pipeline.close()
            except:
                self.viz = "(Visualization Failed)"

    def score(self, model_obj, data_transformer, pred_transform=(lambda x: x)):
        Scoring.objects.filter(competition_model=self).delete()


        conf_matrices = {
            "train": confusion_matrix(pred_transform(model_obj.predict(data_transformer.x_train())), data_transformer.y_train()),
            "test": confusion_matrix(pred_transform(model_obj.predict(data_transformer.x_test())), data_transformer.y_test()),
        }

        if not data_transformer.x_val().empty:
            conf_matrices["validation"] = confusion_matrix(pred_transform(model_obj.predict(data_transformer.x_val())), data_transformer.y_val())
        else:
            conf_matrices["validation"] = np.array([[0,0],[0,0]])
        for ds_code, ds_name in [(1, "train"), (2, "test"), (3, "validation")]:
            Scoring.objects.create(
                competition_model=self,
                data_type = ds_code,
                true_positives = conf_matrices[ds_name][1,1],
                false_positives = conf_matrices[ds_name][0,1],
                true_negatives = conf_matrices[ds_name][0,0],
                false_negatives = conf_matrices[ds_name][1,0]
            )
    
    def __str__(self):
        return "Model {}".format(self.pk)

class TrainTestSplit(models.Model):
    train_percentage = models.FloatField()
    test_percentage = models.FloatField()
    validation_percentage = models.FloatField()
