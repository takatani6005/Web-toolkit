import { describe, test, expect } from '@jest/globals';
import {
  generatePlaceholder
} from '../../src/utils/generate.js';



  describe('generatePlaceholder', () => {
    test('should generate text of approximate length', () => {
      const text = generatePlaceholder({ type: 'words', length: 10 });
      const words = text.split(' ');
      expect(words.length).toBe(10);
    });

    test('should generate specified number of sentences', () => {
      const text = generatePlaceholder({ type: 'sentences', length: 3 });
      const sentences = text.split('.').filter(s => s.trim());
      expect(sentences.length).toBe(3);
    });

    test('should generate paragraphs', () => {
      const text = generatePlaceholder({ 
        type: 'paragraphs', 
        paragraphs: 3,
        sentences: 2
      });
      const paras = text.split('\n\n');
      expect(paras.length).toBe(3);
    });

    test('should generate HTML when requested', () => {
      const html = generatePlaceholder({ 
        type: 'paragraphs', 
        paragraphs: 2,
        includeHtml: true 
      });
      expect(html).toMatch(/<p>.*<\/p>/);
    });

    test('should generate HTML wrapper', () => {
      const html = generatePlaceholder({ type: 'html' });
      expect(html).toMatch(/<div class="placeholder">/);
      expect(html).toMatch(/<p>.*<\/p>/);
    });

    test('should default to text type', () => {
      const text = generatePlaceholder();
      expect(typeof text).toBe('string');
      expect(text.length).toBeGreaterThan(0);
    });
  });