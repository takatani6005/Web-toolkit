import {
    generateHslaColorPattern
} from '../../../src/utils/patterns/color.js';

  describe('generateHslaColorPattern', () => {
    test('should generate valid HSLA color pattern', () => {
      const pattern = generateHslaColorPattern();
      expect(pattern).toMatch(/^hsla\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*,\s*[01](?:\.\d+)?\s*\)$/);
    });

    test('should generate HSLA values within valid ranges', () => {
      const pattern = generateHslaColorPattern();
      const matches = pattern.match(/hsla\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*,\s*([01](?:\.\d+)?)\s*\)/);
      expect(matches).not.toBeNull();
      
      const [, h, s, l, a] = matches;
      expect(parseInt(h)).toBeGreaterThanOrEqual(0);
      expect(parseInt(h)).toBeLessThanOrEqual(360);
      expect(parseInt(s)).toBeGreaterThanOrEqual(0);
      expect(parseInt(s)).toBeLessThanOrEqual(100);
      expect(parseInt(l)).toBeGreaterThanOrEqual(0);
      expect(parseInt(l)).toBeLessThanOrEqual(100);
      expect(parseFloat(a)).toBeGreaterThanOrEqual(0);
      expect(parseFloat(a)).toBeLessThanOrEqual(1);
    });
  });
