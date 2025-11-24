# ChatGPT Prompt for Figma Architecture Diagram

Copy and paste this prompt into ChatGPT:

---

Create a detailed Figma design specification for a microservices architecture diagram of a Career Coach application. The diagram should have four main vertical sections from left to right, similar to a typical microservices architecture diagram.

## Layout Structure:

### Section 1: Client Apps (Left Side)
- Create a section labeled "Client Apps"
- Include one component: **Web Application** (React/TypeScript/Vite)
- Use a laptop/computer icon
- Add an arrow pointing right toward the API Gateway

### Section 2: API Gateway (Second Section)
- Create a tall rectangular component labeled **"Django REST API Gateway"**
- Add an API icon (gateway symbol)
- Label it "Port: 8000 | CORS Enabled"
- Position it as the central routing point
- Draw multiple arrows branching out from the gateway to the microservices

### Section 3: Backend Microservices (Center Section)
Create five rounded rectangular components, each with:
- A small database icon next to it
- Clear labels and descriptions

1. **CV Analysis Service**
   - Label: "CV Analysis Service"
   - Description: "PDF/DOCX Parsing, Text Extraction, AI Analysis"
   - Database icon on the right
   - Arrow from API Gateway pointing to it
   - Arrow from this service pointing to Azure OpenAI (external service)

2. **Career Planning Service**
   - Label: "Career Planning Service"
   - Description: "Goals Management, Learning Paths"
   - Database icon on the right
   - Arrow from API Gateway pointing to it

3. **Progress Tracking Service**
   - Label: "Progress Tracking Service"
   - Description: "Course Progress, Milestones"
   - Database icon on the right
   - Arrow from API Gateway pointing to it

4. **User Management Service**
   - Label: "User Management Service"
   - Description: "Authentication, Profiles"
   - Database icon on the right
   - Arrow from API Gateway pointing to it
   - Arrow from this service pointing to OAuth Providers (external service)

5. **Course Recommendation Service**
   - Label: "Course Recommendation Service"
   - Description: "AI Matching, Personalization"
   - Database icon on the right
   - Arrow from API Gateway pointing to it
   - Arrow from this service pointing to Azure OpenAI (external service)

### Section 4: External Services & Message Broker (Right Side)

1. **Azure OpenAI**
   - Cloud/external service icon
   - Label: "Azure OpenAI"
   - Subtitle: "GPT-4 | CV Analysis & Recommendations"
   - Receives arrows from CV Analysis Service and Course Recommendation Service

2. **OAuth Providers**
   - Cloud/external service icon
   - Label: "OAuth Providers"
   - Subtitle: "Microsoft MSAL, Google OAuth"
   - Receives arrow from User Management Service

3. **Message Broker** (Optional)
   - Tall rectangular component
   - Label: "Message Broker"
   - Chat bubble icon
   - Subtitle: "Event-Driven Communication"
   - Can receive arrows from multiple services for async communication

## Design Specifications:

**Colors:**
- Client Apps: Light gray (#E1E8ED)
- API Gateway: Purple (#9B59B6) with white text
- Microservices: Blue (#3498DB) with white text
- Databases: Green (#27AE60) with white text
- External Services: Orange (#F39C12) with black text
- Message Broker: Gray (#95A5A6) with white text

**Styling:**
- Use rounded rectangles (border radius: 8-12px) for all service components
- Use rectangular boxes for API Gateway and Message Broker
- Use cloud icons for external services
- Use database cylinder icons for databases
- Arrows should be solid lines (2-3px width) for synchronous communication
- Use dashed lines for optional/async communication

**Layout:**
- Arrange components vertically aligned within each section
- Ensure clear visual hierarchy
- Use consistent spacing (40-60px between sections)
- Make arrows clear and not overlapping
- Add labels to arrows where helpful (e.g., "HTTP/REST", "AI Analysis")

**Text:**
- Use clear, readable fonts (Arial or similar)
- Service names: Bold, 14-16pt
- Descriptions: Regular, 10-12pt
- Section headers: Bold, 18-20pt

**Icons:**
- Laptop icon for Web Application
- Gateway/API icon for API Gateway
- Database cylinder icon for each database
- Cloud icon for external services
- Chat bubble icon for Message Broker

Create a clean, professional diagram that clearly shows:
1. Request flow from client to gateway to services
2. Each service's independent database
3. Integration points with external services
4. Optional async communication via message broker

The diagram should be suitable for documentation, presentations, and technical architecture discussions.

---


