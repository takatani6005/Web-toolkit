import { escapeForRegex } from '../../utils/escape.js';

/**
 * Simple truncation without separator awareness
 * @param {string} str - Input string
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated string
 */
export function truncateSimple(str, maxLength) {
  if (!str || maxLength <= 0) return '';
  if (str.length <= maxLength) return str;
  
  return str.slice(0, maxLength);
}

/**
 * Truncate at separator boundary
 * Tries to cut at the last separator before maxLength
 * @param {string} str - Input string
 * @param {number} maxLength - Maximum length
 * @param {string} separator - Separator character/string
 * @returns {string} Truncated string
 */
export function truncateAtSeparator(str, maxLength, separator = '-') {
  if (!str || maxLength <= 0) return '';
  if (str.length <= maxLength) return str;
  
  // If separator is empty, fall back to simple truncation
  if (separator === '') {
    return truncateSimple(str, maxLength);
  }
  
  let cutPoint = maxLength;
  
  // If the character at maxLength is a separator, we can include it
  if (str.length > maxLength && str[maxLength] === separator) {
    cutPoint = maxLength;
  } else {
    // Find the last separator before maxLength
    for (let i = maxLength - 1; i >= 0; i--) {
      if (str[i] === separator) {
        cutPoint = i;
        break;
      }
    }
  }
  
  const result = str.slice(0, cutPoint);
  
  // Clean up any trailing separator
  const escapedSeparator = escapeForRegex(separator);
  return result.replace(new RegExp(`${escapedSeparator}+$`), '');
}

/**
 * Truncate with word awareness
 * Tries to cut at word boundaries when possible
 * @param {string} str - Input string
 * @param {number} maxLength - Maximum length
 * @param {string} separator - Separator character/string
 * @returns {string} Truncated string
 */
export function truncateAtWord(str, maxLength, separator = '-') {
  if (!str || maxLength <= 0) return '';
  if (str.length <= maxLength) return str;
  
  // Split by separator to get "words"
  const words = separator === '' ? [str] : str.split(separator);
  let result = '';
  let resultLength = 0;
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const nextLength = resultLength + word.length + (i > 0 ? separator.length : 0);
    
    if (nextLength <= maxLength) {
      if (result !== '') {
        result += separator;
        resultLength += separator.length;
      }
      result += word;
      resultLength += word.length;
    } else {
      break;
    }
  }
  
  return result;
}

/**
 * Truncate string for slug with various strategies
 * @param {string} str - Input string
 * @param {number} maxLength - Maximum length
 * @param {string} separator - Separator character/string
 * @param {string} strategy - Truncation strategy: 'simple', 'separator', 'word'
 * @returns {string} Truncated string
 */
export function truncateForSlug(str, maxLength, separator = '-', strategy = 'separator') {
  if (!str || maxLength <= 0) return '';
  if (str.length <= maxLength) return str;
  
  switch (strategy) {
    case 'simple':
      return truncateSimple(str, maxLength);
    case 'word':
      return truncateAtWord(str, maxLength, separator);
    case 'separator':
    default:
      return truncateAtSeparator(str, maxLength, separator);
  }
}

/**
 * Get truncation preview showing different strategies
 * @param {string} str - Input string
 * @param {number} maxLength - Maximum length
 * @param {string} separator - Separator character/string
 * @returns {Object} Preview object with different truncation results
 */
export function getTruncationPreview(str, maxLength, separator = '-') {
  if (!str) {
    return {
      original: str,
      originalLength: 0,
      maxLength,
      needsTruncation: false,
      simple: str,
      separator: str,
      word: str
    };
  }
  
  const needsTruncation = str.length > maxLength;
  
  return {
    original: str,
    originalLength: str.length,
    maxLength,
    needsTruncation,
    simple: truncateSimple(str, maxLength),
    separator: truncateAtSeparator(str, maxLength, separator),
    word: truncateAtWord(str, maxLength, separator)
  };
}

/**
 * Find the optimal cut point for truncation
 * @param {string} str - Input string
 * @param {number} maxLength - Maximum length
 * @param {string} separator - Separator character/string
 * @returns {number} Optimal cut point index
 */
export function findOptimalCutPoint(str, maxLength, separator = '-') {
  if (!str || maxLength <= 0) return 0;
  if (str.length <= maxLength) return str.length;
  
  // If separator is empty, just return maxLength
  if (separator === '') return maxLength;
  
  // Look for separator near the cut point
  let bestCutPoint = maxLength;
  
  // Search backward from maxLength for a separator
  for (let i = maxLength; i >= Math.max(0, maxLength - separator.length * 3); i--) {
    if (str.slice(i, i + separator.length) === separator) {
      bestCutPoint = i;
      break;
    }
  }
  
  return bestCutPoint;
}

/**
 * Validate maxLength parameter
 * @param {*} maxLength - Value to validate
 * @returns {boolean} True if maxLength is valid
 */
export function isValidMaxLength(maxLength) {
  return typeof maxLength === 'number' && 
         !isNaN(maxLength) && 
         isFinite(maxLength) && 
         maxLength >= 0;
}

/**
 * Calculate truncation efficiency (how much of the original string is preserved)
 * @param {string} original - Original string
 * @param {string} truncated - Truncated string
 * @returns {number} Efficiency ratio (0-1)
 */
export function calculateTruncationEfficiency(original, truncated) {
  if (!original) return 1;
  if (!truncated) return 0;
  
  return truncated.length / original.length;
}
