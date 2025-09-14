
/**
 * Strip HTML tags from string
 * @param {string} str - String with HTML tags
 * @param {Object} options - Options
 * @param {string[]} options.allowedTags - Tags to keep (e.g., ['b', 'i'])
 * @returns {string} String with tags removed
 */
function stripHtmlTags(str, options = {}) {
  if (typeof str !== 'string') {
    throw new TypeError('Input must be a string');
  }
  
  const { allowedTags = [] } = options;
  
  if (allowedTags.length === 0) {
    // Remove all tags
    return str.replace(/<[^>]*>/g, '');
  }
  
  // Create regex for allowed tags
  const allowedPattern = allowedTags.map(tag => `${tag}|/${tag}`).join('|');
  const allowedRegex = new RegExp(`<(?!(?:${allowedPattern})(?:\\s|>))[^>]*>`, 'gi');
  
  return str.replace(allowedRegex, '');
}

/**
 * Safely truncate HTML string without breaking tags
 * @param {string} str - HTML string to truncate
 * @param {number} length - Maximum length
 * @param {Object} options - Options
 * @param {string} options.ellipsis - Ellipsis string (default: '...')
 * @param {boolean} options.stripTags - Strip tags before truncating (default: false)
 * @returns {string} Truncated string
 */
function truncateHtmlSafe(str, length, options = {}) {
  if (typeof str !== 'string') {
    throw new TypeError('Input must be a string');
  }
  
  if (typeof length !== 'number' || length < 0) {
    throw new TypeError('Length must be a non-negative number');
  }
  
  const { ellipsis = '...', stripTags = false } = options;
  
  if (stripTags) {
    const plainText = stripHtmlTags(str);
    if (plainText.length <= length) return plainText;
    return plainText.substring(0, length - ellipsis.length) + ellipsis;
  }
  
  // For HTML, we need to be more careful about tag boundaries
  let result = '';
  let textLength = 0;
  let inTag = false;
  let i = 0;
  
  while (i < str.length && textLength < length) {
    const char = str[i];
    
    if (char === '<') {
      inTag = true;
      result += char;
    } else if (char === '>') {
      inTag = false;
      result += char;
    } else if (inTag) {
      result += char;
    } else {
      // Regular character
      if (textLength < length) {
        result += char;
        textLength++;
      } else {
        break;
      }
    }
    i++;
  }
  
  // If we truncated, add ellipsis and ensure tags are balanced
  if (textLength >= length && i < str.length) {
    result = balanceHtmlTags(result) + ellipsis;
  }
  
  return result;
}

/**
 * Balance HTML tags in a potentially truncated string
 * @param {string} str - String to balance
 * @returns {string} Balanced string
 */
function balanceHtmlTags(str) {
  const selfClosingTags = new Set(['br', 'hr', 'img', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr']);
  const stack = [];
  const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)[^>]*>/g;
  let match;
  
  // Find all tags and track open ones
  while ((match = tagRegex.exec(str)) !== null) {
    const fullTag = match[0];
    const tagName = match[1].toLowerCase();
    
    if (fullTag.startsWith('</')) {
      // Closing tag
      const lastIndex = stack.findLastIndex(tag => tag === tagName);
      if (lastIndex !== -1) {
        stack.splice(lastIndex, 1);
      }
    } else if (!selfClosingTags.has(tagName) && !fullTag.endsWith('/>')) {
      // Opening tag
      stack.push(tagName);
    }
  }
  
  // Close remaining open tags
  let result = str;
  for (let i = stack.length - 1; i >= 0; i--) {
    result += `</${stack[i]}>`;
  }
  
  return result;
}

/**
 * Recursively encode all string values in nested objects/arrays
 * @param {*} data - Data structure to encode
 * @param {Object} options - Options
 * @param {string} options.method - Encoding method
 * @param {number} options.maxDepth - Maximum recursion depth (default: 10)
 * @param {Set} options._visited - Internal: visited objects (for circular reference detection)
 * @param {number} options._currentDepth - Internal: current depth
 * @returns {*} New data structure with encoded values
 */
function deepEncode(data, options = {}) {
  const { 
    method = 'minimal', 
    maxDepth = 10, 
    _visited = new WeakSet(), 
    _currentDepth = 0 
  } = options;
  
  // Depth check
  if (_currentDepth >= maxDepth) {
    return data;
  }
  
  // Handle primitives
  if (data === null || typeof data !== 'object') {
    return typeof data === 'string' ? getEncoder(method)(data) : data;
  }
  
  // Circular reference check
  if (_visited.has(data)) {
    return '[Circular Reference]';
  }
  _visited.add(data);
  
  const newOptions = { 
    ...options, 
    _visited, 
    _currentDepth: _currentDepth + 1 
  };
  
  try {
    if (Array.isArray(data)) {
      return data.map(item => deepEncode(item, newOptions));
    }
    
    // Handle plain objects
    const result = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = deepEncode(value, newOptions);
    }
    return result;
  } finally {
    _visited.delete(data);
  }
}

/**
 * Recursively decode all string values in nested objects/arrays
 * @param {*} data - Data structure to decode
 * @param {Object} options - Options
 * @param {number} options.maxDepth - Maximum recursion depth (default: 10)
 * @param {Set} options._visited - Internal: visited objects
 * @param {number} options._currentDepth - Internal: current depth
 * @returns {*} New data structure with decoded values
 */
function deepDecode(data, options = {}) {
  const { 
    maxDepth = 10, 
    _visited = new WeakSet(), 
    _currentDepth = 0 
  } = options;
  
  // Depth check
  if (_currentDepth >= maxDepth) {
    return data;
  }
  
  // Handle primitives
  if (data === null || typeof data !== 'object') {
    return typeof data === 'string' ? decodeHtml(data) : data;
  }
  
  // Circular reference check
  if (_visited.has(data)) {
    return '[Circular Reference]';
  }
  _visited.add(data);
  
  const newOptions = { 
    ...options, 
    _visited, 
    _currentDepth: _currentDepth + 1 
  };
  
  try {
    if (Array.isArray(data)) {
      return data.map(item => deepDecode(item, newOptions));
    }
    
    const result = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = deepDecode(value, newOptions);
    }
    return result;
  } finally {
    _visited.delete(data);
  }
}


/**
 * Get encoder function by method name
 * @param {string} method - Encoding method name
 * @returns {Function} Encoder function
 */
function getEncoder(method) {
  const encoders = {
    minimal: encodeHtmlMinimal,
    attribute: encodeHtmlAttribute,
    text: encodeHtmlText,
    js: encodeHtmlJsString,
    javascript: encodeHtmlJsString,
    url: encodeHtmlUrlParam,
    css: escapeCss
  };
  
  return encoders[method] || encodeHtmlMinimal;
}

export {
  stripHtmlTags,
  truncateHtmlSafe,
  balanceHtmlTags,
  deepEncode,
  deepDecode
};
