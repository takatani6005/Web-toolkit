import { decodeHtml,  encodeHtml } from '../core/core.js';
/**
 * Check if string contains HTML entities
 * @param {string} str - String to check
 * @returns {boolean} True if contains entities
 */
function hasEntities(str) {
  if (typeof str !== 'string') return false;
  return /&[a-zA-Z0-9#]+;/.test(str);
}

/**
 * Get all entities in a string
 * @param {string} str - String to analyze
 * @returns {Array} Array of found entities
 */
function findEntities(str) {
  if (typeof str !== 'string') return [];
  return str.match(/&[a-zA-Z0-9#]+;/g) || [];
}

/**
 * Validate HTML entities in string
 * @param {string} str - String to validate
 * @returns {Object} Validation result
 */
function validateEntities(str) {
  if (typeof str !== 'string') {
    return { valid: false, errors: ['Input must be a string'] };
  }
  
  const entities = findEntities(str);
  const errors = [];
  const valid = [];
  const invalid = [];
  
  entities.forEach(entity => {
    try {
      const decoded = decodeHtml(entity, { strict: true });
      if (decoded === entity) {
        invalid.push(entity);
        errors.push(`Invalid entity: ${entity}`);
      } else {
        valid.push(entity);
      }
    } catch (e) {
      invalid.push(entity);
      errors.push(e.message);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
    validEntities: valid,
    invalidEntities: invalid,
    totalEntities: entities.length
  };
}

/**
 * Normalize entities in string (decode then encode)
 * @param {string} str - String to normalize
 * @param {Object} options - Normalization options
 * @returns {string} Normalized string
 */
function normalizeEntities(str, options = {}) {
  const decoded = decodeHtml(str);
  return encodeHtml(decoded, options);
}

// ===== NEW STATISTICS/ANALYSIS FUNCTIONS =====

/**
 * Count total number of entities in string
 * @param {string} str - String to analyze
 * @returns {number} Number of entities found
 */
function countEntities(str) {
  if (typeof str !== 'string') return 0;
  const entities = findEntities(str);
  return entities.length;
}

/**
 * Get list of unique entities in string
 * @param {string} str - String to analyze
 * @returns {Array} Array of unique entities
 */
function listUniqueEntities(str) {
  if (typeof str !== 'string') return [];
  const entities = findEntities(str);
  return [...new Set(entities)];
}

/**
 * Search for specific entity types in string
 * @param {string} str - String to search
 * @param {Object} options - Search options
 * @param {boolean} options.named - Find named entities
 * @param {boolean} options.numeric - Find numeric entities
 * @param {boolean} options.decimal - Find decimal entities
 * @param {boolean} options.hexadecimal - Find hexadecimal entities
 * @param {RegExp|string} options.pattern - Custom pattern to match
 * @returns {Array} Array of matching entities
 */
function searchEntities(str, options = {}) {
  if (typeof str !== 'string') return [];
  
  const {
    named = false,
    numeric = false,
    decimal = false,
    hexadecimal = false,
    pattern = null
  } = options;
  
  const allEntities = findEntities(str);
  let results = [];
  
  if (pattern) {
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    results = allEntities.filter(entity => regex.test(entity));
  } else {
    if (named) {
      results.push(...allEntities.filter(entity => 
        !entity.startsWith('&#')
      ));
    }
    
    if (decimal) {
      results.push(...allEntities.filter(entity => 
        entity.startsWith('&#') && !entity.startsWith('&#x') && !entity.startsWith('&#X')
      ));
    }
    
    if (hexadecimal) {
      results.push(...allEntities.filter(entity => 
        entity.startsWith('&#x') || entity.startsWith('&#X')
      ));
    }
    
    if (numeric) {
      results.push(...allEntities.filter(entity => 
        entity.startsWith('&#')
      ));
    }
  }
  
  return [...new Set(results)];
}

/**
 * Returns detailed position information for each entity
 * @param {string} html - HTML string to analyze
 * @returns {Array} Array of {entity, start, end, length} objects
 */
function getEntityPositions(html) {
  const regex = /&(?:#(?:x[0-9a-fA-F]+|[0-9]+)|[a-zA-Z][a-zA-Z0-9]*);?/g;
  const positions = [];
  let match;
  
  while ((match = regex.exec(html)) !== null) {
    positions.push({
      entity: match[0],
      start: match.index,
      end: match.index + match[0].length,
      length: match[0].length
    });
  }
  
  return positions;
}

export {
  hasEntities,
  searchEntities,   
  findEntities,
  validateEntities,
  normalizeEntities,
  countEntities,
  listUniqueEntities,
  getEntityPositions,
};
