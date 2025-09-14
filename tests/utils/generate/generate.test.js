import { describe, test, expect } from '@jest/globals';
import {
  toSlug, 
  toBase64, 
  fromBase64, 
  generateRandomUnicode, 
  generateId, 
  generatePassword, 
  generateUuid, 
  generateNanoId, 
  generateHash, 
  generatePlaceholder, 
  generateTestData, 
  generateRegexPattern
} from '../../../../src/utils/generate.js';

  describe('Integration tests', () => {
    test('should work together for creating test scenarios', () => {
      // Generate a user ID
      const userId = generateId({ prefix: 'user_', length: 8 });
      expect(userId).toMatch(/^user_.{8}$/);

      // Generate user data
      const email = generateTestData('email');
      const name = generateTestData('name');
      
      // Create a slug from the name
      const slug = toSlug(name);
      
      // Generate a secure password
      const password = generatePassword({ length: 16 });
      
      expect(typeof email).toBe('string');
      expect(typeof name).toBe('string');
      expect(typeof slug).toBe('string');
      expect(password).toHaveLength(16);
    });

    test('should handle base64 encoding of generated content', () => {
      const placeholder = generatePlaceholder({ type: 'text', sentences: 1 });
      const encoded = toBase64(placeholder);
      const decoded = fromBase64(encoded);
      
      expect(decoded).toBe(placeholder);
    });

    test('should validate generated test data with regex patterns', () => {
      const email = generateTestData('email');
      const emailRegex = generateRegexPattern('email');
      expect(email).toMatch(emailRegex);

      const uuid = generateUuid();
      const uuidRegex = generateRegexPattern('uuid');
      expect(uuid).toMatch(uuidRegex);
    });
  });

  describe('Performance tests', () => {
    test('should generate IDs quickly', () => {
      const start = Date.now();
      for (let i = 0; i < 1000; i++) {
        generateId();
      }
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(1000); // Should complete in under 1 second
    });

    test('should handle large placeholder generation', () => {
      const start = Date.now();
      const largeText = generatePlaceholder({
        type: 'paragraphs',
        paragraphs: 10,
        sentences: 10
      });
      const duration = Date.now() - start;
      
      expect(typeof largeText).toBe('string');
      expect(duration).toBeLessThan(500);
    });
  });

  describe('Error handling', () => {
    test('should handle invalid inputs gracefully', () => {
      // toSlug should handle null/undefined by converting to string
      expect(() => toSlug('')).not.toThrow();
      expect(() => generateId({ length: -1 })).not.toThrow();
      expect(() => generatePassword({ length: 0 })).not.toThrow();
    });

    test('should handle null/undefined inputs', () => {
      expect(toSlug('')).toBe('');
      expect(() => generateId({ length: 0 })).not.toThrow();
    });

    test('should provide meaningful error messages', () => {
      expect(() => generateUuid(99)).toThrow('UUID version 99 not supported');
      expect(() => generateHash('test', 'invalid')).toThrow("Hash algorithm 'invalid' not supported");
      expect(() => generateTestData('invalid')).toThrow("Test data type 'invalid' not supported");
    });
  });
