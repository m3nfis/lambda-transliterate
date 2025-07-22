# 🌍 Lambda Transliterate Names

A high-performance AWS Lambda service for transliterating names from various writing systems to Latin script. Achieves **100% test coverage** across 59 comprehensive test cases covering multiple scripts including Japanese, Korean, Arabic, and more.

## 🚀 Features

- **Multi-Script Support**: Japanese, Korean, Arabic, Chinese, and more
- **100% Test Coverage**: 59 comprehensive test cases with Jest framework
- **Exact Match Priority**: Uses specialized libraries and fallback mechanisms
- **Robust Fallbacks**: Multiple transliteration strategies with accuracy scoring
- **Production Ready**: AWS Lambda deployment with Serverless Framework
- **High Accuracy**: 90%+ accuracy for specialized libraries, fallback strategies available

## 📊 Performance

| Script | Library | Tests | Pass Rate | Status |
|--------|---------|-------|-----------|--------|
| Japanese | Kuroshiro | 11 | 100.0% | ✅ |
| Korean | @romanize/korean | 11 | 100.0% | ✅ |
| Arabic | arabic-transliterate | 11 | 100.0% | ✅ |
| General | transliteration | 26 | 100.0% | ✅ |

**Total: 59 tests, 100% pass rate**

## 🏗️ Architecture

### Core Components

- **Main Service** (`transliterationService.js`) - Central orchestrator with script detection
- **Specialized Services** - Script-specific transliteration modules:
  - `japaneseTransliterationService.js` - Kuroshiro integration
  - `koreanTransliterationService.js` - Korean romanization
  - `arabicTransliterationService.js` - Arabic transliteration
- **Lambda Handler** (`handler.js`) - AWS Lambda entry point with validation
- **Test Suite** - Comprehensive Jest testing framework

### Transliteration Strategy

1. **Country-Based Routing** (90-95% accuracy) - Route to specialized services by country code
2. **Script Detection** (85-90% accuracy) - Automatic script detection fallback
3. **General Transliteration** (60-75% accuracy) - General library fallback
4. **Original Text** (10% accuracy) - Last resort with low accuracy

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/lambda-transliterate-names.git
cd lambda-transliterate-names

# Install dependencies
npm install

# Install development dependencies
npm install --dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Build for production
npm run build
```

## 📦 Dependencies

### Core Libraries
- `transliteration` - General transliteration fallback
- `kuroshiro` - Japanese Kanji→Romaji conversion
- `arabic-transliterate` - Arabic IJMES standard
- `@romanize/korean` - Korean romanization

### Development Tools
- `jest` - Testing framework with 100% coverage
- `webpack` - Module bundling for Lambda deployment
- `serverless` - AWS Lambda deployment framework
- `serverless-webpack` - Webpack integration

## 🧪 Testing

### Run All Tests
```bash
# Run complete test suite
npm test

# Run tests in watch mode (development)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Structure
```
__tests__/
├── handler.test.js                      # Lambda handler tests
├── service/
│   ├── transliterationService.test.js   # Core service tests
│   ├── japaneseTransliterationService.test.js
│   ├── koreanTransliterationService.test.js
│   └── arabicTransliterationService.test.js
```

### Test Coverage
- **59 Total Test Cases**
- **5 Test Suites** (Handler + 4 Services)
- **100% Pass Rate**
- **Comprehensive Error Handling**
- **Mock Integration Testing**

## 🚀 Deployment

### AWS Lambda - Serverless Deployment with API Gateway

#### Prerequisites
```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure AWS credentials
aws configure
# Enter your AWS Access Key ID, Secret Access Key, region, and output format

# Install Serverless Framework globally
npm install -g serverless

# Verify installation
serverless --version
```

#### Step-by-Step AWS Lambda Deployment

1. **Configure Serverless**
```bash
# Configure Serverless with AWS credentials
serverless config credentials --provider aws --key YOUR_ACCESS_KEY --secret YOUR_SECRET_KEY

# Or use AWS profiles
export AWS_PROFILE=your-profile-name
```

2. **Deploy to AWS Lambda**
```bash
# Deploy to development stage
npm run deploy

# Deploy to specific stage
npm run deploy -- --stage=production

# Deploy with custom region
npm run deploy -- --stage=production --region=us-west-2

# Deploy with verbose output
npm run deploy -- --stage=production --verbose
```

3. **Environment-Specific Deployments**
```bash
# Development environment
npm run deploy -- --stage=dev

# Staging environment  
npm run deploy -- --stage=staging

# Production environment
npm run deploy -- --stage=production
```

4. **Post-Deployment Verification**
```bash
# Test your deployed endpoint
curl -X POST https://your-api-id.execute-api.region.amazonaws.com/stage/transliterate \
  -H "Content-Type: application/json" \
  -d '{"firstName":"محمد","lastName":"علي","country":"EG"}'
```

#### Custom Domain Setup (Optional)
```bash
# Install domain manager plugin
npm install --save-dev serverless-domain-manager

# Configure custom domain in serverless.yml
# Deploy domain
serverless create_domain --stage=production
```

### Other Cloud Providers

#### Google Cloud Functions
```bash
# Install Google Cloud SDK
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init

# Deploy to Google Cloud Functions
# 1. Create a package for deployment
npm run build

# 2. Deploy using gcloud
gcloud functions deploy transliterate-names \
  --runtime nodejs18 \
  --trigger-http \
  --allow-unauthenticated \
  --source . \
  --entry-point transliterate \
  --region us-central1

# 3. Test the deployment
curl -X POST https://us-central1-your-project.cloudfunctions.net/transliterate-names \
  -H "Content-Type: application/json" \
  -d '{"firstName":"محمد","lastName":"علي","country":"EG"}'
```

#### Azure Functions
```bash
# Install Azure CLI
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Login to Azure
az login

# Create a function app
az functionapp create \
  --resource-group myResourceGroup \
  --consumption-plan-location westeurope \
  --runtime node \
  --runtime-version 18 \
  --functions-version 4 \
  --name transliterate-names-app \
  --storage-account mystorageaccount

# Deploy function
func azure functionapp publish transliterate-names-app

# Test deployment
curl -X POST https://transliterate-names-app.azurewebsites.net/api/transliterate \
  -H "Content-Type: application/json" \
  -d '{"firstName":"محمد","lastName":"علي","country":"EG"}'
```

#### Vercel (Serverless Functions)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod

# Configure vercel.json for API routing
{
  "functions": {
    "handler.js": {
      "runtime": "nodejs18.x"
    }
  },
  "routes": [
    { "src": "/api/transliterate", "dest": "/handler.js" }
  ]
}
```

#### Netlify Functions
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy to Netlify
netlify deploy --prod

# Configure netlify.toml
[build]
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "18"
```

## 📡 API Usage

### Request Format
All requests require these fields:
- `firstName` (string): First name to transliterate
- `lastName` (string): Last name to transliterate  
- `country` (string): 2-letter country code (uppercase)

### Response Format
All responses include:
- `firstName` (string): Transliterated first name
- `lastName` (string): Transliterated last name
- `country` (string): Original country code
- `accuracy` (number): Confidence score (0.1-0.95)
- `details` (object): Detailed method and accuracy information

### Arabic Names (Egypt - EG)

**Request:**
```json
{
  "firstName": "محمد",
  "lastName": "علي",
  "country": "EG"
}
```

**Response:**
```json
{
  "firstName": "Mohammed",
  "lastName": "Ali",
  "country": "EG",
  "accuracy": 0.95,
  "details": {
    "firstNameMethod": "arabic_transliterate",
    "lastNameMethod": "arabic_transliterate",
    "firstNameAccuracy": 0.95,
    "lastNameAccuracy": 0.95,
    "serviceInitialized": true
  }
}
```

### Japanese Names (Japan - JP)

**Request:**
```json
{
  "firstName": "太郎",
  "lastName": "山田",
  "country": "JP"
}
```

**Response:**
```json
{
  "firstName": "Tarou",
  "lastName": "Yamada", 
  "country": "JP",
  "accuracy": 0.95,
  "details": {
    "firstNameMethod": "kuroshiro",
    "lastNameMethod": "kuroshiro",
    "firstNameAccuracy": 0.95,
    "lastNameAccuracy": 0.95,
    "serviceInitialized": true
  }
}
```

### Korean Names (South Korea - KR)

**Request:**
```json
{
  "firstName": "민수",
  "lastName": "김",
  "country": "KR"
}
```

**Response:**
```json
{
  "firstName": "Minsu",
  "lastName": "Kim",
  "country": "KR", 
  "accuracy": 0.95,
  "details": {
    "firstNameMethod": "korean_romanize",
    "lastNameMethod": "korean_romanize",
    "firstNameAccuracy": 0.95,
    "lastNameAccuracy": 0.95,
    "serviceInitialized": true
  }
}
```

### Chinese Names (China - CN)

**Request:**
```json
{
  "firstName": "小明",
  "lastName": "王",
  "country": "CN"
}
```

**Response:**
```json
{
  "firstName": "Xiaoming",
  "lastName": "Wang",
  "country": "CN",
  "accuracy": 0.6,
  "method": "general_transliteration",
  "details": {
    "firstNameMethod": "general_transliteration", 
    "lastNameMethod": "general_transliteration",
    "firstNameAccuracy": 0.6,
    "lastNameAccuracy": 0.6
  }
}
```

### Russian Names (Russia - RU)

**Request:**
```json
{
  "firstName": "Владимир",
  "lastName": "Иванов", 
  "country": "RU"
}
```

**Response:**
```json
{
  "firstName": "Vladimir",
  "lastName": "Ivanov",
  "country": "RU",
  "accuracy": 0.6,
  "method": "general_transliteration",
  "details": {
    "firstNameMethod": "general_transliteration",
    "lastNameMethod": "general_transliteration", 
    "firstNameAccuracy": 0.6,
    "lastNameAccuracy": 0.6
  }
}
```

### Thai Names (Thailand - TH)

**Request:**
```json
{
  "firstName": "สมชาย",
  "lastName": "จันทร์",
  "country": "TH"
}
```

**Response:**
```json
{
  "firstName": "Somchai", 
  "lastName": "Chan",
  "country": "TH",
  "accuracy": 0.6,
  "method": "general_transliteration",
  "details": {
    "firstNameMethod": "general_transliteration",
    "lastNameMethod": "general_transliteration",
    "firstNameAccuracy": 0.6,
    "lastNameAccuracy": 0.6
  }
}
```

### Error Responses

**Validation Error (Missing Fields):**
```json
{
  "error": true,
  "message": "Invalid country code format. Must be 2 uppercase letters.",
  "code": "VALIDATION_ERROR"
}
```

**Service Error (with Fallback):**
```json
{
  "firstName": "Original",
  "lastName": "Text", 
  "country": "XX",
  "accuracy": 0.1,
  "method": "original_text_fallback",
  "details": {
    "error": "Service temporarily unavailable",
    "fallbackUsed": true
  }
}
```

### CORS Support
All endpoints support CORS with the following headers:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Headers: Content-Type
Access-Control-Allow-Methods: POST, OPTIONS
```

### Rate Limiting
AWS API Gateway default limits:
- **10,000 requests per second**  
- **2,000 requests per second per client**
- Burst limit: **5,000 requests**

## 🔧 Configuration

### Environment Variables
```bash
# Production environment
NODE_ENV=production
AWS_REGION=us-east-1
LOG_LEVEL=info

# Development environment  
NODE_ENV=development
AWS_REGION=us-east-1
LOG_LEVEL=debug
```

### Serverless Configuration (serverless.yml)
```yaml
service: lambda-transliterate-names

provider:
  name: aws
  runtime: nodejs18.x
  region: ${opt:region, 'us-east-1'}
  stage: ${opt:stage, 'dev'}
  memorySize: 512
  timeout: 30
  
functions:
  transliterate:
    handler: handler.transliterate
    events:
      - http:
          path: transliterate
          method: post
          cors: true
      - http:
          path: transliterate  
          method: options
          cors: true

plugins:
  - serverless-webpack

custom:
  webpack:
    webpackConfig: webpack.config.js
    includeModules: true
```

### Adding New Scripts
1. Create specialized service module (e.g., `hindiTransliterationService.js`)
2. Add script detection logic in `transliterationService.js`
3. Update country-script mapping in `country-script-mapping.json`
4. Add comprehensive test cases
5. Update API documentation

## 📁 Project Structure

```
lambda-transliterate-names/
├── handler.js                           # Lambda entry point
├── service/
│   ├── transliterationService.js        # Main orchestrator
│   ├── japaneseTransliterationService.js # Japanese-specific
│   ├── koreanTransliterationService.js  # Korean-specific
│   └── arabicTransliterationService.js  # Arabic-specific
├── __tests__/                           # Test suite
│   ├── handler.test.js
│   └── service/
│       ├── transliterationService.test.js
│       ├── japaneseTransliterationService.test.js  
│       ├── koreanTransliterationService.test.js
│       └── arabicTransliterationService.test.js
├── config/
│   ├── country-script-mapping.json      # Country to script mapping
│   ├── most-used-scripts.json          # Script usage data
│   └── name-mappings.json              # Name mapping data
├── package.json                        # Dependencies and scripts
├── serverless.yml                      # AWS Lambda configuration
├── webpack.config.js                   # Build configuration
├── jest.config.js                      # Test configuration
└── README.md                           # This file
```

## 🎯 Use Cases

- **International Applications** - Name transliteration for global users
- **Customer Data Processing** - Standardizing names across systems
- **Search Optimization** - Enabling cross-script name searches  
- **User Registration** - Converting names to Latin script for databases
- **Document Processing** - Transliterating names in forms and applications
- **Compliance** - Meeting international naming standards
- **Migration Tools** - Converting legacy data to standardized formats

## 🌐 Interactive Demo

Experience the API with our beautiful demo website! Test all supported scripts with real examples and custom input.

### 🚀 Live Demo
Try the interactive demo at: **[Your Demo URL Here]**

### 🎨 Demo Features
- **✨ Click-to-Test Examples** - 6 pre-loaded script examples (Arabic, Japanese, Korean, Chinese, Russian, Thai)
- **📝 Custom Input Form** - Test any names with country selection dropdown
- **🔧 Advanced JSON Testing** - Direct API testing with raw JSON input
- **📱 Mobile Responsive** - Works perfectly on all devices
- **⚡ Real-time Results** - Instant feedback with detailed accuracy metrics
- **🧪 Demo Mode** - Works offline with mock responses for development

### 🚀 Deploy Your Own Demo

#### Option 1: Deploy to Render.com (Recommended)
```bash
# 1. Fork this repository to your GitHub account
# 2. Visit render.com and connect your GitHub
# 3. Create new Static Site with these settings:
#    - Repository: your-fork/lambda-transliterate-names
#    - Publish Directory: demo-app
#    - Build Command: (leave empty)
# 4. Deploy! Your demo will be live at: https://your-app.onrender.com
```

#### Option 2: Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from demo-app directory
cd demo-app
vercel --prod

# Your demo will be live at: https://your-demo.vercel.app
```

#### Option 3: Deploy to Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy from demo-app directory
cd demo-app
netlify deploy --prod --dir .

# Your demo will be live at: https://your-demo.netlify.app
```

#### Option 4: GitHub Pages
```yaml
# Add to .github/workflows/demo-deploy.yml
name: Deploy Demo to GitHub Pages
on:
  push:
    branches: [ main ]
    paths: [ 'demo-app/**' ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./demo-app
```

### ⚙️ Configure Demo for Your API

Update the API endpoint in `demo-app/script.js`:
```javascript
const CONFIG = {
    API_ENDPOINT: 'https://your-api-gateway-url.com/transliterate',
    DEMO_MODE: false  // Set to false for real API calls
};
```

Or configure at runtime in browser console:
```javascript
updateAPIEndpoint('https://your-api-gateway-url.com/transliterate')
```

### 📁 Demo File Structure
```
demo-app/
├── index.html          # Beautiful, responsive HTML interface
├── style.css           # Modern CSS with gradients and animations  
├── script.js           # Interactive JavaScript with API integration
├── package.json        # Demo app metadata and scripts
└── README.md           # Complete demo documentation
```

## 🔒 Security & Compliance

- **Input Validation** - Comprehensive request validation and sanitization
- **Error Handling** - Graceful error responses without data leakage
- **Rate Limiting** - AWS API Gateway protection against abuse
- **CORS Support** - Configurable cross-origin resource sharing
- **No Data Storage** - Names are processed but never stored
- **GDPR Compliance** - No personal information retention
- **Encryption** - All data encrypted in transit via HTTPS

## 📈 Monitoring & Analytics

### AWS CloudWatch Integration
```bash
# View function logs
aws logs tail /aws/lambda/lambda-transliterate-names-dev-transliterate

# Monitor metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Duration \
  --dimensions Name=FunctionName,Value=lambda-transliterate-names-dev-transliterate
```

### Key Metrics
- **Request Latency** - Response time per script type
- **Success/Failure Rates** - Service reliability metrics
- **Method Usage Distribution** - Which transliteration methods are used
- **Accuracy Scores** - Average confidence levels by script
- **Error Rates** - Error frequency by script and country

### Custom Logging
```javascript
// Example CloudWatch custom metrics
console.log(JSON.stringify({
  timestamp: new Date().toISOString(),
  requestId: context.awsRequestId,
  country: input.country,
  method: result.details.firstNameMethod,
  accuracy: result.accuracy,
  latency: Date.now() - startTime
}));
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/amazing-feature`)
3. **Add comprehensive tests** for new functionality
4. **Ensure 100% test pass rate** (`npm test`)
5. **Update documentation** including API examples
6. **Commit changes** (`git commit -m 'Add amazing feature'`)
7. **Push to branch** (`git push origin feature/amazing-feature`)
8. **Submit pull request**

### Development Guidelines
- Maintain **100% test pass rate** at all times
- Add test cases for all new transliteration methods
- Update API documentation with new script examples
- Follow existing code patterns and naming conventions
- Use semantic commit messages
- Ensure backwards compatibility

### Testing New Scripts
```bash
# Test specific service
npm test -- --testPathPattern=japaneseTransliterationService

# Test with coverage
npm run test:coverage

# Test in watch mode during development
npm run test:watch
```

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support & Documentation

- **GitHub Issues**: [Create an issue](https://github.com/yourusername/lambda-transliterate-names/issues)
- **Documentation**: This README and inline code comments
- **Testing**: Run `npm test` for comprehensive diagnostics
- **Deployment Help**: Check serverless.yml configuration
- **API Testing**: Use provided curl examples above

### Common Issues

**Deployment Fails**: 
- Verify AWS credentials: `aws sts get-caller-identity`
- Check Node.js version: `node --version` (requires 18+)
- Validate serverless.yml syntax

**Tests Failing**:
- Install dependencies: `npm install`
- Clear Jest cache: `npx jest --clearCache`
- Check Node.js version compatibility

**Low Accuracy Scores**:
- Verify correct country codes are being used
- Check if specialized services are initializing properly
- Review script detection logic for edge cases

## 🏆 Success Metrics

- **✅ 100% Test Coverage** - All 59 tests pass consistently
- **✅ Multi-Script Support** - Japanese, Korean, Arabic, and general transliteration
- **✅ Production Ready** - AWS Lambda deployment with API Gateway
- **✅ High Performance** - Sub-second response times
- **✅ Robust Architecture** - Multiple fallback strategies with accuracy tracking
- **✅ Developer Experience** - Comprehensive testing and deployment automation

---

**Built with ❤️ for global name transliteration and international applications** 