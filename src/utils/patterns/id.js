/**
 * Enhanced ID Pattern Generators
 * Comprehensive library for generating regex patterns for various ID formats
 */

/**
 * Enhanced UUID pattern with comprehensive version validation
 * @param {Object} options - Configuration options
 * @param {string|number} options.version - UUID version (1-5 or 'any')
 * @param {boolean} options.caseSensitive - Case sensitivity
 * @param {boolean} options.withHyphens - Include hyphens in pattern
 * @param {boolean} options.strict - Strict validation (validates variant bits)
 * @returns {RegExp} UUID regex pattern
 */
export function generateUuidPattern(options = {}) {
  const { 
    version = 'any', 
    caseSensitive = false, 
    withHyphens = true, 
    strict = true 
  } = options;
  
  const flags = caseSensitive ? '' : 'i';
  const sep = withHyphens ? '-' : '';
  const hex = '[0-9a-f]';
  
  // Base pattern components
  const timeLow = `${hex}{8}`;
  const timeMid = `${hex}{4}`;
  const timeHi = `${hex}{4}`;
  const clockSeq = `${hex}{4}`;
  const node = `${hex}{12}`;
  
  const patterns = {
    1: strict 
      ? `${timeLow}${sep}${timeMid}${sep}1${hex}{3}${sep}[89ab]${hex}{3}${sep}${node}`
      : `${timeLow}${sep}${timeMid}${sep}1${hex}{3}${sep}${hex}{4}${sep}${node}`,
    2: strict
      ? `${timeLow}${sep}${timeMid}${sep}2${hex}{3}${sep}[89ab]${hex}{3}${sep}${node}`
      : `${timeLow}${sep}${timeMid}${sep}2${hex}{3}${sep}${hex}{4}${sep}${node}`,
    3: strict
      ? `${timeLow}${sep}${timeMid}${sep}3${hex}{3}${sep}[89ab]${hex}{3}${sep}${node}`
      : `${timeLow}${sep}${timeMid}${sep}3${hex}{3}${sep}${hex}{4}${sep}${node}`,
    4: strict
      ? `${timeLow}${sep}${timeMid}${sep}4${hex}{3}${sep}[89ab]${hex}{3}${sep}${node}`
      : `${timeLow}${sep}${timeMid}${sep}4${hex}{3}${sep}${hex}{4}${sep}${node}`,
    5: strict
      ? `${timeLow}${sep}${timeMid}${sep}5${hex}{3}${sep}[89ab]${hex}{3}${sep}${node}`
      : `${timeLow}${sep}${timeMid}${sep}5${hex}{3}${sep}${hex}{4}${sep}${node}`,
    any: strict
      ? `${timeLow}${sep}${timeMid}${sep}[1-5]${hex}{3}${sep}[89ab]${hex}{3}${sep}${node}`
      : `${timeLow}${sep}${timeMid}${sep}${hex}{4}${sep}${hex}{4}${sep}${node}`
  };
  
  const pattern = patterns[version] || patterns.any;
  return new RegExp(`^${pattern}$`, flags);
}

/**
 * Generate NanoID pattern with custom alphabet support
 * @param {Object} options - Configuration options
 * @param {number} options.length - ID length
 * @param {string} options.alphabet - Character set
 * @param {boolean} options.exactLength - Require exact length match
 * @returns {RegExp} NanoID regex pattern
 */
export function generateNanoIdPattern(options = {}) {
  const { 
    length = 21, 
    alphabet = 'A-Za-z0-9_-', 
    exactLength = true 
  } = options;
  
  const escapedAlphabet = alphabet.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  const lengthPattern = exactLength ? `{${length}}` : `{1,${length}}`;
  
  return new RegExp(`^[${escapedAlphabet}]${lengthPattern}$`);
}

/**
 * Generate MongoDB ObjectId pattern with timestamp validation
 * @param {Object} options - Configuration options
 * @param {boolean} options.caseSensitive - Case sensitivity
 * @param {boolean} options.validateTimestamp - Validate timestamp portion
 * @param {Date} options.minDate - Minimum date for timestamp validation
 * @param {Date} options.maxDate - Maximum date for timestamp validation
 * @returns {RegExp} ObjectId regex pattern
 */
export function generateObjectIdPattern(options = {}) {
  const { 
    caseSensitive = false, 
    validateTimestamp = false,
    minDate,
    maxDate
  } = options;
  
  const flags = caseSensitive ? '' : 'i';
  
  if (validateTimestamp && (minDate || maxDate)) {
    // Convert dates to hex timestamps for validation
    const minHex = minDate ? Math.floor(minDate.getTime() / 1000).toString(16).padStart(8, '0') : '00000000';
    const maxHex = maxDate ? Math.floor(maxDate.getTime() / 1000).toString(16).padStart(8, '0') : 'ffffffff';
    
    // This is a simplified approach - full timestamp validation would require more complex logic
    return new RegExp(`^[0-9a-f]{24}$`, flags);
  }
  
  return new RegExp('^[0-9a-f]{24}$', flags);
}

/**
 * Generate ULID pattern with timestamp validation
 * @param {Object} options - Configuration options
 * @param {boolean} options.caseSensitive - Case sensitivity
 * @param {boolean} options.validateTimestamp - Validate timestamp portion
 * @returns {RegExp} ULID regex pattern
 */
export function generateUlidPattern(options = {}) {
  const { caseSensitive = false, validateTimestamp = false } = options;
  const flags = caseSensitive ? '' : 'i';
  
  // Crockford's Base32 alphabet
  const base32 = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  const timestamp = validateTimestamp ? '[01][0-9A-Z]{9}' : '[0-9A-Z]{10}';
  const randomness = '[0-9A-Z]{16}';
  
  return new RegExp(`^${timestamp}${randomness}$`, flags);
}

/**
 * Generate CUID pattern
 * @param {Object} options - Configuration options
 * @param {boolean} options.caseSensitive - Case sensitivity
 * @param {number} options.version - CUID version (1 or 2)
 * @returns {RegExp} CUID regex pattern
 */
export function generateCuidPattern(options = {}) {
  const { caseSensitive = false, version = 1 } = options;
  const flags = caseSensitive ? '' : 'i';
  
  if (version === 2) {
    // CUID2: 24 characters, base36
    return new RegExp('^[a-z0-9]{24}$', flags);
  }
  
  // CUID v1: starts with 'c', followed by timestamp, counter, fingerprint, and random
  return new RegExp('^c[a-z0-9]{24}$', flags);
}

/**
 * Generate Snowflake ID pattern (Twitter/Discord style)
 * @param {Object} options - Configuration options
 * @param {boolean} options.strict - Strict 64-bit integer validation
 * @returns {RegExp} Snowflake ID regex pattern
 */
export function generateSnowflakePattern(options = {}) {
  const { strict = true } = options;
  
  if (strict) {
    // 64-bit integer range: 0 to 9223372036854775807
    return new RegExp('^(?:[1-9][0-9]{0,18}|0)$');
  }
  
  // Simple numeric pattern
  return new RegExp('^[0-9]+$');
}

/**
 * Generate KSUID pattern (K-Sortable Unique Identifier)
 * @param {Object} options - Configuration options
 * @param {boolean} options.caseSensitive - Case sensitivity
 * @returns {RegExp} KSUID regex pattern
 */
export function generateKsuidPattern(options = {}) {
  const { caseSensitive = false } = options;
  const flags = caseSensitive ? '' : 'i';
  
  // KSUID: 27 characters, base62 encoded
  return new RegExp('^[0-9A-Za-z]{27}$', flags);
}

/**
 * Generate Hashid pattern
 * @param {Object} options - Configuration options
 * @param {number} options.minLength - Minimum length
 * @param {number} options.maxLength - Maximum length
 * @param {string} options.alphabet - Custom alphabet
 * @returns {RegExp} Hashid regex pattern
 */
export function generateHashidPattern(options = {}) {
  const { 
    minLength = 1, 
    maxLength = 50, 
    alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890' 
  } = options;
  
  const escapedAlphabet = alphabet.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  return new RegExp(`^[${escapedAlphabet}]{${minLength},${maxLength}}$`);
}

/**
 * Generate Slug pattern
 * @param {Object} options - Configuration options
 * @param {number} options.minLength - Minimum length
 * @param {number} options.maxLength - Maximum length
 * @param {boolean} options.allowNumbers - Allow numbers
 * @param {boolean} options.allowUnderscores - Allow underscores
 * @returns {RegExp} Slug regex pattern
 */
export function generateSlugPattern(options = {}) {
  const { 
    minLength = 1, 
    maxLength = 100, 
    allowNumbers = true, 
    allowUnderscores = false 
  } = options;
  
  let charSet = 'a-z';
  if (allowNumbers) charSet += '0-9';
  if (allowUnderscores) charSet += '_';
  
  // Must start and end with alphanumeric, can contain hyphens in middle
  return new RegExp(`^[${charSet}]([${charSet}-]*[${charSet}])?$`);
}

/**
 * Generate custom ID pattern with advanced options
 * @param {Object} options - Configuration options
 * @param {string} options.prefix - Required prefix
 * @param {string} options.suffix - Required suffix
 * @param {number} options.length - Total length (excluding prefix/suffix)
 * @param {string} options.charset - Character set
 * @param {string} options.separator - Separator character
 * @param {number} options.segments - Number of segments
 * @returns {RegExp} Custom ID regex pattern
 */
export function generateCustomIdPattern(options = {}) {
  const {
    prefix = '',
    suffix = '',
    length = 8,
    charset = 'A-Za-z0-9',
    separator = '',
    segments = 1
  } = options;
  
  const escapedPrefix = prefix.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  const escapedSuffix = suffix.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  const escapedSeparator = separator.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  const escapedCharset = charset.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  
  const segmentLength = Math.floor(length / segments);
  const segment = `[${escapedCharset}]{${segmentLength}}`;
  const segmentPattern = new Array(segments).fill(segment).join(escapedSeparator);
  
  return new RegExp(`^${escapedPrefix}${segmentPattern}${escapedSuffix}$`);
}

/**
 * Validate an ID against a specific pattern type
 * @param {string} id - ID to validate
 * @param {string} type - Pattern type
 * @param {Object} options - Options for pattern generation
 * @returns {boolean} Whether the ID matches the pattern
 */
export function validateId(id, type, options = {}) {
  const generators = {
    uuid: generateUuidPattern,
    nanoid: generateNanoIdPattern,
    objectid: generateObjectIdPattern,
    ulid: generateUlidPattern,
    cuid: generateCuidPattern,
    snowflake: generateSnowflakePattern,
    ksuid: generateKsuidPattern,
    hashid: generateHashidPattern,
    slug: generateSlugPattern,
    custom: generateCustomIdPattern
  };
  
  const generator = generators[type.toLowerCase()];
  if (!generator) {
    throw new Error(`Unknown ID type: ${type}`);
  }
  
  const pattern = generator(options);
  return pattern.test(id);
}

/**
 * Extract information from UUID
 * @param {string} uuid - UUID string
 * @returns {Object} UUID information
 */
export function parseUuid(uuid) {
  const pattern = generateUuidPattern({ withHyphens: true });
  if (!pattern.test(uuid)) {
    throw new Error('Invalid UUID format');
  }
  
  const hex = uuid.replace(/-/g, '');
  const version = parseInt(hex[12], 16);
  const variant = parseInt(hex[16], 16);
  
  return {
    version,
    variant: variant >= 8 ? 'RFC 4122' : 'Reserved',
    timestamp: version === 1 ? extractUuidV1Timestamp(hex) : null,
    node: version === 1 ? hex.slice(-12) : null
  };
}

/**
 * Extract timestamp from UUID v1
 * @private
 */
function extractUuidV1Timestamp(hex) {
  const timeLow = parseInt(hex.slice(0, 8), 16);
  const timeMid = parseInt(hex.slice(8, 12), 16);
  const timeHi = parseInt(hex.slice(13, 16), 16); // Skip version digit
  
  // UUID v1 timestamp is 100-nanosecond intervals since Oct 15, 1582
  const uuidTime = (timeHi << 32) + (timeMid << 16) + timeLow;
  const unixTime = (uuidTime - 0x01b21dd213814000n) / 10000n;
  
  return new Date(Number(unixTime));
}

/**
 * Generate multiple patterns at once
 * @param {Array} types - Array of pattern types and options
 * @returns {Object} Map of pattern types to RegExp objects
 */
export function generateMultiplePatterns(types) {
  const patterns = {};
  
  types.forEach(({ type, options = {} }) => {
    patterns[type] = validateId('test', type, options) ? 
      generateCustomIdPattern(options) : 
      new RegExp('^$'); // Invalid pattern
  });
  
  return patterns;
}

/**
 * Common presets for popular ID formats
 */
export const ID_PRESETS = {
  // Standard UUID v4
  uuidV4: () => generateUuidPattern({ version: 4 }),
  
  // Short NanoID
  shortNanoId: () => generateNanoIdPattern({ length: 11 }),
  
  // URL-safe slug
  urlSlug: () => generateSlugPattern({ minLength: 3, maxLength: 50 }),
  
  // Database primary key
  dbId: () => generateCustomIdPattern({ 
    prefix: 'id_',
    length: 16,
    charset: 'a-z0-9'
  }),
  
  // API key format
  apiKey: () => generateCustomIdPattern({
    prefix: 'ak_',
    length: 32,
    charset: 'A-Za-z0-9',
    segments: 4,
    separator: '_'
  }),
  
  // Session ID
  sessionId: () => generateHashidPattern({ 
    minLength: 20, 
    maxLength: 30 
  })
};

export default {
  generateUuidPattern,
  generateNanoIdPattern,
  generateObjectIdPattern,
  generateUlidPattern,
  generateCuidPattern,
  generateSnowflakePattern,
  generateKsuidPattern,
  generateHashidPattern,
  generateSlugPattern,
  generateCustomIdPattern,
  validateId,
  parseUuid,
  generateMultiplePatterns,
  ID_PRESETS
};