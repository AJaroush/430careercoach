from django.contrib import admin
from .models import CareerPlan, LearningItem, SkillGap, CareerMilestone


@admin.register(CareerPlan)
class CareerPlanAdmin(admin.ModelAdmin):
    list_display = ['user', 'title', 'created_at', 'is_active']
    list_filter = ['created_at', 'is_active']
    search_fields = ['user__username', 'title']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(LearningItem)
class LearningItemAdmin(admin.ModelAdmin):
    list_display = ['title', 'career_plan', 'item_type', 'status', 'priority', 'duration']
    list_filter = ['item_type', 'status', 'priority', 'career_plan__user']
    search_fields = ['title', 'description']
    ordering = ['career_plan', 'order']


@admin.register(SkillGap)
class SkillGapAdmin(admin.ModelAdmin):
    list_display = ['skill_name', 'career_plan', 'current_level', 'target_level', 'priority', 'progress_percentage']
    list_filter = ['priority', 'current_level', 'target_level', 'career_plan__user']
    search_fields = ['skill_name', 'notes']


@admin.register(CareerMilestone)
class CareerMilestoneAdmin(admin.ModelAdmin):
    list_display = ['title', 'career_plan', 'milestone_type', 'target_date', 'is_completed']
    list_filter = ['milestone_type', 'is_completed', 'target_date', 'career_plan__user']
    search_fields = ['title', 'description']
