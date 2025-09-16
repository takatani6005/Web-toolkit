import {
    generateNamedColorPattern
} from '../../../src/utils/patterns/color.js';

  describe('generateNamedColorPattern', () => {
    const commonColors = [
      'red', 'green', 'blue', 'yellow', 'orange', 'purple', 'pink', 'brown',
      'black', 'white', 'gray', 'grey', 'cyan', 'magenta', 'lime', 'maroon',
      'navy', 'olive', 'teal', 'silver', 'gold', 'indigo', 'violet', 'turquoise'
    ];

    test('should generate valid named color', () => {
      const pattern = generateNamedColorPattern();
      expect(typeof pattern).toBe('string');
      expect(pattern.length).toBeGreaterThan(0);
    });

    test('should generate recognized color names', () => {
      const pattern = generateNamedColorPattern();
      // Should be a string that could be a color name (letters only, no spaces/special chars in basic names)
      expect(pattern).toMatch(/^[a-zA-Z]+$/);
    });

    test('should generate variety of colors', () => {
      const colors = new Set();
      for (let i = 0; i < 20; i++) {
        colors.add(generateNamedColorPattern());
      }
      expect(colors.size).toBeGreaterThan(3);
    });
  });