import { getCharset, removeAmbiguousChars } from './charsets.js';
import { generateRandomString } from './random-generator.js';
import { validateOptions, validateProcessedCharset } from './validators.js';

/**
 * Generates a random ID with various customization options
 * @param {Object} options - Configuration options
 * @param {number} [options.length=8] - Length of the random part
 * @param {string} [options.prefix=''] - String to prepend to the ID
 * @param {string} [options.suffix=''] - String to append to the ID
 * @param {string} [options.charset='alphanumeric'] - Character set to use or predefined charset name
 * @param {boolean} [options.includeTimestamp=false] - Whether to include timestamp
 * @param {string} [options.separator=''] - Separator between random part and timestamp
 * @param {boolean} [options.secure=false] - Use cryptographically secure random generation
 * @param {boolean} [options.avoidAmbiguous=false] - Exclude ambiguous characters (0, O, 1, I, l)
 * @param {number} [options.minLength=1] - Minimum allowed length
 * @param {number} [options.maxLength=256] - Maximum allowed length
 * @returns {string} Generated ID
 * @throws {Error} When invalid parameters are provided
 */
export function generateId(options = {}) {
  // Input validation and defaults
  const {
    length = 8,
    prefix = '',
    suffix = '',
    charset = 'alphanumeric',
    includeTimestamp = false,
    separator = '',
    secure = false,
    avoidAmbiguous = false
  } = options;

  // Validate all options
  validateOptions(options);

  // Get and process character set
  let chars = getCharset(charset);
  
  if (typeof chars !== 'string' || chars.length === 0) {
    throw new Error('Charset must be a non-empty string or valid charset name');
  }

  // Remove ambiguous characters if requested
  if (avoidAmbiguous) {
    chars = removeAmbiguousChars(chars);
  }

  // Validate processed character set
  validateProcessedCharset(chars, length);

  // Generate random part
  const randomPart = generateRandomString(chars, length, secure);

  // Add timestamp if requested
  let result = randomPart;
  if (includeTimestamp) {
    const timestamp = Date.now().toString(36);
    result = separator ? `${randomPart}${separator}${timestamp}` : `${randomPart}${timestamp}`;
  }

  // Combine with prefix and suffix
  const finalId = `${prefix}${result}${suffix}`;
  
  // Final validation
  if (finalId.length > 1000) {
    console.warn(`Generated ID is very long (${finalId.length} characters). Consider reducing prefix/suffix length.`);
  }

  return finalId;
}