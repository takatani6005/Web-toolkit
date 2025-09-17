import { normalizeUnicode, countCodePoints } from './unicode.js';
import { safeSubstring } from './core.js';

// Original functions with improvements
function stripNonPrintable(str) {
  // Expanded to include more control characters and format characters
  return str.replace(/[\x00-\x1F\x7F-\x9F\u00AD\u034F\u061C\u115F\u1160\u17B4\u17B5\u180B-\u180D\u200B-\u200F\u202A-\u202E\u2060-\u206F\u3164\uFEFF\uFFA0]/g, '');
}

function hasUnsafeChars(str) {
  // Enhanced to detect more potential security issues
  return /[\x00-\x1F\x7F-\x9F\u00AD\u034F\u061C\u115F\u1160\u17B4\u17B5\u180B-\u180D\u200B-\u200F\u202A-\u202E\u2060-\u206F\u3164\uFEFF\uFFA0\uE000-\uF8FF]/.test(str);
}

function isHtmlSafe(str) {
  // More comprehensive HTML safety check
  return !/[<>&"'\x00-\x1F\x7F-\x9F]|javascript:|data:|vbscript:|on\w+\s*=/i.test(str);
}

function containsDirectionOverride(str) {
  // Check for all bidirectional control characters
  return /[\u061C\u200E\u200F\u202A-\u202E\u2066-\u2069]/g.test(str);
}

function hasMixedScripts(str) {
  const scriptRanges = [
    { name: 'Latin', regex: /[\u0000-\u007F\u0080-\u00FF\u0100-\u017F\u0180-\u024F\u1E00-\u1EFF]/ },
    { name: 'Arabic', regex: /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/ },
    { name: 'Chinese', regex: /[\u4E00-\u9FFF\u3400-\u4DBF\u20000-\u2A6DF\u2A700-\u2B73F\u2B740-\u2B81F\u2B820-\u2CEAF]/ },
    { name: 'Cyrillic', regex: /[\u0400-\u04FF\u0500-\u052F\u2DE0-\u2DFF\uA640-\uA69F]/ },
    { name: 'Greek', regex: /[\u0370-\u03FF\u1F00-\u1FFF]/ },
    { name: 'Hebrew', regex: /[\u0590-\u05FF\uFB1D-\uFB4F]/ },
    { name: 'Hiragana', regex: /[\u3040-\u309F]/ },
    { name: 'Katakana', regex: /[\u30A0-\u30FF\u31F0-\u31FF]/ },
    { name: 'Devanagari', regex: /[\u0900-\u097F\uA8E0-\uA8FF]/ },
    { name: 'Thai', regex: /[\u0E00-\u0E7F]/ },
    { name: 'Korean', regex: /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uD7B0-\uD7FF]/ }
  ];

  const foundScripts = new Set();
  for (const char of str) {
    for (const script of scriptRanges) {
      if (script.regex.test(char)) {
        foundScripts.add(script.name);
        if (foundScripts.size > 1) return true;
      }
    }
  }
  return false;
}

function sanitizeString(str, options = {}) {
  const {
    stripNonPrintable: strip = true,
    normalizeUnicode: normalize = 'NFC',
    removeDirectionOverrides = true,
    maxLength = null,
    allowedChars = null,
    blockedChars = null,
    preserveWhitespace = true
  } = options;

  let result = str;

  if (strip) {
    result = stripNonPrintable(result);
  }

  if (normalize) {
    result = normalizeUnicode(result, normalize);
  }

  if (removeDirectionOverrides) {
    result = result.replace(/[\u061C\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, '');
  }

  if (blockedChars) {
    const blockedRegex = new RegExp(`[${blockedChars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`, 'g');
    result = result.replace(blockedRegex, '');
  }

  if (allowedChars) {
    const allowedRegex = new RegExp(`[^${allowedChars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`, 'g');
    result = result.replace(allowedRegex, '');
  }

  if (!preserveWhitespace) {
    result = result.replace(/\s+/g, ' ').trim();
  }

  if (maxLength && countCodePoints(result) > maxLength) {
    result = safeSubstring(result, 0, maxLength);
  }

  return result;
}

// New enhanced security functions
function detectHomoglyphs(str) {
  // Common homoglyph patterns that could be used for spoofing
  const homoglyphPatterns = [
    { char: 'a', lookalikes: ['а', 'ɑ', 'α', 'а'] }, // Cyrillic/Greek a
    { char: 'e', lookalikes: ['е', 'ε', 'е'] }, // Cyrillic/Greek e
    { char: 'o', lookalikes: ['о', 'ο', 'ο', '0', 'О'] }, // Cyrillic/Greek o, zero
    { char: 'p', lookalikes: ['р', 'ρ', 'р'] }, // Cyrillic/Greek p
    { char: 'c', lookalikes: ['с', 'ϲ', 'с'] }, // Cyrillic/Greek c
    { char: 'x', lookalikes: ['х', 'χ', 'х'] }, // Cyrillic/Greek x
    { char: 'y', lookalikes: ['у', 'γ', 'у'] }, // Cyrillic/Greek y
    { char: 'i', lookalikes: ['і', 'ι', 'і', '1', 'l', 'I'] }, // Cyrillic/Greek i, one, lowercase l
    { char: 'n', lookalikes: ['η', 'п'] }, // Greek eta, Cyrillic n
    { char: 'h', lookalikes: ['һ', 'η'] } // Cyrillic h, Greek eta
  ];

  const suspiciousChars = [];
  for (const char of str) {
    for (const pattern of homoglyphPatterns) {
      if (pattern.lookalikes.includes(char)) {
        suspiciousChars.push({ char, suspectedOf: pattern.char, position: str.indexOf(char) });
      }
    }
  }

  return suspiciousChars;
}

function hasInvisibleChars(str) {
  // Detect invisible Unicode characters that could be used for spoofing
  const invisibleChars = /[\u00AD\u034F\u061C\u115F\u1160\u17B4\u17B5\u180B-\u180D\u200B-\u200F\u202A-\u202E\u2060-\u206F\u3164\uFEFF\uFFA0]/;
  return invisibleChars.test(str);
}

function containsMaliciousPatterns(str) {
  // Common patterns found in malicious strings
  const maliciousPatterns = [
    /javascript:/gi,
    /data:.*script/gi,
    /vbscript:/gi,
    /on\w+\s*=/gi,
    /<script/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
    /<form/gi,
    /expression\s*\(/gi,
    /url\s*\(/gi,
    /@import/gi,
    /\\x[0-9a-f]{2}/gi,
    /\\u[0-9a-f]{4}/gi,
    /%[0-9a-f]{2}/gi
  ];

  return maliciousPatterns.some(pattern => pattern.test(str));
}

function validateEmail(email) {
  // Enhanced email validation with security considerations
  if (typeof email !== 'string' || email.length > 254) {
    return { valid: false, reason: 'Invalid format or too long' };
  }

  // Check for homoglyphs in domain
  const homoglyphs = detectHomoglyphs(email);
  if (homoglyphs.length > 0) {
    return { valid: false, reason: 'Contains suspicious characters', homoglyphs };
  }

  // Check for invisible characters
  if (hasInvisibleChars(email)) {
    return { valid: false, reason: 'Contains invisible characters' };
  }

  // Basic email format validation
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(email)) {
    return { valid: false, reason: 'Invalid email format' };
  }

  return { valid: true };
}

function validateUrl(url, options = {}) {
  const {
    allowedProtocols = ['http:', 'https:'],
    allowedDomains = null,
    blockedDomains = null,
    maxLength = 2048
  } = options;

  if (typeof url !== 'string' || url.length > maxLength) {
    return { valid: false, reason: 'Invalid format or too long' };
  }

  // Check for malicious patterns
  if (containsMaliciousPatterns(url)) {
    return { valid: false, reason: 'Contains malicious patterns' };
  }

  // Check for homoglyphs
  const homoglyphs = detectHomoglyphs(url);
  if (homoglyphs.length > 0) {
    return { valid: false, reason: 'Contains suspicious characters', homoglyphs };
  }

  try {
    const urlObj = new URL(url);
    
    // Protocol validation
    if (!allowedProtocols.includes(urlObj.protocol)) {
      return { valid: false, reason: 'Protocol not allowed' };
    }

    // Domain validation
    if (allowedDomains && !allowedDomains.includes(urlObj.hostname)) {
      return { valid: false, reason: 'Domain not allowed' };
    }

    if (blockedDomains && blockedDomains.includes(urlObj.hostname)) {
      return { valid: false, reason: 'Domain is blocked' };
    }

    return { valid: true, parsed: urlObj };
  } catch {
    return { valid: false, reason: 'Invalid URL format' };
  }
}

function detectPhishingIndicators(str) {
  const indicators = [];
  
  // Homoglyphs
  const homoglyphs = detectHomoglyphs(str);
  if (homoglyphs.length > 0) {
    indicators.push({ type: 'homoglyphs', details: homoglyphs });
  }

  // Invisible characters
  if (hasInvisibleChars(str)) {
    indicators.push({ type: 'invisible_chars' });
  }

  // Direction overrides
  if (containsDirectionOverride(str)) {
    indicators.push({ type: 'direction_override' });
  }

  // Mixed scripts
  if (hasMixedScripts(str)) {
    indicators.push({ type: 'mixed_scripts' });
  }

  // Suspicious patterns
  if (containsMaliciousPatterns(str)) {
    indicators.push({ type: 'malicious_patterns' });
  }

  return indicators;
}

function securityScore(str) {
  let score = 100; // Start with perfect score
  const issues = detectPhishingIndicators(str);
  
  for (const issue of issues) {
    switch (issue.type) {
      case 'homoglyphs':
        score -= issue.details.length * 15;
        break;
      case 'invisible_chars':
        score -= 20;
        break;
      case 'direction_override':
        score -= 25;
        break;
      case 'mixed_scripts':
        score -= 10;
        break;
      case 'malicious_patterns':
        score -= 30;
        break;
    }
  }

  return Math.max(0, score);
}

function normalizeSecure(str, options = {}) {
  const {
    removeHomoglyphs = true,
    normalizationForm = 'NFC'
  } = options;

  let result = str;

  // Unicode normalization
  if (normalizationForm) {
    result = normalizeUnicode(result, normalizationForm);
  }

  // Remove or replace homoglyphs
  if (removeHomoglyphs) {
    const homoglyphMap = {
      'а': 'a', 'е': 'e', 'о': 'o', 'р': 'p', 'с': 'c', 'х': 'x', 'у': 'y', 'і': 'i',
      'А': 'A', 'Е': 'E', 'О': 'O', 'Р': 'P', 'С': 'C', 'Х': 'X', 'У': 'Y', 'І': 'I',
      'α': 'a', 'ε': 'e', 'ο': 'o', 'ρ': 'p', 'ϲ': 'c', 'χ': 'x', 'γ': 'y', 'ι': 'i',
      'Α': 'A', 'Ε': 'E', 'Ο': 'O', 'Ρ': 'P', 'Χ': 'X', 'Γ': 'Y', 'Ι': 'I'
    };

    for (const [homoglyph, replacement] of Object.entries(homoglyphMap)) {
      result = result.replace(new RegExp(homoglyph, 'g'), replacement);
    }
  }

  return result;
}

// Export all functions
export {
  stripNonPrintable,
  hasUnsafeChars,
  isHtmlSafe,
  containsDirectionOverride,
  hasMixedScripts,
  sanitizeString,
  detectHomoglyphs,
  hasInvisibleChars,
  containsMaliciousPatterns,
  validateEmail,
  validateUrl,
  detectPhishingIndicators,
  securityScore,
  normalizeSecure
};