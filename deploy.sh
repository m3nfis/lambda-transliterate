#!/bin/bash

echo "🚀 Deploying Transliteration Lambda Service..."

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if Serverless Framework is installed
if ! command -v serverless &> /dev/null; then
    echo "❌ Serverless Framework is not installed. Installing..."
    npm install -g serverless
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run tests
echo "🧪 Running tests..."
node test.js

# Deploy to AWS
echo "☁️  Deploying to AWS..."
npm run deploy

echo "✅ Deployment complete!"
echo "📋 Check the output above for your API Gateway endpoint URL."
echo "🔗 You can now use the transliteration service via HTTP POST requests." 