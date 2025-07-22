const TransliterationService = require('./transliterationService');

// Mock the individual language services
jest.mock('./japaneseTransliterationService');
jest.mock('./arabicTransliterationService');
jest.mock('./koreanTransliterationService');

describe('TransliterationService', () => {
  let service;
  let mockJapaneseService;
  let mockArabicService;
  let mockKoreanService;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Mock the language services
    const JapaneseTransliterationService = require('./japaneseTransliterationService');
    const ArabicTransliterationService = require('./arabicTransliterationService');
    const KoreanTransliterationService = require('./koreanTransliterationService');
    
    mockJapaneseService = {
      transliterate: jest.fn()
    };
    mockArabicService = {
      transliterate: jest.fn()
    };
    mockKoreanService = {
      transliterate: jest.fn()
    };
    
    JapaneseTransliterationService.mockImplementation(() => mockJapaneseService);
    ArabicTransliterationService.mockImplementation(() => mockArabicService);
    KoreanTransliterationService.mockImplementation(() => mockKoreanService);
    
    service = new TransliterationService();
  });

  describe('detectScript', () => {
    test('should detect Japanese script with hiragana', () => {
      const script = service.detectScript('ひらがな');
      expect(script).toBe('japanese');
    });

    test('should detect Japanese script with katakana', () => {
      const script = service.detectScript('カタカナ');
      expect(script).toBe('japanese');
    });

    test('should detect Japanese script with kanji', () => {
      const script = service.detectScript('漢字');
      expect(script).toBe('japanese');
    });

    test('should detect Korean script', () => {
      const script = service.detectScript('한국어');
      expect(script).toBe('korean');
    });

    test('should detect Arabic script', () => {
      const script = service.detectScript('العربية');
      expect(script).toBe('arabic');
    });

    test('should detect Russian script', () => {
      const script = service.detectScript('русский');
      expect(script).toBe('russian');
    });

    test('should detect Hindi script', () => {
      const script = service.detectScript('हिन्दी');
      expect(script).toBe('hindi');
    });

    test('should detect Greek script', () => {
      const script = service.detectScript('ελληνικά');
      expect(script).toBe('greek');
    });

    test('should detect Thai script', () => {
      const script = service.detectScript('ไทย');
      expect(script).toBe('thai');
    });

    test('should return latin for English text', () => {
      const script = service.detectScript('English');
      expect(script).toBe('latin');
    });

    test('should return latin for mixed latin characters', () => {
      const script = service.detectScript('José García');
      expect(script).toBe('latin');
    });

    test('should prioritize Japanese for mixed kanji/other', () => {
      // Test Japanese priority over other scripts when kanji is present
      const script = service.detectScript('山田太郎');
      expect(script).toBe('japanese');
    });
  });

  describe('transliterate method - Japanese handling', () => {
    test('should use Japanese service for JP country', async () => {
      mockJapaneseService.transliterate.mockResolvedValue({
        firstName: 'たろう',
        lastName: 'やまだ',
        romanizedFirstName: 'Tarou',
        romanizedLastName: 'Yamada',
        script: 'japanese',
        country: 'JP',
        confidence: 0.95
      });

      const result = await service.transliterate({
        firstName: 'たろう',
        lastName: 'やまだ',
        country: 'JP'
      });

      expect(mockJapaneseService.transliterate).toHaveBeenCalledWith({
        firstName: 'たろう',
        lastName: 'やまだ',
        country: 'JP'
      });
      expect(result.romanizedFirstName).toBe('Tarou');
      expect(result.romanizedLastName).toBe('Yamada');
    });

    test('should use Japanese service for detected Japanese script', async () => {
      mockJapaneseService.transliterate.mockResolvedValue({
        firstName: 'ひろし',
        lastName: 'さとう',
        romanizedFirstName: 'Hiroshi',
        romanizedLastName: 'Satou',
        script: 'japanese',
        country: 'US',
        confidence: 0.90
      });

      const result = await service.transliterate({
        firstName: 'ひろし',
        lastName: 'さとう',
        country: 'US'
      });

      expect(mockJapaneseService.transliterate).toHaveBeenCalledWith({
        firstName: 'ひろし',
        lastName: 'さとう',
        country: 'US'
      });
      expect(result.script).toBe('japanese');
    });
  });

  describe('transliterate method - Korean handling', () => {
    test('should use Korean service for KR country', async () => {
      mockKoreanService.transliterate.mockResolvedValue({
        firstName: '민수',
        lastName: '김',
        romanizedFirstName: 'Minsu',
        romanizedLastName: 'Kim',
        script: 'korean',
        country: 'KR',
        confidence: 0.95
      });

      const result = await service.transliterate({
        firstName: '민수',
        lastName: '김',
        country: 'KR'
      });

      expect(mockKoreanService.transliterate).toHaveBeenCalledWith({
        firstName: '민수',
        lastName: '김',
        country: 'KR'
      });
      expect(result.romanizedFirstName).toBe('Minsu');
      expect(result.romanizedLastName).toBe('Kim');
    });

    test('should use Korean service for detected Korean script', async () => {
      mockKoreanService.transliterate.mockResolvedValue({
        firstName: '지영',
        lastName: '박',
        romanizedFirstName: 'Jiyeong',
        romanizedLastName: 'Park',
        script: 'korean',
        country: 'US',
        confidence: 0.90
      });

      const result = await service.transliterate({
        firstName: '지영',
        lastName: '박',
        country: 'US'
      });

      expect(mockKoreanService.transliterate).toHaveBeenCalledWith({
        firstName: '지영',
        lastName: '박',
        country: 'US'
      });
      expect(result.script).toBe('korean');
    });
  });

  describe('transliterate method - Arabic handling', () => {
    test('should use Arabic service for Arabic-speaking countries', async () => {
      mockArabicService.transliterate.mockResolvedValue({
        firstName: 'محمد',
        lastName: 'العلي',
        romanizedFirstName: 'Mohammed',
        romanizedLastName: 'Al-Ali',
        script: 'arabic',
        country: 'SA',
        confidence: 0.95
      });

      const result = await service.transliterate({
        firstName: 'محمد',
        lastName: 'العلي',
        country: 'SA'
      });

      expect(mockArabicService.transliterate).toHaveBeenCalledWith({
        firstName: 'محمد',
        lastName: 'العلي',
        country: 'SA'
      });
      expect(result.romanizedFirstName).toBe('Mohammed');
      expect(result.romanizedLastName).toBe('Al-Ali');
    });

    test('should use Arabic service for detected Arabic script', async () => {
      mockArabicService.transliterate.mockResolvedValue({
        firstName: 'فاطمة',
        lastName: 'الزهراء',
        romanizedFirstName: 'Fatima',
        romanizedLastName: 'Al-Zahra',
        script: 'arabic',
        country: 'US',
        confidence: 0.90
      });

      const result = await service.transliterate({
        firstName: 'فاطمة',
        lastName: 'الزهراء',
        country: 'US'
      });

      expect(mockArabicService.transliterate).toHaveBeenCalledWith({
        firstName: 'فاطمة',
        lastName: 'الزهراء',
        country: 'US'
      });
      expect(result.script).toBe('arabic');
    });
  });

  describe('transliterate method - Latin script handling', () => {
    test('should handle Latin script names with general transliteration', async () => {
      const result = await service.transliterate({
        firstName: 'John',
        lastName: 'Smith',
        country: 'US'
      });

      expect(result.firstName).toBe('John');
      expect(result.lastName).toBe('Smith');
      expect(result.country).toBe('US');
      expect(result.accuracy).toBe(0.6);
      expect(result.method).toBe('general_transliteration');
    });

    test('should handle accented Latin characters', async () => {
      const result = await service.transliterate({
        firstName: 'José',
        lastName: 'García',
        country: 'ES'
      });

      expect(result.firstName).toBe('Jose');      // Transliterated (accents removed)
      expect(result.lastName).toBe('Garcia');     // Transliterated (accents removed)
      expect(result.country).toBe('ES');
      expect(result.method).toBe('general_transliteration');
    });
  });

  describe('Error handling', () => {
    test('should handle Japanese service errors with fallback', async () => {
      mockJapaneseService.transliterate.mockRejectedValue(new Error('Japanese service error'));

      const result = await service.transliterate({
        firstName: 'たろう',
        lastName: 'やまだ',
        country: 'JP'
      });

      // Should fall back to general transliteration
      expect(result.firstName).toBe('Tarou');
      expect(result.lastName).toBe('Yamada');
      expect(result.country).toBe('JP');
      expect(result.method).toBe('general_transliteration');
      expect(result.accuracy).toBe(0.6);
    });

    test('should handle Korean service errors with fallback', async () => {
      mockKoreanService.transliterate.mockRejectedValue(new Error('Korean service error'));

      const result = await service.transliterate({
        firstName: '민수',
        lastName: '김',
        country: 'KR'
      });

      // Should fall back to general transliteration
      expect(result.firstName).toBe('Minsu');
      expect(result.lastName).toBe('Gim');
      expect(result.country).toBe('KR');
      expect(result.method).toBe('general_transliteration');
      expect(result.accuracy).toBe(0.6);
    });

    test('should handle Arabic service errors with fallback', async () => {
      mockArabicService.transliterate.mockRejectedValue(new Error('Arabic service error'));

      const result = await service.transliterate({
        firstName: 'محمد',
        lastName: 'العلي',
        country: 'SA'
      });

      // Should fall back to general transliteration
      expect(result.firstName).toBe('MHmd');
      expect(result.lastName).toBe('Laaly');
      expect(result.country).toBe('SA');
      expect(result.method).toBe('general_transliteration');
      expect(result.accuracy).toBe(0.6);
    });
  });

  describe('Edge cases', () => {
    test('should validate empty firstName', async () => {
      await expect(service.transliterate({
        firstName: '',
        lastName: '',
        country: 'US'
      })).rejects.toThrow('Missing required fields: firstName, country');
    });

    test('should handle mixed scripts in name', async () => {
      // Mock Japanese service for mixed script detection
      mockJapaneseService.transliterate.mockResolvedValue({
        firstName: 'John-Tanaka',
        lastName: 'Smith-Yamada',
        country: 'US',
        accuracy: 0.85,
        details: { firstNameMethod: 'kuroshiro', lastNameMethod: 'kuroshiro' }
      });

      const result = await service.transliterate({
        firstName: 'John田中',
        lastName: 'Smith山田',
        country: 'US'
      });

      // Should detect as Japanese due to kanji presence and use Japanese service
      expect(mockJapaneseService.transliterate).toHaveBeenCalled();
      expect(result.firstName).toBe('John-Tanaka');
    });

    test('should handle unsupported country codes gracefully', async () => {
      const result = await service.transliterate({
        firstName: 'John',
        lastName: 'Doe',
        country: 'XX'
      });

      // Should fall back to general transliteration
      expect(result.firstName).toBe('John');
      expect(result.lastName).toBe('Doe');
      expect(result.country).toBe('XX');
      expect(result.method).toBe('general_transliteration');
    });
  });
}); 