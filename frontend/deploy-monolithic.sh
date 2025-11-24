#!/bin/bash

# Deploy Monolithic Frontend to Docker
# Single service with all features

set -e

echo "🚀 Deploying Monolithic Frontend..."
echo ""

cd "$(dirname "$0")"

# Deploy monolithic frontend
echo "📦 Building and deploying monolithic frontend..."
docker-compose -p careercoach-monolithic -f docker-compose-monolithic.yml up -d --build
echo ""

# Wait a moment for service to start
sleep 3

echo "🎉 Monolithic Frontend Deployed!"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "📍 Frontend Endpoint:"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "✅ Monolithic Frontend:"
echo "   http://localhost:3000"
echo ""
echo "   All features available:"
echo "   - Dashboard: http://localhost:3000/dashboard"
echo "   - Courses: http://localhost:3000/courses"
echo "   - Skills Assessment: http://localhost:3000/skills-assessment"
echo "   - Career Path: http://localhost:3000/career-path"
echo "   - Market Insights: http://localhost:3000/market-insights"
echo "   - Interview Prep: http://localhost:3000/interview-prep"
echo "   - Career Goals: http://localhost:3000/career-goals"
echo "   - Leaderboard: http://localhost:3000/leaderboard"
echo "   - Profile: http://localhost:3000/profile"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "📊 Check status:"
echo "   docker ps | grep careercoach-frontend-monolithic"
echo ""
echo "🔍 View logs:"
echo "   docker-compose -p careercoach-monolithic -f docker-compose-monolithic.yml logs -f"
echo ""
echo "🛑 Stop service:"
echo "   docker-compose -p careercoach-monolithic -f docker-compose-monolithic.yml down"
echo ""


