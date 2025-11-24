# Architecture Diagram Prompt for Career Coach Application

Create a microservices architecture diagram similar to the provided reference diagram, showing the Career Coach application architecture with the following components:

## Diagram Structure

Create a diagram with four main vertical sections from left to right:

### 1. Client Apps (Left Section)
- **Web Application**: A laptop icon representing the React/Vite frontend application
- Both client apps should have arrows pointing towards the "API Gateway"

### 2. API Gateway (Second Section)
- A tall rectangular component labeled "Django REST API Gateway" with an API icon
- This acts as the single entry point for all client requests
- Arrows from "Web Application" should point into the API Gateway
- Multiple arrows should branch out from the API Gateway to individual backend services

### 3. Backend Services (Central Section)
Label this section "Backend Microservices" and include five distinct rounded rectangular components, each with its own database icon:

- **CV Analysis Service**: 
  - Connected to API Gateway
  - Has its own database icon
  - Handles CV upload, parsing (PDF/DOCX), and AI-powered analysis
  - Arrows from API Gateway point to this service
  - Arrow from this service points to "Azure OpenAI" (external service)

- **Career Planning Service**:
  - Connected to API Gateway
  - Has its own database icon
  - Manages career goals, learning paths, and skill gap analysis
  - Arrows from API Gateway point to this service

- **Progress Tracking Service**:
  - Connected to API Gateway
  - Has its own database icon
  - Tracks user progress, course completions, and milestones
  - Arrows from API Gateway point to this service

- **User Management Service**:
  - Connected to API Gateway
  - Has its own database icon
  - Handles authentication, user profiles, and OAuth integration
  - Arrows from API Gateway point to this service
  - Arrows from this service point to "OAuth Providers" (external service)

- **Course Recommendation Service**:
  - Connected to API Gateway
  - Has its own database icon
  - Generates personalized course recommendations based on CV analysis
  - Arrows from API Gateway point to this service
  - Arrow from this service points to "Azure OpenAI" (external service)

### 4. External Services & Message Broker (Right Section)
Include the following external components:

- **Azure OpenAI Service**: 
  - A cloud icon or external service icon
  - Labeled "Azure OpenAI"
  - Receives arrows from "CV Analysis Service" and "Course Recommendation Service"
  - Used for AI-powered CV analysis and course recommendations

- **OAuth Providers**:
  - A cloud icon or external service icon
  - Labeled "OAuth Providers (Microsoft/Google)"
  - Receives arrows from "User Management Service"
  - Handles authentication

- **Message Broker** (Optional):
  - A tall rectangular component labeled "Message Broker" with a chat bubble icon
  - Can be used for asynchronous communication between services
  - Arrows from multiple services can point to it if needed for event-driven architecture

## Additional Details

- Each microservice should have a small database icon next to it (representing SQLite/PostgreSQL databases)
- Use consistent styling with rounded rectangles for services
- Use arrows to show request flow direction
- Use different colors or styles to distinguish between:
  - Internal services (blue/green)
  - External services (orange/yellow)
  - API Gateway (purple/blue)
  - Client apps (gray)

## Key Features to Highlight

- The API Gateway routes requests to appropriate microservices
- Each service has its own database (data isolation)
- CV Analysis and Course Recommendation services integrate with Azure OpenAI
- User Management integrates with OAuth providers
- Services can communicate asynchronously via Message Broker (if implemented)

## Frontend Pages/Features

The Web Application includes these main features:
- Dashboard
- Course Recommendations
- Skills Assessment
- Career Path Planner
- Job Market Insights
- Interview Prep
- Career Goals
- User Profile

## Technology Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Django REST Framework, Python
- **Database**: SQLite (development) / PostgreSQL (production)
- **AI**: Azure OpenAI (GPT-4)
- **Authentication**: Microsoft MSAL, Google OAuth
- **API**: RESTful APIs

Create a clean, professional diagram that clearly shows the separation of concerns, service independence, and integration points with external services.


