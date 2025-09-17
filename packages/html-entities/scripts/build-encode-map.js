// scripts/build-encode-map.js (Enhanced version)
const fs = require('fs');
const path = require('path');

// Load entities data
let entities;
try {
  entities = require('../data/entities.json');
  console.log(`📦 Loaded ${Object.keys(entities).length} entities`);
} catch (error) {
  console.error('❌ Failed to load entities.json:', error.message);
  process.exit(1);
}

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('📁 Created data directory');
}

// Build decode map (entity -> character)
console.log('🔄 Building decode map...');
const decodeMap = {};
let decodeCount = 0;

for (const [entity, info] of Object.entries(entities)) {
  if (info && info.characters) {
    decodeMap[entity] = info.characters;
    decodeCount++;
  }
}

const decodeMapPath = path.join(dataDir, 'decode-map.json');
fs.writeFileSync(decodeMapPath, JSON.stringify(decodeMap, null, 2));
console.log(`✅ Built decode-map.json with ${decodeCount} entities`);

// Build full encode map (character -> entity)
console.log('🔄 Building full encode map...');
const encodeMapFull = {};
let encodeFullCount = 0;

for (const [entity, info] of Object.entries(entities)) {
  if (info && info.characters) {
    // Only use the shortest entity name for each character
    if (!encodeMapFull[info.characters] || entity.length < encodeMapFull[info.characters].length) {
      encodeMapFull[info.characters] = entity;
      encodeFullCount++;
    }
  }
}

const encodeMapFullPath = path.join(dataDir, 'encode-map-full.json');
fs.writeFileSync(encodeMapFullPath, JSON.stringify(encodeMapFull, null, 2));
console.log(`✅ Built encode-map-full.json with ${encodeFullCount} mappings`);

// Build lite encode map (essential characters only)
console.log('🔄 Building lite encode map...');
const essentialEntities = [
  '&amp;', '&lt;', '&gt;', '&quot;', '&apos;', // Basic HTML
  '&nbsp;', '&copy;', '&reg;', '&trade;', // Common symbols
  '&euro;', '&pound;', '&yen;', // Currency
  '&hellip;', '&mdash;', '&ndash;', '&lsquo;', '&rsquo;', '&ldquo;', '&rdquo;', // Typography
  '&hearts;', '&spades;', '&clubs;', '&diams;', // Card suits
];

const encodeMapLite = {};
let encodeLiteCount = 0;

for (const entity of essentialEntities) {
  if (decodeMap[entity]) {
    encodeMapLite[decodeMap[entity]] = entity;
    encodeLiteCount++;
  }
}

const encodeMapLitePath = path.join(dataDir, 'encode-map-lite.json');
fs.writeFileSync(encodeMapLitePath, JSON.stringify(encodeMapLite, null, 2));
console.log(`✅ Built encode-map-lite.json with ${encodeLiteCount} essential mappings`);


// Generate statistics
console.log('\n📊 Statistics:');
console.log(`- Total entities in source: ${Object.keys(entities).length}`);
console.log(`- Decode map entries: ${decodeCount}`);
console.log(`- Full encode map entries: ${encodeFullCount}`);
console.log(`- Lite encode map entries: ${encodeLiteCount}`);

// Find entities with multiple character mappings
const multiCharEntities = Object.entries(entities)
  .filter(([, info]) => info.characters && info.characters.length > 1)
  .length;
console.log(`- Multi-character entities: ${multiCharEntities}`);

// Find most common character lengths
const charLengths = Object.values(entities)
  .filter(info => info.characters)
  .map(info => info.characters.length);
const avgCharLength = charLengths.reduce((a, b) => a + b, 0) / charLengths.length;
console.log(`- Average character length: ${avgCharLength.toFixed(2)}`);

console.log('\n🎉 All build tasks completed successfully!');

// Export for potential programmatic use
module.exports = {
  decodeMap,
  encodeMapFull,
  encodeMapLite
};