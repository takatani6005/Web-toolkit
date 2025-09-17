import { transliterate } from './transliterate.js';
import { normalizeForSlug } from './normalize.js';
import { sanitizeForSlug } from './sanitize.js';
import { applySeparators } from './separator.js';
import { truncateForSlug } from './truncate.js';

/**
 * Convert a string to a URL-friendly slug
 * @param {*} str - Input string to convert
 * @param {Object} options - Configuration options
 * @param {string} options.separator - Separator character (default: '-')
 * @param {boolean} options.lowercase - Convert to lowercase (default: true)
 * @param {number|null} options.maxLength - Maximum length constraint (default: null)
 * @param {boolean} options.strict - Use strict character filtering (default: false)
 * @param {string} options.truncationStrategy - How to truncate: 'simple', 'separator', 'word' (default: 'separator')
 * @returns {string} URL-friendly slug
 */
export function toSlug(str, options = {}) {
  // Handle null, undefined, and non-string inputs
  if (str == null) {
    return '';
  }
  
  // Convert non-strings to strings
  str = String(str);
  
  const {
    separator = '-',
    lowercase = true,
    maxLength = null,
    strict = false,
    truncationStrategy = 'separator'
  } = options;

  // Handle empty string
  if (!str || str.trim() === '') {
    return '';
  }

  // Handle maxLength of 0 early
  if (maxLength === 0) {
    return '';
  }

  let slug = str;

  // Step 1: Transliterate non-Latin scripts
  slug = transliterate(slug);

  // Step 2: Normalize Unicode and remove diacritics/emojis/symbols
  slug = normalizeForSlug(slug);

  // Step 3: Handle special characters based on strict mode
  slug = sanitizeForSlug(slug, strict);

  // Step 4: Apply separator transformations
  slug = applySeparators(slug, separator);

  // Step 5: Apply lowercase transformation
  if (lowercase) {
    slug = slug.toLowerCase();
  }

  // Step 6: Handle maxLength constraint
  if (maxLength && maxLength > 0) {
    slug = truncateForSlug(slug, maxLength, separator, truncationStrategy);
  }

  return slug;
}

/**
 * Create a slug with detailed processing information
 * @param {*} str - Input string
 * @param {Object} options - Same options as toSlug
 * @returns {Object} Object with slug and processing details
 */
export function toSlugWithDetails(str, options = {}) {
  // Handle null, undefined, and non-string inputs
  if (str == null) {
    return {
      input: str,
      slug: '',
      steps: {
        original: str,
        converted: '',
        transliterated: '',
        normalized: '',
        sanitized: '',
        separated: '',
        lowercased: '',
        truncated: ''
      },
      options
    };
  }
  
  // Convert non-strings to strings
  const converted = String(str);
  
  const {
    separator = '-',
    lowercase = true,
    maxLength = null,
    strict = false,
    truncationStrategy = 'separator'
  } = options;

  const steps = {
    original: str,
    converted: converted
  };

  // Handle empty string
  if (!converted || converted.trim() === '') {
    steps.transliterated = '';
    steps.normalized = '';
    steps.sanitized = '';
    steps.separated = '';
    steps.lowercased = '';
    steps.truncated = '';
    
    return {
      input: str,
      slug: '',
      steps,
      options
    };
  }

  // Handle maxLength of 0 early
  if (maxLength === 0) {
    steps.transliterated = converted;
    steps.normalized = converted;
    steps.sanitized = converted;
    steps.separated = converted;
    steps.lowercased = converted;
    steps.truncated = '';
    
    return {
      input: str,
      slug: '',
      steps,
      options
    };
  }

  let slug = converted;

  // Step 1: Transliterate non-Latin scripts
  slug = transliterate(slug);
  steps.transliterated = slug;

  // Step 2: Normalize Unicode and remove diacritics/emojis/symbols
  slug = normalizeForSlug(slug);
  steps.normalized = slug;

  // Step 3: Handle special characters based on strict mode
  slug = sanitizeForSlug(slug, strict);
  steps.sanitized = slug;

  // Step 4: Apply separator transformations
  slug = applySeparators(slug, separator);
  steps.separated = slug;

  // Step 5: Apply lowercase transformation
  if (lowercase) {
    slug = slug.toLowerCase();
  }
  steps.lowercased = slug;

  // Step 6: Handle maxLength constraint
  if (maxLength && maxLength > 0) {
    slug = truncateForSlug(slug, maxLength, separator, truncationStrategy);
  }
  steps.truncated = slug;

  return {
    input: str,
    slug,
    steps,
    options
  };
}

/**
 * Batch convert multiple strings to slugs
 * @param {Array} strings - Array of strings to convert
 * @param {Object} options - Same options as toSlug
 * @returns {Array} Array of slug results
 */
export function batchToSlug(strings, options = {}) {
  if (!Array.isArray(strings)) {
    throw new TypeError('First argument must be an array');
  }
  
  return strings.map(str => toSlug(str, options));
}

/**
 * Check if a string would make a good slug (minimal changes needed)
 * @param {string} str - String to check
 * @param {Object} options - Same options as toSlug
 * @returns {Object} Analysis of slug-readiness
 */
export function analyzeSlugReadiness(str, options = {}) {
  const result = toSlugWithDetails(str, options);
  
  const changes = [];
  const steps = result.steps;
  
  if (steps.original !== steps.converted) {
    changes.push('type_conversion');
  }
  if (steps.converted !== steps.transliterated) {
    changes.push('transliteration');
  }
  if (steps.transliterated !== steps.normalized) {
    changes.push('normalization');
  }
  if (steps.normalized !== steps.sanitized) {
    changes.push('sanitization');
  }
  if (steps.sanitized !== steps.separated) {
    changes.push('separation');
  }
  if (steps.separated !== steps.lowercased) {
    changes.push('case_conversion');
  }
  if (steps.lowercased !== steps.truncated) {
    changes.push('truncation');
  }
  
  const score = Math.max(0, 100 - (changes.length * 15)); // Rough scoring
  
  return {
    input: str,
    slug: result.slug,
    readinessScore: score,
    changesNeeded: changes,
    isSlugReady: changes.length === 0,
    steps: result.steps
  };
}

// Re-export utilities for direct use
export { transliterate } from './transliterate.js';
export { normalizeForSlug, removeDiacritics, removeEmojis } from './normalize.js';
export { sanitizeForSlug, sanitizeStrict, sanitizeNonStrict } from './sanitize.js';
export { applySeparators, cleanupSeparators } from './separator.js';
export { truncateForSlug, truncateAtSeparator, truncateAtWord } from './truncate.js';