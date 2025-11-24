import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Clock, 
  Star,
  BookOpen,
  Target,
  TrendingUp,
  MessageSquare,
  Zap,
  Trophy,
  Flame,
  Brain,
  Sparkles,
  Play,
  CheckCircle
} from "lucide-react";

type Question = {
  id: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  timeEstimate: string;
  isCompleted: boolean;
  isSaved: boolean;
  hints: string[];
  sampleAnswer: string;
};

const categories = [
  { id: "technical", label: "Technical" },
  { id: "behavioral", label: "Behavioral" },
  { id: "case", label: "Case Study" },
  { id: "hr", label: "HR Questions" },
];

const mockQuestions: Question[] = [
  {
    id: "1",
    title: "Explain Big-O notation for your solution",
    category: "technical",
    difficulty: "Intermediate",
    tags: ["Algorithms", "Complexity"],
    timeEstimate: "15 min",
    isCompleted: false,
    isSaved: false,
    hints: ["Start with time complexity", "Consider space complexity", "Give examples with different inputs"],
    sampleAnswer: "Big-O notation describes the upper bound of algorithm performance. For example, O(n) means linear time complexity where execution time grows proportionally with input size.",
  },
  {
    id: "2",
    title: "Tell me about a time you handled conflicting priorities",
    category: "behavioral",
    difficulty: "Beginner",
    tags: ["Leadership", "Time Management"],
    timeEstimate: "10 min",
    isCompleted: true,
    isSaved: true,
    hints: ["Use STAR method", "Be specific about the situation", "Focus on your actions and results"],
    sampleAnswer: "Use the STAR method: Situation (context), Task (what needed to be done), Action (what you did), Result (outcome). Be specific and quantify results when possible.",
  },
  {
    id: "3",
    title: "Estimate daily ride demand for a new city",
    category: "case",
    difficulty: "Advanced",
    tags: ["Estimation", "Market Analysis"],
    timeEstimate: "30 min",
    isCompleted: false,
    isSaved: false,
    hints: [
      "Break down by population segments",
      "Consider usage patterns",
      "Factor in competition and market penetration",
    ],
    sampleAnswer: "Start with population size, segment by demographics, estimate adoption rates, consider daily usage patterns, and factor in seasonal variations.",
  },
  {
    id: "4",
    title: "Why this role at our company?",
    category: "hr",
    difficulty: "Beginner",
    tags: ["Motivation", "Company Research"],
    timeEstimate: "5 min",
    isCompleted: false,
    isSaved: false,
    hints: ["Research the company values", "Connect your goals with role requirements", "Be genuine and specific"],
    sampleAnswer: "Connect your career goals with the specific role and company mission. Show you've researched the company and explain how you can contribute to their success.",
  },
];

const mockStats = {
  weeklyQuestions: 25,
  currentStreak: 7,
  nextMilestone: {
    target: 100,
    current: 73,
    reward: "Interview Master badge",
  },
};

export default function InterviewPrep() {
  const [activeCategory, setActiveCategory] = useState("technical");
  const [questions, setQuestions] = useState(mockQuestions);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");

  const filteredQuestions = questions.filter((question) => {
    const matchesCategory = question.category === activeCategory;
    const matchesSearch =
      question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDifficulty = difficultyFilter === "all" || question.difficulty.toLowerCase() === difficultyFilter;
    const matchesTime = timeFilter === "all" || question.timeEstimate.includes(timeFilter);
    return matchesCategory && matchesSearch && matchesDifficulty && matchesTime;
  });

  const handleSaveQuestion = (questionId: string) => {
    setQuestions((prev) => prev.map((q) => (q.id === questionId ? { ...q, isSaved: !q.isSaved } : q)));
  };

  const handleMarkDone = (questionId: string) => {
    setQuestions((prev) => prev.map((q) => (q.id === questionId ? { ...q, isCompleted: !q.isCompleted } : q)));
  };

  const handlePracticeQuestion = (question: Question) => {
    console.log("Practicing question:", question.title);
    // In a real app, this would open a practice modal or redirect to practice page
  };

  return (
    <div className="space-y-8">
      {/* Header with Gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-white/20 rounded-full">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h1 className="text-4xl font-bold">Interview Preparation 🎯</h1>
          </div>
          <p className="text-xl text-white/90 mb-6">
            Practice questions tailored to your target role and crush your next interview!
          </p>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
              <Brain className="h-4 w-4 text-cyan-300" />
              <span className="font-semibold">Smart Practice</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
              <Zap className="h-4 w-4 text-yellow-300" />
              <span className="font-semibold">AI-Powered</span>
            </div>
          </div>
        </div>
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/5 rounded-full"></div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-lg hover:shadow-xl">
          <CardContent className="p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold mb-1">{mockStats.weeklyQuestions}</p>
                <p className="text-blue-100">Questions This Week</p>
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
                <p className="text-3xl font-bold mb-1">{mockStats.currentStreak}</p>
                <p className="text-green-100">Day Streak</p>
              </div>
              <div className="p-3 bg-white/20 rounded-full group-hover:rotate-12 transition-transform">
                <Flame className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-purple-500 to-purple-600 border-0 shadow-lg hover:shadow-xl">
          <CardContent className="p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold mb-1">{mockStats.nextMilestone.current}</p>
                <p className="text-purple-100">Progress Points</p>
              </div>
              <div className="p-3 bg-white/20 rounded-full group-hover:rotate-12 transition-transform">
                <Trophy className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Category Tabs */}
      <Card className="bg-slate-800 border-slate-700 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg">
          <CardTitle className="flex items-center space-x-3 text-white">
            <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full">
              <Target className="h-5 w-5" />
            </div>
            <span className="text-xl">Question Categories</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-3 mb-6">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                onClick={() => setActiveCategory(category.id)}
                className={`transition-all duration-300 ${
                  activeCategory === category.id 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg' 
                    : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white'
                }`}
              >
                {category.label}
              </Button>
            ))}
          </div>

          {/* Enhanced Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search questions or tags..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />
            </div>
            <div className="flex gap-3">
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="w-36 bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600 z-50">
                  <SelectItem value="all" className="text-white hover:bg-slate-600">All Levels</SelectItem>
                  <SelectItem value="beginner" className="text-white hover:bg-slate-600">Beginner</SelectItem>
                  <SelectItem value="intermediate" className="text-white hover:bg-slate-600">Intermediate</SelectItem>
                  <SelectItem value="advanced" className="text-white hover:bg-slate-600">Advanced</SelectItem>
                </SelectContent>
              </Select>
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-36 bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Time" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600 z-50">
                  <SelectItem value="all" className="text-white hover:bg-slate-600">Any Time</SelectItem>
                  <SelectItem value="5" className="text-white hover:bg-slate-600">5 min</SelectItem>
                  <SelectItem value="10" className="text-white hover:bg-slate-600">10 min</SelectItem>
                  <SelectItem value="15" className="text-white hover:bg-slate-600">15 min</SelectItem>
                  <SelectItem value="30" className="text-white hover:bg-slate-600">30 min</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-slate-300 text-lg">
          {filteredQuestions.length} {filteredQuestions.length === 1 ? 'question' : 'questions'} in {categories.find((c) => c.id === activeCategory)?.label}
        </p>
        {filteredQuestions.length > 0 && (
          <Button className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <Filter className="h-4 w-4 mr-2" />
            Practice Set ({Math.min(filteredQuestions.length, 10)})
          </Button>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        <div className="lg:col-span-3">
          {filteredQuestions.length > 0 ? (
            <div className="space-y-6">
              {filteredQuestions.map((question) => (
                <Card key={question.id} className="group hover:scale-[1.02] transition-all duration-300 bg-slate-800 border-slate-700 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">{question.title}</h3>
                        <div className="flex items-center space-x-4 mb-4">
                          <Badge className={`${
                            question.difficulty === 'Beginner' 
                              ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                              : question.difficulty === 'Intermediate' 
                              ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' 
                              : 'bg-red-500/20 text-red-400 border-red-500/30'
                          }`}>
                            {question.difficulty}
                          </Badge>
                          <div className="flex items-center space-x-1 text-sm text-slate-300">
                            <Clock className="h-4 w-4" />
                            <span>{question.timeEstimate}</span>
                          </div>
                          {question.isCompleted && (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {question.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600 transition-colors">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
                        <h4 className="font-semibold mb-3 text-white flex items-center space-x-2">
                          <Brain className="h-4 w-4 text-blue-400" />
                          <span>Sample Answer:</span>
                        </h4>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {question.sampleAnswer}
                        </p>
                      </div>

                      <div className="p-4 bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-lg border border-green-500/20">
                        <h4 className="font-semibold mb-3 text-white flex items-center space-x-2">
                          <Sparkles className="h-4 w-4 text-green-400" />
                          <span>Hints:</span>
                        </h4>
                        <ul className="text-sm text-slate-300 space-y-2">
                          {question.hints.map((hint, index) => (
                            <li key={index} className="flex items-start space-x-3">
                              <span className="text-green-400 font-bold">•</span>
                              <span>{hint}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-600">
                      <div className="flex items-center space-x-3">
                        <Button
                          size="sm"
                          onClick={() => handlePracticeQuestion(question)}
                          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Practice
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkDone(question.id)}
                          className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white transition-all duration-300"
                        >
                          {question.isCompleted ? 'Undo' : 'Mark Done'}
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSaveQuestion(question.id)}
                        className="text-slate-400 hover:text-yellow-400 transition-colors"
                      >
                        <Star className={`h-5 w-5 transition-all duration-300 ${
                          question.isSaved 
                            ? 'fill-yellow-400 text-yellow-400 scale-110' 
                            : 'group-hover:scale-110'
                        }`} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-slate-800 border-slate-700 shadow-xl">
              <CardContent className="p-12 text-center">
                <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-white">No questions found</h3>
                <p className="text-slate-300 mb-4">
                  No questions found matching your filters.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setDifficultyFilter("all");
                    setTimeFilter("all");
                  }}
                  className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Enhanced Sidebar */}
        <div className="lg:col-span-1">
          <Card className="bg-slate-800 border-slate-700 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg">
              <CardTitle className="flex items-center space-x-3 text-white">
                <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full">
                  <Trophy className="h-5 w-5" />
                </div>
                <span className="text-lg">Your Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="text-center">
                <div className="relative mb-4">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {Math.round((mockStats.nextMilestone.current / mockStats.nextMilestone.target) * 100)}%
                  </div>
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">🎯</span>
                  </div>
                </div>
                <div className="text-xl font-bold mb-2 text-white">
                  {mockStats.nextMilestone.current}/{mockStats.nextMilestone.target}
                </div>
                <div className="relative mb-4">
                  <div className="w-full bg-slate-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full transition-all duration-1000" 
                      style={{ width: `${(mockStats.nextMilestone.current / mockStats.nextMilestone.target) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-sm text-slate-300 font-medium">
                  {mockStats.nextMilestone.reward}
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-3 bg-slate-700 rounded-lg border border-slate-600">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Questions This Week</span>
                    <span className="font-medium text-white">{mockStats.weeklyQuestions}</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-700 rounded-lg border border-slate-600">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Current Streak</span>
                    <span className="font-medium text-white">{mockStats.currentStreak} days</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-700 rounded-lg border border-slate-600">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Completed</span>
                    <span className="font-medium text-white">{questions.filter(q => q.isCompleted).length}</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-700 rounded-lg border border-slate-600">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Saved</span>
                    <span className="font-medium text-white">{questions.filter(q => q.isSaved).length}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
