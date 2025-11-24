#!/bin/bash

# Script to set up separate microservices from monolithic frontend

set -e

FRONTEND_DIR="$(cd "$(dirname "$0")" && pwd)"
MICROSERVICES_DIR="$FRONTEND_DIR/microservices"

# Microservice configurations: name:page_component:route
MICROSERVICES=(
  "dashboard:Dashboard:/dashboard"
  "courses:CourseRecommendations:/courses"
  "skills-assessment:SkillsAssessment:/skills-assessment"
  "career-path:CareerPathPlanner:/career-path"
  "market-insights:JobMarketInsights:/market-insights"
  "interview-prep:InterviewPrep:/interview-prep"
  "career-goals:CareerGoals:/career-goals"
  "leaderboard:Leaderboard:/leaderboard"
  "profile:Profile:/profile"
)

echo "🚀 Setting up microservices..."

# Function to create a microservice
create_microservice() {
  local name=$1
  local page_component=$2
  local route=$3
  
  echo "📦 Creating microservice: $name"
  
  local ms_dir="$MICROSERVICES_DIR/$name"
  mkdir -p "$ms_dir/src/components/ui"
  mkdir -p "$ms_dir/src/lib"
  mkdir -p "$ms_dir/src/hooks"
  
  # Copy package.json
  cp "$FRONTEND_DIR/package.json" "$ms_dir/"
  cp "$FRONTEND_DIR/package-lock.json" "$ms_dir/" 2>/dev/null || true
  
  # Copy config files
  cp "$FRONTEND_DIR/vite.config.ts" "$ms_dir/"
  cp "$FRONTEND_DIR/tsconfig.json" "$ms_dir/"
  cp "$FRONTEND_DIR/tailwind.config.js" "$ms_dir/"
  cp "$FRONTEND_DIR/postcss.config.js" "$ms_dir/"
  
  # Copy index.html
  cp "$FRONTEND_DIR/index.html" "$ms_dir/"
  
  # Copy shared components
  cp -r "$FRONTEND_DIR/src/components/ui" "$ms_dir/src/components/"
  cp -r "$FRONTEND_DIR/src/components/app-layout.tsx" "$ms_dir/src/components/" 2>/dev/null || true
  cp -r "$FRONTEND_DIR/src/components/app-header.tsx" "$ms_dir/src/components/" 2>/dev/null || true
  cp -r "$FRONTEND_DIR/src/components/app-sidebar.tsx" "$ms_dir/src/components/" 2>/dev/null || true
  cp -r "$FRONTEND_DIR/src/components/theme-provider.tsx" "$ms_dir/src/components/" 2>/dev/null || true
  cp -r "$FRONTEND_DIR/src/components/auth" "$ms_dir/src/components/" 2>/dev/null || true
  
  # Copy shared lib files
  cp -r "$FRONTEND_DIR/src/lib" "$ms_dir/src/"
  
  # Copy hooks
  cp -r "$FRONTEND_DIR/src/hooks" "$ms_dir/src/"
  
  # Copy styles
  cp "$FRONTEND_DIR/src/index.css" "$ms_dir/src/"
  cp "$FRONTEND_DIR/src/styles.css" "$ms_dir/src/" 2>/dev/null || true
  
  # Copy the specific page component
  cp "$FRONTEND_DIR/src/pages/${page_component}.tsx" "$ms_dir/src/"
  
  # Create App.tsx for this microservice
  cat > "$ms_dir/src/App.tsx" <<EOF
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "./lib/msalInstance";
import { ThemeProvider } from "./components/theme-provider";
import { AuthProvider } from "./components/auth/AuthProvider";
import { AppLayout } from "./components/app-layout";
import ${page_component} from "./${page_component}";

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter>
          <AuthProvider>
            <div className="min-h-screen bg-background">
              <AppLayout>
                <${page_component} />
              </AppLayout>
            </div>
            <Toaster />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </MsalProvider>
  );
}

export default App;
EOF

  # Create main.tsx
  cp "$FRONTEND_DIR/src/main.tsx" "$ms_dir/src/"
  
  # Create Dockerfile
  cat > "$ms_dir/Dockerfile" <<EOF
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Configure nginx for SPA
RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files \$uri \$uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
EOF

  # Create .dockerignore
  cat > "$ms_dir/.dockerignore" <<EOF
node_modules
dist
.git
.env
*.log
EOF

  echo "✅ Created microservice: $name"
}

# Create all microservices
for ms_config in "${MICROSERVICES[@]}"; do
  IFS=':' read -r name page route <<< "$ms_config"
  create_microservice "$name" "$page" "$route"
done

echo ""
echo "🎉 All microservices created!"
echo ""
echo "📁 Microservices are in: $MICROSERVICES_DIR"
echo ""
echo "To build a microservice:"
echo "  cd microservices/dashboard && docker build -t careercoach-dashboard ."
echo ""
echo "To build all:"
echo "  ./build-all-microservices.sh"

