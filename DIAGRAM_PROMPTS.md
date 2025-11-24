# ChatGPT Prompts for Career Coach Architecture Diagrams

## 1. Customer Flow Diagram Prompt

```
Create a detailed Figma design specification for a customer/user flow diagram showing how a user interacts with the Career Coach application from initial access to completing key actions.

## Flow Stages:

### Stage 1: Entry Point
- **Landing Page**: User arrives at the application
- **Login/Authentication**: User logs in via Microsoft MSAL or Google OAuth
- Arrow pointing to next stage

### Stage 2: Onboarding
- **Profile Setup**: User completes onboarding questionnaire
- **CV Upload**: User uploads their CV/resume (PDF/DOCX)
- **CV Analysis**: System analyzes CV and extracts skills, experience, strengths, weaknesses
- Show parallel processing: CV analysis happens while user completes onboarding

### Stage 3: Dashboard View
- **Dashboard**: User sees personalized dashboard with:
  - Career insights
  - Recommended courses
  - Progress overview
  - Quick actions
- Multiple arrows branching to different features

### Stage 4: Feature Interactions (Parallel Paths)

**Path A: Course Recommendations**
- User navigates to Course Recommendations
- System shows personalized courses based on CV analysis
- User can filter by level, price, skills
- User saves or enrolls in courses
- Arrow back to Dashboard

**Path B: Skills Assessment**
- User takes interactive skills assessment quiz
- System generates personalized skill profile
- Shows strengths and areas for improvement
- Recommendations displayed
- Arrow back to Dashboard

**Path C: Career Path Planner**
- User views suggested milestones (from CV analysis)
- User adds custom milestones
- User tracks progress on milestones
- Updates status (Not Started → In Progress → Completed)
- Arrow back to Dashboard

**Path D: Job Market Insights**
- User views personalized job recommendations (based on CV)
- User sees market trends for their skills
- User views salary insights for relevant roles
- User explores career opportunities
- Arrow back to Dashboard

**Path E: Interview Prep**
- User accesses interview preparation resources
- User practices with AI-generated questions
- User reviews tips and strategies
- Arrow back to Dashboard

### Stage 5: Progress Tracking
- User views overall progress
- System tracks course completions
- System tracks milestone achievements
- System updates career goals progress
- Dashboard reflects updated progress

## Design Specifications:

**Flow Elements:**
- Use rounded rectangles for user actions/steps
- Use diamonds for decision points
- Use cylinders for data storage (CV, Profile, Progress)
- Use cloud icons for external services (OAuth, Azure OpenAI)
- Use arrows to show flow direction
- Use different colors for different types of actions:
  - User actions: Blue (#3498DB)
  - System processes: Green (#27AE60)
  - Data storage: Gray (#95A5A6)
  - External services: Orange (#F39C12)
  - Decision points: Yellow (#F39C12)

**Layout:**
- Top-to-bottom flow with horizontal branches for parallel paths
- Clear labeling of each step
- Show feedback loops (returning to dashboard)
- Include error paths (failed CV upload, authentication failure)
- Show success and error outcomes

**Annotations:**
- Add labels to arrows showing:
  - "Uploads CV"
  - "Receives Recommendations"
  - "Tracks Progress"
  - "Saves Course"
- Include timing indicators where relevant
- Show user feedback points (loading states, success messages)

Create a comprehensive user journey map that shows all possible paths a user can take through the application, including error handling and alternative flows.
```

---

## 2. Internal Microservice Communication Diagram Prompt

```
Create a detailed Figma design specification for an internal microservice communication diagram showing how the Career Coach backend services communicate with each other.

## Components:

### Microservices (Horizontal Layout):
1. **CV Analysis Service**
2. **Career Planning Service**
3. **Progress Tracking Service**
4. **User Management Service**
5. **Course Recommendation Service**

### Supporting Infrastructure:
- **Message Broker** (center, connecting all services)
- **API Gateway** (top, routing requests)
- **Shared Database** (optional, for cross-service data)

## Communication Patterns:

### Synchronous Communication (HTTP/REST):
- API Gateway → CV Analysis Service: "POST /api/cv/analyze"
- API Gateway → Career Planning Service: "GET /api/career/plans"
- API Gateway → Progress Tracking Service: "PUT /api/progress/update"
- API Gateway → User Management Service: "GET /api/users/profile"
- API Gateway → Course Recommendation Service: "GET /api/courses/recommend"

### Inter-Service Communication:
- **CV Analysis → Course Recommendation**: 
  - CV Analysis sends CV analysis results to Course Recommendation
  - Purpose: Generate personalized course recommendations
  - Method: Direct HTTP call or via Message Broker
  - Label: "CV Analysis Data"

- **User Management → All Services**:
  - User Management provides authentication tokens
  - All services validate user identity
  - Label: "Auth Token Validation"

- **Progress Tracking → Career Planning**:
  - Progress Tracking sends milestone completion updates
  - Career Planning updates learning paths
  - Label: "Progress Updates"

- **Course Recommendation → Progress Tracking**:
  - Course Recommendation sends course enrollment events
  - Progress Tracking records course enrollment
  - Label: "Course Enrollment Events"

### Asynchronous Communication (Message Broker):

**Event Types:**
1. **CV Analyzed Event**
   - Publisher: CV Analysis Service
   - Subscribers: Course Recommendation Service, Career Planning Service
   - Payload: CV analysis results, skills, experience

2. **Course Enrolled Event**
   - Publisher: Course Recommendation Service
   - Subscribers: Progress Tracking Service, Career Planning Service
   - Payload: Course ID, User ID, Enrollment date

3. **Milestone Completed Event**
   - Publisher: Progress Tracking Service
   - Subscribers: Career Planning Service, User Management Service
   - Payload: Milestone ID, User ID, Completion date

4. **User Profile Updated Event**
   - Publisher: User Management Service
   - Subscribers: All services (for cache invalidation)
   - Payload: User ID, Updated fields

5. **Career Goal Updated Event**
   - Publisher: Career Planning Service
   - Subscribers: Course Recommendation Service, Progress Tracking Service
   - Payload: Goal ID, User ID, Goal details

## Design Specifications:

**Visual Elements:**
- Use rounded rectangles for microservices
- Use a central Message Broker (tall rectangle) in the middle
- Use different arrow styles:
  - Solid arrows: Synchronous HTTP calls
  - Dashed arrows: Asynchronous events via Message Broker
  - Double arrows: Bidirectional communication
- Color code:
  - Microservices: Blue (#3498DB)
  - Message Broker: Purple (#9B59B6)
  - API Gateway: Dark Blue (#2980B9)
  - Events: Green (#27AE60)

**Layout:**
- Arrange microservices horizontally
- Place Message Broker in the center
- Show API Gateway at the top
- Draw arrows showing all communication paths
- Label each arrow with:
  - Communication type (HTTP, Event)
  - Endpoint or event name
  - Direction of data flow

**Event Flow Visualization:**
- Show event flow from publisher → Message Broker → subscribers
- Use numbered steps for event processing
- Show event payload structure (simplified)

**Include:**
- Request/response patterns
- Error propagation paths
- Retry mechanisms
- Circuit breaker patterns (optional)
- Service discovery (optional)

Create a comprehensive diagram that clearly shows all internal communication patterns, both synchronous and asynchronous, between microservices.
```

---

## 3. Load Balancer Diagram Prompt

```
Create a detailed Figma design specification for a load balancer architecture diagram showing how the Career Coach application handles traffic distribution and high availability.

## Architecture Components:

### Client Layer:
- **Multiple Users**: Show 3-5 user icons representing concurrent users
- All users connect to Load Balancer

### Load Balancer Layer:
- **Application Load Balancer** (Primary)
  - Label: "Application Load Balancer"
  - Health checks enabled
  - SSL termination
  - Request routing based on:
    - Path-based routing (/api/cv/*, /api/career/*, etc.)
    - Round-robin algorithm
    - Least connections algorithm

### API Gateway Layer (Multiple Instances):
- **API Gateway Instance 1**: Port 8000
- **API Gateway Instance 2**: Port 8000
- **API Gateway Instance 3**: Port 8000
- All instances are identical (horizontal scaling)
- Health check indicators (green = healthy, red = unhealthy)

### Microservice Layer (Multiple Instances per Service):

**CV Analysis Service:**
- Instance 1 (Healthy)
- Instance 2 (Healthy)
- Instance 3 (Unhealthy - show red indicator)

**Career Planning Service:**
- Instance 1 (Healthy)
- Instance 2 (Healthy)

**Progress Tracking Service:**
- Instance 1 (Healthy)
- Instance 2 (Healthy)

**User Management Service:**
- Instance 1 (Healthy)
- Instance 2 (Healthy)

**Course Recommendation Service:**
- Instance 1 (Healthy)
- Instance 2 (Healthy)

### Database Layer:
- **Primary Database**: Active (green)
- **Replica Database**: Standby (blue)
- Show replication arrow from Primary → Replica

### External Services:
- **Azure OpenAI**: Multiple endpoints (show 2-3 instances)
- **OAuth Providers**: Multiple endpoints

## Load Balancing Strategies:

### 1. Round-Robin Distribution:
- Show requests being distributed evenly across API Gateway instances
- Label: "Request 1 → Gateway 1, Request 2 → Gateway 2, Request 3 → Gateway 3"

### 2. Health Check Flow:
- Load Balancer → Health Check → API Gateway instances
- Unhealthy instances are marked and removed from rotation
- Show health check intervals

### 3. Session Affinity (Sticky Sessions):
- Show user sessions being maintained on specific instances
- Label: "User A always routes to Gateway 1"

### 4. Auto-Scaling:
- Show auto-scaling triggers (CPU > 70%, Memory > 80%)
- New instances being added automatically
- Label: "Auto-scaling: +1 instance"

## Traffic Flow:

### Normal Flow:
1. User → Load Balancer
2. Load Balancer → API Gateway (selected instance)
3. API Gateway → Microservice (selected instance)
4. Microservice → Database
5. Response flows back through the chain

### Failover Flow:
1. User → Load Balancer
2. Load Balancer detects unhealthy Gateway instance
3. Load Balancer routes to healthy Gateway instance
4. Show error handling: "Instance 3 marked unhealthy, removed from rotation"

### High Traffic Flow:
1. Multiple users → Load Balancer
2. Load Balancer distributes across all healthy instances
3. Show traffic metrics: "1000 req/s distributed across 3 instances"
4. Auto-scaling triggers add new instances

## Design Specifications:

**Visual Elements:**
- Use server/instance icons for each service instance
- Use a load balancer icon (scale/balance symbol) at the top
- Show health status with color coding:
  - Green: Healthy
  - Yellow: Degraded
  - Red: Unhealthy
- Use arrows showing traffic flow
- Show metrics/numbers on arrows (requests per second)

**Layout:**
- Top: Users
- Second level: Load Balancer
- Third level: API Gateway instances (horizontal)
- Fourth level: Microservice instances (grouped by service type)
- Bottom: Databases and External Services

**Color Coding:**
- Load Balancer: Purple (#9B59B6)
- API Gateway instances: Blue (#3498DB)
- Healthy instances: Green border
- Unhealthy instances: Red border
- Databases: Green (#27AE60)
- External services: Orange (#F39C12)

**Include:**
- Health check indicators
- Request distribution arrows
- Failover paths
- Auto-scaling indicators
- Traffic metrics
- SSL/TLS termination point
- Session affinity indicators

Create a comprehensive diagram showing load balancing, high availability, failover mechanisms, and auto-scaling capabilities.
```

---

## 4. Error Handling Diagram Prompt

```
Create a detailed Figma design specification for an error handling and resilience diagram showing how the Career Coach application handles errors, failures, and implements fault tolerance.

## Error Scenarios:

### Scenario 1: API Gateway Errors

**Request Timeout:**
- User sends request → API Gateway
- Gateway waits for response (timeout: 30s)
- Service doesn't respond in time
- Gateway returns: "504 Gateway Timeout"
- Show retry mechanism: "Retry with exponential backoff"

**Service Unavailable:**
- User sends request → API Gateway
- Gateway routes to Microservice
- Microservice is down/unhealthy
- Gateway detects failure
- Gateway routes to backup instance
- If all instances fail: "503 Service Unavailable" returned

### Scenario 2: Microservice Errors

**CV Analysis Service Failure:**
- User uploads CV → API Gateway → CV Analysis Service
- Service crashes or throws error
- Error caught by error handler
- Options:
  1. Retry with circuit breaker (if transient)
  2. Return cached result (if available)
  3. Return fallback response
  4. Log error to monitoring system
- User receives: "CV analysis temporarily unavailable, please try again"

**Database Connection Error:**
- Microservice → Database connection fails
- Service implements retry logic (3 attempts)
- If all retries fail:
  - Use read replica
  - Return cached data
  - Return graceful degradation response
- Error logged to error tracking system

### Scenario 3: External Service Errors

**Azure OpenAI API Failure:**
- CV Analysis Service → Azure OpenAI API
- API returns error (rate limit, timeout, service unavailable)
- Service implements:
  1. Retry with exponential backoff
  2. Circuit breaker opens after 5 failures
  3. Fallback to rule-based analysis
  4. Return partial results
- User receives: "AI analysis unavailable, using basic analysis"

**OAuth Provider Failure:**
- User Management Service → OAuth Provider
- Provider is down or returns error
- Service:
  1. Retries with backoff
  2. Falls back to alternative provider
  3. Returns: "Authentication service temporarily unavailable"
  4. Allows cached session (if valid)

### Scenario 4: Data Validation Errors

**Invalid CV Format:**
- User uploads invalid file → CV Analysis Service
- Service validates file format
- Returns: "400 Bad Request - Invalid file format. Please upload PDF or DOCX"
- Shows user-friendly error message

**Missing Required Fields:**
- User submits form with missing data
- Service validates input
- Returns: "422 Unprocessable Entity - Missing required field: target_job"
- Shows field-level error messages

## Error Handling Mechanisms:

### 1. Circuit Breaker Pattern:
- Show circuit states:
  - **Closed**: Normal operation (green)
  - **Open**: Service failing, requests blocked (red)
  - **Half-Open**: Testing if service recovered (yellow)
- Show threshold: "5 failures → Open circuit"
- Show timeout: "30s → Half-Open"

### 2. Retry Logic:
- Show retry attempts:
  - Attempt 1: Immediate
  - Attempt 2: After 1s
  - Attempt 3: After 2s
  - Attempt 4: After 4s (exponential backoff)
- Max retries: 3-5 attempts
- Show retry conditions: "Only retry on 5xx errors"

### 3. Fallback Mechanisms:
- **Primary**: AI-powered CV analysis
- **Fallback 1**: Rule-based analysis
- **Fallback 2**: Cached previous analysis
- **Fallback 3**: Generic recommendations

### 4. Error Logging & Monitoring:
- All errors logged to:
  - Application logs
  - Error tracking service (e.g., Sentry)
  - Monitoring dashboard
- Show error flow: Error → Logger → Monitoring System → Alert

### 5. Graceful Degradation:
- Show feature flags:
  - "AI Analysis": Enabled/Disabled
  - "Real-time Recommendations": Enabled/Disabled
- When feature disabled, show alternative:
  - "Using cached recommendations"
  - "Basic analysis mode"

## Error Response Flow:

### Standard Error Response:
1. Error occurs in service
2. Error handler catches exception
3. Error formatted: `{ "error": "message", "code": "ERROR_CODE", "timestamp": "..." }`
4. Appropriate HTTP status code returned
5. Error logged
6. User receives user-friendly message

### Error Types & HTTP Status Codes:
- **400 Bad Request**: Invalid input
- **401 Unauthorized**: Authentication failed
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource doesn't exist
- **422 Unprocessable Entity**: Validation failed
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error
- **502 Bad Gateway**: Upstream service error
- **503 Service Unavailable**: Service down
- **504 Gateway Timeout**: Request timeout

## Design Specifications:

**Visual Elements:**
- Use different shapes for different error types:
  - Triangles: Errors/Failures
  - Diamonds: Decision points (retry? fallback?)
  - Rectangles: Error handlers
  - Clouds: External services
- Use color coding:
  - Red: Errors/Failures
  - Yellow: Warnings/Retries
  - Green: Success/Recovery
  - Blue: Normal flow
  - Orange: Fallback mechanisms

**Layout:**
- Show error scenarios as separate flows
- Use swimlanes for different layers (Gateway, Services, External)
- Show error propagation paths
- Include recovery paths
- Show monitoring and alerting

**Include:**
- Error flow diagrams
- Retry logic visualization
- Circuit breaker states
- Fallback mechanisms
- Error logging flow
- User-facing error messages
- Monitoring and alerting

Create a comprehensive error handling diagram showing all error scenarios, handling mechanisms, retry logic, circuit breakers, fallbacks, and monitoring.
```

---

## Usage Instructions:

Copy each prompt individually and paste into ChatGPT. Each prompt will generate a detailed Figma design specification for the respective diagram. You can then use these specifications in Figma to create the visual diagrams.

