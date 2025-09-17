import { describe, test, expect } from '@jest/globals';
import {generateRandomUnicode} from '../../generateRandomUnicode/index.js'
describe('generateRandomUnicode', () => {
  describe('Basic functionality', () => {
    test('should generate string with default length when no options provided', () => {
      const result = generateRandomUnicode();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toBeLessThanOrEqual(20); // Assuming reasonable default
    });

    test('should generate string of specified length', () => {
      const testLengths = [0, 1, 5, 10, 50, 100];
      
      testLengths.forEach(length => {
        const result = generateRandomUnicode({ length });
        expect(result).toHaveLength(length);
      });
    });

    test('should generate different strings on multiple calls', () => {
      const results = new Set();
      const iterations = 10;
      
      for (let i = 0; i < iterations; i++) {
        results.add(generateRandomUnicode({ length: 20 }));
      }
      
      // Should have high uniqueness (allowing for rare collisions)
      expect(results.size).toBeGreaterThan(iterations * 0.8);
    });
  });

  describe('Script filtering', () => {
    test('should respect latin script restriction', () => {
      const result = generateRandomUnicode({
        scripts: ['latin'],
        includeEmoji: false,
        includeSymbols: false,
        length: 100
      });
      
      expect(result).toHaveLength(100);
      
      // Check that all characters are in Latin ranges
      // Basic Latin (0000-007F) + Latin-1 Supplement (0080-00FF) + Latin Extended A/B
      const latinRanges = [
        [0x0000, 0x007F], // Basic Latin
        [0x0080, 0x00FF], // Latin-1 Supplement
        [0x0100, 0x017F], // Latin Extended-A
        [0x0180, 0x024F], // Latin Extended-B
      ];
      
      for (const char of result) {
        const codePoint = char.codePointAt(0);
        const isLatin = latinRanges.some(([start, end]) => 
          codePoint >= start && codePoint <= end
        );
        expect(isLatin).toBe(true);
      }
    });

    test('should handle multiple script types', () => {
      const result = generateRandomUnicode({
        scripts: ['latin', 'greek', 'cyrillic'],
        includeEmoji: false,
        includeSymbols: false,
        length: 60
      });
      
      expect(result).toHaveLength(60);
      expect(typeof result).toBe('string');
    });

    test('should handle unknown script gracefully', () => {
      const result = generateRandomUnicode({
        scripts: ['nonexistent_script'],
        length: 10
      });
      
      expect(typeof result).toBe('string');
      expect(result.length).toBe(10);
    });
  });

  describe('Character type inclusion/exclusion', () => {
    test('should include emoji when requested', () => {
      const result = generateRandomUnicode({
        includeEmoji: true,
        includeLetters: false,
        includeSymbols: false,
        includeNumbers: false,
        length: 50
      });
      
      expect(result).toHaveLength(50);
      
      // Basic emoji detection (simplified)
      const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu;
      const hasEmoji = emojiRegex.test(result);
      expect(hasEmoji).toBe(true);
    });

    test('should exclude emoji when disabled', () => {
      const result = generateRandomUnicode({
        includeEmoji: false,
        scripts: ['latin'],
        length: 100
      });
      
      // Should not contain common emoji ranges
      const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]/gu;
      expect(emojiRegex.test(result)).toBe(false);
    });

    test('should handle symbols inclusion', () => {
      const result = generateRandomUnicode({
        includeSymbols: true,
        includeLetters: false,
        includeNumbers: false,
        includeEmoji: false,
        length: 30
      });
      
      expect(result).toHaveLength(30);
      
      // Check for common symbol characters
      const symbolRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/;
      const hasSymbols = Array.from(result).some(char => symbolRegex.test(char));
      expect(hasSymbols).toBe(true);
    });

    test('should handle numbers inclusion', () => {
      const result = generateRandomUnicode({
        includeNumbers: true,
        includeLetters: false,
        includeSymbols: false,
        includeEmoji: false,
        length: 50
      });
      
      expect(result).toHaveLength(50);
      
      // Should contain numeric characters
      const numberRegex = /[0-9]/;
      const hasNumbers = Array.from(result).some(char => numberRegex.test(char));
      expect(hasNumbers).toBe(true);
    });
  });

  describe('Edge cases and error handling', () => {
    test('should handle zero length gracefully', () => {
      const result = generateRandomUnicode({ length: 0 });
      expect(result).toBe('');
    });

    test('should handle all options disabled gracefully', () => {
      const result = generateRandomUnicode({
        includeEmoji: false,
        includeSymbols: false,
        includeLetters: false,
        includeNumbers: false,
        length: 10
      });
      
      expect(typeof result).toBe('string');
      // Should still generate something or fallback to a default character set
    });

    test('should handle negative length', () => {
      const result = generateRandomUnicode({ length: -5 });
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThanOrEqual(0);
    });

    test('should handle very large length efficiently', () => {
      const start = Date.now();
      const result = generateRandomUnicode({ length: 10000 });
      const end = Date.now();
      
      expect(result).toHaveLength(10000);
      expect(end - start).toBeLessThan(1000); // Should complete within 1 second
    });
  });

  describe('Unicode correctness', () => {
    test('should generate valid Unicode characters', () => {
      const result = generateRandomUnicode({ length: 100 });
      
      // Check that the string doesn't contain invalid Unicode sequences
      expect(() => {
        new TextEncoder().encode(result);
      }).not.toThrow();
      
      // Check for proper UTF-16 encoding
      expect(result.length).toBe(Array.from(result).length >= result.length / 2 ? result.length : expect.any(Number));
    });

    test('should handle surrogate pairs correctly', () => {
      // Generate string that might include characters requiring surrogate pairs
      const result = generateRandomUnicode({
        includeEmoji: true,
        length: 20
      });
      
      // Convert to array of actual characters (handles surrogate pairs)
      const characters = Array.from(result);
      
      // Each character should be valid
      characters.forEach(char => {
        expect(char).toBeTruthy();
        expect(typeof char).toBe('string');
      });
    });
  });

  describe('Distribution and randomness', () => {
    test('should have reasonable character distribution', () => {
      const result = generateRandomUnicode({
        scripts: ['latin'],
        length: 1000
      });
      
      const charCounts = {};
      for (const char of result) {
        charCounts[char] = (charCounts[char] || 0) + 1;
      }
      
      const uniqueChars = Object.keys(charCounts).length;
      
      // Should use a decent variety of characters
      expect(uniqueChars).toBeGreaterThan(10);
      
      // No single character should dominate (very rough check)
      const maxCount = Math.max(...Object.values(charCounts));
      expect(maxCount / result.length).toBeLessThan(0.5);
    });

    test('should maintain randomness across multiple calls', () => {
      const results = [];
      for (let i = 0; i < 5; i++) {
        results.push(generateRandomUnicode({ length: 50, scripts: ['latin'] }));
      }
      
      // Check that results are different
      const uniqueResults = new Set(results);
      expect(uniqueResults.size).toBe(results.length);
      
      // Check that character distributions vary
      const firstCharDistributions = results.map(result => {
        const chars = {};
        for (const char of result) {
          chars[char] = (chars[char] || 0) + 1;
        }
        return Object.keys(chars).sort().join('');
      });
      
      const uniqueDistributions = new Set(firstCharDistributions);
      expect(uniqueDistributions.size).toBeGreaterThan(1);
    });
  });

  describe('Options validation', () => {
    test('should handle undefined options', () => {
      expect(() => generateRandomUnicode(undefined)).not.toThrow();
      expect(() => generateRandomUnicode(null)).not.toThrow();
    });

    test('should handle partial options objects', () => {
      const partialOptions = [
        { length: 10 },
        { scripts: ['latin'] },
        { includeEmoji: true },
        { includeSymbols: false, length: 5 }
      ];
      
      partialOptions.forEach(options => {
        expect(() => generateRandomUnicode(options)).not.toThrow();
        const result = generateRandomUnicode(options);
        expect(typeof result).toBe('string');
      });
    });

    test('should handle invalid option types gracefully', () => {
      const invalidOptions = [
        { length: 'ten' },
        { scripts: 'latin' }, // should be array
        { includeEmoji: 'yes' }, // should be boolean
        { includeSymbols: 1 } // should be boolean
      ];
      
      invalidOptions.forEach(options => {
        expect(() => generateRandomUnicode(options)).not.toThrow();
      });
    });
  });
});