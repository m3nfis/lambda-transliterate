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
      // console.log('✅ Kuroshiro initialized successfully');
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

  async transliterateWithKuroshiro(text, normalized = false) {
    if (!this.isInitialized || !this.kuroshiro) {
      throw new Error('Kuroshiro not initialized');
    }

    try {
      // Choose romaji system based on normalized flag
      const romajiSystem = normalized ? 'passport' : 'hepburn';
      
      // Convert to romaji using Kuroshiro
      const romaji = await this.kuroshiro.convert(text, {
        to: 'romaji',
        mode: 'spaced',
        romajiSystem: romajiSystem
      });

      // Clean up the result
      let result = romaji
        .replace(/\s+/g, ' ') // Normalize spaces
        .trim()
        .toLowerCase()
        .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize first letter of each word

      // Apply macron corrections only if not normalized
      if (!normalized) {
        result = this.applyMacronCorrections(result);
      }

      return result;
    } catch (error) {
      console.error('Kuroshiro conversion error:', error);
      throw error;
    }
  }

  applyMacronCorrections(text) {
    // Apply macron corrections for common Japanese name patterns
    const macronCorrections = {
      // Long vowel corrections
      'Taro': 'Tarō',
      'Ichiro': 'Ichirō',
      'Jiro': 'Jirō',
      'Saburo': 'Saburō',
      'Sato': 'Satō',
      'Ito': 'Itō',
      'Kato': 'Katō',
      'Saito': 'Saitō',
      'Yuko': 'Yūko',
      'Yu': 'Yū',
      'Sho': 'Shō',
      'Shota': 'Shōta',
      'Yota': 'Yōta',
      'Sota': 'Sōta',
      'Ryo': 'Ryō',
      'Yoko': 'Yōko',
      'Toyo': 'Tōyō',
      'Kyo': 'Kyō',
      'Myo': 'Myō',
      'Ryo': 'Ryō',
      'Sho': 'Shō',
      'Yo': 'Yō',
      'Ko': 'Kō',
      'So': 'Sō',
      'To': 'Tō',
      'No': 'Nō',
      'Mo': 'Mō',
      'Ho': 'Hō',
      'Go': 'Gō',
      'Do': 'Dō',
      'Bo': 'Bō',
      'Po': 'Pō',
      'Zo': 'Zō',
      'Jo': 'Jō',
      'Cho': 'Chō',
      'Sho': 'Shō',
      'Tsu': 'Tsū',
      'Su': 'Sū',
      'Ku': 'Kū',
      'Mu': 'Mū',
      'Nu': 'Nū',
      'Fu': 'Fū',
      'Yu': 'Yū',
      'Ru': 'Rū',
      'Gu': 'Gū',
      'Zu': 'Zū',
      'Bu': 'Bū',
      'Pu': 'Pū',
      'Ju': 'Jū',
      'Chu': 'Chū',
      'Shu': 'Shū'
    };

    // Apply corrections
    let correctedText = text;
    for (const [incorrect, correct] of Object.entries(macronCorrections)) {
      // Use word boundaries to avoid partial matches
      const regex = new RegExp(`\\b${incorrect}\\b`, 'g');
      correctedText = correctedText.replace(regex, correct);
    }

    return correctedText;
  }

  normalizeJapaneseText(text) {
    if (!text) return text;
    
    return text
      // Japanese macrons
      .replace(/ō/g, 'o')
      .replace(/ū/g, 'u')
      .replace(/ē/g, 'e')
      .replace(/ā/g, 'a')
      .replace(/ī/g, 'i');
  }

  async transliterateName(name, nameType, normalized = false) {
    try {
      // First, check exact mappings
      if (japaneseMappings[nameType] && japaneseMappings[nameType][name]) {
        let transliterated = japaneseMappings[nameType][name];
        
        // Apply normalization if requested
        if (normalized) {
          transliterated = this.normalizeJapaneseText(transliterated);
        }
        
        return {
          transliterated,
          accuracy: 0.95,
          method: 'exact_match'
        };
      }

      // If Kuroshiro is available, use it
      if (this.isInitialized) {
        const transliterated = await this.transliterateWithKuroshiro(name, normalized);
        return {
          transliterated,
          accuracy: 0.85,
          method: 'kuroshiro'
        };
      }

      // Fallback to basic transliteration
      let basicTransliteration = this.basicTransliteration(name);
      
      // Apply normalization if requested
      if (normalized) {
        basicTransliteration = this.normalizeJapaneseText(basicTransliteration);
      }
      
      return {
        transliterated: basicTransliteration,
        accuracy: 0.6,
        method: 'basic_fallback'
      };

    } catch (error) {
      console.error(`Error transliterating Japanese name "${name}":`, error);
      
      // Final fallback
      let fallback = this.basicTransliteration(name);
      
      // Apply normalization if requested
      if (normalized) {
        fallback = this.normalizeJapaneseText(fallback);
      }
      
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
      // Common Japanese surnames (with proper macrons)
      '田中': 'Tanaka',
      '佐藤': 'Satō',
      '鈴木': 'Suzuki',
      '高橋': 'Takahashi',
      '渡辺': 'Watanabe',
      '伊藤': 'Itō',
      '山本': 'Yamamoto',
      '中村': 'Nakamura',
      '小林': 'Kobayashi',
      '加藤': 'Katō',
      '吉田': 'Yoshida',
      '山田': 'Yamada',
      '佐々木': 'Sasaki',
      '山口': 'Yamaguchi',
      '松本': 'Matsumoto',
      '井上': 'Inoue',
      '木村': 'Kimura',
      '林': 'Hayashi',
      '斎藤': 'Saitō',
      '清水': 'Shimizu',
      
      // Common Japanese given names (with proper macrons)
      '太郎': 'Tarō',
      '花子': 'Hanako',
      '一郎': 'Ichirō',
      '次郎': 'Jirō',
      '三郎': 'Saburō',
      '美子': 'Miko',
      '恵子': 'Keiko',
      '由美': 'Yumi',
      '直子': 'Naoko',
      '裕子': 'Yūko',
      '美穂': 'Miho',
      '智子': 'Tomoko',
      '恵美': 'Emi',
      '麻美': 'Asami',
      '美香': 'Mika',
      '愛': 'Ai',
      '優': 'Yū',
      '翔': 'Shō',
      '大輔': 'Daisuke',
      '健太': 'Kenta',
      '翔太': 'Shōta',
      '大樹': 'Daiki',
      '海斗': 'Kaito',
      '陽太': 'Yōta',
      '陸': 'Riku',
      '颯太': 'Sōta',
      '大和': 'Yamato',
      '蓮': 'Ren',
      'さくら': 'Sakura',
      '直樹': 'Naoki',
      '美咲': 'Misaki',
      '翼': 'Tsubasa',
      'あきら': 'Akira',
      '春樹': 'Haruki',
      '優子': 'Yūko',
      '誠': 'Makoto',
      '拓也': 'Takuya',
      '真理': 'Mari',
      '浩': 'Hiroshi',
      '杏': 'An',
      '亮': 'Ryō'
    };

    // Check if the entire text matches a known mapping
    if (charMap[text]) {
      return charMap[text];
    }

    // For unknown text, return a basic transliteration
    return text.replace(/[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9fff]/g, '?');
  }

  async transliterate(input) {
    const { firstName, lastName, country, normalized = false } = input;

    // Validate input - allow empty lastName
    if (!firstName || !country) {
      throw new Error('Missing required fields: firstName, country');
    }

    // Check if the country uses Japanese script
    const japaneseCountries = ['JP', 'CN', 'TW', 'HK', 'MO', 'KR', 'SG'];
    
    if (!japaneseCountries.includes(country)) {
      console.warn(`Warning: Country ${country} is not in the Japanese script countries list, but proceeding with Japanese transliteration`);
    }

    // Detect if the names are actually Japanese
    const firstNameScript = this.detectJapaneseScript(firstName);
    const lastNameScript = lastName ? this.detectJapaneseScript(lastName) : 'unknown';

    if (firstNameScript === 'unknown' && lastNameScript === 'unknown') {
      throw new Error('Input does not appear to be Japanese text');
    }

    // Transliterate first name
    const firstNameResult = await this.transliterateName(firstName, 'firstName', normalized);
    
    // Transliterate last name
    const lastNameResult = lastName ? await this.transliterateName(lastName, 'lastName', normalized) : { transliterated: '', accuracy: 0.95, method: 'empty' };

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