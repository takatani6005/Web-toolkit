
import {
    generateLabColorPattern
} from '../../../src/utils/patterns/color.js';

  describe('generateLabColorPattern', () => {
    test('should generate valid LAB color pattern', () => {
      const pattern = generateLabColorPattern();
      expect(pattern).toMatch(/^lab\(\s*\d+(?:\.\d+)?\s*-?\d+(?:\.\d+)?\s*-?\d+(?:\.\d+)?\s*\)$/);
    });

    test('should generate LAB values within valid ranges', () => {
      const pattern = generateLabColorPattern();
      const matches = pattern.match(/lab\(\s*(\d+(?:\.\d+)?)\s*(-?\d+(?:\.\d+)?)\s*(-?\d+(?:\.\d+)?)\s*\)/);
      expect(matches).not.toBeNull();
      
      const [, l, a, b] = matches;
      expect(parseFloat(l)).toBeGreaterThanOrEqual(0);
      expect(parseFloat(l)).toBeLessThanOrEqual(100);
      expect(parseFloat(a)).toBeGreaterThanOrEqual(-128);
      expect(parseFloat(a)).toBeLessThanOrEqual(127);
      expect(parseFloat(b)).toBeGreaterThanOrEqual(-128);
      expect(parseFloat(b)).toBeLessThanOrEqual(127);
    });
  });
