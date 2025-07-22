#!/bin/bash

# Transliteration Test App - Curl Examples
# Make sure the server is running on http://localhost:3001

echo "🚀 Transliteration Test App - Curl Examples"
echo "=========================================="
echo ""

# Health check
echo "1. Health Check:"
echo "curl http://localhost:3001/health"
echo ""

# Basic tests
echo "2. Japanese Name Test:"
echo 'curl -X POST http://localhost:3001/transliterate \
  -H "Content-Type: application/json" \
  -d '"'"'{"firstName": "太郎", "lastName": "田中", "country": "JP"}'"'"''
echo ""

echo "3. Chinese Name Test:"
echo 'curl -X POST http://localhost:3001/transliterate \
  -H "Content-Type: application/json" \
  -d '"'"'{"firstName": "伟", "lastName": "王", "country": "CN"}'"'"''
echo ""

echo "4. Korean Name Test:"
echo 'curl -X POST http://localhost:3001/transliterate \
  -H "Content-Type: application/json" \
  -d '"'"'{"firstName": "김", "lastName": "철수", "country": "KR"}'"'"''
echo ""

echo "5. Arabic Name Test:"
echo 'curl -X POST http://localhost:3001/transliterate \
  -H "Content-Type: application/json" \
  -d '"'"'{"firstName": "محمد", "lastName": "علي", "country": "EG"}'"'"''
echo ""

echo "6. Russian Name Test:"
echo 'curl -X POST http://localhost:3001/transliterate \
  -H "Content-Type: application/json" \
  -d '"'"'{"firstName": "Александр", "lastName": "Пушкин", "country": "RU"}'"'"''
echo ""

echo "7. Thai Name Test:"
echo 'curl -X POST http://localhost:3001/transliterate \
  -H "Content-Type: application/json" \
  -d '"'"'{"firstName": "สมชาย", "lastName": "ใจดี", "country": "TH"}'"'"''
echo ""

# Learn mode examples
echo "8. Learn Mode Test (Arabic):"
echo 'curl -X POST http://localhost:3001/transliterate \
  -H "Content-Type: application/json" \
  -d '"'"'{"firstName": "أحمد", "lastName": "محمد", "country": "EG", "learn": true}'"'"''
echo ""

echo "9. Learn Mode Test (Japanese):"
echo 'curl -X POST http://localhost:3001/transliterate \
  -H "Content-Type: application/json" \
  -d '"'"'{"firstName": "花子", "lastName": "山田", "country": "JP", "learn": true}'"'"''
echo ""

# Log management
echo "10. View Test Logs:"
echo "curl http://localhost:3001/logs"
echo ""

echo "11. View Learn Logs:"
echo "curl http://localhost:3001/learn-logs"
echo ""

echo "12. Clear Test Logs:"
echo "curl -X DELETE http://localhost:3001/logs"
echo ""

echo "13. Clear Learn Logs:"
echo "curl -X DELETE http://localhost:3001/learn-logs"
echo ""

# Error examples
echo "14. Error Test - Missing Fields:"
echo 'curl -X POST http://localhost:3001/transliterate \
  -H "Content-Type: application/json" \
  -d '"'"'{"firstName": "太郎"}'"'"''
echo ""

echo "15. Error Test - Invalid Country Code:"
echo 'curl -X POST http://localhost:3001/transliterate \
  -H "Content-Type: application/json" \
  -d '"'"'{"firstName": "太郎", "lastName": "田中", "country": "JAPAN"}'"'"''
echo ""

echo "=========================================="
echo "💡 Tips:"
echo "- Copy and paste any command above to test"
echo "- Use 'learn: true' for names not in test-data.json"
echo "- Check logs to see all API calls"
echo "- Server must be running on localhost:3001"
echo "" 