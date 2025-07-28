const fs = require('fs');
const arabicTransliterate = require('arabic-transliterate');
const arabicNamesConfig = require('./arabicNamesConfig');

// Load Arabic name mappings from configuration
const arabicMappings = {
  firstName: arabicNamesConfig.firstName,
  lastName: arabicNamesConfig.lastName
};

class ArabicTransliterationService {
  constructor() {
    this.isInitialized = true; // Service is always initialized
  }

  detectArabicScript(text) {
    // Arabic script detection
    const hasArabic = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text);
    
    if (hasArabic) {
      return 'arabic';
    }
    
    return 'unknown';
  }

  transliterateWithArabicLibrary(text) {
    try {
      // Enhanced Arabic-to-Latin transliteration using character mapping
      const transliterated = this.enhancedArabicTransliteration(text);
      
      // Clean up the result - capitalize first letter of each word
      return transliterated
        .trim()
        .toLowerCase()
        .replace(/\b\w/g, l => l.toUpperCase());
    } catch (error) {
      console.error('Arabic transliteration error:', error);
      throw error;
    }
  }

  async transliterateName(name, nameType) {
    try {
      // First, check exact mappings
      if (arabicMappings[nameType] && arabicMappings[nameType][name]) {
        return {
          transliterated: arabicMappings[nameType][name],
          accuracy: 0.95,
          method: 'exact_match'
        };
      }

      // Try arabic-transliterate library as fallback
      try {
        const transliterated = arabicTransliterate(name, 'arabic2latin', 'Arabic');
        if (transliterated && transliterated !== name) {
          // Clean up IJMES diacritics to match expected format
          const cleaned = transliterated
            .replace(/ʿ/g, '') // Remove ayin
            .replace(/ʾ/g, '') // Remove hamza
            .replace(/ḥ/g, 'h') // Convert h with dot to regular h
            .replace(/ṭ/g, 't') // Convert t with dot to regular t
            .replace(/ṣ/g, 's') // Convert s with dot to regular s
            .replace(/ḍ/g, 'd') // Convert d with dot to regular d
            .replace(/ẓ/g, 'z') // Convert z with dot to regular z
            .replace(/ġ/g, 'gh') // Convert gh with dot to gh
            .replace(/ḫ/g, 'kh') // Convert kh with dot to kh
            .replace(/š/g, 'sh') // Convert sh with dot to sh
            .replace(/ǧ/g, 'j') // Convert j with dot to j
            .replace(/ā/g, 'a') // Convert long a to regular a
            .replace(/ī/g, 'i') // Convert long i to regular i
            .replace(/ū/g, 'u') // Convert long u to regular u
            .replace(/ē/g, 'e') // Convert long e to regular e
            .replace(/ō/g, 'o'); // Convert long o to regular o
          
          return {
            transliterated: cleaned.charAt(0).toUpperCase() + cleaned.slice(1),
            accuracy: 0.8,
            method: 'arabic_transliterate_library'
          };
        }
      } catch (libraryError) {
        console.warn(`arabic-transliterate library failed for "${name}":`, libraryError.message);
      }

      // Use enhanced Arabic transliteration as final fallback
      const transliterated = this.transliterateWithArabicLibrary(name);
      return {
        transliterated,
        accuracy: 0.75,
        method: 'enhanced_arabic'
      };

    } catch (error) {
      console.error(`Error transliterating Arabic name "${name}":`, error);
      
      // Final fallback
      const fallback = this.basicTransliteration(name);
      return {
        transliterated: fallback,
        accuracy: 0.5,
        method: 'error_fallback'
      };
    }
  }

  enhancedArabicTransliteration(text) {
    // Enhanced Arabic-to-Latin transliteration with character mapping
    const arabicToLatin = {
      // Basic Arabic letters
      'ا': 'a', 'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j', 'ح': 'h', 'خ': 'kh',
      'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh', 'ص': 's',
      'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q',
      'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ه': 'h', 'و': 'w', 'ي': 'y',
      
      // Vowels and diacritics
      'َ': 'a', 'ُ': 'u', 'ِ': 'i', 'ّ': '', 'ْ': '', 'ً': 'an', 'ٌ': 'un', 'ٍ': 'in',
      
      // Special characters
      'ة': 'a', 'ى': 'a', 'ء': '', 'آ': 'aa', 'أ': 'a', 'إ': 'i', 'ؤ': 'u', 'ئ': 'i',
      
      // Extended Arabic characters
      'گ': 'g', 'چ': 'ch', 'پ': 'p', 'ژ': 'zh', 'ڤ': 'v', 'ڨ': 'q', 'ڭ': 'ng',
      
      // Common ligatures and combinations
      'لا': 'la', 'لأ': 'la', 'لإ': 'li', 'لآ': 'laa', 'عبد': 'abd', 'عبد ال': 'abd al',
      
      // Use names from configuration (lowercase for character mapping)
      ...Object.fromEntries(
        Object.entries(arabicNamesConfig.firstName).map(([key, value]) => [key, value.toLowerCase()])
      ),
      ...Object.fromEntries(
        Object.entries(arabicNamesConfig.lastName).map(([key, value]) => [key, value.toLowerCase()])
      )
    };

    let result = '';
    let i = 0;
    
    while (i < text.length) {
      let matched = false;
      
      // Check for longer matches first (up to 10 characters)
      for (let len = 10; len >= 1; len--) {
        if (i + len <= text.length) {
          const substr = text.substr(i, len);
          if (arabicToLatin[substr]) {
            result += arabicToLatin[substr];
            i += len;
            matched = true;
            break;
          }
        }
      }
      
      if (!matched) {
        // Check for single character
        const char = text[i];
        if (arabicToLatin[char]) {
          result += arabicToLatin[char];
        } else if (char.match(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/)) {
          // Unknown Arabic character, try to map it
          result += this.mapUnknownArabicChar(char);
        } else {
          // Non-Arabic character, keep as is
          result += char;
        }
        i++;
      }
    }
    
    // Clean up the result - be more conservative
    return result
      .replace(/[aeiou]{3,}/g, match => match[0] + match[1]) // Keep only first two vowels if more than 2
      .replace(/[bcdfghjklmnpqrstvwxyz]{3,}/g, match => match[0] + match[1]) // Keep only first two consonants if more than 2
      .trim();
  }

  mapUnknownArabicChar(char) {
    // Map unknown Arabic characters to closest Latin equivalents
    const unknownMap = {
      'ڪ': 'k', 'ګ': 'g', 'ڬ': 'g', 'ڭ': 'ng', 'ڮ': 'n',
      'ڰ': 'p', 'ڱ': 'm', 'ڲ': 'n', 'ڳ': 'g', 'ڴ': 'g',
      'ڵ': 'l', 'ڶ': 'l', 'ڷ': 'l', 'ڸ': 'l', 'ڹ': 'n',
      'ں': 'n', 'ڻ': 'n', 'ڼ': 'n', 'ڽ': 'n', 'ھ': 'h',
      'ڿ': 'ch', 'ۀ': 'h', 'ہ': 'h', 'ۂ': 'h', 'ۃ': 'h',
      'ۄ': 'w', 'ۅ': 'o', 'ۆ': 'o', 'ۇ': 'u', 'ۈ': 'u',
      'ۉ': 'u', 'ۊ': 'w', 'ۋ': 'v', 'ی': 'y', 'ۍ': 'y',
      'ێ': 'y', 'ۏ': 'w', 'ې': 'e', 'ۑ': 'y'
    };
    
    return unknownMap[char] || '?';
  }

  basicTransliteration(text) {
    // Basic character-by-character transliteration for common Arabic characters
    const charMap = {
      // Common Arabic names and their transliterations
      'محمد': 'Mohammed',
      'علي': 'Ali',
      'فاطمة': 'Fatima',
      'أحمد': 'Ahmed',
      'عائشة': 'Aisha',
      'خالد': 'Khalid',
      'زينب': 'Zainab',
      'يوسف': 'Youssef',
      'نور': 'Nour',
      'عمر': 'Omar',
      'سارة': 'Sarah',
      'عبد الرحمن': 'Abdul Rahman',
      'هبة': 'Heba',
      'محمود': 'Mahmoud',
      'آية': 'Aya',
      'طارق': 'Tariq',
      'إيمان': 'Iman',
      'حسن': 'Hassan',
      'لمى': 'Lama',
      'مريم': 'Mariam',
      'إبراهيم': 'Ibrahim',
      'سعيد': 'Saeed',
      'عبدالله': 'Abdullah',
      'حسين': 'Hussein',
      'مصطفى': 'Mostafa',
      'جمال': 'Gamal',
      'رضوان': 'Radwan',
      'صلاح': 'Salah',
      'شريف': 'Sherif',
      'كريم': 'Karim',
      'ليلى': 'Layla',
      'وليد': 'Walid',
      'هنا': 'Hana',
      'أمير': 'Amir',
      'ريم': 'Reem',
      'بلال': 'Bilal',
      'دينا': 'Dina',
      'فارس': 'Faris',
      'ياسمين': 'Yasmin',
      'نادر': 'Nader',
      'منى': 'Mona',
      'سامي': 'Sami',
      'ندى': 'Nada',
      'زياد': 'Ziad',
      'رانيا': 'Rania',
      'هشام': 'Hisham',
      'هدى': 'Huda',
      'باسم': 'Basem',
      'سمر': 'Samar',
      'ماجد': 'Majid',
      'أسماء': 'Asma',
      'سلمان': 'Salman',
      'داليا': 'Dalia',
      'فهد': 'Fahd',
      'جميلة': 'Jamila',
      'تركي': 'Turki',
      'غادة': 'Ghada',
      'بندر': 'Bandar',
      'حنان': 'Hanan'
    };

    // Check if the entire text matches a known mapping
    if (charMap[text]) {
      return charMap[text];
    }

    // For unknown text, return a basic transliteration
    return text.replace(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g, '?');
  }

  async transliterate(input) {
    const { firstName, lastName, country } = input;

    // Validate input - allow empty lastName
    if (!firstName || !country) {
      throw new Error('Missing required fields: firstName, country');
    }

    // Check if the country uses Arabic script
    const arabicCountries = [
      'SA', 'EG', 'AE', 'QA', 'KW', 'BH', 'OM', 'JO', 'LB', 'SY', 'IQ', 'IR', 'AF', 'PK', 'BD', 'MV', 'DJ', 'SO', 'ER', 'TD', 'SD', 'LY', 'TN', 'DZ', 'MA', 'MR', 'NE', 'ML', 'BF', 'SN', 'GN', 'GW', 'SL', 'LR', 'TG', 'BJ', 'CV', 'ST', 'CM', 'NG', 'GH', 'CI', 'GQ', 'GA', 'CG', 'CF', 'SS', 'ET', 'KM', 'MG', 'MU', 'SC', 'YE', 'IL', 'PS', 'TR', 'AZ', 'UZ', 'KZ', 'KG', 'TJ', 'TM', 'XK'
    ];
    
    if (!arabicCountries.includes(country)) {
      console.warn(`Warning: Country ${country} is not in the Arabic script countries list, but proceeding with Arabic transliteration`);
    }

    // Detect if the names are actually Arabic
    const firstNameScript = this.detectArabicScript(firstName);
    const lastNameScript = lastName ? this.detectArabicScript(lastName) : 'unknown';

    if (firstNameScript === 'unknown' && lastNameScript === 'unknown') {
      throw new Error('Input does not appear to be Arabic text');
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
        arabicTransliterateInitialized: this.isInitialized
      }
    };
  }
}

module.exports = ArabicTransliterationService; 