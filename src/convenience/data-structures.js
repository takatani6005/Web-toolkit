
/**
 * Encode array of strings
 * @param {string[]} arr - Array of strings to encode
 * @param {string} method - Encoding method ('minimal', 'attribute', 'text')
 * @returns {string[]} Array of encoded strings
 */
function encodeArray(arr, method = 'minimal') {
  if (!Array.isArray(arr)) {
    throw new TypeError('Input must be an array');
  }
  
  const encoder = {
    minimal: encodeHtmlMinimal,
    attribute: encodeHtmlAttribute,
    text: encodeHtmlText,
    js: encodeHtmlJsString,
    url: encodeHtmlUrlParam
  }[method] || encodeHtmlMinimal;
  
  return arr.map(item => typeof item === 'string' ? encoder(item) : item);
}

/**
 * Decode array of HTML strings
 * @param {string[]} arr - Array of HTML strings to decode
 * @returns {string[]} Array of decoded strings
 */
function decodeArray(arr) {
  if (!Array.isArray(arr)) {
    throw new TypeError('Input must be an array');
  }
  
  return arr.map(item => typeof item === 'string' ? decodeHtml(item) : item);
}

/**
 * Encode all string values in an object
 * @param {Object} obj - Object to encode
 * @param {Object} options - Options
 * @param {string} options.method - Encoding method ('minimal', 'attribute', 'text', 'js', 'url')
 * @param {string[]} options.exclude - Keys to exclude from encoding
 * @param {string[]} options.include - Only encode these keys (if specified)
 * @returns {Object} New object with encoded values
 */
function encodeObjectValues(obj, options = {}) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    throw new TypeError('Input must be a plain object');
  }
  
  const { method = 'minimal', exclude = [], include = null } = options;
  const encoder = getEncoder(method);
  const result = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (exclude.includes(key)) {
      result[key] = value;
      continue;
    }
    
    if (include && !include.includes(key)) {
      result[key] = value;
      continue;
    }
    
    if (typeof value === 'string') {
      result[key] = encoder(value);
    } else {
      result[key] = value;
    }
  }
  
  return result;
}

/**
 * Decode all string values in an object
 * @param {Object} obj - Object to decode
 * @param {Object} options - Options
 * @param {string[]} options.exclude - Keys to exclude from decoding
 * @param {string[]} options.include - Only decode these keys (if specified)
 * @returns {Object} New object with decoded values
 */
function decodeObjectValues(obj, options = {}) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    throw new TypeError('Input must be a plain object');
  }
  
  const { exclude = [], include = null } = options;
  const result = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (exclude.includes(key)) {
      result[key] = value;
      continue;
    }
    
    if (include && !include.includes(key)) {
      result[key] = value;
      continue;
    }
    
    if (typeof value === 'string') {
      result[key] = decodeHtml(value);
    } else {
      result[key] = value;
    }
  }
  
  return result;
}

export {
  encodeArray,
  decodeArray,
  encodeObjectValues,
  decodeObjectValues
};
