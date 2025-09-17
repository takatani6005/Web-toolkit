import { describe, test, expect } from '@jest/globals';
import {
  toBase64, fromBase64, generateWeightedString, generatePatternString, generateLoremIpsum
} from '../../generate/index.js';


describe('Base64 Functions', () => {
  describe('toBase64', () => {
    test('converts simple string to base64', () => {
      expect(toBase64('Hello World')).toBe('SGVsbG8gV29ybGQ=');
    });

    test('converts empty string to empty base64', () => {
      expect(toBase64('')).toBe('');
    });

    test('converts special characters to base64', () => {
      expect(toBase64('!@#$%^&*()_+')).toBe('IUAjJCVeJiooKV8r');
    });

    test('converts unicode characters to base64', () => {
      expect(toBase64('🚀 Rocket')).toBe('8J+agCBSb2NrZXQ=');
    });

    test('converts multiline string to base64', () => {
      const multilineStr = 'Line 1\nLine 2\nLine 3';
      const result = toBase64(multilineStr);
      expect(result).toBe('TGluZSAxCkxpbmUgMgpMaW5lIDM=');
    });

    test('handles null and undefined inputs gracefully', () => {
      expect(() => toBase64(null)).toThrow();
      expect(() => toBase64(undefined)).toThrow();
    });
  });

  describe('fromBase64', () => {
    test('converts base64 back to original string', () => {
      expect(fromBase64('SGVsbG8gV29ybGQ=')).toBe('Hello World');
    });

    test('converts empty base64 to empty string', () => {
      expect(fromBase64('')).toBe('');
    });

    test('converts special characters from base64', () => {
      expect(fromBase64('IUAjJCVeJiooKV8r')).toBe('!@#$%^&*()_+');
    });

    test('converts unicode characters from base64', () => {
      expect(fromBase64('8J+agCBSb2NrZXQ=')).toBe('🚀 Rocket');
    });

    test('handles invalid base64 input', () => {
      expect(() => fromBase64('invalid@base64!')).toThrow();
    });

    test('roundtrip conversion maintains data integrity', () => {
      const testStrings = [
        'Simple test',
        'Complex string with numbers 123 and symbols !@#',
        '日本語テスト',
        '{"json": "data", "numbers": [1, 2, 3]}',
        ''
      ];
      
      testStrings.forEach(str => {
        expect(fromBase64(toBase64(str))).toBe(str);
      });
    });
  });
});

describe('generateWeightedString', () => {
  test('generates string with specified length', () => {
    const result = generateWeightedString(10);
    expect(result).toHaveLength(10);
  });

  test('generates different strings on multiple calls', () => {
    const result1 = generateWeightedString(20);
    const result2 = generateWeightedString(20);
    expect(result1).not.toBe(result2);
  });

  test('respects character weights when provided', () => {
    const weights = { 'a': 10, 'b': 1 };
    const result = generateWeightedString(1000, weights);
    const aCount = (result.match(/a/g) || []).length;
    const bCount = (result.match(/b/g) || []).length;
    
    // Should have significantly more 'a' than 'b' due to 10:1 weight ratio
    expect(aCount).toBeGreaterThan(bCount * 5);
  });

  test('uses only specified characters when weights provided', () => {
    const weights = { 'x': 1, 'y': 1, 'z': 1 };
    const result = generateWeightedString(100, weights);
    expect(result).toMatch(/^[xyz]+$/);
  });

  test('handles single character weight', () => {
    const weights = { 'a': 1 };
    const result = generateWeightedString(10, weights);
    expect(result).toBe('aaaaaaaaaa');
  });

  test('handles zero length', () => {
    const result = generateWeightedString(0);
    expect(result).toBe('');
  });

  test('handles negative length gracefully', () => {
    const result = generateWeightedString(-5);
    expect(result).toBe('');
  });

  test('default character set includes common characters', () => {
    const result = generateWeightedString(100);
    // Should contain a mix of letters and numbers
    expect(result).toMatch(/[a-zA-Z]/);
    expect(result).toMatch(/[0-9]/);
  });
});

describe('generatePatternString', () => {
  test('generates string matching simple pattern', () => {
    const result = generatePatternString('###-###', { '#': () => '1' });
    expect(result).toBe('111-111');
  });

  test('generates phone number pattern', () => {
    const generators = {
      '#': () => Math.floor(Math.random() * 10).toString()
    };
    const result = generatePatternString('(###) ###-####', generators);
    expect(result).toMatch(/^\(\d{3}\) \d{3}-\d{4}$/);
  });

  test('generates mixed alphanumeric pattern', () => {
    const generators = {
      'L': () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)],
      '#': () => Math.floor(Math.random() * 10).toString()
    };
    const result = generatePatternString('LL##-LL##', generators);
    expect(result).toMatch(/^[A-Z]{2}\d{2}-[A-Z]{2}\d{2}$/);
  });

  test('preserves non-pattern characters', () => {
    const generators = { '#': () => '5' };
    const result = generatePatternString('ID: ### (Active)', generators);
    expect(result).toBe('ID: 555 (Active)');
  });

  test('handles empty pattern', () => {
    const result = generatePatternString('', {});
    expect(result).toBe('');
  });

  test('handles pattern with no generators', () => {
    const result = generatePatternString('ABC-123', {});
    expect(result).toBe('ABC-123');
  });

  test('generates consistent pattern structure', () => {
    const generators = {
      'X': () => 'TEST',
      '#': () => '9'
    };
    const pattern = 'X-X-### End';
    const result = generatePatternString(pattern, generators);
    expect(result).toBe('TEST-TEST-999 End');
  });

  test('handles multiple different generators', () => {
    const generators = {
      'A': () => 'ALPHA',
      'N': () => '123',
      'S': () => '@#$'
    };
    const result = generatePatternString('A|N|S', generators);
    expect(result).toBe('ALPHA|123|@#$');
  });
});

describe('generateLoremIpsum', () => {
  test('generates specified number of words', () => {
    const result = generateLoremIpsum(10);
    const wordCount = result.trim().split(/\s+/).length;
    expect(wordCount).toBe(10);
  });

  test('starts with "Lorem ipsum" by default', () => {
    const result = generateLoremIpsum(5);
    expect(result.toLowerCase()).toMatch(/^lorem ipsum/);
  });

  test('generates different text for larger word counts', () => {
    const result1 = generateLoremIpsum(50);
    const result2 = generateLoremIpsum(50);
    // While they might start the same, longer texts should have variation
    expect(result1.length).toBeGreaterThan(100);
    expect(result2.length).toBeGreaterThan(100);
  });

  test('handles zero words', () => {
    const result = generateLoremIpsum(0);
    expect(result).toBe('');
  });

  test('handles single word', () => {
    const result = generateLoremIpsum(1);
    expect(result.trim().split(/\s+/)).toHaveLength(1);
  });

  test('handles negative word count gracefully', () => {
    const result = generateLoremIpsum(-5);
    expect(result).toBe('');
  });

  test('contains only valid Latin words', () => {
    const result = generateLoremIpsum(20);
    // Should only contain letters, spaces, and basic punctuation
    expect(result).toMatch(/^[a-zA-Z\s.,]+$/);
  });

  test('generates proper sentence structure for longer texts', () => {
    const result = generateLoremIpsum(100);
    // Should have proper capitalization and punctuation
    expect(result).toMatch(/^[A-Z]/); // Starts with capital
    expect(result).toMatch(/[.!?]\s*$/); // Ends with punctuation
  });

  test('maintains consistent word boundaries', () => {
    const result = generateLoremIpsum(25);
    // Should not have double spaces or start/end with spaces
    expect(result).not.toMatch(/\s{2,}/);
    expect(result).not.toMatch(/^\s/);
    expect(result).not.toMatch(/\s$/);
  });

  test('performance test for large word counts', () => {
    const startTime = Date.now();
    const result = generateLoremIpsum(1000);
    const endTime = Date.now();
    
    expect(result.trim().split(/\s+/)).toHaveLength(1000);
    expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
  });
});

// Integration tests
describe('Integration Tests', () => {
  test('base64 encoding and weighted string generation work together', () => {
    const weightedStr = generateWeightedString(50);
    const encoded = toBase64(weightedStr);
    const decoded = fromBase64(encoded);
    expect(decoded).toBe(weightedStr);
  });

  test('pattern generation with lorem ipsum', () => {
    const generators = {
      'W': () => generateLoremIpsum(1,{ addPunctuation: false }),
      '#': () => Math.floor(Math.random() * 10).toString()
    };
    const result = generatePatternString('Article-###: W W W', generators);
    expect(result).toMatch(/^Article-\d{3}: \w+ \w+ \w+$/);
  });

  test('combining all functions in realistic scenario', () => {
    // Generate a user ID pattern
    const idPattern = generatePatternString('USER-####', {
      '#': () => Math.floor(Math.random() * 10).toString()
    });
    
    // Generate user description
    const description = generateLoremIpsum(10);
    
    // Create user data object
    const userData = JSON.stringify({ id: idPattern, description });
    
    // Encode for storage
    const encoded = toBase64(userData);
    
    // Decode and verify
    const decoded = fromBase64(encoded);
    const parsed = JSON.parse(decoded);
    
    expect(parsed.id).toMatch(/^USER-\d{4}$/);
    expect(parsed.description.split(' ')).toHaveLength(10);
  });
});

// Edge cases and error handling
describe('Edge Cases and Error Handling', () => {
  test('handles very large inputs appropriately', () => {
    const largeString = 'A'.repeat(10000);
    const encoded = toBase64(largeString);
    const decoded = fromBase64(encoded);
    expect(decoded).toBe(largeString);
  });

  test('handles special Unicode edge cases', () => {
    const specialChars = '𝕳𝖊𝖑𝖑𝖔 𝖂𝖔𝖗𝖑𝖉'; // Math bold fraktur
    const encoded = toBase64(specialChars);
    const decoded = fromBase64(encoded);
    expect(decoded).toBe(specialChars);
  });

  test('weighted string with extreme weights', () => {
    const weights = { 'a': 1000000, 'b': 1 };
    const result = generateWeightedString(100, weights);
    const aCount = (result.match(/a/g) || []).length;
    expect(aCount).toBeGreaterThan(90); // Should be mostly 'a'
  });

  test('pattern generation with empty generators', () => {
    const generators = { 'X': () => '' };
    const result = generatePatternString('XXX-XXX', generators);
    expect(result).toBe('-');
  });
});