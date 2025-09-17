/**
 * Unicode utility functions for text processing and analysis
 * Enhanced version with comprehensive Unicode support
 */

// Unicode category mappings for more accurate detection
const UNICODE_CATEGORIES = {
  // Letters
  Lu: 'Uppercase Letter',
  Ll: 'Lowercase Letter', 
  Lt: 'Titlecase Letter',
  Lm: 'Modifier Letter',
  Lo: 'Other Letter',
  
  // Marks
  Mn: 'Nonspacing Mark',
  Mc: 'Spacing Mark',
  Me: 'Enclosing Mark',
  
  // Numbers
  Nd: 'Decimal Number',
  Nl: 'Letter Number',
  No: 'Other Number',
  
  // Punctuation
  Pc: 'Connector Punctuation',
  Pd: 'Dash Punctuation',
  Ps: 'Open Punctuation',
  Pe: 'Close Punctuation',
  Pi: 'Initial Punctuation',
  Pf: 'Final Punctuation',
  Po: 'Other Punctuation',
  
  // Symbols
  Sm: 'Math Symbol',
  Sc: 'Currency Symbol',
  Sk: 'Modifier Symbol',
  So: 'Other Symbol',
  
  // Separators
  Zs: 'Space Separator',
  Zl: 'Line Separator',
  Zp: 'Paragraph Separator',
  
  // Other
  Cc: 'Control',
  Cf: 'Format',
  Cs: 'Surrogate',
  Co: 'Private Use',
  Cn: 'Unassigned'
};

// Extended Unicode block ranges
const UNICODE_BLOCKS = {
  'Basic Latin': [0x0000, 0x007F],
  'Latin-1 Supplement': [0x0080, 0x00FF],
  'Latin Extended-A': [0x0100, 0x017F],
  'Latin Extended-B': [0x0180, 0x024F],
  'IPA Extensions': [0x0250, 0x02AF],
  'Spacing Modifier Letters': [0x02B0, 0x02FF],
  'Combining Diacritical Marks': [0x0300, 0x036F],
  'Greek and Coptic': [0x0370, 0x03FF],
  'Cyrillic': [0x0400, 0x04FF],
  'Cyrillic Supplement': [0x0500, 0x052F],
  'Armenian': [0x0530, 0x058F],
  'Hebrew': [0x0590, 0x05FF],
  'Arabic': [0x0600, 0x06FF],
  'Syriac': [0x0700, 0x074F],
  'Arabic Supplement': [0x0750, 0x077F],
  'Thaana': [0x0780, 0x07BF],
  'Devanagari': [0x0900, 0x097F],
  'Bengali': [0x0980, 0x09FF],
  'Gurmukhi': [0x0A00, 0x0A7F],
  'Gujarati': [0x0A80, 0x0AFF],
  'Oriya': [0x0B00, 0x0B7F],
  'Tamil': [0x0B80, 0x0BFF],
  'Telugu': [0x0C00, 0x0C7F],
  'Kannada': [0x0C80, 0x0CFF],
  'Malayalam': [0x0D00, 0x0D7F],
  'Sinhala': [0x0D80, 0x0DFF],
  'Thai': [0x0E00, 0x0E7F],
  'Lao': [0x0E80, 0x0EFF],
  'Tibetan': [0x0F00, 0x0FFF],
  'Myanmar': [0x1000, 0x109F],
  'Georgian': [0x10A0, 0x10FF],
  'Hangul Jamo': [0x1100, 0x11FF],
  'Ethiopic': [0x1200, 0x137F],
  'Cherokee': [0x13A0, 0x13FF],
  'Unified Canadian Aboriginal Syllabics': [0x1400, 0x167F],
  'Ogham': [0x1680, 0x169F],
  'Runic': [0x16A0, 0x16FF],
  'Tagalog': [0x1700, 0x171F],
  'Hanunoo': [0x1720, 0x173F],
  'Buhid': [0x1740, 0x175F],
  'Tagbanwa': [0x1760, 0x177F],
  'Khmer': [0x1780, 0x17FF],
  'Mongolian': [0x1800, 0x18AF],
  'Latin Extended Additional': [0x1E00, 0x1EFF],
  'Greek Extended': [0x1F00, 0x1FFF],
  'General Punctuation': [0x2000, 0x206F],
  'Superscripts and Subscripts': [0x2070, 0x209F],
  'Currency Symbols': [0x20A0, 0x20CF],
  'Combining Diacritical Marks for Symbols': [0x20D0, 0x20FF],
  'Letterlike Symbols': [0x2100, 0x214F],
  'Number Forms': [0x2150, 0x218F],
  'Arrows': [0x2190, 0x21FF],
  'Mathematical Operators': [0x2200, 0x22FF],
  'Miscellaneous Technical': [0x2300, 0x23FF],
  'Control Pictures': [0x2400, 0x243F],
  'Optical Character Recognition': [0x2440, 0x245F],
  'Enclosed Alphanumerics': [0x2460, 0x24FF],
  'Box Drawing': [0x2500, 0x257F],
  'Block Elements': [0x2580, 0x259F],
  'Geometric Shapes': [0x25A0, 0x25FF],
  'Miscellaneous Symbols': [0x2600, 0x26FF],
  'Dingbats': [0x2700, 0x27BF],
  'Miscellaneous Mathematical Symbols-A': [0x27C0, 0x27EF],
  'Supplemental Arrows-A': [0x27F0, 0x27FF],
  'Braille Patterns': [0x2800, 0x28FF],
  'Supplemental Arrows-B': [0x2900, 0x297F],
  'Miscellaneous Mathematical Symbols-B': [0x2980, 0x29FF],
  'Supplemental Mathematical Operators': [0x2A00, 0x2AFF],
  'Miscellaneous Symbols and Arrows': [0x2B00, 0x2BFF],
  'CJK Radicals Supplement': [0x2E80, 0x2EFF],
  'Kangxi Radicals': [0x2F00, 0x2FDF],
  'Ideographic Description Characters': [0x2FF0, 0x2FFF],
  'CJK Symbols and Punctuation': [0x3000, 0x303F],
  'Hiragana': [0x3040, 0x309F],
  'Katakana': [0x30A0, 0x30FF],
  'Bopomofo': [0x3100, 0x312F],
  'Hangul Compatibility Jamo': [0x3130, 0x318F],
  'Kanbun': [0x3190, 0x319F],
  'Bopomofo Extended': [0x31A0, 0x31BF],
  'CJK Strokes': [0x31C0, 0x31EF],
  'Katakana Phonetic Extensions': [0x31F0, 0x31FF],
  'Enclosed CJK Letters and Months': [0x3200, 0x32FF],
  'CJK Compatibility': [0x3300, 0x33FF],
  'CJK Unified Ideographs Extension A': [0x3400, 0x4DBF],
  'Yijing Hexagram Symbols': [0x4DC0, 0x4DFF],
  'CJK Unified Ideographs': [0x4E00, 0x9FFF],
  'Yi Syllables': [0xA000, 0xA48F],
  'Yi Radicals': [0xA490, 0xA4CF],
  'Hangul Syllables': [0xAC00, 0xD7AF],
  'High Surrogates': [0xD800, 0xDB7F],
  'High Private Use Surrogates': [0xDB80, 0xDBFF],
  'Low Surrogates': [0xDC00, 0xDFFF],
  'Private Use Area': [0xE000, 0xF8FF],
  'CJK Compatibility Ideographs': [0xF900, 0xFAFF],
  'Alphabetic Presentation Forms': [0xFB00, 0xFB4F],
  'Arabic Presentation Forms-A': [0xFB50, 0xFDFF],
  'Variation Selectors': [0xFE00, 0xFE0F],
  'Vertical Forms': [0xFE10, 0xFE1F],
  'Combining Half Marks': [0xFE20, 0xFE2F],
  'CJK Compatibility Forms': [0xFE30, 0xFE4F],
  'Small Form Variants': [0xFE50, 0xFE6F],
  'Arabic Presentation Forms-B': [0xFE70, 0xFEFF],
  'Halfwidth and Fullwidth Forms': [0xFF00, 0xFFEF],
  'Specials': [0xFFF0, 0xFFFF],
  'Emoticons': [0x1F600, 0x1F64F],
  'Miscellaneous Symbols and Pictographs': [0x1F300, 0x1F5FF],
  'Transport and Map Symbols': [0x1F680, 0x1F6FF],
  'Supplemental Symbols and Pictographs': [0x1F900, 0x1F9FF]
};

// Bidirectional character types
const BIDI_TYPES = {
  L: 'Left-to-Right',
  R: 'Right-to-Left',
  AL: 'Arabic Letter',
  AN: 'Arabic Number',
  EN: 'European Number',
  ES: 'European Number Separator',
  ET: 'European Number Terminator',
  CS: 'Common Number Separator',
  NSM: 'Nonspacing Mark',
  BN: 'Boundary Neutral',
  B: 'Paragraph Separator',
  S: 'Segment Separator',
  WS: 'Whitespace',
  ON: 'Other Neutral'
};

/**
 * Convert string to array of Unicode code points
 */
function toCodePoints(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected string input');
  }
  return Array.from(str, char => char.codePointAt(0));
}

/**
 * Convert array of code points to string
 */
function fromCodePoints(codePoints) {
  if (!Array.isArray(codePoints)) {
    throw new TypeError('Expected array of code points');
  }
  
  // Validate code points
  for (const cp of codePoints) {
    if (!Number.isInteger(cp) || cp < 0 || cp > 0x10FFFF) {
      throw new RangeError(`Invalid code point: ${cp}`);
    }
  }
  
  return String.fromCodePoint(...codePoints);
}

/**
 * Split string into grapheme clusters (user-perceived characters)
 */
function splitGraphemes(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected string input');
  }
  
  if (!Intl.Segmenter) {
    // Enhanced fallback for browsers without Intl.Segmenter
    return Array.from(str);
  }
  
  const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
  return Array.from(segmenter.segment(str), segment => segment.segment);
}

/**
 * Normalize Unicode string using specified form
 */
function normalizeUnicode(str, form = 'NFC') {
  if (typeof str !== 'string') {
    throw new TypeError('Expected string input');
  }
  
  const forms = ['NFC', 'NFD', 'NFKC', 'NFKD'];
  if (!forms.includes(form)) {
    throw new Error(`Invalid normalization form: ${form}. Must be one of: ${forms.join(', ')}`);
  }
  
  return str.normalize(form);
}

/**
 * Get count of grapheme clusters in string
 */
function getGraphemeCount(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected string input');
  }
  
  if (!Intl.Segmenter) {
    return Array.from(str).length; // Fallback
  }
  
  const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
  return Array.from(segmenter.segment(str)).length;
}

/**
 * Get Unicode general category for a code point
 */
function getUnicodeCategory(codePoint) {
  if (!Number.isInteger(codePoint) || codePoint < 0) {
    throw new RangeError('Invalid code point');
  }

  // Basic Latin
  if (codePoint >= 0x0041 && codePoint <= 0x005A) return 'Lu'; // A-Z
  if (codePoint >= 0x0061 && codePoint <= 0x007A) return 'Ll'; // a-z
  if (codePoint >= 0x0030 && codePoint <= 0x0039) return 'Nd'; // 0-9
  
  // Control characters
  if (codePoint < 0x0020 || (codePoint >= 0x007F && codePoint <= 0x009F)) return 'Cc';
  
  // Space characters
  if (codePoint === 0x0020) return 'Zs'; // Space
  if (codePoint === 0x00A0) return 'Zs'; // Non-breaking space
  if (codePoint >= 0x2000 && codePoint <= 0x200B) return 'Zs'; // Various spaces
  
  // Punctuation
  if ((codePoint >= 0x0021 && codePoint <= 0x002F) ||
      (codePoint >= 0x003A && codePoint <= 0x0040) ||
      (codePoint >= 0x005B && codePoint <= 0x0060) ||
      (codePoint >= 0x007B && codePoint <= 0x007E)) return 'Po';
  
  // Mathematical operators
  if (codePoint >= 0x2200 && codePoint <= 0x22FF) return 'Sm';
  
  // Currency symbols
  if (codePoint >= 0x20A0 && codePoint <= 0x20CF) return 'Sc';
  if (codePoint === 0x0024 || codePoint === 0x00A2 || codePoint === 0x00A3 || 
      codePoint === 0x00A4 || codePoint === 0x00A5) return 'Sc';
  
  // Arrows
  if (codePoint >= 0x2190 && codePoint <= 0x21FF) return 'Sm';
  
  // Emoji and symbols
  if (codePoint >= 0x1F600 && codePoint <= 0x1F64F) return 'So'; // Emoticons
  if (codePoint >= 0x1F300 && codePoint <= 0x1F5FF) return 'So'; // Misc symbols
  if (codePoint >= 0x1F680 && codePoint <= 0x1F6FF) return 'So'; // Transport
  if (codePoint >= 0x1F900 && codePoint <= 0x1F9FF) return 'So'; // Supplemental
  if (codePoint >= 0x2600 && codePoint <= 0x26FF) return 'So'; // Misc symbols
  
  // Combining marks
  if (codePoint >= 0x0300 && codePoint <= 0x036F) return 'Mn'; // Combining diacritical marks
  if (codePoint >= 0x1AB0 && codePoint <= 0x1AFF) return 'Mn'; // Combining diacritical marks extended
  
  // Private use
  if (codePoint >= 0xE000 && codePoint <= 0xF8FF) return 'Co';
  if (codePoint >= 0xF0000 && codePoint <= 0xFFFFF) return 'Co';
  if (codePoint >= 0x100000 && codePoint <= 0x10FFFF) return 'Co';
  
  // Surrogates
  if (codePoint >= 0xD800 && codePoint <= 0xDFFF) return 'Cs';
  
  // Default fallback for other letters
  return 'Lo';
}

/**
 * Get the Unicode block name for a code point
 */
function getUnicodeBlock(codePoint) {
  if (!Number.isInteger(codePoint) || codePoint < 0 || codePoint > 0x10FFFF) {
    throw new RangeError('Invalid code point');
  }
  
  for (const [blockName, [start, end]] of Object.entries(UNICODE_BLOCKS)) {
    if (codePoint >= start && codePoint <= end) {
      return blockName;
    }
  }
  
  return 'Unknown Block';
}

/**
 * Get script information for a code point
 */
function getScript(codePoint) {
  if (!Number.isInteger(codePoint) || codePoint < 0) {
    throw new RangeError('Invalid code point');
  }
  
  // Basic Latin
  if (codePoint <= 0x007F) return 'Latin';
  
  // Extended Latin
  if ((codePoint >= 0x0080 && codePoint <= 0x024F) ||
      (codePoint >= 0x1E00 && codePoint <= 0x1EFF)) return 'Latin';
  
  // Greek
  if (codePoint >= 0x0370 && codePoint <= 0x03FF) return 'Greek';
  if (codePoint >= 0x1F00 && codePoint <= 0x1FFF) return 'Greek';
  
  // Cyrillic
  if (codePoint >= 0x0400 && codePoint <= 0x052F) return 'Cyrillic';
  
  // Arabic
  if ((codePoint >= 0x0600 && codePoint <= 0x06FF) ||
      (codePoint >= 0x0750 && codePoint <= 0x077F) ||
      (codePoint >= 0xFB50 && codePoint <= 0xFDFF) ||
      (codePoint >= 0xFE70 && codePoint <= 0xFEFF)) return 'Arabic';
  
  // Hebrew
  if (codePoint >= 0x0590 && codePoint <= 0x05FF) return 'Hebrew';
  
  // Devanagari
  if (codePoint >= 0x0900 && codePoint <= 0x097F) return 'Devanagari';
  
  // Chinese/Japanese/Korean
  if ((codePoint >= 0x3400 && codePoint <= 0x4DBF) ||
      (codePoint >= 0x4E00 && codePoint <= 0x9FFF) ||
      (codePoint >= 0xF900 && codePoint <= 0xFAFF)) return 'Han';
  
  if (codePoint >= 0x3040 && codePoint <= 0x309F) return 'Hiragana';
  if (codePoint >= 0x30A0 && codePoint <= 0x30FF) return 'Katakana';
  if (codePoint >= 0xAC00 && codePoint <= 0xD7AF) return 'Hangul';
  
  // Thai
  if (codePoint >= 0x0E00 && codePoint <= 0x0E7F) return 'Thai';
  
  return 'Common';
}

/**
 * Check if a string contains mixed scripts
 */
function hasMixedScripts(str) {
  if (typeof str !== 'string' || str.length === 0) {
    return false;
  }
  
  const codePoints = toCodePoints(str);
  const scripts = new Set();
  
  for (const cp of codePoints) {
    const script = getScript(cp);
    if (script !== 'Common' && script !== 'Inherited') {
      scripts.add(script);
    }
  }
  
  return scripts.size > 1;
}

/**
 * Check if string contains right-to-left text
 */
function hasRtlText(str) {
  if (typeof str !== 'string') {
    return false;
  }
  
  const rtlRanges = [
    [0x0590, 0x05FF], // Hebrew
    [0x0600, 0x06FF], // Arabic
    [0x0700, 0x074F], // Syriac
    [0x0750, 0x077F], // Arabic Supplement
    [0x0780, 0x07BF], // Thaana
    [0xFB1D, 0xFB4F], // Hebrew Presentation Forms
    [0xFB50, 0xFDFF], // Arabic Presentation Forms-A
    [0xFE70, 0xFEFF]  // Arabic Presentation Forms-B
  ];
  
  for (const char of str) {
    const cp = char.codePointAt(0);
    for (const [start, end] of rtlRanges) {
      if (cp >= start && cp <= end) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Get text direction (LTR, RTL, or MIXED)
 */
function getTextDirection(str) {
  if (typeof str !== 'string' || str.length === 0) {
    return 'LTR';
  }
  
  let hasLtr = false;
  let hasRtl = false;
  
  for (const char of str) {
    const cp = char.codePointAt(0);
    const script = getScript(cp);
    
    if (script === 'Arabic' || script === 'Hebrew') {
      hasRtl = true;
    } else if (script === 'Latin' || script === 'Greek' || script === 'Cyrillic') {
      hasLtr = true;
    }
    
    if (hasLtr && hasRtl) {
      return 'MIXED';
    }
  }
  
  return hasRtl ? 'RTL' : 'LTR';
}

/**
 * Check if a code point is an emoji
 */
function isEmoji(codePoint) {
  if (!Number.isInteger(codePoint) || codePoint < 0) {
    return false;
  }
  
  const emojiRanges = [
    [0x1F600, 0x1F64F], // Emoticons
    [0x1F300, 0x1F5FF], // Miscellaneous Symbols and Pictographs
    [0x1F680, 0x1F6FF], // Transport and Map Symbols
    [0x1F700, 0x1F77F], // Alchemical Symbols
    [0x1F780, 0x1F7FF], // Geometric Shapes Extended
    [0x1F800, 0x1F8FF], // Supplemental Arrows-C
    [0x1F900, 0x1F9FF], // Supplemental Symbols and Pictographs
    [0x1FA00, 0x1FA6F], // Chess Symbols
    [0x1FA70, 0x1FAFF], // Symbols and Pictographs Extended-A
    [0x2600, 0x26FF],   // Miscellaneous Symbols
    [0x2700, 0x27BF],   // Dingbats
    [0xFE00, 0xFE0F],   // Variation Selectors
    [0x1F1E6, 0x1F1FF]  // Regional Indicator Symbols
  ];
  
  return emojiRanges.some(([start, end]) => codePoint >= start && codePoint <= end);
}

/**
 * Check if string contains emojis
 */
function hasEmojis(str) {
  if (typeof str !== 'string') {
    return false;
  }
  
  for (const char of str) {
    if (isEmoji(char.codePointAt(0))) {
      return true;
    }
  }
  
  return false;
}

/**
 * Count emojis in a string
 */
function countEmojis(str) {
  if (typeof str !== 'string') {
    return 0;
  }
  
  let count = 0;
  for (const char of str) {
    if (isEmoji(char.codePointAt(0))) {
      count++;
    }
  }
  
  return count;
}

/**
 * Get comprehensive Unicode information for a string
 */
function analyzeUnicode(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected string input');
  }
  
  const codePoints = toCodePoints(str);
  const scripts = new Set();
  const blocks = new Set();
  const categories = new Set();
  
  let hasEmoji = false;
  let hasRtl = false;
  let hasControl = false;
  let hasPrivateUse = false;
  
  for (const cp of codePoints) {
    const script = getScript(cp);
    const block = getUnicodeBlock(cp);
    const category = getUnicodeCategory(cp);
    
    if (script !== 'Common') scripts.add(script);
    blocks.add(block);
    categories.add(category);
    
    if (isEmoji(cp)) hasEmoji = true;
    if (script === 'Arabic' || script === 'Hebrew') hasRtl = true;
    if (category === 'Cc') hasControl = true;
    if (category === 'Co') hasPrivateUse = true;
  }
  
  return {
    length: str.length,
    codePointCount: codePoints.length,
    graphemeCount: getGraphemeCount(str),
    scripts: Array.from(scripts),
    blocks: Array.from(blocks),
    categories: Array.from(categories),
    direction: getTextDirection(str),
    hasMixedScripts: scripts.size > 1,
    hasEmoji,
    hasRtl,
    hasControl,
    hasPrivateUse,
    isNormalized: {
      NFC: str === str.normalize('NFC'),
      NFD: str === str.normalize('NFD'),
      NFKC: str === str.normalize('NFKC'),
      NFKD: str === str.normalize('NFKD')
    }
  };
}

/**
 * Convert string to various case formats while preserving Unicode
 */
function transformCase(str, type = 'lower') {
  if (typeof str !== 'string') {
    throw new TypeError('Expected string input');
  }
  
  const types = ['lower', 'upper', 'title', 'sentence'];
  if (!types.includes(type)) {
    throw new Error(`Invalid case type: ${type}. Must be one of: ${types.join(', ')}`);
  }
  
  switch (type) {
    case 'lower':
      return str.toLowerCase();
    case 'upper':
      return str.toUpperCase();
    case 'title':
      return str.replace(/\w\S*/g, txt => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      );
    case 'sentence':
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    default:
      return str;
  }
}

export {
  // Core functions
  toCodePoints,
  fromCodePoints,
  splitGraphemes,
  normalizeUnicode,
  getGraphemeCount,
  getUnicodeCategory,
  
  getUnicodeBlock,
  getScript,
  hasMixedScripts,
  hasRtlText,
  getTextDirection,
  isEmoji,
  hasEmojis,
  countEmojis,
  analyzeUnicode,
  transformCase,
  
};