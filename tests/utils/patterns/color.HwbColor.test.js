import {
    generateHwbColorPattern
} from '../../../src/utils/patterns/color.js';

  describe('generateHwbColorPattern', () => {
    test('should generate valid HWB color pattern', () => {
      const pattern = generateHwbColorPattern();
      expect(pattern).toMatch(/^hwb\(\s*\d{1,3}\s*\s*\d{1,3}%\s*\s*\d{1,3}%\s*\)$/);
    });

    test('should generate HWB values within valid ranges', () => {
      const pattern = generateHwbColorPattern();
      const matches = pattern.match(/hwb\(\s*(\d+)\s*(\d+)%\s*(\d+)%\s*\)/);
      expect(matches).not.toBeNull();
      
      const [, h, w, b] = matches;
      expect(parseInt(h)).toBeGreaterThanOrEqual(0);
      expect(parseInt(h)).toBeLessThanOrEqual(360);
      expect(parseInt(w)).toBeGreaterThanOrEqual(0);
      expect(parseInt(w)).toBeLessThanOrEqual(100);
      expect(parseInt(b)).toBeGreaterThanOrEqual(0);
      expect(parseInt(b)).toBeLessThanOrEqual(100);
    });
  });