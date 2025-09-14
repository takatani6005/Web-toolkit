/**
 * Legacy Generation utilities
 * Provides backward compatibility functions and additional string generation utilities
 */

/**
 * Generate URL-friendly slug from text
 * @param {string} text - Text to convert to slug
 * @param {Object} [options={}] - Configuration options
 * @param {string} [options.separator='-'] - Character to separate words
 * @param {boolean} [options.lowercase=true] - Convert to lowercase
 * @param {boolean} [options.removeAccents=true] - Remove accent characters
 * @param {number} [options.maxLength=50] - Maximum length of slug
 * @param {boolean} [options.allowUnicode=false] - Allow Unicode characters
 * @returns {string} Generated slug
 */
export function toSlug(text, options = {}) {
  const {
    separator = '-',
    lowercase = true,
    removeAccents = true,
    maxLength = 50,
    allowUnicode = false
  } = options;

  if (typeof text !== 'string') {
    throw new Error('Input must be a string');
  }

  let slug = text.trim();

  if (removeAccents) {
    // Remove accents and diacritics
    slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  if (lowercase) {
    slug = slug.toLowerCase();
  }

  if (!allowUnicode) {
    // Remove non-ASCII characters
    slug = slug.replace(/[^\x00-\x7F]/g, '');
  }

  // Replace spaces and special characters with separator
  slug = slug
    .replace(/[^\w\s-]/g, '') // Remove special characters except word chars, spaces, and hyphens
    .replace(/[\s_-]+/g, separator) // Replace spaces, underscores, and hyphens with separator
    .replace(new RegExp(`^${separator}+|${separator}+$`, 'g'), ''); // Trim separators from ends

  // Limit length
  if (maxLength && slug.length > maxLength) {
    slug = slug.substring(0, maxLength);
    // Ensure we don't cut in the middle of a word
    const lastSeparator = slug.lastIndexOf(separator);
    if (lastSeparator > maxLength * 0.8) {
      slug = slug.substring(0, lastSeparator);
    }
  }

  return slug || 'untitled';
}

/**
 * Convert string to Base64
 * @param {string} str - String to encode
 * @param {Object} [options={}] - Encoding options
 * @param {boolean} [options.urlSafe=false] - Use URL-safe encoding
 * @param {boolean} [options.removePadding=false] - Remove padding characters
 * @returns {string} Base64 encoded string
 */
export function toBase64(str, options = {}) {
  const { urlSafe = false, removePadding = false } = options;

  if (typeof str !== 'string') {
    throw new Error('Input must be a string');
  }

  let encoded;

  if (typeof btoa !== 'undefined') {
    // Browser environment
    encoded = btoa(unescape(encodeURIComponent(str)));
  } else if (typeof Buffer !== 'undefined') {
    // Node.js environment
    encoded = Buffer.from(str, 'utf8').toString('base64');
  } else {
    // Manual Base64 encoding fallback
    encoded = manualBase64Encode(str);
  }

  if (urlSafe) {
    encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_');
  }

  if (removePadding) {
    encoded = encoded.replace(/=+$/, '');
  }

  return encoded;
}

/**
 * Convert Base64 string back to original string
 * @param {string} base64 - Base64 string to decode
 * @param {Object} [options={}] - Decoding options
 * @param {boolean} [options.urlSafe=false] - Input is URL-safe encoded
 * @returns {string} Decoded string
 */
export function fromBase64(base64, options = {}) {
  const { urlSafe = false } = options;

  if (typeof base64 !== 'string') {
    throw new Error('Input must be a string');
  }

  let encoded = base64;

  if (urlSafe) {
    encoded = encoded.replace(/-/g, '+').replace(/_/g, '/');
  }

  // Add padding if missing
  while (encoded.length % 4) {
    encoded += '=';
  }

  let decoded;

  try {
    if (typeof atob !== 'undefined') {
      // Browser environment
      decoded = decodeURIComponent(escape(atob(encoded)));
    } else if (typeof Buffer !== 'undefined') {
      // Node.js environment
      decoded = Buffer.from(encoded, 'base64').toString('utf8');
    } else {
      // Manual Base64 decoding fallback
      decoded = manualBase64Decode(encoded);
    }
  } catch (err) {
    throw new Error('Invalid Base64 string');
  }

  return decoded;
}

/**
 * Generate random Unicode characters
 * @param {Object} [options={}] - Generation options
 * @param {number} [options.length=10] - Number of characters to generate
 * @param {string} [options.range='basic'] - Unicode range ('basic', 'extended', 'emoji', 'custom')
 * @param {number[]} [options.customRange] - Custom Unicode range [start, end]
 * @param {boolean} [options.excludeControl=true] - Exclude control characters
 * @returns {string} Generated Unicode string
 */
export function generateRandomUnicode(options = {}) {
  const {
    length = 10,
    range = 'basic',
    customRange,
    excludeControl = true
  } = options;

  if (typeof length !== 'number' || length < 0) {
    throw new Error('Length must be a non-negative number');
  }

  const ranges = {
    basic: [0x0020, 0x007E], // Basic Latin
    extended: [0x0020, 0x024F], // Latin Extended
    emoji: [0x1F600, 0x1F64F], // Emoticons
    symbols: [0x2600, 0x26FF], // Miscellaneous Symbols
    cjk: [0x4E00, 0x9FFF], // CJK Unified Ideographs
    arabic: [0x0600, 0x06FF], // Arabic
    cyrillic: [0x0400, 0x04FF] // Cyrillic
  };

  const [start, end] = customRange || ranges[range] || ranges.basic;

  let result = '';
  const maxAttempts = length * 10; // Prevent infinite loops
  let attempts = 0;

  while (result.length < length && attempts < maxAttempts) {
    const codePoint = Math.floor(Math.random() * (end - start + 1)) + start;
    
    // Skip control characters if requested
    if (excludeControl && (codePoint < 0x20 || (codePoint >= 0x7F && codePoint < 0xA0))) {
      attempts++;
      continue;
    }

    // Skip surrogates
    if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
      attempts++;
      continue;
    }

    try {
      const char = String.fromCodePoint(codePoint);
      result += char;
    } catch (err) {
      // Invalid code point, skip
      attempts++;
      continue;
    }

    attempts++;
  }

  return result;
}

/**
 * Generate random string with specific character frequencies
 * @param {Object} options - Generation options
 * @param {number} [options.length=20] - Length of string
 * @param {Object} [options.frequencies] - Character frequency weights
 * @returns {string} Generated string with weighted characters
 */
export function generateWeightedString(options = {}) {
  const {
    length = 20,
    frequencies = {
      'a': 8.12, 'b': 1.49, 'c': 2.78, 'd': 4.25, 'e': 12.02,
      'f': 2.23, 'g': 2.02, 'h': 6.09, 'i': 6.97, 'j': 0.15,
      'k': 0.77, 'l': 4.03, 'm': 2.41, 'n': 6.75, 'o': 7.51,
      'p': 1.93, 'q': 0.10, 'r': 5.99, 's': 6.33, 't': 9.06,
      'u': 2.76, 'v': 0.98, 'w': 2.36, 'x': 0.15, 'y': 1.97, 'z': 0.07
    }
  } = options;

  // Create weighted array
  const weightedChars = [];
  for (const [char, weight] of Object.entries(frequencies)) {
    const count = Math.max(1, Math.round(weight));
    for (let i = 0; i < count; i++) {
      weightedChars.push(char);
    }
  }

  if (weightedChars.length === 0) {
    throw new Error('No characters available for generation');
  }

  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * weightedChars.length);
    result += weightedChars[randomIndex];
  }

  return result;
}

/**
 * Generate string following a specific pattern
 * @param {string} pattern - Pattern string with placeholders
 * @param {Object} [options={}] - Pattern options
 * @returns {string} Generated string following the pattern
 * 
 * Pattern syntax:
 * - # = random digit (0-9)
 * - @ = random letter (a-z, A-Z)
 * - ? = random alphanumeric
 * - * = random character from custom set
 */
export function generatePatternString(pattern, options = {}) {
  const { customChars = '!@#$%^&*()' } = options;

  if (typeof pattern !== 'string') {
    throw new Error('Pattern must be a string');
  }

  const generators = {
    '#': () => Math.floor(Math.random() * 10).toString(),
    '@': () => {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      return letters[Math.floor(Math.random() * letters.length)];
    },
    '?': () => {
      const alphanum = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      return alphanum[Math.floor(Math.random() * alphanum.length)];
    },
    '*': () => customChars[Math.floor(Math.random() * customChars.length)]
  };

  return pattern.replace(/[#@?*]/g, (match) => {
    const generator = generators[match];
    return generator ? generator() : match;
  });
}

/**
 * Manual Base64 encoding (fallback)
 * @private
 */
function manualBase64Encode(str) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = '';
  let i = 0;

  while (i < str.length) {
    const a = str.charCodeAt(i++);
    const b = i < str.length ? str.charCodeAt(i++) : 0;
    const c = i < str.length ? str.charCodeAt(i++) : 0;

    const bitmap = (a << 16) | (b << 8) | c;

    result += chars.charAt((bitmap >> 18) & 63);
    result += chars.charAt((bitmap >> 12) & 63);
    result += i - 2 < str.length ? chars.charAt((bitmap >> 6) & 63) : '=';
    result += i - 1 < str.length ? chars.charAt(bitmap & 63) : '=';
  }

  return result;
}

/**
 * Manual Base64 decoding (fallback)
 * @private
 */
function manualBase64Decode(base64) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = '';
  let i = 0;

  // Remove non-base64 characters
  const cleaned = base64.replace(/[^A-Za-z0-9+/]/g, '');

  while (i < cleaned.length) {
    const encoded1 = chars.indexOf(cleaned.charAt(i++));
    const encoded2 = chars.indexOf(cleaned.charAt(i++));
    const encoded3 = chars.indexOf(cleaned.charAt(i++));
    const encoded4 = chars.indexOf(cleaned.charAt(i++));

    const bitmap = (encoded1 << 18) | (encoded2 << 12) | (encoded3 << 6) | encoded4;

    result += String.fromCharCode((bitmap >> 16) & 255);
    if (encoded3 !== 64) result += String.fromCharCode((bitmap >> 8) & 255);
    if (encoded4 !== 64) result += String.fromCharCode(bitmap & 255);
  }

  return result;
}

/**
 * Generate Lorem Ipsum text with specific word count
 * @param {number} wordCount - Number of words to generate
 * @param {Object} [options={}] - Generation options
 * @param {boolean} [options.startWithLorem=true] - Start with "Lorem ipsum"
 * @param {boolean} [options.addPunctuation=true] - Add sentence punctuation
 * @returns {string} Generated Lorem Ipsum text
 */
export function generateLoremIpsum(wordCount, options = {}) {
  const { startWithLorem = true, addPunctuation = true } = options;

  const words = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo'
  ];

  const result = [];
  let startIndex = 0;

  if (startWithLorem && wordCount >= 2) {
    result.push('Lorem', 'ipsum');
    startIndex = 2;
  }

  for (let i = startIndex; i < wordCount; i++) {
    result.push(words[Math.floor(Math.random() * words.length)]);
  }

  let text = result.join(' ');

  if (addPunctuation && text) {
    // Capitalize first letter
    text = text.charAt(0).toUpperCase() + text.slice(1);
    
    // Add periods at reasonable intervals
    const sentences = Math.ceil(wordCount / 12);
    if (sentences > 1) {
      const wordsArray = text.split(' ');
      const sentenceLength = Math.floor(wordsArray.length / sentences);
      
      for (let i = sentenceLength - 1; i < wordsArray.length - 1; i += sentenceLength) {
        if (wordsArray[i]) {
          wordsArray[i] += '.';
          if (wordsArray[i + 1]) {
            wordsArray[i + 1] = wordsArray[i + 1].charAt(0).toUpperCase() + wordsArray[i + 1].slice(1);
          }
        }
      }
      
      text = wordsArray.join(' ');
    }
    
    // Ensure text ends with period
    if (!text.endsWith('.')) {
      text += '.';
    }
  }

  return text;
}