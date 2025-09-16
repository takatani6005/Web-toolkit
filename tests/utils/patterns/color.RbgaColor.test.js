import {
  generateRgbaColorPattern,
} from '../../../src/utils/patterns/color.js';


  describe('generateRgbaColorPattern', () => {
    test('should generate valid RGBA color pattern', () => {
      const pattern = generateRgbaColorPattern();
      expect(pattern).toMatch(/^rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*[01](?:\.\d+)?\s*\)$/);
    });

    test('should generate RGBA values within valid ranges', () => {
      const pattern = generateRgbaColorPattern();
      const matches = pattern.match(/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([01](?:\.\d+)?)\s*\)/);
      expect(matches).not.toBeNull();
      
      const [, r, g, b, a] = matches;
      expect(parseInt(r)).toBeGreaterThanOrEqual(0);
      expect(parseInt(r)).toBeLessThanOrEqual(255);
      expect(parseInt(g)).toBeGreaterThanOrEqual(0);
      expect(parseInt(g)).toBeLessThanOrEqual(255);
      expect(parseInt(b)).toBeGreaterThanOrEqual(0);
      expect(parseInt(b)).toBeLessThanOrEqual(255);
      expect(parseFloat(a)).toBeGreaterThanOrEqual(0);
      expect(parseFloat(a)).toBeLessThanOrEqual(1);
    });
  });