#!/bin/bash

# Deploy Separate Frontend Microservices to Docker
# Each microservice is built from its own folder

set -e

echo "🚀 Deploying Separate Frontend Microservices..."
echo ""

cd "$(dirname "$0")"

# Deploy all microservices
echo "📦 Building and deploying all frontend microservices..."
docker-compose -p careercoach -f docker-compose-microservices-separate.yml up -d --build
echo ""

# Wait a moment for services to start
sleep 3

echo "🎉 Frontend Microservices Deployed!"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "📍 Frontend Microservice Endpoints:"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "✅ Dashboard Service:"
echo "   http://localhost:4001"
echo ""
echo "✅ Course Recommendations Service:"
echo "   http://localhost:4002"
echo ""
echo "✅ Skills Assessment Service:"
echo "   http://localhost:4003"
echo ""
echo "✅ Career Path Planner Service:"
echo "   http://localhost:4004"
echo ""
echo "✅ Job Market Insights Service:"
echo "   http://localhost:4005"
echo ""
echo "✅ Interview Prep Service:"
echo "   http://localhost:4006"
echo ""
echo "✅ Career Goals Service:"
echo "   http://localhost:4007"
echo ""
echo "✅ Leaderboard Service:"
echo "   http://localhost:4008"
echo ""
echo "✅ Profile Service:"
echo "   http://localhost:4009"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "📊 Check status:"
echo "   docker ps | grep careercoach"
echo ""
echo "🔍 View logs:"
echo "   docker-compose -p careercoach -f docker-compose-microservices-separate.yml logs -f"
echo ""
echo "🛑 Stop all services:"
echo "   docker-compose -p careercoach -f docker-compose-microservices-separate.yml down"
echo ""

