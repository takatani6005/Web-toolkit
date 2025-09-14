// src/security/OutputEncoder.js
// Output Encoding Functions
export class OutputEncoder {
  /**
   * Encode string for safe insertion into HTML attributes
   * @param {string} str - String to encode
   * @returns {string} Encoded string
   */
  static encodeForAttr(str) {
    if (typeof str !== 'string') return '';
    
    return str
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '&#10;')
      .replace(/\r/g, '&#13;')
      .replace(/\t/g, '&#9;');
  }

  /**
   * Encode string for safe insertion into CSS
   * @param {string} str - String to encode
   * @returns {string} Encoded string
   */
  static encodeForCss(str) {
    if (typeof str !== 'string') return '';
    
    return str.replace(/[^a-zA-Z0-9\-_]/g, (match) => {
      const code = match.charCodeAt(0);
      return '\\' + code.toString(16).padStart(6, '0');
    });
  }

  /**
   * Encode string for safe insertion into JavaScript
   * @param {string} str - String to encode
   * @returns {string} Encoded string
   */
  static encodeForJs(str) {
    if (typeof str !== 'string') return '';
    
    const escapeMap = {
      '"': '\\"',
      "'": "\\'",
      '\\': '\\\\',
      '\n': '\\n',
      '\r': '\\r',
      '\t': '\\t',
      '\b': '\\b',
      '\f': '\\f',
      '\v': '\\v',
      '\0': '\\0'
    };

    return str.replace(/["'\\nrtbfv\0]/g, (match) => escapeMap[match] || match);
  }
}
