#############################################################
#                                                           #
#     data_load.py -                                        #
#        Functions for loading relevant datasets            #
#                                                           #
#     Written by Matthew Sheldon & Stefan Tionanda          #
#                & Ben Szekeres                             #
#                                                           #
#############################################################

import pandas as pd
import numpy  as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing   import StandardScaler

import json
import os

DATA_FOLDER = os.path.join(os.path.dirname(os.path.dirname( __file__ )),"ml_data/")

class CommunityViolations:
    """Class wrapper for the "Community Violiations" dataset
    """
    def __init__(self):
        with open (DATA_FOLDER+"com_viol_features.json") as features_file:
            self.feature_names = json.load(features_file)

        with open(DATA_FOLDER+"features_descriptions", "r") as feature_descriptions_raw: 
            self.feature_descriptions_raw = feature_descriptions_raw
            self.features_dict = {}
        
        self.source_name = "CommunityViolations"
        
        self.features_to_drop = ["racepctblack","racePctWhite","racePctAsian","racePctHisp",
                                "NumImmig","PctImmigRecent","PctImmigRec5","PctImmigRec8",
                                "PctImmigRec10","PctRecentImmig","PctRecImmig5",
                                "PctRecImmig8","PctRecImmig10","PctSpeakEnglOnly",
                                "PctNotSpeakEnglWell","PctForeignBorn","RacialMatchCommPol",
                                "PctPolicWhite","PctPolicBlack","PctPolicHisp","PctPolicAsian",
                                "PctPolicMinor","AsianPerCap","OtherPerCap", "HispPerCap",
                                "whitePerCap","blackPerCap","indianPerCap","rapes","rapesPerPop"]
        
        self.all_dependent_features = ["murders","murdPerPop","robberies","robbbPerPop", 
                                       "assaults","assaultPerPop","burglaries","burglPerPop",
                                       "larcenies","larcPerPop","autoTheft","autoTheftPerPop",
                                       "ViolentCrimesPerPop","nonViolPerPop","arsons", 
                                       "arsonsPerPop"]
        self.qualitative_features = ['communityCode','communityname', 'state', 'fold', 'population', 'countyCode']
        self.dep_to_drop = ["ViolentCrimesPerPop"] # selected for large number of null values

        self.independent_features = [feat for feat in self.feature_names
                                            if (feat not in self.features_to_drop and \
                                                feat not in self.all_dependent_features and \
                                                feat not in self.qualitative_features)]
        # only select dependent features that end in "PerPop"
        self.dependent_features = [c for c in self.all_dependent_features if c[-6:] == "PerPop"]
        # remove any other specified dependent features
        self.dependent_features = [c for c in self.dependent_features if c not in self.dep_to_drop]
        self.data_cache = None
        self.file_name = 'CommViolPredUnnormalizedData.txt'
        self.file_loc = DATA_FOLDER + self.file_name

        feature_names = []
        feature_descriptions = []
        with open(DATA_FOLDER+"features_descriptions", "r") as feature_descriptions_raw: 
            for line in feature_descriptions_raw:
                if not line.strip(): 
                    continue 
                line = line[3:].strip().split("\n")[0].split(":")
                feature_names.append(line[0])
                feature_descriptions.append(line[1].strip())
        self.feature_dict = dict(zip(feature_names, feature_descriptions))
        for feature in self.independent_features:
            if feature not in self.feature_dict.keys():
                self.feature_dict[feature] = ""
        for feature in self.dependent_features:
            if feature not in self.feature_dict.keys():
                self.feature_dict[feature] = ""
    
    def load_data_from_source(self):
        """Load directly from the file. Calls self.clean_data as well."
        """
        unclean_data = pd.read_csv(self.file_loc, names = self.feature_names)
        self.data_cache = self.clean_data(unclean_data)

    def clean_data(self, unclean_data):
        """Takes in an unclean, raw version of the dataset and applies the following:
           - Remove any undesired columns
           - Split the dataset into independent and dependent features
           - Remove any rows with a single null
           Also takes the raw, unclean feature names and descriptions and does the following:
           - Removes empty rows, trailing whitespaces, and unwanted characters (i.e. "--", ":")
           - Appends the cleaned feature names and descriptions to separate lists
           - Zips the lists of names and descriptions and creates a dictionary (name:desctription)
           - Creates and returns a dictionary (name:description) for both dependent/independent data 
        """
        file_root = "".join(self.file_name.split(".")[:-1])
        id_file_name = DATA_FOLDER + file_root + "_independent.csv"
        d_file_name = DATA_FOLDER + file_root + "_dependent.csv"
        if (os.path.isfile(id_file_name) and os.path.isfile(d_file_name)):
            independent_data = pd.read_csv(id_file_name)
            dependent_data = pd.read_csv(d_file_name)
            return [independent_data, dependent_data]
        null_entries = unclean_data[self.independent_features + self.dependent_features] == "?"
        null_entries = null_entries.any(axis=1)
        nnull_entries = ~null_entries
        independent_data = unclean_data[nnull_entries][self.independent_features]
        dependent_data   = unclean_data[nnull_entries][self.dependent_features]

        independent_data.to_csv (id_file_name, index=False)
        dependent_data.to_csv(d_file_name, index=False)
        return [independent_data, dependent_data]

    def pull_data(self):
        """Returns a pandas dataframe of the desired dataset. 
                If the data cache is none, it loads and filters as necessary.
        """
        if not self.data_cache:
            self.load_data_from_source()
        return self.data_cache

class DataTransformer:
    """Object for applying transformations to already cleaned data, to make it more appropriate for our
            ML models. At the moment, this simply returns a train_test_split.
    """
    def __init__(self, data_source, column_of_interest, ttv_split=(0.5,0.4,0.1), random_seed=1, normalize=False):
        self.ttv_split = ttv_split
        self.random_seed = random_seed
        self._x_train = pd.DataFrame()
        self._y_train = pd.DataFrame()
        self._x_test  = pd.DataFrame()
        self._y_test  = pd.DataFrame()
        self._x_val   = pd.DataFrame()
        self._y_val   = pd.DataFrame()

        self.column_of_interest = column_of_interest
        self.normalize = normalize
        
        self.x_data, self.y_data = data_source.pull_data()
        self.x_data = self.enforce_type(self.x_data)
        self.y_data = self.enforce_type(self.y_data)
        self.y_data = self.get_class_var(self.y_data[column_of_interest])

        self.rel_columns = list(self.x_data.columns)

    def enforce_type(self, df):
        """Coerce types accordingly.

            Can update to a proper function if we choose to implement non-numeric data.
        """
        return df.astype("float")

    def get_class_var(self, col_data):
        """Turn a specific pd series/df into a classification variable
        """
        median = col_data.median()
        return col_data.apply(lambda x: 1 if x >= median else 0)
    
    def project(self, columns):
        """Remove all columns except the ones passed.
        """
        self.rel_columns = columns
    
    def clear(self):
        """Clear all generated elements
        """
        self._x_train = pd.DataFrame()
        self._y_train = pd.DataFrame()
        self._x_test  = pd.DataFrame()
        self._y_test  = pd.DataFrame()
        self._x_val   = pd.DataFrame()
        self._y_val   = pd.DataFrame()
    
    def generate(self):
        """Populate train, test, validation datasets for x and y on command.
        """
        x_data = self.x_data
        y_data = self.y_data
        if self.normalize:
            x_data = pd.DataFrame(StandardScaler().fit(x_data).transform(x_data), columns=x_data.columns)
        self._x_train, x, self._y_train, y = train_test_split(x_data, y_data, train_size=self.ttv_split[0], 
                    random_state=self.random_seed)
        # split the remainder between test and validation.
        if self.ttv_split[2] == 0:
            self._x_test = x
            self._y_test = y
            self._x_val = pd.DataFrame(columns = x.columns)
            self._y_val = pd.Series()
        else:
            test_percentage = (self.ttv_split[1])/(1-self.ttv_split[0])
            self._x_test, self._x_val, self._y_test, self._y_val = train_test_split(x, y, train_size=test_percentage, 
                        random_state=self.random_seed+1)
    
    def x_train(self):
        if self._x_train.empty:
            self.generate()
        return self._x_train[self.rel_columns]

    def y_train(self):
        if self._y_train.empty:
            self.generate()
        return self._y_train

    def x_test(self):
        if self._x_test.empty:
            self.generate()
        return self._x_test[self.rel_columns]

    def y_test(self):
        if self._y_test.empty:
            self.generate()
        return self._y_test

    def x_val(self):
        if self._x_val.empty:
            self.generate()
        return self._x_val[self.rel_columns]

    def y_val(self):
        if self._y_val.empty:
            self.generate()
        return self._y_val
