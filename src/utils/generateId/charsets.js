/**
 * Predefined character sets for ID generation
 */
export const BASE_CHARSETS = {
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

/**
 * Get character set string, resolving predefined names
 * @param {string} charset - Character set name or custom string
 * @returns {string} Character set string
 */
export function getCharset(charset) {
  return BASE_CHARSETS[charset] || charset;
}

/**
 * Remove ambiguous characters from a character set
 * @param {string} chars - Character set string
 * @returns {string} Character set without ambiguous characters
 */
export function removeAmbiguousChars(chars) {
  return chars.replace(/[0OIl1]/g, '');
}

/**
 * Validate character set
 * @param {string} charset - Character set to validate
 * @returns {boolean} Whether charset is valid
 */
export function isValidCharset(charset) {
  return typeof charset === 'string' && charset.length > 0;
}