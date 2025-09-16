import {
  generateRgbColorPattern,
  generateRgbaColorPattern,
  generateHslColorPattern,
  generateHslaColorPattern,
  generateHwbColorPattern,
  generateLabColorPattern,
  generateLchColorPattern,
  generateHexColorPattern,
  generateNamedColorPattern,
  generateColorFunctionPattern,
  generateUniversalColorPattern,
  generateCmykColorPattern,
} from '../../../src/utils/patterns/color.js';

  // Integration tests
  describe('Integration Tests', () => {
    test('all generators should return strings', () => {
      const generators = [
        generateRgbColorPattern,
        generateRgbaColorPattern,
        generateHslColorPattern,
        generateHslaColorPattern,
        generateHwbColorPattern,
        generateLabColorPattern,
        generateLchColorPattern,
        generateHexColorPattern,
        generateNamedColorPattern,
        generateColorFunctionPattern,
        generateUniversalColorPattern,
        generateCmykColorPattern
      ];

      generators.forEach(generator => {
        const result = generator();
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      });
    });

    test('generators should not throw errors', () => {
      const generators = [
        generateRgbColorPattern,
        generateRgbaColorPattern,
        generateHslColorPattern,
        generateHslaColorPattern,
        generateHwbColorPattern,
        generateLabColorPattern,
        generateLchColorPattern,
        generateHexColorPattern,
        generateNamedColorPattern,
        generateColorFunctionPattern,
        generateUniversalColorPattern,
        generateCmykColorPattern
      ];

      generators.forEach(generator => {
        expect(() => generator()).not.toThrow();
      });
    });

    test('multiple calls should show randomness', () => {
      // Test that we get different results across multiple calls
      const results = [];
      for (let i = 0; i < 5; i++) {
        results.push(generateUniversalColorPattern());
      }
      
      // At least some should be different
      const uniqueResults = new Set(results);
      expect(uniqueResults.size).toBeGreaterThan(1);
    });
  });

  // Edge cases and error handling
  describe('Edge Cases', () => {
    test('hex generator with short option should work', () => {
      const shortHex = generateHexColorPattern(true);
      expect(shortHex).toMatch(/^#[0-9a-fA-F]{3}$/);
      
      const longHex = generateHexColorPattern(false);
      expect(longHex).toMatch(/^#[0-9a-fA-F]{6}$/);
    });

    test('should handle multiple rapid calls', () => {
      const results = [];
      for (let i = 0; i < 100; i++) {
        results.push(generateHexColorPattern());
      }
      
      // All should be valid
      results.forEach(result => {
        expect(result).toMatch(/^#[0-9a-fA-F]{6}$/);
      });
      
      // Should have reasonable variety
      const unique = new Set(results);
      expect(unique.size).toBeGreaterThan(50); // At least 50% unique in 100 generations
    });
  });