//---------------------------------------------------------------
/**
 * ID Generation utilities
 * Provides secure, customizable ID generation with various character sets
 */

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
export function generateId(options = {}) {
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

  // Get character set
  let chars = getCharacterSet(charset);
  
  // Remove ambiguous characters if requested
  if (avoidAmbiguous) {
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
    result = generateRandomString(chars, length, secure);
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
 * Generate a batch of IDs efficiently
 * @param {number} count - Number of IDs to generate
 * @param {Object} options - Same options as generateId
 * @returns {string[]} Array of generated IDs
 */
export function generateIdBatch(count, options = {}) {
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
export function validateId(id, options = {}) {
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
  let chars = getCharacterSet(charset);
  
  if (avoidAmbiguous) {
    chars = chars.replace(/[0OIl1]/g, '');
  }

  // Create regex to validate characters
  const escapedChars = chars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`^[${escapedChars}]*$`);

  return regex.test(core);
}

/**
 * Get character set from predefined name or return custom charset
 * @private
 */
function getCharacterSet(charset) {
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

  const chars = baseCharsets[charset] || charset;
  
  if (typeof chars !== 'string' || chars.length === 0) {
    throw new Error('Charset must be a non-empty string or valid charset name');
  }

  return chars;
}

/**
 * Generate random string using specified character set
 * @private
 */
function generateRandomString(chars, length, secure) {
  if (secure && typeof crypto !== 'undefined' && crypto.getRandomValues) {
    // Use cryptographically secure random generation
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(array[i] % chars.length);
    }
    return result;
  } else if (secure) {
    // Crypto requested but not available
    console.warn('Secure random generation requested but crypto not available, falling back to Math.random');
    return generateWithMathRandom(chars, length);
  } else {
    // Standard Math.random generation
    return generateWithMathRandom(chars, length);
  }
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