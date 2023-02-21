import ml_models
import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), '../../MLTools'))

from ml_tools import data_load, model_export

def populate_features():
    ml_models.models.Feature.populate(data_load.CommunityViolations())
