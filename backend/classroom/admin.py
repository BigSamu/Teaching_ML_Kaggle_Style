from django.contrib import admin

from .models import *

# Register your models here.
admin.site.register(Cohort)
admin.site.register(Participant)
admin.site.register(Submission)