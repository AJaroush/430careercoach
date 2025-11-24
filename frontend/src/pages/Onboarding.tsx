import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { User, Upload, Target, Clock, MapPin, DollarSign } from "lucide-react";

const categories = [
  "Professional Communication",
  "Leadership & Management", 
  "Sales & Negotiation",
  "Technical Interviews",
  "Public Speaking",
  "Career Development",
  "Data Analysis",
  "Project Management",
  "Digital Marketing",
  "Software Development"
];

const careerFocusOptions = [
  "Software Engineering",
  "Data Science & Analytics",
  "Product Management",
  "Marketing & Sales",
  "Design & UX",
  "Business & Finance",
  "Healthcare",
  "Education",
  "Consulting",
  "Entrepreneurship"
];

const goals = [
  "Get promoted within 6 months",
  "Switch to a new industry",
  "Learn new technical skills",
  "Improve leadership abilities",
  "Start my own business",
  "Increase my salary by 25%",
  "Build a professional network",
  "Get certified in my field"
];

const regions = [
  "North America",
  "Europe",
  "Asia Pacific",
  "Latin America",
  "Middle East & Africa"
];

const learningStyles = [
  "Visual (Videos, Infographics)",
  "Reading (Articles, Books)",
  "Hands-on (Projects, Labs)",
  "Interactive (Quizzes, Discussions)",
  "Mentorship (1-on-1 guidance)"
];

const budgets = [
  "Free resources only",
  "Under $50/month",
  "$50-100/month",
  "$100-200/month",
  "$200+/month"
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    avatarUrl: "",
    interests: [] as string[],
    careerFocus: "",
    goals: [] as string[],
    hours: 5,
    region: "",
    learningStyle: "",
    budget: "",
    uploadedFile: null as File | null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestToggle = (category: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(category)
        ? prev.interests.filter(i => i !== category)
        : [...prev.interests, category]
    }));
  };

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        uploadedFile: file
      }));
    }
  };

  const handleComplete = () => {
    localStorage.setItem("onboardingComplete", "true");
    localStorage.setItem("userProfile", JSON.stringify(formData));
    navigate("/dashboard");
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.fullName && formData.email;
      case 2:
        return formData.interests.length > 0;
      case 3:
        return formData.careerFocus !== "";
      case 4:
        return formData.goals.length > 0;
      case 5:
        return true; // Hours always has a default value
      case 6:
        return formData.region && formData.learningStyle && formData.budget;
      case 7:
        return true;
      default:
        return false;
    }
  };

  const progress = (step / 7) * 100;

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold">Get Started</h1>
                <span className="text-sm text-muted-foreground">
                  Step {step} of 7
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Step 1: Profile Setup */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold">Welcome to InAction.AI!</h2>
                  <p className="text-gray-600 mt-2">
                    Let's set up your profile to personalize your learning experience.
                  </p>
                </div>

                <div className="flex justify-center mb-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={formData.avatarUrl} />
                    <AvatarFallback>
                      <User className="h-12 w-12 text-gray-400" />
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Interests */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold">Select Your Interests</h2>
                  <p className="text-gray-600 mt-2">
                    Choose the areas you'd like to focus on for your professional development.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories.map((category) => (
                    <div
                      key={category}
                      className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleInterestToggle(category)}
                    >
                      <Checkbox
                        id={category}
                        checked={formData.interests.includes(category)}
                      />
                      <label
                        htmlFor={category}
                        className="text-sm font-medium leading-none cursor-pointer"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Career Focus */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold">Career Focus</h2>
                  <p className="text-gray-600 mt-2">
                    What field or industry are you most interested in?
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {careerFocusOptions.map((focus) => (
                    <div
                      key={focus}
                      className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => setFormData(prev => ({ ...prev, careerFocus: focus }))}
                    >
                      <input
                        type="radio"
                        name="careerFocus"
                        value={focus}
                        checked={formData.careerFocus === focus}
                        onChange={() => setFormData(prev => ({ ...prev, careerFocus: focus }))}
                        className="h-4 w-4"
                      />
                      <label className="text-sm font-medium leading-none cursor-pointer">
                        {focus}
                      </label>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 4: Goals */}
            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold">Career Goals</h2>
                  <p className="text-gray-600 mt-2">
                    What are your main career objectives? (Select all that apply)
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {goals.map((goal) => (
                    <div
                      key={goal}
                      className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleGoalToggle(goal)}
                    >
                      <Checkbox
                        id={goal}
                        checked={formData.goals.includes(goal)}
                      />
                      <label
                        htmlFor={goal}
                        className="text-sm font-medium leading-none cursor-pointer"
                      >
                        {goal}
                      </label>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 5: Time Commitment */}
            {step === 5 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold">Time Commitment</h2>
                  <p className="text-gray-600 mt-2">
                    How many hours per week can you dedicate to learning?
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span className="text-lg font-medium">{formData.hours} hours per week</span>
                  </div>
                  
                  <input
                    type="range"
                    min="1"
                    max="40"
                    value={formData.hours}
                    onChange={(e) => setFormData(prev => ({ ...prev, hours: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>1 hour</span>
                    <span>40+ hours</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 6: Preferences */}
            {step === 6 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold">Learning Preferences</h2>
                  <p className="text-gray-600 mt-2">
                    Help us customize your learning experience
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label className="flex items-center space-x-2 mb-3">
                      <MapPin className="h-4 w-4" />
                      <span>Region</span>
                    </Label>
                    <div className="grid grid-cols-1 gap-2">
                      {regions.map((region) => (
                        <div
                          key={region}
                          className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-gray-50"
                          onClick={() => setFormData(prev => ({ ...prev, region }))}
                        >
                          <input
                            type="radio"
                            name="region"
                            value={region}
                            checked={formData.region === region}
                            onChange={() => setFormData(prev => ({ ...prev, region }))}
                          />
                          <span className="text-sm">{region}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="flex items-center space-x-2 mb-3">
                      <Target className="h-4 w-4" />
                      <span>Learning Style</span>
                    </Label>
                    <div className="grid grid-cols-1 gap-2">
                      {learningStyles.map((style) => (
                        <div
                          key={style}
                          className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-gray-50"
                          onClick={() => setFormData(prev => ({ ...prev, learningStyle: style }))}
                        >
                          <input
                            type="radio"
                            name="learningStyle"
                            value={style}
                            checked={formData.learningStyle === style}
                            onChange={() => setFormData(prev => ({ ...prev, learningStyle: style }))}
                          />
                          <span className="text-sm">{style}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="flex items-center space-x-2 mb-3">
                      <DollarSign className="h-4 w-4" />
                      <span>Budget</span>
                    </Label>
                    <div className="grid grid-cols-1 gap-2">
                      {budgets.map((budget) => (
                        <div
                          key={budget}
                          className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-gray-50"
                          onClick={() => setFormData(prev => ({ ...prev, budget }))}
                        >
                          <input
                            type="radio"
                            name="budget"
                            value={budget}
                            checked={formData.budget === budget}
                            onChange={() => setFormData(prev => ({ ...prev, budget }))}
                          />
                          <span className="text-sm">{budget}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 7: Summary */}
            {step === 7 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h2 className="text-2xl font-bold">You're All Set!</h2>
                  <p className="text-gray-600 mt-2 mb-6">
                    Your personalized learning journey is ready to begin.
                  </p>

                  <div className="p-4 bg-blue-50 rounded-lg mb-6 text-left">
                    <h3 className="font-semibold mb-2">Your Profile Summary:</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Name:</strong> {formData.fullName}</p>
                      <p><strong>Career Focus:</strong> {formData.careerFocus}</p>
                      <p><strong>Time Commitment:</strong> {formData.hours} hours/week</p>
                      <p><strong>Selected Interests:</strong></p>
                      <div className="flex flex-wrap gap-2">
                        {formData.interests.map((interest) => (
                          <span
                            key={interest}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleComplete}
                    className="w-full"
                  >
                    Start Your Journey
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Navigation */}
            {step < 7 && (
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={() => setStep(prev => Math.max(1, prev - 1))}
                  disabled={step === 1}
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setStep(prev => Math.min(7, prev + 1))}
                  disabled={!canProceed()}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
