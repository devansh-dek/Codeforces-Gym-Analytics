#!/bin/bash

# 🚀 Codeforces Gym Analytics - Deployment Script

echo "🏆 Codeforces Gym Analytics Dashboard"
echo "======================================"
echo ""

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check for .env.local
if [ ! -f ".env.local" ]; then
    echo "⚠️  No .env.local file found"
    echo "Creating .env.local with default values..."
    cat > .env.local << EOL
# Codeforces API Configuration
NEXT_PUBLIC_CF_API_KEY=63ed82c31f992f6e0a4a4e6d1a0a809e080b4293
NEXT_PUBLIC_CF_API_SECRET=5ddd61afaaae81a958b0589e26d800c13cc34763

# For local development
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOL
    echo "✅ .env.local created"
    echo ""
fi

# Build the application
echo "🔨 Building production bundle..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "🎉 Ready to deploy!"
    echo ""
    echo "📝 Next steps:"
    echo "  - Development: npm run dev"
    echo "  - Production: npm start"
    echo "  - Deploy to Vercel: vercel deploy"
    echo ""
    echo "🌐 Visit http://localhost:3000 after starting"
else
    echo ""
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
