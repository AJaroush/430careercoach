# NGINX Ingress Controller Setup Guide

This guide explains how to set up and use NGINX Ingress Controller for routing traffic to your Career Coach services.

## Overview

NGINX Ingress Controller provides HTTP/HTTPS routing to services within your Kubernetes cluster. It acts as a reverse proxy and load balancer, routing external traffic to internal services based on hostnames and paths.

## Architecture

```
Internet → Ingress Controller (NodePort 30080/30443) → Ingress Rules → Services → Pods
```

## Prerequisites

- Kubernetes cluster (Minikube, GKE, EKS, AKS, etc.)
- kubectl configured and connected to your cluster
- Admin/Cluster Admin permissions

## Deployment Steps

### 1. Deploy NGINX Ingress Controller

```bash
chmod +x k8s/deploy-ingress-controller.sh
./k8s/deploy-ingress-controller.sh
```

Or manually:
```bash
kubectl apply -f k8s/nginx-ingress-controller.yaml
```

### 2. Verify Deployment

```bash
# Check Ingress Controller pods
kubectl get pods -n ingress-nginx

# Check Ingress Controller service
kubectl get svc -n ingress-nginx

# Check IngressClass
kubectl get ingressclass
```

Expected output:
```
NAME     READY   STATUS    RESTARTS   AGE
ingress-nginx-controller-xxx   1/1     Running   0          2m

NAME                       TYPE       CLUSTER-IP    EXTERNAL-IP   PORT(S)                      AGE
ingress-nginx-controller   NodePort   10.96.x.x     <none>        80:30080/TCP,443:30443/TCP   2m

NAME    CONTROLLER             PARAMETERS   AGE
nginx   k8s.io/ingress-nginx   <none>       2m
```

### 3. Deploy Application Ingress Rules

```bash
kubectl apply -f k8s/ingress.yaml
```

### 4. Configure Local DNS (for Minikube)

Add entries to `/etc/hosts` (Linux/Mac) or `C:\Windows\System32\drivers\etc\hosts` (Windows):

```bash
# Get Minikube IP
MINIKUBE_IP=$(minikube ip)

# Add to /etc/hosts
echo "$MINIKUBE_IP cv-analysis.minikube.local" | sudo tee -a /etc/hosts
echo "$MINIKUBE_IP career-planning.minikube.local" | sudo tee -a /etc/hosts
echo "$MINIKUBE_IP progress-tracking.minikube.local" | sudo tee -a /etc/hosts
echo "$MINIKUBE_IP user-management.minikube.local" | sudo tee -a /etc/hosts
echo "$MINIKUBE_IP careercoach.minikube.local" | sudo tee -a /etc/hosts
echo "$MINIKUBE_IP jenkins.minikube.local" | sudo tee -a /etc/hosts
```

### 5. Access Services

Once configured, access services via:

- **CV Analysis**: `http://cv-analysis.minikube.local`
- **Career Planning**: `http://career-planning.minikube.local`
- **Progress Tracking**: `http://progress-tracking.minikube.local`
- **User Management**: `http://user-management.minikube.local`
- **Frontend**: `http://careercoach.minikube.local`
- **Jenkins**: `http://jenkins.minikube.local`

## Ingress Configuration

### Current Ingress Rules

The `k8s/ingress.yaml` file defines routing rules for all services:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: careercoach-ingress
spec:
  ingressClassName: nginx
  rules:
  - host: cv-analysis.minikube.local
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: cv-analysis-service
            port:
              number: 8000
  # ... more rules
```

### Adding New Services

To add a new service to the ingress:

1. Ensure the service exists:
   ```bash
   kubectl get svc your-service-name
   ```

2. Add a new rule to `k8s/ingress.yaml`:
   ```yaml
   - host: your-service.minikube.local
     http:
       paths:
       - path: /
         pathType: Prefix
         backend:
           service:
             name: your-service-name
             port:
               number: 8080
   ```

3. Apply the changes:
   ```bash
   kubectl apply -f k8s/ingress.yaml
   ```

4. Update `/etc/hosts`:
   ```
   <MINIKUBE_IP> your-service.minikube.local
   ```

## Advanced Configuration

### SSL/TLS Configuration

To enable HTTPS:

1. Create a TLS secret:
   ```bash
   kubectl create secret tls careercoach-tls \
     --cert=path/to/cert.crt \
     --key=path/to/cert.key \
     -n default
   ```

2. Update ingress.yaml to include TLS:
   ```yaml
   spec:
     tls:
     - hosts:
       - careercoach.minikube.local
       secretName: careercoach-tls
   ```

3. Apply changes:
   ```bash
   kubectl apply -f k8s/ingress.yaml
   ```

### Path-based Routing

To route different paths to different services:

```yaml
- host: careercoach.minikube.local
  http:
    paths:
    - path: /api
      pathType: Prefix
      backend:
        service:
          name: backend-service
          port:
            number: 8000
    - path: /
      pathType: Prefix
      backend:
        service:
          name: frontend-service
          port:
            number: 80
```

### Annotations

Common NGINX Ingress annotations:

```yaml
metadata:
  annotations:
    # Rewrite target
    nginx.ingress.kubernetes.io/rewrite-target: /
    
    # SSL redirect
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    
    # Rate limiting
    nginx.ingress.kubernetes.io/limit-rps: "100"
    
    # CORS
    nginx.ingress.kubernetes.io/enable-cors: "true"
    nginx.ingress.kubernetes.io/cors-allow-origin: "*"
    
    # Proxy body size
    nginx.ingress.kubernetes.io/proxy-body-size: "50m"
    
    # Timeouts
    nginx.ingress.kubernetes.io/proxy-read-timeout: "600"
    nginx.ingress.kubernetes.io/proxy-connect-timeout: "600"
```

## Troubleshooting

### Ingress Controller Not Starting

```bash
# Check pod status
kubectl get pods -n ingress-nginx

# View logs
kubectl logs -n ingress-nginx deployment/ingress-nginx-controller

# Describe pod for events
kubectl describe pod -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx
```

### Services Not Accessible

1. Check Ingress status:
   ```bash
   kubectl get ingress
   kubectl describe ingress careercoach-ingress
   ```

2. Verify backend services exist:
   ```bash
   kubectl get svc
   ```

3. Check Ingress Controller logs:
   ```bash
   kubectl logs -n ingress-nginx deployment/ingress-nginx-controller
   ```

4. Test backend services directly:
   ```bash
   kubectl port-forward svc/cv-analysis-service 8000:8000
   curl http://localhost:8000
   ```

### DNS Resolution Issues

1. Verify `/etc/hosts` entries:
   ```bash
   cat /etc/hosts | grep minikube.local
   ```

2. Test DNS resolution:
   ```bash
   ping cv-analysis.minikube.local
   nslookup cv-analysis.minikube.local
   ```

3. Use IP directly (bypass DNS):
   ```bash
   curl -H "Host: cv-analysis.minikube.local" http://$(minikube ip):30080
   ```

### 502 Bad Gateway

This usually means the backend service is not responding:

1. Check if pods are running:
   ```bash
   kubectl get pods
   ```

2. Check service endpoints:
   ```bash
   kubectl get endpoints
   ```

3. Check pod logs:
   ```bash
   kubectl logs <pod-name>
   ```

### 404 Not Found

1. Verify ingress rules match the request:
   ```bash
   kubectl describe ingress careercoach-ingress
   ```

2. Check path configuration in ingress rules
3. Verify backend service is configured correctly

## Monitoring

### View Ingress Controller Metrics

```bash
# Port forward to metrics endpoint
kubectl port-forward -n ingress-nginx svc/ingress-nginx-controller 10254:10254

# Access metrics
curl http://localhost:10254/metrics
```

### View Ingress Statistics

```bash
# Get ingress events
kubectl get events --sort-by=.metadata.creationTimestamp

# Watch ingress changes
kubectl get ingress -w
```

## Production Considerations

1. **Use LoadBalancer or External IP** instead of NodePort
2. **Enable HTTPS** with valid SSL certificates
3. **Configure rate limiting** to prevent abuse
4. **Set up monitoring** (Prometheus, Grafana)
5. **Enable access logs** for debugging
6. **Configure resource limits** for Ingress Controller
7. **Use multiple replicas** for high availability
8. **Set up health checks** and readiness probes

## Cleanup

To remove Ingress Controller:

```bash
kubectl delete -f k8s/nginx-ingress-controller.yaml
kubectl delete -f k8s/ingress.yaml
```

## Alternative: Using Minikube Ingress Addon

For Minikube, you can also use the built-in ingress addon:

```bash
# Enable ingress addon
minikube addons enable ingress

# Verify
kubectl get pods -n ingress-nginx

# Deploy ingress rules
kubectl apply -f k8s/ingress.yaml
```

Note: The addon uses a different configuration. Update `ingressClassName` if needed.

## Additional Resources

- [NGINX Ingress Controller Documentation](https://kubernetes.github.io/ingress-nginx/)
- [Kubernetes Ingress Documentation](https://kubernetes.io/docs/concepts/services-networking/ingress/)
- [NGINX Ingress Annotations](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/)

