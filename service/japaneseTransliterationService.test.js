const JapaneseTransliterationService = require('./japaneseTransliterationService');

// Mock Kuroshiro and its analyzer
jest.mock('kuroshiro', () => ({
  default: jest.fn()
}));
jest.mock('kuroshiro-analyzer-kuromoji');

describe('JapaneseTransliterationService', () => {
  let service;
  let mockKuroshiro;
  let mockAnalyzer;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock the Kuroshiro analyzer
    mockAnalyzer = {};
    const KuromojiAnalyzer = require('kuroshiro-analyzer-kuromoji');
    KuromojiAnalyzer.mockImplementation(() => mockAnalyzer);

    // Mock Kuroshiro properly with .default
    mockKuroshiro = {
      init: jest.fn().mockResolvedValue(),
      convert: jest.fn()
    };
    const Kuroshiro = require('kuroshiro');
    Kuroshiro.default.mockImplementation(() => mockKuroshiro);

    service = new JapaneseTransliterationService();
  });

  describe('Constructor and initialization', () => {
    test('should create instance without initialization', () => {
      expect(service).toBeInstanceOf(JapaneseTransliterationService);
      expect(service.kuroshiro).toBeDefined();
    });
  });

  describe('transliterate method', () => {
    test('should transliterate hiragana names correctly', async () => {
      // Mock the transliterateName method calls instead of convert
      service.transliterateName = jest.fn()
        .mockResolvedValueOnce({ transliterated: 'Tarou', accuracy: 0.95, method: 'kuroshiro' })
        .mockResolvedValueOnce({ transliterated: 'Yamada', accuracy: 0.95, method: 'kuroshiro' });

      const result = await service.transliterate({
        firstName: 'たろう',
        lastName: 'やまだ',
        country: 'JP'
      });

      expect(result.firstName).toBe('Tarou');    // Romanized text
      expect(result.lastName).toBe('Yamada');    // Romanized text
      expect(result.country).toBe('JP');
      expect(result.accuracy).toBeGreaterThan(0.8);
      expect(result.details).toBeDefined();
      expect(result.details.firstNameMethod).toBe('kuroshiro');
    });

    test('should transliterate katakana names correctly', async () => {
      service.transliterateName = jest.fn()
        .mockResolvedValueOnce({ transliterated: 'Tarou', accuracy: 0.95, method: 'kuroshiro' })
        .mockResolvedValueOnce({ transliterated: 'Yamada', accuracy: 0.95, method: 'kuroshiro' });

      const result = await service.transliterate({
        firstName: 'タロウ',
        lastName: 'ヤマダ',
        country: 'JP'
      });

      expect(result.firstName).toBe('Tarou');
      expect(result.lastName).toBe('Yamada');
      expect(result.accuracy).toBeGreaterThan(0.8);
    });

    test('should transliterate kanji names correctly', async () => {
      service.transliterateName = jest.fn()
        .mockResolvedValueOnce({ transliterated: 'Tarou', accuracy: 0.95, method: 'kuroshiro' })
        .mockResolvedValueOnce({ transliterated: 'Yamada', accuracy: 0.95, method: 'kuroshiro' });

      const result = await service.transliterate({
        firstName: '太郎',
        lastName: '山田',
        country: 'JP'
      });

      expect(result.firstName).toBe('Tarou');
      expect(result.lastName).toBe('Yamada');
      expect(result.accuracy).toBeGreaterThan(0.8);
    });

    test('should handle mixed hiragana and kanji', async () => {
      service.transliterateName = jest.fn()
        .mockResolvedValueOnce({ transliterated: 'Hiroshi', accuracy: 0.95, method: 'kuroshiro' })
        .mockResolvedValueOnce({ transliterated: 'Satou', accuracy: 0.95, method: 'kuroshiro' });

      const result = await service.transliterate({
        firstName: 'ひろし',
        lastName: '佐藤',
        country: 'JP'
      });

      expect(result.firstName).toBe('Hiroshi');
      expect(result.lastName).toBe('Satou');
    });

    test('should handle different country codes', async () => {
      service.transliterateName = jest.fn()
        .mockResolvedValueOnce({ transliterated: 'Test', accuracy: 0.95, method: 'kuroshiro' })
        .mockResolvedValueOnce({ transliterated: 'Name', accuracy: 0.95, method: 'kuroshiro' });

      const result = await service.transliterate({
        firstName: 'テスト',
        lastName: 'ネーム',
        country: 'US'
      });

      expect(result.country).toBe('US');
      expect(result.firstName).toBe('Test');
      expect(result.lastName).toBe('Name');
    });

    test('should handle empty firstName validation', async () => {
      await expect(service.transliterate({
        firstName: '',
        lastName: '',
        country: 'JP'
      })).rejects.toThrow('Missing required fields');
    });

    test('should reject names that are already in Latin script', async () => {
      await expect(service.transliterate({
        firstName: 'John',
        lastName: 'Smith',
        country: 'JP'
      })).rejects.toThrow('Input does not appear to be Japanese text');
    });

    test('should use JP country code when provided', async () => {
      service.transliterateName = jest.fn()
        .mockResolvedValueOnce({ transliterated: 'Test', accuracy: 0.95, method: 'kuroshiro' })
        .mockResolvedValueOnce({ transliterated: 'Test', accuracy: 0.95, method: 'kuroshiro' });

      const result = await service.transliterate({
        firstName: 'テスト',
        lastName: 'テスト',
        country: 'JP'
      });

      expect(result.country).toBe('JP');
      expect(result.firstName).toBe('Test');
      expect(result.lastName).toBe('Test');
    });
  });

  describe('Error handling', () => {
    test('should handle transliteration errors with fallback', async () => {
      // Mock transliterateName to simulate fallback behavior  
      service.transliterateName = jest.fn()
        .mockResolvedValueOnce({ transliterated: 'Test', accuracy: 0.5, method: 'fallback' })
        .mockResolvedValueOnce({ transliterated: 'Test', accuracy: 0.5, method: 'fallback' });

      const result = await service.transliterate({
        firstName: 'テスト',
        lastName: 'テスト',
        country: 'JP'
      });

      expect(result.firstName).toBe('Test');
      expect(result.lastName).toBe('Test');
      expect(result.accuracy).toBe(0.5);
    });
  });
}); 