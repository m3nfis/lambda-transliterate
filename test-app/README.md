# Transliteration Test App

A mini testing application for the transliteration service that allows you to test random strings via Postman or curl commands.

## Features

- 🚀 Easy to start with Node.js
- 📝 Logs all API calls to `test-run.json`
- 🎓 Learn mode for saving test data for expert review
- 🔍 Health check endpoint
- 📊 View and manage logs via API
- 🌐 CORS enabled for Postman testing

## Quick Start

### 1. Install Dependencies
```bash
cd test-app
npm install
```

### 2. Start the Server
```bash
npm start
```

The app will start on `http://localhost:3001`

## API Endpoints

### Main Transliteration Endpoint
**POST** `/transliterate`

**Request Body:**
```json
{
  "firstName": "太郎",
  "lastName": "田中",
  "country": "JP",
  "learn": false
}
```

**Response:**
```json
{
  "firstName": "Taro",
  "lastName": "Tanaka",
  "country": "JP",
  "script": "Jpan"
}
```

### Other Endpoints
- **GET** `/health` - Health check
- **GET** `/logs` - View test logs
- **GET** `/learn-logs` - View learn mode logs
- **DELETE** `/logs` - Clear test logs
- **DELETE** `/learn-logs` - Clear learn mode logs

## Testing Examples

### cURL Examples

#### Basic Test (No Learning)
```bash
curl -X POST http://localhost:3001/transliterate \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "太郎",
    "lastName": "田中",
    "country": "JP"
  }'
```

#### Learn Mode Test
```bash
curl -X POST http://localhost:3001/transliterate \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "محمد",
    "lastName": "علي",
    "country": "EG",
    "learn": true
  }'
```

#### Chinese Names
```bash
curl -X POST http://localhost:3001/transliterate \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "伟",
    "lastName": "王",
    "country": "CN"
  }'
```

#### Korean Names
```bash
curl -X POST http://localhost:3001/transliterate \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "김",
    "lastName": "철수",
    "country": "KR"
  }'
```

#### Russian Names
```bash
curl -X POST http://localhost:3001/transliterate \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Александр",
    "lastName": "Пушкин",
    "country": "RU"
  }'
```

#### Thai Names
```bash
curl -X POST http://localhost:3001/transliterate \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "สมชาย",
    "lastName": "ใจดี",
    "country": "TH"
  }'
```

### Postman Examples

#### Basic Test
- **Method:** POST
- **URL:** `http://localhost:3001/transliterate`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "firstName": "太郎",
  "lastName": "田中",
  "country": "JP"
}
```

#### Learn Mode Test
- **Method:** POST
- **URL:** `http://localhost:3001/transliterate`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "firstName": "محمد",
  "lastName": "علي",
  "country": "EG",
  "learn": true
}
```

## Supported Countries

| Country Code | Language | Script |
|-------------|----------|---------|
| CN | Chinese (Simplified) | Hans |
| JP | Japanese | Jpan |
| KR | Korean | Hang |
| EG | Arabic (Egypt) | Arab |
| RU | Russian | Cyrl |
| IN | Hindi | Deva |
| GR | Greek | Grek |
| TH | Thai | Thai |

## Logging

### Test Logs (`test-run.json`)
All API calls are logged with:
- Timestamp
- Request data
- Response data

### Learn Logs (`learn-data.json`)
When `learn: true` is set, the data is saved separately for expert review.

### View Logs
```bash
# View test logs
curl http://localhost:3001/logs

# View learn logs
curl http://localhost:3001/learn-logs
```

### Clear Logs
```bash
# Clear test logs
curl -X DELETE http://localhost:3001/logs

# Clear learn logs
curl -X DELETE http://localhost:3001/learn-logs
```

## Learn Mode

When you set `"learn": true` in your request:

1. The API call is logged to `learn-data.json` instead of `test-run.json`
2. This data is meant to be reviewed by experts for accuracy
3. Use this for names that are NOT in the existing `test-data.json`
4. Experts can review and potentially add these to the main name mappings

## Error Handling

The API returns proper HTTP status codes and error messages:

- `400` - Validation errors (missing fields, invalid country code)
- `500` - Internal server errors

Error response format:
```json
{
  "error": true,
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

## Development

### Start with Auto-reload
```bash
npm run dev
```

### Environment Variables
- `PORT` - Server port (default: 3001)

## File Structure

```
test-app/
├── server.js          # Main server file
├── package.json       # Dependencies
├── README.md         # This file
├── test-run.json     # Test logs (auto-generated)
└── learn-data.json   # Learn mode logs (auto-generated)
``` 