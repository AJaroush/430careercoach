import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Target, 
  TrendingUp, 
  Clock, 
  Star,
  Play,
  Plus,
  Filter,
  Award,
  Users,
  Calendar,
  Zap,
  Rocket,
  Sparkles,
  Trophy,
  Flame,
  Brain,
  Lightbulb,
  Medal,
  Crown
} from "lucide-react";

// Mock data
const mockRoadmapSteps = [
  { id: "foundation", title: "Foundation", progress: 100, isCompleted: true, isCurrent: false },
  { id: "core-skills", title: "Core Skills", progress: 65, isCompleted: false, isCurrent: true },
  { id: "project", title: "Project", progress: 0, isCompleted: false, isCurrent: false },
  { id: "certification", title: "Certification", progress: 0, isCompleted: false, isCurrent: false },
  { id: "applications", title: "Applications", progress: 0, isCompleted: false, isCurrent: false },
];

const mockCourses = [
  {
    id: "1",
    title: "Data Analysis with Python",
    platform: "Coursera",
    level: "Beginner",
    duration: "12h",
    rating: 4.8,
    skills: ["Python", "Pandas", "Data Viz"],
    thumbnail: "",
    isSaved: false,
    progress: 0,
  },
  {
    id: "2",
    title: "SQL for Analytics",
    platform: "Udemy",
    level: "Beginner",
    duration: "8h",
    rating: 4.6,
    skills: ["SQL", "Joins", "Queries"],
    thumbnail: "",
    isSaved: true,
    progress: 45,
  },
  {
    id: "3",
    title: "Statistics Essentials",
    platform: "edX",
    level: "Intermediate",
    duration: "10h",
    rating: 4.7,
    skills: ["Probability", "Inference", "Testing"],
    thumbnail: "",
    isSaved: false,
    progress: 0,
  },
];

const mockInsights = {
  weeklyFocus: "Finish Module 2 (Pandas) and complete the data visualization project.",
  trendingSkills: ["Machine Learning", "Data Visualization", "Python"],
  newCertificates: [
    { name: "Google Data Analytics Certificate", provider: "Google" },
    { name: "AWS Cloud Practitioner", provider: "Amazon" },
  ],
};

const mockStats = {
  coursesCompleted: 12,
  hoursLearned: 48,
  currentStreak: 7,
  nextMilestone: {
    target: 100,
    current: 73,
    reward: "Interview Master badge",
  },
};

const mockLeaderboard = [
  { rank: 1, name: "Alex Chen", points: 2847, badge: "🥇", courses: 45, streak: 21 },
  { rank: 2, name: "Sarah Johnson", points: 2653, badge: "🥈", courses: 38, streak: 18 },
  { rank: 3, name: "Mike Rodriguez", points: 2512, badge: "🥉", courses: 42, streak: 15 },
  { rank: 4, name: "Emma Wilson", points: 2341, badge: "4", courses: 35, streak: 12 },
  { rank: 5, name: "David Kim", points: 2189, badge: "5", courses: 32, streak: 10 },
  { rank: 6, name: "You", points: 73, badge: "⭐", courses: 12, streak: 7, isCurrentUser: true },
];

export default function Dashboard() {
  const [courses, setCourses] = useState(mockCourses);
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  
  // Get user data from localStorage or use default
  const getUserData = () => {
    try {
      const userData = localStorage.getItem('auth_user');
      if (userData) {
        const parsed = JSON.parse(userData);
        console.log('Dashboard: User data found:', parsed);
        return parsed;
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
    console.log('Dashboard: No user data found, using fallback');
    return { name: 'Rockstar', email: 'demo@example.com' };
  };
  
  const user = getUserData();
  console.log('Dashboard: Current user:', user);

  const handleSaveCourse = (courseId: string) => {
    setCourses((prev) =>
      prev.map((course) => (course.id === courseId ? { ...course, isSaved: !course.isSaved } : course)),
    );
  };

  const handleEnrollCourse = (courseId: string) => {
    console.log("Enrolling in course:", courseId);
  };

  const handleTakeAssessment = () => {
    console.log("Starting skills assessment");
  };

  const handleGenerateProjects = () => {
    console.log("Generating project ideas");
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section with Gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-white/20 rounded-full">
              <Sparkles className="h-6 w-6" />
            </div>
            <h1 className="text-4xl font-bold">yoyoyoyo, {user.name || 'Rockstar'}! 🚀</h1>
          </div>
          <p className="text-xl text-white/90 mb-6">
            Ready to level up your career? Let's make today count!
          </p>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
              <Flame className="h-4 w-4 text-orange-300" />
              <span className="font-semibold">7 Day Streak</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
              <Trophy className="h-4 w-4 text-yellow-300" />
              <span className="font-semibold">Level 5 Achiever</span>
            </div>
          </div>
        </div>
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/5 rounded-full"></div>
      </div>

      {/* Stats Cards with Animations */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-lg hover:shadow-xl">
          <CardContent className="p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold mb-1">{mockStats.coursesCompleted}</p>
                <p className="text-blue-100">Courses Completed</p>
              </div>
              <div className="p-3 bg-white/20 rounded-full group-hover:rotate-12 transition-transform">
                <BookOpen className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-green-500 to-green-600 border-0 shadow-lg hover:shadow-xl">
          <CardContent className="p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold mb-1">{mockStats.hoursLearned}</p>
                <p className="text-green-100">Hours Learned</p>
              </div>
              <div className="p-3 bg-white/20 rounded-full group-hover:rotate-12 transition-transform">
                <Clock className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-purple-500 to-purple-600 border-0 shadow-lg hover:shadow-xl">
          <CardContent className="p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold mb-1">{mockStats.currentStreak}</p>
                <p className="text-purple-100">Day Streak</p>
              </div>
              <div className="p-3 bg-white/20 rounded-full group-hover:rotate-12 transition-transform">
                <Flame className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-orange-500 to-orange-600 border-0 shadow-lg hover:shadow-xl">
          <CardContent className="p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold mb-1">{mockStats.nextMilestone.current}</p>
                <p className="text-orange-100">Progress Points</p>
              </div>
              <div className="p-3 bg-white/20 rounded-full group-hover:rotate-12 transition-transform">
                <Trophy className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Career Roadmap with Enhanced Visuals */}
      <Card className="bg-slate-800 border-slate-700 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg">
          <CardTitle className="flex items-center space-x-3 text-white">
            <div className="p-2 bg-blue-500 rounded-full">
              <Target className="h-5 w-5" />
            </div>
            <span className="text-xl">Your Career Growth Plan</span>
            <div className="ml-auto">
              <Badge className="bg-green-500 text-white">Active</Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {mockRoadmapSteps.map((step, index) => (
              <div key={step.id} className="group relative">
                <div className="flex items-center space-x-4">
                  <div className={`relative w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    step.isCompleted 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30' 
                      : step.isCurrent 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 animate-pulse' 
                      : 'bg-slate-600 text-slate-300 group-hover:bg-slate-500'
                  }`}>
                    {step.isCompleted ? (
                      <div className="flex items-center justify-center">
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                          <span className="text-green-600 text-xs">✓</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-lg">{index + 1}</span>
                    )}
                    {step.isCurrent && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-white text-lg">{step.title}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-slate-300">{step.progress}%</span>
                        {step.isCurrent && (
                          <Badge className="bg-blue-500 text-white text-xs animate-pulse">Current</Badge>
                        )}
                      </div>
                    </div>
                    <div className="relative">
                      <Progress 
                        value={step.progress} 
                        className="h-3 bg-slate-700" 
                      />
                      <div className={`absolute top-0 left-0 h-3 rounded-full transition-all duration-1000 ${
                        step.isCompleted 
                          ? 'bg-gradient-to-r from-green-500 to-green-600' 
                          : step.isCurrent 
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                          : 'bg-slate-600'
                      }`} style={{ width: `${step.progress}%` }}></div>
                    </div>
                  </div>
                </div>
                {index < mockRoadmapSteps.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-6 bg-slate-600"></div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-8 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <div className="space-y-6">
            {/* Recommended Courses with Enhanced Design */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Recommended Courses</h3>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFreeOnly(!showFreeOnly)}
                  className={`transition-all duration-300 ${
                    showFreeOnly 
                      ? 'bg-green-500 border-green-500 text-white hover:bg-green-600' 
                      : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {showFreeOnly ? "Show All" : "Free Only"}
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <Card key={course.id} className="group hover:scale-105 transition-all duration-300 bg-slate-800 border-slate-700 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg mb-2 text-white group-hover:text-blue-400 transition-colors">{course.title}</h4>
                          <div className="flex items-center space-x-2 mb-3">
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">{course.platform}</Badge>
                            <Badge className={`${
                              course.level === 'Beginner' 
                                ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                                : course.level === 'Intermediate' 
                                ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' 
                                : 'bg-red-500/20 text-red-400 border-red-500/30'
                            }`}>
                              {course.level}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSaveCourse(course.id)}
                          className="text-slate-400 hover:text-yellow-400 transition-colors"
                        >
                          <Star className={`h-5 w-5 transition-all duration-300 ${
                            course.isSaved 
                              ? 'fill-yellow-400 text-yellow-400 scale-110' 
                              : 'group-hover:scale-110'
                          }`} />
                        </Button>
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center space-x-1 text-slate-300">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">{course.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-slate-300">{course.rating}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {course.skills.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600 transition-colors">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      {course.progress > 0 && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-300">Progress</span>
                            <span className="text-blue-400 font-semibold">{course.progress}%</span>
                          </div>
                          <div className="relative">
                            <Progress value={course.progress} className="h-2 bg-slate-700" />
                            <div className="absolute top-0 left-0 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000" style={{ width: `${course.progress}%` }}></div>
                          </div>
                        </div>
                      )}

                      <div className="flex space-x-3">
                        <Button 
                          size="sm" 
                          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                          onClick={() => handleEnrollCourse(course.id)}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          {course.progress > 0 ? 'Continue' : 'Start'}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white transition-all duration-300"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Quick Actions with Enhanced Design */}
            <Card className="bg-slate-800 border-slate-700 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg">
                <CardTitle className="flex items-center space-x-3 text-white">
                  <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
                    <Zap className="h-5 w-5" />
                  </div>
                  <span className="text-xl">Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Button 
                    onClick={handleTakeAssessment} 
                    className="h-24 flex-col bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
                  >
                    <div className="p-3 bg-white/20 rounded-full mb-3 group-hover:rotate-12 transition-transform">
                      <Target className="h-8 w-8" />
                    </div>
                    <span className="text-lg">Take Skills Assessment</span>
                    <span className="text-sm opacity-80">Discover your strengths</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleGenerateProjects} 
                    className="h-24 flex-col bg-gradient-to-br from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group border-0"
                  >
                    <div className="p-3 bg-white/20 rounded-full mb-3 group-hover:rotate-12 transition-transform">
                      <Lightbulb className="h-8 w-8" />
                    </div>
                    <span className="text-lg">Generate Project Ideas</span>
                    <span className="text-sm opacity-80">Build your portfolio</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Sidebar */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            {/* Insights */}
            <Card className="bg-slate-800 border-slate-700 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg">
                <CardTitle className="flex items-center space-x-3 text-white">
                  <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full">
                    <Brain className="h-5 w-5" />
                  </div>
                  <span className="text-lg">Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
                  <h4 className="font-semibold mb-2 text-white flex items-center space-x-2">
                    <Target className="h-4 w-4 text-blue-400" />
                    <span>Weekly Focus</span>
                  </h4>
                  <p className="text-sm text-slate-300">{mockInsights.weeklyFocus}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-white flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    <span>Trending Skills</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {mockInsights.trendingSkills.map((skill) => (
                      <Badge key={skill} className="text-xs bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30 transition-colors">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-white flex items-center space-x-2">
                    <Award className="h-4 w-4 text-yellow-400" />
                    <span>New Certificates</span>
                  </h4>
                  <div className="space-y-3">
                    {mockInsights.newCertificates.map((cert, index) => (
                      <div key={index} className="p-3 bg-slate-700 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors">
                        <p className="font-medium text-white text-sm">{cert.name}</p>
                        <p className="text-slate-400 text-xs">{cert.provider}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress Milestone */}
            <Card className="bg-slate-800 border-slate-700 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg">
                <CardTitle className="flex items-center space-x-3 text-white">
                  <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <span className="text-lg">Next Milestone</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="relative mb-4">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {Math.round((mockStats.nextMilestone.current / mockStats.nextMilestone.target) * 100)}%
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">🎯</span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold mb-2 text-white">
                    {mockStats.nextMilestone.current}/{mockStats.nextMilestone.target}
                  </div>
                  <div className="relative mb-4">
                    <Progress 
                      value={(mockStats.nextMilestone.current / mockStats.nextMilestone.target) * 100} 
                      className="h-3 bg-slate-700" 
                    />
                    <div className="absolute top-0 left-0 h-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-1000" style={{ width: `${(mockStats.nextMilestone.current / mockStats.nextMilestone.target) * 100}%` }}></div>
                  </div>
                  <p className="text-sm text-slate-300 font-medium">
                    {mockStats.nextMilestone.reward}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
