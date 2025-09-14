// ranges.js
export const UNICODE_RANGES = {
  // Extended Latin ranges to match test expectations
  latin: [
    [0x0041, 0x005A], // A-Z
    [0x0061, 0x007A], // a-z
    [0x00C0, 0x00FF], // Latin-1 Supplement
    [0x0100, 0x017F], // Latin Extended-A
    [0x0180, 0x024F]  // Latin Extended-B
  ],
  greek: [[0x0370, 0x03FF]],
  cyrillic: [[0x0400, 0x04FF]],
  // More comprehensive emoji ranges
  emoji: [
    [0x1F600, 0x1F64F], // Emoticons
    [0x1F300, 0x1F5FF], // Miscellaneous Symbols and Pictographs
    [0x1F680, 0x1F6FF], // Transport and Map Symbols
    [0x1F1E0, 0x1F1FF]  // Regional Indicator Symbols
  ],
  // More comprehensive symbol ranges
  symbols: [
    [0x0021, 0x002F], // Basic punctuation
    [0x003A, 0x0040], // More punctuation
    [0x005B, 0x0060], // Brackets and punctuation
    [0x007B, 0x007E], // Braces and tilde
    [0x2600, 0x26FF], // Miscellaneous Symbols
    [0x2200, 0x22FF]  // Mathematical Operators
  ],
  numbers: [[0x0030, 0x0039]] // 0-9
};

export function buildAvailableRanges(options) {
  const {
    includeLetters,
    includeEmoji,
    includeSymbols,
    includeNumbers,
    scripts
  } = options;

  const availableRanges = [];

  // Add letter ranges based on scripts
  if (includeLetters) {
    scripts.forEach(script => {
      if (UNICODE_RANGES[script]) {
        availableRanges.push(...UNICODE_RANGES[script]);
      }
    });
  }

  // Add emoji ranges
  if (includeEmoji) {
    availableRanges.push(...UNICODE_RANGES.emoji);
  }

  // Add symbol ranges
  if (includeSymbols) {
    availableRanges.push(...UNICODE_RANGES.symbols);
  }

  // Add number ranges
  if (includeNumbers) {
    availableRanges.push(...UNICODE_RANGES.numbers);
  }

  // Fallback to basic Latin if no ranges are available
  if (availableRanges.length === 0) {
    availableRanges.push([0x0041, 0x005A], [0x0061, 0x007A]); // A-Z, a-z
  }

  return availableRanges;
}
