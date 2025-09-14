import { getUnicodeCategory, toCodePoints } from './unicode.js';
import { hasUnsafeChars, containsDirectionOverride } from './security.js';

function detectEncoding(buffer) {
  const bytes = new Uint8Array(buffer);
  
  // BOM detection
  if (bytes.length >= 3 && bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF) {
    return { encoding: 'utf-8', confidence: 1.0, bom: true };
  }
  if (bytes.length >= 2 && bytes[0] === 0xFF && bytes[1] === 0xFE) {
    return { encoding: 'utf-16le', confidence: 1.0, bom: true };
  }
  if (bytes.length >= 2 && bytes[0] === 0xFE && bytes[1] === 0xFF) {
    return { encoding: 'utf-16be', confidence: 1.0, bom: true };
  }
  
  // UTF-8 validation
  try {
    new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    return { encoding: 'utf-8', confidence: 0.9, bom: false };
  } catch {}
  
  // ASCII check
  let asciiCount = 0;
  for (let i = 0; i < Math.min(bytes.length, 1000); i++) {
    if (bytes[i] < 128) asciiCount++;
  }
  if (asciiCount === Math.min(bytes.length, 1000)) {
    return { encoding: 'ascii', confidence: 1.0, bom: false };
  }
  
  return { encoding: 'unknown', confidence: 0.1, bom: false };
}

function visualizeCodePoints(str, options = {}) {
  const {
    format = 'detailed',
    maxLength = 50,
    showNames = true,
    showHex = true,
    showBinary = false,
    showSurrogates = true
  } = options;
  
  const chars = Array.from(str);
  if (chars.length > maxLength) {
    return `String too long (${chars.length} characters). Use maxLength option to increase limit.`;
  }
  
  const result = chars.map((char, index) => {
    const codePoint = char.codePointAt(0);
    const hex = codePoint.toString(16).toUpperCase().padStart(4, '0');
    const category = getUnicodeCategory(codePoint);
    
    if (format === 'simple') {
      return `${char} (U+${hex})`;
    }
    
    let visualization = `${index}: "${char}" `;
    
    if (showHex) {
      visualization += `U+${hex} (${codePoint}) `;
    }
    
    if (showBinary) {
      visualization += `[${codePoint.toString(2).padStart(16, '0')}] `;
    }
    
    visualization += `[${category}]`;
    
    // Show surrogate pair info for characters outside BMP
    if (showSurrogates && codePoint > 0xFFFF) {
      const high = Math.floor((codePoint - 0x10000) / 0x400) + 0xD800;
      const low = ((codePoint - 0x10000) % 0x400) + 0xDC00;
      visualization += ` (surrogates: ${high.toString(16).toUpperCase()}, ${low.toString(16).toUpperCase()})`;
    }
    
    if (showNames && typeof Intl !== 'undefined') {
      try {
        visualization += ` "${char.normalize('NFD')}"`;
      } catch (e) {
        // Ignore if normalization fails
      }
    }
    
    return visualization;
  });
  
  return result.join('\n');
}

function analyzeString(str, options = {}) {
  const {
    includeBytes = true,
    includeEncoding = true,
    includeSecurity = true,
    includeComposition = true
  } = options;
  
  const chars = Array.from(str);
  const codePoints = toCodePoints(str);
  const analysis = {
    length: {
      characters: chars.length,
      codePoints: codePoints.length,
      bytes: new TextEncoder().encode(str).length
    }
  };
  
  if (includeEncoding) {
    analysis.encoding = {
      isAscii: codePoints.every(cp => cp < 128),
      isLatin1: codePoints.every(cp => cp < 256),
      isBmp: codePoints.every(cp => cp < 0x10000),
      hasEmoji: /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/u.test(str),
      hasControlChars: codePoints.some(cp => cp < 32 && cp !== 9 && cp !== 10 && cp !== 13)
    };
  }
  
  if (includeSecurity) {
    analysis.security = {
      hasUnsafeChars: hasUnsafeChars(str),
      hasDirectionOverride: containsDirectionOverride(str),
      hasZeroWidthChars: /[\u200B\u200C\u200D\u2060\uFEFF]/u.test(str),
      hasHomoglyphs: detectHomoglyphs(str)
    };
  }
  
  if (includeComposition) {
    analysis.composition = {
      scripts: detectScripts(str),
      categories: getCategoryBreakdown(codePoints),
      normalizationForms: {
        nfc: str.normalize('NFC') === str,
        nfd: str.normalize('NFD') === str,
        nfkc: str.normalize('NFKC') === str,
        nfkd: str.normalize('NFKD') === str
      }
    };
  }
  
  return analysis;
}

function detectScripts(str) {
  const scripts = new Set();
  for (const char of str) {
    const codePoint = char.codePointAt(0);
    const script = getScriptFromCodePoint(codePoint);
    if (script !== 'Common' && script !== 'Inherited') {
      scripts.add(script);
    }
  }
  return Array.from(scripts);
}

function getScriptFromCodePoint(codePoint) {
  // Simplified script detection - in practice you'd use a full Unicode script database
  if (codePoint >= 0x0000 && codePoint <= 0x007F) return 'Latin';
  if (codePoint >= 0x0080 && codePoint <= 0x00FF) return 'Latin';
  if (codePoint >= 0x0100 && codePoint <= 0x017F) return 'Latin';
  if (codePoint >= 0x0370 && codePoint <= 0x03FF) return 'Greek';
  if (codePoint >= 0x0400 && codePoint <= 0x04FF) return 'Cyrillic';
  if (codePoint >= 0x0590 && codePoint <= 0x05FF) return 'Hebrew';
  if (codePoint >= 0x0600 && codePoint <= 0x06FF) return 'Arabic';
  if (codePoint >= 0x4E00 && codePoint <= 0x9FFF) return 'Han';
  if (codePoint >= 0x3040 && codePoint <= 0x309F) return 'Hiragana';
  if (codePoint >= 0x30A0 && codePoint <= 0x30FF) return 'Katakana';
  return 'Common';
}

function getCategoryBreakdown(codePoints) {
  const categories = {};
  for (const codePoint of codePoints) {
    const category = getUnicodeCategory(codePoint);
    categories[category] = (categories[category] || 0) + 1;
  }
  return categories;
}

function detectHomoglyphs(str) {
  // Common homoglyph patterns
  const homoglyphPatterns = [
    /[а-я]/u, // Cyrillic that looks like Latin
    /[αβγδεζηθικλμνξοπρστυφχψω]/u, // Greek that might be confused
    /[０-９Ａ-Ｚａ-ｚ]/u, // Fullwidth variants
  ];
  
  return homoglyphPatterns.some(pattern => pattern.test(str));
}

function compareStrings(str1, str2, options = {}) {
  const {
    showDifferences = true,
    normalizeFirst = false,
    caseSensitive = true
  } = options;
  
  let s1 = normalizeFirst ? str1.normalize('NFC') : str1;
  let s2 = normalizeFirst ? str2.normalize('NFC') : str2;
  
  if (!caseSensitive) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
  }
  
  const chars1 = Array.from(s1);
  const chars2 = Array.from(s2);
  const maxLen = Math.max(chars1.length, chars2.length);
  
  const comparison = {
    identical: s1 === s2,
    lengthDiff: chars1.length - chars2.length,
    differences: []
  };
  
  if (showDifferences && !comparison.identical) {
    for (let i = 0; i < maxLen; i++) {
      const c1 = chars1[i] || '';
      const c2 = chars2[i] || '';
      
      if (c1 !== c2) {
        comparison.differences.push({
          position: i,
          char1: c1,
          char2: c2,
          codePoint1: c1 ? c1.codePointAt(0) : null,
          codePoint2: c2 ? c2.codePointAt(0) : null
        });
      }
    }
  }
  
  return comparison;
}

function debugEntityDecode(str, entityMap) {
  const results = [];
  let i = 0;
  
  while (i < str.length) {
    if (str[i] === '&') {
      const endPos = str.indexOf(';', i);
      if (endPos !== -1) {
        const entity = str.slice(i, endPos + 1);
        const decoded = entityMap[entity];
        
        results.push({
          position: i,
          type: 'entity',
          original: entity,
          decoded: decoded || '[UNKNOWN]',
          valid: !!decoded,
          length: entity.length
        });
        
        i = endPos + 1;
      } else {
        results.push({
          position: i,
          type: 'text',
          original: str[i],
          decoded: str[i],
          valid: true,
          length: 1
        });
        i++;
      }
    } else {
      // Find next entity or end of string
      const nextEntity = str.indexOf('&', i);
      const text = nextEntity === -1 ? str.slice(i) : str.slice(i, nextEntity);
      
      if (text.length > 0) {
        results.push({
          position: i,
          type: 'text',
          original: text,
          decoded: text,
          valid: true,
          length: text.length
        });
      }
      
      i += text.length;
    }
  }
  
  return results;
}

function formatDebugOutput(data, format = 'table') {
  if (format === 'json') {
    return JSON.stringify(data, null, 2);
  }
  
  if (format === 'compact') {
    if (Array.isArray(data)) {
      return data.map(item => 
        typeof item === 'object' ? Object.values(item).join(' | ') : item
      ).join('\n');
    }
    return String(data);
  }
  
  // Default table format
  if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
    const headers = Object.keys(data[0]);
    const headerRow = headers.join(' | ');
    const separator = headers.map(h => '-'.repeat(h.length)).join(' | ');
    const rows = data.map(item => 
      headers.map(h => String(item[h] || '')).join(' | ')
    );
    
    return [headerRow, separator, ...rows].join('\n');
  }
  
  return String(data);
}

function createDebugger(options = {}) {
  const {
    verbose = false,
    logFunction = console.log,
    enableProfiling = false
  } = options;
  
  const profiler = enableProfiling ? {
    timers: new Map(),
    start: (label) => profiler.timers.set(label, performance.now()),
    end: (label) => {
      const start = profiler.timers.get(label);
      if (start) {
        const duration = performance.now() - start;
        logFunction(`[PROFILE] ${label}: ${duration.toFixed(2)}ms`);
        profiler.timers.delete(label);
        return duration;
      }
      return 0;
    }
  } : { start: () => {}, end: () => 0 };
  
  return {
    log: (...args) => verbose && logFunction(...args),
    profile: profiler,
    analyzeString: (str) => analyzeString(str, options),
    visualize: (str) => visualizeCodePoints(str, options),
    compare: (s1, s2) => compareStrings(s1, s2, options),
    format: (data, format) => formatDebugOutput(data, format)
  };
}

export {
  detectEncoding,
  visualizeCodePoints,
  analyzeString,
  compareStrings,
  debugEntityDecode,
  formatDebugOutput,
  createDebugger,
  detectScripts,
  getCategoryBreakdown
};