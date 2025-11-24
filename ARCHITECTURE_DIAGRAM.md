# Career Coach Application Architecture Diagram

```mermaid
graph TB
    subgraph "Client Apps"
        Web[Web Application<br/>React/TypeScript/Vite<br/>Port: 5173]
    end

    subgraph "API Gateway"
        Gateway[Django REST API Gateway<br/>Port: 8000<br/>CORS Enabled]
    end

    subgraph "Backend Microservices"
        CVService[CV Analysis Service<br/>PDF/DOCX Parsing<br/>Text Extraction]
        CVDB[(CV Analysis DB)]
        
        CareerService[Career Planning Service<br/>Goals & Learning Paths]
        CareerDB[(Career Planning DB)]
        
        ProgressService[Progress Tracking Service<br/>Course Progress<br/>Milestones]
        ProgressDB[(Progress Tracking DB)]
        
        UserService[User Management Service<br/>Authentication<br/>Profiles]
        UserDB[(User Management DB)]
        
        CourseService[Course Recommendation Service<br/>AI-Powered Matching]
        CourseDB[(Course Catalog DB)]
    end

    subgraph "External Services"
        OpenAI[Azure OpenAI<br/>GPT-4<br/>CV Analysis & Recommendations]
        OAuth[OAuth Providers<br/>Microsoft MSAL<br/>Google OAuth]
    end

    subgraph "Message Broker"
        Broker[Message Broker<br/>Event-Driven Communication<br/>Optional]
    end

    %% Client to Gateway
    Web -->|HTTP/REST| Gateway

    %% Gateway to Services
    Gateway -->|/api/cv/*| CVService
    Gateway -->|/api/career/*| CareerService
    Gateway -->|/api/progress/*| ProgressService
    Gateway -->|/api/users/*| UserService
    Gateway -->|/api/courses/*| CourseService

    %% Services to Databases
    CVService --> CVDB
    CareerService --> CareerDB
    ProgressService --> ProgressDB
    UserService --> UserDB
    CourseService --> CourseDB

    %% Services to External Services
    CVService -->|AI Analysis| OpenAI
    CourseService -->|AI Recommendations| OpenAI
    UserService -->|Authentication| OAuth

    %% Services to Message Broker (optional)
    CVService -.->|Events| Broker
    CareerService -.->|Events| Broker
    ProgressService -.->|Events| Broker
    Broker -.->|Notifications| CourseService

    %% Styling
    classDef clientStyle fill:#e1e8ed,stroke:#1da1f2,stroke-width:2px,color:#000
    classDef gatewayStyle fill:#9b59b6,stroke:#8e44ad,stroke-width:3px,color:#fff
    classDef serviceStyle fill:#3498db,stroke:#2980b9,stroke-width:2px,color:#fff
    classDef dbStyle fill:#27ae60,stroke:#229954,stroke-width:2px,color:#fff
    classDef externalStyle fill:#f39c12,stroke:#e67e22,stroke-width:2px,color:#000
    classDef brokerStyle fill:#95a5a6,stroke:#7f8c8d,stroke-width:2px,color:#fff

    class Web clientStyle
    class Gateway gatewayStyle
    class CVService,CareerService,ProgressService,UserService,CourseService serviceStyle
    class CVDB,CareerDB,ProgressDB,UserDB,CourseDB dbStyle
    class OpenAI,OAuth externalStyle
    class Broker brokerStyle
```

## Architecture Overview

### Client Layer
- **Web Application**: React-based SPA running on port 5173
- Features: Dashboard, Course Recommendations, Skills Assessment, Career Path Planner, Job Market Insights, Interview Prep, Career Goals, Profile

### API Gateway Layer
- **Django REST API Gateway**: Single entry point on port 8000
- Handles CORS, routing, and request/response transformation
- Routes requests to appropriate microservices

### Microservices Layer

1. **CV Analysis Service**
   - Processes CV uploads (PDF/DOCX)
   - Extracts text and analyzes content
   - Identifies skills, experience, strengths, weaknesses
   - Integrates with Azure OpenAI for AI-powered analysis

2. **Career Planning Service**
   - Manages user career goals
   - Generates personalized learning paths
   - Tracks skill gaps and development areas

3. **Progress Tracking Service**
   - Monitors course completion
   - Tracks milestone achievements
   - Records learning progress

4. **User Management Service**
   - Handles user authentication
   - Manages user profiles
   - Integrates with OAuth providers (Microsoft, Google)

5. **Course Recommendation Service**
   - Generates personalized course recommendations
   - Uses AI to match courses with user skills and goals
   - Integrates with Azure OpenAI for intelligent matching

### External Services
- **Azure OpenAI**: Provides AI capabilities for CV analysis and course recommendations
- **OAuth Providers**: Microsoft MSAL and Google OAuth for authentication

### Data Layer
Each microservice maintains its own database:
- SQLite (development) / PostgreSQL (production)
- Data isolation and independent scaling

### Communication Patterns
- **Synchronous**: REST API calls through Gateway
- **Asynchronous**: Event-driven communication via Message Broker (optional)


