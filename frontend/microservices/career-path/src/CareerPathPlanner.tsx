import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Map, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Target,
  Calendar,
  Award,
  TrendingUp,
  Sparkles,
  Edit2,
  Trash2,
  ArrowRight,
  Clock,
  Upload,
  FileText,
  X,
  Zap,
  Lightbulb
} from "lucide-react";

type Milestone = {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  status: 'not-started' | 'in-progress' | 'completed';
  category: 'skill' | 'certification' | 'project' | 'role' | 'other';
  priority: 'low' | 'medium' | 'high';
};

const defaultMilestones: Milestone[] = [
  {
    id: '1',
    title: 'Complete Advanced React Course',
    description: 'Master advanced React patterns and state management',
    targetDate: '2024-12-31',
    status: 'not-started',
    category: 'skill',
    priority: 'high'
  },
  {
    id: '2',
    title: 'AWS Cloud Practitioner Certification',
    description: 'Get certified in AWS fundamentals',
    targetDate: '2025-02-28',
    status: 'not-started',
    category: 'certification',
    priority: 'medium'
  },
  {
    id: '3',
    title: 'Build Portfolio Project',
    description: 'Create a full-stack application showcasing skills',
    targetDate: '2025-01-15',
    status: 'in-progress',
    category: 'project',
    priority: 'high'
  }
];

type CVAnalysis = {
  skills: string[];
  strengths: string[];
  areas_for_improvement: string[];
  experience_years?: number;
  current_role?: string;
};

const API_BASE_URL = 'http://localhost:8000/api/cv/public';

export default function CareerPathPlanner() {
  const [milestones, setMilestones] = useState<Milestone[]>(defaultMilestones);
  const [isAdding, setIsAdding] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    targetDate: '',
    category: 'skill' as Milestone['category'],
    priority: 'medium' as Milestone['priority']
  });
  const [cvAnalysis, setCvAnalysis] = useState<CVAnalysis | null>(null);
  const [uploadedCV, setUploadedCV] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestedMilestones, setSuggestedMilestones] = useState<Milestone[]>([]);

  // Load CV analysis from localStorage
  useEffect(() => {
    const savedAnalysis = localStorage.getItem('cv_analysis');
    if (savedAnalysis) {
      try {
        const analysis = JSON.parse(savedAnalysis);
        setCvAnalysis(analysis);
        generateSuggestedMilestones(analysis);
      } catch (e) {
        console.error('Error loading saved CV analysis:', e);
      }
    }
  }, []);

  const generateSuggestedMilestones = (analysis: CVAnalysis) => {
    const suggestions: Milestone[] = [];
    const skills = analysis.skills.map(s => s.toLowerCase());
    const improvementAreas = analysis.areas_for_improvement || [];
    
    // Generate milestones based on improvement areas
    improvementAreas.slice(0, 3).forEach((area, index) => {
      const areaLower = area.toLowerCase();
      let category: Milestone['category'] = 'skill';
      let priority: Milestone['priority'] = 'medium';

      if (areaLower.includes('certification') || areaLower.includes('certificate')) {
        category = 'certification';
        priority = 'high';
      } else if (areaLower.includes('project') || areaLower.includes('portfolio')) {
        category = 'project';
        priority = 'high';
      } else if (areaLower.includes('role') || areaLower.includes('position')) {
        category = 'role';
        priority = 'high';
      }

      // Extract key skill from improvement area
      const skillMatch = skills.find(s => areaLower.includes(s) || s.includes(areaLower.split(' ')[0]));
      
      suggestions.push({
        id: `suggested-${index}`,
        title: `Master ${area.split(' ').slice(0, 3).join(' ')}`,
        description: `Focus on developing ${area.toLowerCase()} to advance your career`,
        targetDate: new Date(Date.now() + (index + 1) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'not-started',
        category,
        priority
      });
    });

    // Add skill-based milestones
    if (skills.length > 0) {
      const topSkills = skills.slice(0, 2);
      topSkills.forEach((skill, index) => {
        if (!suggestions.some(s => s.title.toLowerCase().includes(skill))) {
          suggestions.push({
            id: `skill-${index}`,
            title: `Advanced ${skill.charAt(0).toUpperCase() + skill.slice(1)} Training`,
            description: `Deepen your expertise in ${skill}`,
            targetDate: new Date(Date.now() + (index + 2) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'not-started',
            category: 'skill',
            priority: 'medium'
          });
        }
      });
    }

    setSuggestedMilestones(suggestions);
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
          generateSuggestedMilestones(analysis);
        }
      }
    } catch (error: any) {
      console.error('CV analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addSuggestedMilestone = (milestone: Milestone) => {
    setMilestones([...milestones, { ...milestone, id: Date.now().toString() }]);
    setSuggestedMilestones(suggestedMilestones.filter(m => m.id !== milestone.id));
  };

  const completedCount = milestones.filter(m => m.status === 'completed').length;
  const inProgressCount = milestones.filter(m => m.status === 'in-progress').length;
  const overallProgress = milestones.length > 0 
    ? (completedCount / milestones.length) * 100 
    : 0;

  const handleAddMilestone = () => {
    if (newMilestone.title && newMilestone.targetDate) {
      const milestone: Milestone = {
        id: Date.now().toString(),
        ...newMilestone,
        status: 'not-started'
      };
      setMilestones([...milestones, milestone]);
      setNewMilestone({
        title: '',
        description: '',
        targetDate: '',
        category: 'skill',
        priority: 'medium'
      });
      setIsAdding(false);
    }
  };

  const handleStatusChange = (id: string, status: Milestone['status']) => {
    setMilestones(milestones.map(m => 
      m.id === id ? { ...m, status } : m
    ));
  };

  const handleDelete = (id: string) => {
    setMilestones(milestones.filter(m => m.id !== id));
  };

  const getCategoryIcon = (category: Milestone['category']) => {
    switch (category) {
      case 'skill': return <TrendingUp className="h-4 w-4" />;
      case 'certification': return <Award className="h-4 w-4" />;
      case 'project': return <Target className="h-4 w-4" />;
      case 'role': return <Sparkles className="h-4 w-4" />;
      default: return <Circle className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: Milestone['category']) => {
    switch (category) {
      case 'skill': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'certification': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'project': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'role': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getPriorityColor = (priority: Milestone['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-white/20 rounded-full">
              <Map className="h-6 w-6" />
            </div>
            <h1 className="text-4xl font-bold">Career Path Planner</h1>
          </div>
          <p className="text-xl text-white/90">
            Map your journey to success with personalized milestones and goals.
          </p>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-lg">
          <CardContent className="p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold mb-1">{Math.round(overallProgress)}%</p>
                <p className="text-blue-100">Overall Progress</p>
              </div>
              <TrendingUp className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 border-0 shadow-lg">
          <CardContent className="p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold mb-1">{completedCount}</p>
                <p className="text-green-100">Completed</p>
              </div>
              <CheckCircle2 className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 border-0 shadow-lg">
          <CardContent className="p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold mb-1">{inProgressCount}</p>
                <p className="text-yellow-100">In Progress</p>
              </div>
              <Clock className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 shadow-lg">
          <CardContent className="p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold mb-1">{milestones.length}</p>
                <p className="text-purple-100">Total Milestones</p>
              </div>
              <Target className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CV Upload Section */}
      {!cvAnalysis && (
        <Card className="bg-slate-800 border-slate-700 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg">
            <CardTitle className="flex items-center space-x-3 text-white">
              <FileText className="h-6 w-6 text-blue-400" />
              <span className="text-xl">Get Personalized Milestone Suggestions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <p className="text-slate-300">
                Upload your CV to get AI-powered milestone suggestions based on your skills and career goals.
              </p>
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleCVUpload}
                  className="hidden"
                  id="cv-upload-planner"
                />
                <label
                  htmlFor="cv-upload-planner"
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
                      setSuggestedMilestones([]);
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

      {/* Suggested Milestones */}
      {cvAnalysis && suggestedMilestones.length > 0 && (
        <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-t-lg">
            <CardTitle className="flex items-center space-x-3 text-white">
              <Lightbulb className="h-6 w-6 text-yellow-400" />
              <span className="text-2xl">AI-Suggested Milestones</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-slate-300 mb-4 text-sm">
              Based on your CV analysis, here are personalized milestones to help you achieve your career goals:
            </p>
            <div className="space-y-3">
              {suggestedMilestones.map((milestone) => (
                <Card key={milestone.id} className="bg-slate-700/50 border-slate-600">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="text-white font-semibold">{milestone.title}</h4>
                          <Badge className={getCategoryColor(milestone.category)}>
                            {milestone.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-300 mb-2">{milestone.description}</p>
                        <p className="text-xs text-slate-400">
                          Target: {new Date(milestone.targetDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => addSuggestedMilestone(milestone)}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white ml-4"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overall Progress */}
      <Card className="bg-slate-800 border-slate-700 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <span>Your Career Journey</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-300">Progress to Career Goals</span>
              <span className="text-white font-semibold">{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-4 bg-slate-700" />
          </div>
          {cvAnalysis && (
            <div className="mt-4 pt-4 border-t border-slate-700">
              <p className="text-sm text-slate-400 mb-2">Based on your CV:</p>
              <div className="flex flex-wrap gap-2">
                {cvAnalysis.skills.slice(0, 5).map((skill, i) => (
                  <Badge key={i} variant="outline" className="bg-slate-700 border-slate-600 text-slate-300">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Milestones Timeline */}
      <Card className="bg-slate-800 border-slate-700 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg">
          <CardTitle className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-3">
              <Target className="h-6 w-6 text-purple-400" />
              <span className="text-2xl">Career Milestones</span>
            </div>
            <Button
              onClick={() => setIsAdding(!isAdding)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Milestone
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {isAdding && (
            <Card className="bg-slate-700/50 border-slate-600 mb-6">
              <CardContent className="p-6 space-y-4">
                <Input
                  placeholder="Milestone title"
                  value={newMilestone.title}
                  onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                  className="bg-slate-600 border-slate-500 text-white"
                />
                <Input
                  placeholder="Description"
                  value={newMilestone.description}
                  onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                  className="bg-slate-600 border-slate-500 text-white"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="date"
                    value={newMilestone.targetDate}
                    onChange={(e) => setNewMilestone({ ...newMilestone, targetDate: e.target.value })}
                    className="bg-slate-600 border-slate-500 text-white"
                  />
                  <select
                    value={newMilestone.category}
                    onChange={(e) => setNewMilestone({ ...newMilestone, category: e.target.value as Milestone['category'] })}
                    className="bg-slate-600 border border-slate-500 text-white rounded-md px-3 py-2"
                  >
                    <option value="skill">Skill Development</option>
                    <option value="certification">Certification</option>
                    <option value="project">Project</option>
                    <option value="role">Role Change</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsAdding(false)}
                    className="bg-slate-600 border-slate-500 text-slate-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddMilestone}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                  >
                    Add Milestone
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <Card
                key={milestone.id}
                className={`bg-slate-700/50 border-slate-600 hover:border-slate-500 transition-all ${
                  milestone.status === 'completed' ? 'opacity-75' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`p-2 rounded-lg ${getCategoryColor(milestone.category)}`}>
                          {getCategoryIcon(milestone.category)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className={`text-lg font-semibold ${
                              milestone.status === 'completed' ? 'line-through text-slate-400' : 'text-white'
                            }`}>
                              {milestone.title}
                            </h3>
                            <Badge className={getCategoryColor(milestone.category)}>
                              {milestone.category}
                            </Badge>
                            <Badge className={getPriorityColor(milestone.priority)}>
                              {milestone.priority}
                            </Badge>
                          </div>
                          <p className="text-slate-300 text-sm mb-2">{milestone.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-slate-400">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>Target: {new Date(milestone.targetDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <select
                        value={milestone.status}
                        onChange={(e) => handleStatusChange(milestone.id, e.target.value as Milestone['status'])}
                        className="bg-slate-600 border border-slate-500 text-white rounded-md px-3 py-2 text-sm"
                      >
                        <option value="not-started">Not Started</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(milestone.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {milestone.status === 'in-progress' && (
                    <div className="mt-4 pt-4 border-t border-slate-600">
                      <div className="flex items-center space-x-2 text-sm text-blue-400">
                        <Clock className="h-4 w-4" />
                        <span>In progress - Keep going!</span>
                      </div>
                    </div>
                  )}
                  {milestone.status === 'completed' && (
                    <div className="mt-4 pt-4 border-t border-slate-600">
                      <div className="flex items-center space-x-2 text-sm text-green-400">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Completed! Great work!</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {milestones.length === 0 && (
            <div className="text-center py-12">
              <Target className="h-16 w-16 mx-auto mb-4 text-slate-600" />
              <p className="text-slate-400 mb-4">No milestones yet. Start planning your career path!</p>
              <Button
                onClick={() => setIsAdding(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Milestone
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

