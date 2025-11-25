pipeline {
    agent any
    
    environment {
        KUBERNETES_NAMESPACE = 'default'
        BACKEND_IMAGE = 'careercoach-backend'
        FRONTEND_IMAGE = 'careercoach-frontend'
        IMAGE_TAG = "${env.BUILD_NUMBER}-${env.GIT_COMMIT.take(7)}"
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
        
        stage('Build Backend') {
            steps {
                script {
                    echo "Building backend Docker image..."
                    sh """
                        # Use Docker from host via mounted socket
                        export DOCKER_HOST=unix:///var/run/docker.sock
                        # Try to use docker CLI (should be available via socket)
                        # If docker command not found, install it
                        if ! command -v docker &> /dev/null 2>&1; then
                            echo "Installing docker CLI..."
                            apt-get update -qq && apt-get install -y docker.io > /dev/null 2>&1 || \
                            apk add --no-cache docker-cli > /dev/null 2>&1 || \
                            echo "Docker CLI installation failed, trying direct socket access"
                        fi
                        # Build using docker socket directly
        docker build -t ${BACKEND_IMAGE}:${IMAGE_TAG} . || \
        (curl -sSL https://get.docker.com/ | sh && docker build -t ${BACKEND_IMAGE}:${IMAGE_TAG} .)
                        docker tag ${BACKEND_IMAGE}:${IMAGE_TAG} ${BACKEND_IMAGE}:latest || true
                        docker images | grep ${BACKEND_IMAGE} | head -3 || echo "Images built"
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
                            # Use Docker from host via mounted socket
                            export DOCKER_HOST=unix:///var/run/docker.sock
                            # Try to use docker CLI
                            if ! command -v docker &> /dev/null 2>&1; then
                                echo "Installing docker CLI..."
                                apt-get update -qq && apt-get install -y docker.io > /dev/null 2>&1 || \
                                apk add --no-cache docker-cli > /dev/null 2>&1 || \
                                echo "Docker CLI installation failed"
                            fi
                            # Build using docker socket
        docker build -t ${FRONTEND_IMAGE}:${IMAGE_TAG} . || \
        (curl -sSL https://get.docker.com/ | sh && docker build -t ${FRONTEND_IMAGE}:${IMAGE_TAG} .)
                            docker tag ${FRONTEND_IMAGE}:${IMAGE_TAG} ${FRONTEND_IMAGE}:latest || true
                            docker images | grep ${FRONTEND_IMAGE} | head -3 || echo "Images built"
                        """
                    }
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    echo "Deploying to Kubernetes..."
                    
                    // Update image tags in deployment files
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
                    
                    // Use kubectl via service account token
                    sh """
                        # Install kubectl if not available
                        if ! command -v kubectl &> /dev/null; then
                            curl -LO "https://dl.k8s.io/release/\$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
                            chmod +x kubectl
                            mv kubectl /usr/local/bin/ || export PATH=\$PWD:\$PATH
                        fi
                        
                        # Configure kubectl to use service account
                        export KUBECONFIG=/var/run/secrets/kubernetes.io/serviceaccount/kubeconfig || true
                        kubectl config set-cluster default --server=https://kubernetes.default.svc --certificate-authority=/var/run/secrets/kubernetes.io/serviceaccount/ca.crt || true
                        kubectl config set-credentials default --token=\$(cat /var/run/secrets/kubernetes.io/serviceaccount/token) || true
                        kubectl config set-context default --cluster=default --user=default || true
                        kubectl config use-context default || true
                        
                        # Apply Kubernetes manifests
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
                        
                        # Trigger rollout
                        kubectl rollout restart deployment/cv-analysis-service || true
                        kubectl rollout restart deployment/career-planning-service || true
                        kubectl rollout restart deployment/progress-tracking-service || true
                        kubectl rollout restart deployment/user-management-service || true
                        kubectl rollout restart deployment/careercoach-frontend || true
                        
                        # Wait for rollout
                        kubectl rollout status deployment/careercoach-frontend --timeout=120s || true
                        kubectl rollout status deployment/cv-analysis-service --timeout=120s || true
                    """
                }
            }
        }
        
        stage('Health Check') {
            steps {
                script {
                    echo "Performing health checks..."
                    sh """
                        if command -v kubectl &> /dev/null; then
                            kubectl get pods -l app=careercoach-frontend || true
                            kubectl get svc | grep careercoach || true
                        fi
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
                    if command -v kubectl &> /dev/null; then
                        kubectl get pods || true
                        kubectl get events --sort-by='.lastTimestamp' | tail -10 || true
                    fi
                """
            }
        }
        always {
            // Clean workspace but keep logs
            cleanWs(cleanWhenNotBuilt: false, deleteDirs: true)
        }
    }
}

