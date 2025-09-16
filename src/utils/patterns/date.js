// Enhanced Date and Time Pattern Generator
// Provides comprehensive regex patterns for various date/time formats

/**
 * Escapes special regex characters in a string
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeRegexChars(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Validates day against month and year (leap year aware)
 * @param {number} day - Day of month
 * @param {number} month - Month (1-12)
 * @param {number} year - Full year
 * @returns {boolean} True if valid date
 */
function isValidDate(day, month, year) {
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
  // Check leap year for February
  if (month === 2 && isLeapYear(year)) {
    daysInMonth[1] = 29;
  }
  
  return day >= 1 && day <= daysInMonth[month - 1];
}

/**
 * Checks if a year is a leap year
 * @param {number} year - Year to check
 * @returns {boolean} True if leap year
 */
function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * Generates comprehensive date patterns with various options
 * @param {Object} options - Configuration options
 * @returns {RegExp} Date pattern regex
 */
 function generateDatePattern(options = {}) {
  const {
    format = 'iso',
    separator = '-',
    allowLeadingZeros = true,
    strict = false,
    yearRange = { min: 1900, max: 2100 },
    allowShortYear = false,
    caseSensitive = false
  } = options;

  const sep = escapeRegexChars(separator);
  const flags = caseSensitive ? '' : 'i';
  
  // Year patterns
  const fullYear = yearRange 
    ? `(?:${yearRange.min}|[${Math.floor(yearRange.min/1000)}${Math.floor(yearRange.max/1000)}][0-9]{3})`
    : '[0-9]{4}';
  const shortYear = allowShortYear ? '|[0-9]{2}' : '';
  const yearPattern = `(?:${fullYear}${shortYear})`;
  
  // Month patterns
  const monthStrict = allowLeadingZeros ? '(?:0[1-9]|1[0-2])' : '(?:0?[1-9]|1[0-2])';
  const monthLoose = '[0-9]{1,2}';
  
  // Day patterns
  const dayStrict = allowLeadingZeros ? '(?:0[1-9]|[12][0-9]|3[01])' : '(?:0?[1-9]|[12]?[0-9]|3[01])';
  const dayLoose = '[0-9]{1,2}';

  const patterns = {
    // ISO format: YYYY-MM-DD
    iso: `${yearPattern}${sep}${monthStrict}${sep}${dayStrict}`,
    
    // US format: MM/DD/YYYY
    us: `${monthStrict}${sep}${dayStrict}${sep}${yearPattern}`,
    
    // European format: DD/MM/YYYY
    eu: `${dayStrict}${sep}${monthStrict}${sep}${yearPattern}`,
    
    // Flexible format
    flexible: `(?:[0-9]{1,2}[${sep}\\/.-]){2}[0-9]{2,4}`,
    
    // Month name formats
    monthName: `(?:${dayStrict}\\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)(?:uary|ruary|ch|il|e|y|ust|tember|ober|ember)?\\s+${yearPattern})`,
    
    // Ordinal dates (e.g., 1st January 2023)
    ordinal: `(?:${dayStrict}(?:st|nd|rd|th)\\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\\s+${yearPattern})`,
    
    // Unix timestamp (seconds)
    unix: '[0-9]{10}',
    
    // Unix timestamp (milliseconds)
    unixMs: '[0-9]{13}',
    
    // Relative dates
    relative: '(?:today|tomorrow|yesterday|\\d+\\s+(?:days?|weeks?|months?|years?)\\s+(?:ago|from\\s+now))'
  };

  let pattern = patterns[format] || patterns.iso;
  
  if (strict && ['iso', 'us', 'eu'].includes(format)) {
    // Add stricter validation for month/day combinations
    // This is a simplified version - full validation would require more complex logic
    pattern = `(?=^${pattern}$)${pattern}`;
  }

  return new RegExp(`^${pattern}$`, flags);
}

/**
 * Generates time patterns with comprehensive options
 * @param {Object} options - Configuration options
 * @returns {RegExp} Time pattern regex
 */
 function generateTimePattern(options = {}) {
  const {
    format = '24h',
    includeSeconds = false,
    includeMilliseconds = false,
    includeTimezone = false,
    allowLeadingZeros = true,
    strict = false,
    caseSensitive = false
  } = options;

  const flags = caseSensitive ? '' : 'i';
  
  // Components
  let seconds = '';
  if (includeSeconds) {
    const secPattern = allowLeadingZeros ? '[0-5][0-9]' : '(?:[0-5]?[0-9])';
    seconds = `:${secPattern}`;
    
    if (includeMilliseconds) {
      seconds += '(?:\\.[0-9]{1,3})?';
    }
  }

  // Timezone patterns
  let timezone = '';
  if (includeTimezone) {
    timezone = '(?:\\s*(?:Z|[+-](?:0[0-9]|1[0-4]):[0-5][0-9]|[+-](?:0[0-9]|1[0-4])[0-5][0-9]|UTC|GMT|[A-Z]{3,4}))?';
  }

  const hour24 = allowLeadingZeros ? '(?:[01][0-9]|2[0-3])' : '(?:[01]?[0-9]|2[0-3])';
  const hour12 = allowLeadingZeros ? '(?:0[1-9]|1[0-2])' : '(?:0?[1-9]|1[0-2])';
  const minute = allowLeadingZeros ? '[0-5][0-9]' : '(?:[0-5]?[0-9])';

  const patterns = {
    // 24-hour format
    '24h': `${hour24}:${minute}${seconds}${timezone}`,
    
    // 12-hour format with AM/PM
    '12h': `${hour12}:${minute}${seconds}\\s*(?:AM|PM|am|pm|a\\.m\\.|p\\.m\\.)${timezone}`,
    
    // Loose format (accepts various hour formats)
    loose: `(?:[0-9]{1,2}):${minute}${seconds}${timezone}`,
    
    // Military time (no colons)
    military: `(?:[01][0-9]|2[0-3])[0-5][0-9]${timezone}`,
    
    // Compact format
    compact: `[0-9]{1,2}[0-5][0-9](?:[0-5][0-9])?${timezone}`,
    
    // Fractional hours (e.g., 14.5 for 2:30 PM)
    fractional: '[0-9]{1,2}(?:\\.[0-9]{1,2})?',
    
    // Time ranges
    range: `(?:${hour24}:${minute}${seconds}\\s*[-–]\\s*${hour24}:${minute}${seconds})${timezone}`,
    
    // Relative times
    relative: '(?:now|\\d+\\s+(?:seconds?|minutes?|hours?)\\s+(?:ago|from\\s+now))'
  };

  const pattern = patterns[format] || patterns['24h'];
  return new RegExp(`^${pattern}$`, flags);
}

/**
 * Generates combined date-time patterns
 * @param {Object} options - Configuration options
 * @returns {RegExp} DateTime pattern regex
 */
 function generateDateTimePattern(options = {}) {
  const {
    dateSeparator = '[T\\s@]',
    strict = false,
    ...restOptions
  } = options;

  const datePattern = generateDatePattern(restOptions);
  const timePattern = generateTimePattern(restOptions);
  
  const separator = escapeRegexChars(dateSeparator);
  
  // Remove ^ and $ from individual patterns to combine them
  const dateSource = datePattern.source.slice(1, -1);
  const timeSource = timePattern.source.slice(1, -1);
  
  const flags = datePattern.flags || '';
  
  return new RegExp(`^${dateSource}${separator}${timeSource}$`, flags);
}

/**
 * Generates duration patterns (e.g., "2h 30m", "1:30:45")
 * @param {Object} options - Configuration options
 * @returns {RegExp} Duration pattern regex
 */
 function generateDurationPattern(options = {}) {
  const {
    format = 'verbose', // 'verbose', 'compact', 'iso8601'
    caseSensitive = false
  } = options;

  const flags = caseSensitive ? '' : 'i';

  const patterns = {
    // Verbose: "2 hours 30 minutes 15 seconds"
    verbose: '(?:(?:\\d+\\s*(?:years?|y)\\s*)?(?:\\d+\\s*(?:months?|mo)\\s*)?(?:\\d+\\s*(?:weeks?|w)\\s*)?(?:\\d+\\s*(?:days?|d)\\s*)?(?:\\d+\\s*(?:hours?|hrs?|h)\\s*)?(?:\\d+\\s*(?:minutes?|mins?|m)\\s*)?(?:\\d+\\s*(?:seconds?|secs?|s)\\s*)?)',
    
    // Compact: "2h30m15s"
    compact: '(?:(?:\\d+[yY])?(?:\\d+(?:mo|M))?(?:\\d+[wW])?(?:\\d+[dD])?(?:\\d+[hH])?(?:\\d+[mM])?(?:\\d+[sS])?)',
    
    // Colon format: "2:30:15" or "30:15"
    colon: '(?:(?:\\d+:)?\\d{1,2}:\\d{2}(?:\\.\\d{1,3})?)',
    
    // ISO 8601 duration: P1Y2M3DT4H5M6S
    iso8601: 'P(?:(?:\\d+Y)?(?:\\d+M)?(?:\\d+D)?(?:T(?:\\d+H)?(?:\\d+M)?(?:\\d+(?:\\.\\d+)?S)?)?)',
    
    // Mixed format
    mixed: '(?:(?:\\d+[yYwWdDhHmMsS]\\s*)+|(?:\\d+:)?\\d{1,2}:\\d{2}(?:\\.\\d{1,3})?)'
  };

  const pattern = patterns[format] || patterns.verbose;
  return new RegExp(`^${pattern}$`, flags);
}

/**
 * Validates a date string against multiple patterns
 * @param {string} dateString - Date string to validate
 * @param {Array} formats - Array of format names to try
 * @returns {Object} Validation result with matched format
 */
 function validateDate(dateString, formats = ['iso', 'us', 'eu']) {
  const results = {
    isValid: false,
    matchedFormat: null,
    parsedDate: null,
    errors: []
  };

  for (const format of formats) {
    try {
      const pattern = generateDatePattern({ format });
      if (pattern.test(dateString)) {
        // Attempt to parse the date
        let parsedDate;
        switch (format) {
          case 'iso':
            parsedDate = new Date(dateString);
            break;
          case 'us':
            const [month, day, year] = dateString.split(/[-\/]/);
            parsedDate = new Date(year, month - 1, day);
            break;
          case 'eu':
            const [day2, month2, year2] = dateString.split(/[-\/]/);
            parsedDate = new Date(year2, month2 - 1, day2);
            break;
          default:
            parsedDate = new Date(dateString);
        }
        
        if (!isNaN(parsedDate.getTime())) {
          results.isValid = true;
          results.matchedFormat = format;
          results.parsedDate = parsedDate;
          return results;
        }
      }
    } catch (error) {
      results.errors.push(`${format}: ${error.message}`);
    }
  }

  return results;
}

/**
 * Creates a comprehensive pattern that matches multiple date/time formats
 * @param {Object} options - Configuration options
 * @returns {RegExp} Multi-format pattern
 */
 function createMultiFormatPattern(options = {}) {
  const {
    includeFormats = ['iso', 'us', 'eu', '24h', '12h'],
    separator = '|'
  } = options;

  const patterns = [];
  
  for (const format of includeFormats) {
    try {
      let pattern;
      if (['iso', 'us', 'eu', 'flexible', 'monthName', 'ordinal'].includes(format)) {
        pattern = generateDatePattern({ format });
      } else if (['24h', '12h', 'loose', 'military'].includes(format)) {
        pattern = generateTimePattern({ format });
      }
      
      if (pattern) {
        // Remove ^ and $ anchors for combining
        patterns.push(pattern.source.slice(1, -1));
      }
    } catch (error) {
      console.warn(`Failed to create pattern for format ${format}:`, error);
    }
  }

  return new RegExp(`^(?:${patterns.join(separator)})$`);
}

// Export utility functions
export {
    generateDatePattern,
    generateTimePattern,
    generateDateTimePattern,
    generateDurationPattern,
    validateDate,
    createMultiFormatPattern,
    escapeRegexChars,
    isValidDate,
    isLeapYear
};