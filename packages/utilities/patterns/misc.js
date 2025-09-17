/**
 * Miscellaneous regex pattern generators
 * Provides patterns for usernames, slugs, files, social media, and various text formats
 */

/**
 * Generate username pattern with customizable rules
 * @param {Object} options - Configuration options
 * @returns {string} Username regex pattern
 */
export function generateUsernamePattern(options = {}) {
  const {
    minLength = 3,
    maxLength = 30,
    allowDots = true,
    allowHyphens = true,
    allowUnderscores = true,
    startWithLetter = true,
    endWithAlphanumeric = true,
    strict = false
  } = options;

  let charClass = 'a-zA-Z0-9';
  if (allowDots) charClass += '.';
  if (allowHyphens) charClass += '-';
  if (allowUnderscores) charClass += '_';

  let pattern;
  if (strict) {
    const start = startWithLetter ? '[a-zA-Z]' : `[${charClass}]`;
    const middle = maxLength > 2 ? `[${charClass}]*` : '';
    const end = endWithAlphanumeric && maxLength > 1 ? '[a-zA-Z0-9]' : '';
    
    if (maxLength === 1) {
      pattern = start;
    } else if (maxLength === 2) {
      pattern = `${start}${endWithAlphanumeric ? '[a-zA-Z0-9]' : `[${charClass}]`}`;
    } else {
      pattern = `${start}${middle}${end}`;
    }
    
    pattern = `^${pattern}{${minLength},${maxLength}}$`;
  } else {
    pattern = `^[${charClass}]{${minLength},${maxLength}}$`;
  }

  return pattern;
}

/**
 * Generate URL-friendly slug pattern
 * @param {Object} options - Configuration options
 * @returns {string} Slug regex pattern
 */
export function generateSlugPattern(options = {}) {
  const {
    minLength = 1,
    maxLength = 200,
    allowNumbers = true,
    allowUnicode = false,
    strict = true
  } = options;

  let charClass = 'a-z';
  if (allowNumbers) charClass += '0-9';
  if (allowUnicode) charClass += '\\u00a1-\\uffff';

  const pattern = strict 
    ? `^[${charClass}]([${charClass}-]*[${charClass}])?$`
    : `^[${charClass}-]{${minLength},${maxLength}}$`;

  return pattern;
}

/**
 * Generate filename pattern with extension validation
 * @param {Object} options - Configuration options
 * @returns {string} Filename regex pattern
 */
export function generateFileNamePattern(options = {}) {
  const {
    allowSpaces = false,
    allowSpecialChars = false,
    requireExtension = false,
    maxLength = 255,
    restrictedNames = ['CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'],
    caseSensitive = false
  } = options;

  let charClass = 'a-zA-Z0-9._-';
  if (allowSpaces) charClass += ' ';
  if (allowSpecialChars) charClass += '!@#$%^&()+={}[]';

  const namePattern = `[${charClass}]+`;
  const extensionPattern = requireExtension ? '\\.[a-zA-Z0-9]+' : '(?:\\.[a-zA-Z0-9]+)?';
  
  let pattern = `^(?!(?:${restrictedNames.join('|')})(?:\\.|$))${namePattern}${extensionPattern}$`;
  
  if (!caseSensitive) {
    pattern = `(?i)${pattern}`;
  }

  return pattern;
}

/**
 * Generate file extension pattern
 * @param {Object} options - Configuration options
 * @returns {string} File extension regex pattern
 */
export function generateFileExtensionPattern(options = {}) {
  const {
    extensions = [],
    allowEmpty = false,
    minLength = 1,
    maxLength = 10,
    caseSensitive = false
  } = options;

  if (extensions.length > 0) {
    const extList = extensions.join('|');
    return caseSensitive ? `\\.(${extList})$` : `\\.(?i:${extList})$`;
  }

  const pattern = allowEmpty 
    ? `(?:\\.[a-zA-Z0-9]{${minLength},${maxLength}})?$`
    : `\\.[a-zA-Z0-9]{${minLength},${maxLength}}$`;

  return pattern;
}

/**
 * Generate hashtag pattern for social media
 * @param {Object} options - Configuration options
 * @returns {string} Hashtag regex pattern
 */
export function generateHashtagPattern(options = {}) {
  const {
    minLength = 1,
    maxLength = 100,
    allowNumbers = true,
    allowUnicode = true,
    requireWordBoundary = true
  } = options;

  let charClass = 'a-zA-Z';
  if (allowNumbers) charClass += '0-9';
  if (allowUnicode) charClass += '\\u00a1-\\uffff';

  const boundary = requireWordBoundary ? '\\b' : '';
  return `${boundary}#[${charClass}_]{${minLength},${maxLength}}${boundary}`;
}

/**
 * Generate mention pattern (@username)
 * @param {Object} options - Configuration options
 * @returns {string} Mention regex pattern
 */
export function generateMentionPattern(options = {}) {
  const {
    minLength = 1,
    maxLength = 30,
    allowDots = false,
    allowHyphens = true,
    allowUnderscores = true,
    requireWordBoundary = true
  } = options;

  let charClass = 'a-zA-Z0-9';
  if (allowDots) charClass += '.';
  if (allowHyphens) charClass += '-';
  if (allowUnderscores) charClass += '_';

  const boundary = requireWordBoundary ? '\\b' : '';
  return `${boundary}@[${charClass}]{${minLength},${maxLength}}${boundary}`;
}

/**
 * Generate emoji pattern (Unicode emoji ranges)
 * @param {Object} options - Configuration options
 * @returns {string} Emoji regex pattern
 */
export function generateEmojiPattern(options = {}) {
  const {
    includeTextEmojis = false,
    includeSkinTones = true,
    includeZWJ = true // Zero Width Joiner sequences
  } = options;

  // Unicode emoji ranges
  let pattern = '(?:';
  const ranges = [
    '\\u{1F600}-\\u{1F64F}', // Emoticons
    '\\u{1F300}-\\u{1F5FF}', // Misc Symbols and Pictographs
    '\\u{1F680}-\\u{1F6FF}', // Transport and Map
    '\\u{1F1E0}-\\u{1F1FF}', // Regional indicators
    '\\u{2600}-\\u{26FF}',   // Misc symbols
    '\\u{2700}-\\u{27BF}',   // Dingbats
    '\\u{1F900}-\\u{1F9FF}', // Supplemental Symbols and Pictographs
    '\\u{1F018}-\\u{1F270}', // Various symbols
  ];

  pattern += ranges.join('|');

  if (includeSkinTones) {
    pattern += '|\\u{1F3FB}-\\u{1F3FF}'; // Skin tone modifiers
  }

  if (includeZWJ) {
    pattern += '|\\u{200D}'; // Zero width joiner
  }

  pattern += ')';

  if (includeTextEmojis) {
    const textEmojis = [
      ':-?\\)', ':-?\\(', ':-?D', ':-?P', ':-?\\|', ':-?\\/\\/',
      ';-?\\)', '8-?\\)', 'XD', 'x-?D', 'o_O', 'O_o',
      '<3', '</3', ':\\*', ':-?\\*'
    ];
    pattern = `(?:${pattern}|${textEmojis.join('|')})`;
  }

  return pattern;
}

/**
 * Generate currency pattern with symbol and amount
 * @param {Object} options - Configuration options
 * @returns {string} Currency regex pattern
 */
export function generateCurrencyPattern(options = {}) {
  const {
    symbols = ['$', '€', '£', '¥', '₹', '₽', '₩', '₦', '₡', '₪'],
    allowDecimals = true,
    decimalPlaces = 2,
    thousandsSeparator = ',',
    allowNegative = false,
    symbolPosition = 'before' // 'before', 'after', 'both'
  } = options;

  const symbolPattern = symbols.map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const separatorPattern = thousandsSeparator ? `\\${thousandsSeparator}?` : '';
  
  let numberPattern = `\\d{1,3}(?:${separatorPattern}\\d{3})*`;
  if (allowDecimals) {
    numberPattern += `(?:\\.\\d{1,${decimalPlaces}})?`;
  }

  const negativePattern = allowNegative ? '-?' : '';

  switch (symbolPosition) {
    case 'before':
      return `${negativePattern}(?:${symbolPattern})${numberPattern}`;
    case 'after':
      return `${negativePattern}${numberPattern}(?:${symbolPattern})`;
    case 'both':
      return `${negativePattern}(?:(?:${symbolPattern})${numberPattern}|${numberPattern}(?:${symbolPattern}))`;
    default:
      return `${negativePattern}(?:${symbolPattern})?${numberPattern}(?:${symbolPattern})?`;
  }
}

/**
 * Generate coordinate pattern (latitude/longitude)
 * @param {Object} options - Configuration options
 * @returns {string} Coordinate regex pattern
 */
export function generateCoordinatePattern(options = {}) {
  const {
    format = 'decimal', // 'decimal', 'dms' (degrees-minutes-seconds), 'both'
    precision = 6,
    allowSigned = true,
    requireComma = false
  } = options;

  const decimalPattern = allowSigned 
    ? `-?(?:180(?:\\.0+)?|(?:1[0-7]\\d|\\d{1,2})(?:\\.\\d{1,${precision}})?)`
    : `(?:180(?:\\.0+)?|(?:1[0-7]\\d|\\d{1,2})(?:\\.\\d{1,${precision}})?)`;

  const dmsPattern = `\\d{1,3}°\\s*\\d{1,2}'\\s*\\d{1,2}(?:\\.\\d+)?"\\s*[NSEW]`;

  const separator = requireComma ? '\\s*,\\s*' : '\\s*[,\\s]\\s*';

  switch (format) {
    case 'decimal':
      return `${decimalPattern}${separator}${decimalPattern}`;
    case 'dms':
      return `${dmsPattern}${separator}${dmsPattern}`;
    case 'both':
      const decimal = `${decimalPattern}${separator}${decimalPattern}`;
      const dms = `${dmsPattern}${separator}${dmsPattern}`;
      return `(?:${decimal}|${dms})`;
    default:
      return `${decimalPattern}${separator}${decimalPattern}`;
  }
}

/**
 * Generate markdown link pattern
 * @param {Object} options - Configuration options
 * @returns {string} Markdown link regex pattern
 */
export function generateMarkdownLinkPattern(options = {}) {
  const {
    includeImages = false,
    allowEmpty = false,
    validateUrl = false
  } = options;

  const textPattern = allowEmpty ? '[^\\]]*' : '[^\\]]+';
  const urlPattern = validateUrl 
    ? 'https?:\\/\\/[^\\s\\)]+' 
    : '[^\\)]*';

  let pattern = `\\[${textPattern}\\]\\(${urlPattern}\\)`;
  
  if (includeImages) {
    pattern = `!?${pattern}`;
  }

  return pattern;
}

/**
 * Generate HTML tag pattern
 * @param {Object} options - Configuration options
 * @returns {string} HTML tag regex pattern
 */
export function generateHtmlTagPattern(options = {}) {
  const {
    tagNames = [],
    includeAttributes = true,
    selfClosing = true,
    caseSensitive = false
  } = options;

  const tagPattern = tagNames.length > 0 
    ? `(?:${tagNames.join('|')})` 
    : '[a-zA-Z][a-zA-Z0-9]*';

  const attributePattern = includeAttributes 
    ? '(?:\\s+[a-zA-Z-]+(?:=(?:"[^"]*"|\'[^\']*\'|[^\\s>]+))?)*\\s*'
    : '\\s*';

  let pattern;
  if (selfClosing) {
    pattern = `<${tagPattern}${attributePattern}(?:\\/?>|>[\\s\\S]*?<\\/${tagPattern}>)`;
  } else {
    pattern = `<${tagPattern}${attributePattern}>[\\s\\S]*?<\\/${tagPattern}>`;
  }

  return caseSensitive ? pattern : `(?i)${pattern}`;
}

/**
 * Generate Base64 pattern
 * @param {Object} options - Configuration options
 * @returns {string} Base64 regex pattern
 */
export function generateBase64Pattern(options = {}) {
  const {
    strict = true,
    allowLineBreaks = false,
    allowUrlSafe = true,
    minLength = 4
  } = options;

  let charClass = 'A-Za-z0-9+/';
  if (allowUrlSafe) {
    charClass = 'A-Za-z0-9+/\\-_';
  }

  let pattern;
  if (strict) {
    // Proper Base64 with padding
    pattern = `(?:[${charClass}]{4})*(?:[${charClass}]{2}==|[${charClass}]{3}=)?`;
  } else {
    // Relaxed Base64
    pattern = `[${charClass}]+={0,2}`;
  }

  if (allowLineBreaks) {
    pattern = `(?:${pattern}|\\s)*`;
  }

  return `^(?=.{${minLength},})${pattern}$`;
}

/**
 * Generate loose UUID pattern (more permissive)
 * @param {Object} options - Configuration options
 * @returns {string} UUID regex pattern
 */
export function generateUuidLoosePattern(options = {}) {
  const {
    allowHyphens = true,
    allowBraces = false,
    allowUppercase = true,
    strict = false
  } = options;

  let hexClass = allowUppercase ? '[a-fA-F0-9]' : '[a-f0-9]';
  let pattern;

  if (strict) {
    // Standard UUID format: 8-4-4-4-12
    pattern = `${hexClass}{8}-${hexClass}{4}-${hexClass}{4}-${hexClass}{4}-${hexClass}{12}`;
  } else if (allowHyphens) {
    pattern = `${hexClass}{8}-?${hexClass}{4}-?${hexClass}{4}-?${hexClass}{4}-?${hexClass}{12}`;
  } else {
    pattern = `${hexClass}{32}`;
  }

  if (allowBraces) {
    pattern = `\\{?${pattern}\\}?`;
  }

  return `^${pattern}$`;
}

/**
 * Generate number pattern with various formats
 * @param {Object} options - Configuration options
 * @returns {string} Number regex pattern
 */
export function generateAnyNumberPattern(options = {}) {
  const {
    allowNegative = true,
    allowDecimals = true,
    allowScientific = true,
    allowFractions = false,
    thousandsSeparator = ',',
    decimalSeparator = '.'
  } = options;

  let patterns = [];

  // Integer with thousands separator
  let intPattern = '\\d{1,3}';
  if (thousandsSeparator) {
    intPattern += `(?:\\${thousandsSeparator}\\d{3})*`;
  } else {
    intPattern = '\\d+';
  }

  patterns.push(intPattern);

  // Decimal number
  if (allowDecimals) {
    const decSep = decimalSeparator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    patterns.push(`\\d*\\${decSep}\\d+`);
    patterns.push(`${intPattern}\\${decSep}\\d+`);
  }

  // Scientific notation
  if (allowScientific) {
    patterns.push('\\d+(?:\\.\\d+)?[eE][+-]?\\d+');
  }

  // Fractions
  if (allowFractions) {
    patterns.push('\\d+\\/\\d+');
    patterns.push('\\d+\\s+\\d+\\/\\d+'); // Mixed numbers
  }

  let pattern = `(?:${patterns.join('|')})`;
  
  if (allowNegative) {
    pattern = `[+-]?${pattern}`;
  }

  return `^${pattern}$`;
}

/**
 * Generate whitespace pattern
 * @param {Object} options - Configuration options
 * @returns {string} Whitespace regex pattern
 */
export function generateWhitespacePattern(options = {}) {
  const {
    includeNewlines = true,
    includeTabs = true,
    includeUnicodeSpaces = false,
    minLength = 1,
    maxLength = null
  } = options;

  let charClass = ' ';
  if (includeNewlines) charClass += '\\r\\n';
  if (includeTabs) charClass += '\\t';
  if (includeUnicodeSpaces) {
    charClass += '\\u00A0\\u2000-\\u200B\\u2028\\u2029';
  }

  const quantifier = maxLength 
    ? `{${minLength},${maxLength}}`
    : minLength > 1 
      ? `{${minLength},}` 
      : '+';

  return `[${charClass}]${quantifier}`;
}

/**
 * Generate quoted string pattern
 * @param {Object} options - Configuration options
 * @returns {string} Quoted string regex pattern
 */
export function generateQuotedStringPattern(options = {}) {
  const {
    quotes = ['"', "'"],
    allowEscapes = true,
    allowEmpty = true,
    multiline = false,
    allowNested = false
  } = options;

  const patterns = quotes.map(quote => {
    const escapedQuote = quote.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    let content;
    if (allowEscapes) {
      content = allowEmpty 
        ? `(?:[^${escapedQuote}\\\\]|\\\\.)*`
        : `(?:[^${escapedQuote}\\\\]|\\\\.)+`;
    } else {
      content = allowEmpty 
        ? `[^${escapedQuote}]*`
        : `[^${escapedQuote}]+`;
    }

    if (multiline) {
      content = content.replace('\\\\', '\\\\\\s');
    }

    if (allowNested && quote === '"') {
      content = `(?:[^"\\\\]|\\\\.|'[^']*')*`;
    } else if (allowNested && quote === "'") {
      content = `(?:[^'\\\\]|\\\\.|"[^"]*")*`;
    }

    return `${escapedQuote}${content}${escapedQuote}`;
  });

  return `(?:${patterns.join('|')})`;
}

// Export all pattern generators
export {
  generateUsernamePattern,
  generateSlugPattern,
  generateFileNamePattern,
  generateFileExtensionPattern,
  generateHashtagPattern,
  generateMentionPattern,
  generateEmojiPattern,
  generateCurrencyPattern,
  generateCoordinatePattern,
  generateMarkdownLinkPattern,
  generateHtmlTagPattern,
  generateBase64Pattern,
  generateUuidLoosePattern,
  generateAnyNumberPattern,
  generateWhitespacePattern,
  generateQuotedStringPattern
};