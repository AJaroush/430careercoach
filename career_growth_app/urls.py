"""
URL configuration for career_growth_app project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/cv/', include('cv_analysis.urls')),
    path('api/career/', include('career_planning.urls')),
    path('api/progress/', include('progress_tracking.urls')),
    path('api/users/', include('user_management.urls')),
    path('', include('cv_analysis.urls')),  # Main app URLs
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
