import { describe, test, expect, beforeAll, afterAll,jest } from '@jest/globals';
import {generateId,generateIdBatch, validateId} from '../../../src/utils/generate/index.js'
// Mock crypto for testing
const mockCrypto = {
  getRandomValues: jest.fn((array) => {
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
    return array;
  })
};

describe('generateId', () => {
  let originalCrypto;
  let originalConsoleWarn;

  beforeAll(() => {
    originalCrypto = global.crypto;
    originalConsoleWarn = console.warn;
    console.warn = jest.fn();
  });

  afterAll(() => {
    global.crypto = originalCrypto;
    console.warn = originalConsoleWarn;
  });

  describe('Basic functionality', () => {
    test('should generate ID of default length (8) when no options provided', () => {
      const id = generateId();
      expect(id).toHaveLength(8);
      expect(id).toMatch(/^[A-Za-z0-9]{8}$/);
    });

    test('should generate ID of specified length', () => {
      expect(generateId({ length: 4 })).toHaveLength(4);
      expect(generateId({ length: 8 })).toHaveLength(8);
      expect(generateId({ length: 16 })).toHaveLength(16);
      expect(generateId({ length: 32 })).toHaveLength(32);
    });

    test('should handle zero length', () => {
      const id = generateId({ length: 0 });
      expect(id).toHaveLength(0);
      expect(id).toBe('');
    });

    test('should handle large lengths within bounds', () => {
      const id = generateId({ length: 256 });
      expect(id).toHaveLength(256);
    });
  });

  describe('Input validation', () => {
    test('should throw error for negative length', () => {
      expect(() => generateId({ length: -1 })).toThrow('Length cannot be negative');
    });

    test('should throw error for non-integer length', () => {
      expect(() => generateId({ length: 3.14 })).toThrow('Length must be an integer');
      expect(() => generateId({ length: '8' })).toThrow('Length must be an integer');
      expect(() => generateId({ length: null })).toThrow('Length must be an integer');
    });

    test('should throw error for length outside bounds', () => {
      expect(() => generateId({ length: 0, minLength: 1 })).toThrow('Length must be between 1 and 256');
      expect(() => generateId({ length: 300 })).toThrow('Length must be between 1 and 256');
    });

    test('should throw error for non-string prefix/suffix', () => {
      expect(() => generateId({ prefix: 123 })).toThrow('Prefix and suffix must be strings');
      expect(() => generateId({ suffix: null })).toThrow('Prefix and suffix must be strings');
    });

    test('should throw error for non-string separator', () => {
      expect(() => generateId({ separator: 123 })).toThrow('Separator must be a string');
    });

    test('should throw error for empty charset', () => {
      expect(() => generateId({ charset: '' })).toThrow('Charset must be a non-empty string or valid charset name');
      expect(() => generateId({ charset: null })).toThrow('Charset must be a non-empty string or valid charset name');
    });

    test('should throw error when no characters remain after removing ambiguous ones', () => {
      expect(() => generateId({ 
        charset: '0OIl1', 
        avoidAmbiguous: true,
        length: 5 
      })).toThrow('No characters remaining after removing ambiguous ones');
    });
  });

  describe('Enhanced charset functionality', () => {
    test('should use all predefined charsets', () => {
      expect(generateId({ charset: 'alphanumeric', length: 10 })).toMatch(/^[A-Za-z0-9]{10}$/);
      expect(generateId({ charset: 'alpha', length: 10 })).toMatch(/^[A-Za-z]{10}$/);
      expect(generateId({ charset: 'numeric', length: 10 })).toMatch(/^\d{10}$/);
      expect(generateId({ charset: 'hex', length: 10 })).toMatch(/^[0-9A-F]{10}$/);
      expect(generateId({ charset: 'hexLower', length: 10 })).toMatch(/^[0-9a-f]{10}$/);
      expect(generateId({ charset: 'base32', length: 10 })).toMatch(/^[A-Z2-7]{10}$/);
      expect(generateId({ charset: 'base32Lower', length: 10 })).toMatch(/^[a-z2-7]{10}$/);
      expect(generateId({ charset: 'urlsafe', length: 10 })).toMatch(/^[A-Za-z0-9_-]{10}$/);
      expect(generateId({ charset: 'base58', length: 10 })).toMatch(/^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{10}$/);
      expect(generateId({ charset: 'safe', length: 10 })).toMatch(/^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{10}$/);
    });

    test('should avoid ambiguous characters when requested', () => {
      const id = generateId({ 
        charset: 'alphanumeric', 
        avoidAmbiguous: true, 
        length: 50 
      });
      expect(id).not.toMatch(/[0OIl1]/);
      expect(id).toHaveLength(50);
    });

    test('should handle custom charset', () => {
      const id = generateId({ charset: 'XYZ123', length: 20 });
      expect(id).toMatch(/^[XYZ123]{20}$/);
    });
  });

  describe('Secure random generation', () => {
    test('should use crypto.getRandomValues when available and secure=true', () => {
      global.crypto = mockCrypto;
      const spy = jest.spyOn(mockCrypto, 'getRandomValues');
      
      generateId({ secure: true, length: 10 });
      
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    test('should fall back to Math.random when crypto not available but secure requested', () => {
      global.crypto = undefined;
      console.warn.mockClear();
      
      const id = generateId({ secure: true, length: 8 });
      
      expect(id).toHaveLength(8);
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Secure random generation requested but crypto not available')
      );
    });

    test('should use Math.random by default', () => {
      global.crypto = undefined;
      const id = generateId({ length: 8 });
      expect(id).toHaveLength(8);
    });
  });

  describe('Prefix and suffix handling', () => {
    test('should include prefix and suffix', () => {
      const id = generateId({ prefix: 'user_', suffix: '_test', length: 5 });
      expect(id).toMatch(/^user_.{5}_test$/);
      expect(id).toHaveLength(15); // 5 + 5 + 5
    });

    test('should handle empty prefix and suffix', () => {
      const id = generateId({ prefix: '', suffix: '', length: 6 });
      expect(id).toHaveLength(6);
      expect(id).toMatch(/^[A-Za-z0-9]{6}$/);
    });

    test('should handle special characters in prefix/suffix', () => {
      const id = generateId({ 
        prefix: 'test-', 
        suffix: '.tmp', 
        length: 5 
      });
      expect(id).toMatch(/^test-.{5}\.tmp$/);
    });
  });

  describe('Timestamp functionality', () => {
    test('should include timestamp when requested', () => {
      const id = generateId({ 
        includeTimestamp: true, 
        separator: '-', 
        length: 5 
      });
      expect(id).toMatch(/^.{5}-.+$/);
      
      const timestampPart = id.split('-')[1];
      expect(timestampPart).toMatch(/^[0-9a-z]+$/);
    });

    test('should include timestamp without separator', () => {
      const id = generateId({ 
        includeTimestamp: true, 
        length: 5 
      });
      expect(id.length).toBeGreaterThan(5);
      expect(id).toMatch(/^.{5}[0-9a-z]+$/);
    });

    test('should handle timestamp with custom separator', () => {
      const id = generateId({ 
        includeTimestamp: true, 
        separator: '_TS_', 
        length: 4 
      });
      expect(id).toMatch(/^.{4}_TS_[0-9a-z]+$/);
    });
  });

  describe('Warning system', () => {
    test('should warn about very long IDs', () => {
      console.warn.mockClear();
      
      generateId({ 
        prefix: 'a'.repeat(500), 
        suffix: 'b'.repeat(500), 
        length: 10 
      });
      
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Generated ID is very long')
      );
    });
  });

  describe('Randomness and uniqueness', () => {
    test('should generate different IDs on multiple calls', () => {
      const ids = new Set();
      for (let i = 0; i < 100; i++) {
        ids.add(generateId({ length: 10 }));
      }
      expect(ids.size).toBe(100);
    });

    test('should have good distribution across charset', () => {
      const charset = 'ABCDEF';
      const ids = [];
      for (let i = 0; i < 600; i++) {
        ids.push(generateId({ charset, length: 1 }));
      }
      
      const uniqueChars = new Set(ids);
      expect(uniqueChars.size).toBe(6);
      
      // Check reasonable distribution
      const frequencies = {};
      ids.forEach(char => frequencies[char] = (frequencies[char] || 0) + 1);
      Object.values(frequencies).forEach(freq => {
        expect(freq).toBeGreaterThan(50); // At least ~8% of 600
      });
    });
  });

  describe('Complex scenarios', () => {
    test('should handle all options together', () => {
      const id = generateId({
        length: 8,
        prefix: 'app_',
        suffix: '_v1',
        charset: 'hex',
        includeTimestamp: true,
        separator: '-',
        avoidAmbiguous: false
      });
      
      expect(id).toMatch(/^app_[0-9A-F]{8}-[0-9a-z]+_v1$/);
    });
  });
});

describe('generateIdBatch', () => {
  describe('Basic functionality', () => {
    test('should generate requested number of IDs', () => {
      const ids = generateIdBatch(5, { length: 8 });
      expect(ids).toHaveLength(5);
      ids.forEach(id => {
        expect(id).toHaveLength(8);
        expect(id).toMatch(/^[A-Za-z0-9]{8}$/);
      });
    });

    test('should generate unique IDs', () => {
      const ids = generateIdBatch(50, { length: 12 });
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(50);
    });

    test('should handle zero count', () => {
      const ids = generateIdBatch(0);
      expect(ids).toHaveLength(0);
    });
  });

  describe('Input validation', () => {
    test('should throw error for negative count', () => {
      expect(() => generateIdBatch(-1)).toThrow('Count must be a non-negative integer');
    });

    test('should throw error for non-integer count', () => {
      expect(() => generateIdBatch(3.14)).toThrow('Count must be a non-negative integer');
      expect(() => generateIdBatch('5')).toThrow('Count must be a non-negative integer');
    });

    test('should throw error for batch size too large', () => {
      expect(() => generateIdBatch(10001)).toThrow('Batch size too large, maximum is 10000');
    });
  });

  describe('Collision handling', () => {
    test('should warn when unable to generate enough unique IDs', () => {
      const mockWarn = jest.fn();
      console.warn = mockWarn;
      
      // Use very short length and small charset to force collisions
      const ids = generateIdBatch(10, { 
        length: 1, 
        charset: 'AB' 
      });
      
      expect(ids.length).toBeLessThanOrEqual(10);
      expect(mockWarn).toHaveBeenCalledWith(
        expect.stringContaining('Could only generate')
      );
    });

    test('should apply options to all generated IDs', () => {
      const ids = generateIdBatch(3, { 
        prefix: 'test_', 
        suffix: '_end', 
        length: 5 
      });
      
      ids.forEach(id => {
        expect(id).toMatch(/^test_.{5}_end$/);
      });
    });
  });
});

describe('validateId', () => {
  describe('Basic validation', () => {
    test('should validate simple IDs', () => {
      expect(validateId('abcd1234', { length: 8 })).toBe(true);
      expect(validateId('ABCD1234', { charset: 'alphanumeric' })).toBe(true);
      expect(validateId('12345', { charset: 'numeric' })).toBe(true);
    });

    test('should reject invalid input types', () => {
      expect(validateId(123)).toBe(false);
      expect(validateId(null)).toBe(false);
      expect(validateId(undefined)).toBe(false);
    });

    test('should validate charset constraints', () => {
      expect(validateId('ABCDEF', { charset: 'hex' })).toBe(true);
      expect(validateId('GHIJKL', { charset: 'hex' })).toBe(false);
      expect(validateId('12345', { charset: 'numeric' })).toBe(true);
      expect(validateId('1234a', { charset: 'numeric' })).toBe(false);
    });
  });

  describe('Prefix and suffix validation', () => {
    test('should validate prefix and suffix', () => {
      expect(validateId('user_abc123', { prefix: 'user_' })).toBe(true);
      expect(validateId('abc123_end', { suffix: '_end' })).toBe(true);
      expect(validateId('user_abc123_end', { 
        prefix: 'user_', 
        suffix: '_end' 
      })).toBe(true);
    });

    test('should reject incorrect prefix/suffix', () => {
      expect(validateId('admin_abc123', { prefix: 'user_' })).toBe(false);
      expect(validateId('abc123_start', { suffix: '_end' })).toBe(false);
    });
  });

  describe('Timestamp validation', () => {
    test('should validate IDs with timestamps', () => {
      expect(validateId('abc12-xyz789', { 
        includeTimestamp: true, 
        separator: '-' 
      })).toBe(true);
    });

    test('should reject invalid timestamp format', () => {
      expect(validateId('abc12-XYZ789', { 
        includeTimestamp: true, 
        separator: '-' 
      })).toBe(false); // Uppercase not valid in base36
    });

    test('should reject missing separator when expected', () => {
      expect(validateId('abc12xyz789', { 
        includeTimestamp: true, 
        separator: '-' 
      })).toBe(false);
    });
  });

  describe('Ambiguous character validation', () => {
    test('should validate when ambiguous characters are avoided', () => {
      expect(validateId('ABCDEF', { 
        charset: 'alphanumeric', 
        avoidAmbiguous: true 
      })).toBe(true);
      
      expect(validateId('ABC0EF', { 
        charset: 'alphanumeric', 
        avoidAmbiguous: true 
      })).toBe(false); // Contains '0' which is ambiguous
    });
  });

  describe('Custom charset validation', () => {
    test('should validate custom charsets', () => {
      expect(validateId('XYZ123', { charset: 'XYZ123' })).toBe(true);
      expect(validateId('XYZ124', { charset: 'XYZ123' })).toBe(false); // '4' not in charset
    });

    test('should handle special characters in custom charset', () => {
      expect(validateId('+-*/', { charset: '+*/-' })).toBe(true);
      expect(validateId('abc', { charset: '+*/-' })).toBe(false);
    });
  });

  describe('Integration with generateId', () => {
    test('should validate IDs generated with same options', () => {
      const options = {
        length: 10,
        prefix: 'test_',
        suffix: '_end',
        charset: 'hex',
        includeTimestamp: true,
        separator: '-'
      };
      
      const id = generateId(options);
      expect(validateId(id, options)).toBe(true);
    });

    test('should validate batch generated IDs', () => {
      const options = {
        length: 8,
        charset: 'base58',
        prefix: 'sk_'
      };
      
      const ids = generateIdBatch(5, options);
      ids.forEach(id => {
        expect(validateId(id, options)).toBe(true);
      });
    });
  });
});