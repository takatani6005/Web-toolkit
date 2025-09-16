import {
    generateColorFunctionPattern
} from '../../../src/utils/patterns/color.js';

  describe('generateColorFunctionPattern', () => {
    test('should generate one of the valid color function formats', () => {
      const pattern = generateColorFunctionPattern();
      const validPatterns = [
        /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/,
        /^rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*[01](?:\.\d+)?\s*\)$/,
        /^hsl\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*\)$/,
        /^hsla\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*,\s*[01](?:\.\d+)?\s*\)$/
      ];
      
      const isValid = validPatterns.some(regex => regex.test(pattern));
      expect(isValid).toBe(true);
    });

    test('should generate variety of function types', () => {
      const functionTypes = new Set();
      for (let i = 0; i < 20; i++) {
        const pattern = generateColorFunctionPattern();
        const type = pattern.split('(')[0];
        functionTypes.add(type);
      }
      expect(functionTypes.size).toBeGreaterThan(1);
    });
  });