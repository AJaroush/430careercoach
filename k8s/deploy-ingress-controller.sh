#!/bin/bash

# NGINX Ingress Controller Deployment Script
# This script deploys NGINX Ingress Controller to Kubernetes

set -e

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "🚀 Starting NGINX Ingress Controller Deployment..."
echo ""

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is not installed. Please install kubectl first."
    exit 1
fi

# Check if Kubernetes cluster is accessible
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ Cannot connect to Kubernetes cluster. Please check your kubeconfig."
    exit 1
fi

echo "✅ Kubernetes cluster is accessible"
echo ""

# Deploy NGINX Ingress Controller
echo "📦 Deploying NGINX Ingress Controller..."
kubectl apply -f "${SCRIPT_DIR}/nginx-ingress-controller.yaml"
echo "✅ NGINX Ingress Controller deployed"
echo ""

# Wait for Ingress Controller to be ready (with shorter timeout)
echo "⏳ Waiting for Ingress Controller to be ready (this may take a few minutes for image pull)..."
echo "   You can skip this wait by pressing Ctrl+C - the deployment will continue in the background"
kubectl wait --for=condition=available --timeout=60s deployment/ingress-nginx-controller -n ingress-nginx 2>/dev/null || {
    echo "⚠️  Deployment still in progress. Checking status..."
    kubectl get pods -n ingress-nginx
    echo ""
    echo "💡 Tip: Run 'kubectl get pods -n ingress-nginx' to check when it's ready"
}
echo ""

# Deploy application ingress
echo "📦 Deploying application Ingress..."
kubectl apply -f "${SCRIPT_DIR}/ingress.yaml"
echo "✅ Application Ingress deployed"
echo ""

# Get service information
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "📍 Ingress Controller Information:"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Check if running in Minikube
if command -v minikube &> /dev/null && minikube status &> /dev/null; then
    MINIKUBE_IP=$(minikube ip)
    echo "Minikube detected!"
    echo ""
    echo "Ingress Controller NodePort:"
    echo "  HTTP:  http://$MINIKUBE_IP:30080"
    echo "  HTTPS: https://$MINIKUBE_IP:30443"
    echo ""
    echo "Application endpoints (add to /etc/hosts):"
    echo "  $MINIKUBE_IP cv-analysis.minikube.local"
    echo "  $MINIKUBE_IP career-planning.minikube.local"
    echo "  $MINIKUBE_IP progress-tracking.minikube.local"
    echo "  $MINIKUBE_IP user-management.minikube.local"
    echo "  $MINIKUBE_IP careercoach.minikube.local"
    echo "  $MINIKUBE_IP jenkins.minikube.local"
else
    echo "Ingress Controller Service Type: NodePort"
    echo "  HTTP:  Port 30080"
    echo "  HTTPS: Port 30443"
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "📊 Check status with:"
echo "  kubectl get pods -n ingress-nginx"
echo "  kubectl get svc -n ingress-nginx"
echo "  kubectl get ingress"
echo ""
echo "📝 View logs with:"
echo "  kubectl logs -f -n ingress-nginx deployment/ingress-nginx-controller"
echo "═══════════════════════════════════════════════════════════"
echo ""

