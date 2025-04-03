#!/bin/bash

# Deployment script for Vercel

echo "Setting up environment variables for production..."

# Add required environment variables if they don't exist
if ! grep -q "NEXT_PUBLIC_APP_URL" .env; then
  echo "Adding NEXT_PUBLIC_APP_URL to .env"
  echo "NEXT_PUBLIC_APP_URL=https://ecommerce-jewelry.vercel.app" >> .env
fi

# Build the application
echo "Building the application..."
npm run build

# Deploy using Vercel CLI if available
if command -v vercel &> /dev/null; then
  echo "Deploying with Vercel CLI..."
  vercel --prod
else
  echo "Vercel CLI not found. Please deploy manually:"
  echo "1. Push these changes to your repository"
  echo "2. Ensure you have set NEXT_PUBLIC_APP_URL=https://ecommerce-jewelry.vercel.app in your Vercel project settings"
  echo "3. Trigger a new deployment in Vercel dashboard"
fi

echo "Deployment process completed!" 