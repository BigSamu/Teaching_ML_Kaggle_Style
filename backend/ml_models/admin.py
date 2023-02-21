from django.contrib import admin

from .models import *

admin.site.register(CompetitionModel)
admin.site.register(Scoring)
admin.site.register(Feature)