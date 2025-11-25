# Quick Start Guide: Jenkins & Ingress Controller

This guide provides a quick way to get Jenkins and NGINX Ingress Controller up and running for the Career Coach platform.

## Prerequisites

- Kubernetes cluster running (Minikube, GKE, EKS, AKS, etc.)
- kubectl configured and connected to your cluster
- Docker installed

## Quick Deployment

### Step 1: Deploy NGINX Ingress Controller

```bash
cd k8s
./deploy-ingress-controller.sh
```

Wait for the Ingress Controller to be ready (about 1-2 minutes).

### Step 2: Deploy Jenkins

```bash
./deploy-jenkins.sh
```

Wait for Jenkins to be ready (about 2-3 minutes).

### Step 3: Access Jenkins

#### Option A: Using Ingress (Recommended)

1. Get your cluster IP:
   ```bash
   # For Minikube
   minikube ip
   
   # For other clusters, get the NodePort IP
   kubectl get nodes -o wide
   ```

2. Add to `/etc/hosts`:
   ```
   <CLUSTER_IP> jenkins.minikube.local
   ```

3. Access Jenkins:
   ```
   http://jenkins.minikube.local
   ```

#### Option B: Using Port Forward

```bash
kubectl port-forward -n jenkins svc/jenkins 8080:8080
```

Then access: `http://localhost:8080`

### Step 4: Get Jenkins Admin Password

```bash
JENKINS_POD=$(kubectl get pods -n jenkins -l app=jenkins -o jsonpath='{.items[0].metadata.name}')
kubectl exec -n jenkins $JENKINS_POD -- cat /var/jenkins_home/secrets/initialAdminPassword
```

Copy the password and use it to log in to Jenkins.

### Step 5: Configure Jenkins Pipeline

1. Log in to Jenkins with the admin password
2. Install suggested plugins
3. Create a new Pipeline job:
   - Click **New Item**
   - Name: `CareerCoach-CI-CD`
   - Type: **Pipeline**
   - Click **OK**
4. Configure the pipeline:
   - **Pipeline Definition**: Pipeline script from SCM
   - **SCM**: Git
   - **Repository URL**: Your repository URL
   - **Script Path**: `Jenkinsfile`
5. Click **Save**
6. Click **Build Now**

## Verify Deployment

### Check Ingress Controller

```bash
kubectl get pods -n ingress-nginx
kubectl get svc -n ingress-nginx
```

### Check Jenkins

```bash
kubectl get pods -n jenkins
kubectl get svc -n jenkins
kubectl get ingress -n jenkins
```

### Check Application Ingress

```bash
kubectl get ingress
```

## Access All Services

After configuring `/etc/hosts` with your cluster IP:

- **Jenkins**: `http://jenkins.minikube.local`
- **Frontend**: `http://careercoach.minikube.local`
- **CV Analysis**: `http://cv-analysis.minikube.local`
- **Career Planning**: `http://career-planning.minikube.local`
- **Progress Tracking**: `http://progress-tracking.minikube.local`
- **User Management**: `http://user-management.minikube.local`

## Troubleshooting

### Jenkins not accessible?

```bash
# Check pod status
kubectl get pods -n jenkins

# View logs
kubectl logs -n jenkins deployment/jenkins

# Use port-forward as alternative
kubectl port-forward -n jenkins svc/jenkins 8080:8080
```

### Ingress Controller not working?

```bash
# Check Ingress Controller
kubectl get pods -n ingress-nginx

# Check ingress rules
kubectl describe ingress careercoach-ingress

# Test directly via NodePort
curl -H "Host: jenkins.minikube.local" http://$(minikube ip):30080
```

### Services not accessible via Ingress?

1. Verify services exist:
   ```bash
   kubectl get svc
   ```

2. Check ingress rules:
   ```bash
   kubectl get ingress -o yaml
   ```

3. Verify DNS/hosts file configuration

## Next Steps

- Read [JENKINS_SETUP.md](./JENKINS_SETUP.md) for detailed Jenkins configuration
- Read [INGRESS_CONTROLLER_SETUP.md](./INGRESS_CONTROLLER_SETUP.md) for Ingress Controller details
- Customize the `Jenkinsfile` for your specific needs
- Set up SSL/TLS certificates for production

## Cleanup

To remove everything:

```bash
# Remove Jenkins
kubectl delete -f jenkins-ingress.yaml
kubectl delete -f jenkins-service.yaml
kubectl delete -f jenkins-deployment.yaml
kubectl delete -f jenkins-pvc.yaml
kubectl delete -f jenkins-rbac.yaml
kubectl delete -f jenkins-namespace.yaml

# Remove Ingress Controller
kubectl delete -f nginx-ingress-controller.yaml

# Remove Application Ingress
kubectl delete -f ingress.yaml
```

