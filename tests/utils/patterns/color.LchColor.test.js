import {
    generateLchColorPattern
} from '../../../src/utils/patterns/color.js';

describe('generateLchColorPattern', () => {
    test('should generate valid LCH color pattern', () => {
      const pattern = generateLchColorPattern();
      expect(pattern).toMatch(/^lch\(\s*\d+(?:\.\d+)?\s*\d+(?:\.\d+)?\s*\d+(?:\.\d+)?\s*\)$/);
    });

    test('should generate LCH values within valid ranges', () => {
      const pattern = generateLchColorPattern();
      const matches = pattern.match(/lch\(\s*(\d+(?:\.\d+)?)\s*(\d+(?:\.\d+)?)\s*(\d+(?:\.\d+)?)\s*\)/);
      expect(matches).not.toBeNull();
      
      const [, l, c, h] = matches;
      expect(parseFloat(l)).toBeGreaterThanOrEqual(0);
      expect(parseFloat(l)).toBeLessThanOrEqual(100);
      expect(parseFloat(c)).toBeGreaterThanOrEqual(0);
      expect(parseFloat(c)).toBeLessThanOrEqual(150);
      expect(parseFloat(h)).toBeGreaterThanOrEqual(0);
      expect(parseFloat(h)).toBeLessThanOrEqual(360);
    });
  });