import { describe, test, expect } from '@jest/globals';
import {
  generateHash
} from '../../src/utils/generate.js';


  describe('generateHash', () => {
    test('should generate consistent hashes', () => {
      const str = 'test string';
      expect(generateHash(str)).toBe(generateHash(str));
      expect(generateHash(str, 'djb2')).toBe(generateHash(str, 'djb2'));
    });

    test('should generate different hashes for different strings', () => {
      expect(generateHash('test1')).not.toBe(generateHash('test2'));
    });

    test('should support different algorithms', () => {
      const str = 'test';
      const djb2 = generateHash(str, 'djb2');
      const sdbm = generateHash(str, 'sdbm');
      const simple = generateHash(str, 'simple');
      
      expect(djb2).not.toBe(sdbm);
      expect(sdbm).not.toBe(simple);
      expect(djb2).not.toBe(simple);
    });

    test('should throw error for unsupported algorithm', () => {
      expect(() => generateHash('test', 'unsupported')).toThrow("Hash algorithm 'unsupported' not supported");
    });

    test('should handle empty strings', () => {
      expect(typeof generateHash('')).toBe('number');
    });

    test('should generate positive numbers', () => {
      expect(generateHash('test')).toBeGreaterThanOrEqual(0);
      expect(generateHash('test', 'simple')).toBeGreaterThanOrEqual(0);
    });
  });