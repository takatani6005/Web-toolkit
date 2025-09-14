import { describe, test, expect } from '@jest/globals';
import {
  fromBase64
} from '../../src/utils/generate.js';


  describe('fromBase64', () => {
    test('should decode basic strings', () => {
      expect(fromBase64('aGVsbG8=')).toBe('hello');
      expect(fromBase64('SGVsbG8gV29ybGQ=')).toBe('Hello World');
    });

    test('should handle UTF-8 characters', () => {
      expect(fromBase64('Y2Fmw6k=')).toBe('café');
      expect(fromBase64('8J+OiQ==')).toBe('🎉');
    });

    test('should handle empty string', () => {
      expect(fromBase64('')).toBe('');
    });

    test('should throw on invalid base64', () => {
      expect(() => fromBase64('invalid!')).toThrow('Invalid base64 string');
    });

    test('should be reversible with toBase64', () => {
      const original = 'Hello World! 🌍';
      expect(fromBase64(toBase64(original))).toBe(original);
    });
  });