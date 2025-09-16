/**
 * Enhanced Security Patterns Library
 * Comprehensive validation patterns for security-sensitive data
 */

/**
 * Utility functions
 * @private
 */
function escapeRegexChars(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildCharacterClass(options = {}) {
  const {
    lowercase = false,
    uppercase = false,
    numbers = false,
    symbols = '',
    spaces = false,
    unicode = false
  } = options;
  
  let charClass = '[';
  if (lowercase) charClass += 'a-z';
  if (uppercase) charClass += 'A-Z';
  if (numbers) charClass += '0-9';
  if (symbols) charClass += escapeRegexChars(symbols);
  if (spaces) charClass += ' \\t';
  if (unicode) charClass += '\\u00a0-\\uffff';
  charClass += ']';
  
  return charClass;
}

/**
 * Enhanced password pattern with configurable requirements
 * @param {Object} options - Configuration options
 * @returns {RegExp} Password validation regex
 */
function generatePasswordPattern(options = {}) {
  const {
    minLength = 8,
    maxLength = 128,
    requireUppercase = false,
    requireLowercase = false,
    requireNumbers = false,
    requireSymbols = false,
    allowSpaces = true,
    customSymbols = '@$!%*?&',
    allowUnicode = false,
    forbiddenPatterns = [],
    minUniqueChars = 0
  } = options;

  const conditions = [];
  if (requireLowercase) conditions.push('(?=.*[a-z])');
  if (requireUppercase) conditions.push('(?=.*[A-Z])');
  if (requireNumbers) conditions.push('(?=.*\\d)');
  if (requireSymbols) conditions.push(`(?=.*[${escapeRegexChars(customSymbols)}])`);
  
  // Add minimum unique characters requirement
  if (minUniqueChars > 0) {
    conditions.push(`(?=(?:.*?(.)(?!.*?\\1)){${minUniqueChars},})`);
  }

  const charClass = buildCharacterClass({
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: customSymbols,
    spaces: allowSpaces,
    unicode: allowUnicode
  });

  const lengthPart = maxLength ? `{${minLength},${maxLength}}` : `{${minLength},}`;
  let pattern = `^${conditions.join('')}${charClass}${lengthPart}$`;

  const regex = new RegExp(pattern);
  
  // Add forbidden patterns check
  if (forbiddenPatterns.length > 0) {
    const originalTest = regex.test.bind(regex);
    regex.test = function(str) {
      if (!originalTest(str)) return false;
      return !forbiddenPatterns.some(forbidden => 
        new RegExp(forbidden, 'i').test(str)
      );
    };
  }

  return regex;
}

/**
 * Generate strong password pattern with security best practices
 * @param {Object} options - Override options
 * @returns {RegExp} Strong password validation regex
 */
function generateStrongPasswordPattern(options = {}) {
  return generatePasswordPattern({
    minLength: 12,
    maxLength: 256,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: true,
    allowSpaces: false,
    minUniqueChars: 8,
    forbiddenPatterns: [
      'password',
      '123456',
      'qwerty',
      'admin',
      'letmein',
      '(.)\\1{2,}', // No more than 2 consecutive identical chars
      '^(.)\\1+$',  // No repeated single character
      '012|123|234|345|456|567|678|789|890', // Sequential numbers
      'abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz' // Sequential letters
    ],
    ...options
  });
}

/**
 * Generate JWT token pattern
 * @param {Object} options - Configuration options
 * @returns {RegExp} JWT validation regex
 */
function generateJwtPattern(options = {}) {
  const { 
    strict = false,
    validateStructure = true,
    minHeaderLength = 10,
    minPayloadLength = 10,
    minSignatureLength = 10
  } = options;

  if (strict && validateStructure) {
    // Strict JWT with minimum length requirements for each part
    const header = `[A-Za-z0-9_-]{${minHeaderLength},}`;
    const payload = `[A-Za-z0-9_-]{${minPayloadLength},}`;
    const signature = `[A-Za-z0-9_-]{${minSignatureLength},}`;
    return new RegExp(`^${header}\\.${payload}\\.${signature}$`);
  } else if (strict) {
    // JWT has exactly 3 base64url parts separated by dots
    const base64url = '[A-Za-z0-9_-]+';
    return new RegExp(`^${base64url}\\.${base64url}\\.${base64url}$`);
  }
  
  // Loose JWT pattern
  return /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;
}

/**
 * Generate API key pattern
 * @param {Object} options - Configuration options
 * @returns {RegExp} API key validation regex
 */
function generateApiKeyPattern(options = {}) {
  const { 
    format = 'base64', 
    length = 32, 
    prefix = '',
    minLength = null,
    maxLength = null,
    caseSensitive = true
  } = options;

  const actualLength = minLength && maxLength ? 
    `{${minLength},${maxLength}}` : 
    `{${length}}`;

  const patterns = {
    base64: `[A-Za-z0-9+/]${actualLength}={0,2}`,
    hex: `[A-Fa-f0-9]${actualLength}`,
    alphanumeric: `[A-Za-z0-9]${actualLength}`,
    base64url: `[A-Za-z0-9_-]${actualLength}`,
    uuid: '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}',
    nanoid: '[A-Za-z0-9_-]{21}',
    custom: options.customPattern || '[A-Za-z0-9]+'
  };

  const pattern = patterns[format] || patterns.base64;
  const prefixPart = prefix ? `${escapeRegexChars(prefix)}` : '';
  const flags = caseSensitive ? '' : 'i';
  
  return new RegExp(`^${prefixPart}${pattern}$`, flags);
}

/**
 * Generate comprehensive URL pattern with protocol validation
 * @param {Object} options - Configuration options
 * @returns {RegExp} URL validation regex
 */
function generateUrlPattern(options = {}) {
  const {
    protocols = ['http', 'https'],
    requireProtocol = true,
    allowLocalhost = false,
    allowIp = false,
    allowPort = true,
    allowPath = true,
    allowQuery = true,
    allowFragment = true,
    allowInternational = false,
    requireTld = true,
    maxLength = 2048,
    allowedTlds = null
  } = options;

  const protocolPart = requireProtocol ?
    `(?:${protocols.join('|')})://` :
    `(?:(?:${protocols.join('|')})://)?`;

  // Base domain pattern
  let domainPart = allowInternational ? 
    '[a-zA-Z0-9\\u00a0-\\uffff](?:[a-zA-Z0-9\\u00a0-\\uffff-]{0,61}[a-zA-Z0-9\\u00a0-\\uffff])?(?:\\.[a-zA-Z0-9\\u00a0-\\uffff](?:[a-zA-Z0-9\\u00a0-\\uffff-]{0,61}[a-zA-Z0-9\\u00a0-\\uffff])?)*' :
    '[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*';

  if (requireTld) {
    const tldPart = allowedTlds ? 
      `(?:${allowedTlds.join('|')})` : 
      (allowInternational ? '[a-zA-Z\\u00a0-\\uffff]{2,}' : '[a-zA-Z]{2,}');
    domainPart += `\\.${tldPart}`;
  }

  if (allowLocalhost) {
    domainPart = `(?:${domainPart}|localhost)`;
  }

  if (allowIp) {
    const ipv4 = '(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';
    const ipv6 = '\\[(?:[0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}\\]';
    domainPart = `(?:${domainPart}|${ipv4}|${ipv6})`;
  }

  let pattern = `^${protocolPart}(?:www\\.)?${domainPart}`;

  if (allowPort) {
    pattern += '(?::[0-9]{1,5})?';
  }

  if (allowPath) {
    pattern += allowInternational ? 
      '(?:/[^\\s?#\\u00a0-\\uffff]*[^\\s?#]*)*' : 
      '(?:/[^\\s?#]*)*';
  }

  if (allowQuery) {
    pattern += '(?:\\?[^\\s#]*)?';
  }

  if (allowFragment) {
    pattern += '(?:#[^\\s]*)?';
  }

  pattern += '$';

  const regex = new RegExp(pattern, 'i');
  
  // Add length validation
  if (maxLength) {
    const originalTest = regex.test.bind(regex);
    regex.test = function(str) {
      return str.length <= maxLength && originalTest(str);
    };
  }

  return regex;
}

/**
 * Generate OAuth token patterns
 * @param {Object} options - Configuration options
 * @returns {Object} OAuth token patterns
 */
function generateOAuthPatterns(options = {}) {
  const {
    accessTokenLength = 64,
    refreshTokenLength = 64,
    authorizationCodeLength = 32,
    format = 'base64url'
  } = options;

  return {
    accessToken: generateApiKeyPattern({
      format,
      length: accessTokenLength,
      prefix: 'at_'
    }),
    refreshToken: generateApiKeyPattern({
      format,
      length: refreshTokenLength,
      prefix: 'rt_'
    }),
    authorizationCode: generateApiKeyPattern({
      format,
      length: authorizationCodeLength
    })
  };
}

/**
 * Generate cryptographic hash patterns
 * @param {Object} options - Configuration options  
 * @returns {Object} Hash validation patterns
 */
function generateHashPatterns(options = {}) {
  return {
    md5: /^[a-f0-9]{32}$/i,
    sha1: /^[a-f0-9]{40}$/i,
    sha256: /^[a-f0-9]{64}$/i,
    sha384: /^[a-f0-9]{96}$/i,
    sha512: /^[a-f0-9]{128}$/i,
    bcrypt: /^\$2[aby]?\$[0-9]{2}\$[A-Za-z0-9./]{53}$/,
    argon2: /^\$argon2[id]?\$v=[0-9]+\$m=[0-9]+,t=[0-9]+,p=[0-9]+\$[A-Za-z0-9+/]+\$[A-Za-z0-9+/]+$/,
    scrypt: /^\$scrypt\$[A-Za-z0-9+/]+=*\$[A-Za-z0-9+/]+=*$/
  };
}

/**
 * Generate TLS/SSL certificate patterns
 * @param {Object} options - Configuration options
 * @returns {Object} Certificate validation patterns
 */
function generateCertificatePatterns(options = {}) {
  return {
    pemCertificate: /^-----BEGIN CERTIFICATE-----[\s\S]+-----END CERTIFICATE-----$/,
    pemPrivateKey: /^-----BEGIN (?:RSA )?PRIVATE KEY-----[\s\S]+-----END (?:RSA )?PRIVATE KEY-----$/,
    pemPublicKey: /^-----BEGIN PUBLIC KEY-----[\s\S]+-----END PUBLIC KEY-----$/,
    pemCSR: /^-----BEGIN CERTIFICATE REQUEST-----[\s\S]+-----END CERTIFICATE REQUEST-----$/,
    x509SerialNumber: /^[0-9A-Fa-f]{1,40}$/,
    certificateFingerprint: /^[0-9A-Fa-f]{2}(?::[0-9A-Fa-f]{2}){15,31}$/
  };
}

/**
 * Generate security header patterns
 * @param {Object} options - Configuration options
 * @returns {Object} Security header validation patterns
 */
function generateSecurityHeaderPatterns(options = {}) {
  return {
    csp: /^[a-zA-Z0-9\-]+(?:\s+[^;]+)?(?:;\s*[a-zA-Z0-9\-]+(?:\s+[^;]+)?)*$/,
    hsts: /^max-age=\d+(?:;\s*includeSubDomains)?(?:;\s*preload)?$/i,
    xFrameOptions: /^(?:DENY|SAMEORIGIN|ALLOW-FROM\s+https?:\/\/[\w.-]+)$/i,
    referrerPolicy: /^(?:no-referrer|no-referrer-when-downgrade|origin|origin-when-cross-origin|same-origin|strict-origin|strict-origin-when-cross-origin|unsafe-url)$/i,
    featurePolicy: /^[a-zA-Z0-9\-*]+(?:\s*\([^)]*\))?(?:\s*,\s*[a-zA-Z0-9\-*]+(?:\s*\([^)]*\))?)*$/
  };
}

/**
 * Generate input sanitization patterns
 * @param {Object} options - Configuration options
 * @returns {Object} Sanitization patterns
 */
function generateSanitizationPatterns(options = {}) {
  const { strict = false } = options;
  
  return {
    // Detect potential XSS
    xssPattern: /<script[\s\S]*?>[\s\S]*?<\/script>|javascript:|on\w+\s*=|<iframe|<object|<embed/gi,
    
    // Detect SQL injection attempts
    sqlInjectionPattern: /('|(\\)|;|--|\||\*|\%|<|>|\?|\[|\]|\{|\}|\$|\+|=)/gi,
    
    // Detect path traversal
    pathTraversalPattern: /(\.\.[\\\/])|(\.\.[\\\/].*[\\\/])|([\\\/]\.\.[\\\/])|([\\\/]\.\.)/gi,
    
    // Detect command injection
    commandInjectionPattern: /[;&|`$(){}[\]\\]/g,
    
    // Safe alphanumeric with basic punctuation
    safeAlphanumeric: strict ? /^[a-zA-Z0-9\s._-]+$/ : /^[a-zA-Z0-9\s._\-@#$%^&*()+={}[\]|\\:";'<>,.?/~`!]+$/,
    
    // HTML tag pattern
    htmlTags: /<\/?[^>]+>/gi,
    
    // Email-safe pattern (no HTML, scripts, etc.)
    emailSafe: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  };
}

/**
 * Generate rate limiting and security patterns
 * @param {Object} options - Configuration options
 * @returns {Object} Rate limiting patterns
 */
function generateRateLimitPatterns(options = {}) {
  return {
    // IP address validation
    ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    ipv6: /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/,
    
    // Session ID patterns
    sessionId: generateApiKeyPattern({ format: 'hex', length: 32 }),
    
    // CSRF token
    csrfToken: generateApiKeyPattern({ format: 'base64url', length: 32 }),
    
    // User agent patterns (for bot detection)
    suspiciousUserAgent: /bot|crawler|spider|scraper|automated|curl|wget|python-requests/i,
    
    // Rate limit headers
    rateLimitHeader: /^[0-9]+$/
  };
}

/**
 * Main security patterns export
 */
const SecurityPatterns = {
  // Core functions
  generatePasswordPattern,
  generateStrongPasswordPattern,
  generateJwtPattern,
  generateApiKeyPattern,
  generateUrlPattern,
  
  // Specialized patterns
  generateOAuthPatterns,
  generateHashPatterns,
  generateCertificatePatterns,
  generateSecurityHeaderPatterns,
  generateSanitizationPatterns,
  generateRateLimitPatterns,
  
  // Utility functions
  escapeRegexChars,
  buildCharacterClass,
  
  // Pre-built common patterns
  common: {
    strongPassword: generateStrongPasswordPattern(),
    jwt: generateJwtPattern({ strict: true }),
    apiKey: generateApiKeyPattern(),
    httpsUrl: generateUrlPattern({ protocols: ['https'], requireProtocol: true }),
    ...generateHashPatterns(),
    ...generateSanitizationPatterns({ strict: true })
  }
};

// Node.js/CommonJS export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SecurityPatterns;
}

// ES6/Browser export
if (typeof window !== 'undefined') {
  window.SecurityPatterns = SecurityPatterns;
}

export default SecurityPatterns;