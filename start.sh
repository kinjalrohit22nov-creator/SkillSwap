#!/bin/bash

# SkillSwap Project Quick Start

echo "🚀 SkillSwap — Quick Start Guide"
echo "=================================="
echo ""

# Check prerequisites
echo "Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js >= 18"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker"
    exit 1
fi

echo "✅ Prerequisites OK"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install || { echo "❌ npm install failed"; exit 1; }
echo "✅ Dependencies installed"
echo ""

# Copy environment file
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please update .env with your configuration"
fi
echo ""

# Start Docker compose
echo "🐳 Starting Docker services..."
docker-compose up -d || { echo "❌ Docker compose failed"; exit 1; }
echo "✅ Docker services started"
echo ""

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 10

# Run migrations
echo "🗄️  Running database migrations..."
npm run db:migrate || { echo "❌ Migrations failed"; exit 1; }
echo "✅ Migrations complete"
echo ""

# Start development servers
echo "🎯 Starting development servers..."
echo "📍 Web Frontend: http://localhost:3000"
echo "📍 API Gateway: http://localhost:8080"
echo "📍 Services: 3001-3005"
echo ""
echo "Press Ctrl+C to stop"
npm run dev
