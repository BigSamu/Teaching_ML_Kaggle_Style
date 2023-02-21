#############################################################
#                                                           #
#     test_db.py -                                          # 
#        Unit testing and stress testing of database        #
#                                                           #
#     Written by Matthew Sheldon, Stefan Tionanda           #
#                & Ben Szekeres                             #
#############################################################

import unittest
from django.test import TestCase
from classroom.models import Cohort

"""Copied from https://docs.djangoproject.com/en/3.1/topics/testing/overview/:
If your tests rely on database access such as creating or querying models, 
be sure to create your test classes as subclasses of django.test.TestCase rather than unittest.TestCase.
Using unittest.TestCase avoids the cost of running each test in a transaction and flushing the database,
but if your tests interact with the database their behavior will vary based on the order that the test runner executes them.
This can lead to unit tests that pass when run in isolation but fail when run in a suite.
"""

class canHandleManyRequests(TestCase):
    def setUp(self):
        self.cohort_list = []
        for i in range(100):
            self.cohort = Cohort(name="Cohort"+str(i), competition_1_access=True, competition_2_access=True, is_active=True)
            self.cohort_list.append(self.cohort)
            self.cohort.save()

    def test(self):
        for i in range(len(self.cohort_list)):
            self.assertEqual(self.cohort_list[i].name, "Cohort"+str(i))
    
