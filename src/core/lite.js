// src/lite.js - Lightweight version for minimal use cases
const essentialDecodeMap = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&apos;': "'",
  '&#39;': "'",
  '&nbsp;': '\u00A0'
};

const essentialEncodeMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
  '\u00A0': '&nbsp;'
};

/**
 * Lightweight HTML entity decoder (essential entities only)
 * @param {string} str - String to decode
 * @returns {string} Decoded string
 */
function decodeLite(str) {
  return str.replace(/&[a-zA-Z0-9#]+;/g, entity => {
    return essentialDecodeMap[entity] || entity;
  });
}

/**
 * Lightweight HTML entity encoder (essential characters only)
 * @param {string} str - String to encode
 * @returns {string} Encoded string
 */
function encodeLite(str) {
  return str.replace(/[&<>"'\u00A0]/g, ch => {
    return essentialEncodeMap[ch] || ch;
  });
}

export { decodeLite, encodeLite };
