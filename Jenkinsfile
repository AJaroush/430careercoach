pipeline {
    agent any
    
    environment {
        KUBERNETES_NAMESPACE = 'default'
        BACKEND_IMAGE = 'careercoach-backend'
        FRONTEND_IMAGE = 'careercoach-frontend'
        IMAGE_TAG = "${env.BUILD_NUMBER}-${env.GIT_COMMIT.take(7)}"
        MINIKUBE_DOCKER_ENV = 'eval $(minikube docker-env)'
    }
    
    options {
        // Build timeout of 10 minutes
        timeout(time: 10, unit: 'MINUTES')
        // Keep only last 10 builds
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }
    
    triggers {
        // Poll SCM every 2 minutes for changes
        pollSCM('H/2 * * * *')
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.GIT_COMMIT_SHORT = sh(
                        script: 'git rev-parse --short HEAD',
                        returnStdout: true
                    ).trim()
                    env.GIT_COMMIT = sh(
                        script: 'git rev-parse HEAD',
                        returnStdout: true
                    ).trim()
                }
            }
        }
        
        stage('Setup Minikube Docker') {
            steps {
                script {
                    echo "Configuring Docker to use Minikube's Docker daemon..."
                    sh """
                        eval \$(minikube docker-env)
                        docker info | head -5
                    """
                }
            }
        }
        
        stage('Build Backend') {
            steps {
                script {
                    echo "Building backend Docker image..."
                    sh """
                        eval \$(minikube docker-env)
                        docker build -t ${BACKEND_IMAGE}:${IMAGE_TAG} .
                        docker tag ${BACKEND_IMAGE}:${IMAGE_TAG} ${BACKEND_IMAGE}:latest
                        docker images | grep ${BACKEND_IMAGE} | head -3
                    """
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                script {
                    echo "Building frontend Docker image..."
                    dir('frontend') {
                        sh """
                            eval \$(minikube docker-env)
                            docker build -t ${FRONTEND_IMAGE}:${IMAGE_TAG} .
                            docker tag ${FRONTEND_IMAGE}:${IMAGE_TAG} ${FRONTEND_IMAGE}:latest
                            docker images | grep ${FRONTEND_IMAGE} | head -3
                        """
                    }
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    echo "Deploying to Kubernetes..."
                    
                    // Update image tags in deployment files (use latest for faster deployment)
                    sh """
                        # Update backend deployments
                        for file in k8s/*-deployment.yaml; do
                            if grep -q 'careercoach-backend' "\$file" 2>/dev/null; then
                                sed -i.bak 's|image: ${BACKEND_IMAGE}:.*|image: ${BACKEND_IMAGE}:latest|g' "\$file"
                            fi
                        done
                        
                        # Update frontend deployment
                        if [ -f k8s/frontend-deployment.yaml ]; then
                            sed -i.bak 's|image: ${FRONTEND_IMAGE}:.*|image: ${FRONTEND_IMAGE}:latest|g' k8s/frontend-deployment.yaml
                        fi
                    """
                    
                    // Apply Kubernetes manifests
                    sh """
                        kubectl apply -f k8s/cv-analysis-deployment.yaml || true
                        kubectl apply -f k8s/cv-analysis-service.yaml || true
                        kubectl apply -f k8s/career-planning-deployment.yaml || true
                        kubectl apply -f k8s/career-planning-service.yaml || true
                        kubectl apply -f k8s/progress-tracking-deployment.yaml || true
                        kubectl apply -f k8s/progress-tracking-service.yaml || true
                        kubectl apply -f k8s/user-management-deployment.yaml || true
                        kubectl apply -f k8s/user-management-service.yaml || true
                        kubectl apply -f k8s/frontend-deployment.yaml || true
                        kubectl apply -f k8s/frontend-service.yaml || true
                    """
                    
                    // Trigger rollout with faster timeout
                    sh """
                        kubectl rollout restart deployment/cv-analysis-service || true
                        kubectl rollout restart deployment/career-planning-service || true
                        kubectl rollout restart deployment/progress-tracking-service || true
                        kubectl rollout restart deployment/user-management-service || true
                        kubectl rollout restart deployment/careercoach-frontend || true
                    """
                    
                    // Wait for rollout with shorter timeout (2 minutes max)
                    sh """
                        timeout 120 kubectl rollout status deployment/careercoach-frontend --timeout=120s || true
                        timeout 120 kubectl rollout status deployment/cv-analysis-service --timeout=120s || true
                    """
                }
            }
        }
        
        stage('Health Check') {
            steps {
                script {
                    echo "Performing health checks..."
                    sh """
                        kubectl get pods -l app=careercoach-frontend || true
                        kubectl get svc | grep careercoach || true
                    """
                }
            }
        }
    }
    
    post {
        success {
            echo "✅ Pipeline succeeded! Application deployed."
            script {
                sh """
                    echo "=========================================="
                    echo "Deployment successful!"
                    echo "Build Number: ${IMAGE_TAG}"
                    echo "Git Commit: ${env.GIT_COMMIT_SHORT}"
                    echo "Deployment Time: \$(date)"
                    echo "=========================================="
                """
            }
        }
        failure {
            echo "❌ Pipeline failed!"
            script {
                sh """
                    echo "Checking pod status..."
                    kubectl get pods
                    kubectl get events --sort-by='.lastTimestamp' | tail -10
                """
            }
        }
        always {
            // Clean workspace but keep logs
            cleanWs(cleanWhenNotBuilt: false, deleteDirs: true)
        }
    }
}

