
import {
    generateHslColorPattern
} from '../../../src/utils/patterns/color.js';

  describe('generateHslColorPattern', () => {
    test('should generate valid HSL color pattern', () => {
      const pattern = generateHslColorPattern();
      expect(pattern).toMatch(/^hsl\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*\)$/);
    });

    test('should generate HSL values within valid ranges', () => {
      const pattern = generateHslColorPattern();
      const matches = pattern.match(/hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/);
      expect(matches).not.toBeNull();
      
      const [, h, s, l] = matches;
      expect(parseInt(h)).toBeGreaterThanOrEqual(0);
      expect(parseInt(h)).toBeLessThanOrEqual(360);
      expect(parseInt(s)).toBeGreaterThanOrEqual(0);
      expect(parseInt(s)).toBeLessThanOrEqual(100);
      expect(parseInt(l)).toBeGreaterThanOrEqual(0);
      expect(parseInt(l)).toBeLessThanOrEqual(100);
    });
  });