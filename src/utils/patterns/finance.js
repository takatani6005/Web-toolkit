/**
 * Enhanced Financial Pattern Library
 * Comprehensive patterns for credit cards, bank codes, account numbers, and more
 */

// Credit Card Type Definitions with enhanced validation
const CREDIT_CARD_TYPES = {
  visa: {
    name: 'Visa',
    prefixes: [4],
    lengths: [13, 16, 19],
    pattern: /^4[0-9]{12}(?:[0-9]{3})?(?:[0-9]{3})?$/,
    cvcLength: [3]
  },
  mastercard: {
    name: 'Mastercard',
    prefixes: [51, 52, 53, 54, 55],
    lengths: [16],
    pattern: /^5[1-5][0-9]{14}$|^2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}$/,
    cvcLength: [3]
  },
  amex: {
    name: 'American Express',
    prefixes: [34, 37],
    lengths: [15],
    pattern: /^3[47][0-9]{13}$/,
    cvcLength: [4]
  },
  discover: {
    name: 'Discover',
    prefixes: [6011, 622126, 622925, 644, 645, 646, 647, 648, 649, 65],
    lengths: [16, 19],
    pattern: /^6(?:011|5[0-9]{2}|4[4-9][0-9]|22(?:1(?:2[6-9]|[3-9][0-9])|[2-8][0-9]{2}|9(?:[01][0-9]|2[0-5])))[0-9]{10,13}$/,
    cvcLength: [3]
  },
  diners: {
    name: 'Diners Club',
    prefixes: [300, 301, 302, 303, 304, 305, 36, 38],
    lengths: [14],
    pattern: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
    cvcLength: [3]
  },
  jcb: {
    name: 'JCB',
    prefixes: [2131, 1800, 35],
    lengths: [15, 16],
    pattern: /^(?:2131|1800|35[0-9]{2})[0-9]{11,12}$/,
    cvcLength: [3]
  },
  unionpay: {
    name: 'UnionPay',
    prefixes: [62],
    lengths: [16, 17, 18, 19],
    pattern: /^62[0-9]{14,17}$/,
    cvcLength: [3]
  },
  maestro: {
    name: 'Maestro',
    prefixes: [5018, 5020, 5038, 5893, 6304, 6759, 6761, 6762, 6763],
    lengths: [12, 13, 14, 15, 16, 17, 18, 19],
    pattern: /^(?:5[0678][0-9]{2}|6304|6390|67[0-9]{2})[0-9]{8,15}$/,
    cvcLength: [3]
  }
};

// Country-specific IBAN lengths and patterns
const IBAN_PATTERNS = {
  AD: { length: 24, pattern: /^AD[0-9]{2}[0-9]{4}[0-9]{4}[A-Z0-9]{12}$/ },
  AE: { length: 23, pattern: /^AE[0-9]{2}[0-9]{3}[0-9]{16}$/ },
  AL: { length: 28, pattern: /^AL[0-9]{2}[0-9]{8}[A-Z0-9]{16}$/ },
  AT: { length: 20, pattern: /^AT[0-9]{2}[0-9]{5}[0-9]{11}$/ },
  AZ: { length: 28, pattern: /^AZ[0-9]{2}[A-Z]{4}[A-Z0-9]{20}$/ },
  BA: { length: 20, pattern: /^BA[0-9]{2}[0-9]{3}[0-9]{3}[0-9]{8}[0-9]{2}$/ },
  BE: { length: 16, pattern: /^BE[0-9]{2}[0-9]{3}[0-9]{7}[0-9]{2}$/ },
  BG: { length: 22, pattern: /^BG[0-9]{2}[A-Z]{4}[0-9]{4}[0-9]{2}[A-Z0-9]{8}$/ },
  BH: { length: 22, pattern: /^BH[0-9]{2}[A-Z]{4}[A-Z0-9]{14}$/ },
  BR: { length: 29, pattern: /^BR[0-9]{2}[0-9]{8}[0-9]{5}[0-9]{10}[A-Z][A-Z0-9]$/ },
  BY: { length: 28, pattern: /^BY[0-9]{2}[A-Z0-9]{4}[0-9]{4}[A-Z0-9]{16}$/ },
  CH: { length: 21, pattern: /^CH[0-9]{2}[0-9]{5}[A-Z0-9]{12}$/ },
  CR: { length: 22, pattern: /^CR[0-9]{2}[0-9]{4}[0-9]{14}$/ },
  CY: { length: 28, pattern: /^CY[0-9]{2}[0-9]{3}[0-9]{5}[A-Z0-9]{16}$/ },
  CZ: { length: 24, pattern: /^CZ[0-9]{2}[0-9]{4}[0-9]{6}[0-9]{10}$/ },
  DE: { length: 22, pattern: /^DE[0-9]{2}[0-9]{8}[0-9]{10}$/ },
  DK: { length: 18, pattern: /^DK[0-9]{2}[0-9]{4}[0-9]{9}[0-9]{1}$/ },
  DO: { length: 28, pattern: /^DO[0-9]{2}[A-Z0-9]{4}[0-9]{20}$/ },
  EE: { length: 20, pattern: /^EE[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{11}[0-9]{1}$/ },
  EG: { length: 29, pattern: /^EG[0-9]{2}[0-9]{4}[0-9]{4}[0-9]{17}$/ },
  ES: { length: 24, pattern: /^ES[0-9]{2}[0-9]{4}[0-9]{4}[0-9]{1}[0-9]{1}[0-9]{10}$/ },
  FI: { length: 18, pattern: /^FI[0-9]{2}[0-9]{6}[0-9]{7}[0-9]{1}$/ },
  FO: { length: 18, pattern: /^FO[0-9]{2}[0-9]{4}[0-9]{9}[0-9]{1}$/ },
  FR: { length: 27, pattern: /^FR[0-9]{2}[0-9]{5}[0-9]{5}[A-Z0-9]{11}[0-9]{2}$/ },
  GB: { length: 22, pattern: /^GB[0-9]{2}[A-Z]{4}[0-9]{6}[0-9]{8}$/ },
  GE: { length: 22, pattern: /^GE[0-9]{2}[A-Z]{2}[0-9]{16}$/ },
  GI: { length: 23, pattern: /^GI[0-9]{2}[A-Z]{4}[A-Z0-9]{15}$/ },
  GL: { length: 18, pattern: /^GL[0-9]{2}[0-9]{4}[0-9]{9}[0-9]{1}$/ },
  GR: { length: 27, pattern: /^GR[0-9]{2}[0-9]{3}[0-9]{4}[A-Z0-9]{16}$/ },
  GT: { length: 28, pattern: /^GT[0-9]{2}[A-Z0-9]{4}[A-Z0-9]{20}$/ },
  HR: { length: 21, pattern: /^HR[0-9]{2}[0-9]{7}[0-9]{10}$/ },
  HU: { length: 28, pattern: /^HU[0-9]{2}[0-9]{3}[0-9]{4}[0-9]{1}[0-9]{15}[0-9]{1}$/ },
  IE: { length: 22, pattern: /^IE[0-9]{2}[A-Z]{4}[0-9]{6}[0-9]{8}$/ },
  IL: { length: 23, pattern: /^IL[0-9]{2}[0-9]{3}[0-9]{3}[0-9]{13}$/ },
  IS: { length: 26, pattern: /^IS[0-9]{2}[0-9]{4}[0-9]{2}[0-9]{6}[0-9]{10}$/ },
  IT: { length: 27, pattern: /^IT[0-9]{2}[A-Z]{1}[0-9]{5}[0-9]{5}[A-Z0-9]{12}$/ },
  JO: { length: 30, pattern: /^JO[0-9]{2}[A-Z]{4}[0-9]{4}[0-9]{18}$/ },
  KW: { length: 30, pattern: /^KW[0-9]{2}[A-Z]{4}[A-Z0-9]{22}$/ },
  KZ: { length: 20, pattern: /^KZ[0-9]{2}[0-9]{3}[A-Z0-9]{13}$/ },
  LB: { length: 28, pattern: /^LB[0-9]{2}[0-9]{4}[A-Z0-9]{20}$/ },
  LC: { length: 32, pattern: /^LC[0-9]{2}[A-Z]{4}[A-Z0-9]{24}$/ },
  LI: { length: 21, pattern: /^LI[0-9]{2}[0-9]{5}[A-Z0-9]{12}$/ },
  LT: { length: 20, pattern: /^LT[0-9]{2}[0-9]{5}[0-9]{11}$/ },
  LU: { length: 20, pattern: /^LU[0-9]{2}[0-9]{3}[A-Z0-9]{13}$/ },
  LV: { length: 21, pattern: /^LV[0-9]{2}[A-Z]{4}[A-Z0-9]{13}$/ },
  MC: { length: 27, pattern: /^MC[0-9]{2}[0-9]{5}[0-9]{5}[A-Z0-9]{11}[0-9]{2}$/ },
  MD: { length: 24, pattern: /^MD[0-9]{2}[A-Z0-9]{2}[A-Z0-9]{18}$/ },
  ME: { length: 22, pattern: /^ME[0-9]{2}[0-9]{3}[0-9]{13}[0-9]{2}$/ },
  MK: { length: 19, pattern: /^MK[0-9]{2}[0-9]{3}[A-Z0-9]{10}[0-9]{2}$/ },
  MR: { length: 27, pattern: /^MR13[0-9]{5}[0-9]{5}[0-9]{11}[0-9]{2}$/ },
  MT: { length: 31, pattern: /^MT[0-9]{2}[A-Z]{4}[0-9]{5}[A-Z0-9]{18}$/ },
  MU: { length: 30, pattern: /^MU[0-9]{2}[A-Z]{4}[0-9]{2}[0-9]{2}[0-9]{12}[0-9]{3}[A-Z]{3}$/ },
  NL: { length: 18, pattern: /^NL[0-9]{2}[A-Z]{4}[0-9]{10}$/ },
  NO: { length: 15, pattern: /^NO[0-9]{2}[0-9]{4}[0-9]{6}[0-9]{1}$/ },
  PK: { length: 24, pattern: /^PK[0-9]{2}[A-Z]{4}[A-Z0-9]{16}$/ },
  PL: { length: 28, pattern: /^PL[0-9]{2}[0-9]{8}[0-9]{16}$/ },
  PS: { length: 29, pattern: /^PS[0-9]{2}[A-Z]{4}[A-Z0-9]{21}$/ },
  PT: { length: 25, pattern: /^PT[0-9]{2}[0-9]{4}[0-9]{4}[0-9]{11}[0-9]{2}$/ },
  QA: { length: 29, pattern: /^QA[0-9]{2}[A-Z]{4}[A-Z0-9]{21}$/ },
  RO: { length: 24, pattern: /^RO[0-9]{2}[A-Z]{4}[A-Z0-9]{16}$/ },
  RS: { length: 22, pattern: /^RS[0-9]{2}[0-9]{3}[0-9]{13}[0-9]{2}$/ },
  SA: { length: 24, pattern: /^SA[0-9]{2}[0-9]{2}[A-Z0-9]{18}$/ },
  SE: { length: 24, pattern: /^SE[0-9]{2}[0-9]{3}[0-9]{16}[0-9]{1}$/ },
  SI: { length: 19, pattern: /^SI[0-9]{2}[0-9]{5}[0-9]{8}[0-9]{2}$/ },
  SK: { length: 24, pattern: /^SK[0-9]{2}[0-9]{4}[0-9]{6}[0-9]{10}$/ },
  SM: { length: 27, pattern: /^SM[0-9]{2}[A-Z]{1}[0-9]{5}[0-9]{5}[A-Z0-9]{12}$/ },
  TN: { length: 24, pattern: /^TN59[0-9]{2}[0-9]{3}[0-9]{13}[0-9]{2}$/ },
  TR: { length: 26, pattern: /^TR[0-9]{2}[0-9]{5}[A-Z0-9]{1}[A-Z0-9]{16}$/ },
  UA: { length: 29, pattern: /^UA[0-9]{2}[0-9]{6}[A-Z0-9]{19}$/ },
  VG: { length: 24, pattern: /^VG[0-9]{2}[A-Z]{4}[0-9]{16}$/ },
  XK: { length: 20, pattern: /^XK[0-9]{2}[0-9]{4}[0-9]{10}[0-9]{2}$/ }
};

/**
 * Enhanced credit card pattern generator with comprehensive validation
 * @param {Object} options - Configuration options
 * @param {string} options.type - Card type ('visa', 'mastercard', 'amex', 'discover', 'diners', 'jcb', 'unionpay', 'maestro', 'any')
 * @param {boolean} options.allowSpaces - Allow spaces as separators
 * @param {boolean} options.allowHyphens - Allow hyphens as separators
 * @param {boolean} options.strict - Use strict validation (exact length and format)
 * @returns {RegExp} Credit card validation pattern
 */
function generateCreditCardPattern(options = {}) {
  const { 
    type = 'any', 
    allowSpaces = true, 
    allowHyphens = true,
    strict = false 
  } = options;
  
  const separators = [];
  if (allowSpaces) separators.push('\\s');
  if (allowHyphens) separators.push('-');
  const sep = separators.length ? `[${separators.join('')}]?` : '';
  
  if (type === 'any') {
    // Generic pattern for any card (13-19 digits with optional separators)
    const pattern = strict 
      ? `[0-9]{4}${sep}[0-9]{4}${sep}[0-9]{4}${sep}[0-9]{1,7}`
      : `[0-9]{4}${sep}?[0-9]{4}${sep}?[0-9]{4}${sep}?[0-9]{1,7}`;
    return new RegExp(`^${pattern}$`);
  }
  
  const cardType = CREDIT_CARD_TYPES[type];
  if (!cardType) {
    throw new Error(`Unknown card type: ${type}`);
  }
  
  if (strict) {
    return cardType.pattern;
  }
  
  // Generate flexible pattern with separators
  const basePattern = cardType.pattern.source.replace(/\^|\$/g, '');
  const flexiblePattern = basePattern.replace(/\[0-9\]\{(\d+)\}/g, (match, count) => {
    const num = parseInt(count);
    if (num >= 4) {
      // Split longer sequences into groups of 4 with optional separators
      const groups = Math.ceil(num / 4);
      let pattern = '';
      for (let i = 0; i < groups; i++) {
        const remaining = num - (i * 4);
        const groupSize = Math.min(4, remaining);
        pattern += `[0-9]{${groupSize}}`;
        if (i < groups - 1) pattern += sep;
      }
      return pattern;
    }
    return match;
  });
  
  return new RegExp(`^${flexiblePattern}$`);
}

/**
 * Detect credit card type from number
 * @param {string} cardNumber - Credit card number
 * @returns {Object|null} Card type information or null if not detected
 */
function detectCreditCardType(cardNumber) {
  const cleanNumber = cardNumber.replace(/[\s-]/g, '');
  
  for (const [type, info] of Object.entries(CREDIT_CARD_TYPES)) {
    if (info.pattern.test(cleanNumber)) {
      return { type, ...info };
    }
  }
  
  return null;
}

/**
 * Validate credit card using Luhn algorithm
 * @param {string} cardNumber - Credit card number
 * @returns {boolean} Whether the card number is valid
 */
function validateCreditCardLuhn(cardNumber) {
  const cleanNumber = cardNumber.replace(/[\s-]/g, '');
  
  if (!/^\d+$/.test(cleanNumber)) return false;
  
  let sum = 0;
  let isEven = false;
  
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

/**
 * Generate enhanced BIC/SWIFT code pattern
 * @param {Object} options - Configuration options
 * @param {string} options.country - Specific country code (2 letters)
 * @param {boolean} options.includeBranch - Whether to include optional branch code
 * @param {boolean} options.strict - Use strict validation
 * @returns {RegExp} BIC/SWIFT validation pattern
 */
function generateBicPattern(options = {}) {
  const { country = null, includeBranch = true, strict = true } = options;
  
  let pattern = '[A-Z]{4}'; // Bank code (4 letters)
  
  if (country) {
    pattern += country.toUpperCase(); // Specific country
  } else {
    pattern += '[A-Z]{2}'; // Any country (2 letters)
  }
  
  pattern += '[A-Z0-9]{2}'; // Location code (2 letters/digits)
  
  if (includeBranch) {
    pattern += '([A-Z0-9]{3})?'; // Optional branch code (3 letters/digits)
  }
  
  const flags = strict ? '' : 'i';
  return new RegExp(`^${pattern}$`, flags);
}

/**
 * Generate enhanced IBAN pattern with country-specific validation
 * @param {Object} options - Configuration options
 * @param {boolean} options.allowSpaces - Allow spaces in IBAN
 * @param {string} options.country - Specific country code for validation
 * @param {boolean} options.strict - Use strict country-specific validation
 * @returns {RegExp} IBAN validation pattern
 */
function generateIbanPattern(options = {}) {
  const { allowSpaces = true, country = null, strict = false } = options;
  
  if (country && IBAN_PATTERNS[country.toUpperCase()]) {
    const countryPattern = IBAN_PATTERNS[country.toUpperCase()];
    if (allowSpaces) {
      // Insert optional spaces in the pattern
      const spacedPattern = countryPattern.pattern.source
        .replace(/\[0-9\]\{(\d+)\}/g, (match, count) => {
          const num = parseInt(count);
          if (num > 4) {
            return `[0-9\\s]{${Math.ceil(num * 1.25)},${num + Math.floor(num / 4)}}`;
          }
          return match;
        })
        .replace(/\[A-Z0-9\]\{(\d+)\}/g, (match, count) => {
          const num = parseInt(count);
          if (num > 4) {
            return `[A-Z0-9\\s]{${Math.ceil(num * 1.25)},${num + Math.floor(num / 4)}}`;
          }
          return match;
        });
      return new RegExp(spacedPattern, 'i');
    }
    return new RegExp(countryPattern.pattern.source, 'i');
  }
  
  // Generic IBAN pattern
  const sep = allowSpaces ? '\\s?' : '';
  let pattern = `[A-Z]{2}${sep}[0-9]{2}${sep}`;
  
  if (strict) {
    pattern += '[A-Z0-9]{1,30}'; // Strict alphanumeric
  } else {
    pattern += `[A-Z0-9${allowSpaces ? '\\s' : ''}]{1,34}`; // Allow spaces and be more flexible
  }
  
  return new RegExp(`^${pattern}$`, 'i');
}

/**
 * Validate IBAN using MOD-97 algorithm
 * @param {string} iban - IBAN code
 * @returns {boolean} Whether the IBAN is valid
 */
function validateIban(iban) {
  const cleanIban = iban.replace(/\s/g, '').toUpperCase();
  
  if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(cleanIban)) {
    return false;
  }
  
  // Move first 4 characters to end
  const rearranged = cleanIban.slice(4) + cleanIban.slice(0, 4);
  
  // Replace letters with numbers (A=10, B=11, etc.)
  const numericString = rearranged.replace(/[A-Z]/g, (letter) => 
    (letter.charCodeAt(0) - 55).toString()
  );
  
  // Calculate MOD 97
  let remainder = 0;
  for (let i = 0; i < numericString.length; i++) {
    remainder = (remainder * 10 + parseInt(numericString[i])) % 97;
  }
  
  return remainder === 1;
}

/**
 * Generate routing number pattern (US bank routing numbers)
 * @param {Object} options - Configuration options
 * @param {boolean} options.allowHyphens - Allow hyphens as separators
 * @returns {RegExp} Routing number validation pattern
 */
function generateRoutingNumberPattern(options = {}) {
  const { allowHyphens = true } = options;
  const sep = allowHyphens ? '-?' : '';
  
  // US routing numbers: 9 digits, often formatted as XXX-XXX-XXX
  return new RegExp(`^[0-9]{3}${sep}[0-9]{3}${sep}[0-9]{3}$`);
}

/**
 * Generate account number pattern
 * @param {Object} options - Configuration options
 * @param {number} options.minLength - Minimum length
 * @param {number} options.maxLength - Maximum length
 * @param {boolean} options.alphanumeric - Allow letters and numbers
 * @param {boolean} options.allowHyphens - Allow hyphens
 * @returns {RegExp} Account number validation pattern
 */
function generateAccountNumberPattern(options = {}) {
  const { 
    minLength = 4, 
    maxLength = 34, 
    alphanumeric = true, 
    allowHyphens = false 
  } = options;
  
  let charSet = alphanumeric ? 'A-Z0-9' : '0-9';
  if (allowHyphens) charSet += '\\-';
  
  return new RegExp(`^[${charSet}]{${minLength},${maxLength}}$`, 'i');
}

/**
 * Generate sort code pattern (UK bank sort codes)
 * @param {Object} options - Configuration options
 * @param {boolean} options.allowHyphens - Allow hyphens as separators
 * @returns {RegExp} Sort code validation pattern
 */
function generateSortCodePattern(options = {}) {
  const { allowHyphens = true } = options;
  const sep = allowHyphens ? '-?' : '';
  
  // UK sort codes: 6 digits, often formatted as XX-XX-XX
  return new RegExp(`^[0-9]{2}${sep}[0-9]{2}${sep}[0-9]{2}$`);
}

/**
 * Generate BSB pattern (Australian bank state branch)
 * @param {Object} options - Configuration options
 * @param {boolean} options.allowHyphens - Allow hyphens as separators
 * @returns {RegExp} BSB validation pattern
 */
function generateBsbPattern(options = {}) {
  const { allowHyphens = true } = options;
  const sep = allowHyphens ? '-?' : '';
  
  // Australian BSB: 6 digits, often formatted as XXX-XXX
  return new RegExp(`^[0-9]{3}${sep}[0-9]{3}$`);
}

/**
 * Generate comprehensive financial validation object
 * @param {string} type - Type of financial identifier
 * @param {Object} options - Configuration options
 * @returns {Object} Validation object with pattern, validator, and formatter
 */
function generateFinancialPattern(type, options = {}) {
  const patterns = {
    'credit-card': {
      pattern: generateCreditCardPattern(options),
      validator: (value) => validateCreditCardLuhn(value),
      formatter: (value) => value.replace(/(\d{4})(?=\d)/g, '$1 '),
      detector: detectCreditCardType
    },
    'iban': {
      pattern: generateIbanPattern(options),
      validator: (value) => validateIban(value),
      formatter: (value) => value.replace(/(.{4})/g, '$1 ').trim().toUpperCase()
    },
    'bic': {
      pattern: generateBicPattern(options),
      validator: (value) => generateBicPattern(options).test(value),
      formatter: (value) => value.toUpperCase()
    },
    'routing-number': {
      pattern: generateRoutingNumberPattern(options),
      validator: (value) => generateRoutingNumberPattern(options).test(value),
      formatter: (value) => value.replace(/(\d{3})(\d{3})(\d{3})/, '$1-$2-$3')
    },
    'account-number': {
      pattern: generateAccountNumberPattern(options),
      validator: (value) => generateAccountNumberPattern(options).test(value),
      formatter: (value) => value.toUpperCase()
    },
    'sort-code': {
      pattern: generateSortCodePattern(options),
      validator: (value) => generateSortCodePattern(options).test(value),
      formatter: (value) => value.replace(/(\d{2})(\d{2})(\d{2})/, '$1-$2-$3')
    },
    'bsb': {
      pattern: generateBsbPattern(options),
      validator: (value) => generateBsbPattern(options).test(value),
      formatter: (value) => value.replace(/(\d{3})(\d{3})/, '$1-$2')
    }
  };
  
  return patterns[type] || null;
}

// Export all functions and constants
export default {
  // Constants
  CREDIT_CARD_TYPES,
  IBAN_PATTERNS,
  
  // Credit Card functions
  generateCreditCardPattern,
  detectCreditCardType,
  validateCreditCardLuhn,
  generateIbanPattern,
  validateIban,
  generateBicPattern,
  generateRoutingNumberPattern,
  generateAccountNumberPattern,
  generateSortCodePattern,
  generateBsbPattern,
  generateFinancialPattern
  
}