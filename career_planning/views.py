from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import CareerPlan, LearningItem, SkillGap, CareerMilestone
from cv_analysis.models import CVUpload, UserResponse
from cv_analysis.services import AIAnalysisService
import json


@login_required
def career_planning_dashboard(request):
    """Main career planning dashboard"""
    user_plans = CareerPlan.objects.filter(user=request.user, is_active=True)
    latest_plan = user_plans.first() if user_plans.exists() else None
    
    context = {
        'career_plans': user_plans,
        'latest_plan': latest_plan,
    }
    
    if latest_plan:
        context.update({
            'learning_items': latest_plan.learning_items.all()[:5],
            'skill_gaps': latest_plan.skill_gaps.all()[:5],
            'milestones': latest_plan.milestones.all()[:5],
        })
    
    return render(request, 'career_planning/dashboard.html', context)


@login_required
def generate_career_plan(request):
    """Generate a new career plan based on CV analysis and user responses"""
    # Check prerequisites
    user_cv = CVUpload.objects.filter(user=request.user).order_by('-uploaded_at').first()
    user_responses = UserResponse.objects.filter(user=request.user).exists()
    
    if request.method == 'POST':
        try:
            # Get user's latest CV analysis
            latest_cv = CVUpload.objects.filter(user=request.user).order_by('-uploaded_at').first()
            if not latest_cv:
                messages.error(request, 'Please upload your CV first.')
                return redirect('upload_cv')
            
            # Get user's responses to career questions
            user_responses = UserResponse.objects.filter(user=request.user)
            responses_data = []
            for response in user_responses:
                responses_data.append({
                    'question_type': response.question.question_type,
                    'response_text': response.response_text
                })
            
            # Prepare CV analysis data
            cv_analysis = {
                'skills': latest_cv.skills,
                'experience_years': latest_cv.experience_years,
                'education_level': latest_cv.education_level,
                'current_role': latest_cv.current_role,
                'industries': latest_cv.industries,
                'strengths': latest_cv.strengths,
                'areas_for_improvement': latest_cv.areas_for_improvement,
            }
            
            # Generate career plan using AI
            ai_service = AIAnalysisService()
            plan_data = ai_service.generate_career_plan(cv_analysis, responses_data)
            
            # Create career plan
            career_plan = CareerPlan.objects.create(
                user=request.user,
                title=f"Career Development Plan - {latest_cv.current_role or 'Professional'}",
                description="AI-generated career development plan based on your CV analysis and responses.",
                career_goals=plan_data.get('career_goals', []),
                skill_gaps=plan_data.get('skill_gaps', []),
                learning_path=plan_data.get('learning_path', []),
                timeline=plan_data.get('timeline', {}),
                recommendations=plan_data.get('recommendations', [])
            )
            
            # Create learning items
            for item_data in plan_data.get('learning_path', []):
                LearningItem.objects.create(
                    career_plan=career_plan,
                    title=item_data.get('title', ''),
                    description=item_data.get('description', ''),
                    item_type=item_data.get('type', 'course'),
                    duration=item_data.get('duration', ''),
                    priority=item_data.get('priority', 'medium')
                )
            
            # Create skill gaps
            for gap_data in plan_data.get('skill_gaps', []):
                SkillGap.objects.create(
                    career_plan=career_plan,
                    skill_name=gap_data.get('skill', ''),
                    current_level=gap_data.get('current_level', 'beginner'),
                    target_level=gap_data.get('target_level', 'intermediate'),
                    priority=gap_data.get('priority', 'medium')
                )
            
            messages.success(request, 'Your career plan has been generated successfully!')
            return redirect('career_plan_detail', plan_id=career_plan.id)
            
        except Exception as e:
            messages.error(request, f'Error generating career plan: {str(e)}')
            return redirect('career_planning_dashboard')
    
    return render(request, 'career_planning/generate_plan.html', {
        'user_cv': user_cv,
        'user_responses': user_responses
    })


@login_required
def career_plan_detail(request, plan_id):
    """View detailed career plan"""
    plan = get_object_or_404(CareerPlan, id=plan_id, user=request.user)
    
    context = {
        'plan': plan,
        'learning_items': plan.learning_items.all(),
        'skill_gaps': plan.skill_gaps.all(),
        'milestones': plan.milestones.all(),
    }
    
    return render(request, 'career_planning/plan_detail.html', context)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_learning_item_status(request, item_id):
    """API endpoint to update learning item status"""
    try:
        item = get_object_or_404(LearningItem, id=item_id, career_plan__user=request.user)
        new_status = request.data.get('status')
        
        if new_status in ['not_started', 'in_progress', 'completed', 'paused']:
            item.status = new_status
            item.save()
            
            return Response({
                'success': True,
                'message': 'Status updated successfully',
                'new_status': new_status
            })
        else:
            return Response({
                'success': False,
                'error': 'Invalid status'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_skill_progress(request, skill_id):
    """API endpoint to update skill gap progress"""
    try:
        skill = get_object_or_404(SkillGap, id=skill_id, career_plan__user=request.user)
        progress = request.data.get('progress_percentage')
        
        if progress is not None and 0 <= progress <= 100:
            skill.progress_percentage = progress
            skill.save()
            
            return Response({
                'success': True,
                'message': 'Progress updated successfully',
                'new_progress': progress
            })
        else:
            return Response({
                'success': False,
                'error': 'Invalid progress percentage'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_career_plan_api(request, plan_id):
    """API endpoint to get career plan data"""
    try:
        plan = get_object_or_404(CareerPlan, id=plan_id, user=request.user)
        
        data = {
            'id': plan.id,
            'title': plan.title,
            'description': plan.description,
            'career_goals': plan.career_goals,
            'learning_items': [
                {
                    'id': item.id,
                    'title': item.title,
                    'description': item.description,
                    'type': item.item_type,
                    'duration': item.duration,
                    'priority': item.priority,
                    'status': item.status,
                    'url': item.url,
                    'cost': float(item.cost) if item.cost else None,
                }
                for item in plan.learning_items.all()
            ],
            'skill_gaps': [
                {
                    'id': gap.id,
                    'skill_name': gap.skill_name,
                    'current_level': gap.current_level,
                    'target_level': gap.target_level,
                    'priority': gap.priority,
                    'progress_percentage': gap.progress_percentage,
                }
                for gap in plan.skill_gaps.all()
            ],
            'timeline': plan.timeline,
            'recommendations': plan.recommendations,
        }
        
        return Response(data)
    
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
