const fs = require('fs');
const entities = require('./entities.json');

// Build decode map
const decodeMap = {};
for (const [entity, info] of Object.entries(entities)) {
  decodeMap[entity] = info.characters;
}
fs.writeFileSync('./data/decode-map.json', JSON.stringify(decodeMap, null, 2));

// Build encode map
const encodeMap = {};
for (const [entity, info] of Object.entries(entities)) {
  encodeMap[info.characters] = entity;
}
fs.writeFileSync('./data/encode-map-full.json', JSON.stringify(encodeMap, null, 2));

console.log('✅ Built decode-map.json and encode-map-full.json');
