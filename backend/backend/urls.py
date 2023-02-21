from django.contrib import admin
from django.urls import include, path, re_path
from django.conf.urls import url
from django.contrib.auth.models import User
from django.contrib.auth import views as auth_views
from django.views.generic import TemplateView

from rest_framework import routers
from rest_framework_jwt.views import obtain_jwt_token
from rest_framework.schemas import get_schema_view

from ml_models import views
import classroom.views
import ml_models.views


cr_router = routers.DefaultRouter()
cr_router.register(r'user', classroom.views.UserViewSet)
cr_router.register(r'participant', classroom.views.ParticipantViewSet)
cr_router.register(r'cohort', classroom.views.CohortViewSet)
cr_router.register(r'submission', classroom.views.SubmissionViewSet)
cr_router.register(r'participant_detail', classroom.views.ParticipantDetailViewSet)
cr_router.register(r'cohort_detail', classroom.views.CohortDetailViewSet)

ml_router = routers.DefaultRouter()
ml_router.register(r'competition_model', ml_models.views.CompetitionModelViewSet)
ml_router.register(r'scoring', ml_models.views.ScoringViewSet)
ml_router.register(r'feature', ml_models.views.FeatureViewSet)
ml_router.register(r'train_test_split', ml_models.views.TrainTestSplitViewSet)

auth_router = routers.DefaultRouter()
auth_router.register(r'user', classroom.views.AuthUserViewSet)

urlpatterns = [
    path('dev_admin/', admin.site.urls),
    path('classroom/', include(cr_router.urls)),
    path('ml_model/', include(ml_router.urls)),
    path('api-auth/default/', include('rest_framework.urls')),
    url('api-auth/token/', obtain_jwt_token),
    path('api-auth/', include(auth_router.urls)),
    path('api-auth/login/', auth_views.LoginView.as_view()),
    path('api-auth/logout/', auth_views.LogoutView.as_view()),
    path('classroom/delete_submissions/', classroom.views.delete_submissions),
    path('classroom/delete_participants/', classroom.views.delete_participants),
    path('classroom/disable_cohorts/', classroom.views.disable_cohorts),
    path('classroom/enable_cohorts/', classroom.views.enable_cohorts),
    path('classroom/delete_cohorts/', classroom.views.delete_cohorts),
    path('classroom/disable_comp_cohorts/<int:competition_no>/', classroom.views.disable_cohort_comp),
    path('classroom/enable_comp_cohorts/<int:competition_no>/', classroom.views.enable_cohort_comp),
    path('classroom/clear_participants/<int:cohort_pk>/', classroom.views.clear_participants_from_cohort),
    path('classroom/clear_submissions/<int:cohort_pk>/', classroom.views.clear_submissions_from_cohort),
    path('classroom/set_train_test_split/<int:cohort_pk>/<int:competition_no>/', classroom.views.set_train_test_split),
    path('classroom/get_scores_for_cohort/<int:cohort_pk>/<int:competition_no>/', classroom.views.get_scores_for_cohort),
    path('classroom/populate_test_data/', classroom.views.populate_test_data),
    path('ml_model/create_submission/<int:participant_pk>/<int:competition_no>/', ml_models.views.create_submission),
    path('ml_model/train/<int:submission_pk>/', ml_models.views.train_model),
    path('ml_model/score/<int:submission_pk>/<int:score_type>/', ml_models.views.get_submission_score),
    path('ml_model/make_submission_final/<int:submission_pk>/', ml_models.views.make_submission_final),
    path('ml_model/latest_sub/<int:participant_pk>/<int:competition_no>/', ml_models.views.get_latest_submission),
    path('ml_model/set_features/<int:submission_pk>/', ml_models.views.set_features),
    path('ml_model/set_model_type/<int:submission_pk>/<int:model_type>/', ml_models.views.set_model_type),
    path('ml_model/get_model_features/<int:submission_pk>/', ml_models.views.get_model_features),
    path('ml_model/get_serialization/<int:submission_pk>/', ml_models.views.get_serialization),
    path('ml_model/get_visualization/<int:submission_pk>/', ml_models.views.get_visualization),
    path('ml_model/submit_best_model/<int:participant_pk>/<int:competition_no>/<int:data_type>/', ml_models.views.submit_best_model),
    path('ml_model/set_train_submission/<int:submission_pk>/<int:model_type>/', ml_models.views.set_train_submission),
    path('benchmark/data_io/', ml_models.views.data_io_benchmark),
    path('benchmark/base/', ml_models.views.base_benchmark),
    path('swagger-ui/', TemplateView.as_view(
        template_name='swagger-ui.html',
        extra_context={'schema_url':'openapi-schema'}
    ), name='swagger-ui'),
    url(r'^openapi-schema', get_schema_view(
        title='Teaching ML',
        description='API for all things ...',
        version='1.0.0'
    ), name='openapi-schema')
]

