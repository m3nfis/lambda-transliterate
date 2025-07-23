/**
 * Browser-Compatible Transliteration Library
 * Lambda Transliterate Names - Standalone Version
 * Supports: Arabic, Japanese, Korean, Chinese, Russian, Thai, and General scripts
 */

class BrowserTransliterationLib {
    constructor() {
        this.initialized = false;
        this.scriptMappings = this.initializeScriptMappings();
        this.countryScriptMap = this.initializeCountryScriptMap();
    }

    /**
     * Initialize character mappings for different scripts
     */
    initializeScriptMappings() {
        return {
            // Arabic to Latin mapping with name recognition
            arabic: {
                // Complete name mappings (most important - checked first)
                names: {
                    'محمد': 'Mohammed', 'علي': 'Ali', 'أحمد': 'Ahmed', 'فاطمة': 'Fatima',
                    'عبدالله': 'Abdullah', 'عبد الله': 'Abdullah', 'حسن': 'Hassan', 'حسين': 'Hussein',
                    'عمر': 'Omar', 'عثمان': 'Othman', 'خالد': 'Khalid', 'سعد': 'Saad',
                    'عبدالرحمن': 'Abdulrahman', 'عبد الرحمن': 'Abdulrahman', 'ابراهيم': 'Ibrahim',
                    'إبراهيم': 'Ibrahim', 'يوسف': 'Youssef', 'موسى': 'Musa', 'عيسى': 'Issa',
                    'مريم': 'Mariam', 'عائشة': 'Aisha', 'خديجة': 'Khadija', 'زينب': 'Zeinab',
                    'سارة': 'Sarah', 'ليلى': 'Layla', 'نور': 'Nour', 'حبيبة': 'Habiba',
                    'كريم': 'Karim', 'عادل': 'Adel', 'سامي': 'Sami', 'طارق': 'Tarek',
                    'نادر': 'Nader', 'مصطفى': 'Mostafa', 'صالح': 'Saleh', 'منى': 'Mona',
                    'هند': 'Hind', 'سلمى': 'Salma', 'دينا': 'Dina', 'رنا': 'Rana',
                    'حمد': 'Hamad', 'سلطان': 'Sultan', 'فهد': 'Fahad', 'بندر': 'Bandar',
                    'تركي': 'Turki', 'ناصر': 'Nasser', 'سلمان': 'Salman', 'فيصل': 'Faisal'
                },
                
                // Character mappings (fallback for unknown names)
                chars: {
                    'ا': 'a', 'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j', 'ح': 'h', 'خ': 'kh',
                    'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh', 'ص': 's',
                    'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': "'", 'غ': 'gh', 'ف': 'f', 'ق': 'q',
                    'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ه': 'h', 'و': 'w', 'ي': 'y',
                    'ى': 'a', 'ة': 'h', 'أ': 'a', 'إ': 'i', 'آ': 'aa', 'ؤ': 'u', 'ئ': 'i',
                    'َ': 'a', 'ُ': 'u', 'ِ': 'i', 'ْ': '', 'ً': 'an', 'ٌ': 'un', 'ٍ': 'in'
                }
            },

            // Japanese Hiragana to Romaji
            japanese: {
                'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
                'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
                'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
                'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
                'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
                'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
                'だ': 'da', 'ぢ': 'ji', 'づ': 'zu', 'で': 'de', 'ど': 'do',
                'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
                'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
                'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
                'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
                'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
                'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
                'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
                'わ': 'wa', 'ゐ': 'wi', 'ゑ': 'we', 'を': 'wo', 'ん': 'n',
                'っ': 'tsu', 'ー': '',
                
                // Common Kanji mappings
                '太': 'ta', '郎': 'rou', '山': 'yama', '田': 'da', '佐': 'sa', '藤': 'tou',
                '鈴': 'suzu', '木': 'ki', '高': 'taka', '橋': 'hashi', '小': 'ko', '林': 'bayashi',
                '中': 'naka', '村': 'mura', '加': 'ka', '賀': 'ga', '石': 'ishi', '川': 'kawa',
                '松': 'matsu', '本': 'moto', '井': 'i', '上': 'ue', '清': 'sei', '水': 'sui',
                '森': 'mori', '池': 'ike', '橋': 'bashi', '野': 'no', '原': 'hara'
            },

            // Korean Hangul to Latin
            korean: {
                // Basic consonants
                'ㄱ': 'g', 'ㄴ': 'n', 'ㄷ': 'd', 'ㄹ': 'r', 'ㅁ': 'm', 'ㅂ': 'b', 'ㅅ': 's',
                'ㅇ': '', 'ㅈ': 'j', 'ㅊ': 'ch', 'ㅋ': 'k', 'ㅌ': 't', 'ㅍ': 'p', 'ㅎ': 'h',
                
                // Basic vowels
                'ㅏ': 'a', 'ㅑ': 'ya', 'ㅓ': 'eo', 'ㅕ': 'yeo', 'ㅗ': 'o', 'ㅛ': 'yo',
                'ㅜ': 'u', 'ㅠ': 'yu', 'ㅡ': 'eu', 'ㅣ': 'i',
                
                // Complete syllables (most common names)
                '민': 'min', '수': 'su', '김': 'kim', '박': 'park', '이': 'lee', '최': 'choi',
                '정': 'jung', '강': 'kang', '조': 'cho', '윤': 'yoon', '장': 'jang',
                '임': 'lim', '한': 'han', '오': 'oh', '서': 'seo', '신': 'shin',
                '권': 'kwon', '황': 'hwang', '안': 'ahn', '송': 'song', '전': 'jeon',
                '홍': 'hong', '유': 'yu', '고': 'ko', '문': 'moon', '양': 'yang',
                '손': 'son', '배': 'bae', '백': 'baek', '허': 'heo', '남': 'nam'
            },

            // Russian Cyrillic to Latin
            russian: {
                'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
                'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
                'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
                'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
                'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
                'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo',
                'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
                'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
                'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Shch',
                'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
            },

            // Thai to Latin (simplified)
            thai: {
                'ก': 'k', 'ข': 'kh', 'ค': 'kh', 'ง': 'ng', 'จ': 'j', 'ฉ': 'ch', 'ช': 'ch',
                'ซ': 's', 'ฌ': 'ch', 'ญ': 'y', 'ฎ': 'd', 'ฏ': 't', 'ฐ': 'th', 'ฑ': 'th',
                'ฒ': 'th', 'ณ': 'n', 'ด': 'd', 'ต': 't', 'ถ': 'th', 'ท': 'th', 'ธ': 'th',
                'น': 'n', 'บ': 'b', 'ป': 'p', 'ผ': 'ph', 'ฝ': 'f', 'พ': 'ph', 'ฟ': 'f',
                'ภ': 'ph', 'ม': 'm', 'ย': 'y', 'ร': 'r', 'ล': 'l', 'ว': 'w', 'ศ': 's',
                'ษ': 's', 'ส': 's', 'ห': 'h', 'ฬ': 'l', 'อ': '', 'ฮ': 'h',
                'ะ': 'a', 'า': 'a', 'ำ': 'am', 'ิ': 'i', 'ี': 'i', 'ึ': 'ue', 'ื': 'ue',
                'ุ': 'u', 'ู': 'u', 'เ': 'e', 'แ': 'ae', 'โ': 'o', 'ใ': 'ai', 'ไ': 'ai',
                'ๅ': '', '็': '', '่': '', '้': '', '๊': '', '๋': '', '์': ''
            },

            // Chinese Pinyin mappings (simplified)
            chinese: {
                '小': 'xiao', '明': 'ming', '王': 'wang', '李': 'li', '张': 'zhang',
                '刘': 'liu', '陈': 'chen', '杨': 'yang', '赵': 'zhao', '黄': 'huang',
                '周': 'zhou', '吴': 'wu', '徐': 'xu', '孙': 'sun', '胡': 'hu',
                '朱': 'zhu', '高': 'gao', '林': 'lin', '何': 'he', '郭': 'guo',
                '马': 'ma', '罗': 'luo', '梁': 'liang', '宋': 'song', '郑': 'zheng',
                '谢': 'xie', '韩': 'han', '唐': 'tang', '冯': 'feng', '于': 'yu',
                '董': 'dong', '萧': 'xiao', '程': 'cheng', '曹': 'cao', '袁': 'yuan',
                '邓': 'deng', '许': 'xu', '傅': 'fu', '沈': 'shen', '曾': 'zeng',
                '彭': 'peng', '吕': 'lv', '苏': 'su', '卢': 'lu', '蒋': 'jiang',
                '蔡': 'cai', '贾': 'jia', '丁': 'ding', '魏': 'wei', '薛': 'xue',
                '叶': 'ye', '阎': 'yan', '余': 'yu', '潘': 'pan', '杜': 'du',
                '戴': 'dai', '夏': 'xia', '钟': 'zhong', '汪': 'wang', '田': 'tian',
                '任': 'ren', '姜': 'jiang', '范': 'fan', '方': 'fang', '石': 'shi',
                '姚': 'yao', '谭': 'tan', '廖': 'liao', '邹': 'zou', '熊': 'xiong'
            }
        };
    }

    /**
     * Initialize country to script mapping
     */
    initializeCountryScriptMap() {
        return {
            'EG': 'arabic', 'SA': 'arabic', 'AE': 'arabic', 'JO': 'arabic', 'LB': 'arabic',
            'SY': 'arabic', 'IQ': 'arabic', 'KW': 'arabic', 'QA': 'arabic', 'BH': 'arabic',
            'OM': 'arabic', 'YE': 'arabic', 'MA': 'arabic', 'TN': 'arabic', 'DZ': 'arabic',
            
            'JP': 'japanese',
            
            'KR': 'korean', 'KP': 'korean',
            
            'CN': 'chinese', 'TW': 'chinese', 'HK': 'chinese', 'MO': 'chinese', 'SG': 'chinese',
            
            'RU': 'russian', 'BY': 'russian', 'KZ': 'russian', 'KG': 'russian',
            'UZ': 'russian', 'TJ': 'russian', 'MD': 'russian',
            
            'TH': 'thai'
        };
    }

    /**
     * Detect script type from text
     */
    detectScript(text) {
        if (!text) return 'latin';
        
        // Arabic script detection
        if (/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text)) {
            return 'arabic';
        }
        
        // Japanese script detection (Hiragana, Katakana, Kanji)
        if (/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text)) {
            return 'japanese';
        }
        
        // Korean script detection
        if (/[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/.test(text)) {
            return 'korean';
        }
        
        // Chinese script detection
        if (/[\u4E00-\u9FFF\u3400-\u4DBF]/.test(text)) {
            return 'chinese';
        }
        
        // Cyrillic script detection (Russian, etc.)
        if (/[\u0400-\u04FF\u0500-\u052F]/.test(text)) {
            return 'russian';
        }
        
        // Thai script detection
        if (/[\u0E00-\u0E7F]/.test(text)) {
            return 'thai';
        }
        
        return 'latin';
    }

    /**
     * Transliterate text using character mappings
     */
    transliterateText(text, script) {
        if (!text) {
            return text;
        }

        // Handle Latin script with diacritics normalization
        if (script === 'latin') {
            if (this.hasLatinDiacritics(text)) {
                return this.normalizeLatinText(text);
            }
            return text;
        }

        const mapping = this.scriptMappings[script];
        if (!mapping) {
            return this.generalTransliterate(text);
        }

        // Special handling for Arabic - check for name matches (word by word)
        if (script === 'arabic' && mapping.names) {
            const result = this.transliterateArabicWithNameMatching(text, mapping);
            if (result) {
                return result;
            }
        }

        // Use character mapping (for Arabic, use the 'chars' sub-object)
        const charMapping = script === 'arabic' ? mapping.chars : mapping;
        
        let result = '';
        for (let char of text) {
            if (charMapping[char]) {
                result += charMapping[char];
            } else if (char.match(/[a-zA-Z0-9\s\-'.]/) || char.charCodeAt(0) < 128) {
                // Keep Latin characters, numbers, spaces, and common punctuation
                result += char;
            } else {
                // For unknown characters, try general transliteration
                result += this.generalTransliterateChar(char);
            }
        }

        // For Arabic, try to add vowels to make it more readable
        if (script === 'arabic') {
            result = this.enhanceArabicTransliteration(result, text);
        }

        return this.cleanupResult(result);
    }

    /**
     * Check if Latin text contains diacritics/accents
     */
    hasLatinDiacritics(text) {
        if (!text) return false;
        
        // Check for common Latin characters with diacritics
        const diacriticPattern = /[ÀÁÂÃÄÅàáâãäåÇçÈÉÊËèéêëÌÍÎÏìíîïÑñÒÓÔÕÖØòóôõöøÙÚÛÜùúûüÝýÿ]/;
        
        // Also check for Latin base + combining diacritical marks
        const combiningDiacritics = /[\u0300-\u036f]/;
        
        return diacriticPattern.test(text) || combiningDiacritics.test(text);
    }

    /**
     * Normalize Latin text by removing diacritics
     */
    normalizeLatinText(text) {
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
    }

    /**
     * Transliterate Arabic text with word-by-word name matching
     */
    transliterateArabicWithNameMatching(text, mapping) {
        const normalizedText = text.trim();
        
        // First try exact match for the whole string
        if (mapping.names[normalizedText]) {
            return mapping.names[normalizedText];
        }

        // Split by spaces and try to match each word individually
        const words = normalizedText.split(/\s+/).filter(word => word.length > 0);
        if (words.length <= 1) {
            return null; // Single word, no splitting needed
        }

        const transliteratedWords = [];
        let hasAnyMatch = false;

        for (const word of words) {
            const trimmedWord = word.trim();
            if (mapping.names[trimmedWord]) {
                // Found exact match for this word
                transliteratedWords.push(mapping.names[trimmedWord]);
                hasAnyMatch = true;
            } else {
                // No match found, use character mapping for this word
                const charResult = this.transliterateArabicChars(trimmedWord, mapping.chars);
                transliteratedWords.push(charResult);
            }
        }

        // If we found at least one name match, return the combined result
        if (hasAnyMatch) {
            return transliteratedWords.join(' ');
        }

        // No name matches found, return null to use character mapping
        return null;
    }

    /**
     * Transliterate Arabic text using character mapping only
     */
    transliterateArabicChars(text, charMapping) {
        let result = '';
        for (let char of text) {
            if (charMapping[char]) {
                result += charMapping[char];
            } else if (char.match(/[a-zA-Z0-9\s\-'.]/) || char.charCodeAt(0) < 128) {
                result += char;
            } else {
                result += this.generalTransliterateChar(char);
            }
        }
        return this.enhanceArabicTransliteration(result, text);
    }

    /**
     * General character transliteration fallback
     */
    generalTransliterateChar(char) {
        // Basic Unicode normalization and fallback
        try {
            return char.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        } catch (e) {
            return char;
        }
    }

    /**
     * General transliteration for unknown scripts
     */
    generalTransliterate(text) {
        return text.split('').map(char => this.generalTransliterateChar(char)).join('');
    }

    /**
     * Enhance Arabic transliteration by adding vowels and improving readability
     */
    enhanceArabicTransliteration(latinText, originalArabic) {
        if (!latinText) return latinText;

        // Common Arabic name patterns with vowel insertion
        const patterns = [
            // Three consonants - likely CvCvC pattern
            { pattern: /^([bcdfghjklmnpqrstvwxyz])([bcdfghjklmnpqrstvwxyz])([bcdfghjklmnpqrstvwxyz])$/i, 
              replacement: '$1a$2a$3' },
            
            // Four consonants - likely CvCaCiC or CvCaC pattern  
            { pattern: /^([bcdfghjklmnpqrstvwxyz])([bcdfghjklmnpqrstvwxyz])([bcdfghjklmnpqrstvwxyz])([bcdfghjklmnpqrstvwxyz])$/i, 
              replacement: '$1a$2a$3$4' },
            
            // Handle 'mhmd' -> 'mohammed'
            { pattern: /^mhmd$/i, replacement: 'Mohammed' },
            { pattern: /^ly$/i, replacement: 'Ali' },
            { pattern: /^hmd$/i, replacement: 'Ahmed' },
            { pattern: /^hsn$/i, replacement: 'Hassan' },
            { pattern: /^hssn$/i, replacement: 'Hussein' },
            { pattern: /^'mr$/i, replacement: 'Omar' },
            { pattern: /^khld$/i, replacement: 'Khalid' }
        ];

        let enhanced = latinText;
        
        for (const { pattern, replacement } of patterns) {
            if (pattern.test(enhanced)) {
                enhanced = enhanced.replace(pattern, replacement);
                break;
            }
        }

        return enhanced;
    }

    /**
     * Clean up transliteration result
     */
    cleanupResult(text) {
        return text
            .replace(/\s+/g, ' ')           // Multiple spaces to single space
            .replace(/^['\s]+|['\s]+$/g, '') // Trim quotes and spaces
            .replace(/([a-z])([A-Z])/g, '$1$2') // Handle camelCase
            .trim();
    }

    /**
     * Capitalize first letter of each word
     */
    capitalize(text) {
        if (!text) return text;
        return text.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    }

    /**
     * Calculate transliteration accuracy
     */
    calculateAccuracy(originalText, transliteratedText, script) {
        if (!originalText || !transliteratedText) return 0.1;
        
        // Check for Arabic name matches (including word-by-word)
        if (script === 'arabic') {
            const mapping = this.scriptMappings[script];
            if (mapping && mapping.names) {
                const normalizedText = originalText.trim();
                
                // Check for exact full match
                if (mapping.names[normalizedText]) {
                    return 0.98;
                }
                
                // Check for word-by-word matches
                const words = normalizedText.split(/\s+/).filter(word => word.length > 0);
                if (words.length > 1) {
                    let matchedWords = 0;
                    let totalWords = words.length;
                    
                    for (const word of words) {
                        if (mapping.names[word.trim()]) {
                            matchedWords++;
                        }
                    }
                    
                    if (matchedWords > 0) {
                        // Mixed accuracy based on ratio of matched vs unmapped words
                        const matchRatio = matchedWords / totalWords;
                        return Math.min(0.98, 0.95 + (matchRatio * 0.03)); // 95-98% based on match ratio
                    }
                }
            }
        }
        
        // Check for Latin normalization
        if (script === 'latin' && this.hasLatinDiacritics(originalText)) {
            return 0.98; // High accuracy for Latin normalization
        }
        
        // Base accuracy by script quality
        const baseAccuracy = {
            'arabic': 0.95,
            'japanese': 0.90,
            'korean': 0.90,
            'chinese': 0.70,
            'russian': 0.85,
            'thai': 0.65,
            'latin': 0.95
        };

        let accuracy = baseAccuracy[script] || 0.6;

        // Adjust for text length and complexity
        if (originalText.length < 3) accuracy -= 0.1;
        if (originalText.length > 15) accuracy += 0.05;

        return Math.max(0.1, Math.min(0.98, accuracy));
    }

    /**
     * Main transliteration function
     */
    async transliterate(input) {
        try {
            const { firstName, lastName, country } = input;

            // Validate input
            if (!firstName || !lastName || !country) {
                throw new Error('Missing required fields: firstName, lastName, country');
            }

            // Determine script from country or text analysis
            let script = this.countryScriptMap[country];
            if (!script) {
                script = this.detectScript(firstName + ' ' + lastName);
            }

            // Transliterate names
            const transliteratedFirstName = this.capitalize(
                this.transliterateText(firstName.trim(), script)
            );
            const transliteratedLastName = this.capitalize(
                this.transliterateText(lastName.trim(), script)
            );

            // Calculate accuracy
            const firstNameAccuracy = this.calculateAccuracy(firstName, transliteratedFirstName, script);
            const lastNameAccuracy = this.calculateAccuracy(lastName, transliteratedLastName, script);
            const overallAccuracy = (firstNameAccuracy + lastNameAccuracy) / 2;

            // Determine method used for each name
            const firstNameMethod = this.getMethodName(script, country, firstName);
            const lastNameMethod = this.getMethodName(script, country, lastName);
            const method = firstNameMethod; // For overall display

            return {
                firstName: transliteratedFirstName,
                lastName: transliteratedLastName,
                country: country,
                accuracy: Math.round(overallAccuracy * 100) / 100,
                details: {
                    firstNameMethod: firstNameMethod,
                    lastNameMethod: lastNameMethod,
                    firstNameAccuracy: Math.round(firstNameAccuracy * 100) / 100,
                    lastNameAccuracy: Math.round(lastNameAccuracy * 100) / 100,
                    detectedScript: script,
                    serviceInitialized: true,
                    libraryVersion: 'browser-native-1.0.0'
                }
            };

        } catch (error) {
            console.error('Transliteration error:', error);
            
            // Fallback response
            return {
                firstName: input.firstName || '',
                lastName: input.lastName || '',
                country: input.country || '',
                accuracy: 0.1,
                method: 'error_fallback',
                details: {
                    error: error.message,
                    fallbackUsed: true,
                    serviceInitialized: false
                }
            };
        }
    }

    /**
     * Get method name for display
     */
    getMethodName(script, country, originalText = '') {
        // Check if we used Arabic name matching (exact or word-by-word)
        if (script === 'arabic') {
            const mapping = this.scriptMappings[script];
            if (mapping && mapping.names) {
                const normalizedText = originalText.trim();
                
                // Check for exact full match
                if (mapping.names[normalizedText]) {
                    return 'arabic_name_exact_match_browser';
                }
                
                // Check for word-by-word matches
                const words = normalizedText.split(/\s+/).filter(word => word.length > 0);
                if (words.length > 1) {
                    let hasAnyMatch = false;
                    for (const word of words) {
                        if (mapping.names[word.trim()]) {
                            hasAnyMatch = true;
                            break;
                        }
                    }
                    
                    if (hasAnyMatch) {
                        return 'arabic_name_mixed_match_browser';
                    }
                }
            }
            
            // No name matches, using character mapping
            return 'arabic_transliterate_browser';
        }

        // Check for Latin normalization
        if (script === 'latin' && this.hasLatinDiacritics(originalText)) {
            return 'latin_normalization_browser';
        }

        const methodMap = {
            'japanese': 'japanese_romaji_browser',
            'korean': 'korean_romanize_browser',
            'chinese': 'chinese_pinyin_browser',
            'russian': 'cyrillic_latin_browser',
            'thai': 'thai_latin_browser',
            'latin': 'latin_passthrough'
        };

        return methodMap[script] || 'general_transliteration_browser';
    }

    /**
     * Get library info
     */
    getInfo() {
        return {
            name: 'Browser Transliteration Library',
            version: '1.0.0',
            supportedScripts: Object.keys(this.scriptMappings),
            supportedCountries: Object.keys(this.countryScriptMap),
            mode: 'browser-native',
            initialized: true
        };
    }
}

// Export for browser use
if (typeof window !== 'undefined') {
    window.BrowserTransliterationLib = BrowserTransliterationLib;
}

// Export for Node.js use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BrowserTransliterationLib;
} 