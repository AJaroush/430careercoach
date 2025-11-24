import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  Star,
  Sparkles,
  Zap,
  ArrowRight,
  Flag,
  Users,
  BookOpen,
  Briefcase,
  DollarSign
} from "lucide-react";

// Mock career goals data
const mockGoals = [
  {
    id: 1,
    title: "Become a Senior Software Engineer",
    description: "Advance to senior level within 2 years with expertise in React, Node.js, and cloud technologies",
    category: "Career Advancement",
    priority: "High",
    deadline: "2025-12-31",
    progress: 65,
    milestones: [
      { title: "Complete React Advanced Course", completed: true },
      { title: "Lead 2 major projects", completed: true },
      { title: "Get AWS certification", completed: false },
      { title: "Mentor junior developers", completed: false }
    ],
    skills: ["React", "Node.js", "AWS", "Leadership"],
    estimatedHours: 200,
    completedHours: 130
  },
  {
    id: 2,
    title: "Start a Tech Blog",
    description: "Create and maintain a technical blog with 50+ articles about web development",
    category: "Personal Branding",
    priority: "Medium",
    deadline: "2024-06-30",
    progress: 40,
    milestones: [
      { title: "Set up blog platform", completed: true },
      { title: "Write 20 articles", completed: true },
      { title: "Reach 1000 subscribers", completed: false },
      { title: "Monetize the blog", completed: false }
    ],
    skills: ["Writing", "SEO", "Marketing", "Content Creation"],
    estimatedHours: 150,
    completedHours: 60
  },
  {
    id: 3,
    title: "Learn Machine Learning",
    description: "Master ML fundamentals and build 3 practical projects",
    category: "Skill Development",
    priority: "High",
    deadline: "2024-09-15",
    progress: 25,
    milestones: [
      { title: "Complete ML fundamentals course", completed: false },
      { title: "Build recommendation system", completed: false },
      { title: "Create image classifier", completed: false },
      { title: "Deploy ML model to cloud", completed: false }
    ],
    skills: ["Python", "TensorFlow", "Data Science", "Statistics"],
    estimatedHours: 300,
    completedHours: 75
  }
];

const categories = [
  { name: "Career Advancement", icon: TrendingUp, color: "blue" },
  { name: "Skill Development", icon: BookOpen, color: "green" },
  { name: "Personal Branding", icon: Users, color: "purple" },
  { name: "Financial Goals", icon: DollarSign, color: "yellow" },
  { name: "Leadership", icon: Briefcase, color: "orange" }
];

export default function CareerGoals() {
  const [goals, setGoals] = useState(mockGoals);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const getCategoryIcon = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.icon : Target;
  };

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.color : "gray";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "from-red-500 to-red-600";
      case "Medium": return "from-yellow-500 to-yellow-600";
      case "Low": return "from-green-500 to-green-600";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const filteredGoals = selectedCategory === "All" 
    ? goals 
    : goals.filter(goal => goal.category === selectedCategory);

  const totalGoals = goals.length;
  const completedGoals = goals.filter(goal => goal.progress === 100).length;
  const averageProgress = Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length);

  return (
    <div className="space-y-8">
      {/* Header with Gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-white/20 rounded-full">
                  <Target className="h-6 w-6" />
                </div>
                <h1 className="text-4xl font-bold">Career Goals</h1>
              </div>
              <p className="text-xl text-white/90">
                Set, track, and achieve your professional milestones
              </p>
            </div>
            <Button
              onClick={() => setIsAddingGoal(true)}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700 hover:border-blue-500/50 transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="relative">
              <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text">
                {totalGoals}
              </div>
              <div className="absolute inset-0 text-3xl font-bold text-blue-400/20 blur-sm">
                {totalGoals}
              </div>
            </div>
            <div className="text-sm text-slate-300 mt-2">Total Goals</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700 hover:border-green-500/50 transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="relative">
              <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-green-400 to-green-600 bg-clip-text">
                {completedGoals}
              </div>
              <div className="absolute inset-0 text-3xl font-bold text-green-400/20 blur-sm">
                {completedGoals}
              </div>
            </div>
            <div className="text-sm text-slate-300 mt-2">Completed</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700 hover:border-purple-500/50 transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="relative">
              <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text">
                {averageProgress}%
              </div>
              <div className="absolute inset-0 text-3xl font-bold text-purple-400/20 blur-sm">
                {averageProgress}%
              </div>
            </div>
            <div className="text-sm text-slate-300 mt-2">Avg Progress</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700 hover:border-orange-500/50 transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="relative">
              <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text">
                {goals.reduce((sum, goal) => sum + goal.completedHours, 0)}
              </div>
              <div className="absolute inset-0 text-3xl font-bold text-orange-400/20 blur-sm">
                {goals.reduce((sum, goal) => sum + goal.completedHours, 0)}
              </div>
            </div>
            <div className="text-sm text-slate-300 mt-2">Hours Invested</div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-blue-400" />
            <span>Filter by Category</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              variant={selectedCategory === "All" ? "default" : "outline"}
              onClick={() => setSelectedCategory("All")}
              className={selectedCategory === "All" 
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0" 
                : "border-slate-600 text-slate-300 hover:bg-slate-700"
              }
            >
              All Goals
            </Button>
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.name}
                  variant={selectedCategory === category.name ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.name)}
                  className={selectedCategory === category.name 
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0" 
                    : "border-slate-600 text-slate-300 hover:bg-slate-700"
                  }
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {category.name}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Goals List */}
      <div className="space-y-6">
        {filteredGoals.map((goal) => {
          const CategoryIcon = getCategoryIcon(goal.category);
          const categoryColor = getCategoryColor(goal.category);
          
          return (
            <Card key={goal.id} className="bg-slate-800 border-slate-700 hover:border-blue-500/50 transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-br from-${categoryColor}-500/20 to-${categoryColor}-600/20 rounded-xl flex items-center justify-center`}>
                      <CategoryIcon className={`h-6 w-6 text-${categoryColor}-400`} />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-white mb-2">{goal.title}</CardTitle>
                      <p className="text-slate-300 mb-3">{goal.description}</p>
                      <div className="flex items-center space-x-4">
                        <Badge className={`bg-gradient-to-r ${getPriorityColor(goal.priority)} text-white border-0`}>
                          {goal.priority} Priority
                        </Badge>
                        <div className="flex items-center space-x-1 text-slate-400">
                          <Calendar className="h-4 w-4" />
                          <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Progress</span>
                    <span className="text-sm text-slate-300">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-1000 ease-out" 
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Hours Progress */}
                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-400" />
                    <span className="text-slate-300">Time Investment</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold">{goal.completedHours} / {goal.estimatedHours} hours</div>
                    <div className="text-sm text-slate-400">
                      {Math.round((goal.completedHours / goal.estimatedHours) * 100)}% complete
                    </div>
                  </div>
                </div>

                {/* Milestones */}
                <div className="space-y-3">
                  <h4 className="text-white font-semibold flex items-center space-x-2">
                    <Flag className="h-4 w-4 text-green-400" />
                    <span>Milestones</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {goal.milestones.map((milestone, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-slate-700/50 rounded-lg">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          milestone.completed 
                            ? 'bg-gradient-to-r from-green-500 to-green-600' 
                            : 'bg-slate-600'
                        }`}>
                          {milestone.completed ? (
                            <CheckCircle className="h-4 w-4 text-white" />
                          ) : (
                            <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                          )}
                        </div>
                        <span className={`text-sm ${milestone.completed ? 'text-white' : 'text-slate-300'}`}>
                          {milestone.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-3">
                  <h4 className="text-white font-semibold flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span>Skills to Develop</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {goal.skills.map((skill, index) => (
                      <Badge key={index} className="bg-slate-600 text-slate-300 border-0">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Goal Modal Placeholder */}
      {isAddingGoal && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Add New Career Goal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-slate-300">Goal Title</Label>
              <Input
                id="title"
                placeholder="e.g., Become a Senior Developer"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-slate-300">Description</Label>
              <Input
                id="description"
                placeholder="Describe your goal in detail"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="flex space-x-4">
              <Button 
                onClick={() => setIsAddingGoal(false)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Save Goal
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsAddingGoal(false)}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
