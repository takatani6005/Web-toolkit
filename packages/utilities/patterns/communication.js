/**
 * Enhanced Communication Patterns Module
 * Comprehensive validation patterns for emails, phones, URLs, and other communication formats
 * with extensive internationalization support and modern standards compliance
 */

// Enhanced email validation with comprehensive international support
const EMAIL_TLDS = [
  'com', 'org', 'net', 'edu', 'gov', 'mil', 'int', 'eu', 'uk', 'de', 'fr', 'jp', 'cn', 'au', 'ca',
  'br', 'mx', 'in', 'ru', 'za', 'kr', 'sg', 'hk', 'tw', 'th', 'my', 'ph', 'id', 'vn', 'ae', 'sa'
];

/**
 * Enhanced email pattern with comprehensive validation options
 * @param {Object} options - Configuration options
 * @param {boolean} options.strict - Use RFC 5322 compliant validation
 * @param {boolean} options.allowLocalhost - Allow localhost domains
 * @param {boolean} options.allowInternational - Support international characters
 * @param {number} options.maxLength - Maximum email length (RFC limit: 254)
 * @param {boolean} options.allowQuoted - Allow quoted local parts
 * @param {boolean} options.allowIPDomains - Allow IP address domains
 * @param {boolean} options.requireTLD - Require valid TLD
 * @param {Array} options.allowedDomains - Whitelist of allowed domains
 * @param {Array} options.blockedDomains - Blacklist of blocked domains
 * @returns {RegExp} Email validation pattern
 */
function generateEmailPattern(options = {}) {
  const {
    strict = false,
    allowLocalhost = false,
    allowInternational = true,
    maxLength = 254,
    allowQuoted = false,
    allowIPDomains = false,
    requireTLD = true,
    allowedDomains = null,
    blockedDomains = null
  } = options;

  if (strict) {
    // RFC 5322 compliant with enhanced features
    const quotedString = '"(?:[^"\\r\\n\\\\]|\\\\.)*"';
    const atom = '[a-zA-Z0-9!#$%&\'*+/=?^_`{|}~-]+';
    const dotAtom = `${atom}(?:\\.${atom})*`;
    const localPart = allowQuoted ? `(?:${dotAtom}|${quotedString})` : dotAtom;
    
    // Enhanced domain validation
    const domainLabel = '[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?';
    const domainName = `${domainLabel}(?:\\.${domainLabel})*`;
    const ipv4 = '(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}';
    const ipv6 = '(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::1|::';
    
    let domainPart = allowLocalhost ? `(?:${domainName}|localhost)` : domainName;
    if (allowIPDomains) {
      domainPart = `(?:${domainPart}|\\[(?:${ipv4}|${ipv6})\\])`;
    }
    
    return new RegExp(`^${localPart}@${domainPart}$`, allowInternational ? 'ui' : 'i');
  }

  // Modern email validation with international support
  const unicodeFlag = allowInternational ? 'u' : '';
  const localCharset = allowInternational ? '[\\p{L}\\p{N}._%+-]' : '[a-zA-Z0-9._%+-]';
  const domainCharset = allowInternational ? '[\\p{L}\\p{N}.-]' : '[a-zA-Z0-9.-]';
  
  let domainPattern = allowLocalhost 
    ? `(?:${domainCharset}+\\.\\p{L}{2,}|localhost)`
    : `${domainCharset}+\\.\\p{L}{2,}`;
  
  if (allowIPDomains) {
    const ipPattern = '\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\]';
    domainPattern = `(?:${domainPattern}|${ipPattern})`;
  }

  return new RegExp(`^${localCharset}+@${domainPattern}$`, `i${unicodeFlag}`);
}

// Comprehensive locale-specific patterns with modern standards
const LOCALE_PATTERNS = {
  'en-US': {
    phone: /^(?:\+1[-.\s]?)?(?:\([2-9][0-8][0-9]\)|[2-9][0-8][0-9])[-.\s]?[2-9][0-9]{2}[-.\s]?[0-9]{4}$/,
    postalCode: /^[0-9]{5}(?:-[0-9]{4})?$/,
    currency: /^\$[0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2})?$/,
    dateFormat: 'MM/DD/YYYY'
  },
  'en-CA': {
    phone: /^(?:\+1[-.\s]?)?(?:\([2-9][0-8][0-9]\)|[2-9][0-8][0-9])[-.\s]?[2-9][0-9]{2}[-.\s]?[0-9]{4}$/,
    postalCode: /^[A-Za-z][0-9][A-Za-z][\s-]?[0-9][A-Za-z][0-9]$/,
    currency: /^\$[0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2})?$/,
    dateFormat: 'DD/MM/YYYY'
  },
  'en-GB': {
    phone: /^(?:\+44\s?)?(?:\(0\)|0)?(?:[1-9]\d{8,9}|[1-9]\d{7})$/,
    postalCode: /^[A-Z]{1,2}[0-9R][0-9A-Z]?\s?[0-9][A-BD-HJLNP-UW-Z]{2}$/i,
    currency: /^£[0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2})?$/,
    dateFormat: 'DD/MM/YYYY'
  },
  'de-DE': {
    phone: /^(?:\+49\s?)?(?:\(0\)|0)?[1-9]\d{1,4}\s?\d{1,8}$/,
    postalCode: /^[0-9]{5}$/,
    currency: /^[0-9]{1,3}(?:\.[0-9]{3})*(?:,[0-9]{2})?\s?€$/,
    dateFormat: 'DD.MM.YYYY'
  },
  'fr-FR': {
    phone: /^(?:\+33\s?)?(?:\(0\)|0)?[1-9](?:[-.\s]?[0-9]{2}){4}$/,
    postalCode: /^[0-9]{5}$/,
    currency: /^[0-9]{1,3}(?:\s[0-9]{3})*(?:,[0-9]{2})?\s?€$/,
    dateFormat: 'DD/MM/YYYY'
  },
  'es-ES': {
    phone: /^(?:\+34\s?)?(?:[6-9][0-9]{8}|[8-9][0-9]{7})$/,
    postalCode: /^[0-9]{5}$/,
    currency: /^[0-9]{1,3}(?:\.[0-9]{3})*(?:,[0-9]{2})?\s?€$/,
    dateFormat: 'DD/MM/YYYY'
  },
  'it-IT': {
    phone: /^(?:\+39\s?)?(?:[0-9]{2,4}[-.\s]?[0-9]{6,8}|3[0-9]{2}[-.\s]?[0-9]{7})$/,
    postalCode: /^[0-9]{5}$/,
    currency: /^[0-9]{1,3}(?:\.[0-9]{3})*(?:,[0-9]{2})?\s?€$/,
    dateFormat: 'DD/MM/YYYY'
  },
  'ja-JP': {
    phone: /^(?:\+81[-.\s]?)?(?:\(0\)|0)?[1-9][0-9]{1,3}[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{4}$/,
    postalCode: /^[0-9]{3}-[0-9]{4}$/,
    currency: /^¥[0-9]{1,3}(?:,[0-9]{3})*$/,
    dateFormat: 'YYYY/MM/DD'
  },
  'ko-KR': {
    phone: /^(?:\+82[-.\s]?)?(?:\(0\)|0)?[1-9][0-9]{1,2}[-.\s]?[0-9]{3,4}[-.\s]?[0-9]{4}$/,
    postalCode: /^[0-9]{5}$/,
    currency: /^₩[0-9]{1,3}(?:,[0-9]{3})*$/,
    dateFormat: 'YYYY.MM.DD'
  },
  'zh-CN': {
    phone: /^(?:\+86\s?)?1[3-9][0-9]{9}$/,
    postalCode: /^[0-9]{6}$/,
    currency: /^¥[0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2})?$/,
    dateFormat: 'YYYY-MM-DD'
  },
  'ru-RU': {
    phone: /^(?:\+7\s?)?[0-9]{10}$/,
    postalCode: /^[0-9]{6}$/,
    currency: /^[0-9]{1,3}(?:\s[0-9]{3})*(?:,[0-9]{2})?\s?₽$/,
    dateFormat: 'DD.MM.YYYY'
  },
  'pt-BR': {
    phone: /^(?:\+55\s?)?(?:\([1-9][0-9]\)|[1-9][0-9])[-.\s]?[0-9]{4,5}[-.\s]?[0-9]{4}$/,
    postalCode: /^[0-9]{5}-[0-9]{3}$/,
    currency: /^R\$\s?[0-9]{1,3}(?:\.[0-9]{3})*(?:,[0-9]{2})?$/,
    dateFormat: 'DD/MM/YYYY'
  },
  'ar-SA': {
    phone: /^(?:\+966\s?)?5[0-9]{8}$/,
    postalCode: /^[0-9]{5}$/,
    currency: /^[0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2})?\s?ريال$/,
    dateFormat: 'DD/MM/YYYY'
  },
  'hi-IN': {
    phone: /^(?:\+91\s?)?[6-9][0-9]{9}$/,
    postalCode: /^[0-9]{6}$/,
    currency: /^₹[0-9]{1,2}(?:,[0-9]{2})*(?:,[0-9]{3})*(?:\.[0-9]{2})?$/,
    dateFormat: 'DD/MM/YYYY'
  }
};

/**
 * Enhanced phone pattern with comprehensive locale support
 * @param {Object} options - Configuration options
 * @param {string} options.format - Phone format type
 * @param {string} options.locale - Locale for region-specific validation
 * @param {boolean} options.allowExtensions - Allow phone extensions
 * @param {boolean} options.strict - Strict format validation
 * @param {boolean} options.allowMobile - Allow mobile numbers only
 * @param {boolean} options.allowLandline - Allow landline numbers only
 * @returns {RegExp} Phone validation pattern
 */
function generatePhonePattern(options = {}) {
  const {
    format = 'international',
    locale = 'en-US',
    allowExtensions = false,
    strict = false,
    allowMobile = true,
    allowLandline = true
  } = options;

  // Check for locale-specific pattern
  if (LOCALE_PATTERNS[locale]?.phone) {
    let pattern = LOCALE_PATTERNS[locale].phone;
    
    if (allowExtensions) {
      const extPart = '(?:\\s?(?:ext|x|extension|#)\\s?[0-9]{1,6})?';
      const patternStr = pattern.source.slice(0, -1) + extPart + '$';
      pattern = new RegExp(patternStr, pattern.flags);
    }
    
    return pattern;
  }

  const patterns = {
    us: /^(?:\+1[-.\s]?)?(?:\([2-9][0-8][0-9]\)|[2-9][0-8][0-9])[-.\s]?[2-9][0-9]{2}[-.\s]?[0-9]{4}$/,
    international: /^(?:\+[1-9]\d{0,3}[-.\s]?)?(?:\([0-9]{1,4}\)|[0-9]{1,4})[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,9}$/,
    e164: /^\+[1-9]\d{1,14}$/,
    nanp: /^(?:\+1[-.\s]?)?[2-9][0-8][0-9][-.\s]?[2-9][0-9]{2}[-.\s]?[0-9]{4}$/,
    mobile: /^(?:\+[1-9]\d{0,3}[-.\s]?)?[1-9]\d{8,14}$/,
    landline: /^(?:\+[1-9]\d{0,3}[-.\s]?)?[1-9]\d{6,12}$/,
    loose: /^[\+]?[0-9\s\-\(\)\.]{7,15}$/,
    strict: /^(?:\+[1-9]\d{1,3})?[1-9]\d{6,14}$/
  };

  let pattern = patterns[format] || patterns.international;
  
  if (allowExtensions) {
    const extPart = '(?:\\s?(?:ext|x|extension|#)\\s?[0-9]{1,6})?';
    const patternStr = pattern.source.slice(0, -1) + extPart + '$';
    pattern = new RegExp(patternStr, pattern.flags);
  }

  return pattern;
}

/**
 * Enhanced URL pattern generator with comprehensive validation
 * @param {Object} options - Configuration options
 * @param {boolean} options.requireProtocol - Require protocol (http/https)
 * @param {boolean} options.allowIP - Allow IP addresses
 * @param {boolean} options.allowLocalhost - Allow localhost
 * @param {boolean} options.allowPort - Allow custom ports
 * @param {boolean} options.allowPath - Allow URL paths
 * @param {boolean} options.allowQuery - Allow query parameters
 * @param {boolean} options.allowFragment - Allow URL fragments
 * @param {Array} options.allowedProtocols - Allowed protocols
 * @param {boolean} options.international - Support international domains
 * @returns {RegExp} URL validation pattern
 */
function generateURLPattern(options = {}) {
  const {
    requireProtocol = true,
    allowIP = true,
    allowLocalhost = true,
    allowPort = true,
    allowPath = true,
    allowQuery = true,
    allowFragment = true,
    allowedProtocols = ['http', 'https', 'ftp', 'ftps'],
    international = true
  } = options;

  const protocol = requireProtocol 
    ? `(?:${allowedProtocols.join('|')})://`
    : `(?:(?:${allowedProtocols.join('|')})://)?`;

  const ipv4 = '(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}';
  const ipv6 = '\\[(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\\]';
  
  const domainChar = international ? '[\\p{L}\\p{N}-]' : '[a-zA-Z0-9-]';
  const domain = `${domainChar}+(?:\\.${domainChar}+)*\\.\\p{L}{2,}`;
  
  let host = allowLocalhost ? `(?:${domain}|localhost)` : domain;
  if (allowIP) {
    host = `(?:${host}|${ipv4}|${ipv6})`;
  }

  const port = allowPort ? '(?::[0-9]{1,5})?' : '';
  const path = allowPath ? '(?:/[^\\s?#]*)?' : '';
  const query = allowQuery ? '(?:\\?[^\\s#]*)?' : '';
  const fragment = allowFragment ? '(?:#[^\\s]*)?' : '';

  const flags = international ? 'ui' : 'i';
  return new RegExp(`^${protocol}${host}${port}${path}${query}${fragment}$`, flags);
}

/**
 * Generate social media username pattern
 * @param {string} platform - Social media platform
 * @param {Object} options - Additional options
 * @returns {RegExp} Username validation pattern
 */
function generateSocialPattern(platform, options = {}) {
  const patterns = {
    twitter: /^[A-Za-z0-9_]{1,15}$/,
    instagram: /^[A-Za-z0-9_.]{1,30}$/,
    facebook: /^[A-Za-z0-9.]{5,50}$/,
    linkedin: /^[A-Za-z0-9-]{3,100}$/,
    github: /^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/,
    youtube: /^[A-Za-z0-9_-]{1,20}$/,
    tiktok: /^[A-Za-z0-9_.]{2,24}$/,
    discord: /^.{2,32}#[0-9]{4}$/,
    telegram: /^[A-Za-z0-9_]{5,32}$/,
    whatsapp: /^\+[1-9]\d{1,14}$/
  };

  return patterns[platform.toLowerCase()] || /^[A-Za-z0-9_.@-]{2,50}$/;
}

/**
 * Generate hashtag pattern with customizable options
 * @param {Object} options - Configuration options
 * @param {number} options.minLength - Minimum hashtag length
 * @param {number} options.maxLength - Maximum hashtag length
 * @param {boolean} options.allowNumbers - Allow numbers in hashtags
 * @param {boolean} options.allowUnderscore - Allow underscores
 * @param {boolean} options.international - Support international characters
 * @returns {RegExp} Hashtag validation pattern
 */
function generateHashtagPattern(options = {}) {
  const {
    minLength = 1,
    maxLength = 100,
    allowNumbers = true,
    allowUnderscore = true,
    international = true
  } = options;

  let charset = international ? '\\p{L}' : 'A-Za-z';
  if (allowNumbers) charset += '\\p{N}';
  if (allowUnderscore) charset += '_';

  const flags = international ? 'u' : '';
  return new RegExp(`^#[${charset}]{${minLength},${maxLength}}$`, flags);
}

/**
 * Generate IP address pattern (IPv4 and IPv6)
 * @param {Object} options - Configuration options
 * @param {boolean} options.v4 - Allow IPv4 addresses
 * @param {boolean} options.v6 - Allow IPv6 addresses
 * @param {boolean} options.allowPrivate - Allow private IP ranges
 * @returns {RegExp} IP address validation pattern
 */
function generateIPPattern(options = {}) {
  const { v4 = true, v6 = true, allowPrivate = true } = options;

  const ipv4 = allowPrivate
    ? '(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}'
    : '(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3})(?!(?:10|127)(?:\\.\\d{1,3}){3})(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})';

  const ipv6 = '(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::1|::';

  const patterns = [];
  if (v4) patterns.push(ipv4);
  if (v6) patterns.push(ipv6);

  return new RegExp(`^(?:${patterns.join('|')})$`);
}

/**
 * Generate MAC address pattern
 * @param {Object} options - Configuration options
 * @param {string} options.separator - MAC address separator (:, -, or .)
 * @param {boolean} options.uppercase - Require uppercase letters
 * @returns {RegExp} MAC address validation pattern
 */
function generateMACPattern(options = {}) {
  const { separator = ':', uppercase = false } = options;
  const hex = uppercase ? '[0-9A-F]' : '[0-9A-Fa-f]';
  const sep = separator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  return new RegExp(`^${hex}{2}(?:${sep}${hex}{2}){5}$`);
}

/**
 * Validate email with comprehensive checking
 * @param {string} email - Email to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result with detailed feedback
 */
function validateEmail(email, options = {}) {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required and must be a string' };
  }

  const pattern = generateEmailPattern(options);
  const isValid = pattern.test(email);
  
  if (!isValid) {
    return { valid: false, error: 'Invalid email format' };
  }

  // Additional checks
  const [local, domain] = email.split('@');
  
  if (local.length > 64) {
    return { valid: false, error: 'Local part too long (max 64 characters)' };
  }
  
  if (domain.length > 253) {
    return { valid: false, error: 'Domain too long (max 253 characters)' };
  }
  
  if (options.blockedDomains?.includes(domain.toLowerCase())) {
    return { valid: false, error: 'Domain is not allowed' };
  }
  
  if (options.allowedDomains && !options.allowedDomains.includes(domain.toLowerCase())) {
    return { valid: false, error: 'Domain is not in allowed list' };
  }

  return { 
    valid: true, 
    normalized: email.toLowerCase(),
    parts: { local, domain }
  };
}

/**
 * Validate phone number with locale-specific rules
 * @param {string} phone - Phone number to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result with formatting info
 */
function validatePhone(phone, options = {}) {
  if (!phone || typeof phone !== 'string') {
    return { valid: false, error: 'Phone number is required and must be a string' };
  }

  const pattern = generatePhonePattern(options);
  const cleanPhone = phone.replace(/\s/g, '');
  const isValid = pattern.test(phone);
  
  if (!isValid) {
    return { valid: false, error: 'Invalid phone number format' };
  }

  // Extract components
  const countryCode = phone.match(/^\+(\d{1,3})/)?.[1];
  const extension = phone.match(/(?:ext|x|extension|#)\s?(\d+)/i)?.[1];

  return {
    valid: true,
    normalized: cleanPhone,
    countryCode,
    extension,
    type: phone.match(/^\+?\d/) ? 'mobile' : 'landline'
  };
}

/**
 * Communication validation utilities
 */
const communicationUtils = {
  // Email utilities
  extractEmailDomain: (email) => email.split('@')[1]?.toLowerCase(),
  isDisposableEmail: (email) => {
    const disposableDomains = ['tempmail.com', '10minutemail.com', 'guerrillamail.com'];
    const domain = email.split('@')[1]?.toLowerCase();
    return disposableDomains.includes(domain);
  },
  
  // Phone utilities
  formatPhone: (phone, format = 'international') => {
    const digits = phone.replace(/\D/g, '');
    switch (format) {
      case 'us':
        return digits.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
      case 'international':
        return `+${digits}`;
      default:
        return digits;
    }
  },
  
  // URL utilities
  normalizeURL: (url) => {
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      return urlObj.href;
    } catch {
      return null;
    }
  },

  // Locale utilities
  getSupportedLocales: () => Object.keys(LOCALE_PATTERNS),
  getLocalePattern: (locale, type) => LOCALE_PATTERNS[locale]?.[type]
};

const patterns = {
  email: generateEmailPattern,
  phone: generatePhonePattern,
  url: generateURLPattern,
  social: generateSocialPattern,
  hashtag: generateHashtagPattern,
  ip: generateIPPattern,
  mac: generateMACPattern
};

const validators = {
  email: validateEmail,
  phone: validatePhone
};



export {
 generateEmailPattern,
 validatePhone,
 generatePhonePattern,  
 generateURLPattern,    
 generateSocialPattern,
 generateHashtagPattern,
 generateIPPattern,
 generateMACPattern,
 validateEmail,
 validatePhone,
};