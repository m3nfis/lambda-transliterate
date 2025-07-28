# Arabic Names Configuration

This file contains mappings of Arabic names to their accepted Latin transliterations. This ensures culturally accurate transliterations rather than relying on character-by-character conversion.

## How to Add New Names

### 1. **Add to firstName section** (for given names)
```javascript
firstName: {
  // ... existing names ...
  'اسم_جديد': 'New Name',
  'أحمد': 'Ahmed',  // Already exists
  'فاطمة': 'Fatima' // Already exists
}
```

### 2. **Add to lastName section** (for family names)
```javascript
lastName: {
  // ... existing names ...
  'اسم_عائلة_جديد': 'New Family Name',
  'عبدالله': 'Abdullah', // Already exists
  'حسين': 'Hussein'     // Already exists
}
```

### 3. **Add regional variations** (if applicable)
```javascript
variations: {
  // ... existing variations ...
  'اسم_جديد': 'New Name', // Also: Alternative spelling
}
```

## Guidelines for Adding Names

### ✅ **Do:**
- Use **IJMES transliteration standards** when possible
- Follow **common English usage** for well-known names
- Consider **regional variations** (Egyptian vs Gulf vs Levant)
- Use **proper capitalization** (first letter capitalized)
- Add **comments** for regional variations

### ❌ **Don't:**
- Use **character-by-character** transliteration
- Ignore **cultural context** and common usage
- Use **inconsistent** capitalization
- Add **duplicate entries** without checking

## Examples

### ✅ **Good Examples:**
```javascript
'محمد': 'Mohammed',     // Most common spelling
'أحمد': 'Ahmed',        // Common English usage
'عبدالله': 'Abdullah',  // Standard transliteration
'فاطمة': 'Fatima',      // Well-established name
```

### ❌ **Avoid:**
```javascript
'محمد': 'Muhammad',     // Less common in English
'أحمد': 'Ahmad',        // Less common than 'Ahmed'
'عبدالله': 'Abdallah',  // Less standard than 'Abdullah'
```

## Regional Considerations

### **Egyptian Names:**
- Often use softer consonants
- Example: `جمال` → `Gamal` (not `Jamal`)

### **Gulf Names:**
- Often preserve more Arabic sounds
- Example: `عبدالله` → `Abdullah` (not `Abdallah`)

### **Levant Names:**
- May have different vowel patterns
- Example: `حسين` → `Hussein` (not `Husayn`)

## Testing New Names

After adding names, test them:

```bash
# Test server-side
npm test

# Test browser-side
# Open demo-app/index.html and test with Arabic names
```

## Sources

- **IJMES transliteration standards**
- **Common English usage** in media and literature
- **Regional variations** from different Arabic-speaking countries
- **Academic transliteration** guidelines

## Current Statistics

- **Total names**: 60+ (first names + last names)
- **Regions covered**: 16 Arabic-speaking countries
- **Last updated**: 2025-01-27
- **Version**: 1.0.0

## Contributing

When adding new names:
1. **Check existing entries** to avoid duplicates
2. **Follow the established patterns**
3. **Test with the transliteration service**
4. **Update this README** if adding new patterns
5. **Consider regional variations** and add to variations section if needed 