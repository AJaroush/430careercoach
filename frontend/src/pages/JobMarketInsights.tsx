import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Briefcase,
  ArrowUp,
  ArrowDown,
  Search,
  Sparkles,
  BarChart3,
  Globe,
  Zap,
  Target,
  Upload,
  FileText,
  X,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

type MarketTrend = {
  skill: string;
  demand: number;
  trend: 'up' | 'down' | 'stable';
  growth: number;
};

type SalaryData = {
  role: string;
  min: number;
  max: number;
  average: number;
  experience: string;
};

const marketTrends: MarketTrend[] = [
  { skill: 'React', demand: 95, trend: 'up', growth: 12 },
  { skill: 'Python', demand: 92, trend: 'up', growth: 8 },
  { skill: 'AWS', demand: 88, trend: 'up', growth: 15 },
  { skill: 'Machine Learning', demand: 85, trend: 'up', growth: 20 },
  { skill: 'Docker', demand: 82, trend: 'up', growth: 10 },
  { skill: 'TypeScript', demand: 90, trend: 'up', growth: 18 },
  { skill: 'Kubernetes', demand: 78, trend: 'up', growth: 25 },
  { skill: 'GraphQL', demand: 75, trend: 'stable', growth: 5 },
];

const salaryData: SalaryData[] = [
  { role: 'Frontend Developer', min: 70000, max: 140000, average: 105000, experience: '2-5 years' },
  { role: 'Backend Developer', min: 80000, max: 150000, average: 115000, experience: '2-5 years' },
  { role: 'Full Stack Developer', min: 85000, max: 160000, average: 120000, experience: '3-6 years' },
  { role: 'DevOps Engineer', min: 90000, max: 170000, average: 130000, experience: '3-7 years' },
  { role: 'Data Scientist', min: 95000, max: 180000, average: 135000, experience: '2-5 years' },
  { role: 'ML Engineer', min: 100000, max: 200000, average: 150000, experience: '3-7 years' },
];

type CVAnalysis = {
  skills: string[];
  strengths: string[];
  areas_for_improvement: string[];
  experience_years?: number;
  current_role?: string;
  summary?: string;
};

type RecommendedJob = {
  title: string;
  matchScore: number;
  salaryRange: string;
  averageSalary: number;
  growth: number;
  requiredSkills: string[];
  whyMatch: string;
};

const API_BASE_URL = 'http://localhost:8000/api/cv/public';

export default function JobMarketInsights() {
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadedCV, setUploadedCV] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cvAnalysis, setCvAnalysis] = useState<CVAnalysis | null>(null);
  const [recommendedJobs, setRecommendedJobs] = useState<RecommendedJob[]>([]);
  const [personalizedTrends, setPersonalizedTrends] = useState<MarketTrend[]>([]);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Load CV analysis from localStorage if available
  useEffect(() => {
    const savedAnalysis = localStorage.getItem('cv_analysis');
    if (savedAnalysis) {
      try {
        const analysis = JSON.parse(savedAnalysis);
        setCvAnalysis(analysis);
        generatePersonalizedInsights(analysis);
      } catch (e) {
        console.error('Error loading saved CV analysis:', e);
      }
    }
  }, []);

  const generatePersonalizedInsights = (analysis: CVAnalysis) => {
    // Filter trends based on CV skills
    const cvSkills = analysis.skills.map(s => s.toLowerCase());
    const relevantTrends = marketTrends
      .filter(trend => cvSkills.some(skill => trend.skill.toLowerCase().includes(skill) || skill.includes(trend.skill.toLowerCase())))
      .map(trend => ({
        ...trend,
        demand: trend.demand + (cvSkills.includes(trend.skill.toLowerCase()) ? 5 : 0) // Boost if skill is in CV
      }))
      .sort((a, b) => b.demand - a.demand);

    setPersonalizedTrends(relevantTrends.length > 0 ? relevantTrends : marketTrends);

    // Generate job recommendations based on CV
    const jobs: RecommendedJob[] = generateJobRecommendations(analysis);
    setRecommendedJobs(jobs);
  };

  const generateJobRecommendations = (analysis: CVAnalysis): RecommendedJob[] => {
    const skills = analysis.skills.map(s => s.toLowerCase());
    const experience = analysis.experience_years || 0;
    
    const allJobs: RecommendedJob[] = [
      {
        title: 'Frontend Developer',
        matchScore: calculateMatchScore(skills, ['react', 'javascript', 'typescript', 'css', 'html']),
        salaryRange: '$70K - $140K',
        averageSalary: 105000,
        growth: 15,
        requiredSkills: ['React', 'JavaScript', 'TypeScript', 'CSS'],
        whyMatch: skills.some(s => s.includes('react') || s.includes('frontend')) 
          ? 'Strong match - Your React/frontend skills align perfectly'
          : 'Good potential - Frontend skills are in high demand'
      },
      {
        title: 'Backend Developer',
        matchScore: calculateMatchScore(skills, ['python', 'node.js', 'java', 'sql', 'api']),
        salaryRange: '$80K - $150K',
        averageSalary: 115000,
        growth: 12,
        requiredSkills: ['Python', 'Node.js', 'SQL', 'API Development'],
        whyMatch: skills.some(s => s.includes('python') || s.includes('backend') || s.includes('api'))
          ? 'Strong match - Your backend skills are highly valued'
          : 'Good potential - Backend development offers great opportunities'
      },
      {
        title: 'Full Stack Developer',
        matchScore: calculateMatchScore(skills, ['react', 'node.js', 'python', 'javascript', 'sql']),
        salaryRange: '$85K - $160K',
        averageSalary: 120000,
        growth: 18,
        requiredSkills: ['React', 'Node.js', 'Python', 'Full Stack'],
        whyMatch: (skills.some(s => s.includes('react')) && skills.some(s => s.includes('python') || s.includes('node')))
          ? 'Excellent match - You have both frontend and backend skills'
          : 'Good potential - Full stack developers are in high demand'
      },
      {
        title: 'DevOps Engineer',
        matchScore: calculateMatchScore(skills, ['docker', 'kubernetes', 'aws', 'ci/cd', 'devops']),
        salaryRange: '$90K - $170K',
        averageSalary: 130000,
        growth: 25,
        requiredSkills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
        whyMatch: skills.some(s => s.includes('docker') || s.includes('aws') || s.includes('devops'))
          ? 'Strong match - Your DevOps skills are highly sought after'
          : 'Good potential - DevOps is one of the fastest-growing fields'
      },
      {
        title: 'Data Scientist',
        matchScore: calculateMatchScore(skills, ['python', 'machine learning', 'data', 'analytics', 'sql']),
        salaryRange: '$95K - $180K',
        averageSalary: 135000,
        growth: 20,
        requiredSkills: ['Python', 'Machine Learning', 'Data Analysis', 'SQL'],
        whyMatch: skills.some(s => s.includes('python') && (s.includes('data') || s.includes('ml')))
          ? 'Strong match - Your data science skills are in high demand'
          : 'Good potential - Data science offers excellent career growth'
      },
      {
        title: 'ML Engineer',
        matchScore: calculateMatchScore(skills, ['machine learning', 'python', 'ai', 'tensorflow', 'pytorch']),
        salaryRange: '$100K - $200K',
        averageSalary: 150000,
        growth: 30,
        requiredSkills: ['Machine Learning', 'Python', 'AI', 'Deep Learning'],
        whyMatch: skills.some(s => s.includes('ml') || s.includes('machine learning') || s.includes('ai'))
          ? 'Excellent match - ML engineering is one of the hottest fields'
          : 'Good potential - ML engineers command top salaries'
      }
    ];

    return allJobs
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 6);
  };

  const calculateMatchScore = (cvSkills: string[], jobSkills: string[]): number => {
    const matches = jobSkills.filter(js => 
      cvSkills.some(cs => cs.includes(js.toLowerCase()) || js.toLowerCase().includes(cs))
    ).length;
    return Math.round((matches / jobSkills.length) * 100);
  };

  const handleCVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedCV(file);
    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('target_job', ''); // Not needed for market insights

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
            summary: data.analysis.summary,
          };
          setCvAnalysis(analysis);
          localStorage.setItem('cv_analysis', JSON.stringify(analysis));
          generatePersonalizedInsights(analysis);
        }
      }
    } catch (error: any) {
      setAnalysisError(error.message || 'Failed to analyze CV');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const removeCV = () => {
    setUploadedCV(null);
    setCvAnalysis(null);
    setRecommendedJobs([]);
    setPersonalizedTrends([]);
    localStorage.removeItem('cv_analysis');
  };

  const filteredTrends = (personalizedTrends.length > 0 ? personalizedTrends : marketTrends).filter(trend =>
    trend.skill.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const topSkills = [...(personalizedTrends.length > 0 ? personalizedTrends : marketTrends)]
    .sort((a, b) => b.demand - a.demand)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-white/20 rounded-full">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h1 className="text-4xl font-bold">Job Market Insights</h1>
          </div>
          <p className="text-xl text-white/90">
            Stay ahead with real-time market trends, salary data, and in-demand skills.
          </p>
        </div>
      </div>

      {/* CV Upload Section */}
      <Card className="bg-slate-800 border-slate-700 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg">
          <CardTitle className="flex items-center space-x-3 text-white">
            <FileText className="h-6 w-6 text-blue-400" />
            <span className="text-xl">Upload CV for Personalized Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {!cvAnalysis ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleCVUpload}
                  className="hidden"
                  id="cv-upload-insights"
                />
                <label
                  htmlFor="cv-upload-insights"
                  className="flex items-center space-x-2 px-4 py-2 bg-slate-700 border border-slate-600 rounded-md cursor-pointer hover:bg-slate-600 transition-colors text-slate-300"
                >
                  <Upload className="h-4 w-4 text-blue-400" />
                  <span>{uploadedCV ? uploadedCV.name : 'Choose CV File'}</span>
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
              {isAnalyzing && (
                <div className="flex items-center space-x-2 text-blue-400">
                  <Zap className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Analyzing your CV...</span>
                </div>
              )}
              {analysisError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-sm">{analysisError}</p>
                </div>
              )}
              <p className="text-sm text-slate-400">
                Upload your CV to see personalized job recommendations and market insights tailored to your skills.
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-white font-medium">CV Analyzed Successfully</p>
                  <p className="text-sm text-slate-400">
                    {cvAnalysis.skills.length} skills identified • {cvAnalysis.current_role || 'Role detected'}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={removeCV}
                className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
              >
                <X className="h-4 w-4 mr-2" />
                Remove
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommended Jobs Based on CV */}
      {cvAnalysis && recommendedJobs.length > 0 && (
        <Card className="bg-slate-800 border-slate-700 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg">
            <CardTitle className="flex items-center space-x-3 text-white">
              <Target className="h-6 w-6 text-purple-400" />
              <span className="text-2xl">Recommended Jobs for You</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedJobs.map((job, index) => (
                <Card key={index} className="bg-slate-700/50 border-slate-600 hover:border-purple-500/50 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                          <Badge className={
                            job.matchScore >= 70 ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                            job.matchScore >= 40 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                            'bg-blue-500/20 text-blue-400 border-blue-500/30'
                          }>
                            {job.matchScore}% Match
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-300 mb-3">{job.whyMatch}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="p-3 bg-slate-600/50 rounded-lg">
                        <p className="text-xs text-slate-400 mb-1">Salary Range</p>
                        <p className="text-lg font-semibold text-green-400">{job.salaryRange}</p>
                      </div>
                      <div className="p-3 bg-slate-600/50 rounded-lg">
                        <p className="text-xs text-slate-400 mb-1">Growth</p>
                        <p className="text-lg font-semibold text-blue-400 flex items-center">
                          <ArrowUp className="h-4 w-4 mr-1" />
                          +{job.growth}%
                        </p>
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="text-xs text-slate-400 mb-2">Required Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {job.requiredSkills.slice(0, 4).map((skill, i) => (
                          <Badge key={i} variant="outline" className="text-xs bg-slate-600 border-slate-500 text-slate-300">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-600">
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-slate-400">Match Score</span>
                        <span className="text-white font-semibold">{job.matchScore}%</span>
                      </div>
                      <Progress value={job.matchScore} className="h-2 bg-slate-600" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-500 to-emerald-600 border-0 shadow-lg">
          <CardContent className="p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold mb-1">+15%</p>
                <p className="text-green-100">Job Growth</p>
              </div>
              <TrendingUp className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-lg">
          <CardContent className="p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold mb-1">$120K</p>
                <p className="text-blue-100">Avg Salary</p>
              </div>
              <DollarSign className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 shadow-lg">
          <CardContent className="p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold mb-1">2.3M</p>
                <p className="text-purple-100">Open Jobs</p>
              </div>
              <Briefcase className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-0 shadow-lg">
          <CardContent className="p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold mb-1">8.2%</p>
                <p className="text-orange-100">Unemployment</p>
              </div>
              <Users className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top In-Demand Skills */}
      <Card className="bg-slate-800 border-slate-700 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg">
          <CardTitle className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-3">
              <Zap className="h-6 w-6 text-yellow-400" />
              <span className="text-2xl">
                {cvAnalysis ? 'Your Relevant Skills' : 'Top In-Demand Skills'}
              </span>
            </div>
            {cvAnalysis && (
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                Personalized
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {topSkills.map((skill, index) => (
              <div key={skill.skill} className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold">{skill.skill}</span>
                    <div className="flex items-center space-x-2">
                      <Badge className={
                        skill.trend === 'up' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                        skill.trend === 'down' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                        'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                      }>
                        {skill.trend === 'up' && <ArrowUp className="h-3 w-3 mr-1" />}
                        {skill.trend === 'down' && <ArrowDown className="h-3 w-3 mr-1" />}
                        {skill.growth > 0 ? '+' : ''}{skill.growth}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={skill.demand} className="h-2 bg-slate-700" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Market Trends */}
      <Card className="bg-slate-800 border-slate-700 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg">
          <CardTitle className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-6 w-6 text-green-400" />
              <span className="text-2xl">Market Trends</span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTrends.map((trend) => (
              <Card key={trend.skill} className="bg-slate-700/50 border-slate-600 hover:border-slate-500 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-blue-400" />
                      <span className="text-white font-semibold">{trend.skill}</span>
                    </div>
                    <Badge className={
                      trend.trend === 'up' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                      trend.trend === 'down' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                      'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    }>
                      {trend.trend === 'up' && <ArrowUp className="h-3 w-3 mr-1" />}
                      {trend.trend === 'down' && <ArrowDown className="h-3 w-3 mr-1" />}
                      {trend.growth > 0 ? '+' : ''}{trend.growth}%
                    </Badge>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Demand Score</span>
                      <span className="text-white font-semibold">{trend.demand}%</span>
                    </div>
                    <Progress value={trend.demand} className="h-2 bg-slate-600" />
                  </div>
                  <p className="text-xs text-slate-400">
                    {trend.trend === 'up' && 'Growing demand in the market'}
                    {trend.trend === 'down' && 'Declining demand'}
                    {trend.trend === 'stable' && 'Stable demand'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Salary Insights */}
      <Card className="bg-slate-800 border-slate-700 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg">
          <CardTitle className="flex items-center space-x-3 text-white">
            <DollarSign className="h-6 w-6 text-green-400" />
            <span className="text-2xl">Salary Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {salaryData.map((salary) => (
              <Card key={salary.role} className="bg-slate-700/50 border-slate-600">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{salary.role}</h3>
                      <p className="text-sm text-slate-400">{salary.experience}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-400">
                        ${(salary.average / 1000).toFixed(0)}K
                      </p>
                      <p className="text-xs text-slate-400">Average</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-600/50 rounded-lg">
                      <p className="text-xs text-slate-400 mb-1">Minimum</p>
                      <p className="text-lg font-semibold text-white">
                        ${(salary.min / 1000).toFixed(0)}K
                      </p>
                    </div>
                    <div className="p-3 bg-slate-600/50 rounded-lg">
                      <p className="text-xs text-slate-400 mb-1">Maximum</p>
                      <p className="text-lg font-semibold text-white">
                        ${(salary.max / 1000).toFixed(0)}K
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-600">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Salary Range</span>
                      <span>
                        ${(salary.min / 1000).toFixed(0)}K - ${(salary.max / 1000).toFixed(0)}K
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Market Insights Summary */}
      <Card className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 border-slate-700 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-t-lg">
          <CardTitle className="flex items-center space-x-3 text-white">
            <Sparkles className="h-6 w-6 text-emerald-400" />
            <span className="text-2xl">Key Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <h4 className="text-white font-semibold mb-2 flex items-center space-x-2">
                <ArrowUp className="h-4 w-4 text-emerald-400" />
                <span>Growing Fields</span>
              </h4>
              <p className="text-slate-300 text-sm">
                Machine Learning, Cloud Computing, and DevOps are experiencing rapid growth with 15-25% year-over-year increases in job postings.
              </p>
            </div>
            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <h4 className="text-white font-semibold mb-2 flex items-center space-x-2">
                <Target className="h-4 w-4 text-blue-400" />
                <span>Skills to Focus On</span>
              </h4>
              <p className="text-slate-300 text-sm">
                React, TypeScript, and AWS certifications show the highest ROI. Consider prioritizing these for career advancement.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

