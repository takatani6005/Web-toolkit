import { BASE_CHARSETS } from './charsets.js';

/**
 * Validate if a string could be a generated ID with given options
 * @param {string} id - ID to validate
 * @param {Object} options - Options used to generate the ID
 * @returns {boolean} Whether the ID matches the expected pattern
 */
export function validateId(id, options = {}) {
  const {
    prefix = '',
    suffix = '',
    charset = 'alphanumeric',
    includeTimestamp = false,
    separator = '',
    avoidAmbiguous = false
  } = options;

  if (typeof id !== 'string') {
    return false;
  }

  // Check prefix and suffix
  if (!id.startsWith(prefix) || !id.endsWith(suffix)) {
    return false;
  }

  // Remove prefix and suffix
  let core = id.slice(prefix.length);
  if (suffix.length > 0) {
    core = core.slice(0, -suffix.length);
  }

  // Handle timestamp if included
  if (includeTimestamp && separator) {
    const parts = core.split(separator);
    if (parts.length !== 2) {
      return false;
    }
    core = parts[0];
    // Validate timestamp part (should be base36)
    if (!/^[0-9a-z]+$/.test(parts[1])) {
      return false;
    }
  }

  // Get expected character set
  let chars = BASE_CHARSETS[charset] || charset;
  
  if (avoidAmbiguous) {
    chars = chars.replace(/[0OIl1]/g, '');
  }

  // Create regex to validate characters
  const escapedChars = chars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`^[${escapedChars}]*$`);

  return regex.test(core);
}

/**
 * Validate timestamp format in ID
 * @param {string} timestamp - Timestamp string to validate
 * @returns {boolean} Whether timestamp is valid base36
 */
export function validateTimestamp(timestamp) {
  return /^[0-9a-z]+$/.test(timestamp);
}

/**
 * Extract and validate components of an ID
 * @param {string} id - ID to analyze
 * @param {Object} options - Options used to generate the ID
 * @returns {Object} Extracted components or null if invalid
 */
export function extractIdComponents(id, options = {}) {
  if (!validateId(id, options)) {
    return null;
  }

  const {
    prefix = '',
    suffix = '',
    includeTimestamp = false,
    separator = ''
  } = options;

  // Extract core
  let core = id.slice(prefix.length);
  if (suffix.length > 0) {
    core = core.slice(0, -suffix.length);
  }

  const components = {
    prefix,
    suffix,
    core,
    randomPart: core,
    timestamp: null
  };

  // Handle timestamp extraction
  if (includeTimestamp && separator) {
    const parts = core.split(separator);
    if (parts.length === 2) {
      components.randomPart = parts[0];
      components.timestamp = parts[1];
    }
  }

  return components;
}