
/**
 * Sanitize HTML by encoding potentially dangerous entities
 * @param {string} str - String to sanitize
 * @param {Object} options - Sanitization options
 * @param {boolean} options.allowBasicEntities - Allow basic HTML entities (default: true)
 * @param {Array} options.whitelist - Array of allowed entities
 * @param {Array} options.blacklist - Array of forbidden entities
 * @returns {string} Sanitized string
 */
function sanitizeHtml(str, options = {}) {
  if (typeof str !== 'string') {
    throw new TypeError('Input must be a string');
  }
  
  const {
    allowBasicEntities = true,
    whitelist = [],
    blacklist = []
  } = options;
  
  const basicEntities = ['&amp;', '&lt;', '&gt;', '&quot;', '&#x27;', '&apos;'];
  const allowedEntities = allowBasicEntities ? 
    [...basicEntities, ...whitelist] : 
    [...whitelist];
  
  return str.replace(/&[a-zA-Z0-9#]+;/g, (entity) => {
    // Check blacklist first
    if (blacklist.includes(entity)) {
      return encodeHtmlMinimal(entity);
    }
    
    // If we have a whitelist, only allow those
    if (allowedEntities.length > 0 && !allowedEntities.includes(entity)) {
      // Check if it's a valid entity that should be double-encoded
      try {
        const decoded = decodeHtml(entity, { strict: true });
        if (decoded !== entity) {
          // It's a valid entity but not whitelisted, double-encode it
          return encodeHtmlMinimal(entity);
        }
      } catch (e) {
        // Invalid entity, encode it
        return encodeHtmlMinimal(entity);
      }
      return encodeHtmlMinimal(entity);
    }
    
    return entity;
  });
}

/**
 * Strip all HTML entities from string
 * @param {string} str - String to process
 * @param {Object} options - Options
 * @param {boolean} options.decode - Decode entities before stripping (default: true)
 * @param {string} options.replacement - Replacement string (default: '')
 * @returns {string} String with entities removed
 */
function stripEntities(str, options = {}) {
  if (typeof str !== 'string') {
    throw new TypeError('Input must be a string');
  }
  
  const { decode = true, replacement = '' } = options;
  
  if (decode) {
    // First decode entities, then remove any remaining ones
    const decoded = decodeHtml(str);
    return decoded.replace(/&[a-zA-Z0-9#]+;/g, replacement);
  } else {
    // Just remove entity patterns
    return str.replace(/&[a-zA-Z0-9#]+;/g, replacement);
  }
}

/**
 * Check if HTML string is safe (contains only whitelisted entities)
 * @param {string} str - String to check
 * @param {Object} options - Safety options
 * @param {Array} options.whitelist - Array of allowed entities
 * @param {boolean} options.allowBasicEntities - Allow basic HTML entities (default: true)
 * @returns {Object} Safety analysis result
 */
function isSafeHtml(str, options = {}) {
  if (typeof str !== 'string') {
    return { safe: false, reason: 'Input must be a string', unsafe: [] };
  }
  
  const {
    whitelist = [],
    allowBasicEntities = true
  } = options;
  
  const basicEntities = ['&amp;', '&lt;', '&gt;', '&quot;', '&#x27;', '&apos;'];
  const allowedEntities = allowBasicEntities ? 
    [...basicEntities, ...whitelist] : 
    [...whitelist];
  
  const entities = findEntities(str);
  const unsafe = [];
  
  entities.forEach(entity => {
    if (!allowedEntities.includes(entity)) {
      // Check if it's a potentially dangerous numeric entity
      if (entity.startsWith('&#')) {
        const codePoint = entity.startsWith('&#x') || entity.startsWith('&#X') ?
          parseInt(entity.slice(3, -1), 16) :
          parseInt(entity.slice(2, -1), 10);
        
        // Check for dangerous control characters or private use areas
        if (codePoint < 32 && codePoint !== 9 && codePoint !== 10 && codePoint !== 13) {
          unsafe.push(entity);
        } else if (codePoint >= 0xE000 && codePoint <= 0xF8FF) {
          unsafe.push(entity);
        } else if (!allowedEntities.includes(entity)) {
          unsafe.push(entity);
        }
      } else {
        unsafe.push(entity);
      }
    }
  });
  
  return {
    safe: unsafe.length === 0,
    reason: unsafe.length > 0 ? `Contains unsafe entities: ${unsafe.join(', ')}` : 'All entities are safe',
    unsafe,
    total: entities.length,
    checked: entities.length
  };
}

module.exports = { sanitizeHtml, stripEntities, isSafeHtml };