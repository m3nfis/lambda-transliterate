# 🌍 Lambda Transliterate Names - Demo App

A beautiful, interactive demo website for testing the Lambda Transliterate Names API service. Built with vanilla HTML, CSS, and JavaScript for maximum compatibility and easy deployment.

## ✨ Features

- **🎯 Interactive Examples** - Click-to-test examples for 6 different scripts
- **📝 Custom Input Form** - Test any names with country selection
- **🔧 Advanced JSON Input** - Direct API testing with raw JSON
- **📱 Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **🎨 Modern UI** - Beautiful gradients, animations, and hover effects
- **⚡ Real-time Results** - Instant feedback with detailed accuracy metrics
- **🧪 Demo Mode** - Works offline with mock responses for development

## 🚀 Quick Start

### Option 1: Deploy to Render.com (Recommended)

1. **Fork the Repository**
   ```bash
   # Fork the main repository to your GitHub account
   https://github.com/yourusername/lambda-transliterate-names
   ```

2. **Connect to Render.com**
   - Visit [render.com](https://render.com)
   - Sign up/login with your GitHub account
   - Click "New +" → "Static Site"
   - Connect your forked repository

3. **Configure Deployment**
   ```yaml
   # Render.com settings:
   Build Command: # Leave empty (static site)
   Publish Directory: demo-app
   Auto-Deploy: Yes
   ```

4. **Deploy**
   - Click "Create Static Site"
   - Your demo will be live at: `https://your-app-name.onrender.com`

### Option 2: Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/lambda-transliterate-names.git
cd lambda-transliterate-names/demo-app

# Serve locally (Python 3)
python -m http.server 8000

# Or with Node.js
npx serve .

# Or with PHP
php -S localhost:8000

# Visit: http://localhost:8000
```

## 🔧 Configuration

### Connect to Your API

1. **Update API Endpoint** (in `script.js`):
   ```javascript
   const CONFIG = {
       API_ENDPOINT: 'https://your-api-gateway-url.com/transliterate',
       DEMO_MODE: false  // Set to false for real API calls
   };
   ```

2. **Or Configure at Runtime** (in browser console):
   ```javascript
   updateAPIEndpoint('https://your-api-gateway-url.com/transliterate')
   ```

### Environment-Specific Configs

**Development:**
```javascript
API_ENDPOINT: 'http://localhost:3000/dev/transliterate'
DEMO_MODE: true
```

**Staging:**
```javascript
API_ENDPOINT: 'https://staging-api.yourapp.com/transliterate'
DEMO_MODE: false
```

**Production:**
```javascript
API_ENDPOINT: 'https://api.yourapp.com/transliterate'
DEMO_MODE: false
```

## 🌐 Deployment Options

### Render.com (Static Site)
```yaml
# render.yaml (optional)
services:
  - type: web
    name: lambda-transliterate-demo
    env: static
    buildCommand: ""
    staticPublishPath: ./demo-app
    domains:
      - your-custom-domain.com
```

### Vercel
```json
{
  "name": "lambda-transliterate-demo",
  "version": 2,
  "public": true,
  "github": {
    "silent": true
  },
  "builds": [
    {
      "src": "demo-app/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/demo-app/$1"
    }
  ]
}
```

### Netlify
```toml
# netlify.toml
[build]
  publish = "demo-app"
  command = ""

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
```

### GitHub Pages
```yaml
# .github/workflows/deploy.yml
name: Deploy Demo
on:
  push:
    branches: [ main ]
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

## 📋 Supported Scripts & Examples

### Pre-loaded Examples
| Script | Country | Example Names | Method |
|--------|---------|---------------|---------|
| Arabic | 🇪🇬 Egypt | محمد علي → Mohammed Ali | IJMES Transliteration |
| Japanese | 🇯🇵 Japan | 太郎 山田 → Tarou Yamada | Kuroshiro Library |
| Korean | 🇰🇷 South Korea | 민수 김 → Minsu Kim | Romanization Standard |
| Chinese | 🇨🇳 China | 小明 王 → Xiaoming Wang | Pinyin System |
| Russian | 🇷🇺 Russia | Владимир Иванов → Vladimir Ivanov | Cyrillic to Latin |
| Thai | 🇹🇭 Thailand | สมชาย จันทร์ → Somchai Chan | Thai to Latin |

### Custom Testing
- ✅ **Free-form Input** - Test any names in any script
- ✅ **Country Selection** - Choose from 9 supported countries
- ✅ **JSON Input** - Direct API testing with custom payloads
- ✅ **Real-time Validation** - Instant feedback on input format

## 🎨 Customization

### Styling
```css
/* Custom colors in style.css */
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --accent-color: #22c55e;
  --text-color: #333;
  --background: #f8f9ff;
}
```

### Add New Script Examples
```javascript
// In script.js, add to DEMO_RESPONSES:
'नमस्ते-शर्मा-IN': {
    firstName: 'Namaste',
    lastName: 'Sharma',
    country: 'IN',
    accuracy: 0.8,
    details: { /* ... */ }
}
```

### Custom Branding
```html
<!-- Update logo and title in index.html -->
<div class="logo">
    <i class="fas fa-your-icon"></i>
    <h1>Your App Name</h1>
</div>
```

## 🔍 API Integration

### Request Format
```json
{
  "firstName": "محمد",
  "lastName": "علي",
  "country": "EG"
}
```

### Response Format
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

### Error Handling
```json
{
  "error": true,
  "message": "Invalid country code format",
  "code": "VALIDATION_ERROR"
}
```

## 🛠️ Development

### File Structure
```
demo-app/
├── index.html          # Main HTML structure
├── style.css           # Modern CSS styling
├── script.js           # Interactive JavaScript
├── README.md           # This documentation
└── package.json        # Optional dependencies
```

### Browser Compatibility
- ✅ **Chrome** 60+
- ✅ **Firefox** 55+
- ✅ **Safari** 12+
- ✅ **Edge** 79+
- ✅ **Mobile browsers** (iOS Safari, Chrome Mobile)

### Performance
- 📦 **Size**: ~50KB total (HTML + CSS + JS)
- ⚡ **Load Time**: <2 seconds on 3G
- 📱 **Mobile Optimized**: Responsive design
- 🚀 **CDN Ready**: All assets are self-contained

## 🔒 Security

### CORS Configuration
```javascript
// Your API needs these headers:
'Access-Control-Allow-Origin': '*'
'Access-Control-Allow-Headers': 'Content-Type'
'Access-Control-Allow-Methods': 'POST, OPTIONS'
```

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               style-src 'self' 'unsafe-inline' fonts.googleapis.com; 
               font-src fonts.gstatic.com; 
               script-src 'self';">
```

## 📊 Analytics Integration

### Google Analytics
```html
<!-- Add to <head> in index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Usage Tracking
```javascript
// Track API calls in script.js
function trackAPICall(country, method, accuracy) {
  gtag('event', 'api_call', {
    'country': country,
    'method': method,
    'accuracy': accuracy
  });
}
```

## 🚨 Troubleshooting

### Common Issues

**CORS Errors:**
- Ensure your API has proper CORS headers
- Check API endpoint URL is correct
- Test with DEMO_MODE first

**Demo Mode Not Working:**
- Check browser console for JavaScript errors
- Verify all files are served over HTTP/HTTPS
- Clear browser cache and refresh

**Styling Issues:**
- Ensure Google Fonts and Font Awesome are loading
- Check for CSS conflicts with existing styles
- Verify viewport meta tag is present

**Mobile Issues:**
- Test responsive design on actual devices
- Check touch interactions work properly
- Verify form inputs are accessible

### Debug Console
```javascript
// Available in browser console:
updateAPIEndpoint('your-api-url')  // Change API endpoint
runExample({...})                  // Test with custom data
makeTransliterationRequest({...})  // Direct API call
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
3. **Test on multiple browsers**
4. **Update documentation**
5. **Submit a pull request**

### Development Guidelines
- Keep the codebase vanilla JS (no frameworks)
- Maintain mobile-first responsive design
- Test with real API endpoints
- Update examples for new scripts
- Follow existing code style

## 📄 License

MIT License - see parent repository for details

## 🆘 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/yourusername/lambda-transliterate-names/issues)
- **Demo URL**: `https://your-demo.onrender.com`
- **API Documentation**: Check main repository README
- **Discord/Slack**: Community support channels

---

**Built with ❤️ for global name transliteration testing and demonstration** 