import { describe, test, expect } from '@jest/globals';
import {
  generateUuid, 
  generateNanoId
} from '../../generate/index.js';

describe('generateUuid', () => {
  test('should generate valid UUID v4', () => {
    const uuid = generateUuid();
    
    // More comprehensive UUID v4 validation
    expect(typeof uuid).toBe('string');
    expect(uuid).toHaveLength(36);
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    
    // Verify the version and variant bits are correct
    const parts = uuid.split('-');
    expect(parts[2][0]).toBe('4'); // Version 4
    expect(['8', '9', 'a', 'b', 'A', 'B']).toContain(parts[3][0]); // Variant bits
  });

  test('should generate different UUIDs consistently', () => {
    const uuids = new Set();
    const count = 1000;
    
    // Generate multiple UUIDs and ensure uniqueness
    for (let i = 0; i < count; i++) {
      const uuid = generateUuid();
      expect(uuids.has(uuid)).toBe(false);
      uuids.add(uuid);
    }
    
    expect(uuids.size).toBe(count);
  });

  test('should handle version parameter correctly', () => {
    // Test default version (should be v4)
    const defaultUuid = generateUuid();
    expect(defaultUuid.split('-')[2][0]).toBe('4');
    
    // Test explicit v4
    const v4Uuid = generateUuid(4);
    expect(v4Uuid.split('-')[2][0]).toBe('4');
  });

  test('should throw descriptive errors for unsupported versions', () => {
    expect(() => generateUuid(1)).toThrow(/UUID version 1 not supported/i);
    expect(() => generateUuid(2)).toThrow(/UUID version 2 not supported/i);
    expect(() => generateUuid(3)).toThrow(/UUID version 3 not supported/i);
    expect(() => generateUuid(5)).toThrow(/UUID version 5 not supported/i);
    expect(() => generateUuid(0)).toThrow(/UUID version 0 not supported/i);
    expect(() => generateUuid(-1)).toThrow(/invalid/i);
    expect(() => generateUuid('invalid')).toThrow(/invalid/i);
  });

  test('should have sufficient entropy', () => {
    const uuids = Array.from({ length: 100 }, () => generateUuid());
    
    // Check that we're not getting repeated patterns
    const uniqueFirstChars = new Set(uuids.map(uuid => uuid[0]));
    const uniqueLastChars = new Set(uuids.map(uuid => uuid[uuid.length - 1]));
    
    expect(uniqueFirstChars.size).toBeGreaterThan(5); // Should have variety
    expect(uniqueLastChars.size).toBeGreaterThan(5);
  });
});

describe('generateNanoId', () => {
  test('should generate ID of default size', () => {
    const nanoId = generateNanoId();
    expect(typeof nanoId).toBe('string');
    expect(nanoId).toHaveLength(21);
    expect(nanoId).toMatch(/^[A-Za-z0-9_-]+$/); // Default alphabet
  });

  test('should generate ID of custom size', () => {
    expect(generateNanoId({ size: 1 })).toHaveLength(1);
    expect(generateNanoId({ size: 10 })).toHaveLength(10);
    expect(generateNanoId({ size: 32 })).toHaveLength(32);
    expect(generateNanoId({ size: 100 })).toHaveLength(100);
  });

  test('should handle edge cases for size', () => {
    // Test minimum viable size
    expect(generateNanoId({ size: 1 })).toHaveLength(1);
    
    // Test zero size (should either work or throw meaningful error)
    expect(() => generateNanoId({ size: 0 })).toThrow();
    
    // Test negative size
    expect(() => generateNanoId({ size: -1 })).toThrow();
    
    // Test non-integer size
    expect(() => generateNanoId({ size: 10.5 })).toThrow();
  });

  test('should use custom alphabet correctly', () => {
    const customAlphabet = '123456789';
    const nanoId = generateNanoId({
      alphabet: customAlphabet,
      size: 20
    });
    
    expect(nanoId).toHaveLength(20);
    expect(nanoId).toMatch(/^[1-9]+$/);
    
    // Ensure all characters are from the custom alphabet
    for (const char of nanoId) {
      expect(customAlphabet).toContain(char);
    }
  });

  test('should handle various custom alphabets', () => {
    const testCases = [
      { alphabet: 'ABCDEF', pattern: /^[A-F]+$/ },
      { alphabet: '01', pattern: /^[01]+$/ },
      { alphabet: 'abcdefghijklmnopqrstuvwxyz', pattern: /^[a-z]+$/ },
      { alphabet: '!@#$%^&*()', pattern: /^[!@#$%^&*()]+$/ }
    ];

    testCases.forEach(({ alphabet, pattern }) => {
      const id = generateNanoId({ alphabet, size: 15 });
      expect(id).toMatch(pattern);
      expect(id).toHaveLength(15);
    });
  });

  test('should throw error for invalid alphabet', () => {
    expect(() => generateNanoId({ alphabet: null })).toThrow(/alphabet/i);
    expect(() => generateNanoId({ alphabet: '' })).toThrow(/alphabet/i);

  });

  test('should generate different IDs with high probability', () => {
    const ids = new Set();
    const count = 1000;
    
    for (let i = 0; i < count; i++) {
      const id = generateNanoId();
      expect(ids.has(id)).toBe(false);
      ids.add(id);
    }
    
    expect(ids.size).toBe(count);
  });

  test('should maintain consistent randomness distribution', () => {
    const size = 10;
    const ids = Array.from({ length: 1000 }, () => 
      generateNanoId({ size, alphabet: '0123456789' })
    );
    
    // Count frequency of each digit across all positions
    const digitCounts = {};
    for (const id of ids) {
      for (const digit of id) {
        digitCounts[digit] = (digitCounts[digit] || 0) + 1;
      }
    }
    
    // Each digit should appear roughly equally (within reasonable variance)
    const expectedCount = (ids.length * size) / 10;
    const tolerance = expectedCount * 0.2; // 20% tolerance
    
    for (let i = 0; i < 10; i++) {
      const count = digitCounts[i.toString()] || 0;
      expect(count).toBeGreaterThan(expectedCount - tolerance);
      expect(count).toBeLessThan(expectedCount + tolerance);
    }
  });

  test('should handle options parameter variations', () => {
    // No options
    expect(() => generateNanoId()).not.toThrow();
    
    // Empty options
    expect(() => generateNanoId({})).not.toThrow();
    
    // Only size
    expect(generateNanoId({ size: 15 })).toHaveLength(15);
    
    // Only alphabet
    const id = generateNanoId({ alphabet: 'ABC' });
    expect(id).toMatch(/^[ABC]+$/);
    expect(id).toHaveLength(21); // Should use default size
  });

  test('should be URL-safe by default', () => {
    const ids = Array.from({ length: 100 }, () => generateNanoId());
    
    ids.forEach(id => {
      // Should not contain characters that need URL encoding
      expect(id).not.toMatch(/[^A-Za-z0-9_-]/);
      expect(encodeURIComponent(id)).toBe(id);
    });
  });
});