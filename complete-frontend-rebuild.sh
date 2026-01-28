#!/bin/bash
# Complete Frontend Rebuild Script
# This will completely rebuild the frontend from scratch

echo "🚀 Complete Frontend Rebuild - Removing ALL test credentials..."

# Stop and remove frontend container completely
echo "⏹️ Stopping and removing frontend container..."
docker-compose stop frontend
docker rm unified-portal-frontend 2>/dev/null || true

# Remove frontend image
echo "🗑️ Removing frontend image..."
docker rmi unified-portal-frontend 2>/dev/null || true

# Remove any cached layers
echo "🧹 Clearing Docker build cache..."
docker builder prune -f

# Remove node_modules and package-lock to ensure clean build
echo "🧹 Cleaning node_modules..."
sudo rm -rf frontend/node_modules
sudo rm -rf frontend/dist
sudo rm -f frontend/package-lock.json

# Fix permissions
echo "🔧 Fixing permissions..."
sudo chown -R ubuntu:ubuntu frontend/

# Rebuild frontend with no cache
echo "🔨 Rebuilding frontend (completely fresh)..."
docker-compose build frontend --no-cache

# Start frontend container
echo "▶️ Starting frontend container..."
docker-compose up -d frontend

# Wait for container to be ready
echo "⏳ Waiting for frontend to be ready..."
sleep 30

# Check container status
echo "📊 Checking container status..."
docker ps | grep frontend

# Test if frontend is responding
echo "🧪 Testing frontend response..."
if curl -s http://localhost:3003 > /dev/null; then
    echo "✅ Frontend is responding"
else
    echo "❌ Frontend not responding"
fi

# Check if test credentials are completely removed
echo "🔍 Checking for test credentials..."
if curl -s http://localhost:3003 | grep -q "test@example.com\|Test Account"; then
    echo "❌ Test credentials still found!"
    echo "📋 Manual steps needed:"
    echo "1. Clear browser cache completely"
    echo "2. Hard refresh (Ctrl+F5)"
    echo "3. Try incognito mode"
    echo "4. Check if nginx is serving cached content"
else
    echo "✅ Test credentials completely removed!"
fi

# Also restart nginx to clear any cache
echo "🔄 Restarting nginx to clear cache..."
docker-compose restart nginx

echo "🎉 Complete frontend rebuild finished!"
echo ""
echo "📋 Next steps:"
echo "1. Clear browser cache completely"
echo "2. Hard refresh the page (Ctrl+F5)"
echo "3. Test in incognito/private mode"
echo "4. Check http://$(curl -s ifconfig.me)/"