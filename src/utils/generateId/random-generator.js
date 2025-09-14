/**
 * Generate random string using Math.random
 * @param {string} chars - Character set to use
 * @param {number} length - Length of string to generate
 * @returns {string} Random string
 */
export function generateWithMathRandom(chars, length) {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate cryptographically secure random string
 * @param {string} chars - Character set to use
 * @param {number} length - Length of string to generate
 * @returns {string} Random string
 */
export function generateSecureRandom(chars, length) {
  // Browser environment
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(array[i] % chars.length);
    }
    return result;
  }
  
  // Node.js environment
  if (typeof require !== 'undefined') {
    try {
      const crypto = require('crypto');
      const bytes = crypto.randomBytes(length);
      let result = '';
      for (let i = 0; i < length; i++) {
        result += chars.charAt(bytes[i] % chars.length);
      }
      return result;
    } catch (err) {
      console.warn('Secure random generation requested but crypto not available, falling back to Math.random');
      return generateWithMathRandom(chars, length);
    }
  }
  
  // Fallback
  console.warn('Secure random generation requested but crypto not available, falling back to Math.random');
  return generateWithMathRandom(chars, length);
}

/**
 * Generate random string with specified security level
 * @param {string} chars - Character set to use
 * @param {number} length - Length of string to generate
 * @param {boolean} secure - Whether to use secure random generation
 * @returns {string} Random string
 */
export function generateRandomString(chars, length, secure = false) {
  if (length === 0) {
    return '';
  }
  
  return secure 
    ? generateSecureRandom(chars, length)
    : generateWithMathRandom(chars, length);
}