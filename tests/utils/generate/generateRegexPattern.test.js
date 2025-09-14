import { describe, test, expect } from '@jest/globals';
import {
  generateRegexPattern
} from '../../src/utils/generate.js';

  describe('generateRegexPattern', () => {
    test('should return regex patterns', () => {
      const emailRegex = generateRegexPattern('email');
      expect(emailRegex).toBeInstanceOf(RegExp);
      expect('test@example.com').toMatch(emailRegex);
    });

    test('should return pattern as string when requested', () => {
      const pattern = generateRegexPattern('email', { asString: true });
      expect(typeof pattern).toBe('string');
      expect(pattern).toBe('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');
    });

    test('should validate URLs', () => {
      const urlRegex = generateRegexPattern('url');
      expect('https://example.com').toMatch(urlRegex);
      expect('http://test.org/path').toMatch(urlRegex);
      expect('not-a-url').not.toMatch(urlRegex);
    });

    test('should validate UUIDs', () => {
      const uuidRegex = generateRegexPattern('uuid');
      const uuid = generateUuid();
      expect(uuid).toMatch(uuidRegex);
    });

    test('should validate hex colors', () => {
      const colorRegex = generateRegexPattern('hexColor');
      expect('#FF0000').toMatch(colorRegex);
      expect('#f0f').toMatch(colorRegex);
      expect('FF0000').not.toMatch(colorRegex);
    });

    test('should validate strong passwords', () => {
      const passwordRegex = generateRegexPattern('strongPassword');
      expect('StrongPass123!').toMatch(passwordRegex);
      expect('weak').not.toMatch(passwordRegex);
    });

    test('should throw error for unsupported type', () => {
      expect(() => generateRegexPattern('unsupported')).toThrow("Regex pattern type 'unsupported' not supported");
    });
  });
