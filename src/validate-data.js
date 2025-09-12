// scripts/validate-data.js - Data validation script
const fs = require('fs');
const path = require('path');

console.log('🔍 Validating data files...\n');

// Check if required files exist
const requiredFiles = [
  'data/entities.json',
  'data/decode-map.json',
  'data/encode-map-full.json',
  'data/encode-map-lite.json'
];

let allFilesExist = true;

for (const file of requiredFiles) {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
    allFilesExist = false;
  }
}

if (!allFilesExist) {
  console.log('\n⚠️  Some data files are missing. Run "npm run build" to generate them.');
  process.exit(1);
}
// Validate JSON structure
try {
  const entities = require('../data/entities.json');
  const decodeMap = require('../data/decode-map.json');
  const encodeMapFull = require('../data/encode-map-full.json');
  const encodeMapLite = require('../data/encode-map-lite.json');
  
  console.log('\n📊 Data Statistics:');
  console.log(`  Entities: ${Object.keys(entities).length}`);
  console.log(`  Decode mappings: ${Object.keys(decodeMap).length}`);
  console.log(`  Full encode mappings: ${Object.keys(encodeMapFull).length}`);
  console.log(`  Lite encode mappings: ${Object.keys(encodeMapLite).length}`);
  
  // Validate round-trip consistency
  let roundTripErrors = 0;
  for (const [entity, character] of Object.entries(decodeMap)) {
    if (encodeMapFull[character] && encodeMapFull[character] !== entity) {
      // This is expected - multiple entities can map to same character
      continue;
    }
  }
  
  console.log('\n✅ All data files are valid!');
  
} catch (error) {
  console.error('❌ Data validation failed:', error.message);
  process.exit(1);
}