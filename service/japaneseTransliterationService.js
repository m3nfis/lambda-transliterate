const Kuroshiro = require('kuroshiro').default;
const KuromojiAnalyzer = require('kuroshiro-analyzer-kuromoji');
const fs = require('fs');

// Load Japanese-specific name mappings
let japaneseMappings = {};
try {
  const mappings = JSON.parse(fs.readFileSync('./name-mappings.json', 'utf8'));
  japaneseMappings = mappings.mappings?.JP || {};
} catch (error) {
  console.warn('Warning: Could not load Japanese mappings from name-mappings.json');
  japaneseMappings = {};
}

class JapaneseTransliterationService {
  constructor() {
    this.kuroshiro = null;
    this.isInitialized = false;
    this.initializeKuroshiro();
  }

  async initializeKuroshiro() {
    try {
      this.kuroshiro = new Kuroshiro();
      await this.kuroshiro.init(new KuromojiAnalyzer());
      this.isInitialized = true;
      console.log('✅ Kuroshiro initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Kuroshiro:', error.message);
      this.isInitialized = false;
    }
  }

  detectJapaneseScript(text) {
    // Enhanced Japanese script detection
    const hasHiragana = /[\u3040-\u309f]/.test(text);
    const hasKatakana = /[\u30a0-\u30ff]/.test(text);
    const hasKanji = /[\u4e00-\u9fff]/.test(text);
    
    if (hasHiragana || hasKatakana) {
      return 'japanese'; // Definitely Japanese
    }
    
    if (hasKanji) {
      // Check if it's likely Japanese Kanji by looking for common Japanese patterns
      const japanesePatterns = [
        /[々〻]/, // Japanese iteration marks
        /[ぁ-んァ-ン]/, // Hiragana/Katakana
        /[一-龯]/, // Kanji range
      ];
      
      // If it contains Japanese-specific characters or patterns, treat as Japanese
      if (japanesePatterns.some(pattern => pattern.test(text))) {
        return 'japanese';
      }
    }
    
    return 'unknown';
  }

  async transliterateWithKuroshiro(text) {
    if (!this.isInitialized || !this.kuroshiro) {
      throw new Error('Kuroshiro not initialized');
    }

    try {
      // Convert to romaji using Kuroshiro
      const romaji = await this.kuroshiro.convert(text, {
        to: 'romaji',
        mode: 'spaced',
        romajiSystem: 'passport' // Use passport system for names
      });

      // Clean up the result
      return romaji
        .replace(/\s+/g, ' ') // Normalize spaces
        .trim()
        .toLowerCase()
        .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize first letter of each word
    } catch (error) {
      console.error('Kuroshiro conversion error:', error);
      throw error;
    }
  }

  async transliterateName(name, nameType) {
    try {
      // First, check exact mappings
      if (japaneseMappings[nameType] && japaneseMappings[nameType][name]) {
        return {
          transliterated: japaneseMappings[nameType][name],
          accuracy: 0.95,
          method: 'exact_match'
        };
      }

      // If Kuroshiro is available, use it
      if (this.isInitialized) {
        const transliterated = await this.transliterateWithKuroshiro(name);
        return {
          transliterated,
          accuracy: 0.85,
          method: 'kuroshiro'
        };
      }

      // Fallback to basic transliteration
      const basicTransliteration = this.basicTransliteration(name);
      return {
        transliterated: basicTransliteration,
        accuracy: 0.6,
        method: 'basic_fallback'
      };

    } catch (error) {
      console.error(`Error transliterating Japanese name "${name}":`, error);
      
      // Final fallback
      const fallback = this.basicTransliteration(name);
      return {
        transliterated: fallback,
        accuracy: 0.5,
        method: 'error_fallback'
      };
    }
  }

  basicTransliteration(text) {
    // Basic character-by-character transliteration for common Japanese characters
    const charMap = {
      // Common Japanese surnames
      '田中': 'Tanaka',
      '佐藤': 'Sato',
      '鈴木': 'Suzuki',
      '高橋': 'Takahashi',
      '渡辺': 'Watanabe',
      '伊藤': 'Ito',
      '山本': 'Yamamoto',
      '中村': 'Nakamura',
      '小林': 'Kobayashi',
      '加藤': 'Kato',
      '吉田': 'Yoshida',
      '山田': 'Yamada',
      '佐々木': 'Sasaki',
      '山口': 'Yamaguchi',
      '松本': 'Matsumoto',
      '井上': 'Inoue',
      '木村': 'Kimura',
      '林': 'Hayashi',
      '斎藤': 'Saito',
      '清水': 'Shimizu',
      
      // Common Japanese given names
      '太郎': 'Taro',
      '花子': 'Hanako',
      '一郎': 'Ichiro',
      '次郎': 'Jiro',
      '三郎': 'Saburo',
      '美子': 'Miko',
      '恵子': 'Keiko',
      '由美': 'Yumi',
      '直子': 'Naoko',
      '裕子': 'Yuko',
      '美穂': 'Miho',
      '智子': 'Tomoko',
      '恵美': 'Emi',
      '麻美': 'Asami',
      '美香': 'Mika',
      '愛': 'Ai',
      '優': 'Yu',
      '翔': 'Sho',
      '大輔': 'Daisuke',
      '健太': 'Kenta',
      '翔太': 'Shota',
      '大樹': 'Daiki',
      '海斗': 'Kaito',
      '陽太': 'Yota',
      '陸': 'Riku',
      '颯太': 'Sota',
      '大和': 'Yamato',
      '蓮': 'Ren',
      'さくら': 'Sakura',
      '直樹': 'Naoki',
      '美咲': 'Misaki',
      '翼': 'Tsubasa',
      'あきら': 'Akira',
      '春樹': 'Haruki',
      '優子': 'Yuko',
      '誠': 'Makoto',
      '拓也': 'Takuya',
      '真理': 'Mari',
      '浩': 'Hiroshi',
      '杏': 'An',
      '亮': 'Ryo'
    };

    // Check if the entire text matches a known mapping
    if (charMap[text]) {
      return charMap[text];
    }

    // For unknown text, return a basic transliteration
    return text.replace(/[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9fff]/g, '?');
  }

  async transliterate(input) {
    const { firstName, lastName, country } = input;

    // Validate input - allow empty lastName
    if (!firstName || !country) {
      throw new Error('Missing required fields: firstName, country');
    }

    if (country !== 'JP') {
      throw new Error('Japanese transliteration service only supports JP country code');
    }

    // Detect if the names are actually Japanese
    const firstNameScript = this.detectJapaneseScript(firstName);
    const lastNameScript = lastName ? this.detectJapaneseScript(lastName) : 'unknown';

    if (firstNameScript === 'unknown' && lastNameScript === 'unknown') {
      throw new Error('Input does not appear to be Japanese text');
    }

    // Transliterate first name
    const firstNameResult = await this.transliterateName(firstName, 'firstName');
    
    // Transliterate last name
    const lastNameResult = lastName ? await this.transliterateName(lastName, 'lastName') : { transliterated: '', accuracy: 0.95, method: 'empty' };

    // Calculate overall accuracy
    const overallAccuracy = (firstNameResult.accuracy + lastNameResult.accuracy) / 2;

    return {
      firstName: firstNameResult.transliterated,
      lastName: lastNameResult.transliterated,
      country: country,
      accuracy: Math.round(overallAccuracy * 100) / 100,
      details: {
        firstNameMethod: firstNameResult.method,
        lastNameMethod: lastNameResult.method,
        firstNameAccuracy: firstNameResult.accuracy,
        lastNameAccuracy: lastNameResult.accuracy,
        kuroshiroInitialized: this.isInitialized
      }
    };
  }
}

module.exports = JapaneseTransliterationService; 