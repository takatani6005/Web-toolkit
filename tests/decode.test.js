const { encodeHtml, decodeHtml } = require('../src/index');

console.assert(decodeHtml('&AElig;') === 'Æ', 'Decode failed: &AElig;');
console.assert(encodeHtml('Æ') === '&AElig;', 'Encode failed: Æ');
console.assert(decodeHtml('&#198;') === 'Æ', 'Decode failed: &#198;');
console.assert(decodeHtml('&#x00C6;') === 'Æ', 'Decode failed: &#x00C6;');

console.log('✅ All tests passed');
