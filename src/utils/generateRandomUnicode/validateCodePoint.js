
// validateCodePoint.js
export function isValidCodePoint(codePoint) {
  // Check if it's a valid Unicode code point
  if (codePoint < 0 || codePoint > 0x10FFFF) {
    return false;
  }
  
  // Exclude surrogate pairs range (they're handled by String.fromCodePoint)
  if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
    return false;
  }
  
  // Exclude non-characters
  if ((codePoint >= 0xFDD0 && codePoint <= 0xFDEF) ||
      (codePoint & 0xFFFF) === 0xFFFE ||
      (codePoint & 0xFFFF) === 0xFFFF) {
    return false;
  }
  
  return true;
}