// randomChar.js
import { isValidCodePoint } from './validateCodePoint.js';

export function generateRandomChar(availableRanges) {
  const range = availableRanges[Math.floor(Math.random() * availableRanges.length)];
  const codePoint = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
  
  if (isValidCodePoint(codePoint)) {
    return String.fromCodePoint(codePoint);
  }
  
  return null;
}

export function generateBasicLatinChar() {
  const basicCodePoint = Math.floor(Math.random() * 26) + 0x0061; // a-z
  return String.fromCodePoint(basicCodePoint);
}

export function canFitChar(currentResult, newChar, targetLength) {
  return currentResult.length + newChar.length <= targetLength;
}