import {
    generateUniversalColorPattern
} from '../../../src/utils/patterns/color.js';

  describe('generateUniversalColorPattern', () => {
    test('should generate valid color in any format', () => {
      const pattern = generateUniversalColorPattern();
      
      const validPatterns = [
        /^#[0-9a-fA-F]{3,6}$/, // hex
        /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/, // rgb
        /^rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*[01](?:\.\d+)?\s*\)$/, // rgba
        /^hsl\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*\)$/, // hsl
        /^hsla\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*,\s*[01](?:\.\d+)?\s*\)$/, // hsla
        /^[a-zA-Z]+$/ // named colors
      ];
      
      const isValid = validPatterns.some(regex => regex.test(pattern));
      expect(isValid).toBe(true);
    });

    test('should generate variety of color formats', () => {
      const formats = new Set();
      for (let i = 0; i < 50; i++) {
        const pattern = generateUniversalColorPattern();
        let format;
        
        if (pattern.startsWith('#')) format = 'hex';
        else if (pattern.startsWith('rgb(')) format = 'rgb';
        else if (pattern.startsWith('rgba(')) format = 'rgba';
        else if (pattern.startsWith('hsl(')) format = 'hsl';
        else if (pattern.startsWith('hsla(')) format = 'hsla';
        else format = 'named';
        
        formats.add(format);
      }
      expect(formats.size).toBeGreaterThan(2);
    });

    test('should always return non-empty string', () => {
      for (let i = 0; i < 10; i++) {
        const pattern = generateUniversalColorPattern();
        expect(pattern).toBeTruthy();
        expect(typeof pattern).toBe('string');
        expect(pattern.length).toBeGreaterThan(0);
      }
    });
  });