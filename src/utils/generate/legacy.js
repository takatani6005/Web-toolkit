/**
 * Legacy Generation utilities - Updated to match test expectations
 * Provides backward compatibility functions and additional string generation utilities
 */

/**
 * Convert string to Base64
 * @param {string} str - String to encode
 * @param {Object} [options={}] - Encoding options
 * @param {boolean} [options.urlSafe=false] - Use URL-safe encoding
 * @param {boolean} [options.removePadding=false] - Remove padding characters
 * @returns {string} Base64 encoded string
 */
function toBase64(str, options = {}) {
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
function fromBase64(base64, options = {}) {
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
 * Generate random string with specific character weights/frequencies
 * UPDATED: Now accepts (length, weights) parameters to match tests
 * @param {number} length - Length of string to generate
 * @param {Object} [weights] - Character weight mapping
 * @returns {string} Generated string with weighted characters
 */
function generateWeightedString(length, weights) {
  // Handle zero or negative length
  if (length <= 0) {
    return '';
  }

  // Default character set with simple weights (matches test expectations)
  const defaultWeights = {
    'a': 8, 'b': 2, 'c': 3, 'd': 4, 'e': 12, 'f': 2, 'g': 2, 'h': 6,
    'i': 7, 'j': 1, 'k': 1, 'l': 4, 'm': 2, 'n': 7, 'o': 8, 'p': 2,
    'q': 1, 'r': 6, 's': 6, 't': 9, 'u': 3, 'v': 1, 'w': 2, 'x': 1,
    'y': 2, 'z': 1,
    // Add numbers to default set (as expected by tests)
    '0': 1, '1': 1, '2': 1, '3': 1, '4': 1, '5': 1, '6': 1, '7': 1, '8': 1, '9': 1
  };

  const frequencies = weights || defaultWeights;

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
 * UPDATED: Now accepts (pattern, generators) parameters to match tests
 * @param {string} pattern - Pattern string with placeholders
 * @param {Object} [generators={}] - Custom generator functions for placeholders
 * @returns {string} Generated string following the pattern
 */
function generatePatternString(pattern, generators = {}) {
  if (typeof pattern !== 'string') {
    throw new Error('Pattern must be a string');
  }

  // Default built-in generators (still available)
  const builtInGenerators = {
    '#': () => Math.floor(Math.random() * 10).toString(),
    '@': () => {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      return letters[Math.floor(Math.random() * letters.length)];
    },
    '?': () => {
      const alphanum = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      return alphanum[Math.floor(Math.random() * alphanum.length)];
    },
    '*': () => {
      const customChars = '!@#$%^&*()';
      return customChars[Math.floor(Math.random() * customChars.length)];
    }
  };

  // Merge custom generators with built-in ones (custom takes precedence)
  const allGenerators = { ...builtInGenerators, ...generators };

  // Replace any character that has a generator
  return pattern.replace(/./g, (char) => {
    const generator = allGenerators[char];
    return generator ? generator() : char;
  });
}

/**
 * Generate Lorem Ipsum text with specific word count
 * @param {number} wordCount - Number of words to generate
 * @param {Object} [options={}] - Generation options
 * @param {boolean} [options.startWithLorem=true] - Start with "Lorem ipsum"
 * @param {boolean} [options.addPunctuation=true] - Add sentence punctuation
 * @returns {string} Generated Lorem Ipsum text
 */
function generateLoremIpsum(wordCount, options = {}) {
  const { startWithLorem = true, addPunctuation = true } = options;

  // Handle edge cases
  if (wordCount <= 0) {
    return '';
  }

  const words = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate', 'velit',
    'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat',
    'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt',
    'mollit', 'anim', 'id', 'est', 'laborum'
  ];

  const result = [];
  let startIndex = 0;

  if (startWithLorem && wordCount >= 2) {
    result.push('Lorem', 'ipsum');
    startIndex = 2;
  } else if (startWithLorem && wordCount === 1) {
    result.push('Lorem');
    startIndex = 1;
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

export {
  toBase64,
  fromBase64,
  generateWeightedString,
  generatePatternString,
  generateLoremIpsum
};