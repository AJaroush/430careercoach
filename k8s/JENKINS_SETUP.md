# Jenkins CI/CD Setup Guide

This guide explains how to set up and use Jenkins for CI/CD in the Career Coach platform.

## Prerequisites

- Kubernetes cluster (Minikube, GKE, EKS, AKS, etc.)
- kubectl configured and connected to your cluster
- Docker installed (for building images)
- Git repository access

## Architecture

Jenkins is deployed as a Kubernetes deployment with:
- Persistent storage for Jenkins home directory
- RBAC for Kubernetes integration
- Ingress for external access
- Docker socket access for building images

## Deployment Steps

### 1. Deploy NGINX Ingress Controller (if not already deployed)

```bash
chmod +x k8s/deploy-ingress-controller.sh
./k8s/deploy-ingress-controller.sh
```

Or manually:
```bash
kubectl apply -f k8s/nginx-ingress-controller.yaml
```

### 2. Deploy Jenkins

```bash
chmod +x k8s/deploy-jenkins.sh
./k8s/deploy-jenkins.sh
```

Or manually:
```bash
# Create namespace and RBAC
kubectl apply -f k8s/jenkins-namespace.yaml
kubectl apply -f k8s/jenkins-rbac.yaml

# Create PVC
kubectl apply -f k8s/jenkins-pvc.yaml

# Deploy Jenkins
kubectl apply -f k8s/jenkins-deployment.yaml
kubectl apply -f k8s/jenkins-service.yaml

# Deploy Ingress
kubectl apply -f k8s/jenkins-ingress.yaml
```

### 3. Access Jenkins

#### Option A: Using Ingress (Recommended)

1. Add to `/etc/hosts` (or `C:\Windows\System32\drivers\etc\hosts` on Windows):
   ```
   <MINIKUBE_IP> jenkins.minikube.local
   ```

2. Access Jenkins:
   ```
   http://jenkins.minikube.local
   ```

#### Option B: Using Port Forward

```bash
kubectl port-forward -n jenkins svc/jenkins 8080:8080
```

Then access: `http://localhost:8080`

### 4. Get Initial Admin Password

```bash
JENKINS_POD=$(kubectl get pods -n jenkins -l app=jenkins -o jsonpath='{.items[0].metadata.name}')
kubectl exec -n jenkins $JENKINS_POD -- cat /var/jenkins_home/secrets/initialAdminPassword
```

### 5. Initial Jenkins Setup

1. Enter the admin password from step 4
2. Install suggested plugins
3. Create an admin user (or skip to use default)
4. Configure Jenkins URL

## Configuring Jenkins for CI/CD

### 1. Install Required Plugins

Go to **Manage Jenkins** → **Manage Plugins** → **Available** and install:
- Kubernetes Plugin
- Docker Pipeline Plugin
- Git Plugin
- Pipeline Plugin
- Blue Ocean (optional, for better UI)

### 2. Configure Kubernetes Cloud (Optional)

If you want Jenkins agents to run in Kubernetes:

1. Go to **Manage Jenkins** → **Manage Nodes and Clouds** → **Configure Clouds**
2. Add a new cloud → **Kubernetes**
3. Configure:
   - Kubernetes URL: `https://kubernetes.default.svc`
   - Kubernetes Namespace: `jenkins`
   - Credentials: Use default service account

### 3. Configure Docker Access

Jenkins needs access to Docker for building images. The deployment includes Docker socket mounting, but you may need to:

1. Ensure Jenkins has permissions to use Docker
2. Configure Docker registry credentials in Jenkins (if using external registry)

### 4. Create a Pipeline Job

1. Click **New Item**
2. Enter job name (e.g., "CareerCoach-CI-CD")
3. Select **Pipeline**
4. Click **OK**

### 5. Configure Pipeline

In the pipeline configuration:

**Pipeline Definition:**
- Select **Pipeline script from SCM**
- SCM: **Git**
- Repository URL: Your Git repository URL
- Credentials: Add if repository is private
- Branch: `*/main` (or your default branch)
- Script Path: `Jenkinsfile`

**Build Triggers (Optional):**
- Poll SCM: `H/5 * * * *` (check every 5 minutes)
- GitHub hook trigger (if using GitHub)

### 6. Run the Pipeline

1. Click **Build Now**
2. Monitor the build progress
3. Check console output for any issues

## Jenkinsfile Overview

The `Jenkinsfile` in the root directory defines the CI/CD pipeline with these stages:

1. **Checkout**: Gets the latest code from Git
2. **Build Backend**: Builds the Django backend Docker image
3. **Build Frontend**: Builds the React frontend Docker image
4. **Test Backend**: Runs backend tests (optional)
5. **Deploy to Kubernetes**: Deploys all services to Kubernetes
6. **Health Check**: Verifies deployment status

## Customizing the Pipeline

### Environment Variables

Edit the `environment` section in `Jenkinsfile`:

```groovy
environment {
    DOCKER_REGISTRY = 'your-registry.com'
    KUBERNETES_NAMESPACE = 'production'
    BACKEND_IMAGE = 'careercoach-backend'
    FRONTEND_IMAGE = 'careercoach-frontend'
}
```

### Adding Stages

Add new stages to the `stages` block:

```groovy
stage('Your Stage Name') {
    steps {
        script {
            echo "Do something..."
            sh "your-command"
        }
    }
}
```

### Adding Notifications

Add notification steps in the `post` section:

```groovy
post {
    success {
        emailext (
            subject: "Build Success: ${env.JOB_NAME} - ${env.BUILD_NUMBER}",
            body: "Build succeeded!",
            to: "team@example.com"
        )
    }
}
```

## Troubleshooting

### Jenkins Pod Not Starting

```bash
# Check pod status
kubectl get pods -n jenkins

# View pod logs
kubectl logs -n jenkins deployment/jenkins

# Describe pod for events
kubectl describe pod -n jenkins -l app=jenkins
```

### PVC Not Bound

```bash
# Check PVC status
kubectl get pvc -n jenkins

# Check storage class
kubectl get storageclass
```

### Cannot Access Jenkins

1. Check Ingress status:
   ```bash
   kubectl get ingress -n jenkins
   ```

2. Check Ingress Controller:
   ```bash
   kubectl get pods -n ingress-nginx
   ```

3. Use port-forward as alternative:
   ```bash
   kubectl port-forward -n jenkins svc/jenkins 8080:8080
   ```

### Build Failures

1. Check build console output in Jenkins UI
2. Verify Docker images can be built locally
3. Check Kubernetes permissions:
   ```bash
   kubectl auth can-i create deployments --namespace=default --as=system:serviceaccount:jenkins:jenkins
   ```

### Docker Build Issues

If Jenkins cannot build Docker images:

1. Verify Docker socket is mounted:
   ```bash
   kubectl exec -n jenkins deployment/jenkins -- ls -la /var/run/docker.sock
   ```

2. Check Docker daemon access:
   ```bash
   kubectl exec -n jenkins deployment/jenkins -- docker ps
   ```

## Security Considerations

1. **Change default admin password** after first login
2. **Use secrets** for sensitive data (API keys, passwords)
3. **Restrict RBAC permissions** to minimum required
4. **Use HTTPS** for Jenkins access in production
5. **Regular backups** of Jenkins home directory (PVC)
6. **Keep Jenkins updated** to latest LTS version

## Backup and Restore

### Backup Jenkins Configuration

```bash
# Create backup of Jenkins home
kubectl exec -n jenkins deployment/jenkins -- tar czf /tmp/jenkins-backup.tar.gz /var/jenkins_home

# Copy backup locally
kubectl cp jenkins/<pod-name>:/tmp/jenkins-backup.tar.gz ./jenkins-backup.tar.gz
```

### Restore Jenkins Configuration

```bash
# Copy backup to pod
kubectl cp ./jenkins-backup.tar.gz jenkins/<pod-name>:/tmp/jenkins-backup.tar.gz

# Extract backup
kubectl exec -n jenkins deployment/jenkins -- tar xzf /tmp/jenkins-backup.tar.gz -C /
```

## Scaling Jenkins

To scale Jenkins (if using multiple replicas):

```bash
kubectl scale deployment jenkins -n jenkins --replicas=2
```

Note: Multiple Jenkins instances require shared storage and session management configuration.

## Cleanup

To remove Jenkins:

```bash
kubectl delete -f k8s/jenkins-ingress.yaml
kubectl delete -f k8s/jenkins-service.yaml
kubectl delete -f k8s/jenkins-deployment.yaml
kubectl delete -f k8s/jenkins-pvc.yaml
kubectl delete -f k8s/jenkins-rbac.yaml
kubectl delete -f k8s/jenkins-namespace.yaml
```

## Additional Resources

- [Jenkins Documentation](https://www.jenkins.io/doc/)
- [Jenkins Kubernetes Plugin](https://plugins.jenkins.io/kubernetes/)
- [Jenkins Pipeline Syntax](https://www.jenkins.io/doc/book/pipeline/syntax/)

