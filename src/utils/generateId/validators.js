/**
 * Validate ID generation options
 * @param {Object} options - Options object to validate
 * @throws {Error} When validation fails
 */
export function validateOptions(options) {
  const {
    length = 8,
    prefix = '',
    suffix = '',
    charset = 'alphanumeric',
    includeTimestamp = false,
    separator = '',
    secure = false,
    avoidAmbiguous = false,
    minLength = 1,
    maxLength = 256
  } = options;

  // Validate length
  if (typeof length !== 'number' || !Number.isInteger(length)) {
    throw new Error('Length must be an integer');
  }
  
  if (length < 0) {
    throw new Error('Length cannot be negative');
  }
  
  // Only apply minLength constraint if it was explicitly set or length > 0
  const effectiveMinLength = options.hasOwnProperty('minLength') ? minLength : (length === 0 ? 0 : 1);
  
  if (length < effectiveMinLength || length > maxLength) {
    throw new Error(`Length must be between ${effectiveMinLength} and ${maxLength}`);
  }

  // Validate string parameters
  if (typeof prefix !== 'string' || typeof suffix !== 'string') {
    throw new Error('Prefix and suffix must be strings');
  }

  if (typeof separator !== 'string') {
    throw new Error('Separator must be a string');
  }

  // Validate charset
  if (typeof charset !== 'string' || charset.length === 0) {
    throw new Error('Charset must be a non-empty string or valid charset name');
  }
}

/**
 * Validate batch generation parameters
 * @param {number} count - Number of IDs to generate
 * @throws {Error} When validation fails
 */
export function validateBatchParams(count) {
  if (typeof count !== 'number' || !Number.isInteger(count) || count < 0) {
    throw new Error('Count must be a non-negative integer');
  }
  
  if (count > 10000) {
    throw new Error('Batch size too large, maximum is 10000');
  }
}

/**
 * Validate that character set has remaining characters after processing
 * @param {string} chars - Processed character set
 * @param {number} length - Requested ID length
 * @throws {Error} When validation fails
 */
export function validateProcessedCharset(chars, length) {
  if (chars.length === 0) {
    throw new Error('No characters remaining after removing ambiguous ones');
  }

  if (length > 0 && chars.length === 0) {
    throw new Error('Cannot generate ID with empty character set');
  }
}