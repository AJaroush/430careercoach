# Frontend Deployment Options

This project supports two deployment modes:

## 1. Monolithic Deployment (Single Service)

All features run in one container/service.

### Quick Start
```bash
cd frontend
./deploy-monolithic.sh
```

### Access
- **Frontend**: http://localhost:3000
- All routes available: `/dashboard`, `/courses`, `/skills-assessment`, etc.

### Files
- `docker-compose-monolithic.yml` - Docker Compose configuration
- `deploy-monolithic.sh` - Deployment script
- `Dockerfile` - Builds the monolithic frontend

### Stop
```bash
docker-compose -p careercoach-monolithic -f docker-compose-monolithic.yml down
```

---

## 2. Microservices Deployment (Separate Services)

Each feature runs as its own independent microservice.

### Quick Start
```bash
cd frontend
./deploy-separate-microservices.sh
```

### Access
Each microservice has its own port:

| Feature | Port | URL |
|---------|------|-----|
| Dashboard | 4001 | http://localhost:4001 |
| Courses | 4002 | http://localhost:4002 |
| Skills Assessment | 4003 | http://localhost:4003 |
| Career Path | 4004 | http://localhost:4004 |
| Market Insights | 4005 | http://localhost:4005 |
| Interview Prep | 4006 | http://localhost:4006 |
| Career Goals | 4007 | http://localhost:4007 |
| Leaderboard | 4008 | http://localhost:4008 |
| Profile | 4009 | http://localhost:4009 |

### Files
- `docker-compose-microservices-separate.yml` - Docker Compose configuration
- `deploy-separate-microservices.sh` - Deployment script
- `microservices/` - Individual microservice folders
  - Each has its own `Dockerfile` and source code

### Stop
```bash
docker-compose -p careercoach -f docker-compose-microservices-separate.yml down
```

---

## Comparison

| Feature | Monolithic | Microservices |
|---------|-----------|---------------|
| **Deployment** | Single container | 9 separate containers |
| **Ports** | 1 port (3000) | 9 ports (4001-4009) |
| **Scaling** | Scale entire app | Scale individual features |
| **Updates** | Update entire app | Update individual features |
| **Resource Usage** | Lower | Higher (9 containers) |
| **Complexity** | Simpler | More complex |
| **Use Case** | Development, small projects | Production, large scale |

---

## Switching Between Modes

### Stop Current Mode
```bash
# Stop monolithic
docker-compose -p careercoach-monolithic -f docker-compose-monolithic.yml down

# Stop microservices
docker-compose -p careercoach -f docker-compose-microservices-separate.yml down
```

### Start Different Mode
```bash
# Start monolithic
./deploy-monolithic.sh

# Start microservices
./deploy-separate-microservices.sh
```

---

## Development

### Monolithic Development
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

### Microservices Development
Each microservice can be developed independently:
```bash
cd frontend/microservices/dashboard
npm install
npm run dev
```

---

## Troubleshooting

See `TROUBLESHOOTING.md` for common issues and solutions.


