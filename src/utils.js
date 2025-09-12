
/**
 * Check if code point is valid for HTML
 * @param {number} codePoint - Code point to check
 * @returns {boolean} True if valid
 */
function isValidCodePoint(codePoint) {
  return (codePoint >= 0x20 && codePoint <= 0xD7FF) ||
         (codePoint >= 0xE000 && codePoint <= 0xFFFD) ||
         (codePoint >= 0x10000 && codePoint <= 0x10FFFF) ||
         codePoint === 0x09 || codePoint === 0x0A || codePoint === 0x0D;
}

/**
 * Convert string to safely displayable format
 * @param {string} str - String to convert
 * @returns {string} Safe display string
 */
function toSafeDisplay(str) {
  if (typeof str !== 'string') return str;
  
  return str.replace(/[\u0000-\u001F\u007F-\u009F]/g, (ch) => {
    const code = ch.charCodeAt(0);
    return `\\u${code.toString(16).padStart(4, '0').toUpperCase()}`;
  });
}

/**
 * Escape string for use in regular expressions
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeForRegex(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Input must be a string');
  }
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = {
  isValidCodePoint,
  toSafeDisplay,
  escapeForRegex
};