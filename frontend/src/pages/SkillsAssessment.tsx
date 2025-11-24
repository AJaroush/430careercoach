import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  Target,
  Award,
  Sparkles,
  Zap,
  BarChart3,
  Lightbulb,
  Upload,
  FileText,
  X,
  AlertCircle
} from "lucide-react";

type Question = {
  id: string;
  category: string;
  question: string;
  options: { value: number; label: string }[];
};

type AssessmentResult = {
  category: string;
  score: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  feedback: string;
  recommendations: string[];
};

const assessmentQuestions: Question[] = [
  // Technical Skills
  { id: '1', category: 'Technical Skills', question: 'How comfortable are you with version control (Git)?', options: [
    { value: 1, label: 'Never used it' },
    { value: 2, label: 'Basic understanding' },
    { value: 3, label: 'Can use basic commands' },
    { value: 4, label: 'Comfortable with branching/merging' },
    { value: 5, label: 'Expert - can resolve complex conflicts' }
  ]},
  { id: '2', category: 'Technical Skills', question: 'Rate your problem-solving abilities', options: [
    { value: 1, label: 'Struggle with complex problems' },
    { value: 2, label: 'Can solve simple problems' },
    { value: 3, label: 'Good at breaking down problems' },
    { value: 4, label: 'Excellent problem solver' },
    { value: 5, label: 'Expert - can solve any challenge' }
  ]},
  { id: '3', category: 'Technical Skills', question: 'How would you rate your debugging skills?', options: [
    { value: 1, label: 'Need help debugging' },
    { value: 2, label: 'Can debug simple issues' },
    { value: 3, label: 'Good at finding bugs' },
    { value: 4, label: 'Excellent debugger' },
    { value: 5, label: 'Expert - can debug anything' }
  ]},
  
  // Communication Skills
  { id: '4', category: 'Communication', question: 'How effective are you at explaining technical concepts?', options: [
    { value: 1, label: 'Struggle to explain' },
    { value: 2, label: 'Can explain to peers' },
    { value: 3, label: 'Good at explaining' },
    { value: 4, label: 'Excellent communicator' },
    { value: 5, label: 'Expert - can teach others' }
  ]},
  { id: '5', category: 'Communication', question: 'Rate your presentation skills', options: [
    { value: 1, label: 'Avoid presentations' },
    { value: 2, label: 'Can present with notes' },
    { value: 3, label: 'Comfortable presenting' },
    { value: 4, label: 'Excellent presenter' },
    { value: 5, label: 'Expert - can present to any audience' }
  ]},
  { id: '6', category: 'Communication', question: 'How well do you document your work?', options: [
    { value: 1, label: 'Rarely document' },
    { value: 2, label: 'Basic documentation' },
    { value: 3, label: 'Good documentation habits' },
    { value: 4, label: 'Excellent documentation' },
    { value: 5, label: 'Expert - comprehensive docs' }
  ]},
  
  // Leadership Skills
  { id: '7', category: 'Leadership', question: 'How comfortable are you leading a team?', options: [
    { value: 1, label: 'Prefer to follow' },
    { value: 2, label: 'Can lead small tasks' },
    { value: 3, label: 'Comfortable leading' },
    { value: 4, label: 'Strong leader' },
    { value: 5, label: 'Expert - natural leader' }
  ]},
  { id: '8', category: 'Leadership', question: 'Rate your mentoring abilities', options: [
    { value: 1, label: 'Never mentored' },
    { value: 2, label: 'Helped a few people' },
    { value: 3, label: 'Regularly mentor' },
    { value: 4, label: 'Excellent mentor' },
    { value: 5, label: 'Expert - mentor many people' }
  ]},
  { id: '9', category: 'Leadership', question: 'How well do you handle conflicts?', options: [
    { value: 1, label: 'Avoid conflicts' },
    { value: 2, label: 'Struggle with conflicts' },
    { value: 3, label: 'Can handle conflicts' },
    { value: 4, label: 'Good at resolving' },
    { value: 5, label: 'Expert - excel at conflict resolution' }
  ]},
];

type CVAnalysis = {
  skills: string[];
  strengths: string[];
  areas_for_improvement: string[];
  experience_years?: number;
  current_role?: string;
};

const API_BASE_URL = 'http://localhost:8000/api/cv/public';

export default function SkillsAssessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [results, setResults] = useState<AssessmentResult[] | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [cvAnalysis, setCvAnalysis] = useState<CVAnalysis | null>(null);
  const [uploadedCV, setUploadedCV] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [customizedQuestions, setCustomizedQuestions] = useState<Question[]>(assessmentQuestions);

  // Load CV analysis from localStorage
  useEffect(() => {
    const savedAnalysis = localStorage.getItem('cv_analysis');
    if (savedAnalysis) {
      try {
        const analysis = JSON.parse(savedAnalysis);
        setCvAnalysis(analysis);
        customizeQuestions(analysis);
      } catch (e) {
        console.error('Error loading saved CV analysis:', e);
      }
    }
  }, []);

  const customizeQuestions = (analysis: CVAnalysis) => {
    // Add CV-specific questions based on detected skills
    const cvSkills = analysis.skills.map(s => s.toLowerCase());
    const additionalQuestions: Question[] = [];

    if (cvSkills.some(s => s.includes('react') || s.includes('javascript'))) {
      additionalQuestions.push({
        id: 'cv-1',
        category: 'Technical Skills',
        question: `How proficient are you with ${cvSkills.find(s => s.includes('react')) || 'React'}?`,
        options: [
          { value: 1, label: 'Just learning' },
          { value: 2, label: 'Basic projects' },
          { value: 3, label: 'Comfortable building apps' },
          { value: 4, label: 'Advanced patterns' },
          { value: 5, label: 'Expert level' }
        ]
      });
    }

    if (cvSkills.some(s => s.includes('python'))) {
      additionalQuestions.push({
        id: 'cv-2',
        category: 'Technical Skills',
        question: 'Rate your Python programming expertise',
        options: [
          { value: 1, label: 'Beginner' },
          { value: 2, label: 'Intermediate' },
          { value: 3, label: 'Advanced' },
          { value: 4, label: 'Expert' },
          { value: 5, label: 'Master level' }
        ]
      });
    }

    if (additionalQuestions.length > 0) {
      setCustomizedQuestions([...assessmentQuestions, ...additionalQuestions]);
    }
  };

  const handleCVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedCV(file);
    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('target_job', '');

      const response = await fetch(`${API_BASE_URL}/analyze/`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.analysis) {
          const analysis = {
            skills: data.analysis.skills || [],
            strengths: data.analysis.strengths || [],
            areas_for_improvement: data.analysis.areas_for_improvement || [],
            experience_years: data.analysis.experience_years,
            current_role: data.analysis.current_role,
          };
          setCvAnalysis(analysis);
          localStorage.setItem('cv_analysis', JSON.stringify(analysis));
          customizeQuestions(analysis);
        }
      }
    } catch (error: any) {
      console.error('CV analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleNext = () => {
    if (currentQuestion < customizedQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = () => {
    const categoryScores: Record<string, number[]> = {};
    
    customizedQuestions.forEach(q => {
      if (!categoryScores[q.category]) {
        categoryScores[q.category] = [];
      }
      const answer = answers[q.id] || 0;
      categoryScores[q.category].push(answer);
    });

    // If CV analysis exists, adjust scores based on CV strengths
    if (cvAnalysis) {
      cvAnalysis.strengths.forEach(strength => {
        // Boost scores in relevant categories
        Object.keys(categoryScores).forEach(category => {
          if (strength.toLowerCase().includes(category.toLowerCase()) || 
              category.toLowerCase().includes(strength.toLowerCase())) {
            categoryScores[category] = categoryScores[category].map(score => 
              Math.min(5, score + 0.5) // Slight boost
            );
          }
        });
      });
    }

    const results: AssessmentResult[] = Object.entries(categoryScores).map(([category, scores]) => {
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      const totalScore = scores.reduce((a, b) => a + b, 0);
      const maxScore = scores.length * 5;
      const percentage = (totalScore / maxScore) * 100;

      let level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
      let feedback: string;
      let recommendations: string[];

      if (percentage >= 80) {
        level = 'Expert';
        feedback = 'Outstanding! You demonstrate expert-level skills in this area.';
        recommendations = ['Continue mentoring others', 'Share your expertise through content', 'Consider advanced certifications'];
      } else if (percentage >= 60) {
        level = 'Advanced';
        feedback = 'Great job! You have strong skills in this area.';
        recommendations = ['Take on leadership roles', 'Mentor junior team members', 'Pursue advanced training'];
      } else if (percentage >= 40) {
        level = 'Intermediate';
        feedback = 'Good foundation! There\'s room for growth.';
        recommendations = ['Practice regularly', 'Take relevant courses', 'Seek feedback from peers'];
      } else {
        level = 'Beginner';
        feedback = 'Getting started! Focus on building fundamentals.';
        recommendations = ['Start with basics', 'Find a mentor', 'Take beginner courses'];
      }

      return {
        category,
        score: Math.round(percentage),
        level,
        feedback,
        recommendations
      };
    });

    setResults(results);
    setIsComplete(true);
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setResults(null);
    setIsComplete(false);
  };

  const progress = ((currentQuestion + 1) / customizedQuestions.length) * 100;
  const currentQ = customizedQuestions[currentQuestion];
  const currentAnswer = answers[currentQ.id];

  if (isComplete && results) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 p-8 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-white/20 rounded-full">
                <Award className="h-6 w-6" />
              </div>
              <h1 className="text-4xl font-bold">Assessment Complete!</h1>
            </div>
            <p className="text-xl text-white/90">
              Here's your personalized skills analysis and recommendations.
            </p>
          </div>
        </div>

        {/* Results Summary */}
        <Card className="bg-slate-800 border-slate-700 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg">
            <CardTitle className="flex items-center space-x-3 text-white">
              <BarChart3 className="h-6 w-6 text-blue-400" />
              <span className="text-2xl">Your Skills Profile</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {results.map((result, index) => (
                <Card key={index} className="bg-slate-700/50 border-slate-600">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">{result.category}</h3>
                      <Badge className={
                        result.level === 'Expert' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                        result.level === 'Advanced' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                        result.level === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                        'bg-green-500/20 text-green-400 border-green-500/30'
                      }>
                        {result.level}
                      </Badge>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-300">Score</span>
                        <span className="text-white font-semibold">{result.score}%</span>
                      </div>
                      <Progress value={result.score} className="h-3 bg-slate-600" />
                    </div>
                    <p className="text-sm text-slate-300 mb-4">{result.feedback}</p>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-slate-400 uppercase">Recommendations:</p>
                      {result.recommendations.map((rec, i) => (
                        <div key={i} className="flex items-start space-x-2">
                          <Lightbulb className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-slate-300">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center space-x-4">
          <Button
            onClick={resetAssessment}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
          >
            <Zap className="h-4 w-4 mr-2" />
            Retake Assessment
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-white/20 rounded-full">
              <Brain className="h-6 w-6" />
            </div>
            <h1 className="text-4xl font-bold">Skills Assessment</h1>
          </div>
          <p className="text-xl text-white/90">
            Evaluate your skills and get personalized recommendations for growth.
          </p>
        </div>
      </div>

      {/* CV Upload Section */}
      {!cvAnalysis && (
        <Card className="bg-slate-800 border-slate-700 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg">
            <CardTitle className="flex items-center space-x-3 text-white">
              <FileText className="h-6 w-6 text-blue-400" />
              <span className="text-xl">Personalize Your Assessment</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <p className="text-slate-300">
                Upload your CV to get a customized assessment tailored to your skills and experience.
              </p>
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleCVUpload}
                  className="hidden"
                  id="cv-upload-assessment"
                />
                <label
                  htmlFor="cv-upload-assessment"
                  className="flex items-center space-x-2 px-4 py-2 bg-slate-700 border border-slate-600 rounded-md cursor-pointer hover:bg-slate-600 transition-colors text-slate-300"
                >
                  <Upload className="h-4 w-4 text-blue-400" />
                  <span>{uploadedCV ? uploadedCV.name : 'Upload CV (Optional)'}</span>
                </label>
                {uploadedCV && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setUploadedCV(null);
                      setCvAnalysis(null);
                      setCustomizedQuestions(assessmentQuestions);
                    }}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {isAnalyzing && (
                <div className="flex items-center space-x-2 text-blue-400">
                  <Zap className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Analyzing CV...</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {cvAnalysis && (
        <Card className="bg-green-500/10 border-green-500/20 shadow-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-white font-medium">Assessment Personalized</p>
                  <p className="text-sm text-slate-400">
                    Questions tailored to your {cvAnalysis.skills.length} skills
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCvAnalysis(null);
                  setCustomizedQuestions(assessmentQuestions);
                  localStorage.removeItem('cv_analysis');
                }}
                className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Bar */}
      <Card className="bg-slate-800 border-slate-700 shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-300 font-medium">
              Question {currentQuestion + 1} of {customizedQuestions.length}
            </span>
            <span className="text-slate-400 text-sm">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-3 bg-slate-700" />
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card className="bg-slate-800 border-slate-700 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg">
          <CardTitle className="flex items-center space-x-3 text-white">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xl">{currentQ.category}</span>
              <p className="text-sm text-slate-400 font-normal mt-1">Question {currentQuestion + 1}</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <h2 className="text-2xl font-semibold text-white mb-8">{currentQ.question}</h2>
          
          <div className="space-y-4">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(currentQ.id, option.value)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                  currentAnswer === option.value
                    ? 'border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/20'
                    : 'border-slate-600 bg-slate-700/50 hover:border-slate-500 hover:bg-slate-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    currentAnswer === option.value
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-slate-500'
                  }`}>
                    {currentAnswer === option.value && (
                      <CheckCircle2 className="h-3 w-3 text-white" />
                    )}
                  </div>
                  <span className={`font-medium ${
                    currentAnswer === option.value ? 'text-white' : 'text-slate-300'
                  }`}>
                    {option.label}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-8">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              variant="outline"
              className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!currentAnswer}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
            >
              {currentQuestion === customizedQuestions.length - 1 ? 'Complete Assessment' : 'Next'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

