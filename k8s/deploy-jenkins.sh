#!/bin/bash

# Jenkins Deployment Script for Career Coach Platform
# This script deploys Jenkins with Ingress Controller to Kubernetes

set -e

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "🚀 Starting Jenkins Deployment..."
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

# Create Jenkins namespace
echo "📦 Creating Jenkins namespace..."
kubectl apply -f "${SCRIPT_DIR}/jenkins-namespace.yaml"
echo "✅ Jenkins namespace created"
echo ""

# Create RBAC resources
echo "📦 Creating RBAC resources..."
kubectl apply -f "${SCRIPT_DIR}/jenkins-rbac.yaml"
echo "✅ RBAC resources created"
echo ""

# Create PersistentVolumeClaim
echo "📦 Creating PersistentVolumeClaim..."
kubectl apply -f "${SCRIPT_DIR}/jenkins-pvc.yaml"
echo "✅ PersistentVolumeClaim created"
echo ""

# Wait for PVC to be bound
echo "⏳ Waiting for PVC to be bound..."
kubectl wait --for=condition=Bound pvc/jenkins-pvc -n jenkins --timeout=60s || true
echo ""

# Deploy Jenkins
echo "📦 Deploying Jenkins..."
kubectl apply -f "${SCRIPT_DIR}/jenkins-deployment.yaml"
kubectl apply -f "${SCRIPT_DIR}/jenkins-service.yaml"
echo "✅ Jenkins deployed"
echo ""

# Wait for Jenkins to be ready
echo "⏳ Waiting for Jenkins to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/jenkins -n jenkins || true
echo ""

# Deploy Jenkins Ingress
echo "📦 Deploying Jenkins Ingress..."
kubectl apply -f "${SCRIPT_DIR}/jenkins-ingress.yaml"
echo "✅ Jenkins Ingress deployed"
echo ""

# Get Jenkins admin password
echo "🔐 Retrieving Jenkins admin password..."
JENKINS_POD=$(kubectl get pods -n jenkins -l app=jenkins -o jsonpath='{.items[0].metadata.name}')
if [ -n "$JENKINS_POD" ]; then
    echo "Waiting for Jenkins pod to be ready..."
    kubectl wait --for=condition=ready pod/$JENKINS_POD -n jenkins --timeout=300s || true
    
    echo ""
    echo "═══════════════════════════════════════════════════════════"
    echo "🔑 Jenkins Initial Admin Password:"
    echo "═══════════════════════════════════════════════════════════"
    kubectl exec -n jenkins $JENKINS_POD -- cat /var/jenkins_home/secrets/initialAdminPassword 2>/dev/null || echo "Password not available yet. Please check Jenkins pod logs."
    echo ""
    echo "═══════════════════════════════════════════════════════════"
else
    echo "⚠️  Jenkins pod not found. Please check deployment status."
fi

# Get service information
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "📍 Jenkins Access Information:"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Check if running in Minikube
if command -v minikube &> /dev/null && minikube status &> /dev/null; then
    MINIKUBE_IP=$(minikube ip)
    echo "Minikube detected!"
    echo ""
    echo "Access Jenkins via:"
    echo "  http://jenkins.minikube.local (requires /etc/hosts configuration)"
    echo "  or"
    echo "  kubectl port-forward -n jenkins svc/jenkins 8080:8080"
    echo ""
    echo "Add to /etc/hosts:"
    echo "  $MINIKUBE_IP jenkins.minikube.local"
else
    echo "Access Jenkins via port-forward:"
    echo "  kubectl port-forward -n jenkins svc/jenkins 8080:8080"
    echo ""
    echo "Then open: http://localhost:8080"
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "📊 Check status with:"
echo "  kubectl get pods -n jenkins"
echo "  kubectl get svc -n jenkins"
echo "  kubectl get ingress -n jenkins"
echo ""
echo "📝 View logs with:"
echo "  kubectl logs -f -n jenkins deployment/jenkins"
echo "═══════════════════════════════════════════════════════════"
echo ""

