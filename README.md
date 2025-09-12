# HTML Entity Codec 🚀

A fast, comprehensive, and feature-rich HTML entity encoding/decoding library for Node.js and browsers.

## Features ✨

- **Complete HTML5 entity support** - All 2,125+ HTML5 named entities
- **Multiple encoding modes** - Minimal, full, attribute-safe, and custom options
- **Advanced decoding** - Named entities, decimal, hexadecimal with error handling
- **Performance optimized** - Fast lookup tables and efficient regex patterns
- **TypeScript support** - Full type definitions included
- **Browser compatible** - Works in all modern browsers
- **Zero dependencies** - Lightweight and self-contained
- **Extensive validation** - Entity validation and analysis tools

## Installation

\`\`\`bash
npm install html-entity-codec
\`\`\`

## Quick Start

\`\`\`javascript
const { encodeHtml, decodeHtml } = require('html-entity-codec');

// Basic encoding
encodeHtml('Hello & "world"');  // → 'Hello &amp; &quot;world&quot;'

// Basic decoding  
decodeHtml('Hello &amp; &quot;world&quot;');  // → 'Hello & "world"'

// Advanced options
encodeHtml('Café €12.50', { 
  useNamedEntities: true,
  decimal: false 
});  // → 'Caf&eacute; &euro;12.50'
\`\`\`

## API Reference

### Core Functions

#### \`decodeHtml(str, options?)\`
Decode HTML entities to characters.

**Options:**
- \`strict\`: Throw errors on invalid entities (default: false)
- \`attributeMode\`: Use attribute-safe decoding (default: false)

#### \`encodeHtml(str, options?)\`
Encode characters to HTML entities.

**Options:**
- \`useNamedEntities\`: Use named entities when possible (default: true)
- \`encodeEverything\`: Encode all non-ASCII characters (default: false)
- \`allowUnsafeSymbols\`: Don't encode HTML-unsafe characters (default: false)
- \`level\`: Target level - 'html4', 'html5', 'xml' (default: 'html5')
- \`decimal\`: Use decimal instead of hex for numeric entities (default: false)

### Convenience Functions

#### \`encodeHtmlMinimal(str)\`
Encode only essential HTML characters (&, <, >, ", ').

#### \`encodeHtmlAttribute(str, options?)\`
Encode for safe use in HTML attributes.
- \`double\`: Use double quotes mode (default: true)

#### \`escapeHtml(str)\` / \`unescapeHtml(str)\`
Simple aliases for minimal encoding/decoding.

### Analysis Functions

#### \`hasEntities(str)\`
Check if string contains HTML entities.

#### \`findEntities(str)\`
Get array of all entities in string.

#### \`validateEntities(str)\`
Validate all entities and return detailed results.

#### \`normalizeEntities(str, options?)\`
Normalize entities by decoding then re-encoding.

## Advanced Usage

### Strict Mode
\`\`\`javascript
try {
  decodeHtml('&invalid;', { strict: true });
} catch (error) {
  console.log('Invalid entity detected');
}
\`\`\`

### Custom Encoding
\`\`\`javascript
// Encode everything as numeric
encodeHtml('Café 世界', { 
  useNamedEntities: false,
  encodeEverything: true,
  decimal: true 
});
// → 'Caf&#233; &#19990;&#30028;'
\`\`\`

### Entity Analysis
\`\`\`javascript
const result = validateEntities('&amp; &invalid; &#65;');
console.log(result);
// {
//   valid: false,
//   errors: ['Invalid entity: &invalid;'],
//   validEntities: ['&amp;', '&#65;'],
//   invalidEntities: ['&invalid;'],
//   totalEntities: 3
// }
\`\`\`

## Lightweight Version

For minimal use cases, import the lite version:

\`\`\`javascript
const { decodeLite, encodeLite } = require('html-entity-codec/lite');

// Only handles essential HTML entities (&amp; &lt; &gt; &quot; &apos;)
encodeLite('Hello & world');  // → 'Hello &amp; world'
\`\`\`

## Browser Usage

\`\`\`html
<script src="https://unpkg.com/html-entity-codec/dist/html-entity-codec.min.js"></script>
<script>
  const encoded = HtmlEntityCodec.encodeHtml('Hello & world');
</script>
\`\`\`

## Performance

Benchmarks on typical content (Node.js 18):
- **Decode**: ~2M entities/second
- **Encode**: ~1.5M characters/second  
- **Lite version**: ~3x faster for basic entities
## 📖 License

This project is licensed under the MIT License – see the [LICENSE](./LICENSE) file for details.
