#Career Coach Platform

A comprehensive career development platform that combines AI-powered insights with proven career growth strategies. Built with React, TypeScript, and modern UI components.

## Features

### 🎯 Career Development
- **Personalized Course Recommendations** - Get course suggestions based on your career goals and skill gaps
- **Interview Preparation** - Practice with categorized questions (Technical, Behavioral, Case Studies, HR)
- **Progress Tracking** - Monitor your learning journey with detailed analytics
- **Goal Setting** - Set and track career milestones

### 🚀 User Experience
- **Onboarding Flow** - Comprehensive 7-step setup process
- **Modern UI** - Built with Radix UI and Tailwind CSS
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Dark/Light Theme** - Theme switching support

### 📊 Analytics & Insights
- **Learning Statistics** - Track courses completed, hours learned, and streaks
- **Achievement System** - Earn badges and certificates
- **Progress Visualization** - Interactive charts and progress bars
- **Activity Timeline** - View your recent learning activities

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: Radix UI, Tailwind CSS
- **Icons**: Lucide React, React Icons
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **State Management**: React Hooks
- **Notifications**: Sonner

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd InActionAI5-Django
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Base UI components (Button, Card, etc.)
│   │   ├── app-header.tsx  # Main navigation header
│   │   ├── app-sidebar.tsx # Sidebar navigation
│   │   └── app-layout.tsx  # Main layout wrapper
│   ├── pages/              # Page components
│   │   ├── Landing.tsx     # Landing page
│   │   ├── Login.tsx       # Authentication
│   │   ├── Onboarding.tsx  # User onboarding flow
│   │   ├── Dashboard.tsx   # Main dashboard
│   │   ├── CourseRecommendations.tsx
│   │   ├── InterviewPrep.tsx
│   │   ├── Profile.tsx
│   │   └── NotFound.tsx
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   └── App.tsx             # Main app component
├── public/                 # Static assets
└── package.json
```

## Features Overview

### Landing Page
- Hero section with call-to-action
- Feature highlights
- Statistics and testimonials
- Clean, modern design

### Authentication
- Social login (Google, Microsoft)
- Email/password authentication
- Demo mode for quick testing
- Secure session management

### Onboarding Flow
1. **Profile Setup** - Name, email, avatar
2. **Interests Selection** - Choose learning areas
3. **Career Focus** - Select target field
4. **Goals Setting** - Define career objectives
5. **Time Commitment** - Set learning schedule
6. **Preferences** - Region, learning style, budget
7. **Summary** - Review and confirm

### Dashboard
- **Overview Cards** - Key statistics at a glance
- **Career Roadmap** - Visual progress tracking
- **Course Recommendations** - Personalized suggestions
- **Quick Actions** - Easy access to common tasks
- **Insights Panel** - Weekly focus and trending skills

### Course Recommendations
- **Smart Filtering** - By job role, level, price, skills
- **Search Functionality** - Find courses by title or description
- **Save Courses** - Bookmark interesting courses
- **Progress Tracking** - Track completion status
- **External Links** - Direct access to course platforms

### Interview Preparation
- **Question Categories** - Technical, Behavioral, Case, HR
- **Difficulty Levels** - Beginner to Advanced
- **Time Estimates** - Plan your practice sessions
- **Sample Answers** - Learn from examples
- **Progress Tracking** - Monitor your improvement

### Profile Management
- **Personal Information** - Edit name, email, avatar
- **Statistics** - View learning metrics
- **Achievements** - Display earned badges
- **Goals Tracking** - Monitor progress toward objectives
- **Activity History** - Recent learning activities

## Customization

### Theming
The app supports light/dark themes. Theme preferences are stored in localStorage and can be toggled via the theme provider.

### Adding New Features
1. Create new components in `src/components/`
2. Add new pages in `src/pages/`
3. Update routing in `src/App.tsx`
4. Add navigation items in `src/components/app-sidebar.tsx`

### Styling
- Uses Tailwind CSS for styling
- Custom CSS variables for theming
- Responsive design with mobile-first approach
- Consistent spacing and typography

## Kubernetes Deployment (Minikube)

### Prerequisites
- Docker installed
- Minikube installed and running
- kubectl configured

### Frontend Deployment Steps

1. **Configure Docker to use Minikube's Docker daemon**
   ```bash
   eval $(minikube docker-env)
   ```

2. **Build the frontend Docker image**
   ```bash
   cd frontend
   docker build -t careercoach-frontend:latest .
   cd ..
   ```

3. **Apply Kubernetes manifests**
   ```bash
   kubectl apply -f k8s/frontend-deployment.yaml
   kubectl apply -f k8s/frontend-service.yaml
   ```

4. **Access the frontend service**
   ```bash
   minikube service careercoach-frontend-service
   ```
   
   This will open the service in your default browser. Alternatively, you can access it directly at:
   ```
   http://$(minikube ip):30081
   ```

### Backend Deployment Steps (Optional)

If you also want to deploy the Django backend:

1. **Build the backend Docker image**
   ```bash
   docker build -t careercoach-backend:latest .
   ```

2. **Apply backend Kubernetes manifests**
   ```bash
   kubectl apply -f k8s/deployment.yaml
   kubectl apply -f k8s/service.yaml
   ```

3. **Access the backend service**
   ```bash
   minikube service careercoach-backend-service
   ```
   
   Or directly at:
   ```
   http://$(minikube ip):30080
   ```

### Verify Deployment

Check the deployment status:
```bash
kubectl get deployments
kubectl get services
kubectl get pods
```

View logs:
```bash
kubectl logs -f deployment/careercoach-frontend
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.

---

**Note**: This is a frontend-only application. For production use, you'll need to integrate with a backend API for user authentication, data persistence, and AI-powered recommendations.
# 430careercoach
