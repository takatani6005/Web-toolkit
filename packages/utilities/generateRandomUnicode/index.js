
// index.js
import { normalizeOptions } from './options.js';
import { validateLength, ensureExactLength } from './lengthHandler.js';
import { buildAvailableRanges } from './ranges.js';
import { generateRandomChar, generateBasicLatinChar, canFitChar } from './randomChar.js';

export function generateRandomUnicode(options = {}) {
  const normalizedOptions = normalizeOptions(options);
  const validLength = validateLength(normalizedOptions.length);
  
  // Handle zero length case
  if (validLength === 0) {
    return '';
  }

  const availableRanges = buildAvailableRanges(normalizedOptions);

  // Generate characters by counting actual string length, not code point count
  let result = '';
  let attempts = 0;
  const maxAttempts = validLength * 20; // Prevent infinite loops

  while (result.length < validLength && attempts < maxAttempts) {
    attempts++;
    
    const char = generateRandomChar(availableRanges);
    
    if (char && canFitChar(result, char, validLength)) {
      result += char;
    } else if (char === null || !canFitChar(result, char, validLength)) {
      // If we're close to the target length, try to fill with single-unit characters
      if (result.length < validLength) {
        const basicChar = generateBasicLatinChar();
        
        if (canFitChar(result, basicChar, validLength)) {
          result += basicChar;
        } else {
          break; // Can't fit any more characters
        }
      }
    }
  }

  return ensureExactLength(result, validLength);
}