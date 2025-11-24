#!/bin/bash

# Career Coach Minikube Deployment Script
# This script deploys all microservices to Minikube

set -e

echo "🚀 Starting Career Coach Minikube Deployment..."
echo ""

# Check if Minikube is running
if ! minikube status > /dev/null 2>&1; then
    echo "❌ Minikube is not running. Starting Minikube..."
    minikube start
fi

echo "✅ Minikube is running"
echo ""

# Enable Ingress addon (optional - skip if it fails)
echo "📦 Attempting to enable Ingress addon..."
if minikube addons enable ingress 2>/dev/null; then
    echo "✅ Ingress addon enabled"
else
    echo "⚠️  Ingress addon failed to enable (this is okay, we'll use NodePorts)"
    echo "   You can still access services via NodePorts"
fi
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

# Deploy Ingress (optional - only if ingress addon is working)
echo "📦 Attempting to deploy Ingress..."
if kubectl get namespace ingress-nginx > /dev/null 2>&1 && kubectl get pods -n ingress-nginx | grep -q Running; then
    kubectl apply -f k8s/ingress.yaml
    echo "✅ Ingress deployed"
else
    echo "⚠️  Skipping Ingress deployment (using NodePorts instead)"
fi
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
echo "📍 Service Endpoints (NodePort):"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "CV Analysis Service:"
echo "  http://$MINIKUBE_IP:30081"
echo ""
echo "Career Planning Service:"
echo "  http://$MINIKUBE_IP:30082"
echo ""
echo "Progress Tracking Service:"
echo "  http://$MINIKUBE_IP:30083"
echo ""
echo "User Management Service:"
echo "  http://$MINIKUBE_IP:30084"
echo ""
echo "Frontend:"
echo "  http://$MINIKUBE_IP:30080"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "🌐 Host-based Access (requires /etc/hosts configuration):"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Add these lines to /etc/hosts (or C:\\Windows\\System32\\drivers\\etc\\hosts on Windows):"
echo ""
echo "$MINIKUBE_IP cv-analysis.minikube.local"
echo "$MINIKUBE_IP career-planning.minikube.local"
echo "$MINIKUBE_IP progress-tracking.minikube.local"
echo "$MINIKUBE_IP user-management.minikube.local"
echo "$MINIKUBE_IP careercoach.minikube.local"
echo ""
echo "Then access via:"
echo "  CV Analysis:        http://cv-analysis.minikube.local"
echo "  Career Planning:    http://career-planning.minikube.local"
echo "  Progress Tracking:  http://progress-tracking.minikube.local"
echo "  User Management:    http://user-management.minikube.local"
echo "  Frontend:           http://careercoach.minikube.local"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "📊 Check status with:"
echo "  kubectl get deployments"
echo "  kubectl get services"
echo "  kubectl get pods"
echo "  kubectl get ingress"
echo ""

