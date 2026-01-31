#!/bin/bash

echo "🔧 QUICK FIX - Network Error Resolution"
echo "======================================"

# Check current container status
echo "📊 Current container status:"
docker compose -f docker-compose.prod.yml ps

# Check if backend is running
echo ""
echo "🧪 Testing backend connection..."
curl -s http://localhost:8000/health && echo "✅ Backend is responding" || echo "❌ Backend not responding"

# Check if port 8000 is open
echo ""
echo "🔍 Checking port 8000..."
netstat -tlnp | grep :8000 || echo "❌ Port 8000 not listening"

# Restart backend if needed
echo ""
echo "🔄 Restarting backend service..."
docker compose -f docker-compose.prod.yml restart backend

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 15

# Test again
echo ""
echo "🧪 Testing backend after restart..."
curl -s http://localhost:8000/health && echo "✅ Backend is now responding" || echo "❌ Backend still not responding"

# Check logs if still failing
echo ""
echo "📋 Backend logs (last 20 lines):"
docker compose -f docker-compose.prod.yml logs --tail=20 backend

echo ""
echo "🌐 Try accessing portal now:"
echo "   - Portal: http://50.19.189.29:3000"
echo "   - API Health: http://50.19.189.29:8000/health"