const TransliterationService = require('./service/transliterationService');

// Initialize the service outside the handler for better performance
const transliterationService = new TransliterationService();

exports.transliterate = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({})
    };
  }

  try {
    // Parse the request body
    const body = JSON.parse(event.body);
    
    // Validate required fields
    if (!body.firstName || !body.lastName || !body.country) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: true,
          message: 'Missing required fields: firstName, lastName, country',
          code: 'VALIDATION_ERROR'
        })
      };
    }

    // Validate country code format
    if (!/^[A-Z]{2}$/.test(body.country)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: true,
          message: 'Invalid country code format. Must be 2 uppercase letters.',
          code: 'VALIDATION_ERROR'
        })
      };
    }

    // Perform transliteration
    const result = await transliterationService.transliterate({
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      country: body.country.toUpperCase()
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result)
    };

  } catch (error) {
    console.error('Transliteration error:', error);

    // Handle specific error types
    if (error.error) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify(error)
      };
    }

    // Handle unexpected errors
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: true,
        message: 'Internal server error during transliteration',
        code: 'INTERNAL_ERROR'
      })
    };
  }
}; 