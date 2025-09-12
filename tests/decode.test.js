// tests/comprehensive.test.js
const {
  decodeHtml,
  encodeHtml,
  encodeHtmlMinimal,
  encodeHtmlAttribute,
  escapeHtml,
  unescapeHtml,
  hasEntities,
  findEntities,
  validateEntities,
  normalizeEntities,
  isValidCodePoint,
  toSafeDisplay
} = require('../src/index');

// Test helper function
function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
  } catch (error) {
    console.log(`❌ ${name}: ${error.message}`);
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected "${expected}", got "${actual}"`);
  }
}

function assertDeepEqual(actual, expected, message) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(message || `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

// Basic decoding tests
test('Basic named entity decoding', () => {
  assertEqual(decodeHtml('&amp;'), '&');
  assertEqual(decodeHtml('&lt;'), '<');
  assertEqual(decodeHtml('&gt;'), '>');
  assertEqual(decodeHtml('&quot;'), '"');
  assertEqual(decodeHtml('&apos;'), "'");
});

test('Numeric entity decoding (decimal)', () => {
  assertEqual(decodeHtml('&#65;'), 'A');
  assertEqual(decodeHtml('&#8364;'), '€');
  assertEqual(decodeHtml('&#128512;'), '😀');
});

test('Numeric entity decoding (hex)', () => {
  assertEqual(decodeHtml('&#x41;'), 'A');
  assertEqual(decodeHtml('&#x20AC;'), '€');
  assertEqual(decodeHtml('&#x1F600;'), '😀');
  assertEqual(decodeHtml('&#X1F600;'), '😀'); // uppercase X
});

test('Mixed entity decoding', () => {
  assertEqual(
    decodeHtml('Hello &amp; goodbye &lt;test&gt; &#65; &#x42;'),
    'Hello & goodbye <test> A B'
  );
});

// Basic encoding tests
test('Basic HTML encoding', () => {
  assertEqual(encodeHtml('&'), '&amp;');
  assertEqual(encodeHtml('<script>'), '&lt;script&gt;');
  assertEqual(encodeHtml('"hello"'), '&quot;hello&quot;');
});

test('Unicode encoding', () => {
  assertEqual(encodeHtml('€'), '&euro;');
  assertEqual(encodeHtml('©'), '&copy;');
  assertEqual(encodeHtml('™'), '&trade;');
});

// Minimal encoding tests
test('Minimal HTML encoding', () => {
  assertEqual(encodeHtmlMinimal('&<>"\''), '&amp;&lt;&gt;&quot;&#x27;');
  assertEqual(encodeHtmlMinimal('Hello world'), 'Hello world');
  assertEqual(encodeHtmlMinimal('€©™'), '€©™'); // Should not encode these
});

// Attribute encoding tests
test('Attribute encoding (double quotes)', () => {
  assertEqual(encodeHtmlAttribute('Hello "world"'), 'Hello &quot;world&quot;');
  assertEqual(encodeHtmlAttribute("Hello 'world'"), "Hello 'world'");
});

test('Attribute encoding (single quotes)', () => {
  assertEqual(encodeHtmlAttribute("Hello 'world'", { double: false }), 'Hello &#x27;world&#x27;');
  assertEqual(encodeHtmlAttribute('Hello "world"', { double: false }), 'Hello "world"');
});

// Advanced options tests
test('Strict decoding mode', () => {
  assertEqual(decodeHtml('&amp;', { strict: true }), '&');
  try {
    decodeHtml('&invalid;', { strict: true });
    throw new Error('Should have thrown');
  } catch (e) {
    if (!e.message.includes('Invalid HTML entity')) {
      throw e;
    }
  }
});

test('Encode with options', () => {
  assertEqual(
    encodeHtml('Hello & 世界', { decimal: true }),
    'Hello &amp; &#19990;&#30028;'
  );
  assertEqual(
    encodeHtml('Hello & 世界', { decimal: false }),
    'Hello &amp; &#x4E16;&#x754C;'
  );
});

test('Encode everything mode', () => {
  const result = encodeHtml('Hello 世界!', { encodeEverything: true });
  assertEqual(result.includes('&#x'), true);
  assertEqual(decodeHtml(result), 'Hello 世界!');
});

// Entity detection tests
test('Has entities detection', () => {
  assertEqual(hasEntities('Hello &amp; world'), true);
  assertEqual(hasEntities('Hello world'), false);
  assertEqual(hasEntities('&'), false); // incomplete entity
  assertEqual(hasEntities('&#65;'), true);
});

test('Find entities', () => {
  assertDeepEqual(
    findEntities('Hello &amp; &lt;world&gt; &#65;'),
    ['&amp;', '&lt;', '&gt;', '&#65;']
  );
  assertDeepEqual(findEntities('No entities here'), []);
});

// Validation tests
test('Validate entities', () => {
  const result1 = validateEntities('&amp; &lt; &invalid;');
  assertEqual(result1.valid, false);
  assertEqual(result1.validEntities.length, 2);
  assertEqual(result1.invalidEntities.length, 1);
  
  const result2 = validateEntities('&amp; &lt;');
  assertEqual(result2.valid, true);
  assertEqual(result2.errors.length, 0);
});

// Normalization tests
test('Normalize entities', () => {
  assertEqual(
    normalizeEntities('&amp;amp; &lt;script&gt;'),
    '&amp;amp; &lt;script&gt;'
  );
});

// Utility function tests
test('Valid code point check', () => {
  assertEqual(isValidCodePoint(65), true); // 'A'
  assertEqual(isValidCodePoint(0x20AC), true); // '€'
  assertEqual(isValidCodePoint(0x1F600), true); // '😀'
  assertEqual(isValidCodePoint(0), false); // null
  assertEqual(isValidCodePoint(0x0B), false); // vertical tab
});

test('Safe display conversion', () => {
  assertEqual(toSafeDisplay('Hello\x00World'), 'Hello\\u0000World');
  assertEqual(toSafeDisplay('Normal text'), 'Normal text');
  assertEqual(toSafeDisplay('\x1F'), '\\u001F');
});

// Error handling tests
test('Error handling for non-strings', () => {
  try {
    decodeHtml(123);
    throw new Error('Should have thrown');
  } catch (e) {
    if (!e.message.includes('must be a string')) {
      throw e;
    }
  }
  
  try {
    encodeHtml(null);
    throw new Error('Should have thrown');
  } catch (e) {
    if (!e.message.includes('must be a string')) {
      throw e;
    }
  }
});

// Edge cases
test('Empty string handling', () => {
  assertEqual(decodeHtml(''), '');
  assertEqual(encodeHtml(''), '');
  assertEqual(hasEntities(''), false);
  assertDeepEqual(findEntities(''), []);
});

test('Malformed entities', () => {
  assertEqual(decodeHtml('&amp'), '&amp'); // missing semicolon
  assertEqual(decodeHtml('&#'), '&#'); // incomplete numeric
  assertEqual(decodeHtml('&#x'), '&#x'); // incomplete hex
  assertEqual(decodeHtml('&#xyz;'), '&#xyz;'); // invalid hex
});

test('Round trip encoding/decoding', () => {
  const original = 'Hello & "world" <script>alert(\'test\')</script> 世界 🌍';
  const encoded = encodeHtml(original);
  const decoded = decodeHtml(encoded);
  assertEqual(decoded, original);
});

// Performance test (basic)
test('Performance test', () => {
  const longString = 'Hello &amp; world '.repeat(1000);
  const start = Date.now();
  for (let i = 0; i < 100; i++) {
    decodeHtml(longString);
  }
  const end = Date.now();
  console.log(`  Performance: ${end - start}ms for 100 iterations of 1000 entities`);
});

console.log('\n🚀 Running comprehensive HTML entity tests...\n');