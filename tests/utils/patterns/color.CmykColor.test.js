import {
    generateCmykColorPattern
} from '../../../src/utils/patterns/color.js';
describe('generateCmykColorPattern', () => {
const re = generateCmykColorPattern();

test('matches basic comma-separated integers', () => {
expect(re.test('cmyk(0,100,0,0)')).toBe(true);
expect(re.test('CMYK(10,20,30,40)')).toBe(true);
});

test('matches percent notation and mixed spacing', () => {
expect(re.test('cmyk(0% 50% 100% 25%)')).toBe(true);
expect(re.test('cmyk(0% , 50% ,100% ,25%)')).toBe(true);
});

test('matches whitespace separated values', () => {
expect(re.test('cmyk(0 0 0 0)')).toBe(true);
expect(re.test('cmyk(12 34 56 78)')).toBe(true);
});

test('matches decimals and 100 with decimals', () => {
expect(re.test('cmyk(100.0,0,50.5,25)')).toBe(true);
expect(re.test('cmyk(0.0% 50.25% 99.999% 100%)')).toBe(true);
});

test('rejects values > 100 or negative or non-number', () => {
expect(re.test('cmyk(101,0,0,0)')).toBe(false);
expect(re.test('cmyk(-1,0,0,0)')).toBe(false);
expect(re.test('cmyk(a,0,0,0)')).toBe(false);
});

test('rejects wrong counts or missing parens', () => {
expect(re.test('cmyk(0,0,0)')).toBe(false);
expect(re.test('cmyk0,0,0,0')).toBe(false);
expect(re.test('cmyk(0,0,0,0,0)')).toBe(false);
});

test('capture groups option', () => {
const captRe = generateCmykColorPattern({ capture: true });
const m = captRe.exec('cmyk(10%,20%,30%,40%)');
// first element is full match, then 4 capture groups
expect(Array.isArray(m)).toBe(true);
expect(m.length).toBe(5);
expect(m[1]).toBe('10%');
expect(m[2]).toBe('20%');
expect(m[3]).toBe('30%');
expect(m[4]).toBe('40%');
});
});
