# Minikube Deployment Guide

This guide explains how to deploy the Career Coach application with each microservice having its own host in Minikube.

## Architecture

Each microservice runs as a separate Kubernetes deployment with its own service and host:

- **CV Analysis Service**: `cv-analysis.minikube.local` (NodePort: 30081)
- **Career Planning Service**: `career-planning.minikube.local` (NodePort: 30082)
- **Progress Tracking Service**: `progress-tracking.minikube.local` (NodePort: 30083)
- **User Management Service**: `user-management.minikube.local` (NodePort: 30084)
- **Frontend**: `careercoach.minikube.local` (NodePort: 30080)

## Prerequisites

1. **Minikube installed and running**
   ```bash
   minikube start
   ```

2. **Enable Ingress addon** (for host-based routing)
   ```bash
   minikube addons enable ingress
   ```

3. **Configure Docker to use Minikube's Docker daemon**
   ```bash
   eval $(minikube docker-env)
   ```

## Deployment Steps

### 1. Build Docker Images

Build the backend and frontend images:

```bash
# Build backend image
docker build -t careercoach-backend:latest .

# Build frontend image
cd frontend
docker build -t careercoach-frontend:latest .
cd ..
```

### 2. Deploy Microservices

Deploy each microservice:

```bash
# CV Analysis Service
kubectl apply -f k8s/cv-analysis-deployment.yaml
kubectl apply -f k8s/cv-analysis-service.yaml

# Career Planning Service
kubectl apply -f k8s/career-planning-deployment.yaml
kubectl apply -f k8s/career-planning-service.yaml

# Progress Tracking Service
kubectl apply -f k8s/progress-tracking-deployment.yaml
kubectl apply -f k8s/progress-tracking-service.yaml

# User Management Service
kubectl apply -f k8s/user-management-deployment.yaml
kubectl apply -f k8s/user-management-service.yaml

# Frontend
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
```

### 3. Deploy Ingress (Optional - for host-based routing)

If you want to use host-based routing instead of NodePorts:

```bash
kubectl apply -f k8s/ingress.yaml
```

Then add these entries to your `/etc/hosts` file (or `C:\Windows\System32\drivers\etc\hosts` on Windows):

```
$(minikube ip) cv-analysis.minikube.local
$(minikube ip) career-planning.minikube.local
$(minikube ip) progress-tracking.minikube.local
$(minikube ip) user-management.minikube.local
$(minikube ip) careercoach.minikube.local
```

To get Minikube IP:
```bash
minikube ip
```

### 4. Access Services

#### Option A: Using NodePorts (Direct Access)

```bash
# Get Minikube IP
MINIKUBE_IP=$(minikube ip)

# CV Analysis Service
echo "CV Analysis: http://$MINIKUBE_IP:30081"

# Career Planning Service
echo "Career Planning: http://$MINIKUBE_IP:30082"

# Progress Tracking Service
echo "Progress Tracking: http://$MINIKUBE_IP:30083"

# User Management Service
echo "User Management: http://$MINIKUBE_IP:30084"

# Frontend
echo "Frontend: http://$MINIKUBE_IP:30080"
```

#### Option B: Using Ingress (Host-based)

After setting up `/etc/hosts`:
- CV Analysis: http://cv-analysis.minikube.local
- Career Planning: http://career-planning.minikube.local
- Progress Tracking: http://progress-tracking.minikube.local
- User Management: http://user-management.minikube.local
- Frontend: http://careercoach.minikube.local

## Verify Deployment

Check all services are running:

```bash
# Check deployments
kubectl get deployments

# Check services
kubectl get services

# Check pods
kubectl get pods

# Check ingress
kubectl get ingress
```

## Service Endpoints

Each microservice exposes its API endpoints:

### CV Analysis Service
- Base URL: `http://cv-analysis.minikube.local` or `http://$(minikube ip):30081`
- Endpoints:
  - `/api/cv/api/analyze/` - CV analysis
  - `/api/cv/public/analyze/` - Public CV analysis
  - `/api/cv/api/questions/` - Career questions

### Career Planning Service
- Base URL: `http://career-planning.minikube.local` or `http://$(minikube ip):30082`
- Endpoints:
  - `/api/career/` - Career planning dashboard
  - `/api/career/generate/` - Generate career plan
  - `/api/career/api/plan/<id>/` - Get career plan

### Progress Tracking Service
- Base URL: `http://progress-tracking.minikube.local` or `http://$(minikube ip):30083`
- Endpoints:
  - `/api/progress/` - Progress tracking endpoints

### User Management Service
- Base URL: `http://user-management.minikube.local` or `http://$(minikube ip):30084`
- Endpoints:
  - `/api/users/` - User management endpoints

## Troubleshooting

### View Logs
```bash
# CV Analysis
kubectl logs -f deployment/cv-analysis-service

# Career Planning
kubectl logs -f deployment/career-planning-service

# Progress Tracking
kubectl logs -f deployment/progress-tracking-service

# User Management
kubectl logs -f deployment/user-management-service
```

### Restart a Service
```bash
kubectl rollout restart deployment/cv-analysis-service
```

### Delete Everything
```bash
kubectl delete -f k8s/
```

## Notes

- Each microservice uses the same Docker image but runs independently
- All services share the same database (SQLite in the image)
- For production, you'd want separate databases for each microservice
- The frontend needs to be configured to point to the correct service URLs

