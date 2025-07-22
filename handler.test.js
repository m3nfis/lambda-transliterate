// Create a shared mock instance that all tests can control
const mockTransliterate = jest.fn();

// Mock the service before importing the handler
jest.mock('./service/transliterationService', () => {
  return jest.fn().mockImplementation(() => ({
    transliterate: mockTransliterate
  }));
});

const { transliterate } = require('./handler');

describe('Lambda Handler', () => {
  describe('CORS handling', () => {
    test('should handle OPTIONS requests', async () => {
      const event = {
        httpMethod: 'OPTIONS'
      };
      
      const result = await transliterate(event, {});
      
      expect(result.statusCode).toBe(200);
      expect(result.headers).toEqual({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
      });
    });
  });

  describe('Request validation', () => {
    test('should return 400 when firstName is missing', async () => {
      const event = {
        httpMethod: 'POST',
        body: JSON.stringify({
          lastName: 'Doe',
          country: 'US'
        })
      };
      
      const result = await transliterate(event, {});
      
      expect(result.statusCode).toBe(400);
      const body = JSON.parse(result.body);
      expect(body.error).toBe(true);
      expect(body.message).toContain('Missing required fields');
      expect(body.code).toBe('VALIDATION_ERROR');
    });

    test('should return 400 when lastName is missing', async () => {
      const event = {
        httpMethod: 'POST',
        body: JSON.stringify({
          firstName: 'John',
          country: 'US'
        })
      };
      
      const result = await transliterate(event, {});
      
      expect(result.statusCode).toBe(400);
      const body = JSON.parse(result.body);
      expect(body.error).toBe(true);
      expect(body.message).toContain('Missing required fields');
    });

    test('should return 400 when country is missing', async () => {
      const event = {
        httpMethod: 'POST',
        body: JSON.stringify({
          firstName: 'John',
          lastName: 'Doe'
        })
      };
      
      const result = await transliterate(event, {});
      
      expect(result.statusCode).toBe(400);
      const body = JSON.parse(result.body);
      expect(body.error).toBe(true);
      expect(body.message).toContain('Missing required fields');
    });

    test('should return 400 for invalid country code format', async () => {
      const event = {
        httpMethod: 'POST',
        body: JSON.stringify({
          firstName: 'John',
          lastName: 'Doe',
          country: 'USA' // Should be 2 letters
        })
      };
      
      const result = await transliterate(event, {});
      
      expect(result.statusCode).toBe(400);
      const body = JSON.parse(result.body);
      expect(body.error).toBe(true);
      expect(body.message).toContain('Invalid country code format');
      expect(body.code).toBe('VALIDATION_ERROR');
    });

    test('should return 400 for lowercase country code', async () => {
      const event = {
        httpMethod: 'POST',
        body: JSON.stringify({
          firstName: 'John',
          lastName: 'Doe',
          country: 'us'
        })
      };
      
      const result = await transliterate(event, {});
      
      expect(result.statusCode).toBe(400);
      const body = JSON.parse(result.body);
      expect(body.error).toBe(true);
      expect(body.message).toContain('Invalid country code format');
    });
  });

  describe('Successful transliteration', () => {
    test('should successfully transliterate valid input', async () => {
      // Clear and set up the shared mock
      mockTransliterate.mockClear();
      mockTransliterate.mockResolvedValue({
        firstName: 'John',     // Romanized text
        lastName: 'Doe',       // Romanized text
        country: 'US',
        accuracy: 0.6,
        method: 'general_transliteration'
      });

      const event = {
        httpMethod: 'POST',
        body: JSON.stringify({
          firstName: 'John',
          lastName: 'Doe',
          country: 'US'
        })
      };
      
      const result = await transliterate(event, {});
      
      expect(result.statusCode).toBe(200);
      const body = JSON.parse(result.body);
      expect(body.firstName).toBe('John');
      expect(body.lastName).toBe('Doe');
      expect(body.country).toBe('US');
      expect(body.accuracy).toBe(0.6);
      expect(body.method).toBe('general_transliteration');
    });

    test('should trim whitespace from input', async () => {
      mockTransliterate.mockClear();
      mockTransliterate.mockResolvedValue({
        firstName: 'John',
        lastName: 'Doe',
        country: 'US',
        accuracy: 0.6,
        method: 'general_transliteration'
      });

      const event = {
        httpMethod: 'POST',
        body: JSON.stringify({
          firstName: '  John  ',
          lastName: '  Doe  ',
          country: 'US'
        })
      };
      
      await transliterate(event, {});
      
      expect(mockTransliterate).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        country: 'US'
      });
    });

    test('should reject invalid country code format', async () => {
      mockTransliterate.mockClear();

      const event = {
        httpMethod: 'POST',
        body: JSON.stringify({
          firstName: 'John',
          lastName: 'Doe',
          country: 'jp'  // lowercase should be rejected
        })
      };
      
      const result = await transliterate(event, {});
      
      expect(result.statusCode).toBe(400);
      const body = JSON.parse(result.body);
      expect(body.error).toBe(true);
      expect(body.message).toContain('Invalid country code format');
      expect(body.code).toBe('VALIDATION_ERROR');
      
      // Service should not be called for validation errors
      expect(mockTransliterate).not.toHaveBeenCalled();
    });
  });

  describe('Error handling', () => {
    test('should handle service errors with error property', async () => {
      mockTransliterate.mockClear();
      mockTransliterate.mockRejectedValue({
        error: true,
        message: 'Unsupported language',
        code: 'UNSUPPORTED_LANGUAGE'
      });

      const event = {
        httpMethod: 'POST',
        body: JSON.stringify({
          firstName: 'John',
          lastName: 'Doe',
          country: 'XX'
        })
      };
      
      const result = await transliterate(event, {});
      
      expect(result.statusCode).toBe(400);
      const body = JSON.parse(result.body);
      expect(body.error).toBe(true);
      expect(body.message).toBe('Unsupported language');
      expect(body.code).toBe('UNSUPPORTED_LANGUAGE');
    });

    test('should handle unexpected errors', async () => {
      mockTransliterate.mockClear();
      mockTransliterate.mockRejectedValue(new Error('Unexpected error'));

      const event = {
        httpMethod: 'POST',
        body: JSON.stringify({
          firstName: 'John',
          lastName: 'Doe',
          country: 'US'
        })
      };
      
      const result = await transliterate(event, {});
      
      expect(result.statusCode).toBe(500);
      const body = JSON.parse(result.body);
      expect(body.error).toBe(true);
      expect(body.message).toBe('Internal server error during transliteration');
      expect(body.code).toBe('INTERNAL_ERROR');
    });

    test('should handle malformed JSON', async () => {
      const event = {
        httpMethod: 'POST',
        body: 'invalid json'
      };
      
      const result = await transliterate(event, {});
      
      expect(result.statusCode).toBe(500);
      expect(result.body).toBeDefined();
      expect(result.body).toContain('INTERNAL_ERROR');
    });
  });

  describe('Response headers', () => {
    test('should include CORS headers in all responses', async () => {
      const event = {
        httpMethod: 'POST',
        body: JSON.stringify({
          firstName: 'John',
          lastName: 'Doe',
          country: 'US'
        })
      };
      
      const result = await transliterate(event, {});
      
      expect(result.headers).toEqual({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
      });
    });
  });
}); 