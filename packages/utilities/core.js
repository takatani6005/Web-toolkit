
function isValidCodePoint(codePoint) {
  // Check if it's a valid Unicode code point
  if (codePoint < 0 || codePoint > 0x10FFFF) {
    return false;
  }
  
  // Exclude surrogate pairs range (they're handled by String.fromCodePoint)
  if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
    return false;
  }
  
  // Exclude non-characters
  if ((codePoint >= 0xFDD0 && codePoint <= 0xFDEF) ||
      (codePoint & 0xFFFF) === 0xFFFE ||
      (codePoint & 0xFFFF) === 0xFFFF) {
    return false;
  }
  
  return true;
}

function toSafeDisplay(str, maxLength = 50) {
  if (typeof str !== 'string') return String(str);
  let result = '';
  for (const char of str) {
    const code = char.codePointAt(0);
    if (code < 32 || code === 127) {
      result += `\\u{${code.toString(16).toUpperCase()}}`;
    } else if (code > 127) {
      result += char;
    } else {
      result += char;
    }
  }
  return result.length > maxLength ? result.slice(0, maxLength) + '…' : result;
}

function safeSubstring(str, start, length) {
  const chars = Array.from(str);
  const safeStart = Math.max(0, Math.min(start, chars.length));
  const safeEnd = length !== undefined ?
    Math.min(safeStart + length, chars.length) :
    chars.length;
  return chars.slice(safeStart, safeEnd).join('');
}

function getUtf8ByteLength(str) {
  return new TextEncoder().encode(str).length;
}

function truncateByBytes(str, maxBytes) {
  const encoder = new TextEncoder();
  let bytes = 0;
  let truncated = '';
  for (const char of str) {
    const charBytes = encoder.encode(char).length;
    if (bytes + charBytes > maxBytes) break;
    bytes += charBytes;
    truncated += char;
  }
  return truncated;
}

function isValidUtf8(bytes) {
  try {
    new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    return true;
  } catch {
    return false;
  }
}

// New expanded functions

/**
 * Validates if a string is a valid JavaScript identifier
 */
function isValidIdentifier(str) {
  if (typeof str !== 'string' || str.length === 0) return false;
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(str);
}

/**
 * Safely converts string to number with validation
 */
function toSafeNumber(str, options = {}) {
  const { 
    allowFloat = true, 
    allowNegative = true, 
    min = Number.NEGATIVE_INFINITY, 
    max = Number.POSITIVE_INFINITY,
    defaultValue = null
  } = options;

  if (typeof str !== 'string') return defaultValue;
  
  const trimmed = str.trim();
  if (trimmed === '') return defaultValue;

  const num = allowFloat ? parseFloat(trimmed) : parseInt(trimmed, 10);
  
  if (isNaN(num)) return defaultValue;
  if (!allowNegative && num < 0) return defaultValue;
  if (num < min || num > max) return defaultValue;
  
  return num;
}

/**
 * Get display width accounting for wide characters (CJK, emojis)
 */
function getDisplayWidth(str) {
  if (typeof str !== 'string') return 0;
  
  let width = 0;
  for (const char of str) {
    const code = char.codePointAt(0);
    
    // Control characters have no width
    if (code < 32 || (code >= 0x7F && code < 0xA0)) {
      continue;
    }
    
    // Wide characters (CJK, fullwidth)
    if (
      (code >= 0x1100 && code <= 0x115F) || // Hangul Jamo
      (code >= 0x2E80 && code <= 0x2EFF) || // CJK Radicals Supplement
      (code >= 0x2F00 && code <= 0x2FDF) || // Kangxi Radicals
      (code >= 0x3000 && code <= 0x303F) || // CJK Symbols and Punctuation
      (code >= 0x3040 && code <= 0x309F) || // Hiragana
      (code >= 0x30A0 && code <= 0x30FF) || // Katakana
      (code >= 0x3100 && code <= 0x312F) || // Bopomofo
      (code >= 0x3130 && code <= 0x318F) || // Hangul Compatibility Jamo
      (code >= 0x3190 && code <= 0x319F) || // Kanbun
      (code >= 0x31A0 && code <= 0x31BF) || // Bopomofo Extended
      (code >= 0x31C0 && code <= 0x31EF) || // CJK Strokes
      (code >= 0x31F0 && code <= 0x31FF) || // Katakana Phonetic Extensions
      (code >= 0x3200 && code <= 0x32FF) || // Enclosed CJK Letters and Months
      (code >= 0x3300 && code <= 0x33FF) || // CJK Compatibility
      (code >= 0x3400 && code <= 0x4DBF) || // CJK Extension A
      (code >= 0x4E00 && code <= 0x9FFF) || // CJK Unified Ideographs
      (code >= 0xA000 && code <= 0xA48F) || // Yi Syllables
      (code >= 0xA490 && code <= 0xA4CF) || // Yi Radicals
      (code >= 0xAC00 && code <= 0xD7AF) || // Hangul Syllables
      (code >= 0xF900 && code <= 0xFAFF) || // CJK Compatibility Ideographs
      (code >= 0xFE10 && code <= 0xFE1F) || // Vertical forms
      (code >= 0xFE30 && code <= 0xFE4F) || // CJK Compatibility Forms
      (code >= 0xFE50 && code <= 0xFE6F) || // Small Form Variants
      (code >= 0xFF00 && code <= 0xFFEF) || // Halfwidth and Fullwidth Forms
      (code >= 0x20000 && code <= 0x2A6DF) || // CJK Extension B
      (code >= 0x2A700 && code <= 0x2B73F) || // CJK Extension C
      (code >= 0x2B740 && code <= 0x2B81F) || // CJK Extension D
      (code >= 0x2B820 && code <= 0x2CEAF) || // CJK Extension E
      (code >= 0x2CEB0 && code <= 0x2EBEF) || // CJK Extension F
      (code >= 0x1F000 && code <= 0x1F9FF)    // Emojis and symbols
    ) {
      width += 2;
    } else {
      width += 1;
    }
  }
  
  return width;
}

/**
 * Pad string to display width (accounting for wide characters)
 */
function padToDisplayWidth(str, width, padString = ' ', align = 'left') {
  const currentWidth = getDisplayWidth(str);
  const padWidth = Math.max(0, width - currentWidth);
  const padding = padString.repeat(Math.ceil(padWidth / getDisplayWidth(padString)));
  
  switch (align) {
    case 'right':
      return padding + str;
    case 'center':
      const leftPad = padding.slice(0, Math.floor(padding.length / 2));
      const rightPad = padding.slice(Math.floor(padding.length / 2));
      return leftPad + str + rightPad;
    default:
      return str + padding;
  }
}

/**
 * Clamp a value between min and max
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Check if string contains only whitespace (including Unicode whitespace)
 */
function isWhitespaceOnly(str) {
  if (typeof str !== 'string') return false;
  return /^\s*$/.test(str);
}

/**
 * Normalize whitespace in string
 */
function normalizeWhitespace(str, options = {}) {
  const {
    collapseSpaces = true,
    trimEnds = true,
    normalizeLineBreaks = true,
    preserveLineBreaks = false
  } = options;
  
  if (typeof str !== 'string') return '';
  
  let result = str;
  
  // Normalize line breaks to \n
  if (normalizeLineBreaks) {
    result = result.replace(/\r\n|\r/g, '\n');
  }
  
  // Collapse multiple spaces/tabs
  if (collapseSpaces) {
    if (preserveLineBreaks) {
      result = result.replace(/[ \t]+/g, ' ');
    } else {
      result = result.replace(/\s+/g, ' ');
    }
  }
  
  // Trim ends
  if (trimEnds) {
    result = result.trim();
  }
  
  return result;
}

/**
 * Split string by separator but respect quoted sections
 */
function smartSplit(str, separator = ',', quote = '"', escape = '\\') {
  if (typeof str !== 'string') return [];
  
  const result = [];
  let current = '';
  let inQuote = false;
  let i = 0;
  
  while (i < str.length) {
    const char = str[i];
    
    if (char === escape && i + 1 < str.length) {
      // Handle escape sequences
      current += str[i + 1];
      i += 2;
      continue;
    }
    
    if (char === quote) {
      inQuote = !inQuote;
      current += char;
    } else if (char === separator && !inQuote) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
    
    i++;
  }
  
  if (current || result.length === 0) {
    result.push(current.trim());
  }
  
  return result;
}

/**
 * Remove diacritics/accents from string
 */
function removeDiacritics(str) {
  if (typeof str !== 'string') return '';
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Capitalize first letter of each word
 */
function titleCase(str, options = {}) {
  const { preserveCase = false, exceptions = [] } = options;
  
  if (typeof str !== 'string') return '';
  
  return str.replace(/\w\S*/g, (word, index) => {
    const lowerWord = word.toLowerCase();
    
    // Don't capitalize exceptions (unless it's the first word)
    if (index > 0 && exceptions.includes(lowerWord)) {
      return lowerWord;
    }
    
    if (preserveCase && word !== word.toLowerCase()) {
      return word;
    }
    
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
}

/**
 * Convert string to camelCase
 */
function toCamelCase(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
      index === 0 ? word.toLowerCase() : word.toUpperCase())
    .replace(/\s+/g, '');
}

/**
 * Convert string to snake_case
 */
function toSnakeCase(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/\W+/g, ' ')
    .split(/ |\B(?=[A-Z])/)
    .map(word => word.toLowerCase())
    .join('_');
}

/**
 * Convert string to kebab-case
 */
function toKebabCase(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/\W+/g, ' ')
    .split(/ |\B(?=[A-Z])/)
    .map(word => word.toLowerCase())
    .join('-');
}

/**
 * Reverse string while preserving grapheme clusters
 */
function reverseString(str) {
  if (typeof str !== 'string') return '';
  return Array.from(str).reverse().join('');
}

/**
 * Count occurrences of substring in string
 */
function countSubstring(str, substring, options = {}) {
  const { caseSensitive = true, overlap = false } = options;
  
  if (typeof str !== 'string' || typeof substring !== 'string') return 0;
  if (substring.length === 0) return 0;
  
  const searchStr = caseSensitive ? str : str.toLowerCase();
  const searchSub = caseSensitive ? substring : substring.toLowerCase();
  
  let count = 0;
  let index = 0;
  
  while ((index = searchStr.indexOf(searchSub, index)) !== -1) {
    count++;
    index += overlap ? 1 : searchSub.length;
  }
  
  return count;
}

/**
 * Insert string at specific position
 */
function insertAt(str, index, insertion) {
  if (typeof str !== 'string' || typeof insertion !== 'string') return str;
  const chars = Array.from(str);
  const safeIndex = clamp(index, 0, chars.length);
  return chars.slice(0, safeIndex).join('') + insertion + chars.slice(safeIndex).join('');
}

/**
 * Remove characters at specific range
 */
function removeRange(str, start, length = 1) {
  if (typeof str !== 'string') return str;
  const chars = Array.from(str);
  const safeStart = clamp(start, 0, chars.length);
  const safeEnd = clamp(safeStart + length, 0, chars.length);
  return chars.slice(0, safeStart).concat(chars.slice(safeEnd)).join('');
}

/**
 * Generate hash code for string (simple djb2 algorithm)
 */
function hashCode(str) {
  if (typeof str !== 'string') return 0;
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash;
}

/**
 * Check if string is palindrome
 */
function isPalindrome(str, options = {}) {
  const { caseSensitive = false, ignoreSpaces = true, ignorePunctuation = true } = options;
  
  if (typeof str !== 'string') return false;
  
  let processed = str;
  
  if (!caseSensitive) {
    processed = processed.toLowerCase();
  }
  
  if (ignoreSpaces) {
    processed = processed.replace(/\s/g, '');
  }
  
  if (ignorePunctuation) {
    processed = processed.replace(/[^\w\s]/g, '');
  }
  
  return processed === reverseString(processed);
}

export {
  isValidCodePoint,
  toSafeDisplay,
  safeSubstring,
  getUtf8ByteLength,
  truncateByBytes,
  isValidUtf8,

  isValidIdentifier,
  toSafeNumber,
  getDisplayWidth,
  padToDisplayWidth,
  clamp,
  isWhitespaceOnly,
  normalizeWhitespace,
  smartSplit,
  removeDiacritics,
  titleCase,
  toCamelCase,
  toSnakeCase,
  toKebabCase,
  reverseString,
  countSubstring,
  insertAt,
  removeRange,
  hashCode,
  isPalindrome
};