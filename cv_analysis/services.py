import os
import json
import re
from typing import Dict, List, Any
from django.conf import settings
try:
    import openai
except ImportError:
    openai = None


class CVAnalysisService:
    """Service for analyzing CV files and extracting information"""
    
    def __init__(self):
        self.openai_client = self._setup_openai_client()
    
    def _setup_openai_client(self):
        """Setup OpenAI client with Azure configuration"""
        try:
            if not settings.AZURE_OPENAI_API_KEY or not settings.AZURE_OPENAI_ENDPOINT:
                print("Azure OpenAI credentials not configured, using fallback analysis")
                return None
            
            if not openai:
                print("OpenAI library not available, using fallback analysis")
                return None
            
            # Get API version from settings or use default
            api_version = getattr(settings, 'AZURE_OPENAI_API_VERSION', '2024-12-01-preview')
            
            client = openai.AzureOpenAI(
                api_key=settings.AZURE_OPENAI_API_KEY,
                api_version=api_version,
                azure_endpoint=settings.AZURE_OPENAI_ENDPOINT
            )
            print(f"Azure OpenAI client initialized successfully with API version {api_version}")
            return client
        except Exception as e:
            print(f"Error setting up OpenAI client: {e}")
            import traceback
            traceback.print_exc()
            return None
    
    def extract_text_from_pdf(self, file_path: str) -> str:
        """Extract text from PDF file"""
        try:
            import PyPDF2
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                text = ""
                for page in pdf_reader.pages:
                    text += page.extract_text()
                return text
        except Exception as e:
            print(f"Error extracting PDF text: {e}")
            return ""
    
    def extract_text_from_docx(self, file_path: str) -> str:
        """Extract text from DOCX file"""
        try:
            import docx
            doc = docx.Document(file_path)
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            return text
        except Exception as e:
            print(f"Error extracting DOCX text: {e}")
            return ""
    
    def extract_text(self, file_path: str) -> str:
        """Extract text from various file formats"""
        file_extension = os.path.splitext(file_path)[1].lower()
        
        if file_extension == '.pdf':
            return self.extract_text_from_pdf(file_path)
        elif file_extension in ['.docx', '.doc']:
            return self.extract_text_from_docx(file_path)
        else:
            # Try to read as plain text
            try:
                with open(file_path, 'r', encoding='utf-8') as file:
                    return file.read()
            except:
                return ""
    
    def analyze_with_ai(self, text: str) -> Dict[str, Any]:
        """Use AI to analyze CV text and extract structured information"""
        if not self.openai_client:
            return self._fallback_analysis(text)
        
        try:
            prompt = f"""
            Analyze the following CV text in detail and extract comprehensive, personalized information. 
            Provide SPECIFIC strengths and weaknesses based on the actual content of this CV.
            
            Return a JSON response with the following structure:
            {{
                "skills": ["skill1", "skill2", ...],
                "experience_years": number,
                "education_level": "Bachelor's/Master's/PhD/etc",
                "current_role": "current job title",
                "industries": ["industry1", "industry2", ...],
                "strengths": [
                    {{
                        "title": "Specific strength title",
                        "description": "Detailed explanation of this strength with evidence from the CV",
                        "evidence": "Specific examples or achievements from CV that demonstrate this strength",
                        "impact": "How this strength benefits their career"
                    }}
                ],
                "areas_for_improvement": [
                    {{
                        "title": "Specific area that needs improvement",
                        "description": "Detailed explanation of why this is a gap based on CV content",
                        "current_state": "What the CV currently shows (or lacks)",
                        "recommendation": "Specific actionable steps to improve this area",
                        "priority": "high/medium/low"
                    }}
                ],
                "summary": "Comprehensive professional summary highlighting key achievements and background"
            }}
            
            IMPORTANT GUIDELINES:
            1. Strengths must be SPECIFIC to this person's CV - cite actual experiences, skills, or achievements
            2. Weaknesses must be IDENTIFIED from what's MISSING or WEAK in the CV - not generic suggestions
            3. Provide DETAILED descriptions with evidence from the CV text
            4. Make recommendations ACTIONABLE and SPECIFIC
            5. Base everything on the actual CV content, not assumptions
            
            CV Text:
            {text}
            """
            
            response = self.openai_client.chat.completions.create(
                model=settings.AZURE_OPENAI_DEPLOYMENT,
                messages=[
                    {"role": "system", "content": "You are an expert CV analyzer and career advisor. Analyze CVs deeply and provide detailed, personalized strengths and weaknesses with specific evidence from the CV. Always return valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=2500
            )
            
            content = response.choices[0].message.content
            print(f"AI Analysis Response: {content[:200]}...")  # Debug log
            
            # Try to parse JSON response
            try:
                result = json.loads(content)
                print(f"AI Analysis parsed successfully: {list(result.keys())}")
                # Normalize the format to ensure detailed structure
                result = self._normalize_analysis_format(result)
                return result
            except json.JSONDecodeError as json_error:
                print(f"Failed to parse AI response as JSON: {json_error}")
                print(f"Raw response: {content}")
                # Try to extract JSON from markdown code blocks
                import re
                json_match = re.search(r'```(?:json)?\s*(\{.*\})\s*```', content, re.DOTALL)
                if json_match:
                    try:
                        result = json.loads(json_match.group(1))
                        result = self._normalize_analysis_format(result)
                        return result
                    except:
                        pass
                return self._fallback_analysis(text)
            
        except Exception as e:
            print(f"Error in AI analysis: {e}")
            import traceback
            traceback.print_exc()
            return self._fallback_analysis(text)
    
    def _fallback_analysis(self, text: str) -> Dict[str, Any]:
        """Fallback analysis using regex patterns when AI is not available"""
        # Basic skill extraction using common patterns
        skills = []
        skill_patterns = [
            r'\b(?:Python|JavaScript|Java|C\+\+|React|Angular|Vue|Node\.js|Django|Flask|Spring|Laravel)\b',
            r'\b(?:SQL|PostgreSQL|MySQL|MongoDB|Redis|Elasticsearch)\b',
            r'\b(?:AWS|Azure|GCP|Docker|Kubernetes|Jenkins|Git)\b',
            r'\b(?:Machine Learning|AI|Data Science|Analytics|Statistics)\b',
            r'\b(?:Project Management|Leadership|Communication|Teamwork)\b'
        ]
        
        for pattern in skill_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            skills.extend(matches)
        
        # Extract experience years
        experience_years = 0
        exp_patterns = [
            r'(\d+)\+?\s*years?\s*(?:of\s*)?experience',
            r'experience\s*:?\s*(\d+)\+?\s*years?'
        ]
        
        for pattern in exp_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                experience_years = int(match.group(1))
                break
        
        # Generate detailed strengths and improvement areas from extracted skills
        strengths = []
        areas_for_improvement = []
        
        if skills:
            # Normalize skills to lowercase for matching
            skills_lower = [s.lower() for s in skills]
            
            # Build detailed strengths based on actual detected skills
            detected_tech = []
            if any('python' in s for s in skills_lower):
                detected_tech.append('Python')
            if any('javascript' in s or 'js' in s for s in skills_lower):
                detected_tech.append('JavaScript')
            if any('react' in s for s in skills_lower):
                detected_tech.append('React')
            if any('java' in s for s in skills_lower):
                detected_tech.append('Java')
            if any('sql' in s or 'database' in s for s in skills_lower):
                detected_tech.append('Database Management')
            if any('docker' in s or 'kubernetes' in s or 'aws' in s or 'azure' in s for s in skills_lower):
                detected_tech.append('Cloud/DevOps')
            
            if detected_tech:
                strengths = [
                    {
                        "title": f"Strong Technical Foundation in {', '.join(detected_tech[:2])}",
                        "description": f"Your CV demonstrates solid expertise in {', '.join(detected_tech[:2])}, which are highly valued in the current job market.",
                        "evidence": f"Skills listed include: {', '.join([s for s in skills if any(tech.lower() in s.lower() for tech in detected_tech[:2])][:3])}",
                        "impact": "These skills position you well for roles requiring modern development practices and technical problem-solving."
                    },
                    {
                        "title": "Problem-Solving and Technical Competence",
                        "description": "Your technical skill set shows ability to work with complex systems and solve challenging problems.",
                        "evidence": f"Experience with {len(skills)} different technologies/skills",
                        "impact": "This versatility makes you adaptable to different projects and technical requirements."
                    }
                ]
            else:
                strengths = [
                    {
                        "title": f"Foundation in {skills[0] if skills else 'Programming'}",
                        "description": f"Your CV shows experience with {skills[0] if skills else 'programming'} and related technologies.",
                        "evidence": f"Skills include: {', '.join(skills[:3])}",
                        "impact": "This provides a solid base for further career development."
                    }
                ]
            
            # Generate detailed improvement areas based on ACTUAL detected skills
            if any('python' in s for s in skills_lower):
                areas_for_improvement = [
                    {
                        "title": "Advanced Python Frameworks and Architecture",
                        "description": "While you have Python skills, your CV doesn't show experience with modern frameworks like Django, FastAPI, or Flask that are essential for backend development roles.",
                        "current_state": "Basic to intermediate Python knowledge demonstrated",
                        "recommendation": "Take courses on Django or FastAPI to build production-ready web applications. Build portfolio projects using these frameworks.",
                        "priority": "high"
                    },
                    {
                        "title": "System Design and Scalability",
                        "description": "Your CV lacks evidence of experience designing scalable systems or working with distributed architectures.",
                        "current_state": "No mention of system design, microservices, or scalability patterns",
                        "recommendation": "Learn system design principles, study distributed systems, and practice designing scalable architectures. Consider courses on system design interviews.",
                        "priority": "high"
                    },
                    {
                        "title": "DevOps and Deployment Practices",
                        "description": "Limited evidence of DevOps knowledge or production deployment experience in your CV.",
                        "current_state": "No mention of CI/CD, containerization, or cloud deployment",
                        "recommendation": "Learn Docker, Kubernetes basics, and CI/CD pipelines. Get hands-on with AWS, Azure, or GCP. Build projects that demonstrate deployment skills.",
                        "priority": "medium"
                    }
                ]
            elif any('react' in s or 'javascript' in s for s in skills_lower):
                areas_for_improvement = [
                    {
                        "title": "Advanced React Patterns and Performance Optimization",
                        "description": "Your CV shows React knowledge but lacks evidence of advanced patterns, performance optimization, or state management expertise.",
                        "current_state": "Basic React skills mentioned",
                        "recommendation": "Master React hooks, context API, performance optimization techniques (memoization, code splitting), and state management libraries (Redux, Zustand). Build complex applications demonstrating these skills.",
                        "priority": "high"
                    },
                    {
                        "title": "System Design and Architecture",
                        "description": "Frontend developers benefit from understanding system architecture and how frontend integrates with backend systems.",
                        "current_state": "No mention of architecture patterns or system design",
                        "recommendation": "Learn frontend architecture patterns, API design, and how to design scalable frontend applications. Study micro-frontends and module federation.",
                        "priority": "medium"
                    },
                    {
                        "title": "Testing and Quality Assurance",
                        "description": "Your CV doesn't mention testing frameworks or quality assurance practices, which are essential for production applications.",
                        "current_state": "No testing experience mentioned",
                        "recommendation": "Learn Jest, React Testing Library, Cypress, or Playwright. Practice writing unit, integration, and E2E tests. Add testing to your projects.",
                        "priority": "high"
                    }
                ]
            else:
                areas_for_improvement = [
                    {
                        "title": "Advanced Programming Patterns and Best Practices",
                        "description": "Your CV shows programming skills but could benefit from demonstrating knowledge of design patterns, clean code principles, and advanced programming concepts.",
                        "current_state": "Basic programming skills demonstrated",
                        "recommendation": "Study design patterns, SOLID principles, and clean code practices. Build projects that showcase these concepts.",
                        "priority": "high"
                    },
                    {
                        "title": "System Design and Architecture",
                        "description": "Understanding how to design and architect systems is crucial for senior roles.",
                        "current_state": "No system design experience mentioned",
                        "recommendation": "Learn system design fundamentals, study how large-scale systems work, and practice designing systems from scratch.",
                        "priority": "high"
                    },
                    {
                        "title": "Testing and Quality Assurance",
                        "description": "Professional development requires strong testing practices.",
                        "current_state": "No testing experience mentioned",
                        "recommendation": "Learn testing frameworks relevant to your tech stack. Practice TDD (Test-Driven Development) and add comprehensive tests to your projects.",
                        "priority": "medium"
                    }
                ]
        
        return {
            "skills": list(set(skills)),
            "experience_years": experience_years,
            "education_level": "Unknown",
            "current_role": "Unknown",
            "industries": [],
            "strengths": strengths if strengths else [
                {
                    "title": "Technical Skills",
                    "description": "Your CV demonstrates technical competency in programming and software development.",
                    "evidence": f"Skills identified: {', '.join(skills[:5]) if skills else 'Various technical skills'}",
                    "impact": "These skills provide a foundation for career growth in technology."
                }
            ],
            "areas_for_improvement": areas_for_improvement if areas_for_improvement else [
                {
                    "title": "Advanced Technical Skills",
                    "description": "Consider developing deeper expertise in specific technologies or frameworks.",
                    "current_state": "Basic to intermediate skills demonstrated",
                    "recommendation": "Focus on mastering one or two technologies deeply, build portfolio projects, and seek advanced courses or certifications.",
                    "priority": "high"
                }
            ],
            "summary": text[:200] + "..." if len(text) > 200 else text
        }
    
    def _normalize_analysis_format(self, analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Normalize strengths and areas_for_improvement to detailed format"""
        # Normalize strengths
        strengths = analysis.get('strengths', [])
        normalized_strengths = []
        for strength in strengths:
            if isinstance(strength, str):
                # Convert simple string to detailed format
                normalized_strengths.append({
                    "title": strength,
                    "description": f"This is a key strength identified from your CV.",
                    "evidence": "Based on CV content analysis",
                    "impact": "This strength enhances your career prospects."
                })
            elif isinstance(strength, dict):
                # Ensure all required fields are present
                normalized_strengths.append({
                    "title": strength.get("title", "Strength"),
                    "description": strength.get("description", strength.get("title", "Strength")),
                    "evidence": strength.get("evidence", "Based on CV analysis"),
                    "impact": strength.get("impact", "This contributes to your professional profile.")
                })
        
        # Normalize areas_for_improvement
        areas = analysis.get('areas_for_improvement', [])
        normalized_areas = []
        for area in areas:
            if isinstance(area, str):
                # Convert simple string to detailed format
                normalized_areas.append({
                    "title": area,
                    "description": f"This area was identified as needing improvement based on your CV.",
                    "current_state": "Not clearly demonstrated in CV",
                    "recommendation": f"Focus on developing skills in {area}.",
                    "priority": "medium"
                })
            elif isinstance(area, dict):
                # Ensure all required fields are present
                normalized_areas.append({
                    "title": area.get("title", "Area for Improvement"),
                    "description": area.get("description", area.get("title", "Area for Improvement")),
                    "current_state": area.get("current_state", "Not clearly demonstrated in CV"),
                    "recommendation": area.get("recommendation", f"Focus on improving {area.get('title', 'this area')}."),
                    "priority": area.get("priority", "medium")
                })
        
        analysis['strengths'] = normalized_strengths if normalized_strengths else analysis.get('strengths', [])
        analysis['areas_for_improvement'] = normalized_areas if normalized_areas else analysis.get('areas_for_improvement', [])
        
        return analysis
    
    def analyze_cv(self, file_path: str) -> Dict[str, Any]:
        """Main method to analyze a CV file"""
        # Extract text
        text = self.extract_text(file_path)
        if not text:
            raise ValueError("Could not extract text from the file")
        
        # Analyze with AI
        analysis = self.analyze_with_ai(text)
        
        return {
            "text": text,
            **analysis
        }


class AIAnalysisService:
    """Service for AI-powered career analysis and recommendations"""
    
    def __init__(self):
        self.openai_client = self._setup_openai_client()
    
    def _setup_openai_client(self):
        """Setup OpenAI client with Azure configuration"""
        try:
            if not settings.AZURE_OPENAI_API_KEY or not settings.AZURE_OPENAI_ENDPOINT:
                print("Azure OpenAI credentials not configured")
                return None
            
            if not openai:
                print("OpenAI library not available")
                return None
            
            api_version = getattr(settings, 'AZURE_OPENAI_API_VERSION', '2024-12-01-preview')
            
            client = openai.AzureOpenAI(
                api_key=settings.AZURE_OPENAI_API_KEY,
                api_version=api_version,
                azure_endpoint=settings.AZURE_OPENAI_ENDPOINT
            )
            return client
        except Exception as e:
            print(f"Error setting up OpenAI client: {e}")
            return None
    
    def search_and_recommend_courses(self, cv_analysis: Dict, target_job: str) -> List[Dict]:
        """Use AI to search and recommend courses based on CV analysis"""
        if not self.openai_client:
            print("OpenAI client not available, using fallback")
            return []
        
        try:
            # Extract key information for course search
            skills = cv_analysis.get('skills', [])
            strengths = cv_analysis.get('strengths', [])
            improvement_areas = cv_analysis.get('areas_for_improvement', [])
            current_role = cv_analysis.get('current_role', '')
            experience_years = cv_analysis.get('experience_years', 0)
            
            prompt = f"""
            You are a career advisor helping someone transition to the role of "{target_job}".
            
            CV Analysis:
            - Current Role: {current_role}
            - Experience: {experience_years} years
            - Existing Skills: {', '.join(skills[:15]) if skills else 'Not specified'}
            - Strengths: {', '.join(strengths[:5]) if strengths else 'Not specified'}
            - Areas for Improvement: {', '.join(improvement_areas[:5]) if improvement_areas else 'Not specified'}
            - TARGET POSITION: {target_job}
            
            CRITICAL: Recommend 10-15 SPECIFIC online courses that are ESSENTIAL for the "{target_job}" role.
            These courses must directly prepare the candidate for this specific position.
            
            Research and recommend REAL courses from platforms like:
            - Coursera (including professional certificates)
            - Udemy
            - edX
            - Pluralsight
            - LinkedIn Learning
            - Google Career Certificates
            - AWS/Azure training
            - Other reputable platforms
            
            Focus on:
            1. Core skills REQUIRED for "{target_job}" role
            2. Skills that bridge gaps between current role and target role
            3. Industry-standard certifications and credentials for this position
            4. Practical, hands-on courses that build job-ready skills
            5. Courses that address the specific improvement areas identified
            
            Return a JSON array with this EXACT structure (no markdown, pure JSON):
            [
                {{
                    "id": "course-1",
                    "title": "Exact Course Title",
                    "provider": "Platform Name",
                    "url": "https://actual-course-url.com",
                    "skills": ["specific", "job-relevant", "skills"],
                    "level": "Beginner" or "Intermediate" or "Advanced",
                    "duration": "Xh" or "X weeks",
                    "rating": 4.5,
                    "price": "$XX.XX" or "Free",
                    "isFree": true or false,
                    "description": "How this course helps achieve the {target_job} role"
                }}
            ]
            
            Requirements:
            - ALL courses must be directly relevant to "{target_job}"
            - Include courses for core competencies of this role
            - Prioritize courses that address skill gaps
            - Mix foundational and advanced courses
            - Include certification prep courses if relevant
            - Return ONLY valid JSON array, no explanations or markdown
            """
            
            response = self.openai_client.chat.completions.create(
                model=settings.AZURE_OPENAI_DEPLOYMENT,
                messages=[
                    {"role": "system", "content": "You are an expert career advisor. Recommend real online courses from popular platforms. Return only valid JSON arrays."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=2000
            )
            
            content = response.choices[0].message.content.strip()
            print(f"AI Course Search Response: {content[:200]}...")
            
            # Try to parse JSON response
            try:
                # Remove markdown code blocks if present
                import re
                json_match = re.search(r'```(?:json)?\s*(\[.*\])\s*```', content, re.DOTALL)
                if json_match:
                    content = json_match.group(1)
                
                courses = json.loads(content)
                if isinstance(courses, list) and len(courses) > 0:
                    print(f"Successfully parsed {len(courses)} courses from AI")
                    return courses
                else:
                    print("AI returned empty or invalid course list")
                    return []
            except json.JSONDecodeError as e:
                print(f"Failed to parse AI course recommendations as JSON: {e}")
                print(f"Raw response: {content}")
                return []
            
        except Exception as e:
            print(f"Error in AI course search: {e}")
            import traceback
            traceback.print_exc()
            return []
    
    def generate_career_plan(self, cv_analysis: Dict, user_responses: List[Dict]) -> Dict[str, Any]:
        """Generate a personalized career plan based on CV analysis and user responses"""
        if not self.openai_client:
            return self._fallback_career_plan(cv_analysis, user_responses)
        
        try:
            prompt = f"""
            Based on the following CV analysis and user responses, create a comprehensive career development plan.
            
            CV Analysis:
            {json.dumps(cv_analysis, indent=2)}
            
            User Responses:
            {json.dumps(user_responses, indent=2)}
            
            Return a JSON response with this structure:
            {{
                "career_goals": ["goal1", "goal2", ...],
                "skill_gaps": [
                    {{"skill": "skill_name", "current_level": "beginner/intermediate/advanced", "target_level": "intermediate/advanced/expert", "priority": "high/medium/low"}}
                ],
                "learning_path": [
                    {{"title": "Learning item", "type": "course/certification/practice", "duration": "X weeks", "priority": "high/medium/low", "description": "..."}}
                ],
                "timeline": {{
                    "short_term": ["action1", "action2", ...],
                    "medium_term": ["action1", "action2", ...],
                    "long_term": ["action1", "action2", ...]
                }},
                "recommendations": ["recommendation1", "recommendation2", ...]
            }}
            """
            
            response = self.openai_client.chat.completions.create(
                model=settings.AZURE_OPENAI_DEPLOYMENT,
                messages=[
                    {"role": "system", "content": "You are an expert career counselor. Create detailed, actionable career development plans."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=2000
            )
            
            result = json.loads(response.choices[0].message.content)
            return result
            
        except Exception as e:
            print(f"Error generating career plan: {e}")
            return self._fallback_career_plan(cv_analysis, user_responses)
    
    def _fallback_career_plan(self, cv_analysis: Dict, user_responses: List[Dict]) -> Dict[str, Any]:
        """Fallback career plan when AI is not available"""
        return {
            "career_goals": ["Advance in current field", "Develop new skills", "Increase marketability"],
            "skill_gaps": [
                {"skill": "Communication", "current_level": "intermediate", "target_level": "advanced", "priority": "high"},
                {"skill": "Leadership", "current_level": "beginner", "target_level": "intermediate", "priority": "medium"}
            ],
            "learning_path": [
                {"title": "Communication Skills Course", "type": "course", "duration": "4 weeks", "priority": "high", "description": "Improve verbal and written communication"},
                {"title": "Leadership Workshop", "type": "course", "duration": "6 weeks", "priority": "medium", "description": "Develop leadership and management skills"}
            ],
            "timeline": {
                "short_term": ["Complete communication course", "Update LinkedIn profile"],
                "medium_term": ["Take on leadership role", "Network with industry professionals"],
                "long_term": ["Apply for senior positions", "Consider advanced certifications"]
            },
            "recommendations": ["Focus on skill development", "Build professional network", "Stay updated with industry trends"]
        }
