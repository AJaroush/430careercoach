import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "./lib/msalInstance";
import { ThemeProvider } from "./components/theme-provider";
import { AuthProvider } from "./components/auth/AuthProvider";
import { AppLayout } from "./components/app-layout";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import CourseRecommendations from "./pages/CourseRecommendations";
import SkillsAssessment from "./pages/SkillsAssessment";
import CareerPathPlanner from "./pages/CareerPathPlanner";
import JobMarketInsights from "./pages/JobMarketInsights";
import InterviewPrep from "./pages/InterviewPrep";
import CareerGoals from "./pages/CareerGoals";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter>
          <AuthProvider>
            <div className="min-h-screen bg-background">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                
                {/* Protected routes with layout */}
                <Route path="/onboarding" element={
                  <AppLayout>
                    <Onboarding />
                  </AppLayout>
                } />
                
                <Route path="/dashboard" element={
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                } />
                
                <Route path="/courses" element={
                  <AppLayout>
                    <CourseRecommendations />
                  </AppLayout>
                } />
                
                <Route path="/skills-assessment" element={
                  <AppLayout>
                    <SkillsAssessment />
                  </AppLayout>
                } />
                
                <Route path="/career-path" element={
                  <AppLayout>
                    <CareerPathPlanner />
                  </AppLayout>
                } />
                
                <Route path="/market-insights" element={
                  <AppLayout>
                    <JobMarketInsights />
                  </AppLayout>
                } />
                
                <Route path="/interview-prep" element={
                  <AppLayout>
                    <InterviewPrep />
                  </AppLayout>
                } />
                
                <Route path="/career-goals" element={
                  <AppLayout>
                    <CareerGoals />
                  </AppLayout>
                } />
                
                <Route path="/leaderboard" element={
                  <AppLayout>
                    <Leaderboard />
                  </AppLayout>
                } />
                
                <Route path="/profile" element={
                  <AppLayout>
                    <Profile />
                  </AppLayout>
                } />
                
                {/* Catch all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </div>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </MsalProvider>
  );
}

export default App;