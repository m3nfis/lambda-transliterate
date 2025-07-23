const fs = require('fs');
const transliteration = require('transliteration');
const { pinyin } = require('pinyin');
const JapaneseTransliterationService = require('./japaneseTransliterationService');
const ArabicTransliterationService = require('./arabicTransliterationService');
const KoreanTransliterationService = require('./koreanTransliterationService');

// Country-based routing is now handled directly in the transliterate method

// Note: Exact matching from test data removed for production build
// The service now relies on name-mappings.json and transliteration libraries

class TransliterationService {
  constructor() {
    this.japaneseService = new JapaneseTransliterationService();
    this.arabicService = new ArabicTransliterationService();
    this.koreanService = new KoreanTransliterationService();
  }

  detectScript(text) {
    // Enhanced script detection with Japanese priority
    const hasHiragana = /[\u3040-\u309f]/.test(text);
    const hasKatakana = /[\u30a0-\u30ff]/.test(text);
    const hasJapanese = hasHiragana || hasKatakana;
    const hasKanji = /[\u4e00-\u9fff]/.test(text);
    const hasKorean = /[\uac00-\ud7af]/.test(text);
    const hasArabic = /[\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff\ufb50-\ufdff\ufe70-\ufeff]/.test(text);
    const hasRussian = /[\u0400-\u04ff]/.test(text);
    const hasHindi = /[\u0900-\u097f]/.test(text);
    const hasGreek = /[\u0370-\u03ff]/.test(text);
    const hasThai = /[\u0e00-\u0e7f]/.test(text);

    // Japanese detection with priority
    if (hasJapanese || hasKanji) {
      // Check for Japanese-specific patterns
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
    
    if (hasKorean) return 'korean';
    if (hasArabic) return 'arabic';
    if (hasRussian) return 'russian';
    if (hasHindi) return 'hindi';
    if (hasGreek) return 'greek';
    if (hasThai) return 'thai';
    
    return 'latin';
  }

    async transliterate(input) {
    const { firstName, lastName, country } = input;
    
    // Validate input - allow empty lastName
    if (!firstName || !country) {
      throw new Error('Missing required fields: firstName, country');
    }

    // First, try country-based routing (highest priority)
    try {
      // Country-based routing for specific countries
      switch (country) {
        case 'JP':
          return await this.japaneseService.transliterate(input);
        case 'KR':
          return await this.koreanService.transliterate(input);
        case 'CN':
        case 'TW':
        case 'HK':
        case 'MO':
          return await this.transliterateChinese(input);
        case 'EG':
        case 'SA':
        case 'AE':
        case 'QA':
        case 'KW':
        case 'BH':
        case 'OM':
        case 'JO':
        case 'LB':
        case 'SY':
        case 'IQ':
        case 'YE':
          return await this.arabicService.transliterate(input);
      }
    } catch (error) {
      console.warn(`Country-based routing failed for ${country}:`, error.message);
    }

    // Fall back to script detection
    const firstNameScript = this.detectScript(firstName);
    const lastNameScript = lastName ? this.detectScript(lastName) : 'latin';
    const script = firstNameScript !== 'latin' ? firstNameScript : lastNameScript;

    // Route to appropriate service based on detected script
    try {
      switch (script) {
        case 'japanese':
          return await this.japaneseService.transliterate(input);
        
        case 'arabic':
          return await this.arabicService.transliterate(input);
        
        case 'korean':
          return await this.koreanService.transliterate(input);
        
        case 'russian':
          return await this.transliterateRussian(input);
        
        case 'hindi':
          return await this.transliterateHindi(input);
        
        case 'greek':
          return await this.transliterateGreek(input);
        
        case 'thai':
          return await this.transliterateThai(input);
        
        case 'latin':
          // For Latin script, use general transliteration
          return await this.transliterateGeneral(input);
        
        default:
          // Final fallback to general transliteration for unknown scripts
          return await this.transliterateGeneral(input);
      }
    } catch (error) {
      console.error(`Error in transliteration for country ${country}:`, error);
      
      // Fallback to general transliteration
      return await this.transliterateGeneral(input);
    }
  }

  async transliterateChinese(input) {
    const { firstName, lastName, country } = input;
    
    try {
      const firstNamePinyin = pinyin(firstName, {
        style: 'normal',
        heteronym: false
      }).flat().join('');
      
      const lastNamePinyin = lastName ? pinyin(lastName, {
        style: 'normal',
        heteronym: false
      }).flat().join('') : '';
      
      return {
        firstName: firstNamePinyin.charAt(0).toUpperCase() + firstNamePinyin.slice(1),
        lastName: lastName ? lastNamePinyin.charAt(0).toUpperCase() + lastNamePinyin.slice(1) : '',
        country: country,
        accuracy: 0.9,
        method: 'pinyin_library'
      };
    } catch (error) {
      console.error('Chinese transliteration error:', error);
      return await this.transliterateGeneral(input);
    }
  }

  async transliterateRussian(input) {
    const { firstName, lastName, country } = input;
    
    try {
      // Russian to Latin transliteration
      const russianToLatin = {
        'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo', 'Ж': 'Zh',
        'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O',
        'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts',
        'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Shch', 'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu',
        'Я': 'Ya',
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh',
        'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
        'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts',
        'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu',
        'я': 'ya'
      };

      const transliterateText = (text) => {
        return text.split('').map(char => russianToLatin[char] || char).join('');
      };

      const transliteratedFirstName = transliterateText(firstName);
      const transliteratedLastName = lastName ? transliterateText(lastName) : '';

      return {
        firstName: transliteratedFirstName.charAt(0).toUpperCase() + transliteratedFirstName.slice(1),
        lastName: lastName ? transliteratedLastName.charAt(0).toUpperCase() + transliteratedLastName.slice(1) : '',
        country: country,
        accuracy: 0.9,
        method: 'russian_character_map'
      };
    } catch (error) {
      console.error('Russian transliteration error:', error);
      return await this.transliterateGeneral(input);
    }
  }

  async transliterateHindi(input) {
    const { firstName, lastName, country } = input;
    
    try {
      // Hindi (Devanagari) to Latin transliteration
      const hindiToLatin = {
        // Vowels
        'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ii', 'उ': 'u', 'ऊ': 'uu', 'ऋ': 'ri', 'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au',
        'ा': 'aa', 'ि': 'i', 'ी': 'ii', 'ु': 'u', 'ू': 'uu', 'ृ': 'ri', 'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au',
        
        // Consonants
        'क': 'ka', 'ख': 'kha', 'ग': 'ga', 'घ': 'gha', 'ङ': 'nga',
        'च': 'cha', 'छ': 'chha', 'ज': 'ja', 'झ': 'jha', 'ञ': 'nya',
        'ट': 'ta', 'ठ': 'tha', 'ड': 'da', 'ढ': 'dha', 'ण': 'na',
        'त': 'ta', 'थ': 'tha', 'द': 'da', 'ध': 'dha', 'न': 'na',
        'प': 'pa', 'फ': 'pha', 'ब': 'ba', 'भ': 'bha', 'म': 'ma',
        'य': 'ya', 'र': 'ra', 'ल': 'la', 'व': 'va', 'श': 'sha',
        'ष': 'sha', 'स': 'sa', 'ह': 'ha', 'ळ': 'la', 'क्ष': 'ksha',
        'त्र': 'tra', 'ज्ञ': 'gya',
        
        // Special characters
        'ं': 'n', 'ः': 'h', '्': '', '़': '', 'ॉ': 'o', 'ॅ': 'e',
        
        // Numbers
        '०': '0', '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
      };

      const transliterateText = (text) => {
        let result = '';
        let i = 0;
        
        while (i < text.length) {
          // Check for two-character combinations first
          if (i + 1 < text.length) {
            const twoChar = text.substr(i, 2);
            if (hindiToLatin[twoChar]) {
              result += hindiToLatin[twoChar];
              i += 2;
              continue;
            }
          }
          
          // Check for single character
          const char = text[i];
          if (hindiToLatin[char]) {
            result += hindiToLatin[char];
          } else {
            result += char;
          }
          i++;
        }
        
        return result;
      };

      const transliteratedFirstName = transliterateText(firstName);
      const transliteratedLastName = lastName ? transliterateText(lastName) : '';

      return {
        firstName: transliteratedFirstName.charAt(0).toUpperCase() + transliteratedFirstName.slice(1),
        lastName: lastName ? transliteratedLastName.charAt(0).toUpperCase() + transliteratedLastName.slice(1) : '',
        country: country,
        accuracy: 0.8,
        method: 'hindi_character_map'
      };
    } catch (error) {
      console.error('Hindi transliteration error:', error);
      return await this.transliterateGeneral(input);
    }
  }

  async transliterateGreek(input) {
    const { firstName, lastName, country } = input;
    
    try {
      // Greek to Latin transliteration
      const greekToLatin = {
        'Α': 'A', 'Β': 'V', 'Γ': 'G', 'Δ': 'D', 'Ε': 'E', 'Ζ': 'Z', 'Η': 'I', 'Θ': 'Th',
        'Ι': 'I', 'Κ': 'K', 'Λ': 'L', 'Μ': 'M', 'Ν': 'N', 'Ξ': 'X', 'Ο': 'O', 'Π': 'P',
        'Ρ': 'R', 'Σ': 'S', 'Τ': 'T', 'Υ': 'Y', 'Φ': 'F', 'Χ': 'Ch', 'Ψ': 'Ps', 'Ω': 'O',
        'α': 'a', 'β': 'v', 'γ': 'g', 'δ': 'd', 'ε': 'e', 'ζ': 'z', 'η': 'i', 'θ': 'th',
        'ι': 'i', 'κ': 'k', 'λ': 'l', 'μ': 'm', 'ν': 'n', 'ξ': 'x', 'ο': 'o', 'π': 'p',
        'ρ': 'r', 'σ': 's', 'τ': 't', 'υ': 'y', 'φ': 'f', 'χ': 'ch', 'ψ': 'ps', 'ω': 'o',
        'ά': 'a', 'έ': 'e', 'ή': 'i', 'ί': 'i', 'ό': 'o', 'ύ': 'y', 'ώ': 'o',
        'ϊ': 'i', 'ϋ': 'y', 'ΐ': 'i', 'ΰ': 'y'
      };

      const transliterateText = (text) => {
        return text.split('').map(char => greekToLatin[char] || char).join('');
      };

      const transliteratedFirstName = transliterateText(firstName);
      const transliteratedLastName = lastName ? transliterateText(lastName) : '';

      return {
        firstName: transliteratedFirstName.charAt(0).toUpperCase() + transliteratedFirstName.slice(1),
        lastName: lastName ? transliteratedLastName.charAt(0).toUpperCase() + transliteratedLastName.slice(1) : '',
        country: country,
        accuracy: 0.9,
        method: 'greek_character_map'
      };
    } catch (error) {
      console.error('Greek transliteration error:', error);
      return await this.transliterateGeneral(input);
    }
  }

  async transliterateThai(input) {
    const { firstName, lastName, country } = input;
    
    try {
      // Thai to Latin transliteration
      const thaiToLatin = {
        // Consonants
        'ก': 'k', 'ข': 'kh', 'ค': 'kh', 'ฆ': 'kh', 'ง': 'ng',
        'จ': 'ch', 'ฉ': 'ch', 'ช': 'ch', 'ซ': 's', 'ฌ': 'ch',
        'ญ': 'y', 'ฎ': 'd', 'ฏ': 't', 'ฐ': 'th', 'ฑ': 'th',
        'ฒ': 'th', 'ณ': 'n', 'ด': 'd', 'ต': 't', 'ถ': 'th',
        'ท': 'th', 'ธ': 'th', 'น': 'n', 'บ': 'b', 'ป': 'p',
        'ผ': 'ph', 'ฝ': 'f', 'พ': 'ph', 'ฟ': 'f', 'ภ': 'ph',
        'ม': 'm', 'ย': 'y', 'ร': 'r', 'ล': 'l', 'ว': 'w',
        'ศ': 's', 'ษ': 's', 'ส': 's', 'ห': 'h', 'ฬ': 'l',
        'อ': '', 'ฮ': 'h',
        
        // Vowels
        'ะ': 'a', 'า': 'a', 'ิ': 'i', 'ี': 'i', 'ึ': 'ue', 'ื': 'ue',
        'ุ': 'u', 'ู': 'u', 'เ': 'e', 'แ': 'ae', 'โ': 'o', 'ใ': 'ai',
        'ไ': 'ai', 'ำ': 'am', 'ฤ': 'rue', 'ฦ': 'lue',
        
        // Tones
        '่': '', '้': '', '๊': '', '๋': '',
        
        // Numbers
        '๐': '0', '๑': '1', '๒': '2', '๓': '3', '๔': '4',
        '๕': '5', '๖': '6', '๗': '7', '๘': '8', '๙': '9'
      };

      const transliterateText = (text) => {
        let result = '';
        let i = 0;
        
        while (i < text.length) {
          const char = text[i];
          if (thaiToLatin[char]) {
            result += thaiToLatin[char];
          } else {
            result += char;
          }
          i++;
        }
        
        return result;
      };

      const transliteratedFirstName = transliterateText(firstName);
      const transliteratedLastName = lastName ? transliterateText(lastName) : '';

      return {
        firstName: transliteratedFirstName.charAt(0).toUpperCase() + transliteratedFirstName.slice(1),
        lastName: lastName ? transliteratedLastName.charAt(0).toUpperCase() + transliteratedLastName.slice(1) : '',
        country: country,
        accuracy: 0.7,
        method: 'thai_character_map'
      };
    } catch (error) {
      console.error('Thai transliteration error:', error);
      return await this.transliterateGeneral(input);
    }
  }

  async transliterateGeneral(input) {
    const { firstName, lastName, country } = input;
    
    try {
      // Check if this is Latin script that needs normalization (contains diacritics)
      if (this.isLatinWithDiacritics(firstName) || (lastName && this.isLatinWithDiacritics(lastName))) {
        return await this.transliterateLatinNormalization(input);
      }

      // Use the general transliteration library
      const transliteratedFirstName = transliteration.transliterate(firstName);
      const transliteratedLastName = lastName ? transliteration.transliterate(lastName) : '';

      return {
        firstName: transliteratedFirstName.charAt(0).toUpperCase() + transliteratedFirstName.slice(1),
        lastName: lastName ? transliteratedLastName.charAt(0).toUpperCase() + transliteratedLastName.slice(1) : '',
        country: country,
        accuracy: 0.6,
        method: 'general_transliteration'
      };
    } catch (error) {
      console.error('General transliteration error:', error);
      
      // Final fallback - return original with low accuracy
      return {
        firstName: firstName,
        lastName: lastName || '',
        country: country,
        accuracy: 0.1,
        method: 'fallback_original'
      };
    }
  }

  /**
   * Check if text is Latin script with diacritics/accents
   */
  isLatinWithDiacritics(text) {
    if (!text) return false;
    
    // Check for common Latin characters with diacritics
    const diacriticPattern = /[ÀÁÂÃÄÅàáâãäåÇçÈÉÊËèéêëÌÍÎÏìíîïÑñÒÓÔÕÖØòóôõöøÙÚÛÜùúûüÝýÿ]/;
    
    // Also check for Latin base + combining diacritical marks
    const combiningDiacritics = /[\u0300-\u036f]/;
    
    return diacriticPattern.test(text) || combiningDiacritics.test(text);
  }

  /**
   * Dedicated Latin script normalization (slug/diacritic removal)
   */
  async transliterateLatinNormalization(input) {
    const { firstName, lastName, country } = input;
    
    try {
      const normalizeLatinText = (text) => {
        if (!text) return '';
        
        // First, try Unicode normalization to decompose characters
        let normalized = text.normalize('NFD');
        
        // Remove combining diacritical marks
        normalized = normalized.replace(/[\u0300-\u036f]/g, '');
        
        // Handle specific character replacements that normalization might miss
        const diacriticMap = {
          'À': 'A', 'Á': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A', 'Å': 'A',
          'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a',
          'Ç': 'C', 'ç': 'c',
          'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E',
          'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',
          'Ì': 'I', 'Í': 'I', 'Î': 'I', 'Ï': 'I',
          'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
          'Ñ': 'N', 'ñ': 'n',
          'Ò': 'O', 'Ó': 'O', 'Ô': 'O', 'Õ': 'O', 'Ö': 'O', 'Ø': 'O',
          'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o', 'ø': 'o',
          'Ù': 'U', 'Ú': 'U', 'Û': 'U', 'Ü': 'U',
          'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',
          'Ý': 'Y', 'ý': 'y', 'ÿ': 'y',
          'Æ': 'AE', 'æ': 'ae',
          'Œ': 'OE', 'œ': 'oe',
          'ß': 'ss'
        };
        
        // Apply character-by-character replacement
        for (const [accented, plain] of Object.entries(diacriticMap)) {
          normalized = normalized.replace(new RegExp(accented, 'g'), plain);
        }
        
        return normalized;
      };

      const normalizedFirstName = normalizeLatinText(firstName);
      const normalizedLastName = lastName ? normalizeLatinText(lastName) : '';

      return {
        firstName: normalizedFirstName.charAt(0).toUpperCase() + normalizedFirstName.slice(1),
        lastName: lastName ? normalizedLastName.charAt(0).toUpperCase() + normalizedLastName.slice(1) : '',
        country: country,
        accuracy: 0.98,
        method: 'latin_normalization'
      };
         } catch (error) {
       console.error('Latin normalization error:', error);
       
       // Fallback to original general transliteration (avoid recursion)
       const transliteratedFirstName = transliteration.transliterate(firstName);
       const transliteratedLastName = lastName ? transliteration.transliterate(lastName) : '';

       return {
         firstName: transliteratedFirstName.charAt(0).toUpperCase() + transliteratedFirstName.slice(1),
         lastName: lastName ? transliteratedLastName.charAt(0).toUpperCase() + transliteratedLastName.slice(1) : '',
         country: country,
         accuracy: 0.6,
         method: 'general_transliteration'
       };
     }
  }
}

module.exports = TransliterationService; 