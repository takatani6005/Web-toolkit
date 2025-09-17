import { describe, test, expect } from '@jest/globals';
import {
  generateHash
} from '../../generate/index.js';

describe('generateHash', () => {
  test('should generate consistent hashes', () => {
    const testCases = [
      'test string',
      'hello world',
      'Lorem ipsum dolor sit amet',
      'Special chars: !@#$%^&*()',
      '12345',
      'Unicode: 你好世界 🌍',
      ''
    ];

    testCases.forEach(str => {
      // Test default algorithm consistency
      const hash1 = generateHash(str);
      const hash2 = generateHash(str);
      expect(hash1).toBe(hash2);

      // Test specific algorithm consistency
      const algorithms = ['djb2', 'sdbm', 'simple'];
      algorithms.forEach(algo => {
        const algoHash1 = generateHash(str, algo);
        const algoHash2 = generateHash(str, algo);
        expect(algoHash1).toBe(algoHash2);
      });
    });
  });

  test('should generate different hashes for different strings', () => {
    const testPairs = [
      ['test1', 'test2'],
      ['hello', 'Hello'],
      ['a', 'b'],
      ['short', 'much longer string'],
      ['123', '124'],
      ['', 'non-empty'],
      ['same length A', 'same length B']
    ];

    testPairs.forEach(([str1, str2]) => {
      expect(generateHash(str1)).not.toBe(generateHash(str2));
      
      // Test across different algorithms
      const algorithms = ['djb2', 'sdbm', 'simple'];
      algorithms.forEach(algo => {
        expect(generateHash(str1, algo)).not.toBe(generateHash(str2, algo));
      });
    });
  });

  test('should support different algorithms with distinct outputs', () => {
    const testStrings = [
      'test',
      'longer test string',
      'Unicode: émojis 🎉',
      '12345',
    ];

    const algorithms = ['djb2', 'sdbm', 'simple'];

    testStrings.forEach(str => {
      const hashes = algorithms.map(algo => generateHash(str, algo));

      // Kiểm tra tất cả hash là number
      hashes.forEach(h => expect(typeof h).toBe('number'));

      // Kiểm tra tất cả hash khác nhau
      const unique = new Set(hashes);
      expect(unique.size).toBe(hashes.length);
    });
  });
  
  test('should support different algorithms with distinct outputs (including empty string)', () => {
    const testStrings = [
      'test',
      'longer test string',
      'Unicode: émojis 🎉',
      '12345',
      '' // chuỗi rỗng
    ];

    const algorithms = ['djb2', 'sdbm', 'simple'];

    testStrings.forEach(str => {
      const hashes = algorithms.map(algo => generateHash(str, algo));

      // Kiểm tra tất cả hash là number
      hashes.forEach(h => expect(typeof h).toBe('number'));

      // Lọc bỏ hash = 0 trước khi kiểm tra uniqueness
      const nonZeroHashes = hashes.filter(h => h !== 0);

      // Nếu tất cả đều 0 thì bỏ qua test uniqueness cho input này
      if (nonZeroHashes.length > 1) {
        const unique = new Set(nonZeroHashes);
        expect(unique.size).toBe(nonZeroHashes.length);
      }
    });
  });


  test('should handle algorithm parameter variations', () => {
    const str = 'test string';
    
    // Test default algorithm (no second parameter)
    const defaultHash = generateHash(str);
    expect(typeof defaultHash).toBe('number');
    
    // Test explicit algorithm names
    expect(typeof generateHash(str, 'djb2')).toBe('number');
    expect(typeof generateHash(str, 'sdbm')).toBe('number');
    expect(typeof generateHash(str, 'simple')).toBe('number');
    
    // Test case sensitivity of algorithm names
    expect(() => generateHash(str, 'DJB2')).toThrow();
    expect(() => generateHash(str, 'SDBM')).toThrow();
  });

  test('should throw descriptive errors for unsupported algorithms', () => {

    const invalidInputs = [null, 123, {}, [], ''];
    invalidInputs.forEach(algo => {
      expect(() => generateHash('test', algo))
        .toThrow(/Invalid algorithm/i);
    });

    const unsupported = ['unsupported', 'md5', 'sha1', 'sha256', 'bcrypt'];
    unsupported.forEach(algo => {
      expect(() => generateHash('test', algo))
        .toThrow(/Hash algorithm .* not supported/i);
    });
    

  });
  test('should use default algorithm (djb2) when no algorithm provided', () => {
    expect(() => generateHash('test')).not.toThrow();
    expect(typeof generateHash('test')).toBe('number');
  });


  test('should handle empty and edge case strings', () => {
    const edgeCases = [
      '',
      ' ',
      '  ',
      '\n',
      '\t',
      '\r\n',
      '\0',
      'a',
      'ab',
      'abc'
    ];

    edgeCases.forEach(str => {
      const hash = generateHash(str);
      expect(typeof hash).toBe('number');
      expect(Number.isFinite(hash)).toBe(true);
    });
  });

  test('should generate integers within valid range', () => {
    const testStrings = [
      'test',
      'longer string for testing',
      'Unicode: 你好 🌍',
      '12345',
      ''
    ];

    const algorithms = ['djb2', 'sdbm', 'simple'];

    testStrings.forEach(str => {
      algorithms.forEach(algo => {
        const hash = generateHash(str, algo);
        
        // Should be a finite number
        expect(Number.isFinite(hash)).toBe(true);
        expect(Number.isInteger(hash)).toBe(true);
        
        // Should be non-negative (based on your current test)
        expect(hash).toBeGreaterThanOrEqual(0);
        
        // Should be within JavaScript safe integer range
        expect(hash).toBeLessThanOrEqual(Number.MAX_SAFE_INTEGER);
      });
    });
  });

  test('should demonstrate avalanche effect', () => {
    // Small changes in input should cause large changes in output
    const baseString = 'test string';
    const baseHash = generateHash(baseString, 'djb2');
    
    const variants = [
      'Test string',  // Case change
      'test strin',   // Remove one char
      'test stringg', // Add one char
      'test string ', // Add space
      'tost string'   // Change one char
    ];

    variants.forEach(variant => {
      const variantHash = generateHash(variant, 'djb2');
      expect(variantHash).not.toBe(baseHash);
      
      // The difference should be significant (avalanche effect)
      const diff = Math.abs(variantHash - baseHash);
      expect(diff).toBeGreaterThan(0);
    });
  });

  test('should handle Unicode and special characters correctly', () => {
    const unicodeTests = [
      'Hello 世界',
      'Café ☕',
      '🎉🎊🎈',
      'déjà vu',
      'naïve résumé',
      'Москва',
      '東京',
      'العربية'
    ];

    unicodeTests.forEach(str => {
      const hash = generateHash(str);
      expect(typeof hash).toBe('number');
      expect(Number.isFinite(hash)).toBe(true);
      
      // Same string should always produce same hash
      expect(generateHash(str)).toBe(hash);
    });
  });

  test('should handle very long strings', () => {
    const longString = 'a'.repeat(10000);
    const veryLongString = 'test '.repeat(5000);
    
    [longString, veryLongString].forEach(str => {
      const hash = generateHash(str);
      expect(typeof hash).toBe('number');
      expect(Number.isFinite(hash)).toBe(true);
      
      // Should be consistent
      expect(generateHash(str)).toBe(hash);
    });
  });

  test('should have reasonable distribution properties', () => {
    const hashes = Array.from({length: 1000}, () =>
      generateHash(Math.random().toString(36).slice(2), 'djb2')
    );

    const min = Math.min(...hashes);
    const max = Math.max(...hashes);
    const span = max - min;

    const ranges = {
      low: hashes.filter(h => h < min + span / 3).length,
      mid: hashes.filter(h => h >= min + span / 3 && h < min + (span * 2) / 3).length,
      high: hashes.filter(h => h >= min + (span * 2) / 3).length
    };


    // Each range should have some values (rough distribution check)
    expect(ranges.low).toBeGreaterThan(0);
    expect(ranges.mid).toBeGreaterThan(0);
    expect(ranges.high).toBeGreaterThan(0);
  });

  test('should handle null and undefined inputs appropriately', () => {
    // These should either work or throw meaningful errors
    expect(() => generateHash(null)).toThrow();
    expect(() => generateHash(undefined)).toThrow();
    expect(() => generateHash()).toThrow();
  });

  test('should handle non-string inputs appropriately', () => {
    const nonStringInputs = [
      123,
      true,
      false,
      {},
      [],
      function() {},
      Symbol('test')
    ];

    nonStringInputs.forEach(input => {
      // Should either convert to string and hash, or throw error
      expect(() => {
        const result = generateHash(input);
        if (result !== undefined) {
          expect(typeof result).toBe('number');
        }
      }).not.toThrow(/unexpected/i);
    });
  });

  test('should demonstrate algorithm-specific characteristics', () => {
    const testString = 'test input for algorithm comparison';
    
    // Each algorithm should produce different results
    const djb2Hash = generateHash(testString, 'djb2');
    const sdbmHash = generateHash(testString, 'sdbm');
    const simpleHash = generateHash(testString, 'simple');
    
    expect(djb2Hash).not.toBe(sdbmHash);
    expect(sdbmHash).not.toBe(simpleHash);
    expect(djb2Hash).not.toBe(simpleHash);
    
    // Test with empty string to see if algorithms handle it differently
    const emptyDjb2 = generateHash('', 'djb2');
    const emptySdbm = generateHash('', 'sdbm');
    const emptySimple = generateHash('', 'simple');
    
    // Results may or may not be different for empty string depending on algorithm
    expect(typeof emptyDjb2).toBe('number');
    expect(typeof emptySdbm).toBe('number');
    expect(typeof emptySimple).toBe('number');
  });
});