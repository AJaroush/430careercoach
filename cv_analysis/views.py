from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
import json
import os
import tempfile
from .models import CVUpload, CareerQuestion, UserResponse
from .services import CVAnalysisService, AIAnalysisService


def home(request):
    """Main landing page"""
    return render(request, 'cv_analysis/home.html')


@login_required
def upload_cv(request):
    """CV upload page"""
    if request.method == 'POST':
        file = request.FILES.get('cv_file')
        if file:
            # Save the file
            cv_upload = CVUpload.objects.create(
                user=request.user,
                file=file,
                original_filename=file.name
            )
            
            # Process the CV
            analysis_service = CVAnalysisService()
            try:
                analysis_result = analysis_service.analyze_cv(cv_upload.file.path)
                
                # Update the CV upload with analysis results
                cv_upload.extracted_text = analysis_result.get('text', '')
                cv_upload.skills = analysis_result.get('skills', [])
                cv_upload.experience_years = analysis_result.get('experience_years')
                cv_upload.education_level = analysis_result.get('education_level')
                cv_upload.current_role = analysis_result.get('current_role')
                cv_upload.industries = analysis_result.get('industries', [])
                cv_upload.save()
                
                messages.success(request, 'CV uploaded and analyzed successfully!')
                return redirect('career_questions')
            except Exception as e:
                messages.error(request, f'Error analyzing CV: {str(e)}')
                return redirect('upload_cv')
        else:
            messages.error(request, 'Please select a file to upload.')
    
    return render(request, 'cv_analysis/upload_cv.html')


@login_required
def career_questions(request):
    """Career personalization questions page"""
    questions = CareerQuestion.objects.filter(is_active=True).order_by('order')
    
    if request.method == 'POST':
        # Save user responses
        for question in questions:
            response_key = f'question_{question.id}'
            response_text = request.POST.get(response_key)
            if response_text:
                UserResponse.objects.update_or_create(
                    user=request.user,
                    question=question,
                    defaults={'response_text': response_text}
                )
        
        messages.success(request, 'Your responses have been saved!')
        return redirect('career_planning_dashboard')
    
    return render(request, 'cv_analysis/career_questions.html', {
        'questions': questions
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def analyze_cv_api(request):
    """API endpoint for CV analysis"""
    try:
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Save the file temporarily
        cv_upload = CVUpload.objects.create(
            user=request.user,
            file=file,
            original_filename=file.name
        )
        
        # Analyze the CV
        analysis_service = CVAnalysisService()
        analysis_result = analysis_service.analyze_cv(cv_upload.file.path)
        
        # Update the CV upload with results
        cv_upload.extracted_text = analysis_result.get('text', '')
        cv_upload.skills = analysis_result.get('skills', [])
        cv_upload.experience_years = analysis_result.get('experience_years')
        cv_upload.education_level = analysis_result.get('education_level')
        cv_upload.current_role = analysis_result.get('current_role')
        cv_upload.industries = analysis_result.get('industries', [])
        cv_upload.save()
        
        return Response({
            'success': True,
            'analysis': analysis_result,
            'cv_id': cv_upload.id
        })
    
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_career_questions_api(request):
    """API endpoint to get career questions"""
    questions = CareerQuestion.objects.filter(is_active=True).order_by('order')
    questions_data = []
    
    for question in questions:
        questions_data.append({
            'id': question.id,
            'text': question.question_text,
            'type': question.question_type,
            'order': question.order
        })
    
    return Response({'questions': questions_data})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_responses_api(request):
    """API endpoint to submit career question responses"""
    try:
        responses = request.data.get('responses', [])
        
        for response_data in responses:
            question_id = response_data.get('question_id')
            response_text = response_data.get('response_text')
            
            if question_id and response_text:
                question = CareerQuestion.objects.get(id=question_id)
                UserResponse.objects.update_or_create(
                    user=request.user,
                    question=question,
                    defaults={'response_text': response_text}
                )
        
        return Response({'success': True, 'message': 'Responses saved successfully'})
    
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def public_analyze_cv_api(request):
    """Public API endpoint for CV analysis and course recommendations (no auth required)"""
    try:
        file = request.FILES.get('file')
        target_job = request.data.get('target_job', '')
        
        if not file:
            return Response({
                'success': False,
                'error': 'No file provided'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Save file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.name)[1]) as tmp_file:
            for chunk in file.chunks():
                tmp_file.write(chunk)
            tmp_file_path = tmp_file.name
        
        try:
            # Analyze the CV
            analysis_service = CVAnalysisService()
            analysis_result = analysis_service.analyze_cv(tmp_file_path)
            
            # Generate course recommendations using AI web search
            ai_service = AIAnalysisService()
            recommendations = ai_service.search_and_recommend_courses(
                analysis_result, 
                target_job
            )
            
            # Fallback to static recommendations if AI search fails
            if not recommendations or len(recommendations) == 0:
                recommendations = generate_course_recommendations(analysis_result, target_job)
            
            return Response({
                'success': True,
                'analysis': {
                    'skills': analysis_result.get('skills', []),
                    'strengths': analysis_result.get('strengths', []),
                    'areas_for_improvement': analysis_result.get('areas_for_improvement', []),
                    'experience_years': analysis_result.get('experience_years'),
                    'current_role': analysis_result.get('current_role'),
                    'summary': analysis_result.get('summary', ''),
                },
                'recommendations': recommendations
            })
        
        finally:
            # Clean up temporary file
            if os.path.exists(tmp_file_path):
                os.unlink(tmp_file_path)
    
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def generate_course_recommendations(analysis: dict, target_job: str) -> list:
    """Generate course recommendations based on CV analysis"""
    # Course catalog with skills mapping
    course_catalog = [
        {
            'id': '1',
            'title': 'React for Beginners',
            'provider': 'Coursera',
            'url': 'https://coursera.org',
            'skills': ['react', 'javascript', 'frontend', 'hooks'],
            'level': 'Beginner',
            'duration': '12h',
            'rating': 4.8,
            'price': 'Free',
            'isFree': True,
            'description': 'Learn React from scratch with hands-on projects and real-world examples.'
        },
        {
            'id': '2',
            'title': 'Advanced React Patterns',
            'provider': 'Udemy',
            'url': 'https://udemy.com',
            'skills': ['react', 'hooks', 'performance', 'patterns'],
            'level': 'Advanced',
            'duration': '15h',
            'rating': 4.9,
            'price': '$89.99',
            'isFree': False,
            'description': 'Master advanced React patterns and optimization techniques.'
        },
        {
            'id': '3',
            'title': 'Data Structures in Python',
            'provider': 'edX',
            'url': 'https://edx.org',
            'skills': ['python', 'algorithms', 'data structures'],
            'level': 'Intermediate',
            'duration': '8h',
            'rating': 4.7,
            'price': 'Free',
            'isFree': True,
            'description': 'Comprehensive guide to data structures and algorithms in Python.'
        },
        {
            'id': '4',
            'title': 'Machine Learning Foundations',
            'provider': 'Coursera',
            'url': 'https://coursera.org',
            'skills': ['ml', 'python', 'machine learning'],
            'level': 'Beginner',
            'duration': '20h',
            'rating': 4.6,
            'price': '$49.99',
            'isFree': False,
            'description': 'Introduction to machine learning concepts and applications.'
        },
        {
            'id': '5',
            'title': 'DevOps Essentials',
            'provider': 'Udacity',
            'url': 'https://udacity.com',
            'skills': ['devops', 'ci/cd', 'docker', 'deployment'],
            'level': 'Intermediate',
            'duration': '16h',
            'rating': 4.5,
            'price': 'Free',
            'isFree': True,
            'description': 'Learn DevOps practices and tools for modern software development.'
        },
        {
            'id': '6',
            'title': 'AWS Cloud Practitioner',
            'provider': 'AWS Training',
            'url': 'https://aws.amazon.com',
            'skills': ['aws', 'cloud', 'certification', 'infrastructure'],
            'level': 'Beginner',
            'duration': '10h',
            'rating': 4.8,
            'price': 'Free',
            'isFree': True,
            'description': 'Prepare for the AWS Cloud Practitioner certification exam.'
        },
        {
            'id': '7',
            'title': 'JavaScript Mastery',
            'provider': 'Udemy',
            'url': 'https://udemy.com',
            'skills': ['javascript', 'es6', 'async', 'programming'],
            'level': 'Intermediate',
            'duration': '18h',
            'rating': 4.9,
            'price': '$79.99',
            'isFree': False,
            'description': 'Master modern JavaScript including ES6+, async/await, and advanced patterns.'
        },
        {
            'id': '8',
            'title': 'TypeScript Fundamentals',
            'provider': 'Pluralsight',
            'url': 'https://pluralsight.com',
            'skills': ['typescript', 'javascript', 'type safety'],
            'level': 'Intermediate',
            'duration': '10h',
            'rating': 4.7,
            'price': 'Free',
            'isFree': True,
            'description': 'Learn TypeScript from the ground up with practical examples.'
        },
        {
            'id': '9',
            'title': 'Node.js Backend Development',
            'provider': 'Coursera',
            'url': 'https://coursera.org',
            'skills': ['node.js', 'backend', 'api', 'server'],
            'level': 'Advanced',
            'duration': '25h',
            'rating': 4.8,
            'price': '$99.99',
            'isFree': False,
            'description': 'Build scalable backend applications with Node.js and Express.'
        },
        {
            'id': '10',
            'title': 'Docker & Kubernetes',
            'provider': 'Udemy',
            'url': 'https://udemy.com',
            'skills': ['docker', 'kubernetes', 'devops', 'containers'],
            'level': 'Intermediate',
            'duration': '14h',
            'rating': 4.6,
            'price': '$69.99',
            'isFree': False,
            'description': 'Master containerization and orchestration with Docker and Kubernetes.'
        },
    ]
    
    # Extract improvement areas and skills from analysis
    # Handle both dict format (new) and string format (old)
    improvement_areas_raw = analysis.get('areas_for_improvement', [])
    improvement_areas = []
    for area in improvement_areas_raw:
        if isinstance(area, dict):
            # Extract title and description from dict format
            title = area.get('title', '').lower()
            description = area.get('description', '').lower()
            improvement_areas.append(title)
            # Also extract keywords from description
            improvement_areas.extend([word.lower() for word in description.split() if len(word) > 3])
        elif isinstance(area, str):
            improvement_areas.append(area.lower())
    
    existing_skills = [skill.lower() if isinstance(skill, str) else str(skill).lower() for skill in analysis.get('skills', [])]
    
    # Score courses based on relevance
    scored_courses = []
    for course in course_catalog:
        score = 0
        course_skills = [s.lower() for s in course['skills']]
        
        # Highest priority: courses that match improvement areas
        for area in improvement_areas:
            area_words = [w for w in area.split() if len(w) > 3]  # Only meaningful words
            for word in area_words:
                # Check if any course skill contains this improvement word
                if any(word in skill for skill in course_skills):
                    score += 5  # High score for matching improvement areas
                # Also check course title and description
                if word in course['title'].lower() or word in course['description'].lower():
                    score += 3
        
        # High priority: courses that match existing skills (to build on them)
        for skill in existing_skills:
            # Exact match gets highest score
            if skill in course_skills:
                score += 4
            # Partial match
            elif any(skill in cs or cs in skill for cs in course_skills):
                score += 2
            # Check title/description
            if skill in course['title'].lower() or skill in course['description'].lower():
                score += 1
        
        # Boost score if target job matches course skills
        if target_job:
            target_lower = target_job.lower()
            target_keywords = [w for w in target_lower.split() if len(w) > 3]
            for keyword in target_keywords:
                if any(keyword in skill for skill in course_skills):
                    score += 3
                if keyword in course['title'].lower():
                    score += 2
        
        scored_courses.append({
            **course,
            'relevance_score': score
        })
    
    # Sort by relevance score (highest first) and return top recommendations
    scored_courses.sort(key=lambda x: x['relevance_score'], reverse=True)
    
    # Return top 10 courses, but prioritize those with score > 0
    top_courses = [c for c in scored_courses if c['relevance_score'] > 0][:10]
    
    # If no high-scoring courses, return courses that match target job or general recommendations
    if not top_courses:
        if target_job:
            target_lower = target_job.lower()
            top_courses = [
                c for c in scored_courses 
                if any(skill in target_lower for skill in [s.lower() for s in c['skills']])
            ][:6]
        
        if not top_courses:
            top_courses = scored_courses[:6]
    
    # Remove relevance_score from final output
    for course in top_courses:
        course.pop('relevance_score', None)
    
    return top_courses
