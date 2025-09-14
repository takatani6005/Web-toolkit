// scripts/update-entities.js - Script to update entities from web sources
const https = require('https');

const ENTITY_SOURCES = [
  {
    name: 'WHATWG HTML',
    url: 'https://html.spec.whatwg.org/entities.json',
    format: 'json'
  }
];

async function fetchEntities() {
  console.log('🌐 Fetching latest entity definitions...\n');
  
  for (const source of ENTITY_SOURCES) {
    try {
      console.log(`📥 Downloading from ${source.name}...`);
      
      const data = await new Promise((resolve, reject) => {
        https.get(source.url, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => resolve(data));
        }).on('error', reject);
      });
      
      if (source.format === 'json') {
        const entities = JSON.parse(data);
        const outputPath = path.join(__dirname, '..', 'data', 'entities.json');
        fs.writeFileSync(outputPath, JSON.stringify(entities, null, 2));
        console.log(`✅ Updated entities.json with ${Object.keys(entities).length} entities`);
      }
      
    } catch (error) {
      console.error(`❌ Failed to fetch from ${source.name}:`, error.message);
    }
  }
  
  console.log('\n🔄 Run "npm run build" to regenerate maps with updated entities.');
}

if (require.main === module) {
  fetchEntities();
}
