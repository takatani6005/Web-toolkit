/**
 * Regex Pattern Generation utilities
 * Provides common regex patterns for validation and matching
 */

/**
 * Generate regex pattern for specified type
 * @param {string} type - Type of pattern to generate
 * @param {Object} [options={}] - Configuration options
 * @returns {RegExp|string} Generated regex pattern
 * @throws {Error} When unsupported pattern type is requested
 */
export function generateRegexPattern(type, options = {}) {
  const { asString = false, flags = '' } = options;
  
  const patterns = {
    email: generateEmailPattern,
    url: generateUrlPattern,
    phone: generatePhonePattern,
    ipv4: generateIpv4Pattern,
    ipv6: generateIpv6Pattern,
    uuid: generateUuidPattern,
    creditCard: generateCreditCardPattern,
    hexColor: generateHexColorPattern,
    strongPassword: generateStrongPasswordPattern,
    date: generateDatePattern,
    time: generateTimePattern,
    username: generateUsernamePattern,
    postalCode: generatePostalCodePattern,
    socialSecurity: generateSocialSecurityPattern,
    isbn: generateIsbnPattern,
    macAddress: generateMacAddressPattern,
    domain: generateDomainPattern,
    slug: generateSlugPattern,
    base64: generateBase64Pattern,
    jwt: generateJwtPattern
  };
  
  const generator = patterns[type];
  if (!generator) {
    const available = Object.keys(patterns).join(', ');
    throw new Error(`Regex pattern type '${type}' not supported. Available: ${available}`);
  }
  
  const pattern = generator(options);
  
  if (asString) {
    return typeof pattern === 'string' ? pattern : pattern.source;
  }
  
  if (typeof pattern === 'string') {
    return new RegExp(pattern, flags);
  }
  
  return flags ? new RegExp(pattern.source, flags) : pattern;
}

/**
 * Generate multiple regex patterns
 * @param {string[]} types - Array of pattern types
 * @param {Object} [options={}] - Global options
 * @returns {Object} Object with pattern types as keys and regex patterns as values
 */
export function generateMultiplePatterns(types, options = {}) {
  const result = {};
  
  for (const type of types) {
    try {
      result[type] = generateRegexPattern(type, options);
    } catch (err) {
      result[type] = { error: err.message };
    }
  }
  
  return result;
}

/**
 * Generate email validation pattern
 * @private
 */
function generateEmailPattern(options = {}) {
  const { strict = false, allowLocalhost = false } = options;
  
  if (strict) {
    // RFC 5322 compliant (simplified)
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  }
  
  // Basic email pattern
  const domainPart = allowLocalhost ? 
    '[a-zA-Z0-9.-]+(?:\\.[a-zA-Z]{2,}|localhost)' :
    '[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}';
    
  return new RegExp(`^[a-zA-Z0-9._%+-]+@${domainPart}$`);
}

/**
 * Generate URL validation pattern
 * @private
 */
function generateUrlPattern(options = {}) {
  const { 
    protocols = ['http', 'https'],
    requireProtocol = true,
    allowLocalhost = false,
    allowIp = false
  } = options;
  
  const protocolPart = requireProtocol ? 
    `(?:${protocols.join('|')})://` : 
    `(?:(?:${protocols.join('|')})://)?`;
    
  let domainPart = '[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}';
  
  if (allowLocalhost) {
    domainPart = '(?:[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}|localhost)';
  }
  
  if (allowIp) {
    const ipPart = '(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';
    domainPart = allowLocalhost ? 
      `(?:[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}|localhost|${ipPart})` :
      `(?:[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}|${ipPart})`;
  }
  
  const pathPart = '(?:[/?#][^\\s]*)?';
  
  return new RegExp(`^${protocolPart}(?:www\\.)?${domainPart}${pathPart}$`, 'i');
}

/**
 * Generate phone number validation pattern
 * @private
 */
function generatePhonePattern(options = {}) {
  const { 
    format = 'international',
    country = 'US',
    allowExtensions = false
  } = options;
  
  const patterns = {
    us: /^(?:\+1[-.\s]?)?(?:\([0-9]{3}\)|[0-9]{3})[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/,
    international: /^(?:\+[1-9]\d{0,3}[-.\s]?)?(?:\([0-9]{1,4}\)|[0-9]{1,4})[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,9}$/,
    e164: /^\+[1-9]\d{1,14}$/,
    nanp: /^(?:\+1[-.\s]?)?[2-9][0-8][0-9][-.\s]?[2-9][0-9]{2}[-.\s]?[0-9]{4}$/
  };
  
  let pattern = patterns[format] || patterns.international;
  
  if (allowExtensions) {
    const extPart = '(?:\\s?(?:ext|x|extension)\\s?[0-9]{1,6})?';
    const patternStr = pattern.source.slice(0, -1) + extPart + '$';
    pattern = new RegExp(patternStr, pattern.flags);
  }
  
  return pattern;
}

/**
 * Generate IPv4 validation pattern
 * @private
 */
function generateIpv4Pattern(options = {}) {
  const { allowPrivate = true, allowLoopback = true } = options;
  
  const octet = '(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';
  let pattern = `^(?:${octet}\\.){3}${octet}$`;
  
  if (!allowPrivate || !allowLoopback) {
    // This would require negative lookaheads which are complex
    // For simplicity, returning basic pattern
    console.warn('Private/loopback filtering not implemented in basic pattern');
  }
  
  return new RegExp(pattern);
}

/**
 * Generate IPv6 validation pattern
 * @private
 */
function generateIpv6Pattern(options = {}) {
  const { allowCompressed = true } = options;
  
  if (allowCompressed) {
    // Full IPv6 pattern with compression support
    return /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::$|^::1$|^(?:[0-9a-fA-F]{1,4}:)*::[0-9a-fA-F]{1,4}(?::[0-9a-fA-F]{1,4})*$|^(?:[0-9a-fA-F]{1,4}:)+:$|^:(?::[0-9a-fA-F]{1,4})+$/;
  } else {
    // Full form only
    return /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  }
}

/**
 * Generate UUID validation pattern
 * @private
 */
function generateUuidPattern(options = {}) {
  const { version = 4, caseSensitive = false } = options;
  
  const flags = caseSensitive ? '' : 'i';
  
  const patterns = {
    1: /^[0-9a-f]{8}-[0-9a-f]{4}-1[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    4: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    any: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
  };
  
  const pattern = patterns[version] || patterns[4];
  return new RegExp(pattern.source, flags);
}

/**
 * Generate credit card validation pattern
 * @private
 */
function generateCreditCardPattern(options = {}) {
  const { type = 'any', allowSpaces = true } = options;
  
  const separator = allowSpaces ? '[\\s-]?' : '-?';
  
  const patterns = {
    visa: `4[0-9]{3}${separator}[0-9]{4}${separator}[0-9]{4}${separator}[0-9]{4}`,
    mastercard: `5[1-5][0-9]{2}${separator}[0-9]{4}${separator}[0-9]{4}${separator}[0-9]{4}`,
    amex: `3[47][0-9]{2}${separator}[0-9]{6}${separator}[0-9]{5}`,
    discover: `6(?:011|5[0-9]{2})[0-9]{0}${separator}[0-9]{4}${separator}[0-9]{4}${separator}[0-9]{4}`,
    any: `[0-9]{4}${separator}[0-9]{4}${separator}[0-9]{4}${separator}[0-9]{4}`
  };
  
  const pattern = patterns[type] || patterns.any;
  return new RegExp(`^${pattern}$`);
}

/**
 * Generate hex color validation pattern
 * @private
 */
function generateHexColorPattern(options = {}) {
  const { allowShort = true, requireHash = true } = options;
  
  const hashPart = requireHash ? '#' : '#?';
  
  if (allowShort) {
    return new RegExp(`^${hashPart}([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$`);
  } else {
    return new RegExp(`^${hashPart}[A-Fa-f0-9]{6}$`);
  }
}

/**
 * Generate strong password validation pattern
 * @private
 */
function generateStrongPasswordPattern(options = {}) {
  const { 
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSymbols = true,
    allowSpaces = false
  } = options;
  
  const conditions = [];
  
  if (requireLowercase) conditions.push('(?=.*[a-z])');
  if (requireUppercase) conditions.push('(?=.*[A-Z])');
  if (requireNumbers) conditions.push('(?=.*\\d)');
  if (requireSymbols) conditions.push('(?=.*[@$!%*?&])');
  
  const charClass = allowSpaces ? 
    '[A-Za-z\\d@$!%*?&\\s]' : 
    '[A-Za-z\\d@$!%*?&]';
    
  const pattern = `^${conditions.join('')}${charClass}{${minLength},}$`;
  
  return new RegExp(pattern);
}

/**
 * Generate date validation pattern
 * @private
 */
function generateDatePattern(options = {}) {
  const { format = 'iso', separator = '-' } = options;
  
  const sep = separator === '-' ? '-' : `\\${separator}`;
  
  const patterns = {
    iso: `^[0-9]{4}${sep}(?:0[1-9]|1[0-2])${sep}(?:0[1-9]|[12][0-9]|3[01])$`,
    us: `^(?:0[1-9]|1[0-2])\\/(?:0[1-9]|[12][0-9]|3[01])\\/[0-9]{4}$`,
    eu: `^(?:0[1-9]|[12][0-9]|3[01])\\/(?:0[1-9]|1[0-2])\\/[0-9]{4}$`,
    flexible: `^(?:[0-9]{1,2}[${sep}\\/.]){2}[0-9]{2,4}$`
  };
  
  return new RegExp(patterns[format] || patterns.iso);
}

/**
 * Generate time validation pattern
 * @private
 */
function generateTimePattern(options = {}) {
  const { format = '24h', includeSeconds = false } = options;
  
  const patterns = {
    '24h': includeSeconds ? 
      '^(?:[01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$' :
      '^(?:[01][0-9]|2[0-3]):[0-5][0-9]$',
    '12h': includeSeconds ?
      '^(?:0?[1-9]|1[0-2]):[0-5][0-9]:[0-5][0-9]\\s?(?:AM|PM|am|pm)$' :
      '^(?:0?[1-9]|1[0-2]):[0-5][0-9]\\s?(?:AM|PM|am|pm)$'
  };
  
  return new RegExp(patterns[format] || patterns['24h']);
}

/**
 * Generate username validation pattern
 * @private
 */
function generateUsernamePattern(options = {}) {
  const { 
    minLength = 3,
    maxLength = 20,
    allowNumbers = true,
    allowUnderscore = true,
    allowHyphen = false,
    requireLetterStart = true
  } = options;
  
  let charClass = 'a-zA-Z';
  if (allowNumbers) charClass += '0-9';
  if (allowUnderscore) charClass += '_';
  if (allowHyphen) charClass += '-';
  
  const startPattern = requireLetterStart ? '[a-zA-Z]' : `[${charClass}]`;
  const pattern = `^${startPattern}[${charClass}]{${minLength - 1},${maxLength - 1}}$`;
  return new RegExp(pattern);
}
