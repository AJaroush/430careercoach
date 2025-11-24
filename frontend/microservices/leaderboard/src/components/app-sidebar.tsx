import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  BookOpen, 
  MessageSquare, 
  User, 
  Target,
  GraduationCap,
  Brain,
  Map,
  BarChart3,
  Trophy
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Course Recommendations", href: "/courses", icon: BookOpen },
  { name: "Skills Assessment", href: "/skills-assessment", icon: Brain },
  { name: "Career Path Planner", href: "/career-path", icon: Map },
  { name: "Job Market Insights", href: "/market-insights", icon: BarChart3 },
  { name: "Interview Prep", href: "/interview-prep", icon: MessageSquare },
  { name: "Career Goals", href: "/career-goals", icon: Target },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Profile", href: "/profile", icon: User },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 bg-slate-800 border-r border-slate-700 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <GraduationCap className="h-8 w-8 text-blue-400" />
          <span className="ml-2 text-lg font-semibold text-white">Career Coach</span>
        </div>
        <div className="mt-5 flex-grow flex flex-col">
          <nav className="flex-1 px-2 pb-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white",
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                  )}
                >
                  <item.icon
                    className={cn(
                      isActive ? "text-white" : "text-slate-400 group-hover:text-white",
                      "mr-3 flex-shrink-0 h-5 w-5"
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
