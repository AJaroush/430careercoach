from django.db import models
from django.contrib.auth.models import User


class CVUpload(models.Model):
    """Model to store uploaded CV files and their analysis"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cv_uploads')
    file = models.FileField(upload_to='cvs/')
    original_filename = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    # Analysis results
    extracted_text = models.TextField(blank=True, null=True)
    skills = models.JSONField(default=list, blank=True)
    experience_years = models.IntegerField(null=True, blank=True)
    education_level = models.CharField(max_length=100, blank=True, null=True)
    current_role = models.CharField(max_length=200, blank=True, null=True)
    industries = models.JSONField(default=list, blank=True)
    
    # AI Analysis
    ai_analysis = models.JSONField(default=dict, blank=True)
    strengths = models.JSONField(default=list, blank=True)
    areas_for_improvement = models.JSONField(default=list, blank=True)
    
    class Meta:
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.original_filename}"


class CareerQuestion(models.Model):
    """Model to store career-related questions for personalization"""
    question_text = models.TextField()
    question_type = models.CharField(max_length=50, choices=[
        ('career_goals', 'Career Goals'),
        ('skills_interests', 'Skills & Interests'),
        ('experience_level', 'Experience Level'),
        ('industry_preference', 'Industry Preference'),
        ('work_environment', 'Work Environment'),
    ])
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['order', 'id']
    
    def __str__(self):
        return f"{self.question_type}: {self.question_text[:50]}..."


class UserResponse(models.Model):
    """Model to store user responses to career questions"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='career_responses')
    question = models.ForeignKey(CareerQuestion, on_delete=models.CASCADE)
    response_text = models.TextField()
    response_date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'question']
        ordering = ['-response_date']
    
    def __str__(self):
        return f"{self.user.username} - {self.question.question_type}"
