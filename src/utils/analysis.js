import { 
  getUtf8ByteLength, 
  isHtmlSafe, 
  hasUnsafeChars, 
  containsDirectionOverride, 
  hasMixedScripts 
} from './security.js';
import { getGraphemeCount } from './unicode.js';

function countCodePoints(str) {
  return Array.from(str).length;
}

function getCharFrequencies(str) {
  const frequencies = new Map();
  for (const char of str) {
    frequencies.set(char, (frequencies.get(char) || 0) + 1);
  }
  return Object.fromEntries(
    Array.from(frequencies.entries()).sort((a, b) => b[1] - a[1])
  );
}

function isAscii(str) {
  return /^[\x00-\x7F]*$/.test(str);
}

function getStringMetrics(str) {
  const metrics = {
    length: str.length,
    codePoints: countCodePoints(str),
    graphemes: getGraphemeCount(str),
    utf8Bytes: getUtf8ByteLength(str),
    isAscii: isAscii(str),
    isHtmlSafe: isHtmlSafe(str),
    hasUnsafeChars: hasUnsafeChars(str),
    containsDirectionOverride: containsDirectionOverride(str),
    hasMixedScripts: hasMixedScripts(str)
  };
  return metrics;
}

// Additional analysis functions

function getWordCount(str) {
  if (!str || typeof str !== 'string') return 0;
  return str.trim().split(/\s+/).filter(word => word.length > 0).length;
}

function getSentenceCount(str) {
  if (!str || typeof str !== 'string') return 0;
  // Match sentence endings: . ! ? followed by whitespace or end of string
  const sentences = str.match(/[.!?]+(?:\s|$)/g);
  return sentences ? sentences.length : 0;
}

function getParagraphCount(str) {
  if (!str || typeof str !== 'string') return 0;
  // Split by double newlines and filter out empty paragraphs
  return str.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
}

function getLineCount(str) {
  if (!str || typeof str !== 'string') return 0;
  return str.split('\n').length;
}

function getReadabilityMetrics(str) {
  const words = getWordCount(str);
  const sentences = getSentenceCount(str);
  const syllables = estimateSyllableCount(str);
  
  // Flesch Reading Ease Score
  let fleschScore = 0;
  if (sentences > 0 && words > 0) {
    fleschScore = 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words));
  }
  
  // Flesch-Kincaid Grade Level
  let gradeLevel = 0;
  if (sentences > 0 && words > 0) {
    gradeLevel = (0.39 * (words / sentences)) + (11.8 * (syllables / words)) - 15.59;
  }
  
  return {
    fleschReadingEase: Math.max(0, Math.min(100, fleschScore)),
    fleschKincaidGrade: Math.max(0, gradeLevel),
    averageWordsPerSentence: sentences > 0 ? words / sentences : 0,
    averageSyllablesPerWord: words > 0 ? syllables / words : 0
  };
}

function estimateSyllableCount(str) {
  if (!str || typeof str !== 'string') return 0;
  
  let syllables = 0;
  const words = str.toLowerCase().match(/[a-z]+/g) || [];
  
  for (const word of words) {
    let wordSyllables = word.match(/[aeiouy]+/g) || [];
    syllables += Math.max(1, wordSyllables.length);
    
    // Adjust for silent 'e'
    if (word.endsWith('e') && wordSyllables.length > 1) {
      syllables--;
    }
  }
  
  return syllables;
}

function getComplexityScore(str) {
  if (!str || typeof str !== 'string') return 0;
  
  const metrics = getStringMetrics(str);
  const readability = getReadabilityMetrics(str);
  
  let complexity = 0;
  
  // Unicode complexity
  if (!metrics.isAscii) complexity += 0.2;
  if (metrics.hasMixedScripts) complexity += 0.3;
  if (metrics.containsDirectionOverride) complexity += 0.4;
  
  // Length complexity
  const lengthRatio = metrics.codePoints / Math.max(1, metrics.length);
  if (lengthRatio > 1.5) complexity += 0.2;
  
  // Readability complexity (inverse relationship)
  if (readability.fleschKincaidGrade > 12) complexity += 0.3;
  if (readability.averageWordsPerSentence > 20) complexity += 0.2;
  
  return Math.min(1.0, complexity);
}

function analyzeCharacterDistribution(str) {
  if (!str || typeof str !== 'string') return {};
  
  const distribution = {
    letters: 0,
    digits: 0,
    spaces: 0,
    punctuation: 0,
    symbols: 0,
    control: 0,
    other: 0
  };
  
  for (const char of str) {
    const code = char.codePointAt(0);
    
    if (/[a-zA-Z]/.test(char)) {
      distribution.letters++;
    } else if (/\d/.test(char)) {
      distribution.digits++;
    } else if (/\s/.test(char)) {
      distribution.spaces++;
    } else if (/[.!?,:;'"()-]/.test(char)) {
      distribution.punctuation++;
    } else if (code < 32 || (code >= 127 && code < 160)) {
      distribution.control++;
    } else if (/[^\w\s]/.test(char)) {
      distribution.symbols++;
    } else {
      distribution.other++;
    }
  }
  
  return distribution;
}

function getEncodingComplexity(str) {
  if (!str || typeof str !== 'string') return { complexity: 0, reason: 'empty' };
  
  const metrics = getStringMetrics(str);
  let complexity = 0;
  const reasons = [];
  
  // Check for high UTF-8 overhead
  const utf8Overhead = metrics.utf8Bytes / Math.max(1, metrics.length);
  if (utf8Overhead > 2) {
    complexity += 0.3;
    reasons.push('high-utf8-overhead');
  }
  
  // Check for HTML entities potential
  if (str.includes('&') || str.includes('<') || str.includes('>')) {
    complexity += 0.2;
    reasons.push('html-chars');
  }
  
  // Check for URL encoding needs
  if (/[^A-Za-z0-9\-_.~]/.test(str)) {
    complexity += 0.1;
    reasons.push('url-unsafe-chars');
  }
  
  // Check for Base64 encoding efficiency
  const base64Overhead = Math.ceil(metrics.utf8Bytes / 3) * 4 / metrics.utf8Bytes;
  if (base64Overhead > 1.5) {
    complexity += 0.2;
    reasons.push('base64-overhead');
  }
  
  return {
    complexity: Math.min(1.0, complexity),
    reasons,
    utf8Overhead,
    base64Overhead
  };
}

function detectStringType(str) {
  if (!str || typeof str !== 'string') return 'empty';
  
  // Base64
  if (/^[A-Za-z0-9+/]*={0,2}$/.test(str) && str.length % 4 === 0) {
    return 'base64';
  }
  
  // Hex
  if (/^[0-9a-fA-F]+$/.test(str)) {
    return 'hex';
  }
  
  // URL
  if (/^https?:\/\//.test(str)) {
    return 'url';
  }
  
  // Email
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)) {
    return 'email';
  }
  
  // JSON
  if ((str.startsWith('{') && str.endsWith('}')) || 
      (str.startsWith('[') && str.endsWith(']'))) {
    try {
      JSON.parse(str);
      return 'json';
    } catch {
      // Not valid JSON
    }
  }
  
  // HTML/XML
  if (/<[^>]+>/.test(str)) {
    return 'html';
  }
  
  // UUID
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str)) {
    return 'uuid';
  }
  
  // Numeric
  if (/^-?\d+\.?\d*$/.test(str)) {
    return 'numeric';
  }
  
  // Check if it's mostly natural language
  const wordCount = getWordCount(str);
  const totalLength = str.length;
  if (wordCount > 5 && /[.!?]/.test(str)) {
    return 'natural-language';
  }
  
  return 'text';
}

function getAdvancedMetrics(str) {
  const basic = getStringMetrics(str);
  const readability = getReadabilityMetrics(str);
  const distribution = analyzeCharacterDistribution(str);
  const encoding = getEncodingComplexity(str);
  
  return {
    ...basic,
    words: getWordCount(str),
    sentences: getSentenceCount(str),
    paragraphs: getParagraphCount(str),
    lines: getLineCount(str),
    readability,
    distribution,
    encoding,
    complexity: getComplexityScore(str),
    type: detectStringType(str)
  };
}

export {
  countCodePoints,
  getCharFrequencies,
  isAscii,
  getStringMetrics,
  getWordCount,
  getSentenceCount,
  getParagraphCount,
  getLineCount,
  getReadabilityMetrics,
  estimateSyllableCount,
  getComplexityScore,
  analyzeCharacterDistribution,
  getEncodingComplexity,
  detectStringType,
  getAdvancedMetrics
};