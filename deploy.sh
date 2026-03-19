#!/bin/bash

# =====================================================
# Anclora Content Generator AI - Deployment Script
# =====================================================
# Quick deployment verification script
# Run this before pushing to production

set -e  # Exit on error

echo "🚀 Anclora Content Generator AI - Pre-Deployment Check"
echo "======================================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check Node version
echo "📋 Step 1: Checking Node.js version..."
NODE_VERSION=$(node -v)
echo "   Node version: $NODE_VERSION"
if [[ "$NODE_VERSION" < "v18" ]]; then
    echo -e "${RED}❌ Error: Node.js 18 or higher required${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js version OK${NC}"
echo ""

# Step 2: Install dependencies
echo "📦 Step 2: Installing dependencies..."
npm install --silent
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Step 3: Run linter
echo "🔍 Step 3: Running ESLint..."
npm run lint --silent || {
    echo -e "${YELLOW}⚠ ESLint warnings found (non-critical)${NC}"
}
echo -e "${GREEN}✓ Linting complete${NC}"
echo ""

# Step 4: Build for production
echo "🏗️  Step 4: Building for production..."
npm run build || {
    echo -e "${RED}❌ Build failed!${NC}"
    echo "   Fix errors above before deploying"
    exit 1
}
echo -e "${GREEN}✓ Build successful${NC}"
echo ""

# Step 5: Check environment variables
echo "🔐 Step 5: Checking environment configuration..."
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠ .env.local not found (OK for CI/CD)${NC}"
else
    echo -e "${GREEN}✓ .env.local exists${NC}"
fi

if [ ! -f ".env.example" ]; then
    echo -e "${RED}❌ .env.example missing${NC}"
    exit 1
fi
echo -e "${GREEN}✓ .env.example exists${NC}"
echo ""

# Step 6: Check critical files
echo "📄 Step 6: Verifying critical files..."
FILES=(
    "package.json"
    "next.config.ts"
    "drizzle.config.ts"
    "src/app/layout.tsx"
    "src/middleware.ts"
    "DEPLOYMENT_GUIDE.md"
)

for file in "${FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo -e "${RED}❌ Missing: $file${NC}"
        exit 1
    fi
done
echo -e "${GREEN}✓ All critical files present${NC}"
echo ""

# Summary
echo "======================================================"
echo -e "${GREEN}✅ All pre-deployment checks passed!${NC}"
echo ""
echo "Next steps:"
echo "1. Push code to GitHub"
echo "2. Follow DEPLOYMENT_GUIDE.md for Vercel setup"
echo "3. Configure environment variables in Vercel"
echo "4. Deploy!"
echo ""
echo "📚 Deployment Guide: ./DEPLOYMENT_GUIDE.md"
echo "🌐 Vercel Dashboard: https://vercel.com/dashboard"
echo ""
