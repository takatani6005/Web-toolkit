import{
    generateHexColorPattern,
    generateHex3ColorPattern,
    generateHex4ColorPattern,
    generateHex6ColorPattern,
    generateHex8ColorPattern,
    generateRandomHexPattern,
    generateRgbColorPattern,
    generateRgbaColorPattern,
    generateHslColorPattern,
    generateHslaColorPattern,
    generateHwbColorPattern,
    generateNamedColorPattern,
    generateColorFunctionPattern
} from '../../../patterns/color/basic.js';

import { describe, test, expect } from '@jest/globals';

describe('basic color generators smoke', () => {
  test('exports are functions', () => {
    expect(typeof generateHexColorPattern).toBe('function');
    expect(typeof generateRgbColorPattern).toBe('function');
  });
});