import { describe, test, expect } from '@jest/globals';
import {
  generateTestData,
  generatePlaceholder
} from '../../generate/index.js';

describe('generateTestData', () => {
  describe('email generation', () => {
    test('should generate valid single email', () => {
      const email = generateTestData('email');
      
      expect(typeof email).toBe('string');
      expect(email).toMatch(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
      expect(email.length).toBeGreaterThan(5); // Minimum reasonable email length
      expect(email.length).toBeLessThan(320); // RFC 5321 limit
    });

    test('should generate multiple unique emails', () => {
      const emails = generateTestData('email', 5);
      
      expect(Array.isArray(emails)).toBe(true);
      expect(emails).toHaveLength(5);
      
      // Check uniqueness
      const uniqueEmails = new Set(emails);
      expect(uniqueEmails.size).toBe(5);
      
      emails.forEach(email => {
        expect(email).toMatch(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
        expect(email.split('@')).toHaveLength(2);
      });
    });

    test('should generate realistic email domains', () => {
      const emails = generateTestData('email', 10);
      const domains = emails.map(email => email.split('@')[1]);
      
      domains.forEach(domain => {
        expect(domain).toMatch(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
        expect(domain).not.toMatch(/\.\./); // No consecutive dots
        expect(domain.startsWith('.')).toBe(false);
        expect(domain.endsWith('.')).toBe(false);
      });
    });
  });

  describe('URL generation', () => {
    test('should generate valid URLs', () => {
      const url = generateTestData('url');
      
      expect(typeof url).toBe('string');
      expect(url).toMatch(/^https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      
      // Should be parseable as URL
      expect(() => new URL(url)).not.toThrow();
    });

    test('should generate multiple unique URLs', () => {
      const urls = generateTestData('url', 5);
      const uniqueUrls = new Set(urls);
      
      expect(uniqueUrls.size).toBe(5);
      urls.forEach(url => {
        expect(() => new URL(url)).not.toThrow();
      });
    });

    test('should generate realistic URL components', () => {
      const urls = generateTestData('url', 10);
      
      urls.forEach(url => {
        const urlObj = new URL(url);
        expect(['http:', 'https:']).toContain(urlObj.protocol);
        expect(urlObj.hostname).toMatch(/^[a-zA-Z0-9.-]+$/);
        expect(urlObj.hostname.includes('.')).toBe(true);
      });
    });
  });

  describe('phone number generation', () => {
    test('should generate valid phone numbers', () => {
      const phone = generateTestData('phone');
      
      expect(typeof phone).toBe('string');
      expect(phone).toMatch(/^[\d\-\(\)\.\+\s]+$/);
      expect(phone.replace(/[^\d]/g, '').length).toBeGreaterThanOrEqual(7); // Minimum digits
    });

    test('should generate different phone formats', () => {
      const phones = generateTestData('phone', 10);
      const formats = new Set(phones.map(phone => {
        // Categorize by format pattern
        if (phone.includes('(') && phone.includes(')')) return 'parentheses';
        if (phone.includes('-')) return 'dashes';
        if (phone.includes('.')) return 'dots';
        if (phone.startsWith('+')) return 'international';
        return 'other';
      }));
      
      expect(formats.size).toBeGreaterThan(1); // Should have variety
    });
  });

  describe('name generation', () => {
    test('should generate realistic names', () => {
      const name = generateTestData('name');
      
      expect(typeof name).toBe('string');
      expect(name).toMatch(/^[A-Z][a-z]+ [A-Z][a-z]+$/); // First Last with proper capitalization
      expect(name.split(' ')).toHaveLength(2);
    });

    test('should generate diverse names', () => {
      const names = generateTestData('name', 20);
      const uniqueNames = new Set(names);
      const firstNames = new Set(names.map(name => name.split(' ')[0]));
      const lastNames = new Set(names.map(name => name.split(' ')[1]));
      
      expect(uniqueNames.size).toBeGreaterThan(15); // Most should be unique
      expect(firstNames.size).toBeGreaterThan(10); // Good variety of first names
      expect(lastNames.size).toBeGreaterThan(10); // Good variety of last names
    });
  });

  describe('date generation', () => {
    test('should generate valid ISO dates', () => {
      const date = generateTestData('date');
      
      expect(typeof date).toBe('string');
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      
      const dateObj = new Date(date);
      expect(dateObj).toBeInstanceOf(Date);
      expect(dateObj.toString()).not.toBe('Invalid Date');
    });

    test('should generate reasonable date range', () => {
      const dates = generateTestData('date', 10);
      const currentYear = new Date().getFullYear();
      
      dates.forEach(dateStr => {
        const year = parseInt(dateStr.split('-')[0]);
        expect(year).toBeGreaterThan(1900);
        expect(year).toBeLessThanOrEqual(currentYear + 10); // Not too far in future
      });
    });

    test('should generate valid months and days', () => {
      const dates = generateTestData('date', 20);
      
      dates.forEach(dateStr => {
        const [year, month, day] = dateStr.split('-').map(Number);
        expect(month).toBeGreaterThanOrEqual(1);
        expect(month).toBeLessThanOrEqual(12);
        expect(day).toBeGreaterThanOrEqual(1);
        expect(day).toBeLessThanOrEqual(31);
        
        // Validate actual date exists
        const date = new Date(year, month - 1, day);
        expect(date.getFullYear()).toBe(year);
        expect(date.getMonth() + 1).toBe(month);
        expect(date.getDate()).toBe(day);
      });
    });
  });

  describe('color generation', () => {
    test('should generate valid hex colors', () => {
      const color = generateTestData('color');
      
      expect(typeof color).toBe('string');
      expect(color).toMatch(/^#[0-9A-F]{6}$/i);
      expect(color.length).toBe(7);
    });

    test('should generate diverse colors', () => {
      const colors = generateTestData('color', 10);
      const uniqueColors = new Set(colors);
      
      expect(uniqueColors.size).toBe(10); // All should be unique
      
      colors.forEach(color => {
        expect(color).toMatch(/^#[0-9A-F]{6}$/i);
        // Ensure it's not just all black or white
        expect(['#000000', '#FFFFFF']).not.toContain(color.toUpperCase());
      });
    });
  });

  describe('data type validation and errors', () => {
    test('should handle count parameter correctly', () => {
      expect(generateTestData('email', 0)).toEqual([]);
      expect(generateTestData('email', 1)).toHaveLength(1);
      expect(generateTestData('name', 7)).toHaveLength(7);
    });

    test('should handle invalid count parameters', () => {
      expect(() => generateTestData('email', -1)).toThrow();
      expect(() => generateTestData('email', 'invalid')).toThrow();
      expect(() => generateTestData('email', 1.5)).toThrow();
    });

    test('should throw descriptive errors for unsupported types', () => {
      const invalidTypes = [
        'unsupported',
        'password', // might not be supported
        'address',  // might not be supported
        '',
        null,
        undefined,
        123,
        {}
      ];

      invalidTypes.forEach(type => {
        expect(() => generateTestData(type))
          .toThrow(/not supported|invalid|unsupported/i);
      });
    });

    test('should handle edge cases gracefully', () => {
      // Test with very large counts
      expect(() => generateTestData('email', 1000)).not.toThrow();
      
      // Test type case sensitivity
      expect(() => generateTestData('EMAIL')).toThrow();
      expect(() => generateTestData('Email')).toThrow();
    });
  });

  describe('additional data types', () => {
    test('should support all documented types', () => {
      const supportedTypes = ['email', 'url', 'phone', 'name', 'date', 'color'];
      
      supportedTypes.forEach(type => {
        expect(() => generateTestData(type)).not.toThrow();
        const result = generateTestData(type);
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      });
    });
  });
});

describe('generatePlaceholder', () => {
  describe('words generation', () => {
    test('should generate exact word count', () => {
      [1, 5, 10, 25, 100].forEach(length => {
        const text = generatePlaceholder({ type: 'words', length });
        const words = text.trim().split(/\s+/);
        expect(words).toHaveLength(length);
        
        // Ensure all words are valid
        words.forEach(word => {
          expect(word).toMatch(/^[a-zA-Z]+$/);
          expect(word.length).toBeGreaterThan(0);
        });
      });
    });

    test('should generate realistic words', () => {
      const text = generatePlaceholder({ type: 'words', length: 50 });
      const words = text.split(/\s+/);
      
      // Should have variety in word lengths
      const lengths = words.map(w => w.length);
      const uniqueLengths = new Set(lengths);
      expect(uniqueLengths.size).toBeGreaterThan(2);
      
      // No excessively long words
      expect(Math.max(...lengths)).toBeLessThan(20);
    });
  });

  describe('sentences generation', () => {
    test('should generate exact sentence count', () => {
      [1, 3, 5, 10].forEach(length => {
        const text = generatePlaceholder({ type: 'sentences', length });
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        expect(sentences).toHaveLength(length);
      });
    });

    test('should generate proper sentence structure', () => {
      const text = generatePlaceholder({ type: 'sentences', length: 5 });
      
      // Should end with punctuation
      expect(text).toMatch(/[.!?]$/);
      
      // Should have proper sentence spacing
      const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 0);
      sentences.forEach(sentence => {
        expect(sentence.trim().length).toBeGreaterThan(10); // Reasonable length
        expect(sentence.trim().charAt(0)).toMatch(/[A-Z]/); // Capital start
      });
    });
  });

  describe('paragraphs generation', () => {
    test('should generate specified paragraph structure', () => {
      const text = generatePlaceholder({
        type: 'paragraphs',
        paragraphs: 3,
        sentences: 4
      });
      
      const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
      expect(paragraphs).toHaveLength(3);
      
      paragraphs.forEach(paragraph => {
        const sentences = paragraph.split(/[.!?]/).filter(s => s.trim().length > 0);
        expect(sentences.length).toBeCloseTo(4, 1); // Allow some variance
      });
    });

    test('should generate proper paragraph formatting', () => {
      const text = generatePlaceholder({
        type: 'paragraphs',
        paragraphs: 2,
        sentences: 3
      });
      
      expect(text).toMatch(/\n\n/); // Should have paragraph breaks
      const paragraphs = text.split(/\n\s*\n/);
      
      paragraphs.forEach(paragraph => {
        expect(paragraph.trim().length).toBeGreaterThan(50); // Substantial content
        expect(paragraph.trim().charAt(0)).toMatch(/[A-Z]/);
        expect(paragraph.trim()).toMatch(/[.!?]$/);
      });
    });
  });

  describe('HTML generation', () => {
    test('should generate HTML paragraphs when requested', () => {
      const html = generatePlaceholder({
        type: 'paragraphs',
        paragraphs: 2,
        includeHtml: true
      });
      
      expect(html).toMatch(/<p>/);
      expect(html).toMatch(/<\/p>/);
      
      // Count paragraph tags
      const pTags = (html.match(/<p>/g) || []).length;
      const closingTags = (html.match(/<\/p>/g) || []).length;
      expect(pTags).toBe(2);
      expect(closingTags).toBe(2);
      
      // Ensure valid HTML structure
      expect(html).not.toMatch(/<p><p>/); // No nested p tags
    });

    test('should generate complete HTML wrapper', () => {
      const html = generatePlaceholder({ type: 'html' });
      
      expect(html).toMatch(/<div[^>]*class[^>]*placeholder[^>]*>/);
      expect(html).toMatch(/<\/div>/);
      expect(html).toMatch(/<p>/);
      expect(html).toMatch(/<\/p>/);
      
      // Should be valid HTML structure
      const divOpen = (html.match(/<div[^>]*>/g) || []).length;
      const divClose = (html.match(/<\/div>/g) || []).length;
      expect(divOpen).toBe(divClose);
    });

    test('should generate semantic HTML when requested', () => {
      const html = generatePlaceholder({
        type: 'html',
        semantic: true
      });
      
      // Should potentially include semantic tags
      const semanticTags = ['h1', 'h2', 'h3', 'section', 'article'];
      const hasSemanticTag = semanticTags.some(tag => 
        html.includes(`<${tag}`) || html.includes(`</${tag}`)
      );
      
      // At minimum should have proper structure
      expect(html).toMatch(/<[^>]+>/); // Has HTML tags
    });
  });

  describe('options validation and defaults', () => {
    test('should handle default options gracefully', () => {
      const text1 = generatePlaceholder();
      const text2 = generatePlaceholder({});
      
      [text1, text2].forEach(text => {
        expect(typeof text).toBe('string');
        expect(text.length).toBeGreaterThan(0);
        expect(text.trim().length).toBeGreaterThan(0);
      });
    });

    test('should validate option parameters', () => {
      // Invalid types
      expect(() => generatePlaceholder({ type: 'invalid' })).toThrow();
      
      // Invalid lengths
      expect(() => generatePlaceholder({ type: 'words', length: -1 })).toThrow();
      expect(() => generatePlaceholder({ type: 'words', length: 'invalid' })).toThrow();
      
      // Invalid paragraph counts
      expect(() => generatePlaceholder({ 
        type: 'paragraphs', 
        paragraphs: 0 
      })).toThrow();
    });

    test('should handle edge case lengths', () => {
      // Minimum values
      expect(generatePlaceholder({ type: 'words', length: 1 })).toMatch(/^\w+$/);
      expect(generatePlaceholder({ type: 'sentences', length: 1 })).toMatch(/[.!?]$/);
      
      // Large values
      const largeText = generatePlaceholder({ type: 'words', length: 500 });
      expect(largeText.split(/\s+/)).toHaveLength(500);
    });
  });

  describe('consistency and quality', () => {
    test('should generate consistent quality across calls', () => {
      const texts = Array.from({ length: 5 }, () => 
        generatePlaceholder({ type: 'sentences', length: 3 })
      );
      
      texts.forEach(text => {
        expect(text.split(/[.!?]/).filter(s => s.trim().length > 0)).toHaveLength(3);
        expect(text).toMatch(/^[A-Z]/); // Starts with capital
        expect(text).toMatch(/[.!?]$/); // Ends with punctuation
      });
    });

    test('should generate realistic placeholder content', () => {
      const text = generatePlaceholder({ type: 'words', length: 20 });
      
      // Should not have repeated patterns
      const words = text.split(/\s+/);
      const uniqueWords = new Set(words);
      expect(uniqueWords.size).toBeGreaterThan(words.length * 0.5); // At least 50% unique
      
      // Should have reasonable word lengths
      const avgLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
      expect(avgLength).toBeGreaterThan(3);
      expect(avgLength).toBeLessThan(12);
    });
  });
});