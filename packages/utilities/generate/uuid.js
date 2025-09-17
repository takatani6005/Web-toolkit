/**
 * UUID and NanoID Generation utilities
 * Provides standard UUID generation and compact NanoID alternatives
 */

/**
 * Generate a UUID (Universally Unique Identifier)
 * @param {number} [version=4] - UUID version (currently only v4 supported)
 * @param {boolean} [secure=false] - Use cryptographically secure random generation
 * @returns {string} Generated UUID
 * @throws {Error} When unsupported version is requested
 */
export function generateUuid(version = 4, secure = false) {
  if (typeof version !== 'number' || version < 0) {
    throw new Error('Invalid UUID version');
  }
  if (version === 4) {
    if (secure && typeof crypto !== 'undefined' && crypto.getRandomValues) {
      // Cryptographically secure UUID v4
      const bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);
      
      // Set version (4) and variant bits
      bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
      bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant bits
      
      // Convert to hex string with hyphens
      const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
      return [
        hex.slice(0, 8),
        hex.slice(8, 12),
        hex.slice(12, 16),
        hex.slice(16, 20),
        hex.slice(20, 32)
      ].join('-');
    } else if (secure && typeof require !== 'undefined') {
      // Node.js crypto module fallback
      try {
        const crypto = require('crypto');
        const bytes = crypto.randomBytes(16);
        
        // Set version and variant bits
        bytes[6] = (bytes[6] & 0x0f) | 0x40;
        bytes[8] = (bytes[8] & 0x3f) | 0x80;
        
        const hex = bytes.toString('hex');
        return [
          hex.slice(0, 8),
          hex.slice(8, 12),
          hex.slice(12, 16),
          hex.slice(16, 20),
          hex.slice(20, 32)
        ].join('-');
      } catch (err) {
        console.warn('Secure UUID generation requested but crypto not available, falling back to Math.random');
      }
    }
    
    // Fallback to Math.random-based generation
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
  throw new Error(`UUID version ${version} not supported`);
}

/**
 * Validate if a string is a valid UUID
 * @param {string} uuid - String to validate
 * @param {number} [version=4] - Expected UUID version
 * @returns {boolean} Whether the string is a valid UUID
 */
export function validateUuid(uuid, version = 4) {
  if (typeof uuid !== 'string') {
    return false;
  }

  const patterns = {
    4: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  };

  const pattern = patterns[version];
  if (!pattern) {
    throw new Error(`UUID version ${version} validation not supported`);
  }

  return pattern.test(uuid);
}

/**
 * Validate if a string could be a NanoID with given alphabet
 * @param {string} id - String to validate
 * @param {string} [alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'] - Expected alphabet
 * @returns {boolean} Whether the string is valid for the given alphabet
 */
export function validateNanoId(id, alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-') {
  if (typeof id !== 'string' || typeof alphabet !== 'string') {
    return false;
  }

  if (id.length === 0 || alphabet.length === 0) {
    return false;
  }

  // Create regex from alphabet
  const escapedAlphabet = alphabet.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`^[${escapedAlphabet}]+$`);
  return regex.test(id);
}

/**
 * Generate a NanoID (compact, URL-safe unique ID)
 * @param {Object} options - Configuration options
 * @param {number} [options.size=21] - Length of the generated ID
 * @param {string} [options.alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'] - Custom alphabet
 * @param {boolean} [options.secure=true] - Use cryptographically secure random generation
 * @returns {string} Generated NanoID
 */
export function generateNanoId(options = {}) {

  const {
    size = 21,
    alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-',
    secure = true
  } = options;
  
  if (typeof size !== 'number' || !Number.isInteger(size) || size < 1) {
    throw new Error('Size must be a positive integer');
  }

  if (size > 256) {
    throw new Error('Size cannot exceed 256');
  }

  if (alphabet==null || typeof alphabet !== 'string' || alphabet.length === 0) {
    throw new Error('Alphabet must be a non-empty string');
  }

  if (alphabet.length > 256) {
    throw new Error('Alphabet cannot exceed 256 characters');
  }

  // Check for duplicate characters in alphabet
  if (new Set(alphabet).size !== alphabet.length) {
    throw new Error('Alphabet cannot contain duplicate characters');
  }

  let id = '';
  const mask = (2 << Math.log(alphabet.length - 1) / Math.LN2) - 1;
  const step = -~(1.6 * mask * size / alphabet.length);
  
  if (secure && typeof crypto !== 'undefined' && crypto.getRandomValues) {
    // Browser crypto API
    while (true) {
      const bytes = crypto.getRandomValues(new Uint8Array(step));
      
      for (let i = 0; i < step; i++) {
        const byte = bytes[i] & mask;
        if (alphabet[byte]) {
          id += alphabet[byte];
          if (id.length === size) return id;
        }
      }
    }
  } else if (secure && typeof require !== 'undefined') {
    // Node.js crypto module
    try {
      const crypto = require('crypto');
      
      while (true) {
        const bytes = crypto.randomBytes(step);
        
        for (let i = 0; i < step; i++) {
          const byte = bytes[i] & mask;
          if (alphabet[byte]) {
            id += alphabet[byte];
            if (id.length === size) return id;
          }
        }
      }
    } catch (err) {
      console.warn('Secure NanoID generation requested but crypto not available, falling back to Math.random');
    }
  }

  return id;
}

/**
 * Generate a ULID (Universally Unique Lexicographically Sortable Identifier)
 * @param {number} [timestamp=Date.now()] - Timestamp in milliseconds
 * @param {boolean} [secure=false] - Use cryptographically secure random generation
 * @returns {string} Generated ULID
 */
export function generateUlid(timestamp = Date.now(), secure = false) {
  if (typeof timestamp !== 'number' || timestamp < 0) {
    throw new Error('Timestamp must be a non-negative number');
  }

  // Crockford's Base32 alphabet
  const alphabet = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  
  // Convert timestamp to base32 (10 characters)
  let timeStr = '';
  let time = Math.floor(timestamp);
  
  for (let i = 9; i >= 0; i--) {
    timeStr = alphabet[time % 32] + timeStr;
    time = Math.floor(time / 32);
  }
  
  // Generate random part (16 characters)
  let randomStr = '';
  
  if (secure && typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    for (let i = 0; i < 16; i++) {
      randomStr += alphabet[bytes[i] % 32];
    }
  } else if (secure && typeof require !== 'undefined') {
    try {
      const crypto = require('crypto');
      const bytes = crypto.randomBytes(16);
      for (let i = 0; i < 16; i++) {
        randomStr += alphabet[bytes[i] % 32];
      }
    } catch (err) {
      console.warn('Secure ULID generation requested but crypto not available, falling back to Math.random');
      for (let i = 0; i < 16; i++) {
        randomStr += alphabet[Math.floor(Math.random() * 32)];
      }
    }
  } else {
    for (let i = 0; i < 16; i++) {
      randomStr += alphabet[Math.floor(Math.random() * 32)];
    }
  }
  
  return timeStr + randomStr;
}

/**
 * Validate if a string is a valid ULID
 * @param {string} ulid - String to validate
 * @returns {boolean} Whether the string is a valid ULID
 */
export function validateUlid(ulid) {
  if (typeof ulid !== 'string') {
    return false;
  }

  // ULID should be exactly 26 characters using Crockford's Base32
  const pattern = /^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/;
  return pattern.test(ulid);
}

/**
 * Extract timestamp from ULID
 * @param {string} ulid - ULID to extract timestamp from
 * @returns {number} Timestamp in milliseconds
 * @throws {Error} When ULID is invalid
 */
export function getUlidTimestamp(ulid) {
  if (!validateUlid(ulid)) {
    throw new Error('Invalid ULID format');
  }

  const alphabet = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  const timeStr = ulid.substring(0, 10);
  
  let timestamp = 0;
  for (let i = 0; i < timeStr.length; i++) {
    const char = timeStr[i];
    const value = alphabet.indexOf(char);
    if (value === -1) {
      throw new Error('Invalid ULID character');
    }
    timestamp = timestamp * 32 + value;
  }
  
  return timestamp;
}