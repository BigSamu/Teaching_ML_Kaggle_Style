#############################################################
#                                                           #
#     serializers.py -                                      #
#        DJF Serializers for ML models                      #
#                                                           #
#     Written by Matthew Sheldon & Stefan Tionanda          #
#                                                           #
#############################################################

from rest_framework import serializers
from .models import *

class CompetitionModelSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = CompetitionModel
        fields = ("pk", "url", "status_cd", "competition_no", "model_type",
                  "features", "serialization",
                  "created_date", "modified_date")

class ScoringSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Scoring
        fields = ("pk", "url", "competition_model", "data_type",
                  "true_positives", "false_positives",
                  "true_negatives", "false_negatives", 
                  "created_date", "modified_date")

class ScoringDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scoring
        fields = ("pk", "url", "competition_model", "data_type",
                  "true_positives", "false_positives",
                  "true_negatives", "false_negatives", 
                  "created_date", "modified_date")

class CompetitionModelDetailSerializer(serializers.ModelSerializer):
    scorings = ScoringDetailSerializer(many=True, read_only=True)
    class Meta:
        model = CompetitionModel
        fields = ("pk", "url", "status_cd", "competition_no", "model_type",
                  "features", "scorings",
                  "created_date", "modified_date")

class FeatureSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Feature
        fields = ("pk", "url", "name", "comment", "created_date", "modified_date")
    
class TrainTestSplitSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = TrainTestSplit
        fields = ("pk", "url", "train_percentage", "test_percentage", "validation_percentage")