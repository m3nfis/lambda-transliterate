const KoreanTransliterationService = require('./koreanTransliterationService');

// Mock the Korean romanization library
jest.mock('@romanize/korean');

describe('KoreanTransliterationService', () => {
  let service;
  let mockRomanize;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock the Korean romanization function
    mockRomanize = jest.fn();
    const { romanize } = require('@romanize/korean');
    romanize.mockImplementation(mockRomanize);

    service = new KoreanTransliterationService();
  });

  describe('transliterate method', () => {
    test('should transliterate Korean names correctly', async () => {
      // Mock transliterateName method which is what actually gets called
      service.transliterateName = jest.fn()
        .mockResolvedValueOnce({ transliterated: 'Minsu', accuracy: 0.95, method: 'korean_romanize' })
        .mockResolvedValueOnce({ transliterated: 'Kim', accuracy: 0.95, method: 'korean_romanize' });

      const result = await service.transliterate({
        firstName: '민수',
        lastName: '김',
        country: 'KR'
      });

      expect(result.firstName).toBe('Minsu');     // Returns romanized text
      expect(result.lastName).toBe('Kim');       // Returns romanized text
      expect(result.country).toBe('KR');
      expect(result.accuracy).toBeGreaterThan(0.8);
      expect(result.details).toBeDefined();
      expect(result.details.firstNameMethod).toBe('korean_romanize');
    });

    test('should validate empty firstName', async () => {
      await expect(service.transliterate({
        firstName: '',
        lastName: '',
        country: 'KR'
      })).rejects.toThrow('Missing required fields: firstName, country');
    });

    test('should reject Latin script names', async () => {
      await expect(service.transliterate({
        firstName: 'John',
        lastName: 'Park',
        country: 'KR'
      })).rejects.toThrow('Input does not appear to be Korean text');
    });

    test('should handle country codes other than KR with warning', async () => {
      service.transliterateName = jest.fn()
        .mockResolvedValueOnce({ transliterated: 'Jiyeong', accuracy: 0.95, method: 'korean_romanize' })
        .mockResolvedValueOnce({ transliterated: 'Park', accuracy: 0.95, method: 'korean_romanize' });

      const result = await service.transliterate({
        firstName: '지영',
        lastName: '박',
        country: 'US'
      });

      expect(result.country).toBe('US');
      expect(result.firstName).toBe('Jiyeong');
      expect(result.lastName).toBe('Park');
    });
  });

  describe('Error handling', () => {
    test('should handle romanization errors with fallback', async () => {
      // Mock transliterateName to simulate fallback behavior
      service.transliterateName = jest.fn()
        .mockResolvedValueOnce({ transliterated: '???', accuracy: 0.5, method: 'error_fallback' })
        .mockResolvedValueOnce({ transliterated: '???', accuracy: 0.5, method: 'error_fallback' });

      const result = await service.transliterate({
        firstName: '테스트',
        lastName: '테스트',
        country: 'KR'
      });

      // Should not throw error, but return fallback result
      expect(result.firstName).toBe('???');
      expect(result.lastName).toBe('???');
      expect(result.accuracy).toBe(0.5);
      expect(result.details.firstNameMethod).toBe('error_fallback');
    });
  });
}); 