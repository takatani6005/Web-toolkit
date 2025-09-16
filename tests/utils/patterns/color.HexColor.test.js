import {
    generateHexColorPattern
} from '../../../src/utils/patterns/color.js';


  describe('generateHexColorPattern', () => {
    test('should generate valid 6-digit hex color pattern', () => {
      const pattern = generateHexColorPattern();
      expect(pattern).toMatch(/^#[0-9a-fA-F]{6}$/);
    });

    test('should handle short hex option', () => {
      const pattern = generateHexColorPattern(true);
      expect(pattern).toMatch(/^#[0-9a-fA-F]{3}$/);
    });

    test('should generate different hex colors', () => {
      const colors = new Set();
      for (let i = 0; i < 10; i++) {
        colors.add(generateHexColorPattern());
      }
      // Should have some variety in 10 generations
      expect(colors.size).toBeGreaterThan(1);
    });
  });