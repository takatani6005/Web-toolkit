import { escapeForRegex } from '../../utils/escape.js';

/**
 * Replace whitespace with separator
 * @param {string} str - Input string
 * @param {string} separator - Separator character/string
 * @returns {string} String with whitespace replaced by separator
 */
export function replaceWhitespace(str, separator = '-') {
  if (!str) return str;
  return str.replace(/\s+/g, separator);
}

/**
 * Remove duplicate separators
 * @param {string} str - Input string
 * @param {string} separator - Separator character/string
 * @returns {string} String with duplicate separators removed
 */
export function removeDuplicateSeparators(str, separator = '-') {
  if (!str || separator === '') return str;
  
  const escapedSeparator = escapeForRegex(separator);
  return str.replace(new RegExp(`${escapedSeparator}+`, 'g'), separator);
}

/**
 * Remove leading and trailing separators
 * @param {string} str - Input string
 * @param {string} separator - Separator character/string
 * @returns {string} String with leading/trailing separators removed
 */
export function trimSeparators(str, separator = '-') {
  if (!str || separator === '') return str;
  
  const escapedSeparator = escapeForRegex(separator);
  return str.replace(new RegExp(`^${escapedSeparator}+|${escapedSeparator}+$`, 'g'), '');
}

/**
 * Clean up separators by removing duplicates and trimming
 * @param {string} str - Input string
 * @param {string} separator - Separator character/string
 * @returns {string} String with clean separators
 */
export function cleanupSeparators(str, separator = '-') {
  if (!str) return str;
  
  // Skip separator cleanup if separator is empty string
  if (separator === '') return str;
  
  let result = str;
  
  // Remove duplicate separators
  result = removeDuplicateSeparators(result, separator);
  
  // Remove leading and trailing separators
  result = trimSeparators(result, separator);
  
  return result;
}

/**
 * Apply separator transformations in the correct order
 * @param {string} str - Input string
 * @param {string} separator - Separator character/string
 * @returns {string} String with separators properly applied
 */
export function applySeparators(str, separator = '-') {
  if (!str) return str;
  
  let result = str;
  
  // Step 1: Replace whitespace with separator
  result = replaceWhitespace(result, separator);
  
  // Step 2: Clean up separators (only if separator is not empty)
  result = cleanupSeparators(result, separator);
  
  return result;
}

/**
 * Validate separator string
 * @param {string} separator - Separator to validate
 * @returns {boolean} True if separator is valid for URLs
 */
export function isValidSeparator(separator) {
  if (typeof separator !== 'string') return false;
  
  // Empty string is valid (no separator)
  if (separator === '') return true;
  
  // Common safe separators
  const safeSeparators = ['-', '_', '.', '~'];
  if (safeSeparators.includes(separator)) return true;
  
  // Check if separator contains only URL-safe characters
  return /^[a-zA-Z0-9\-_.~]*$/.test(separator);
}

/**
 * Get suggested safe separator alternatives
 * @param {string} separator - Original separator
 * @returns {Array} Array of safe separator alternatives
 */
export function getSafeSeparatorAlternatives(separator) {
  const alternatives = ['-', '_', '.', ''];
  
  // If current separator is already safe, return it first
  if (isValidSeparator(separator)) {
    return [separator, ...alternatives.filter(alt => alt !== separator)];
  }
  
  return alternatives;
}

/**
 * Count occurrences of separator in string
 * @param {string} str - Input string
 * @param {string} separator - Separator to count
 * @returns {number} Number of separator occurrences
 */
export function countSeparators(str, separator = '-') {
  if (!str || !separator) return 0;
  
  const escapedSeparator = escapeForRegex(separator);
  const matches = str.match(new RegExp(escapedSeparator, 'g'));
  return matches ? matches.length : 0;
}

/**
 * Preview separator transformations
 * @param {string} str - Input string
 * @param {string} separator - Separator character/string
 * @returns {Object} Preview object showing transformation steps
 */
export function previewSeparatorTransformation(str, separator = '-') {
  if (!str) {
    return {
      original: str,
      afterWhitespaceReplacement: str,
      afterCleanup: str,
      separatorCount: 0
    };
  }
  
  const afterWhitespaceReplacement = replaceWhitespace(str, separator);
  const afterCleanup = cleanupSeparators(afterWhitespaceReplacement, separator);
  
  return {
    original: str,
    afterWhitespaceReplacement,
    afterCleanup,
    separatorCount: countSeparators(afterCleanup, separator)
  };
}