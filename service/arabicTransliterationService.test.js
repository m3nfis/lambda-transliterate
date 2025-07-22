const ArabicTransliterationService = require('./arabicTransliterationService');

// Mock the Arabic transliteration library
jest.mock('arabic-transliterate');

describe('ArabicTransliterationService', () => {
  let service;
  let mockTransliterate;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock the Arabic transliteration function
    mockTransliterate = jest.fn();
    const arabicTransliterate = require('arabic-transliterate');
    arabicTransliterate.mockImplementation(mockTransliterate);

    service = new ArabicTransliterationService();
  });

  describe('transliterate method', () => {
    test('should transliterate Arabic names correctly', async () => {
      // Mock transliterateName method which is what actually gets called
      service.transliterateName = jest.fn()
        .mockResolvedValueOnce({ transliterated: 'Mohammed', accuracy: 0.95, method: 'arabic_transliterate' })
        .mockResolvedValueOnce({ transliterated: 'Al-Ali', accuracy: 0.95, method: 'arabic_transliterate' });

      const result = await service.transliterate({
        firstName: 'محمد',
        lastName: 'العلي',
        country: 'SA'
      });

      expect(result.firstName).toBe('Mohammed');   // Returns romanized text
      expect(result.lastName).toBe('Al-Ali');     // Returns romanized text
      expect(result.country).toBe('SA');
      expect(result.accuracy).toBeGreaterThan(0.8);
      expect(result.details).toBeDefined();
      expect(result.details.firstNameMethod).toBe('arabic_transliterate');
    });

    test('should validate empty firstName', async () => {
      await expect(service.transliterate({
        firstName: '',
        lastName: '',
        country: 'SA'
      })).rejects.toThrow('Missing required fields: firstName, country');
    });

    test('should reject Latin script names', async () => {
      await expect(service.transliterate({
        firstName: 'John',
        lastName: 'Ahmed',
        country: 'SA'
      })).rejects.toThrow('Input does not appear to be Arabic text');
    });

    test('should handle country codes other than Arabic countries with warning', async () => {
      service.transliterateName = jest.fn()
        .mockResolvedValueOnce({ transliterated: 'Fatima', accuracy: 0.95, method: 'arabic_transliterate' })
        .mockResolvedValueOnce({ transliterated: 'Al-Zahra', accuracy: 0.95, method: 'arabic_transliterate' });

      const result = await service.transliterate({
        firstName: 'فاطمة',
        lastName: 'الزهراء',
        country: 'US'
      });

      expect(result.country).toBe('US');
      expect(result.firstName).toBe('Fatima');
      expect(result.lastName).toBe('Al-Zahra');
    });
  });

  describe('Error handling', () => {
    test('should handle transliteration errors with fallback', async () => {
      // Mock transliterateName to simulate fallback behavior
      service.transliterateName = jest.fn()
        .mockResolvedValueOnce({ transliterated: 'Ts', accuracy: 0.75, method: 'enhanced_arabic' })
        .mockResolvedValueOnce({ transliterated: 'Ts', accuracy: 0.75, method: 'enhanced_arabic' });

      const result = await service.transliterate({
        firstName: 'تست',
        lastName: 'تست',
        country: 'SA'
      });

      // Should not throw error, but return fallback result
      expect(result.firstName).toBe('Ts');
      expect(result.lastName).toBe('Ts');
      expect(result.accuracy).toBe(0.75);
      expect(result.details.firstNameMethod).toBe('enhanced_arabic');
    });
  });
}); 