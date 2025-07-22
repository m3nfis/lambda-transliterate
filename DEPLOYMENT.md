# 🚀 Deployment Guide

This guide covers deploying the Multi-Script Transliteration Service to AWS Lambda using the Serverless Framework.

## 📋 Prerequisites

### Required Tools
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **AWS CLI** - [Installation guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- **Serverless Framework** - Install globally: `npm install -g serverless`

### AWS Setup
1. **Create AWS Account** - [Sign up here](https://aws.amazon.com/)
2. **Configure AWS CLI**:
   ```bash
   aws configure
   # Enter your AWS Access Key ID
   # Enter your AWS Secret Access Key
   # Enter your default region (e.g., us-east-1)
   ```
3. **Create IAM User** (recommended):
   - Create a dedicated IAM user for deployments
   - Attach `AdministratorAccess` policy (or create custom policy)
   - Generate access keys for the user

## 🛠️ Local Development Setup

### 1. Clone and Install
```bash
git clone <repository-url>
cd lambda-transliterate
npm install
```

### 2. Test Locally
```bash
# Run all tests
npm test

# Test specific script
node test-runner.js --script=arabic

# Test individual service
node -e "
const service = require('./transliterationService');
service.transliterate({
  firstName: 'محمد',
  lastName: 'علي',
  country: 'EG'
}).then(console.log);
"
```

### 3. Local Lambda Testing
```bash
# Start local Lambda
npm run dev

# Test with curl
curl -X POST http://localhost:3000/transliterate \
  -H "Content-Type: application/json" \
  -d '{"firstName":"محمد","lastName":"علي","country":"EG"}'
```

## 🌍 Environment Configuration

### Environment Variables
Create a `.env` file for local development:
```bash
NODE_ENV=development
AWS_REGION=us-east-1
LOG_LEVEL=debug
```

### Serverless Configuration
The `serverless.yml` file is pre-configured with:
- **Runtime**: Node.js 18.x
- **Memory**: 512MB
- **Timeout**: 30 seconds
- **Region**: us-east-1
- **CORS**: Enabled
- **API Gateway**: REST API

## 🚀 Deployment Steps

### 1. Development Deployment
```bash
# Deploy to dev stage
npm run deploy:dev

# Or use serverless directly
serverless deploy --stage=dev
```

### 2. Production Deployment
```bash
# Deploy to production stage
npm run deploy:prod

# Or use serverless directly
serverless deploy --stage=production
```

### 3. Deploy to Custom Stage
```bash
serverless deploy --stage=staging
```

## 📊 Deployment Verification

### 1. Check Deployment Status
```bash
# List deployments
serverless info --stage=production

# Check function status
aws lambda get-function --function-name transliteration-service-prod-transliterate
```

### 2. Test Deployed Function
```bash
# Get API Gateway URL
serverless info --stage=production

# Test with curl
curl -X POST https://your-api-gateway-url/transliterate \
  -H "Content-Type: application/json" \
  -d '{"firstName":"محمد","lastName":"علي","country":"EG"}'
```

### 3. Monitor Logs
```bash
# View CloudWatch logs
serverless logs -f transliterate --stage=production

# Follow logs in real-time
serverless logs -f transliterate --stage=production --tail
```

## 🔧 Configuration Options

### Lambda Configuration
Edit `serverless.yml` to customize:

```yaml
provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1
  memorySize: 512  # Adjust memory (128-3008 MB)
  timeout: 30      # Adjust timeout (3-900 seconds)
  environment:
    NODE_ENV: production
    LOG_LEVEL: info
```

### API Gateway Configuration
```yaml
functions:
  transliterate:
    handler: handler.transliterate
    events:
      - http:
          path: transliterate
          method: post
          cors: true
          request:
            schemas:
              application/json:
                type: object
                properties:
                  firstName:
                    type: string
                    minLength: 1
                  lastName:
                    type: string
                  country:
                    type: string
                    pattern: '^[A-Z]{2}$'
                required:
                  - firstName
                  - country
```

## 📈 Monitoring and Logging

### CloudWatch Metrics
Monitor these key metrics:
- **Invocation Count** - Number of function invocations
- **Duration** - Function execution time
- **Error Rate** - Percentage of failed invocations
- **Throttles** - Number of throttled requests

### CloudWatch Logs
Log groups are automatically created:
- `/aws/lambda/transliteration-service-{stage}-transliterate`

### Custom Metrics
The service logs custom metrics:
- Method usage (exact_match, library, fallback)
- Accuracy scores
- Script detection results

## 🔒 Security Considerations

### IAM Permissions
The service requires minimal permissions:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    }
  ]
}
```

### API Gateway Security
- **API Keys**: Optional for rate limiting
- **Usage Plans**: Configure request limits
- **CORS**: Configure allowed origins

### Environment Variables
- No sensitive data stored
- All configuration in `serverless.yml`
- Use AWS Secrets Manager for sensitive data if needed

## 🚨 Troubleshooting

### Common Issues

#### 1. Deployment Fails
```bash
# Check AWS credentials
aws sts get-caller-identity

# Check serverless version
serverless --version

# Clear serverless cache
serverless remove --stage=dev
serverless deploy --stage=dev
```

#### 2. Function Timeout
- Increase timeout in `serverless.yml`
- Check for infinite loops in code
- Monitor memory usage

#### 3. Memory Issues
- Increase memory allocation
- Check for memory leaks
- Optimize code if needed

#### 4. Cold Start Issues
- Use provisioned concurrency
- Optimize package size
- Consider using Lambda Extensions

### Debug Commands
```bash
# Local debugging
npm run dev

# Check function configuration
serverless info --stage=production

# View recent logs
serverless logs -f transliterate --stage=production

# Test function locally
serverless invoke local -f transliterate --data '{"firstName":"test","country":"US"}'
```

## 🔄 CI/CD Integration

### GitHub Actions Example
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
      - run: npm run deploy:prod
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

### Environment Variables for CI/CD
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_DEFAULT_REGION`

## 📋 Post-Deployment Checklist

- [ ] Verify function deployment
- [ ] Test API endpoint
- [ ] Check CloudWatch logs
- [ ] Monitor error rates
- [ ] Set up alerts
- [ ] Update documentation
- [ ] Notify stakeholders

## 🆘 Support

### Getting Help
- **Documentation**: Check README.md and FINAL-SUCCESS-SUMMARY.md
- **Issues**: Create GitHub issue
- **Logs**: Check CloudWatch logs
- **Testing**: Run `npm test` for diagnostics

### Emergency Rollback
```bash
# Rollback to previous version
serverless rollback --stage=production

# Or redeploy previous version
git checkout <previous-commit>
npm run deploy:prod
```

---

**Happy Deploying! 🚀** 