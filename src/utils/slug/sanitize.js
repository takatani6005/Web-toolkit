/**
 * Handle special characters in strict mode
 * Removes ALL non-alphanumeric characters including underscores
 * @param {string} str - Input string
 * @returns {string} Sanitized string
 */
export function sanitizeStrict(str) {
  if (!str) return str;
  return str.replace(/[^a-zA-Z0-9\s]/g, '');
}

/**
 * Handle special characters in non-strict mode
 * Converts common separators to spaces and removes other special characters
 * @param {string} str - Input string
 * @returns {string} Sanitized string
 */
export function sanitizeNonStrict(str) {
  if (!str) return str;
  
  return str
    // First normalize existing separators (_, -, .)
    .replace(/[_.-]+/g, ' ')
    // Then replace remaining special chars with spaces
    .replace(/[^\w\s]/g, ' ');
}

/**
 * Sanitize string for slug creation based on mode
 * @param {string} str - Input string
 * @param {boolean} strict - Use strict mode (default: false)
 * @returns {string} Sanitized string
 */
export function sanitizeForSlug(str, strict = false) {
  if (!str) return str;
  
  return strict ? sanitizeStrict(str) : sanitizeNonStrict(str);
}

/**
 * Convert multiple whitespace characters to single spaces
 * @param {string} str - Input string
 * @returns {string} String with normalized whitespace
 */
export function normalizeWhitespace(str) {
  if (!str) return str;
  return str.replace(/\s+/g, ' ').trim();
}

/**
 * Remove common problematic characters that often cause issues in URLs
 * @param {string} str - Input string
 * @returns {string} String with problematic characters removed
 */
export function removeProblematicChars(str) {
  if (!str) return str;
  
  return str
    // Remove control characters
    .replace(/[\x00-\x1f\x7f-\x9f]/g, '')
    // Remove zero-width characters
    .replace(/[\u200b-\u200d\ufeff]/g, '')
    // Remove directional marks
    .replace(/[\u202a-\u202e]/g, '')
    // Remove other invisible characters
    .replace(/[\u2060-\u2069]/g, '');
}

/**
 * Check if a character is safe for URLs
 * @param {string} char - Character to check
 * @returns {boolean} True if character is URL-safe
 */
export function isUrlSafeChar(char) {
  if (!char || char.length !== 1) return false;
  
  // ASCII alphanumeric, hyphen, underscore, period
  return /[a-zA-Z0-9\-_.~]/.test(char);
}

/**
 * Get list of characters that will be removed/replaced during sanitization
 * @param {string} str - Input string
 * @param {boolean} strict - Strict mode
 * @returns {Array} Array of problematic characters found
 */
export function getProblematicChars(str, strict = false) {
  if (!str) return [];
  
  const problematic = new Set();
  const pattern = strict ? /[^a-zA-Z0-9\s]/g : /[^\w\s.-]/g;
  
  for (const char of str) {
    if (pattern.test(char)) {
      problematic.add(char);
    }
  }
  
  return Array.from(problematic);
}

/**
 * Preview what a string will look like after sanitization
 * @param {string} str - Input string
 * @param {boolean} strict - Strict mode
 * @returns {Object} Preview object with original, sanitized, and removed characters
 */
export function previewSanitization(str, strict = false) {
  if (!str) {
    return {
      original: str,
      sanitized: str,
      removed: []
    };
  }
  
  const sanitized = sanitizeForSlug(str, strict);
  const removed = getProblematicChars(str, strict);
  
  return {
    original: str,
    sanitized,
    removed
  };
}