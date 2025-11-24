from django.db import models
from django.contrib.auth.models import User


class CareerPlan(models.Model):
    """Model to store user's career development plan"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='career_plans')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    # AI-generated content
    career_goals = models.JSONField(default=list, blank=True)
    skill_gaps = models.JSONField(default=list, blank=True)
    learning_path = models.JSONField(default=list, blank=True)
    timeline = models.JSONField(default=dict, blank=True)
    recommendations = models.JSONField(default=list, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.title}"


class LearningItem(models.Model):
    """Model to store individual learning items in the career plan"""
    career_plan = models.ForeignKey(CareerPlan, on_delete=models.CASCADE, related_name='learning_items')
    title = models.CharField(max_length=200)
    description = models.TextField()
    item_type = models.CharField(max_length=50, choices=[
        ('course', 'Course'),
        ('certification', 'Certification'),
        ('practice', 'Practice Project'),
        ('reading', 'Reading Material'),
        ('workshop', 'Workshop'),
        ('mentorship', 'Mentorship'),
    ])
    duration = models.CharField(max_length=50)  # e.g., "4 weeks", "2 months"
    priority = models.CharField(max_length=20, choices=[
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
    ])
    status = models.CharField(max_length=20, choices=[
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('paused', 'Paused'),
    ], default='not_started')
    order = models.IntegerField(default=0)
    
    # Optional fields
    url = models.URLField(blank=True, null=True)
    cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    
    class Meta:
        ordering = ['order', 'id']
    
    def __str__(self):
        return f"{self.career_plan.title} - {self.title}"


class SkillGap(models.Model):
    """Model to track skill gaps and development progress"""
    career_plan = models.ForeignKey(CareerPlan, on_delete=models.CASCADE, related_name='skill_gap_objects')
    skill_name = models.CharField(max_length=100)
    current_level = models.CharField(max_length=20, choices=[
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
        ('expert', 'Expert'),
    ])
    target_level = models.CharField(max_length=20, choices=[
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
        ('expert', 'Expert'),
    ])
    priority = models.CharField(max_length=20, choices=[
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
    ])
    progress_percentage = models.IntegerField(default=0)
    notes = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-priority', 'skill_name']
    
    def __str__(self):
        return f"{self.skill_name} ({self.current_level} → {self.target_level})"


class CareerMilestone(models.Model):
    """Model to track career milestones and achievements"""
    career_plan = models.ForeignKey(CareerPlan, on_delete=models.CASCADE, related_name='milestones')
    title = models.CharField(max_length=200)
    description = models.TextField()
    milestone_type = models.CharField(max_length=50, choices=[
        ('skill_development', 'Skill Development'),
        ('certification', 'Certification'),
        ('project_completion', 'Project Completion'),
        ('job_change', 'Job Change'),
        ('promotion', 'Promotion'),
        ('networking', 'Networking Achievement'),
        ('other', 'Other'),
    ])
    target_date = models.DateField()
    completed_date = models.DateField(null=True, blank=True)
    is_completed = models.BooleanField(default=False)
    notes = models.TextField(blank=True)
    
    class Meta:
        ordering = ['target_date']
    
    def __str__(self):
        return f"{self.title} - {self.target_date}"
