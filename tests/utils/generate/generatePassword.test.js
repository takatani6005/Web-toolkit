import { describe, test, expect } from '@jest/globals';
import {

  generatePassword
} from '../../src/utils/generate.js';


  describe('generatePassword', () => {
    test('should generate password of specified length', () => {
      expect(generatePassword({ length: 12 })).toHaveLength(12);
      expect(generatePassword({ length: 20 })).toHaveLength(20);
    });

    test('should include different character types', () => {
      const password = generatePassword({
        length: 50,
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: true
      });
      
      expect(password).toMatch(/[A-Z]/); // Has uppercase
      expect(password).toMatch(/[a-z]/); // Has lowercase  
      expect(password).toMatch(/\d/);    // Has numbers
      expect(password).toMatch(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/); // Has symbols
    });

    test('should exclude similar characters when requested', () => {
      const password = generatePassword({
        length: 100,
        excludeSimilar: true,
        includeSymbols: false
      });
      
      expect(password).not.toMatch(/[0O1lI]/);
    });

    test('should throw error when no character types selected', () => {
      expect(() => generatePassword({
        includeUppercase: false,
        includeLowercase: false,
        includeNumbers: false,
        includeSymbols: false
      })).toThrow('At least one character type must be included');
    });

    test('should use custom symbols', () => {
      const password = generatePassword({
        length: 50,
        includeSymbols: true,
        customSymbols: '!@#',
        includeUppercase: false,
        includeLowercase: false,
        includeNumbers: false
      });
      
      expect(password).toMatch(/^[!@#]+$/);
    });
  });
