from django.urls import path
from . import views

urlpatterns = [
    # Web views
    path('', views.home, name='home'),
    path('upload-cv/', views.upload_cv, name='upload_cv'),
    path('career-questions/', views.career_questions, name='career_questions'),
    
    # API endpoints
    path('api/analyze/', views.analyze_cv_api, name='analyze_cv_api'),
    path('api/questions/', views.get_career_questions_api, name='get_questions_api'),
    path('api/responses/', views.submit_responses_api, name='submit_responses_api'),
    
    # Public API endpoints (no authentication required)
    path('public/analyze/', views.public_analyze_cv_api, name='public_analyze_cv_api'),
]
