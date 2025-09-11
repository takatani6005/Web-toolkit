const decodeMap = require('../data/decode-map.json');
const encodeMap = require('../data/encode-map-full.json');

// Decode HTML entity → ký tự
function decodeHtml(str) {
  return str.replace(/&[a-zA-Z0-9#]+;/g, entity => {
    // 1. Named entity
    if (decodeMap[entity]) return decodeMap[entity];

    // 2. Numeric entity (decimal)
    if (entity.startsWith('&#') && !entity.startsWith('&#x')) {
      return String.fromCodePoint(parseInt(entity.slice(2, -1), 10));
    }

    // 3. Numeric entity (hex)
    if (entity.startsWith('&#x')) {
      return String.fromCodePoint(parseInt(entity.slice(3, -1), 16));
    }

    // 4. Không decode được thì giữ nguyên
    return entity;
  });
}

// Encode ký tự → entity
function encodeHtml(str) {
  return str.replace(/[\u00A0-\uFFFF&<>"']/g, ch => encodeMap[ch] || ch);
}

module.exports = { encodeHtml, decodeHtml };
