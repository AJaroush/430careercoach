import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  ExternalLink,
  BookOpen,
  Play,
  Plus,
  Heart,
  Upload,
  FileText,
  X,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Zap,
  Target,
  Award,
  Brain
} from "lucide-react";

type Course = {
  id: string;
  title: string;
  provider: string;
  url: string;
  skills: string[];
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  rating: number;
  price: string;
  isFree: boolean;
  thumbnail?: string;
  description: string;
};

type Strength = {
  title: string;
  description: string;
  evidence?: string;
  impact?: string;
};

type ImprovementArea = {
  title: string;
  description: string;
  current_state?: string;
  recommendation?: string;
  priority?: string;
};

type CVAnalysis = {
  skills: string[];
  strengths: (string | Strength)[];
  areas_for_improvement: (string | ImprovementArea)[];
  experience_years?: number;
  current_role?: string;
  summary?: string;
};

const COURSE_CATALOG: Course[] = [
  { 
    id: '1', 
    title: 'React for Beginners', 
    provider: 'Coursera', 
    url: 'https://coursera.org', 
    skills: ['react', 'javascript', 'frontend'], 
    level: 'Beginner',
    duration: '12h',
    rating: 4.8,
    price: 'Free',
    isFree: true,
    description: 'Learn React from scratch with hands-on projects and real-world examples.'
  },
  { 
    id: '2', 
    title: 'Advanced React Patterns', 
    provider: 'Udemy', 
    url: 'https://udemy.com', 
    skills: ['react', 'hooks', 'performance'], 
    level: 'Advanced',
    duration: '15h',
    rating: 4.9,
    price: '$89.99',
    isFree: false,
    description: 'Master advanced React patterns and optimization techniques.'
  },
  { 
    id: '3', 
    title: 'Data Structures in Python', 
    provider: 'edX', 
    url: 'https://edx.org', 
    skills: ['python', 'algorithms'], 
    level: 'Intermediate',
    duration: '8h',
    rating: 4.7,
    price: 'Free',
    isFree: true,
    description: 'Comprehensive guide to data structures and algorithms in Python.'
  },
  { 
    id: '4', 
    title: 'Machine Learning Foundations', 
    provider: 'Coursera', 
    url: 'https://coursera.org', 
    skills: ['ml', 'python'], 
    level: 'Beginner',
    duration: '20h',
    rating: 4.6,
    price: '$49.99',
    isFree: false,
    description: 'Introduction to machine learning concepts and applications.'
  },
  { 
    id: '5', 
    title: 'DevOps Essentials', 
    provider: 'Udacity', 
    url: 'https://udacity.com', 
    skills: ['devops', 'ci/cd', 'docker'], 
    level: 'Intermediate',
    duration: '16h',
    rating: 4.5,
    price: 'Free',
    isFree: true,
    description: 'Learn DevOps practices and tools for modern software development.'
  },
  { 
    id: '6', 
    title: 'AWS Cloud Practitioner', 
    provider: 'AWS Training', 
    url: 'https://aws.amazon.com', 
    skills: ['aws', 'cloud', 'certification'], 
    level: 'Beginner',
    duration: '10h',
    rating: 4.8,
    price: 'Free',
    isFree: true,
    description: 'Prepare for the AWS Cloud Practitioner certification exam.'
  },
  { 
    id: '7', 
    title: 'JavaScript Mastery', 
    provider: 'Udemy', 
    url: 'https://udemy.com', 
    skills: ['javascript', 'es6', 'async'], 
    level: 'Intermediate',
    duration: '18h',
    rating: 4.9,
    price: '$79.99',
    isFree: false,
    description: 'Master modern JavaScript including ES6+, async/await, and advanced patterns.'
  },
  { 
    id: '8', 
    title: 'TypeScript Fundamentals', 
    provider: 'Pluralsight', 
    url: 'https://pluralsight.com', 
    skills: ['typescript', 'javascript'], 
    level: 'Intermediate',
    duration: '10h',
    rating: 4.7,
    price: 'Free',
    isFree: true,
    description: 'Learn TypeScript from the ground up with practical examples.'
  },
  { 
    id: '9', 
    title: 'Node.js Backend Development', 
    provider: 'Coursera', 
    url: 'https://coursera.org', 
    skills: ['node.js', 'backend', 'api'], 
    level: 'Advanced',
    duration: '25h',
    rating: 4.8,
    price: '$99.99',
    isFree: false,
    description: 'Build scalable backend applications with Node.js and Express.'
  },
  { 
    id: '10', 
    title: 'Docker & Kubernetes', 
    provider: 'Udemy', 
    url: 'https://udemy.com', 
    skills: ['docker', 'kubernetes', 'devops'], 
    level: 'Intermediate',
    duration: '14h',
    rating: 4.6,
    price: '$69.99',
    isFree: false,
    description: 'Master containerization and orchestration with Docker and Kubernetes.'
  },
];

const API_BASE_URL = 'http://localhost:8000/api/cv/public';

export default function CourseRecommendations() {
  const [job, setJob] = useState('frontend_developer');
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [savedCourses, setSavedCourses] = useState<string[]>([]);
  const [uploadedCV, setUploadedCV] = useState<File | null>(null);
  const [targetJob, setTargetJob] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cvAnalysis, setCvAnalysis] = useState<CVAnalysis | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);

  // Load saved courses from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('saved_courses');
    if (saved) {
      setSavedCourses(JSON.parse(saved));
    }
  }, []);

  // Save courses to localStorage
  useEffect(() => {
    if (savedCourses.length > 0) {
      localStorage.setItem('saved_courses', JSON.stringify(savedCourses));
    }
  }, [savedCourses]);

  const analyzeCV = async () => {
    if (!uploadedCV || !targetJob) {
      setAnalysisError('Please upload a CV and enter a target job position');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);
    setCvAnalysis(null);
    setRecommendedCourses([]);

    try {
      const formData = new FormData();
      formData.append('file', uploadedCV);
      formData.append('target_job', targetJob);

      const response = await fetch(`${API_BASE_URL}/analyze/`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data); // Debug log
        
        if (data.success && data.analysis) {
          console.log('Analysis data:', data.analysis); // Debug log
          
          // Set CV analysis results
          const analysisData = {
            skills: data.analysis.skills || [],
            strengths: data.analysis.strengths || [],
            areas_for_improvement: data.analysis.areas_for_improvement || [],
            experience_years: data.analysis.experience_years,
            current_role: data.analysis.current_role,
            summary: data.analysis.summary,
          };
          
          console.log('Setting CV analysis:', analysisData); // Debug log
          setCvAnalysis(analysisData);
          
          // Set recommended courses from API
          if (data.recommendations && data.recommendations.length > 0) {
            console.log('Setting recommended courses:', data.recommendations.length); // Debug log
            setRecommendedCourses(data.recommendations);
          } else {
            console.warn('No recommendations returned from API');
          }
        } else {
          console.error('API returned success=false:', data);
          setAnalysisError(data.error || 'Failed to analyze CV');
        }
      } else {
        const errorText = await response.text();
        console.error('API Error Response:', response.status, errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: `Server error: ${response.status}` };
        }
        setAnalysisError(errorData.error || 'Failed to analyze CV. Please try again.');
      }
      
    } catch (error: any) {
      console.error('CV Analysis Error:', error);
      setAnalysisError(error.message || 'Failed to analyze CV. Please check your connection and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };


  const recommended = useMemo(() => {
    // If we have recommended courses from CV analysis, use those first
    let list: Course[] = [];
    
    if (recommendedCourses.length > 0) {
      // Use API-recommended courses - convert to Course type
      list = recommendedCourses.map(course => ({
        id: course.id || String(Math.random()),
        title: course.title,
        provider: course.provider,
        url: course.url,
        skills: Array.isArray(course.skills) ? course.skills : [],
        level: (course.level || 'Intermediate') as 'Beginner' | 'Intermediate' | 'Advanced',
        duration: course.duration || '10h',
        rating: typeof course.rating === 'number' ? course.rating : 4.5,
        price: course.price || 'Free',
        isFree: course.isFree !== undefined ? course.isFree : (course.price === 'Free' || !course.price),
        description: course.description || '',
      }));
      console.log('Using API recommended courses:', list.length);
    } else if (cvAnalysis && cvAnalysis.skills.length > 0) {
      // If CV analysis exists but no API recommendations, use local matching
      const improvementSkills = cvAnalysis.areas_for_improvement.map(area => 
        typeof area === 'string' ? area : area.title
      )
        .flatMap(area => area.toLowerCase().split(' '))
        .filter(skill => skill.length > 3);

      list = COURSE_CATALOG.map(course => {
        const relevanceScore = course.skills.reduce((score, skill) => {
          if (improvementSkills.some(imp => skill.toLowerCase().includes(imp))) {
            return score + 2;
          }
          if (cvAnalysis.skills.some(cvSkill => skill.toLowerCase().includes(cvSkill.toLowerCase()))) {
            return score + 1;
          }
          return score;
        }, 0);

        return { ...course, relevanceScore };
      })
      .filter(c => (c as any).relevanceScore > 0) // Only show courses with some relevance
      .sort((a, b) => (b as any).relevanceScore - (a as any).relevanceScore);
      
      console.log('Using local matching courses:', list.length);
    } else {
      // Default filtering by job
      const jobSkills: Record<string, string[]> = {
        'frontend_developer': ['react', 'javascript', 'frontend', 'hooks'],
        'backend_developer': ['python', 'algorithms', 'docker', 'aws'],
        'ml_engineer': ['ml', 'python', 'algorithms'],
        'devops_engineer': ['devops', 'ci/cd', 'docker', 'aws'],
        'data_scientist': ['python', 'ml', 'algorithms'],
        'fullstack_developer': ['react', 'javascript', 'python', 'docker'],
      };
      const skills = jobSkills[job] ?? [];
      list = COURSE_CATALOG.filter(c => 
        c.skills.some(s => skills.includes(s)) ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters (but don't filter out all courses if we have CV analysis)
    const originalLength = list.length;
    if (level !== 'All') list = list.filter(c => c.level === level);
    if (showFreeOnly) list = list.filter(c => c.isFree);
    if (searchQuery && searchQuery.trim()) {
      list = list.filter(c => 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // If filters removed all courses but we had CV analysis, show unfiltered list
    if (list.length === 0 && originalLength > 0 && cvAnalysis) {
      console.warn('Filters removed all courses, showing unfiltered recommendations');
      return recommendedCourses.length > 0 
        ? recommendedCourses.map(course => ({
            id: course.id || String(Math.random()),
            title: course.title,
            provider: course.provider,
            url: course.url,
            skills: Array.isArray(course.skills) ? course.skills : [],
            level: (course.level || 'Intermediate') as 'Beginner' | 'Intermediate' | 'Advanced',
            duration: course.duration || '10h',
            rating: typeof course.rating === 'number' ? course.rating : 4.5,
            price: course.price || 'Free',
            isFree: course.isFree !== undefined ? course.isFree : (course.price === 'Free' || !course.price),
            description: course.description || '',
          }))
        : COURSE_CATALOG.slice(0, 6);
    }
    
    console.log('Final recommended courses:', list.length);
    return list;
  }, [job, level, searchQuery, showFreeOnly, cvAnalysis, recommendedCourses]);

  const handleSaveCourse = (courseId: string) => {
    setSavedCourses(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleEnrollCourse = (course: Course) => {
    console.log('Enrolling in course:', course.title);
    window.open(course.url, '_blank');
  };

  const handleCVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedCV(file);
      setCvAnalysis(null); // Reset analysis when new CV is uploaded
      setAnalysisError(null);
    }
  };

  const removeCV = () => {
    setUploadedCV(null);
    setCvAnalysis(null);
    setAnalysisError(null);
  };

  return (
    <div className="space-y-8">
      {/* Header with Gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-white/20 rounded-full">
              <Sparkles className="h-6 w-6" />
            </div>
            <h1 className="text-4xl font-bold">Course Recommendations</h1>
          </div>
          <p className="text-xl text-white/90">
            Get personalized course suggestions based on your career goals and skill gaps.
          </p>
        </div>
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/5 rounded-full"></div>
      </div>

      {/* CV Upload Section */}
      <Card className="bg-slate-800 border-slate-700 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg">
          <CardTitle className="flex items-center space-x-3 text-white">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
              <FileText className="h-5 w-5" />
            </div>
            <span className="text-xl">Upload CV for Personalized Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Target Job Position
              </label>
              <Input
                placeholder="e.g., Senior Frontend Developer"
                value={targetJob}
                onChange={(e) => setTargetJob(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Upload CV (PDF, DOC, DOCX)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleCVUpload}
                  className="hidden"
                  id="cv-upload"
                />
                <label
                  htmlFor="cv-upload"
                  className="flex items-center space-x-2 px-4 py-2 bg-slate-700 border border-slate-600 rounded-md cursor-pointer hover:bg-slate-600 transition-colors text-slate-300"
                >
                  <Upload className="h-4 w-4 text-blue-400" />
                  <span>
                    {uploadedCV ? uploadedCV.name : 'Choose File'}
                  </span>
                </label>
                {uploadedCV && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeCV}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
          <Button
            onClick={analyzeCV}
            disabled={!uploadedCV || !targetJob || isAnalyzing}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            {isAnalyzing ? (
              <>
                <Zap className="h-4 w-4 mr-2 animate-spin" />
                Analyzing CV...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Analyze CV & Get Recommendations
              </>
            )}
          </Button>
          {analysisError && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{analysisError}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* CV Analysis Results */}
      {cvAnalysis && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Strengths */}
          <Card className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 border-slate-700 shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl"></div>
            <CardHeader className="relative bg-gradient-to-r from-green-500/30 via-emerald-500/20 to-transparent rounded-t-lg border-b border-green-500/30">
              <CardTitle className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl shadow-lg shadow-green-500/30">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span className="text-2xl font-bold">Your Strengths</span>
                    <p className="text-sm text-green-200/80 font-normal mt-1">
                      {cvAnalysis.strengths?.length || 0} key strengths identified
                    </p>
                  </div>
                </div>
                <Award className="h-8 w-8 text-green-400/50" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 relative">
              {cvAnalysis.strengths && cvAnalysis.strengths.length > 0 ? (
                <div className="space-y-4">
                  {cvAnalysis.strengths.map((strength, index) => {
                    const strengthObj = typeof strength === 'string' 
                      ? { title: strength, description: strength, evidence: '', impact: '' }
                      : { title: strength?.title || strength?.description || 'Strength', description: strength?.description || strength?.title || 'Strength', evidence: strength?.evidence || '', impact: strength?.impact || '' };
                    return (
                      <div 
                        key={index} 
                        className="group relative flex items-start space-x-4 p-4 bg-gradient-to-r from-green-500/10 via-emerald-500/5 to-transparent rounded-xl border border-green-500/20 hover:border-green-500/40 hover:from-green-500/20 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300"
                      >
                        <div className="flex-shrink-0 mt-1">
                          <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg shadow-md group-hover:scale-110 transition-transform">
                            <CheckCircle2 className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-semibold mb-1 group-hover:text-green-300 transition-colors">
                            {strengthObj.title || 'Strength'}
                          </h4>
                          <p className="text-slate-300 text-sm leading-relaxed">
                            {strengthObj.description || strengthObj.title || 'Strength identified'}
                          </p>
                          {strengthObj.evidence && (
                            <p className="text-slate-400 text-xs mt-2 italic">
                              Evidence: {strengthObj.evidence}
                            </p>
                          )}
                          {strengthObj.impact && (
                            <p className="text-green-400/80 text-xs mt-1">
                              Impact: {strengthObj.impact}
                            </p>
                          )}
                        </div>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-700/50 rounded-full mb-4">
                    <CheckCircle2 className="h-10 w-10 text-slate-500" />
                  </div>
                  <p className="text-slate-400 text-sm">Upload and analyze your CV to discover your strengths</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Areas for Improvement */}
          <Card className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 border-slate-700 shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl"></div>
            <CardHeader className="relative bg-gradient-to-r from-orange-500/30 via-red-500/20 to-transparent rounded-t-lg border-b border-orange-500/30">
              <CardTitle className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl shadow-lg shadow-orange-500/30">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span className="text-2xl font-bold">Growth Opportunities</span>
                    <p className="text-sm text-orange-200/80 font-normal mt-1">
                      {cvAnalysis.areas_for_improvement?.length || 0} areas to develop
                    </p>
                  </div>
                </div>
                <Zap className="h-8 w-8 text-orange-400/50" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 relative">
              {cvAnalysis.areas_for_improvement && cvAnalysis.areas_for_improvement.length > 0 ? (
                <div className="space-y-4">
                  {cvAnalysis.areas_for_improvement.map((area, index) => {
                    const areaObj = typeof area === 'string'
                      ? { title: area, description: area, current_state: '', recommendation: '', priority: 'medium' }
                      : { 
                          title: area?.title || area?.description || 'Area for Improvement', 
                          description: area?.description || area?.title || 'Area for improvement identified', 
                          current_state: area?.current_state || '', 
                          recommendation: area?.recommendation || '', 
                          priority: area?.priority || 'medium' 
                        };
                    return (
                      <div 
                        key={index} 
                        className="group relative flex items-start space-x-4 p-4 bg-gradient-to-r from-orange-500/10 via-red-500/5 to-transparent rounded-xl border border-orange-500/20 hover:border-orange-500/40 hover:from-orange-500/20 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300"
                      >
                        <div className="flex-shrink-0 mt-1">
                          <div className="p-2 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg shadow-md group-hover:scale-110 transition-transform">
                            <AlertCircle className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-white font-semibold group-hover:text-orange-300 transition-colors">
                              {areaObj.title || 'Area for Improvement'}
                            </h4>
                            {areaObj.priority && (
                              <Badge 
                                variant={areaObj.priority === 'high' ? 'destructive' : areaObj.priority === 'medium' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {areaObj.priority}
                              </Badge>
                            )}
                          </div>
                          <p className="text-slate-300 text-sm leading-relaxed mb-2">
                            {areaObj.description || areaObj.title || 'Area for improvement identified'}
                          </p>
                          {areaObj.current_state && (
                            <p className="text-slate-400 text-xs mb-1">
                              <span className="font-medium">Current:</span> {areaObj.current_state}
                            </p>
                          )}
                          {areaObj.recommendation && (
                            <div className="mt-2 p-2 bg-orange-500/10 rounded border border-orange-500/20">
                              <p className="text-orange-300 text-xs font-medium mb-1">Recommendation:</p>
                              <p className="text-slate-300 text-xs">{areaObj.recommendation}</p>
                            </div>
                          )}
                        </div>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-700/50 rounded-full mb-4">
                    <Target className="h-10 w-10 text-slate-500" />
                  </div>
                  <p className="text-slate-400 text-sm">Upload and analyze your CV to identify growth areas</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}


      {/* Filters */}
      <Card className="bg-slate-800 border-slate-700 shadow-xl">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Target Job</label>
              <Select value={job} onValueChange={setJob}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select job role" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600 z-50">
                  <SelectItem value="frontend_developer" className="text-white hover:bg-slate-600">Frontend Developer</SelectItem>
                  <SelectItem value="backend_developer" className="text-white hover:bg-slate-600">Backend Developer</SelectItem>
                  <SelectItem value="ml_engineer" className="text-white hover:bg-slate-600">ML Engineer</SelectItem>
                  <SelectItem value="devops_engineer" className="text-white hover:bg-slate-600">DevOps Engineer</SelectItem>
                  <SelectItem value="data_scientist" className="text-white hover:bg-slate-600">Data Scientist</SelectItem>
                  <SelectItem value="fullstack_developer" className="text-white hover:bg-slate-600">Full Stack Developer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Level</label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600 z-50">
                  <SelectItem value="All" className="text-white hover:bg-slate-600">All Levels</SelectItem>
                  <SelectItem value="Beginner" className="text-white hover:bg-slate-600">Beginner</SelectItem>
                  <SelectItem value="Intermediate" className="text-white hover:bg-slate-600">Intermediate</SelectItem>
                  <SelectItem value="Advanced" className="text-white hover:bg-slate-600">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                />
              </div>
            </div>

            <div className="flex items-end">
              <Button
                variant={showFreeOnly ? "default" : "outline"}
                onClick={() => setShowFreeOnly(!showFreeOnly)}
                className={`w-full transition-all duration-300 ${
                  showFreeOnly 
                    ? "bg-green-500 hover:bg-green-600 text-white border-0" 
                    : "bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
                }`}
              >
                <Filter className="h-4 w-4 mr-2" />
                {showFreeOnly ? "Show All" : "Free Only"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-300">
            {recommended.length} {recommended.length === 1 ? 'course' : 'courses'} found
            {cvAnalysis && (
              <span className="ml-2 text-blue-400 font-semibold">
                • Personalized based on your CV
              </span>
            )}
          </p>
          {cvAnalysis && recommendedCourses.length > 0 && (
            <p className="text-sm text-slate-400 mt-1">
              Top recommendations matching your skill gaps and target role
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-300">Saved:</span>
          <Badge variant="secondary" className="bg-slate-700 text-slate-300">{savedCourses.length}</Badge>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommended.map((course) => (
          <Card key={course.id} className="group hover:scale-105 transition-all duration-300 bg-slate-800 border-slate-700 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-1 text-white group-hover:text-blue-400 transition-colors">{course.title}</CardTitle>
                  <p className="text-sm text-slate-400">{course.provider}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSaveCourse(course.id)}
                  className="text-slate-400 hover:text-red-400 transition-colors"
                >
                  <Heart className={`h-4 w-4 transition-all duration-300 ${
                    savedCourses.includes(course.id) 
                      ? 'fill-red-500 text-red-500 scale-110' 
                      : 'group-hover:scale-110'
                  }`} />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-300 line-clamp-2">
                {course.description}
              </p>

              <div className="flex items-center space-x-4 text-sm">
                <Badge 
                  variant={course.level === 'Beginner' ? 'default' : course.level === 'Intermediate' ? 'secondary' : 'destructive'}
                  className={
                    course.level === 'Beginner' 
                      ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                      : course.level === 'Intermediate' 
                      ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' 
                      : 'bg-red-500/20 text-red-400 border-red-500/30'
                  }
                >
                  {course.level}
                </Badge>
                <div className="flex items-center space-x-1 text-slate-300">
                  <Clock className="h-3 w-3" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center space-x-1 text-slate-300">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{course.rating}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {course.skills.map((skill) => (
                  <Badge key={skill} variant="outline" className="text-xs bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600 transition-colors">
                    {skill}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`font-semibold ${course.isFree ? 'text-green-400' : 'text-blue-400'}`}>
                    {course.price}
                  </span>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleEnrollCourse(course)}
                  className="flex items-center space-x-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Play className="h-3 w-3" />
                  <span>Start</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {recommended.length === 0 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-12 text-center">
            <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-white">No courses found</h3>
            <p className="text-slate-300 mb-4">
              Try adjusting your filters or search terms to find more courses.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setLevel('All');
                setShowFreeOnly(false);
              }}
              className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
