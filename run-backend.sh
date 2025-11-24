#!/bin/bash

# Run Django Backend API Server
# Single service on port 8000 (API Gateway pattern)

set -e

echo "🚀 Starting Django Backend API Server..."
echo ""

cd "$(dirname "$0")"

# Check if Docker image exists
if ! docker images | grep -q "careercoach-backend"; then
    echo "📦 Building backend Docker image..."
    docker build -t careercoach-backend:latest .
    echo "✅ Image built"
    echo ""
fi

# Stop any existing backend containers
docker-compose -f docker-compose-backend.yml down 2>/dev/null || true
docker-compose -f docker-compose-microservices.yml down 2>/dev/null || true

# Start backend service
echo "📦 Starting backend API server..."
docker-compose -f docker-compose-backend.yml up -d

# Wait for service to start
sleep 5

echo ""
echo "🎉 Django Backend API Server Started!"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "📍 API Endpoints:"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "✅ Main API Gateway:"
echo "   http://localhost:8000"
echo ""
echo "✅ CV Analysis API:"
echo "   http://localhost:8000/api/cv/public/analyze/"
echo ""
echo "✅ Career Planning API:"
echo "   http://localhost:8000/api/career/"
echo ""
echo "✅ Progress Tracking API:"
echo "   http://localhost:8000/api/progress/"
echo ""
echo "✅ User Management API:"
echo "   http://localhost:8000/api/users/"
echo ""
echo "✅ Django Admin:"
echo "   http://localhost:8000/admin/"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "📊 Check status:"
echo "   docker ps | grep careercoach-backend-api"
echo ""
echo "🔍 View logs:"
echo "   docker-compose -f docker-compose-backend.yml logs -f"
echo ""
echo "🛑 Stop service:"
echo "   docker-compose -f docker-compose-backend.yml down"
echo ""
