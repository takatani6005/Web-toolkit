
/**
 * Get detailed statistics about entities in string
 * @param {string} str - String to analyze
 * @returns {Object} Detailed statistics
 */
function getEntityStats(str) {
  if (typeof str !== 'string') {
    return {
      total: 0,
      unique: 0,
      named: 0,
      numeric: 0,
      decimal: 0,
      hexadecimal: 0,
      frequencies: {},
      types: {}
    };
  }
  
  const entities = findEntities(str);
  const frequencies = {};
  const types = {
    named: [],
    decimal: [],
    hexadecimal: []
  };
  
  entities.forEach(entity => {
    frequencies[entity] = (frequencies[entity] || 0) + 1;
    
    if (entity.startsWith('&#x') || entity.startsWith('&#X')) {
      types.hexadecimal.push(entity);
    } else if (entity.startsWith('&#')) {
      types.decimal.push(entity);
    } else {
      types.named.push(entity);
    }
  });
  
  return {
    total: entities.length,
    unique: Object.keys(frequencies).length,
    named: types.named.length,
    numeric: types.decimal.length + types.hexadecimal.length,
    decimal: types.decimal.length,
    hexadecimal: types.hexadecimal.length,
    frequencies,
    types
  };
}
// 1️⃣ Advanced Statistics

/**
 * Returns frequency map of entities for easy graphing/analysis
 * @param {string} html - HTML string to analyze
 * @returns {Object} Object with entity names as keys and counts as values
 */
function getEntityFrequencyMap(html) {
  const entities = findEntities(html);
  const frequencyMap = {};
  
  entities.forEach(entity => {
    const entityName = entity.entity;
    frequencyMap[entityName] = (frequencyMap[entityName] || 0) + 1;
  });
  
  return frequencyMap;
}

// 2️⃣ Check & Compare

/**
 * Compares entity usage between two HTML strings
 * @param {string} htmlA - First HTML string
 * @param {string} htmlB - Second HTML string  
 * @returns {Object} Comparison statistics
 */
function compareEntityUsage(htmlA, htmlB) {
  const freqA = getEntityFrequencyMap(htmlA);
  const freqB = getEntityFrequencyMap(htmlB);
  
  const allEntities = new Set([...Object.keys(freqA), ...Object.keys(freqB)]);
  const comparison = {};
  
  allEntities.forEach(entity => {
    const countA = freqA[entity] || 0;
    const countB = freqB[entity] || 0;
    
    comparison[entity] = {
      countA,
      countB,
      difference: countB - countA,
      percentChange: countA > 0 ? ((countB - countA) / countA * 100).toFixed(2) : countB > 0 ? 'new' : 0
    };
  });
  
  return {
    totalEntitiesA: Object.keys(freqA).length,
    totalEntitiesB: Object.keys(freqB).length,
    totalCountA: Object.values(freqA).reduce((sum, count) => sum + count, 0),
    totalCountB: Object.values(freqB).reduce((sum, count) => sum + count, 0),
    entityComparison: comparison,
    uniqueToA: Object.keys(freqA).filter(entity => !freqB[entity]),
    uniqueToB: Object.keys(freqB).filter(entity => !freqA[entity]),
    common: Object.keys(freqA).filter(entity => freqB[entity])
  };
}

/**
 * Lists entities that appear in htmlB but not in htmlA
 * @param {string} htmlA - Reference HTML string
 * @param {string} htmlB - Comparison HTML string
 * @returns {Array} Array of entities unique to htmlB
 */
function diffEntities(htmlA, htmlB) {
  const entitiesA = new Set(Object.keys(getEntityFrequencyMap(htmlA)));
  const entitiesB = new Set(Object.keys(getEntityFrequencyMap(htmlB)));
  
  return Array.from(entitiesB).filter(entity => !entitiesA.has(entity));
}

// 3️⃣ Sort & Group

/**
 * Groups entities by their type/category
 * @param {string} html - HTML string to analyze
 * @returns {Object} Grouped entities by type
 */
function groupEntitiesByType(html) {
  const entities = findEntities(html);
  const groups = {
    named: [],           // &amp; &lt; etc.
    numeric: [],         // &#123;
    hexadecimal: [],     // &#x1F;
    accented: [],        // &aacute; &ecirc; etc.
    symbols: [],         // &copy; &trade; etc.
    mathematical: [],    // &sum; &int; etc.
    arrows: [],          // &larr; &rarr; etc.
    greek: [],          // &alpha; &beta; etc.
    malformed: []       // Missing semicolons or invalid
  };
  
  entities.forEach(entityObj => {
    const entity = entityObj.entity;
    
    // Check for malformed entities (missing semicolon)
    if (!entity.endsWith(';')) {
      groups.malformed.push(entity);
      return;
    }
    
    // Numeric entities
    if (entity.match(/&#[0-9]+;/)) {
      groups.numeric.push(entity);
    }
    // Hexadecimal entities  
    else if (entity.match(/&#x[0-9a-fA-F]+;/i)) {
      groups.hexadecimal.push(entity);
    }
    // Named entities - categorize further
    else {
      const name = entity.slice(1, -1).toLowerCase();
      
      // Greek letters
      if (name.match(/^(alpha|beta|gamma|delta|epsilon|zeta|eta|theta|iota|kappa|lambda|mu|nu|xi|omicron|pi|rho|sigma|tau|upsilon|phi|chi|psi|omega)$/)) {
        groups.greek.push(entity);
      }
      // Accented characters
      else if (name.match(/^[a-z](acute|grave|circ|tilde|uml|ring|cedil|slash)$/)) {
        groups.accented.push(entity);
      }
      // Mathematical symbols
      else if (name.match(/^(sum|prod|int|part|nabla|radic|prop|infin|ang|and|or|cap|cup|sub|sup|sube|supe|oplus|otimes|perp)$/)) {
        groups.mathematical.push(entity);
      }
      // Arrows
      else if (name.match(/(arr|hArr)/)) {
        groups.arrows.push(entity);
      }
      // Symbols (copyright, trademark, etc.)
      else if (name.match(/^(copy|reg|trade|sect|para|middot|ordm|ordf|laquo|raquo|iquest|iexcl|brvbar|not|shy|macr|deg|plusmn|sup[123]|frac[1234]|micro|pilcrow|cedil|sup1|ordm|raquo|frac14|frac12|frac34|iquest)$/)) {
        groups.symbols.push(entity);
      }
      // Basic named entities
      else {
        groups.named.push(entity);
      }
    }
  });
  
  return groups;
}

/**
 * Detects encoding issues and malformed entities
 * @param {string} html - HTML string to analyze
 * @returns {Object} Issues found
 */
function detectEncodingIssues(html) {
  const issues = {
    missingSemicolons: [],
    invalidNumeric: [],
    invalidHex: [],
    unknownNamed: [],
    doubleEncoded: [],
    nonStandardSpacing: []
  };
  
  // Find potential entities without semicolons
  const regex = /&(?:#(?:x[0-9a-fA-F]+|[0-9]+)|[a-zA-Z][a-zA-Z0-9]*)/g;
  let match;
  
  while ((match = regex.exec(html)) !== null) {
    const entity = match[0];
    const nextChar = html[match.index + entity.length];
    
    // Check if missing semicolon
    if (nextChar && nextChar !== ';') {
      // Look ahead to see if there should be a semicolon
      const withSemicolon = entity + ';';
      if (isValidEntity(withSemicolon)) {
        issues.missingSemicolons.push({
          entity: entity,
          position: match.index,
          suggested: withSemicolon
        });
      }
    }
  }
  
  // Find double-encoded entities
  const doubleEncodedRegex = /&amp;(?:#(?:x[0-9a-fA-F]+|[0-9]+)|[a-zA-Z][a-zA-Z0-9]*);?/g;
  while ((match = doubleEncodedRegex.exec(html)) !== null) {
    issues.doubleEncoded.push({
      entity: match[0],
      position: match.index,
      suggested: match[0].replace('&amp;', '&')
    });
  }
  
  return issues;
}

// Helper function to check if entity is valid (simplified)
function isValidEntity(entity) {
  const commonEntities = ['&amp;', '&lt;', '&gt;', '&quot;', '&apos;', '&nbsp;', '&copy;', '&reg;'];
  return commonEntities.includes(entity) || 
         entity.match(/&#[0-9]+;/) || 
         entity.match(/&#x[0-9a-fA-F]+;/i);
}

// 4️⃣ Optimization Support

/**
 * Suggests encoding optimizations to reduce string size
 * @param {string} html - HTML string to analyze
 * @returns {Object} Optimization suggestions
 */
function suggestEncodingOptimization(html) {
  const entities = findEntities(html);
  const suggestions = {
    canBeUnencoded: [],
    shouldStayEncoded: [],
    sizeSavings: 0
  };
  
  entities.forEach(entityObj => {
    const entity = entityObj.entity;
    const decoded = decodeEntity(entity);
    
    // Only suggest unencoding for safe characters
    if (decoded && isSafeToUnencode(decoded, entity)) {
      const savings = entity.length - decoded.length;
      if (savings > 0) {
        suggestions.canBeUnencoded.push({
          entity: entity,
          decoded: decoded,
          savings: savings,
          occurrences: getEntityFrequencyMap(html)[entity] || 1
        });
        suggestions.sizeSavings += savings * (getEntityFrequencyMap(html)[entity] || 1);
      }
    } else {
      suggestions.shouldStayEncoded.push({
        entity: entity,
        reason: getSafetyReason(entity, decoded)
      });
    }
  });
  
  return suggestions;
}

/**
 * Estimates the size of string after encoding
 * @param {string} text - Text to estimate encoding for
 * @param {Object} options - Encoding options
 * @returns {Object} Size estimation
 */
function estimateEncodedSize(text, options = {}) {
  const { encodeAll = false, encodeUnsafe = true } = options;
  
  let estimatedSize = 0;
  const characters = Array.from(text);
  
  characters.forEach(char => {
    if (shouldEncode(char, encodeAll, encodeUnsafe)) {
      // Estimate entity size
      const entity = getEntityForCharacter(char);
      estimatedSize += entity ? entity.length : char.length;
    } else {
      estimatedSize += char.length;
    }
  });
  
  return {
    originalSize: text.length,
    estimatedEncodedSize: estimatedSize,
    sizeDifference: estimatedSize - text.length,
    compressionRatio: (estimatedSize / text.length).toFixed(2)
  };
}

// Helper functions
function decodeEntity(entity) {
  // Simplified decoder - in real implementation, use your decode functionality
  const decodeMap = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': "'",
    '&nbsp;': ' '
  };
  return decodeMap[entity] || entity;
}

function isSafeToUnencode(decoded, entity) {
  // Characters that should stay encoded for safety
  const mustStayEncoded = ['<', '>', '"', "'", '&'];
  return !mustStayEncoded.includes(decoded);
}

function getSafetyReason(entity, decoded) {
  if (['&lt;', '&gt;', '&amp;'].includes(entity)) return 'HTML syntax safety';
  if (['&quot;', '&apos;'].includes(entity)) return 'Attribute safety';
  if (entity === '&nbsp;') return 'Non-breaking space formatting';
  return 'Unknown character or special formatting';
}

function shouldEncode(char, encodeAll, encodeUnsafe) {
  const unsafeChars = ['<', '>', '&', '"', "'"];
  const nonAscii = char.charCodeAt(0) > 127;
  
  return encodeAll || (encodeUnsafe && (unsafeChars.includes(char) || nonAscii));
}

function getEntityForCharacter(char) {
  const entityMap = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    "'": '&apos;'
  };
  return entityMap[char] || `&#${char.charCodeAt(0)};`;
}

// 5️⃣ Reporting & Exporting

/**
 * Generates comprehensive entity report
 * @param {string} html - HTML string to analyze
 * @param {string} format - Output format ('json' or 'csv')
 * @returns {string|Object} Report in requested format
 */
function generateEntityReport(html, format = 'json') {
  const frequencyMap = getEntityFrequencyMap(html);
  const positions = getEntityPositions(html);
  const groups = groupEntitiesByType(html);
  const issues = detectEncodingIssues(html);
  const optimization = suggestEncodingOptimization(html);
  
  const report = {
    metadata: {
      generatedAt: new Date().toISOString(),
      htmlLength: html.length,
      totalEntities: positions.length,
      uniqueEntities: Object.keys(frequencyMap).length
    },
    frequency: frequencyMap,
    positions: positions,
    groups: groups,
    issues: issues,
    optimization: optimization,
    summary: summarizeEntities(html)
  };
  
  if (format === 'csv') {
    return convertReportToCSV(report);
  }
  
  return report;
}

/**
 * Returns summary statistics about entities
 * @param {string} html - HTML string to analyze
 * @returns {Object} Summary statistics
 */
function summarizeEntities(html) {
  const frequencyMap = getEntityFrequencyMap(html);
  const totalCount = Object.values(frequencyMap).reduce((sum, count) => sum + count, 0);
  const groups = groupEntitiesByType(html);
  
  // Calculate top entities
  const sortedEntities = Object.entries(frequencyMap)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);
  
  // Calculate special character percentage
  const specialCharCount = html.match(/[^\x00-\x7F]/g)?.length || 0;
  const specialCharPercentage = ((specialCharCount / html.length) * 100).toFixed(2);
  
  return {
    totalEntities: totalCount,
    uniqueEntities: Object.keys(frequencyMap).length,
    top10Entities: sortedEntities.map(([entity, count]) => ({ entity, count })),
    specialCharacterPercentage: specialCharPercentage,
    groupSummary: Object.fromEntries(
      Object.entries(groups).map(([type, entities]) => [type, entities.length])
    ),
    averageEntityLength: totalCount > 0 ? 
      (Object.entries(frequencyMap).reduce((sum, [entity, count]) => 
        sum + (entity.length * count), 0) / totalCount).toFixed(2) : 0,
    encodingEfficiency: calculateEncodingEfficiency(html, frequencyMap)
  };
}

// Helper function to convert report to CSV
function convertReportToCSV(report) {
  const csvRows = ['Entity,Count,Type,First_Position'];
  
  Object.entries(report.frequency).forEach(([entity, count]) => {
    const position = report.positions.find(p => p.entity === entity)?.start || 0;
    const type = findEntityType(entity, report.groups);
    csvRows.push(`"${entity}",${count},${type},${position}`);
  });
  
  return csvRows.join('\n');
}

function findEntityType(entity, groups) {
  for (const [type, entities] of Object.entries(groups)) {
    if (entities.includes(entity)) return type;
  }
  return 'unknown';
}

function calculateEncodingEfficiency(html, frequencyMap) {
  const totalEntityChars = Object.entries(frequencyMap)
    .reduce((sum, [entity, count]) => sum + (entity.length * count), 0);
  const totalChars = html.length;
  
  return ((totalChars - totalEntityChars) / totalChars * 100).toFixed(2);
}

export {
  getEntityStats,
  getEntityFrequencyMap,
  compareEntityUsage,
  diffEntities,
  groupEntitiesByType,
  detectEncodingIssues,
  suggestEncodingOptimization,
  estimateEncodedSize,
  generateEntityReport,
  summarizeEntities,
};
