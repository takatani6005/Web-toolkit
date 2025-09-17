/**
 * Password Generation utilities
 * Provides secure password generation with customizable character sets and rules
 */

/**
 * Generate a secure password with customizable options
 * @param {Object} options - Configuration options
 * @param {number} [options.length=12] - Length of the password
 * @param {boolean} [options.includeUppercase=true] - Include uppercase letters
 * @param {boolean} [options.includeLowercase=true] - Include lowercase letters
 * @param {boolean} [options.includeNumbers=true] - Include numbers
 * @param {boolean} [options.includeSymbols=true] - Include symbols
 * @param {boolean} [options.excludeSimilar=true] - Exclude similar looking characters (0, O, 1, I, l)
 * @param {string} [options.customSymbols='!@#$%^&*()_+-=[]{}|;:,.<>?'] - Custom symbol set
 * @param {boolean} [options.secure=false] - Use cryptographically secure random generation
 * @param {boolean} [options.ensureComplexity=false] - Ensure at least one char from each enabled type
 * @param {string[]} [options.excludePatterns=[]] - Patterns to avoid (simple string matching)
 * @returns {string} Generated password
 * @throws {Error} When invalid parameters are provided
 */
 function generatePassword(options = {}) {
  const {
    length = 12,
    includeUppercase = true,
    includeLowercase = true,
    includeNumbers = true,
    includeSymbols = true,
    excludeSimilar = true,
    customSymbols = '!@#$%^&*()_+-=[]{}|;:,.<>?',
    secure = false,
    ensureComplexity = false,
    excludePatterns = []
  } = options;

  // Validation
  if (typeof length !== 'number' || !Number.isInteger(length) || length < 1) {
    throw new Error('Length must be a positive integer');
  }

  if (length > 256) {
    throw new Error('Password length cannot exceed 256 characters');
  }

  // Build character sets
  const charSets = {
    uppercase: excludeSimilar ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: excludeSimilar ? 'abcdefghijkmnpqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz',
    numbers: excludeSimilar ? '23456789' : '0123456789',
    symbols: customSymbols
  };

  // Build charset and required characters
  let charset = '';
  const requiredChars = [];
  const availableSets = [];

  if (includeUppercase) {
    charset += charSets.uppercase;
    availableSets.push({ name: 'uppercase', chars: charSets.uppercase });
  }
  
  if (includeLowercase) {
    charset += charSets.lowercase;
    availableSets.push({ name: 'lowercase', chars: charSets.lowercase });
  }
  
  if (includeNumbers) {
    charset += charSets.numbers;
    availableSets.push({ name: 'numbers', chars: charSets.numbers });
  }
  
  if (includeSymbols) {
    charset += charSets.symbols;
    availableSets.push({ name: 'symbols', chars: charSets.symbols });
  }
  
  if (!charset) {
    throw new Error('At least one character type must be included');
  }

  // If ensuring complexity, we need at least as many characters as character sets
  if (ensureComplexity && length < availableSets.length) {
    throw new Error(`Password length must be at least ${availableSets.length} when ensuring complexity`);
  }

  let password;
  let attempts = 0;
  const maxAttempts = 100;

  do {
    password = generatePasswordString(charset, length, secure, availableSets, ensureComplexity);
    attempts++;

    // Check against excluded patterns
    const hasExcludedPattern = excludePatterns.some(pattern => password.includes(pattern));
    
    if (!hasExcludedPattern) {
      break;
    }

    if (attempts >= maxAttempts) {
      console.warn('Could not generate password without excluded patterns after maximum attempts');
      break;
    }
  } while (attempts < maxAttempts);

  return password;
}

/**
 * Generate password strength score
 * @param {string} password - Password to analyze
 * @returns {Object} Strength analysis object
 */
 function analyzePasswordStrength(password) {
  if (typeof password !== 'string') {
    throw new Error('Password must be a string');
  }

  const analysis = {
    length: password.length,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSymbols: /[^A-Za-z0-9]/.test(password),
    hasRepeatingChars: /(.)\1{2,}/.test(password),
    hasSequential: hasSequentialChars(password),
    uniqueChars: new Set(password).size,
    entropy: 0,
    score: 0,
    strength: 'Very Weak'
  };

  // Calculate entropy
  let charsetSize = 0;
  if (analysis.hasLowercase) charsetSize += 26;
  if (analysis.hasUppercase) charsetSize += 26;
  if (analysis.hasNumbers) charsetSize += 10;
  if (analysis.hasSymbols) charsetSize += 32; // approximate

  analysis.entropy = Math.log2(Math.pow(charsetSize, password.length));

  // Calculate score (0-100)
  let score = 0;

  // Length scoring
  if (password.length >= 12) score += 25;
  else if (password.length >= 8) score += 15;
  else if (password.length >= 6) score += 5;

  // Character variety scoring
  const varietyCount = [
    analysis.hasUppercase,
    analysis.hasLowercase,
    analysis.hasNumbers,
    analysis.hasSymbols
  ].filter(Boolean).length;

  score += varietyCount * 10;

  // Unique characters bonus
  const uniqueRatio = analysis.uniqueChars / password.length;
  score += uniqueRatio * 20;

  // Penalties
  if (analysis.hasRepeatingChars) score -= 10;
  if (analysis.hasSequential) score -= 15;

  analysis.score = Math.max(0, Math.min(100, Math.round(score)));

  // Determine strength level
  if (analysis.score >= 80) analysis.strength = 'Very Strong';
  else if (analysis.score >= 60) analysis.strength = 'Strong';
  else if (analysis.score >= 40) analysis.strength = 'Medium';
  else if (analysis.score >= 20) analysis.strength = 'Weak';
  else analysis.strength = 'Very Weak';

  return analysis;
}

/**
 * Generate a memorable password using word combinations
 * @param {Object} options - Configuration options
 * @param {number} [options.wordCount=3] - Number of words to combine
 * @param {string} [options.separator='-'] - Separator between words
 * @param {boolean} [options.includeNumbers=true] - Add numbers
 * @param {boolean} [options.capitalizeWords=true] - Capitalize first letter of each word
 * @returns {string} Generated memorable password
 */
 function generateMemorablePassword(options = {}) {
  const {
    wordCount = 3,
    separator = '-',
    includeNumbers = true,
    capitalizeWords = true
  } = options;

  const words = [
    'apple', 'brave', 'cloud', 'dance', 'eagle', 'flame', 'grace', 'heart',
    'ivory', 'jolly', 'kite', 'lemon', 'magic', 'noble', 'ocean', 'peace',
    'quilt', 'river', 'storm', 'trust', 'unity', 'voice', 'water', 'xenon',
    'youth', 'zebra', 'amber', 'beach', 'coral', 'dream', 'ember', 'frost',
    'giant', 'happy', 'index', 'jazzy', 'karma', 'light', 'mango', 'night'
  ];

  const selectedWords = [];
  const usedIndices = new Set();

  for (let i = 0; i < wordCount; i++) {
    let index;
    do {
      index = Math.floor(Math.random() * words.length);
    } while (usedIndices.has(index));
    
    usedIndices.add(index);
    let word = words[index];
    
    if (capitalizeWords) {
      word = word.charAt(0).toUpperCase() + word.slice(1);
    }
    
    selectedWords.push(word);
  }

  let password = selectedWords.join(separator);

  if (includeNumbers) {
    const number = Math.floor(Math.random() * 100);
    password += number.toString();
  }

  return password;
}

/**
 * Generate password string with optional complexity requirements
 * @private
 */
function generatePasswordString(charset, length, secure, availableSets, ensureComplexity) {
  let password = '';

  if (ensureComplexity && availableSets.length > 0) {
    // First, ensure we have at least one character from each required set
    for (const set of availableSets) {
      const randomIndex = getSecureRandomIndex(set.chars.length, secure);
      password += set.chars[randomIndex];
    }

    // Fill remaining positions with random characters from full charset
    for (let i = password.length; i < length; i++) {
      const randomIndex = getSecureRandomIndex(charset.length, secure);
      password += charset[randomIndex];
    }

    // Shuffle the password to avoid predictable patterns
    password = shuffleString(password, secure);
  } else {
    // Generate purely random password
    for (let i = 0; i < length; i++) {
      const randomIndex = getSecureRandomIndex(charset.length, secure);
      password += charset[randomIndex];
    }
  }

  return password;
}

/**
 * Get secure random index
 * @private
 */
function getSecureRandomIndex(max, secure) {
  if (secure && typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] % max;
  } else if (secure && typeof require !== 'undefined') {
    try {
      const crypto = require('crypto');
      const bytes = crypto.randomBytes(4);
      return bytes.readUInt32BE(0) % max;
    } catch (err) {
      console.warn('Secure random generation requested but crypto not available, falling back to Math.random');
      return Math.floor(Math.random() * max);
    }
  }
  return Math.floor(Math.random() * max);
}

/**
 * Shuffle string characters
 * @private
 */
function shuffleString(str, secure) {
  const arr = str.split('');
  
  for (let i = arr.length - 1; i > 0; i--) {
    const j = getSecureRandomIndex(i + 1, secure);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  
  return arr.join('');
}

/**
 * Check for sequential characters
 * @private
 */
function hasSequentialChars(password) {
  const sequences = [
    'abcdefghijklmnopqrstuvwxyz',
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    '0123456789',
    'qwertyuiopasdfghjklzxcvbnm' // common keyboard layout
  ];

  for (const seq of sequences) {
    for (let i = 0; i <= seq.length - 3; i++) {
      const subseq = seq.substring(i, i + 3);
      if (password.includes(subseq) || password.includes(subseq.split('').reverse().join(''))) {
        return true;
      }
    }
  }

  return false;
}

export {
    generatePassword,
    analyzePasswordStrength,
    generateMemorablePassword,
}