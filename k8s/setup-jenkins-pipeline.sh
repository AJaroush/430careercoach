#!/bin/bash

# Quick Setup Script for Jenkins Automated CI/CD Pipeline
# This script helps configure Jenkins for automatic deployments

set -e

echo "═══════════════════════════════════════════════════════════"
echo "🚀 Jenkins Automated CI/CD Pipeline Setup"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is not installed"
    exit 1
fi

if ! command -v minikube &> /dev/null; then
    echo "❌ minikube is not installed"
    exit 1
fi

if ! minikube status &> /dev/null; then
    echo "❌ Minikube is not running. Start it with: minikube start"
    exit 1
fi

if ! kubectl get deployment jenkins -n jenkins &> /dev/null; then
    echo "❌ Jenkins is not deployed. Deploy it first with: ./deploy-jenkins.sh"
    exit 1
fi

echo "✅ All prerequisites met"
echo ""

# Get Jenkins access info
echo "═══════════════════════════════════════════════════════════"
echo "📍 Jenkins Access Information"
echo "═══════════════════════════════════════════════════════════"
echo ""

JENKINS_POD=$(kubectl get pods -n jenkins -l app=jenkins -o jsonpath='{.items[0].metadata.name}' 2>/dev/null)

if [ -n "$JENKINS_POD" ]; then
    JENKINS_PASSWORD=$(kubectl exec -n jenkins $JENKINS_POD -- cat /var/jenkins_home/secrets/initialAdminPassword 2>/dev/null || echo "Not available")
    
    echo "Jenkins URL:"
    echo "  http://localhost:8080"
    echo "  or"
    echo "  http://jenkins.minikube.local (if /etc/hosts configured)"
    echo ""
    echo "Admin Password: $JENKINS_PASSWORD"
    echo ""
else
    echo "⚠️  Jenkins pod not found"
fi

# Get repository URL
echo "═══════════════════════════════════════════════════════════"
echo "📦 Repository Configuration"
echo "═══════════════════════════════════════════════════════════"
echo ""

if [ -d ".git" ]; then
    REPO_URL=$(git remote get-url origin 2>/dev/null || echo "")
    CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "main")
    
    echo "Detected Git repository:"
    echo "  URL: $REPO_URL"
    echo "  Branch: $CURRENT_BRANCH"
    echo ""
else
    echo "⚠️  Not a Git repository. Please configure manually in Jenkins."
    REPO_URL=""
    CURRENT_BRANCH="main"
fi

# Instructions
echo "═══════════════════════════════════════════════════════════"
echo "📝 Setup Instructions"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "1. Open Jenkins:"
echo "   http://localhost:8080"
echo ""
echo "2. Login with:"
echo "   Username: admin"
echo "   Password: $JENKINS_PASSWORD"
echo ""
echo "3. Create a new Pipeline job:"
echo "   - Click 'New Item'"
echo "   - Name: CareerCoach-CI-CD"
echo "   - Type: Pipeline"
echo "   - Click OK"
echo ""
echo "4. Configure the Pipeline:"
echo "   - Pipeline Definition: Pipeline script from SCM"
echo "   - SCM: Git"
if [ -n "$REPO_URL" ]; then
    echo "   - Repository URL: $REPO_URL"
else
    echo "   - Repository URL: [Your Git repository URL]"
fi
echo "   - Branch: */$CURRENT_BRANCH"
echo "   - Script Path: Jenkinsfile"
echo ""
echo "5. Enable Build Triggers:"
echo "   - ✅ Poll SCM: H/2 * * * * (every 2 minutes)"
echo "   - Or use GitHub/GitLab webhook (see JENKINS_AUTOMATED_DEPLOYMENT.md)"
echo ""
echo "6. Save and run:"
echo "   - Click 'Save'"
echo "   - Click 'Build Now' to test"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "✅ Setup Complete!"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "📚 For detailed instructions, see:"
echo "   k8s/JENKINS_AUTOMATED_DEPLOYMENT.md"
echo ""
echo "🧪 To test automatic deployment:"
echo "   1. Make a change to your code"
echo "   2. Commit and push: git commit -am 'Test' && git push"
echo "   3. Wait 2 minutes - Jenkins will automatically build and deploy!"
echo ""

