import { describe, test, expect } from '@jest/globals';
import {
  toBase64,
} from '../../src/utils/generate.js';



  describe('toBase64', () => {
    test('should encode basic strings', () => {
      expect(toBase64('hello')).toBe('aGVsbG8=');
      expect(toBase64('Hello World')).toBe('SGVsbG8gV29ybGQ=');
    });

    test('should handle UTF-8 characters', () => {
      expect(toBase64('café')).toBe('Y2Fmw6k=');
      expect(toBase64('🎉')).toBe('8J+OiQ==');
    });

    test('should handle empty string', () => {
      expect(toBase64('')).toBe('');
    });

    test('should handle special characters', () => {
      expect(toBase64('!@#$%^&*()')).toBe('IUAjJCVeJiooKQ==');
    });
  });
