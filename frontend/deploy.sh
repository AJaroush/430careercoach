#!/bin/bash

set -e

echo "🚀 Deploying Career Coach Frontend to Minikube"
echo ""

# Check if minikube is running
if ! minikube status > /dev/null 2>&1; then
    echo "⚠️  Minikube is not running. Starting Minikube..."
    minikube start
    echo "✅ Minikube started"
else
    echo "✅ Minikube is already running"
fi

# Configure Docker to use Minikube's Docker daemon
echo ""
echo "📦 Configuring Docker to use Minikube's Docker daemon..."
eval $(minikube docker-env)

# Build the Docker image
echo ""
echo "🔨 Building Docker image..."
docker build -t careercoach-frontend:latest .

# Deploy to Kubernetes
echo ""
echo "🚢 Deploying to Kubernetes..."
kubectl apply -f k8s/

# Wait for deployment to be ready
echo ""
echo "⏳ Waiting for deployment to be ready..."
kubectl rollout status deployment/careercoach-frontend --timeout=120s

# Get service URL
echo ""
echo "✅ Deployment complete!"
echo ""
echo "📍 Access your application:"
echo "   minikube service careercoach-frontend-service"
echo ""
echo "   Or directly at: http://$(minikube ip):30081"
echo ""
echo "📊 Check status:"
echo "   kubectl get pods -l app=careercoach-frontend"
echo "   kubectl get service careercoach-frontend-service"

