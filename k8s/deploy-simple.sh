#!/bin/bash

# Career Coach Minikube Deployment Script (NodePort Only - No Ingress Required)
# This script deploys all microservices to Minikube using NodePorts

set -e

echo "🚀 Starting Career Coach Minikube Deployment (NodePort Mode)..."
echo ""

# Check if Minikube is running
if ! minikube status > /dev/null 2>&1; then
    echo "❌ Minikube is not running. Starting Minikube..."
    minikube start
fi

echo "✅ Minikube is running"
echo ""

# Configure Docker to use Minikube's Docker daemon
echo "🐳 Configuring Docker to use Minikube's Docker daemon..."
eval $(minikube docker-env)
echo ""

# Build Docker images
echo "🔨 Building Docker images..."
echo "Building backend image..."
docker build -t careercoach-backend:latest . || {
    echo "❌ Failed to build backend image"
    exit 1
}

echo "Building frontend image..."
cd frontend
docker build -t careercoach-frontend:latest . || {
    echo "❌ Failed to build frontend image"
    exit 1
}
cd ..
echo "✅ Images built successfully"
echo ""

# Deploy CV Analysis Service
echo "📦 Deploying CV Analysis Service..."
kubectl apply -f k8s/cv-analysis-deployment.yaml
kubectl apply -f k8s/cv-analysis-service.yaml
echo "✅ CV Analysis Service deployed"
echo ""

# Deploy Career Planning Service
echo "📦 Deploying Career Planning Service..."
kubectl apply -f k8s/career-planning-deployment.yaml
kubectl apply -f k8s/career-planning-service.yaml
echo "✅ Career Planning Service deployed"
echo ""

# Deploy Progress Tracking Service
echo "📦 Deploying Progress Tracking Service..."
kubectl apply -f k8s/progress-tracking-deployment.yaml
kubectl apply -f k8s/progress-tracking-service.yaml
echo "✅ Progress Tracking Service deployed"
echo ""

# Deploy User Management Service
echo "📦 Deploying User Management Service..."
kubectl apply -f k8s/user-management-deployment.yaml
kubectl apply -f k8s/user-management-service.yaml
echo "✅ User Management Service deployed"
echo ""

# Deploy Frontend
echo "📦 Deploying Frontend..."
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
echo "✅ Frontend deployed"
echo ""

# Wait for deployments to be ready
echo "⏳ Waiting for deployments to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/cv-analysis-service || true
kubectl wait --for=condition=available --timeout=300s deployment/career-planning-service || true
kubectl wait --for=condition=available --timeout=300s deployment/progress-tracking-service || true
kubectl wait --for=condition=available --timeout=300s deployment/user-management-service || true
kubectl wait --for=condition=available --timeout=300s deployment/careercoach-frontend || true
echo ""

# Get Minikube IP
MINIKUBE_IP=$(minikube ip)

echo "🎉 Deployment Complete!"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "📍 Service Endpoints (NodePort - Direct Access):"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "✅ CV Analysis Service:"
echo "   http://$MINIKUBE_IP:30090"
echo "   API: http://$MINIKUBE_IP:30090/api/cv/public/analyze/"
echo ""
echo "✅ Career Planning Service:"
echo "   http://$MINIKUBE_IP:30091"
echo "   API: http://$MINIKUBE_IP:30091/api/career/"
echo ""
echo "✅ Progress Tracking Service:"
echo "   http://$MINIKUBE_IP:30092"
echo "   API: http://$MINIKUBE_IP:30092/api/progress/"
echo ""
echo "✅ User Management Service:"
echo "   http://$MINIKUBE_IP:30093"
echo "   API: http://$MINIKUBE_IP:30093/api/users/"
echo ""
echo "✅ Frontend:"
echo "   http://$MINIKUBE_IP:30080"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "📊 Check status with:"
echo "   kubectl get deployments"
echo "   kubectl get services"
echo "   kubectl get pods"
echo ""
echo "🔍 View logs:"
echo "   kubectl logs -f deployment/cv-analysis-service"
echo "   kubectl logs -f deployment/career-planning-service"
echo ""

