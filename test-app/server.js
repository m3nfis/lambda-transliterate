const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Import the transliteration service
const TransliterationService = require('../service/transliterationService');
const transliterationService = new TransliterationService();

// Test data storage
const TEST_LOG_FILE = 'test-run.json';
const LEARN_LOG_FILE = 'learn-data.json';

// Initialize log files if they don't exist
function initializeLogFiles() {
  if (!fs.existsSync(TEST_LOG_FILE)) {
    fs.writeFileSync(TEST_LOG_FILE, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(LEARN_LOG_FILE)) {
    fs.writeFileSync(LEARN_LOG_FILE, JSON.stringify([], null, 2));
  }
}

// Log API call
function logApiCall(data, isLearnMode = false) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    request: data,
    response: null
  };

  const logFile = isLearnMode ? LEARN_LOG_FILE : TEST_LOG_FILE;
  
  try {
    const logs = JSON.parse(fs.readFileSync(logFile, 'utf8'));
    logs.push(logEntry);
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
  } catch (error) {
    console.error('Error logging API call:', error);
  }
}

// Update log entry with response
function updateLogEntry(data, response, isLearnMode = false) {
  const logFile = isLearnMode ? LEARN_LOG_FILE : TEST_LOG_FILE;
  
  try {
    const logs = JSON.parse(fs.readFileSync(logFile, 'utf8'));
    const lastEntry = logs[logs.length - 1];
    
    if (lastEntry && 
        lastEntry.request.firstName === data.firstName && 
        lastEntry.request.lastName === data.lastName && 
        lastEntry.request.country === data.country) {
      lastEntry.response = response;
      fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
    }
  } catch (error) {
    console.error('Error updating log entry:', error);
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Transliteration Test App',
    version: '1.0.0'
  });
});

// Main transliteration endpoint
app.post('/transliterate', async (req, res) => {
  const { firstName, lastName, country, learn = false } = req.body;
  
  // Log the request
  logApiCall({ firstName, lastName, country, learn }, learn);
  
  // Validate required fields
  if (!firstName || !lastName || !country) {
    const errorResponse = {
      error: true,
      message: 'Missing required fields: firstName, lastName, country',
      code: 'VALIDATION_ERROR'
    };
    
    updateLogEntry({ firstName, lastName, country, learn }, errorResponse, learn);
    return res.status(400).json(errorResponse);
  }

  // Validate country code format
  if (!/^[A-Z]{2}$/.test(country)) {
    const errorResponse = {
      error: true,
      message: 'Invalid country code format. Must be 2 uppercase letters.',
      code: 'VALIDATION_ERROR'
    };
    
    updateLogEntry({ firstName, lastName, country, learn }, errorResponse, learn);
    return res.status(400).json(errorResponse);
  }

  try {
    // Perform transliteration
    const result = await transliterationService.transliterate({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      country: country.toUpperCase()
    });

    // Log the response
    updateLogEntry({ firstName, lastName, country, learn }, result, learn);
    
    res.json(result);

  } catch (error) {
    console.error('Transliteration error:', error);

    const errorResponse = error.error ? error : {
      error: true,
      message: 'Internal server error during transliteration',
      code: 'INTERNAL_ERROR'
    };

    updateLogEntry({ firstName, lastName, country, learn }, errorResponse, learn);
    res.status(error.error ? 400 : 500).json(errorResponse);
  }
});

// Get test logs
app.get('/logs', (req, res) => {
  try {
    const logs = JSON.parse(fs.readFileSync(TEST_LOG_FILE, 'utf8'));
    res.json({
      count: logs.length,
      logs: logs
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to read logs' });
  }
});

// Get learn logs
app.get('/learn-logs', (req, res) => {
  try {
    const logs = JSON.parse(fs.readFileSync(LEARN_LOG_FILE, 'utf8'));
    res.json({
      count: logs.length,
      logs: logs
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to read learn logs' });
  }
});

// Clear logs
app.delete('/logs', (req, res) => {
  try {
    fs.writeFileSync(TEST_LOG_FILE, JSON.stringify([], null, 2));
    res.json({ message: 'Test logs cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear logs' });
  }
});

// Clear learn logs
app.delete('/learn-logs', (req, res) => {
  try {
    fs.writeFileSync(LEARN_LOG_FILE, JSON.stringify([], null, 2));
    res.json({ message: 'Learn logs cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear learn logs' });
  }
});

// Start server
app.listen(PORT, () => {
  initializeLogFiles();
  console.log(`🚀 Test app running on http://localhost:${PORT}`);
  console.log(`📝 API calls will be logged to ${TEST_LOG_FILE}`);
  console.log(`🎓 Learn mode data will be logged to ${LEARN_LOG_FILE}`);
  console.log(`\n📋 Available endpoints:`);
  console.log(`   POST /transliterate - Main transliteration endpoint`);
  console.log(`   GET  /health - Health check`);
  console.log(`   GET  /logs - View test logs`);
  console.log(`   GET  /learn-logs - View learn logs`);
  console.log(`   DELETE /logs - Clear test logs`);
  console.log(`   DELETE /learn-logs - Clear learn logs`);
}); 