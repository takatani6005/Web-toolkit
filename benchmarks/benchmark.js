// scripts/benchmark.js - Performance benchmarking
const { decodeHtml, encodeHtml } = require('../src/core');
const { decodeLite, encodeLite } = require('../src/lite');

// Sample test data
const testStrings = {
  simple: 'Hello &amp; goodbye',
  complex: '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt; &amp; more &copy; 2023',
  unicode: 'Caf&eacute; &euro;12.50 &hearts; &spades; &#x1F600;',
  long: ('Test &amp; more '.repeat(1000)),
  mixed: 'Mixed: &amp; &#65; &#x42; &lt;tag attr="value"&gt; Unicode: &euro; &copy; &#8482;'
};

function benchmark(name, fn, iterations = 10000) {
  const start = process.hrtime.bigint();
  
  for (let i = 0; i < iterations; i++) {
    for (const testString of Object.values(testStrings)) {
      fn(testString);
    }
  }
  
  const end = process.hrtime.bigint();
  const duration = Number(end - start) / 1000000; // Convert to milliseconds
  
  console.log(`${name}: ${duration.toFixed(2)}ms (${iterations} iterations)`);
  console.log(`  Average: ${(duration / iterations).toFixed(4)}ms per iteration`);
  
  return duration;
}

console.log('🚀 Running HTML Entity Codec Benchmarks\n');

console.log('📊 Decoding Performance:');
const decodeFullTime = benchmark('  Full Decode', decodeHtml);
const decodeLiteTime = benchmark('  Lite Decode', decodeLite);
console.log(`  Speedup: ${(decodeFullTime / decodeLiteTime).toFixed(2)}x faster (lite)\n`);

console.log('📊 Encoding Performance:');
const encodeFullTime = benchmark('  Full Encode', encodeHtml);
const encodeLiteTime = benchmark('  Lite Encode', encodeLite);
console.log(`  Speedup: ${(encodeFullTime / encodeLiteTime).toFixed(2)}x faster (lite)\n`);

// Memory usage test
function memoryTest() {
  const used = process.memoryUsage();
  console.log('💾 Memory Usage:');
  for (let key in used) {
    console.log(`  ${key}: ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
  }
}

memoryTest();