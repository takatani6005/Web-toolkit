import { describe, test, expect } from '@jest/globals';
import {

  generateUuid,
} from '../../src/utils/generate.js';



  describe('generateUuid', () => {
    test('should generate valid UUID v4', () => {
      const uuid = generateUuid();
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    test('should generate different UUIDs', () => {
      const uuid1 = generateUuid();
      const uuid2 = generateUuid();
      expect(uuid1).not.toBe(uuid2);
    });

    test('should throw error for unsupported versions', () => {
      expect(() => generateUuid(1)).toThrow('UUID version 1 not supported');
      expect(() => generateUuid(3)).toThrow('UUID version 3 not supported');
    });
  });

  describe('generateNanoId', () => {
    test('should generate ID of default size', () => {
      const nanoId = generateNanoId();
      expect(nanoId).toHaveLength(21);
    });

    test('should generate ID of custom size', () => {
      expect(generateNanoId({ size: 10 })).toHaveLength(10);
      expect(generateNanoId({ size: 32 })).toHaveLength(32);
    });

    test('should use custom alphabet', () => {
      const nanoId = generateNanoId({ 
        alphabet: '123456789',
        size: 10
      });
      expect(nanoId).toMatch(/^[1-9]{10}$/);
    });

    test('should generate different IDs', () => {
      const id1 = generateNanoId();
      const id2 = generateNanoId();
      expect(id1).not.toBe(id2);
    });
  });