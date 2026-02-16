# 🚀 Complete Deployment Guide - Gujarat Portal
## EC2 IP: 13.127.12.126 (Mumbai Region)

---

## 📋 Prerequisites Checklist
- [ ] EC2 Instance running (Ubuntu 22.04)
- [ ] Security Group ports open: 22, 80, 8000
- [ ] SSH key pair (.pem file)
- [ ] Git repository access

---

## STEP 1: Connect to EC2

```bash
ssh -i your-key.pem ubuntu@13.127.12.126
```

---

## STEP 2: Install Docker & Docker Compose

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installations
docker --version
docker-compose --version

# Logout and login again for docker group to take effect
exit
```

```bash
# Reconnect
ssh -i your-key.pem ubuntu@13.127.12.126
```

---

## STEP 3: Clone Repository

```bash
# Clone the repository
git clone https://github.com/Vaidehip0407/gujarat-unified-services-portal.git
cd gujarat-unified-services-portal

# Checkout the latest branch
git checkout grants-and-improvements
git pull origin grants-and-improvements
```

---

## STEP 4: Configure Environment Files

### Backend Environment (.env.prod)

```bash
cat > backend/.env.prod << 'EOF'
# Production Environment
DATABASE_URL=sqlite:///./unified_portal.db
SECRET_KEY=india-portal-production-secret-key-2026-secure
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Production Settings
PYTHONPATH=/app
ENVIRONMENT=production
DEBUG=false

# CORS Configuration
FRONTEND_URL=http://13.127.12.126
BACKEND_CORS_ORIGINS=["http://13.127.12.126"]
EOF
```

### Frontend Environment (.env.production)

```bash
cat > frontend/.env.production << 'EOF'
VITE_API_BASE_URL_HTTP=http://13.127.12.126/api
VITE_API_BASE_URL_HTTPS=https://13.127.12.126/api
VITE_ENVIRONMENT=production
VITE_ENABLE_HTTPS=auto
VITE_SSL_VERIFY=false
EOF
```

### Docker Compose Production Config

```bash
cat > docker-compose.prod.yml << 'EOF'
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: gujarat-portal-backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=sqlite:///./unified_portal.db
      - SECRET_KEY=india-portal-production-secret-key-2026-secure
      - ALGORITHM=HS256
      - ACCESS_TOKEN_EXPIRE_MINUTES=30
      - PYTHONPATH=/app
      - ENVIRONMENT=production
      - DEBUG=false
      - FRONTEND_URL=http://13.127.12.126
      - BACKEND_CORS_ORIGINS=["http://13.127.12.126"]
    volumes:
      - ./backend/unified_portal.db:/app/unified_portal.db
      - ./backend/uploads:/app/uploads
      - ./backend/user_data:/app/user_data
      - ./backend/screenshots:/app/screenshots
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        - VITE_API_URL=http://13.127.12.126:8000
    container_name: gujarat-portal-frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:80"]
      interval: 30s
      timeout: 10s
      retries: 3
EOF
```

---

## STEP 5: Build and Deploy

```bash
# Make sure you're in the project directory
cd ~/gujarat-unified-services-portal

# Build Docker images (this will take 5-10 minutes)
docker-compose -f docker-compose.prod.yml build --no-cache

# Start services in detached mode
docker-compose -f docker-compose.prod.yml up -d

# Check if containers are running
docker-compose -f docker-compose.prod.yml ps
```

Expected output:
```
NAME                          STATUS              PORTS
gujarat-portal-backend        Up                  0.0.0.0:8000->8000/tcp
gujarat-portal-frontend       Up                  0.0.0.0:80->80/tcp
```

---

## STEP 6: Verify Deployment

### Check Container Logs

```bash
# View all logs
docker-compose -f docker-compose.prod.yml logs -f

# View backend logs only
docker-compose -f docker-compose.prod.yml logs -f backend

# View frontend logs only
docker-compose -f docker-compose.prod.yml logs -f frontend

# Press Ctrl+C to exit logs
```

### Test Services Locally on EC2

```bash
# Test backend health
curl http://localhost:8000/health

# Expected: {"status":"healthy","environment":"production"}

# Test backend API docs
curl http://localhost:8000/docs

# Test frontend
curl http://localhost:80
```

### Test from Your Local Machine

```bash
# Test backend
curl http://13.127.12.126:8000/health

# Test frontend
curl http://13.127.12.126
```

---

## STEP 7: Access Application

Open in your browser:

- **Frontend**: http://13.127.12.126
- **Backend API**: http://13.127.12.126:8000
- **API Documentation**: http://13.127.12.126:8000/docs
- **Health Check**: http://13.127.12.126:8000/health

---

## 🔧 Management Commands

### View Status
```bash
docker-compose -f docker-compose.prod.yml ps
```

### View Logs
```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
```

### Restart Services
```bash
# Restart all
docker-compose -f docker-compose.prod.yml restart

# Restart specific service
docker-compose -f docker-compose.prod.yml restart backend
docker-compose -f docker-compose.prod.yml restart frontend
```

### Stop Services
```bash
docker-compose -f docker-compose.prod.yml down
```

### Update and Redeploy
```bash
cd ~/gujarat-unified-services-portal

# Pull latest code
git pull origin grants-and-improvements

# Rebuild and restart
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

### Clean Everything and Redeploy
```bash
# Stop and remove containers, networks, volumes
docker-compose -f docker-compose.prod.yml down -v

# Remove all images
docker system prune -a -f

# Rebuild from scratch
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🔒 AWS Security Group Configuration

Go to AWS Console → EC2 → Security Groups → Your Instance Security Group

### Inbound Rules:

| Type | Protocol | Port | Source | Description |
|------|----------|------|--------|-------------|
| SSH | TCP | 22 | Your IP | SSH Access |
| HTTP | TCP | 80 | 0.0.0.0/0 | Frontend |
| Custom TCP | TCP | 8000 | 0.0.0.0/0 | Backend API |

---

## 🐛 Troubleshooting

### Containers Not Starting

```bash
# Check logs for errors
docker-compose -f docker-compose.prod.yml logs

# Check if ports are already in use
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :8000

# Remove and restart
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
```

### Port Already in Use

```bash
# Find process using port 80
sudo lsof -i :80

# Kill the process (replace PID)
sudo kill -9 PID

# Or stop nginx if running
sudo systemctl stop nginx
```

### Database Issues

```bash
# Access backend container
docker exec -it gujarat-portal-backend bash

# Check database
ls -la /app/unified_portal.db

# Run migrations if needed
python -m alembic upgrade head

# Exit container
exit
```

### Frontend Not Loading

```bash
# Check if frontend container is running
docker ps | grep frontend

# Rebuild frontend
docker-compose -f docker-compose.prod.yml build --no-cache frontend
docker-compose -f docker-compose.prod.yml up -d frontend

# Check nginx config inside container
docker exec -it gujarat-portal-frontend cat /etc/nginx/conf.d/default.conf
```

### CORS Errors

Make sure backend .env.prod has correct CORS settings:
```bash
FRONTEND_URL=http://13.127.12.126
BACKEND_CORS_ORIGINS=["http://13.127.12.126"]
```

Then restart backend:
```bash
docker-compose -f docker-compose.prod.yml restart backend
```

---

## 📊 Monitoring

### Check System Resources

```bash
# Disk usage
df -h

# Memory usage
free -h

# Docker stats
docker stats

# Container resource usage
docker-compose -f docker-compose.prod.yml ps -a
```

### Check Container Health

```bash
# Health status
docker inspect gujarat-portal-backend | grep -A 10 Health
docker inspect gujarat-portal-frontend | grep -A 10 Health
```

---

## 🔄 Backup Database

```bash
# Create backup directory
mkdir -p ~/backups

# Backup database
cp ~/gujarat-unified-services-portal/backend/unified_portal.db ~/backups/unified_portal_$(date +%Y%m%d_%H%M%S).db

# List backups
ls -lh ~/backups/
```

---

## 🎯 Quick Reference

### One-Command Deploy
```bash
cd ~/gujarat-unified-services-portal && \
git pull origin grants-and-improvements && \
docker-compose -f docker-compose.prod.yml down && \
docker-compose -f docker-compose.prod.yml build --no-cache && \
docker-compose -f docker-compose.prod.yml up -d && \
docker-compose -f docker-compose.prod.yml ps
```

### One-Command Status Check
```bash
echo "=== Container Status ===" && \
docker-compose -f docker-compose.prod.yml ps && \
echo -e "\n=== Backend Health ===" && \
curl -s http://localhost:8000/health && \
echo -e "\n\n=== Frontend Status ===" && \
curl -s -o /dev/null -w "%{http_code}" http://localhost:80 && \
echo ""
```

---

## ✅ Success Checklist

- [ ] EC2 instance accessible via SSH
- [ ] Docker and Docker Compose installed
- [ ] Repository cloned
- [ ] Environment files configured
- [ ] Docker images built successfully
- [ ] Containers running (docker ps shows both)
- [ ] Backend health check returns 200
- [ ] Frontend accessible in browser
- [ ] Can register/login
- [ ] All features working
- [ ] Security group configured correctly

---

## 📞 Support

If deployment fails:
1. Check container logs: `docker-compose -f docker-compose.prod.yml logs`
2. Verify environment files are correct
3. Ensure ports 80 and 8000 are open in Security Group
4. Check if services are running: `docker-compose -f docker-compose.prod.yml ps`

---

**Repository**: https://github.com/Vaidehip0407/gujarat-unified-services-portal
**Branch**: grants-and-improvements
**EC2 IP**: 13.127.12.126
**Region**: ap-south-1 (Mumbai)

🚀 **Your Gujarat Portal is now live!** 🚀
