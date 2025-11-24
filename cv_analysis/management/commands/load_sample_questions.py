from django.core.management.base import BaseCommand
from cv_analysis.models import CareerQuestion


class Command(BaseCommand):
    help = 'Load sample career questions into the database'

    def handle(self, *args, **options):
        questions_data = [
            {
                'question_text': 'What are your primary career goals for the next 2-3 years?',
                'question_type': 'career_goals',
                'order': 1
            },
            {
                'question_text': 'What specific skills would you like to develop or improve?',
                'question_type': 'skills_interests',
                'order': 2
            },
            {
                'question_text': 'How many years of professional experience do you have?',
                'question_type': 'experience_level',
                'order': 3
            },
            {
                'question_text': 'What industry or field are you most interested in working in?',
                'question_type': 'industry_preference',
                'order': 4
            },
            {
                'question_text': 'What type of work environment do you prefer?',
                'question_type': 'work_environment',
                'order': 5
            },
            {
                'question_text': 'What are your salary expectations for your next role?',
                'question_type': 'career_goals',
                'order': 6
            },
            {
                'question_text': 'Are you interested in leadership or management roles?',
                'question_type': 'career_goals',
                'order': 7
            },
            {
                'question_text': 'What motivates you most in your career?',
                'question_type': 'career_goals',
                'order': 8
            },
            {
                'question_text': 'Do you prefer working independently or in teams?',
                'question_type': 'work_environment',
                'order': 9
            },
            {
                'question_text': 'What are your biggest professional challenges right now?',
                'question_type': 'skills_interests',
                'order': 10
            }
        ]

        created_count = 0
        for question_data in questions_data:
            question, created = CareerQuestion.objects.get_or_create(
                question_text=question_data['question_text'],
                defaults={
                    'question_type': question_data['question_type'],
                    'order': question_data['order'],
                    'is_active': True
                }
            )
            if created:
                created_count += 1

        self.stdout.write(
            self.style.SUCCESS(f'Successfully loaded {created_count} career questions')
        )
