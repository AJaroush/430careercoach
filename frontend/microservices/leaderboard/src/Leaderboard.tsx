import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy,
  Crown,
  TrendingUp,
  Medal,
  Award,
  Sparkles,
  Flame,
  BookOpen,
  Target,
  Users
} from "lucide-react";

type LeaderboardUser = {
  rank: number;
  name: string;
  points: number;
  badge: string;
  courses: number;
  streak: number;
  hoursLearned: number;
  isCurrentUser?: boolean;
};

const mockLeaderboard: LeaderboardUser[] = [
  { rank: 1, name: "Alex Chen", points: 2847, badge: "🥇", courses: 45, streak: 21, hoursLearned: 180 },
  { rank: 2, name: "Sarah Johnson", points: 2653, badge: "🥈", courses: 38, streak: 18, hoursLearned: 152 },
  { rank: 3, name: "Mike Rodriguez", points: 2512, badge: "🥉", courses: 42, streak: 15, hoursLearned: 168 },
  { rank: 4, name: "Emma Wilson", points: 2341, badge: "4", courses: 35, streak: 12, hoursLearned: 140 },
  { rank: 5, name: "David Kim", points: 2189, badge: "5", courses: 32, streak: 10, hoursLearned: 128 },
  { rank: 6, name: "Lisa Anderson", points: 2056, badge: "6", courses: 30, streak: 9, hoursLearned: 120 },
  { rank: 7, name: "James Brown", points: 1923, badge: "7", courses: 28, streak: 8, hoursLearned: 112 },
  { rank: 8, name: "You", points: 73, badge: "⭐", courses: 12, streak: 7, hoursLearned: 48, isCurrentUser: true },
  { rank: 9, name: "Maria Garcia", points: 1856, badge: "9", courses: 25, streak: 6, hoursLearned: 100 },
  { rank: 10, name: "John Smith", points: 1723, badge: "10", courses: 22, streak: 5, hoursLearned: 88 },
];

export default function Leaderboard() {
  const [filter, setFilter] = useState<'all' | 'weekly' | 'monthly'>('all');
  const currentUser = mockLeaderboard.find(u => u.isCurrentUser);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-white/20 rounded-full">
              <Trophy className="h-6 w-6" />
            </div>
            <h1 className="text-4xl font-bold">Leaderboard</h1>
          </div>
          <p className="text-xl text-white/90">
            Compete with others and see where you rank on your career journey!
          </p>
        </div>
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/5 rounded-full"></div>
      </div>

      {/* Current User Highlight */}
      {currentUser && (
        <Card className="bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 border-blue-500/50 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {currentUser.rank}
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-2xl font-bold text-white">Your Rank</h3>
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                      #{currentUser.rank}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-slate-300">
                    <div className="flex items-center space-x-1">
                      <Trophy className="h-4 w-4 text-yellow-400" />
                      <span>{currentUser.points} points</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="h-4 w-4 text-blue-400" />
                      <span>{currentUser.courses} courses</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Flame className="h-4 w-4 text-orange-400" />
                      <span>{currentUser.streak} day streak</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400 mb-1">Next Rank</p>
                <p className="text-2xl font-bold text-white">
                  {currentUser.rank > 1 ? `#${currentUser.rank - 1}` : '🏆 #1'}
                </p>
                {currentUser.rank > 1 && (
                  <p className="text-xs text-slate-400 mt-1">
                    {mockLeaderboard[currentUser.rank - 2].points - currentUser.points} points away
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card className="bg-slate-800 border-slate-700 shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <span className="text-slate-300 font-medium">Filter by:</span>
            <div className="flex space-x-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                className={filter === 'all' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white' 
                  : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
                }
              >
                All Time
              </Button>
              <Button
                variant={filter === 'weekly' ? 'default' : 'outline'}
                onClick={() => setFilter('weekly')}
                className={filter === 'weekly' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white' 
                  : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
                }
              >
                This Week
              </Button>
              <Button
                variant={filter === 'monthly' ? 'default' : 'outline'}
                onClick={() => setFilter('monthly')}
                className={filter === 'monthly' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white' 
                  : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
                }
              >
                This Month
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard Table */}
      <Card className="bg-slate-800 border-slate-700 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg">
          <CardTitle className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full">
                <Trophy className="h-5 w-5" />
              </div>
              <span className="text-xl">Top Performers</span>
            </div>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              {mockLeaderboard.length} Users
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {mockLeaderboard.map((user) => (
              <div
                key={user.rank}
                className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                  user.isCurrentUser
                    ? 'bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 border-2 border-blue-500/50 shadow-lg'
                    : user.rank <= 3
                    ? 'bg-slate-700/50 border border-slate-600 hover:bg-slate-700'
                    : 'bg-slate-700/30 border border-slate-600/50 hover:bg-slate-700/50'
                }`}
              >
                <div className="flex items-center space-x-4 flex-1">
                  {/* Rank */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 ${
                    user.rank === 1 
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg shadow-yellow-500/50' 
                      : user.rank === 2 
                      ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-white shadow-lg shadow-gray-400/50'
                      : user.rank === 3
                      ? 'bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-lg shadow-orange-500/50'
                      : 'bg-slate-600 text-slate-300'
                  }`}>
                    {user.rank <= 3 ? user.badge : user.rank}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className={`text-lg font-bold ${
                        user.isCurrentUser ? 'text-blue-300' : 'text-white'
                      }`}>
                        {user.name}
                        {user.isCurrentUser && <span className="ml-2 text-sm text-blue-400">(You)</span>}
                      </h3>
                      {user.rank <= 3 && (
                        <Crown className={`h-5 w-5 ${
                          user.rank === 1 ? 'text-yellow-400' :
                          user.rank === 2 ? 'text-gray-300' :
                          'text-orange-400'
                        }`} />
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-slate-400">
                      <div className="flex items-center space-x-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{user.courses} courses</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Flame className="h-4 w-4 text-orange-400" />
                        <span>{user.streak} day streak</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Target className="h-4 w-4 text-blue-400" />
                        <span>{user.hoursLearned} hours</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Points */}
                <div className="text-right ml-4">
                  <div className="flex items-center space-x-2">
                    <Trophy className={`h-5 w-5 ${
                      user.rank === 1 ? 'text-yellow-400' :
                      user.rank === 2 ? 'text-gray-300' :
                      user.rank === 3 ? 'text-orange-400' :
                      'text-slate-400'
                    }`} />
                    <div>
                      <p className={`text-2xl font-bold ${
                        user.isCurrentUser ? 'text-blue-300' : 'text-white'
                      }`}>
                        {user.points.toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-400">points</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-yellow-500 to-orange-600 border-0 shadow-lg">
          <CardContent className="p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold mb-1">{mockLeaderboard[0].points.toLocaleString()}</p>
                <p className="text-yellow-100">Top Score</p>
              </div>
              <Medal className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-lg">
          <CardContent className="p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold mb-1">{mockLeaderboard.reduce((sum, u) => sum + u.courses, 0)}</p>
                <p className="text-blue-100">Total Courses</p>
              </div>
              <BookOpen className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 shadow-lg">
          <CardContent className="p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold mb-1">{mockLeaderboard.length}</p>
                <p className="text-purple-100">Active Users</p>
              </div>
              <Users className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


