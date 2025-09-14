
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

/**
 * Quick encode with performance optimization for common cases
 * @param {string} str - String to encode
 * @returns {string} Encoded string
 */
function quickEncode(str) {
  if (typeof str !== 'string') return str;
  if (!str || !/[&<>"']/.test(str)) return str; // Fast path for strings without special chars
  return encodeHtmlMinimal(str);
}

/**
 * Automatically escape based on context detection
 * @param {string} str - String to escape
 * @param {string} context - Context: 'text', 'attribute', 'js', 'url'
 * @returns {string} Escaped string
 */
function autoEscape(str, context = 'text') {
  if (typeof str !== 'string') {
    throw new TypeError('Input must be a string');
  }
  
  switch (context.toLowerCase()) {
    case 'attribute':
      return encodeHtmlAttribute(str);
    case 'js':
    case 'javascript':
      return encodeHtmlJsString(str);
    case 'url':
      return encodeHtmlUrlParam(str);
    case 'text':
    default:
      return encodeHtmlText(str);
  }
}

/**
 * Encode HTML text content (same as minimal but more explicit)
 * @param {string} str - String to encode
 * @returns {string} Encoded string
 */
function encodeHtmlText(str) {
  return encodeHtmlMinimal(str);
}

/**
 * Encode string for safe use in JavaScript within HTML
 * @param {string} str - String to encode
 * @returns {string} Encoded string safe for JS
 */
function encodeHtmlJsString(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Input must be a string');
  }
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

/**
 * Encode URL parameters for HTML context
 * @param {string} str - String to encode
 * @returns {string} URL encoded string
 */
function encodeHtmlUrlParam(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Input must be a string');
  }
  return encodeURIComponent(str)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');
}

/**
 * Lazy HTML decoder that only decodes when necessary
 * @param {string} str - String to potentially decode
 * @param {Object} options - Options
 * @param {boolean} options.force - Force decode even if no entities detected
 * @returns {string} Decoded string if entities found, original otherwise
 */
function decodeHtmlLazy(str, options = {}) {
  if (typeof str !== 'string') {
    return str;
  }
  
  const { force = false } = options;
  
  if (!force && !utils.hasHtmlEntities(str)) {
    return str; // No entities detected, return as-is
  }
  
  return decodeHtml(str);
}

export {
  encodeHtmlMinimal,
  encodeHtmlAttribute,
  escapeHtml,
  unescapeHtml,
  quickEncode,
  autoEscape,
  encodeHtmlText,
  encodeHtmlJsString,
  encodeHtmlUrlParam,
  decodeHtmlLazy
};
