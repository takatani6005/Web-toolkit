
/**
 * Escape CSS values to prevent injection attacks
 * @param {string} str - String to escape for CSS
 * @param {Object} options - Options
 * @param {boolean} options.escapeQuotes - Escape quotes (default: true)
 * @param {boolean} options.escapeBackslash - Escape backslashes (default: true)
 * @returns {string} CSS-safe string
 */
function escapeCss(str, options = {}) {
  if (typeof str !== 'string') {
    throw new TypeError('Input must be a string');
  }
  
  const { escapeQuotes = true, escapeBackslash = true } = options;
  
  let result = str;
  
  // Escape backslashes first (must be done before other escaping)
  if (escapeBackslash) {
    result = result.replace(/\\/g, '\\\\');
  }
  
  // Escape quotes
  if (escapeQuotes) {
    result = result
      .replace(/"/g, '\\"')
      .replace(/'/g, "\\'");
  }
  
  // Escape CSS-specific characters
  result = result
    // Escape newlines and control characters
    .replace(/\n/g, '\\A ')
    .replace(/\r/g, '\\D ')
    .replace(/\t/g, '\\9 ')
    .replace(/\f/g, '\\C ')
    .replace(/\v/g, '\\B ')
    // Escape other potentially dangerous characters
    .replace(/</g, '\\3C ')
    .replace(/>/g, '\\3E ')
    .replace(/&/g, '\\26 ')
    .replace(/\(/g, '\\28 ')
    .replace(/\)/g, '\\29 ')
    .replace(/{/g, '\\7B ')
    .replace(/}/g, '\\7D ')
    .replace(/;/g, '\\3B ')
    // Escape Unicode control characters
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, (char) => {
      return '\\' + char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0') + ' ';
    });
  
  return result;
}

/**
 * Encode all values in a Map
 */
function encodeMap(map, encoder = encodeHtmlText) {
  if (!(map instanceof Map)) return map;
  
  const encoded = new Map();
  for (const [key, value] of map.entries()) {
    const encodedKey = typeof key === 'string' ? encoder(key) : key;
    const encodedValue = typeof value === 'string' ? encoder(value) : value;
    encoded.set(encodedKey, encodedValue);
  }
  
  return encoded;
}

/**
 * Decode all values in a Map
 */
function decodeMap(map, decoder = unescapeHtml) {
  if (!(map instanceof Map)) return map;
  
  const decoded = new Map();
  for (const [key, value] of map.entries()) {
    const decodedKey = typeof key === 'string' ? decoder(key) : key;
    const decodedValue = typeof value === 'string' ? decoder(value) : value;
    decoded.set(decodedKey, decodedValue);
  }
  
  return decoded;
}

export {
  escapeCss,
  encodeMap,
  decodeMap
};
