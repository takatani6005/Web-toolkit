// src/utils/generate.js
function toBase64(str) {
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch (e) {
    // Fallback for non-browser environments
    return Buffer.from(str, 'utf8').toString('base64');
  }
}

function fromBase64(base64Str) {
  try {
    return decodeURIComponent(escape(atob(base64Str)));
  } catch (e) {
    // Fallback for non-browser environments or invalid base64
    try {
      return Buffer.from(base64Str, 'base64').toString('utf8');
    } catch {
      throw new Error('Invalid base64 string');
    }
  }
}
//---------------------------------------------------------------
/**
 * Generates a random ID with various customization options
 * @param {Object} options - Configuration options
 * @param {number} [options.length=8] - Length of the random part
 * @param {string} [options.prefix=''] - String to prepend to the ID
 * @param {string} [options.suffix=''] - String to append to the ID
 * @param {string} [options.charset='alphanumeric'] - Character set to use or predefined charset name
 * @param {boolean} [options.includeTimestamp=false] - Whether to include timestamp
 * @param {string} [options.separator=''] - Separator between random part and timestamp
 * @param {boolean} [options.secure=false] - Use cryptographically secure random generation
 * @param {boolean} [options.avoidAmbiguous=false] - Exclude ambiguous characters (0, O, 1, I, l)
 * @param {number} [options.minLength=1] - Minimum allowed length
 * @param {number} [options.maxLength=256] - Maximum allowed length
 * @returns {string} Generated ID
 * @throws {Error} When invalid parameters are provided
 */
function generateId(options = {}) {
  // Input validation and defaults
  const {
    length = 8,
    prefix = '',
    suffix = '',
    charset = 'alphanumeric',
    includeTimestamp = false,
    separator = '',
    secure = false,
    avoidAmbiguous = false,
    minLength = 1,
    maxLength = 256
  } = options;

  // Validate inputs
  if (typeof length !== 'number' || !Number.isInteger(length)) {
    throw new Error('Length must be an integer');
  }
  
  if (length < 0) {
    throw new Error('Length cannot be negative');
  }
  
  // Only apply minLength constraint if it was explicitly set or length > 0
  const effectiveMinLength = options.hasOwnProperty('minLength') ? minLength : (length === 0 ? 0 : 1);
  
  if (length < effectiveMinLength || length > maxLength) {
    throw new Error(`Length must be between ${effectiveMinLength} and ${maxLength}`);
  }

  if (typeof prefix !== 'string' || typeof suffix !== 'string') {
    throw new Error('Prefix and suffix must be strings');
  }

  if (typeof separator !== 'string') {
    throw new Error('Separator must be a string');
  }

  // Define character sets
  const baseCharsets = {
    alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    alpha: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    numeric: '0123456789',
    hex: '0123456789ABCDEF',
    hexLower: '0123456789abcdef',
    base32: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567',
    base32Lower: 'abcdefghijklmnopqrstuvwxyz234567',
    urlsafe: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_',
    base58: '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz', // Bitcoin-style, no 0OIl
    safe: 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // No ambiguous characters by default
  };

  // Get character set
  let chars = baseCharsets[charset] || charset;
  
  if (typeof chars !== 'string' || chars.length === 0) {
    throw new Error('Charset must be a non-empty string or valid charset name');
  }

  // Remove ambiguous characters if requested
  if (avoidAmbiguous || baseCharsets[charset]) {
    chars = chars.replace(/[0OIl1]/g, '');
    if (chars.length === 0) {
      throw new Error('No characters remaining after removing ambiguous ones');
    }
  }

  // Validate that we can generate the requested length
  if (length > 0 && chars.length === 0) {
    throw new Error('Cannot generate ID with empty character set');
  }

  // Generate random part
  let result = '';
  
  if (length > 0) {
    if (secure && typeof crypto !== 'undefined' && crypto.getRandomValues) {
      // Use cryptographically secure random generation
      const array = new Uint8Array(length);
      crypto.getRandomValues(array);
      
      for (let i = 0; i < length; i++) {
        result += chars.charAt(array[i] % chars.length);
      }
    } else if (secure && typeof require !== 'undefined') {
      // Node.js crypto module fallback
      try {
        const crypto = require('crypto');
        const bytes = crypto.randomBytes(length);
        for (let i = 0; i < length; i++) {
          result += chars.charAt(bytes[i] % chars.length);
        }
      } catch (err) {
        // Fall back to Math.random with warning
        console.warn('Secure random generation requested but crypto not available, falling back to Math.random');
        result = generateWithMathRandom(chars, length);
      }
    } else if (secure) {
      // Crypto requested but not available
      console.warn('Secure random generation requested but crypto not available, falling back to Math.random');
      result = generateWithMathRandom(chars, length);
    } else {
      // Standard Math.random generation
      result = generateWithMathRandom(chars, length);
    }
  }

  // Add timestamp if requested
  if (includeTimestamp) {
    const timestamp = Date.now().toString(36);
    result = separator ? `${result}${separator}${timestamp}` : `${result}${timestamp}`;
  }

  // Combine with prefix and suffix
  const finalId = `${prefix}${result}${suffix}`;
  
  // Final validation
  if (finalId.length > 1000) {
    console.warn(`Generated ID is very long (${finalId.length} characters). Consider reducing prefix/suffix length.`);
  }

  return finalId;
}

/**
 * Helper function for Math.random-based generation
 * @private
 */
function generateWithMathRandom(chars, length) {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate a batch of IDs efficiently
 * @param {number} count - Number of IDs to generate
 * @param {Object} options - Same options as generateId
 * @returns {string[]} Array of generated IDs
 */
function generateIdBatch(count, options = {}) {
  if (typeof count !== 'number' || !Number.isInteger(count) || count < 0) {
    throw new Error('Count must be a non-negative integer');
  }
  
  if (count > 10000) {
    throw new Error('Batch size too large, maximum is 10000');
  }

  const ids = [];
  const idsSet = new Set();
  let attempts = 0;
  const maxAttempts = count * 10; // Prevent infinite loops

  // Generate unique IDs
  while (ids.length < count && attempts < maxAttempts) {
    const id = generateId(options);
    if (!idsSet.has(id)) {
      ids.push(id);
      idsSet.add(id);
    }
    attempts++;
  }

  if (ids.length < count) {
    console.warn(`Could only generate ${ids.length} unique IDs out of ${count} requested. Consider increasing length or changing charset.`);
  }

  return ids;
}

/**
 * Validate if a string could be a generated ID with given options
 * @param {string} id - ID to validate
 * @param {Object} options - Options used to generate the ID
 * @returns {boolean} Whether the ID matches the expected pattern
 */
function validateId(id, options = {}) {
  const {
    prefix = '',
    suffix = '',
    charset = 'alphanumeric',
    includeTimestamp = false,
    separator = '',
    avoidAmbiguous = false
  } = options;

  if (typeof id !== 'string') {
    return false;
  }

  // Check prefix and suffix
  if (!id.startsWith(prefix) || !id.endsWith(suffix)) {
    return false;
  }

  // Remove prefix and suffix
  let core = id.slice(prefix.length);
  if (suffix.length > 0) {
    core = core.slice(0, -suffix.length);
  }

  // Handle timestamp if included
  if (includeTimestamp && separator) {
    const parts = core.split(separator);
    if (parts.length !== 2) {
      return false;
    }
    core = parts[0];
    // Validate timestamp part (should be base36)
    if (!/^[0-9a-z]+$/.test(parts[1])) {
      return false;
    }
  }

  // Get expected character set
  const baseCharsets = {
    alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    alpha: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    numeric: '0123456789',
    hex: '0123456789ABCDEF',
    hexLower: '0123456789abcdef',
    base32: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567',
    base32Lower: 'abcdefghijklmnopqrstuvwxyz234567',
    urlsafe: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_',
    base58: '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz',
    safe: 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  };

  let chars = baseCharsets[charset] || charset;
  
  if (avoidAmbiguous) {
    chars = chars.replace(/[0OIl1]/g, '');
  }

  // Create regex to validate characters
  const escapedChars = chars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`^[${escapedChars}]*$`);

  return regex.test(core);
}
//---------------------------------------------------------------

function generatePassword(options = {}) {
  const {
    length = 12,
    includeUppercase = true,
    includeLowercase = true,
    includeNumbers = true,
    includeSymbols = true,
    excludeSimilar = true,
    customSymbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'
  } = options;
  
  let charset = '';
  
  if (includeUppercase) {
    charset += excludeSimilar ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  }
  
  if (includeLowercase) {
    charset += excludeSimilar ? 'abcdefghijkmnpqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
  }
  
  if (includeNumbers) {
    charset += excludeSimilar ? '23456789' : '0123456789';
  }
  
  if (includeSymbols) {
    charset += customSymbols;
  }
  
  if (!charset) {
    throw new Error('At least one character type must be included');
  }
  
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  return password;
}

function generateUuid(version = 4) {
  if (version === 4) {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
  throw new Error(`UUID version ${version} not supported`);
}

function generateNanoId(options = {}) {
  const {
    size = 21,
    alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'
  } = options;
  
  let id = '';
  const mask = (2 << Math.log(alphabet.length - 1) / Math.LN2) - 1;
  const step = -~(1.6 * mask * size / alphabet.length);
  
  while (true) {
    const bytes = crypto.getRandomValues ? 
      crypto.getRandomValues(new Uint8Array(step)) :
      Array.from({length: step}, () => Math.floor(Math.random() * 256));
    
    for (let i = 0; i < step; i++) {
      const byte = bytes[i] & mask;
      if (alphabet[byte]) {
        id += alphabet[byte];
        if (id.length === size) return id;
      }
    }
  }
}

function generateHash(str, algorithm = 'djb2') {
  const algorithms = {
    djb2: (s) => {
      let hash = 5381;
      for (let i = 0; i < s.length; i++) {
        hash = ((hash << 5) + hash) + s.charCodeAt(i);
      }
      return hash >>> 0;
    },
    
    sdbm: (s) => {
      let hash = 0;
      for (let i = 0; i < s.length; i++) {
        hash = s.charCodeAt(i) + (hash << 6) + (hash << 16) - hash;
      }
      return hash >>> 0;
    },
    
    simple: (s) => {
      let hash = 0;
      for (let i = 0; i < s.length; i++) {
        const char = s.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      return Math.abs(hash);
    }
  };
  
  const hashFn = algorithms[algorithm];
  if (!hashFn) {
    throw new Error(`Hash algorithm '${algorithm}' not supported`);
  }
  
  return hashFn(str);
}

function generatePlaceholder(options = {}) {
  const {
    type = 'text',
    length = 50,
    sentences = 3,
    paragraphs = 1,
    includeHtml = false
  } = options;
  
  const words = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
  ];
  
  function generateSentence(wordCount = 8 + Math.floor(Math.random() * 8)) {
    const sentence = [];
    for (let i = 0; i < wordCount; i++) {
      sentence.push(words[Math.floor(Math.random() * words.length)]);
    }
    return sentence.join(' ').charAt(0).toUpperCase() + sentence.join(' ').slice(1) + '.';
  }
  
  function generateParagraph(sentenceCount) {
    const sentences = [];
    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(generateSentence());
    }
    return sentences.join(' ');
  }
  
  switch (type) {
    case 'words':
      return Array.from({length}, () => words[Math.floor(Math.random() * words.length)]).join(' ');
    
    case 'sentences':
      return Array.from({length: sentences}, () => generateSentence()).join(' ');
    
    case 'paragraphs':
      const paras = Array.from({length: paragraphs}, () => generateParagraph(sentences));
      if (includeHtml) {
        return paras.map(p => `<p>${p}</p>`).join('\n');
      }
      return paras.join('\n\n');
    
    case 'html':
      const htmlPara = generateParagraph(sentences);
      return `<div class="placeholder">\n  <p>${htmlPara}</p>\n</div>`;
    
    default:
      return generateParagraph(sentences);
  }
}

function generateTestData(type, count = 1, options = {}) {
  const generators = {
    email: () => {
      const domains = ['example.com', 'test.org', 'demo.net', 'sample.co'];
      const names = ['john', 'jane', 'bob', 'alice', 'charlie', 'diana'];
      const name = names[Math.floor(Math.random() * names.length)];
      const domain = domains[Math.floor(Math.random() * domains.length)];
      const num = Math.floor(Math.random() * 1000);
      return `${name}${num}@${domain}`;
    },
    
    url: () => {
      const protocols = ['http', 'https'];
      const domains = ['example.com', 'test.org', 'demo.net'];
      const paths = ['', '/page', '/about', '/contact', '/products'];
      const protocol = protocols[Math.floor(Math.random() * protocols.length)];
      const domain = domains[Math.floor(Math.random() * domains.length)];
      const path = paths[Math.floor(Math.random() * paths.length)];
      return `${protocol}://${domain}${path}`;
    },
    
    phone: () => {
      const formats = [
        () => `+1-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
        () => `(${Math.floor(Math.random() * 900 + 100)}) ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
        () => `${Math.floor(Math.random() * 900 + 100)}.${Math.floor(Math.random() * 900 + 100)}.${Math.floor(Math.random() * 9000 + 1000)}`
      ];
      return formats[Math.floor(Math.random() * formats.length)]();
    },
    
    name: () => {
      const first = ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'Diana', 'Eve', 'Frank'];
      const last = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
      return `${first[Math.floor(Math.random() * first.length)]} ${last[Math.floor(Math.random() * last.length)]}`;
    },
    
    date: () => {
      const start = new Date(2020, 0, 1);
      const end = new Date();
      const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
      return date.toISOString().split('T')[0];
    },
    
    color: () => {
      const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33F1', '#33FFF1', '#F1FF33'];
      return colors[Math.floor(Math.random() * colors.length)];
    }
  };
  
  const generator = generators[type];
  if (!generator) {
    throw new Error(`Test data type '${type}' not supported`);
  }
  
  if (count === 1) {
    return generator();
  }
  
  return Array.from({length: count}, generator);
}

function generateRegexPattern(type, options = {}) {
  const patterns = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
    phone: /^\+?[\d\s\-\(\)\.]{10,}$/,
    ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    creditCard: /^\d{4}[\s\-]?\d{4}[\s\-]?\d{4}[\s\-]?\d{4}$/,
    hexColor: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  };
  
  const pattern = patterns[type];
  if (!pattern) {
    throw new Error(`Regex pattern type '${type}' not supported`);
  }
  
  return options.asString ? pattern.source : pattern;
}

export {
  toBase64,
  fromBase64,
  generatePassword,
  generateUuid,
  generateNanoId,
  generateHash,
  generatePlaceholder,
  generateTestData,
  generateRegexPattern,
  generateId, generateIdBatch, validateId
};
