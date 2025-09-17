// src/core.js
import decodeMap  from '../../data/decode-map.json' with { type: 'json' };;
import encodeMap  from '../../data/encode-map-full.json' with { type: 'json' };;

//const encodeMapLite = require('../data/encode-map-lite.json');

/**
 * Decode HTML entities to characters
 * @param {string} str - String containing HTML entities
 * @param {Object} options - Decode options
 * @param {boolean} options.strict - Whether to use strict mode (default: false)
 * @param {boolean} options.attributeMode - Whether to decode attribute-safe entities only (default: false)
 * @returns {string} Decoded string
 */
function decodeHtml(str, options = {}) {
  if (typeof str !== 'string') {
    throw new TypeError('Input must be a string');
  }
  
  const { strict = false, attributeMode = false } = options;
  
  return str.replace(/&[a-zA-Z0-9#]+;?/g, (entity) => {
    // Remove trailing semicolon if present for lookup
    const normalizedEntity = entity.endsWith(';') ? entity : entity + ';';
    
    // 1. Named entity lookup
    if (decodeMap[normalizedEntity]) 
      return decodeMap[normalizedEntity];
    
    function decodeNumericEntity(entity, base) {
        const startIndex = base === 10 ? 2 : 3;
        const num = parseInt(entity.slice(startIndex, -1), base);
        if (isNaN(num) || !isValidCodePoint(num)) return null;

        //num === 9 → Tab (\t) num === 10 → Line Feed (\n) num === 13 → Carriage Return (\r)
        if (attributeMode && (num === 9 || num === 10 || num === 13)) {
            return strict ? entity : String.fromCodePoint(num);
        }
        return String.fromCodePoint(num);
    }

    // 2. Numeric entity (decimal) &#123;
    if (normalizedEntity.startsWith('&#') && !normalizedEntity.startsWith('&#x')) {
        const decoded = decodeNumericEntity(normalizedEntity, 10);
            if (decoded !== null) return decoded;
    }
    // 3. Numeric entity (hex) &#x1F4A9;
    if (normalizedEntity.startsWith('&#x') || normalizedEntity.startsWith('&#X')) {
        const decoded = decodeNumericEntity(normalizedEntity, 16);
            if (decoded !== null) return decoded;
    }

    // 4. Invalid entity handling
    if (strict) 
      throw new Error(`Invalid HTML entity: ${entity}`);
    
    // Return original if can't decode
    return entity;
  });
}

/**
 * Encode characters to HTML entities
 * @param {string} str - String to encode
 * @param {Object} options - Encode options
 * @param {boolean} options.useNamedEntities - Use named entities when possible (default: true)
 * @param {boolean} options.encodeEverything - Encode all non-ASCII characters (default: false)
 * @param {boolean} options.allowUnsafeSymbols - Allow unsafe HTML symbols (default: false)
 * @param {string} options.level - 'html4', 'html5', 'xml' (default: 'html5')
 * @param {boolean} options.decimal - Use decimal instead of hex for numeric entities (default: false)
 * @returns {string} Encoded string
 */
function encodeHtml(str, options = {}) {
  if (typeof str !== 'string') {
    throw new TypeError('Input must be a string');
  }
  
  const {
    useNamedEntities = true,
    encodeEverything = false,
    allowUnsafeSymbols = false,
    level = 'html5',
    decimal = false
  } = options;
  
  const encodeMapToUse = useNamedEntities ? encodeMap : {};
  
  // Base unsafe characters that should always be encoded
  let pattern = allowUnsafeSymbols ? 
    /[\u00A0-\uFFFF]/g : 
    /[&<>"'\u00A0-\uFFFF]/g;
  
  if (encodeEverything) {
    pattern = /[^\x20-\x7E]/g;
  }
  
  return str.replace(pattern, (ch) => {
    // Try named entity first if enabled
    if (useNamedEntities && encodeMapToUse[ch]) {
      return encodeMapToUse[ch];
    }
    
    // Fall back to numeric entity
    const codePoint = ch.codePointAt(0);
    
    if (decimal) {
      return `&#${codePoint};`;
    } else {
      return `&#x${codePoint.toString(16).toUpperCase()};`;
    }
  });
}
export{
  decodeHtml,
  encodeHtml
}