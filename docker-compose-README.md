# Docker Compose Setup

This allows you to run all microservices as individual Docker containers that you can see in Docker Desktop.

## Prerequisites

1. Make sure Docker Desktop is running
2. Build the images first (if not already built):

```bash
# Build backend image
docker build -t careercoach-backend:latest .

# Build frontend image
cd frontend
docker build -t careercoach-frontend:latest .
cd ..
```

## Running with Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## Service URLs

Once running, each microservice will be accessible at:

- **CV Analysis Service**: http://localhost:8001
- **Career Planning Service**: http://localhost:8002
- **Progress Tracking Service**: http://localhost:8003
- **User Management Service**: http://localhost:8004
- **Frontend**: http://localhost:3000

## Viewing in Docker Desktop

After running `docker-compose up -d`, you'll see all 5 containers in Docker Desktop:

1. `cv-analysis-service` - Port 8001
2. `career-planning-service` - Port 8002
3. `progress-tracking-service` - Port 8003
4. `user-management-service` - Port 8004
5. `careercoach-frontend` - Port 3000

Each container will show:
- Status (Running/Stopped)
- CPU and Memory usage
- Port mappings
- Logs
- Resource usage

## Individual Container Management

```bash
# Start a specific service
docker-compose up -d cv-analysis

# Stop a specific service
docker-compose stop cv-analysis

# View logs for a specific service
docker-compose logs -f cv-analysis

# Restart a service
docker-compose restart cv-analysis
```

## Note

- All services share the same database file (`db.sqlite3`)
- All services are on the same Docker network (`careercoach-network`)
- Each service runs independently and can be started/stopped separately

