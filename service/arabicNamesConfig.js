/**
 * Arabic Names Configuration
 * 
 * This file contains comprehensive mappings of Arabic names to their 
 * accepted Latin transliterations. This allows for precise, culturally 
 * accurate transliterations rather than relying on character-by-character 
 * conversion.
 * 
 * To add new names:
 * 1. Add the Arabic name as the key
 * 2. Add the accepted Latin transliteration as the value
 * 3. Follow the existing capitalization patterns
 * 4. Consider regional variations if applicable
 * 
 * Sources: IJMES transliteration standards, common usage in English
 */

const arabicNamesConfig = {
  // Most common Arabic names (first names)
  firstName: {
    // Male names
    'محمد': 'Mohammed',
    'أحمد': 'Ahmed', 
    'علي': 'Ali',
    'عمر': 'Omar',
    'يوسف': 'Youssef',
    'خالد': 'Khalid',
    'عبدالله': 'Abdullah',
    'حسين': 'Hussein',
    'مصطفى': 'Mostafa',
    'جمال': 'Gamal',
    'رضوان': 'Radwan',
    'صلاح': 'Salah',
    'شريف': 'Sherif',
    'كريم': 'Karim',
    'وليد': 'Walid',
    'أمير': 'Amir',
    'بلال': 'Bilal',
    'فارس': 'Faris',
    'نادر': 'Nader',
    'سامي': 'Sami',
    'زياد': 'Ziad',
    'هشام': 'Hisham',
    'باسم': 'Basem',
    'ماجد': 'Majid',
    'سلمان': 'Salman',
    'فهد': 'Fahd',
    'تركي': 'Turki',
    'بندر': 'Bandar',
    'طارق': 'Tariq',
    'حسن': 'Hassan',
    'عثمان': 'Othman',
    'سعيد': 'Saeed',
    'محمود': 'Mahmoud',
    'إبراهيم': 'Ibrahim',
    'عبدالرحمن': 'Abdulrahman',
    'عبد الرحمن': 'Abdul Rahman',
    'عبد': 'Abdul',

    // Female names
    'فاطمة': 'Fatima',
    'عائشة': 'Aisha',
    'زينب': 'Zainab',
    'نور': 'Nour',
    'سارة': 'Sarah',
    'هبة': 'Heba',
    'آية': 'Aya',
    'إيمان': 'Iman',
    'لمى': 'Lama',
    'مريم': 'Mariam',
    'ليلى': 'Layla',
    'هنا': 'Hana',
    'ريم': 'Reem',
    'دينا': 'Dina',
    'ياسمين': 'Yasmin',
    'منى': 'Mona',
    'ندى': 'Nada',
    'رانيا': 'Rania',
    'هدى': 'Huda',
    'سمر': 'Samar',
    'أسماء': 'Asma',
    'داليا': 'Dalia',
    'جميلة': 'Jamila',
    'غادة': 'Ghada',
    'حنان': 'Hanan'
  },

  // Most common Arabic names (last names)
  lastName: {
    // Common family names
    'عبدالله': 'Abdullah',
    'عبد الرحمن': 'Abdul Rahman',
    'عبدالرحمن': 'Abdulrahman',
    'عبد': 'Abdul',
    'علي': 'Ali',
    'حسين': 'Hussein',
    'حسن': 'Hassan',
    'محمد': 'Mohammed',
    'أحمد': 'Ahmed',
    'عمر': 'Omar',
    'يوسف': 'Youssef',
    'خالد': 'Khalid',
    'مصطفى': 'Mostafa',
    'جمال': 'Gamal',
    'رضوان': 'Radwan',
    'صلاح': 'Salah',
    'شريف': 'Sherif',
    'كريم': 'Karim',
    'وليد': 'Walid',
    'أمير': 'Amir',
    'بلال': 'Bilal',
    'فارس': 'Faris',
    'نادر': 'Nader',
    'سامي': 'Sami',
    'زياد': 'Ziad',
    'هشام': 'Hisham',
    'باسم': 'Basem',
    'ماجد': 'Majid',
    'سلمان': 'Salman',
    'فهد': 'Fahd',
    'تركي': 'Turki',
    'بندر': 'Bandar',
    'طارق': 'Tariq',
    'عثمان': 'Othman',
    'سعيد': 'Saeed',
    'محمود': 'Mahmoud',
    'إبراهيم': 'Ibrahim',
    'عبدالرحمن': 'Abdulrahman',
    'عبد الرحمن': 'Abdul Rahman',
    'عبد': 'Abdul'
  },

  // Common Arabic name patterns and combinations
  patterns: {
    // Compound names (first + last combinations)
    'عبد الرحمن': 'Abdul Rahman',
    'عبدالرحمن': 'Abdulrahman',
    'عبد الله': 'Abdullah',
    'عبدالله': 'Abdullah',
    
    // Common prefixes
    'عبد': 'Abdul',
    'أبو': 'Abu',
    'ابن': 'Ibn',
    'بن': 'Bin',
    
    // Common suffixes
    'الدين': 'al-Din',
    'الله': 'Allah',
    'الرحمن': 'al-Rahman',
    'الرحيم': 'al-Rahim'
  },

  // Regional variations and alternative spellings
  variations: {
    // Egyptian variations
    'جمال': 'Gamal', // Also: Jamal
    'أحمد': 'Ahmed', // Also: Ahmad
    
    // Gulf variations  
    'عبدالله': 'Abdullah', // Also: Abdallah
    'عبد الرحمن': 'Abdul Rahman', // Also: Abdulrahman
    
    // Levant variations
    'حسين': 'Hussein', // Also: Husayn
    'علي': 'Ali', // Also: Aly
    
    // North African variations
    'عمر': 'Omar', // Also: Umar
    'يوسف': 'Youssef' // Also: Yusuf
  },

  // Metadata for the configuration
  metadata: {
    version: '1.0.0',
    lastUpdated: '2025-01-27',
    description: 'Arabic names transliteration configuration',
    sources: [
      'IJMES transliteration standards',
      'Common English usage',
      'Regional variations'
    ],
    totalNames: 0, // Will be calculated dynamically
    regions: [
      'Egypt',
      'Saudi Arabia', 
      'UAE',
      'Jordan',
      'Lebanon',
      'Syria',
      'Iraq',
      'Kuwait',
      'Qatar',
      'Bahrain',
      'Oman',
      'Yemen',
      'Morocco',
      'Algeria',
      'Tunisia',
      'Libya'
    ]
  }
};

// Calculate total names for metadata
arabicNamesConfig.metadata.totalNames = 
  Object.keys(arabicNamesConfig.firstName).length + 
  Object.keys(arabicNamesConfig.lastName).length;

module.exports = arabicNamesConfig; 