from django.urls import path
from . import views

urlpatterns = [
    # Web views
    path('', views.career_planning_dashboard, name='career_planning_dashboard'),
    path('generate/', views.generate_career_plan, name='generate_career_plan'),
    path('plan/<int:plan_id>/', views.career_plan_detail, name='career_plan_detail'),
    
    # API endpoints
    path('api/learning-item/<int:item_id>/status/', views.update_learning_item_status, name='update_learning_item_status'),
    path('api/skill-gap/<int:skill_id>/progress/', views.update_skill_progress, name='update_skill_progress'),
    path('api/plan/<int:plan_id>/', views.get_career_plan_api, name='get_career_plan_api'),
]
