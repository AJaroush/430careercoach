import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Mail, 
  Calendar, 
  Award, 
  Target,
  BookOpen,
  TrendingUp,
  Settings,
  Edit,
  Sparkles,
  Zap,
  Star,
  Trophy,
  Flame,
  Brain,
  Clock,
  CheckCircle
} from "lucide-react";

// Get user data from localStorage or use default
const getUserData = () => {
  try {
    const userData = localStorage.getItem('auth_user');
    if (userData) {
      const parsed = JSON.parse(userData);
      return {
        name: parsed.name || "Demo User",
        email: parsed.email || "demo@example.com",
        joinDate: "January 2024",
        avatar: parsed.picture || "",
        level: "Intermediate",
        totalPoints: 1250,
        provider: parsed.provider || "demo"
      };
    }
  } catch (error) {
    console.error('Error parsing user data:', error);
  }
  return {
    name: "Demo User",
    email: "demo@example.com",
    joinDate: "January 2024",
    avatar: "",
    level: "Intermediate",
    totalPoints: 1250,
    provider: "demo"
  };
};

// Mock user data (will be overridden by getUserData)
const mockUser = {
  name: "Demo User",
  email: "demo@example.com",
  joinDate: "January 2024",
  avatar: "",
  level: "Intermediate",
  totalPoints: 1250,
  badges: [
    { name: "First Course", description: "Completed your first course", icon: "graduation", color: "blue" },
    { name: "Week Warrior", description: "7-day learning streak", icon: "flame", color: "orange" },
    { name: "Quiz Master", description: "Scored 90%+ on 10 quizzes", icon: "brain", color: "purple" },
  ],
  stats: {
    coursesCompleted: 12,
    hoursLearned: 48,
    currentStreak: 7,
    certificates: 3,
  },
  recentActivity: [
    { type: "course", title: "Data Analysis with Python", date: "2 days ago", status: "completed" },
    { type: "quiz", title: "SQL Fundamentals Quiz", date: "3 days ago", status: "passed" },
    { type: "course", title: "React for Beginners", date: "1 week ago", status: "in-progress" },
    { type: "badge", title: "Week Warrior Badge", date: "1 week ago", status: "earned" },
  ],
  goals: [
    { title: "Complete 5 courses this month", progress: 60, target: 5, current: 3 },
    { title: "Maintain 30-day learning streak", progress: 23, target: 30, current: 7 },
    { title: "Earn 3 new certificates", progress: 100, target: 3, current: 3 },
  ]
};

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(() => {
    const userFromStorage = getUserData();
    return { ...mockUser, ...userFromStorage };
  });

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, this would save to backend
  };

  const handleInputChange = (field: string, value: string) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getBadgeIcon = (iconType: string) => {
    switch (iconType) {
      case 'graduation': return <Trophy className="h-8 w-8" />;
      case 'flame': return <Flame className="h-8 w-8" />;
      case 'brain': return <Brain className="h-8 w-8" />;
      default: return <Award className="h-8 w-8" />;
    }
  };

  const getBadgeColor = (color: string) => {
    switch (color) {
      case 'blue': return 'from-blue-500/20 to-blue-600/20 text-blue-400';
      case 'orange': return 'from-orange-500/20 to-orange-600/20 text-orange-400';
      case 'purple': return 'from-purple-500/20 to-purple-600/20 text-purple-400';
      default: return 'from-gray-500/20 to-gray-600/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with Gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-white/20 rounded-full">
                <User className="h-6 w-6" />
              </div>
              <h1 className="text-4xl font-bold">Profile</h1>
            </div>
            <p className="text-xl text-white/90">
              Manage your account settings and track your progress.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <Card className="bg-slate-800 border-slate-700 hover:border-blue-500/50 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="relative mb-6">
                <Avatar className="h-32 w-32 mx-auto border-4 border-blue-500/20">
                  <AvatarImage src={userData.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl">
                    <User className="h-16 w-16" />
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
              </div>
              
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-slate-300">Name</Label>
                    <Input
                      id="name"
                      value={userData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-slate-300">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <Button onClick={handleSave} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Save Changes
                  </Button>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-white">{userData.name}</h2>
                  <p className="text-slate-300 mb-3">{userData.email}</p>
                  <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
                    {userData.level}
                  </Badge>
                  <div className="flex items-center justify-center space-x-2 text-sm text-slate-400">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {userData.joinDate}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats */}
          <Card className="mt-6 bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center space-x-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                <span>Statistics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center group">
                  <div className="relative">
                    <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text group-hover:scale-110 transition-transform duration-300">
                      {userData.stats.coursesCompleted}
                    </div>
                    <div className="absolute inset-0 text-3xl font-bold text-blue-400/20 blur-sm">
                      {userData.stats.coursesCompleted}
                    </div>
                  </div>
                  <div className="text-sm text-slate-300">Courses</div>
                </div>
                <div className="text-center group">
                  <div className="relative">
                    <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-green-400 to-green-600 bg-clip-text group-hover:scale-110 transition-transform duration-300">
                      {userData.stats.hoursLearned}
                    </div>
                    <div className="absolute inset-0 text-3xl font-bold text-green-400/20 blur-sm">
                      {userData.stats.hoursLearned}
                    </div>
                  </div>
                  <div className="text-sm text-slate-300">Hours</div>
                </div>
                <div className="text-center group">
                  <div className="relative">
                    <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text group-hover:scale-110 transition-transform duration-300">
                      {userData.stats.currentStreak}
                    </div>
                    <div className="absolute inset-0 text-3xl font-bold text-orange-400/20 blur-sm">
                      {userData.stats.currentStreak}
                    </div>
                  </div>
                  <div className="text-sm text-slate-300">Streak</div>
                </div>
                <div className="text-center group">
                  <div className="relative">
                    <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text group-hover:scale-110 transition-transform duration-300">
                      {userData.stats.certificates}
                    </div>
                    <div className="absolute inset-0 text-3xl font-bold text-purple-400/20 blur-sm">
                      {userData.stats.certificates}
                    </div>
                  </div>
                  <div className="text-sm text-slate-300">Certificates</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Goals */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Target className="h-5 w-5 text-blue-400" />
                <span>Goals & Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {userData.goals.map((goal, index) => (
                <div key={index} className="space-y-3 p-4 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-blue-500/50 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white">{goal.title}</span>
                    <span className="text-sm text-slate-300 bg-slate-600 px-2 py-1 rounded-full">
                      {goal.current}/{goal.target}
                    </span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-1000 ease-out" 
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">{goal.progress}% complete</span>
                    <span className="text-slate-400">{goal.target - goal.current} remaining</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Badges */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Trophy className="h-5 w-5 text-yellow-400" />
                <span>Achievements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {userData.badges.map((badge, index) => (
                  <div key={index} className="text-center p-6 bg-slate-700/50 border border-slate-600 rounded-xl hover:border-blue-500/50 transition-all duration-300 group">
                    <div className={`w-16 h-16 bg-gradient-to-br ${getBadgeColor(badge.color)} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      {getBadgeIcon(badge.icon)}
                    </div>
                    <h3 className="font-semibold mb-2 text-white">{badge.name}</h3>
                    <p className="text-sm text-slate-300">{badge.description}</p>
                    <div className="mt-3 flex items-center justify-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <TrendingUp className="h-5 w-5 text-green-400" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-slate-700/50 border border-slate-600 rounded-lg hover:border-blue-500/50 transition-all duration-300 group">
                    <div className="flex-shrink-0">
                      {activity.type === 'course' && (
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-blue-400" />
                        </div>
                      )}
                      {activity.type === 'quiz' && (
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg flex items-center justify-center">
                          <Target className="h-5 w-5 text-green-400" />
                        </div>
                      )}
                      {activity.type === 'badge' && (
                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-lg flex items-center justify-center">
                          <Award className="h-5 w-5 text-yellow-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{activity.title}</h4>
                      <div className="flex items-center space-x-2 text-sm text-slate-400">
                        <Clock className="h-3 w-3" />
                        <span>{activity.date}</span>
                      </div>
                    </div>
                    <Badge 
                      className={`${
                        activity.status === 'completed' || activity.status === 'passed' || activity.status === 'earned' 
                          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                          : 'bg-slate-600 text-slate-300'
                      } border-0`}
                    >
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
