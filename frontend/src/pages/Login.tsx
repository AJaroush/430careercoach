import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaGoogle, FaMicrosoft, FaEnvelope } from "react-icons/fa";
import { useAuth } from "@/components/auth/AuthProvider";
import { Sparkles } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isEmailMode, setIsEmailMode] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailData, setEmailData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [emailError, setEmailError] = useState("");

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    try {
      await login(provider);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    
    if (isSignUp && emailData.password !== emailData.confirmPassword) {
      setEmailError("Passwords don't match!");
      return;
    }
    
    // Simulate email authentication
    localStorage.setItem('auth_user', JSON.stringify({
      id: 'demo-user',
      email: emailData.email,
      name: emailData.email.split('@')[0] || 'Demo User',
      provider: 'email',
      createdAt: new Date()
    }));
    
    const onboardingComplete = localStorage.getItem('onboardingComplete');
    if (onboardingComplete) {
      navigate('/dashboard');
    } else {
      navigate('/onboarding');
    }
  };

  const handleEmailModeToggle = () => {
    setIsEmailMode(!isEmailMode);
    setEmailData({ email: "", password: "", confirmPassword: "" });
    setEmailError("");
  };

  const handleSignUpToggle = () => {
    setIsSignUp(!isSignUp);
    setEmailData({ email: "", password: "", confirmPassword: "" });
    setEmailError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <Card className="max-w-md w-full bg-slate-800 border-slate-700 shadow-2xl relative z-10">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-4">
              <Sparkles className="h-4 w-4 text-blue-400" />
              <span className="text-blue-400 text-sm font-medium">AI-Powered Career Growth</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">Career Coach</h1>
            <h2 className="text-xl font-semibold text-slate-300">Try 5 Mins Training for Free</h2>
          </div>
          <p className="text-slate-400 mb-6 text-center text-sm">
            No credit card required • Secure authentication
          </p>

          <div className="space-y-4">
            {/* Social Login Buttons */}
            {!isEmailMode && (
              <>
                <Button 
                  variant="outline" 
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 border-0 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/20"
                  onClick={() => handleSocialLogin('google')}
                  disabled={isLoading}
                >
                  <FaGoogle className="mr-2" />
                  {isLoading ? "Connecting..." : "Continue with Google"}
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-0 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20"
                  onClick={() => handleSocialLogin('microsoft')}
                  disabled={isLoading}
                >
                  <FaMicrosoft className="mr-2" />
                  {isLoading ? "Connecting..." : "Continue with Microsoft"}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-600" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-slate-800 px-2 text-slate-400">Or</span>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full bg-slate-700 hover:bg-slate-600 border-slate-600 text-white"
                  onClick={handleEmailModeToggle}
                  disabled={isLoading}
                >
                  <FaEnvelope className="mr-2" />
                  Continue with Email
                </Button>
              </>
            )}

            {/* Email Authentication Form */}
            {isEmailMode && (
              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={emailData.email}
                    onChange={(e) => setEmailData({ ...emailData, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={emailData.password}
                    onChange={(e) => setEmailData({ ...emailData, password: e.target.value })}
                    required
                  />
                </div>

                {isSignUp && (
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={emailData.confirmPassword}
                      onChange={(e) => setEmailData({ ...emailData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                )}

                {emailError && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-700">
                    {emailError}
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : (isSignUp ? "Sign Up" : "Sign In")}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleSignUpToggle}
                    className="text-sm text-blue-400 hover:text-blue-300 hover:underline"
                  >
                    {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                  </button>
                </div>

                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                  onClick={handleEmailModeToggle}
                  disabled={isLoading}
                >
                  Back to Social Login
                </Button>
              </form>
            )}

            <div className="text-xs text-center text-slate-400 space-y-2 mt-6">
              <p>
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
              <p>
                Your data is securely encrypted and never shared
              </p>
            </div>

            <div className="pt-4 border-t border-slate-700 mt-6">
              <Button
                variant="ghost"
                className="w-full text-slate-400 hover:text-slate-300 hover:bg-slate-700"
                onClick={() => {
                  // Skip authentication and go directly to dashboard
                  localStorage.setItem('onboardingComplete', 'true');
                  localStorage.setItem('auth_user', JSON.stringify({
                    id: 'demo-user',
                    email: 'demo@example.com',
                    name: 'Demo User',
                    provider: 'demo',
                    createdAt: new Date()
                  }));
                  navigate('/dashboard');
                }}
                disabled={isLoading}
              >
                Skip Login (Demo Mode)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}