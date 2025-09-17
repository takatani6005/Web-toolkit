import { describe, test, expect } from '@jest/globals';
//import { toSlug } from '../../../src/utils/generate.js';

import {toSlug} from '../../slug/index.js';
describe('generate.js', () => {
  describe('toSlug', () => {
    // Basic functionality tests
    describe('Basic functionality', () => {
      test('should create basic slug from string', () => {
        expect(toSlug('Hello World')).toBe('hello-world');
        expect(toSlug('Test String 123')).toBe('test-string-123');
        expect(toSlug('Simple test')).toBe('simple-test');
      });

      test('should handle single words', () => {
        expect(toSlug('Hello')).toBe('hello');
        expect(toSlug('UPPERCASE')).toBe('uppercase');
        expect(toSlug('123')).toBe('123');
      });

      test('should handle numbers and alphanumeric strings', () => {
        expect(toSlug('Test123')).toBe('test123');
        expect(toSlug('123Test456')).toBe('123test456');
        expect(toSlug('Version 2.0')).toBe('version-2-0');
        expect(toSlug('HTML5 & CSS3')).toBe('html5-css3');
      });
    });

    // Diacritics and special characters
    describe('Diacritics and special characters', () => {
      test('should remove diacritics', () => {
        expect(toSlug('Café & Résumé')).toBe('cafe-resume');
        expect(toSlug('naïve résumé')).toBe('naive-resume');
        expect(toSlug('piñata')).toBe('pinata');
        expect(toSlug('Zürich')).toBe('zurich');
      });

      test('should handle extended Latin characters', () => {
        expect(toSlug('Straße')).toBe('strasse');
        expect(toSlug('Malmö')).toBe('malmo');
        expect(toSlug('São Paulo')).toBe('sao-paulo');
        expect(toSlug('Łódź')).toBe('lodz');
      });

      test('should handle Cyrillic characters', () => {
        expect(toSlug('Москва')).toBe('moskva');
        expect(toSlug('Привет мир')).toBe('privet-mir');
      });

      test('should handle Greek characters', () => {
        expect(toSlug('Αθήνα')).toBe('athena');
        expect(toSlug('Ελλάδα')).toBe('ellada');
      });

      test('should handle punctuation and symbols', () => {
        expect(toSlug('Hello, World!')).toBe('hello-world');
        expect(toSlug('Test@Email.com')).toBe('test-email-com');
        expect(toSlug('Price: $99.99')).toBe('price-99-99');
        expect(toSlug('50% off!')).toBe('50-off');
        expect(toSlug('Question?')).toBe('question');
        expect(toSlug('Exclamation!')).toBe('exclamation');
      });
    });

    // Options testing
    describe('Custom separator option', () => {
      test('should handle custom separator', () => {
        expect(toSlug('Hello World', { separator: '_' })).toBe('hello_world');
        expect(toSlug('Test-String', { separator: '.' })).toBe('test.string');
        expect(toSlug('Multiple Words Here', { separator: '|' })).toBe('multiple|words|here');
      });

      test('should handle empty separator', () => {
        expect(toSlug('Hello World', { separator: '' })).toBe('helloworld');
        expect(toSlug('Test String', { separator: '' })).toBe('teststring');
      });

      test('should handle multi-character separator', () => {
        expect(toSlug('Hello World', { separator: '__' })).toBe('hello__world');
        expect(toSlug('Test String', { separator: '->' })).toBe('test->string');
      });
    });

    describe('Lowercase option', () => {
      test('should respect lowercase option', () => {
        expect(toSlug('Hello World', { lowercase: false })).toBe('Hello-World');
        expect(toSlug('TEST STRING', { lowercase: true })).toBe('test-string');
        expect(toSlug('MixedCase', { lowercase: false })).toBe('MixedCase');
      });

      test('should preserve case with diacritics when lowercase is false', () => {
        expect(toSlug('Café RÉSUMÉ', { lowercase: false })).toBe('Cafe-RESUME');
      });
    });

    describe('Max length option', () => {
      test('should enforce max length', () => {
        const long = 'this is a very long string that should be truncated';
        const result = toSlug(long, { maxLength: 20 });
        expect(result.length).toBeLessThanOrEqual(20);
        expect(result.endsWith('-')).toBe(false);
      });

      test('should truncate at word boundaries when possible', () => {
        const result = toSlug('hello world test', { maxLength: 11 });
        expect(result.length).toBeLessThanOrEqual(11);
        expect(result).toBe('hello-world');
      });

      test('should handle maxLength shorter than first word', () => {
        const result = toSlug('supercalifragilisticexpialidocious', { maxLength: 5 });
        expect(result.length).toBeLessThanOrEqual(5);
        expect(result).toBe('super');
      });

      test('should handle maxLength of 0', () => {
        expect(toSlug('Hello World', { maxLength: 0 })).toBe('');
      });

      test('should handle maxLength with custom separator', () => {
        const result = toSlug('hello world test', { maxLength: 13, separator: '_' });
        expect(result.length).toBeLessThanOrEqual(13);
        expect(result).toBe('hello_world');
      });
    });

    describe('Strict mode option', () => {
      test('should handle strict mode', () => {
        expect(toSlug('Hello@World!', { strict: true })).toBe('helloworld');
        expect(toSlug('Hello@World!', { strict: false })).toBe('hello-world');
      });

      test('should remove all non-alphanumeric in strict mode', () => {
        expect(toSlug('Test$%^&*()String', { strict: true })).toBe('teststring');
        expect(toSlug('Hello-World_Test', { strict: true })).toBe('helloworldtest');
      });

      test('should preserve separators in non-strict mode', () => {
        expect(toSlug('Hello@#$World', { strict: false })).toBe('hello-world');
        expect(toSlug('Test___String', { strict: false })).toBe('test-string');
      });
    });

    // Edge cases and error handling
    describe('Edge cases', () => {
      test('should handle empty and whitespace strings', () => {
        expect(toSlug('')).toBe('');
        expect(toSlug(' ')).toBe('');
        expect(toSlug('   ')).toBe('');
        expect(toSlug('\t\n\r')).toBe('');
      });

      test('should handle strings with only separators', () => {
        expect(toSlug('---')).toBe('');
        expect(toSlug('___', { separator: '_' })).toBe('');
        expect(toSlug('...')).toBe('');
      });

      test('should handle single character strings', () => {
        expect(toSlug('a')).toBe('a');
        expect(toSlug('A')).toBe('a');
        expect(toSlug('1')).toBe('1');
        expect(toSlug('@')).toBe('');
      });

      test('should handle strings with leading/trailing spaces', () => {
        expect(toSlug('  Hello World  ')).toBe('hello-world');
        expect(toSlug('\t\nTest\t\n')).toBe('test');
      });

      test('should handle null and undefined inputs', () => {
        expect(toSlug(null)).toBe('');
        expect(toSlug(undefined)).toBe('');
      });

      test('should handle non-string inputs', () => {
        expect(toSlug(123)).toBe('123');
        expect(toSlug(true)).toBe('true');
        expect(toSlug(false)).toBe('false');
        expect(toSlug({})).toBe('object-object');
      });
    });

    describe('Separator handling', () => {
      test('should remove duplicate separators', () => {
        expect(toSlug('Hello   World')).toBe('hello-world');
        expect(toSlug('Test--String')).toBe('test-string');
        expect(toSlug('Multiple---Dashes')).toBe('multiple-dashes');
      });

      test('should handle mixed separators', () => {
        expect(toSlug('Hello_World-Test')).toBe('hello-world-test');
        expect(toSlug('Test.String_Here')).toBe('test-string-here');
      });

      test('should remove leading and trailing separators', () => {
        expect(toSlug('-Hello World-')).toBe('hello-world');
        expect(toSlug('__Test String__', { separator: '_' })).toBe('test_string');
      });
    });

    // Unicode and international text
    describe('Unicode handling', () => {
      test('should handle CJK characters', () => {
        expect(toSlug('你好世界')).toBe('ni-hao-shi-jie');
        expect(toSlug('こんにちは')).toBe('konnichiwa');
        expect(toSlug('안녕하세요')).toBe('annyeonghaseyo');
      });

      test('should handle Arabic text', () => {
        expect(toSlug('مرحبا بالعالم')).toBe('mrhba-balaalm');
      });

      test('should handle Hebrew text', () => {
        expect(toSlug('שלום עולם')).toBe('shlwm-awlm');
      });

      test('should handle mixed scripts', () => {
        expect(toSlug('Hello 世界 مرحبا')).toBe('hello-shi-jie-mrhba');
      });

      test('should handle emojis and symbols', () => {
        expect(toSlug('Hello 👋 World 🌍')).toBe('hello-world');
        expect(toSlug('Test ❤️ String')).toBe('test-string');
      });
    });

    // Complex combinations
    describe('Complex option combinations', () => {
      test('should combine multiple options correctly', () => {
        expect(toSlug('Hello@World!', {
          separator: '_',
          lowercase: false,
          strict: true,
          maxLength: 10
        })).toBe('HelloWorld');
      });

      test('should handle all options with international text', () => {
        expect(toSlug('Café & Résumé Test', {
          separator: '.',
          lowercase: false,
          strict: false,
          maxLength: 15
        })).toBe('Cafe.Resume');
      });

      test('should handle strict mode with custom separator', () => {
        expect(toSlug('Test@String#Here', {
          separator: '__',
          strict: true
        })).toBe('teststringhere');
      });
    });

    // Performance and large input tests
    describe('Performance tests', () => {
      test('should handle very long strings efficiently', () => {
        const longString = 'a'.repeat(10000);
        const result = toSlug(longString, { maxLength: 100 });
        expect(result.length).toBeLessThanOrEqual(100);
      });

      test('should handle strings with many special characters', () => {
        const specialString = 'a@#$%^&*()b'.repeat(100);
        const result = toSlug(specialString);
        // The result should be 'a-b' repeated, with proper handling of the pattern
        expect(result.startsWith('a-b')).toBe(true);
        expect(result.length).toBeGreaterThan(0);
      });
    });

    // Regression tests
    describe('Regression tests', () => {
      test('should not create empty slugs from valid input', () => {
        expect(toSlug('Test')).not.toBe('');
        expect(toSlug('123')).not.toBe('');
        expect(toSlug('a b')).not.toBe('');
      });

      test('should maintain consistency with repeated calls', () => {
        const input = 'Test String 123';
        const result1 = toSlug(input);
        const result2 = toSlug(input);
        expect(result1).toBe(result2);
      });

      test('should handle URL-like strings correctly', () => {
        expect(toSlug('https://example.com/path')).toBe('https-example-com-path');
        expect(toSlug('www.test-site.com')).toBe('www-test-site-com');
      });

      test('should handle file names correctly', () => {
        expect(toSlug('document.pdf')).toBe('document-pdf');
        expect(toSlug('my_file_v2.1.txt')).toBe('my-file-v2-1-txt');
      });
    });

    // Boundary value testing
    describe('Boundary value tests', () => {
      test('should handle maxLength boundary values', () => {
        expect(toSlug('test', { maxLength: 4 })).toBe('test');
        expect(toSlug('test', { maxLength: 3 })).toBe('tes');
        expect(toSlug('test', { maxLength: 1 })).toBe('t');
      });

      test('should handle separator at boundaries', () => {
        expect(toSlug('a-b', { maxLength: 3 })).toBe('a-b');
        expect(toSlug('a-b-c', { maxLength: 3 })).toBe('a-b');
      });
    });
  });
});