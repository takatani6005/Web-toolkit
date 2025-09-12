
/**
 * Encode only the essential HTML characters
 * @param {string} str - String to encode
 * @returns {string} Encoded string
 */
function encodeHtmlMinimal(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Input must be a string');
  }
  
  return str.replace(/[&<>"']/g, (ch) => {
    switch (ch) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#x27;';
      default: return ch;
    }
  });
}

/**
 * Encode for HTML attributes
 * @param {string} str - String to encode
 * @param {Object} options - Options
 * @param {boolean} options.double - Use double quotes (default: true)
 * @returns {string} Encoded string
 */
function encodeHtmlAttribute(str, options = {}) {
  if (typeof str !== 'string') {
    throw new TypeError('Input must be a string');
  }
  
  const { double = true } = options;
  
  if (double) {
    return str.replace(/[&<>"]/g, (ch) => {
      switch (ch) {
        case '&': return '&amp;';
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        default: return ch;
      }
    });
  } else {
    return str.replace(/[&<>']/g, (ch) => {
      switch (ch) {
        case '&': return '&amp;';
        case '<': return '&lt;';
        case '>': return '&gt;';
        case "'": return '&#x27;';
        default: return ch;
      }
    });
  }
}

/**
 * Escape text for safe insertion into HTML
 * @param {string} str - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(str) {
  return encodeHtmlMinimal(str);
}

/**
 * Unescape HTML text
 * @param {string} str - HTML text to unescape
 * @returns {string} Unescaped text
 */
function unescapeHtml(str) {
  return decodeHtml(str);
}
module.exports = {
  encodeHtmlMinimal,
  encodeHtmlAttribute,
  escapeHtml,
  unescapeHtml
};