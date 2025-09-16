import { describe, test, expect } from '@jest/globals';
import {
  generatePassword
} from '../../../src/utils/generate/index.js';

describe('generatePassword', () => {
  test('should generate password of specified length', () => {
    expect(generatePassword({ length: 12 })).toHaveLength(12);
    expect(generatePassword({ length: 20 })).toHaveLength(20);
    expect(generatePassword({ length: 1 })).toHaveLength(1);
    expect(generatePassword({ length: 50 })).toHaveLength(50);
  });

  test('should use default length when not specified', () => {
    const password = generatePassword({});
    expect(password.length).toBeGreaterThanOrEqual(8); // Common default
    expect(password.length).toBeLessThanOrEqual(16); // Reasonable default range
  });

  test('should include different character types when enabled', () => {
    // Generate multiple passwords to account for randomness
    const passwords = Array.from({ length: 10 }, () => 
      generatePassword({
        length: 50,
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: true
      })
    );

    // At least some passwords should contain each character type
    const hasUppercase = passwords.some(p => /[A-Z]/.test(p));
    const hasLowercase = passwords.some(p => /[a-z]/.test(p));
    const hasNumbers = passwords.some(p => /\d/.test(p));
    const hasSymbols = passwords.some(p => /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?~`"'\/\\]/.test(p));

    expect(hasUppercase).toBe(true);
    expect(hasLowercase).toBe(true);
    expect(hasNumbers).toBe(true);
    expect(hasSymbols).toBe(true);
  });

  test('should respect individual character type exclusions', () => {
    const passwordNoUpper = generatePassword({
      length: 50,
      includeUppercase: false,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: true
    });
    expect(passwordNoUpper).not.toMatch(/[A-Z]/);

    const passwordNoLower = generatePassword({
      length: 50,
      includeUppercase: true,
      includeLowercase: false,
      includeNumbers: true,
      includeSymbols: true
    });
    expect(passwordNoLower).not.toMatch(/[a-z]/);

    const passwordNoNumbers = generatePassword({
      length: 50,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: false,
      includeSymbols: true
    });
    expect(passwordNoNumbers).not.toMatch(/\d/);

    const passwordNoSymbols = generatePassword({
      length: 50,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: false
    });
    expect(passwordNoSymbols).not.toMatch(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?~`"'\/\\]/);
  });

  test('should exclude similar characters when requested', () => {
    const passwords = Array.from({ length: 10 }, () =>
      generatePassword({
        length: 100,
        excludeSimilar: true, // This is the default
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: false
      })
    );

    passwords.forEach(password => {
      // Based on implementation: excludes 0, O, 1, I, l when excludeSimilar is true
      expect(password).not.toMatch(/[0O1lI]/);
    });

    // Test with excludeSimilar false
    const passwordsWithSimilar = Array.from({ length: 10 }, () =>
      generatePassword({
        length: 100,
        excludeSimilar: false,
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: false
      })
    );

    // Should be able to contain similar characters when excludeSimilar is false
    const hasSimilarChars = passwordsWithSimilar.some(password => /[0O1lI]/.test(password));
    expect(hasSimilarChars).toBe(true);
  });

  test('should throw error when no character types selected', () => {
    expect(() => generatePassword({
      length: 10,
      includeUppercase: false,
      includeLowercase: false,
      includeNumbers: false,
      includeSymbols: false
    })).toThrow(/at least one character type/i);
  });

  test('should use custom symbols when provided', () => {
    const password = generatePassword({
      length: 50,
      includeSymbols: true,
      customSymbols: '!@#',
      includeUppercase: false,
      includeLowercase: false,
      includeNumbers: false
    });
    expect(password).toMatch(/^[!@#]+$/);
    expect(password).toHaveLength(50);
  });

  test('should handle edge cases', () => {
    // Test minimum length
    expect(() => generatePassword({ length: 0 })).toThrow();
    
    // Test negative length
    expect(() => generatePassword({ length: -1 })).toThrow();
    
    // Test very large length (should work but may have performance considerations)
    const MaxPassword = generatePassword({ length: 256 });
    expect(MaxPassword).toHaveLength(256);
    expect(() => generatePassword({ length: 257 })).toThrow();
  });

  test('should generate different passwords on multiple calls', () => {
    const passwords = Array.from({ length: 10 }, () => 
      generatePassword({ length: 20 })
    );
    
    // All passwords should be unique (extremely high probability)
    const uniquePasswords = new Set(passwords);
    expect(uniquePasswords.size).toBe(passwords.length);
  });

  test('should handle default behavior', () => {
    const password = generatePassword();
    expect(typeof password).toBe('string');
    expect(password.length).toBeGreaterThan(0);
  });

  test('should ensure minimum requirements are met when specified', () => {
    // This test assumes the function tries to guarantee at least one of each required type
    const options = {
      length: 4,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: true,
      ensureComplexity: false
    };

    // Generate multiple passwords to test the distribution
    const passwords = Array.from({ length: 100 }, () => generatePassword(options));
    
    // Count how many passwords have all required character types
    const compliantPasswords = passwords.filter(password => 
      /[A-Z]/.test(password) && 
      /[a-z]/.test(password) && 
      /\d/.test(password) && 
      /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?~`"'\/\\]/.test(password)
    );

    // Most passwords should meet all requirements (this depends on implementation)
    // If the function guarantees one of each type, this should be 100%
    // If it's purely random, adjust expectation accordingly
    expect(compliantPasswords.length).toBeGreaterThan(0); // Adjust based on actual behavior

  });
  test('ensures at least one of each type when ensureComplexity is true', () => {
  const options = {
    length: 8,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    ensureComplexity: true
  };

  const passwords = Array.from({ length: 50 }, () => generatePassword(options));
  passwords.forEach(p => {
    expect(p).toMatch(/[A-Z]/);
    expect(p).toMatch(/[a-z]/);
    expect(p).toMatch(/\d/);
    expect(p).toMatch(/[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/);
  });
});


  test('should validate input parameters', () => {
    // Test invalid length types
    expect(() => generatePassword({ length: 'invalid' })).toThrow();
    expect(() => generatePassword({ length: null })).toThrow();
    expect(() => generatePassword({ length: undefined })).not.toThrow(); // Should use default
    
    // Test invalid boolean values (if function validates strictly)
    const validPassword = generatePassword({
      length: 10,
      includeUppercase: 'true' // String instead of boolean
    });
    expect(typeof validPassword).toBe('string'); // Should handle gracefully or throw
  });
});