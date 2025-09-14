import { describe, test, expect } from '@jest/globals';
import {
  generateTestData
} from '../../src/utils/generate.js';

  describe('generateTestData', () => {
    test('should generate single email', () => {
      const email = generateTestData('email');
      expect(email).toMatch(/^[^@]+@[^@]+\.[^@]+$/);
    });

    test('should generate multiple emails', () => {
      const emails = generateTestData('email', 3);
      expect(emails).toHaveLength(3);
      emails.forEach(email => {
        expect(email).toMatch(/^[^@]+@[^@]+\.[^@]+$/);
      });
    });

    test('should generate valid URLs', () => {
      const url = generateTestData('url');
      expect(url).toMatch(/^https?:\/\//);
    });

    test('should generate phone numbers', () => {
      const phone = generateTestData('phone');
      expect(typeof phone).toBe('string');
      expect(phone).toMatch(/[\d\-\(\)\.\+\s]/);
    });

    test('should generate names', () => {
      const name = generateTestData('name');
      expect(name).toMatch(/^\w+ \w+$/);
    });

    test('should generate dates', () => {
      const date = generateTestData('date');
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(new Date(date)).toBeInstanceOf(Date);
    });

    test('should generate colors', () => {
      const color = generateTestData('color');
      expect(color).toMatch(/^#[0-9A-F]{6}$/i);
    });

    test('should throw error for unsupported type', () => {
      expect(() => generateTestData('unsupported')).toThrow("Test data type 'unsupported' not supported");
    });
  });