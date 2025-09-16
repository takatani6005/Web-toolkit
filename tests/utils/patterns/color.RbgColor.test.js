import {
  generateRgbColorPattern,
} from '../../../src/utils/patterns/color.js';

describe('Color Pattern Generators', () => {
  
  describe('generateRgbColorPattern', () => {
    test('should generate valid RGB color pattern', () => {
      const pattern = generateRgbColorPattern();
      expect(pattern).toMatch(/^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/);
    });

    test('should generate RGB values within valid range (0-255)', () => {
      const pattern = generateRgbColorPattern();
      const matches = pattern.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
      expect(matches).not.toBeNull();
      
      const [, r, g, b] = matches;
      expect(parseInt(r)).toBeGreaterThanOrEqual(0);
      expect(parseInt(r)).toBeLessThanOrEqual(255);
      expect(parseInt(g)).toBeGreaterThanOrEqual(0);
      expect(parseInt(g)).toBeLessThanOrEqual(255);
      expect(parseInt(b)).toBeGreaterThanOrEqual(0);
      expect(parseInt(b)).toBeLessThanOrEqual(255);
    });

    test('should generate different values on multiple calls', () => {
      const pattern1 = generateRgbColorPattern();
      const pattern2 = generateRgbColorPattern();
      const pattern3 = generateRgbColorPattern();
      
      // With random generation, at least one should be different
      expect([pattern1, pattern2, pattern3].some(p => p !== pattern1) || 
             [pattern1, pattern2, pattern3].some(p => p !== pattern2)).toBe(true);
    });
  });
});