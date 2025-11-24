# Frontend Deployment Guide (Minikube)

This guide will help you deploy the Career Coach frontend to Minikube.

## Prerequisites

- Docker installed
- Minikube installed
- kubectl configured

## Quick Start (Automated)

Run the deployment script:

```bash
./deploy.sh
```

This script will:
1. Start Minikube if not running
2. Configure Docker to use Minikube's Docker daemon
3. Build the Docker image
4. Deploy to Kubernetes
5. Show you the access URL

## Manual Deployment Steps

### 1. Start Minikube (if not already running)

```bash
minikube start
```

### 2. Configure Docker to use Minikube's Docker daemon

```bash
eval $(minikube docker-env)
```

### 3. Build the Docker image

From the `frontend` directory:

```bash
docker build -t careercoach-frontend:latest .
```

### 4. Deploy to Kubernetes

```bash
kubectl apply -f k8s/
```

This will create:
- Deployment: `careercoach-frontend`
- Service: `careercoach-frontend-service` (NodePort on port 30081)

### 5. Access the Application

**Option 1: Using minikube service command**
```bash
minikube service careercoach-frontend-service
```

**Option 2: Direct access**
```bash
minikube ip
# Then open: http://<minikube-ip>:30081
```

Or in one command:
```bash
echo "http://$(minikube ip):30081"
```

## Verify Deployment

### Check deployment status:
```bash
kubectl get deployments
kubectl get services
kubectl get pods
```

### View logs:
```bash
kubectl logs -f deployment/careercoach-frontend
```

### Check pod status:
```bash
kubectl describe pod -l app=careercoach-frontend
```

## Troubleshooting

### Image not found error (ErrImageNeverPull)
Make sure you've built the image in Minikube's Docker daemon:
```bash
eval $(minikube docker-env)
docker build -t careercoach-frontend:latest .
```

### Pod not starting
Check pod logs:
```bash
kubectl logs -l app=careercoach-frontend
```

### Rebuild and redeploy
```bash
# Rebuild image
eval $(minikube docker-env)
docker build -t careercoach-frontend:latest .

# Restart deployment
kubectl rollout restart deployment/careercoach-frontend
```

## Cleanup

To remove the deployment:
```bash
kubectl delete -f k8s/
```

