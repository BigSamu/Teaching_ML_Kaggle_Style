#############################################################
#                                                           #
#     model_export.py -                                     #
#        Tools for exporting models in json format          #
#                                                           #
#     Written by Matthew Sheldon & Stefan Tionanda          #
#                                                           #
#############################################################

import sklearn as skl
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression
import json
import numpy as np

def numpy_to_standard_types(n):
    if type(n) == np.int64:
        return int(n)
    else:
        return n

def build_tree_dict(tree_data, root_node, features):
    """build_tree_dict -

        Input:
            tree_data (skl.tree._tree.Tree): _tree object to traverse
            root_node (int): index of the root node
            features  (list of str): column labels for each feature.
        
        Returns:
            (dict): dictionary representation of the tree.
    """

    out_dic = {}
    if tree_data.feature[root_node] >= 0:
        out_dic["feature"] = features[int(tree_data.feature[root_node])]
        out_dic["threshold"] = float(tree_data.threshold[root_node])
    else:
        out_dic["class"] = int(np.argmax(tree_data.value[root_node][0]))

    left_child  = tree_data.children_left[root_node]
    right_child = tree_data.children_right[root_node]
    if left_child >= 0:
        out_dic["left"] = build_tree_dict(tree_data, left_child, features)
    if right_child >= 0:
        out_dic["right"] = build_tree_dict(tree_data, right_child, features)

    return out_dic


def export_decision_tree(dec_tree, features="imply"):
    """export_decision_tree -

        Input:
            dec_tree (skl.tree.DecisionTreeClassifier): tree to export.
            features (list, optional): list of feature names.
        
        Returns:
            (str): json encoding of dec_tree.
    """

    if type(features) == str:
        if features == "imply":
            features = [i for i in range(0, dec_tree.n_features_)]

    tree_data = dec_tree.tree_

    # Extract data from dec_tree.tree_.
    # All of the following are lists of int
    # -1: this is a leaf

    tree_dic = {}

    # find the root
    root_node = -1
    all_children = set(tree_data.children_left).union(set(tree_data.children_right))
    for i in range(0, len(tree_data.children_left)):
        if i not in all_children:
            root_node = i
            break
    
    tree_dic["root"] = build_tree_dict(tree_data, root_node, features)

    return json.dumps(tree_dic)

def export_logistic_regression(logreg_object, features="imply"):
    """export_logistic_regression -

        Input:
            logreg_object (skl.linear_model.LogisticRegression):
                    sklearn object for logistic regression model
            features (list, optional): list of feature names.
        
        Returns:
            (str): json encoding of logreg_object.
    """
    
    if type(features) == str:
        if features == "imply":
            features = [i for i in range(len(logreg_object.coef_))]
    out_dic = {
        "coefs": {
            name: numpy_to_standard_types(val) for name, val 
                in zip(features,logreg_object.coef_[0,:])
        },
        "intercept": numpy_to_standard_types(logreg_object.intercept_[0])
    }

    return json.dumps(out_dic)