from django.contrib import admin
from .models import CVUpload, CareerQuestion, UserResponse


@admin.register(CVUpload)
class CVUploadAdmin(admin.ModelAdmin):
    list_display = ['user', 'original_filename', 'uploaded_at', 'current_role', 'experience_years']
    list_filter = ['uploaded_at', 'experience_years', 'education_level']
    search_fields = ['user__username', 'original_filename', 'current_role']
    readonly_fields = ['uploaded_at', 'extracted_text', 'ai_analysis']


@admin.register(CareerQuestion)
class CareerQuestionAdmin(admin.ModelAdmin):
    list_display = ['question_text', 'question_type', 'is_active', 'order']
    list_filter = ['question_type', 'is_active']
    search_fields = ['question_text']
    ordering = ['order', 'id']


@admin.register(UserResponse)
class UserResponseAdmin(admin.ModelAdmin):
    list_display = ['user', 'question', 'response_date']
    list_filter = ['response_date', 'question__question_type']
    search_fields = ['user__username', 'question__question_text', 'response_text']
    readonly_fields = ['response_date']
