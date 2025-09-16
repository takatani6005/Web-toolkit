/**
 * Hash Generation utilities
 * Provides various non-cryptographic hash functions for string hashing
 */

/**
 * Generate hash using specified algorithm
 * @param {string} str - String to hash
 * @param {string} [algorithm='djb2'] - Hash algorithm to use
 * @param {Object} [options={}] - Additional options
 * @returns {number|string} Generated hash
 * @throws {Error} When unsupported algorithm is specified
 */
export function generateHash(str, algorithm='djb2', options = {}) {

  if (typeof str !== 'string') {
    throw new Error('Input must be a string');
  }
  if (typeof algorithm !== 'string' || !algorithm.trim()) {
    throw new Error('Invalid algorithm');
  }

  const algorithms = {
    djb2: hashDjb2,
    sdbm: hashSdbm,
    simple: hashSimple,
    fnv1a: hashFnv1a,
    murmur3: hashMurmur3,
    crc32: hashCrc32,
    adler32: hashAdler32
  };
  
  const hashFn = algorithms[algorithm];
  if (!hashFn) {
    const available = Object.keys(algorithms).join(', ');
    throw new Error(`Hash algorithm '${algorithm}' not supported. Available: ${available}`);
  }
  

  return hashFn(str, options);
}

/**
 * Generate multiple hashes using different algorithms
 * @param {string} str - String to hash
 * @param {string[]} [algorithms=['djb2', 'sdbm', 'fnv1a']] - Algorithms to use
 * @returns {Object} Object with algorithm names as keys and hashes as values
 */
export function generateMultiHash(str, algorithms = ['djb2', 'sdbm', 'fnv1a']) {
  const result = {};
  
  for (const algorithm of algorithms) {
    try {
      result[algorithm] = generateHash(str, algorithm);
    } catch (err) {
      result[algorithm] = { error: err.message };
    }
  }
  
  return result;
}

/**
 * DJB2 hash algorithm (Dan Bernstein)
 * @private
 */
function hashDjb2(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & 0xffffffff;           // giới hạn 32-bit
  }
  return hash >>> 0;                     // ép về unsigned
}

/**
 * SDBM hash algorithm
 * @private
 */
function hashSdbm(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + (hash << 6) + (hash << 16) - hash;
    hash = hash & 0xffffffff;
  }
  return hash >>> 0;
}

/**
 * Simple hash algorithm
 * @private
 */
function hashSimple(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    //hash = hash & hash; // Convert to 32-bit integer
    hash = hash & 0xffffffff;
  }
  return hash >>> 0;
}

/**
 * FNV-1a hash algorithm (32-bit)
 * @private
 */
function hashFnv1a(str) {
  let hash = 0x811c9dc5; // FNV offset basis for 32-bit
  
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    hash = hash & 0xffffffff;
  }
  
  return hash >>> 0;
}

/**
 * MurmurHash3 (32-bit) - simplified version
 * @private
 */
function hashMurmur3(str, options = {}) {
  const { seed = 0x12345678 } = options;
  
  let hash = seed;
  const remainder = str.length % 4;
  const bytes = str.length - remainder;
  
  const c1 = 0xcc9e2d51;
  const c2 = 0x1b873593;
  const r1 = 15;
  const r2 = 13;
  const m = 5;
  const n = 0xe6546b64;
  
  let k1 = 0;
  
  for (let i = 0; i < bytes; i += 4) {
    k1 = (str.charCodeAt(i) & 0xff) |
         ((str.charCodeAt(i + 1) & 0xff) << 8) |
         ((str.charCodeAt(i + 2) & 0xff) << 16) |
         ((str.charCodeAt(i + 3) & 0xff) << 24);
    
    k1 = Math.imul(k1, c1);
    k1 = (k1 << r1) | (k1 >>> (32 - r1));
    k1 = Math.imul(k1, c2);
    
    hash ^= k1;
    hash = (hash << r2) | (hash >>> (32 - r2));
    hash = Math.imul(hash, m) + n;
  }
  
  k1 = 0;
  
  switch (remainder) {
    case 3:
      k1 ^= (str.charCodeAt(bytes + 2) & 0xff) << 16;
      // fallthrough
    case 2:
      k1 ^= (str.charCodeAt(bytes + 1) & 0xff) << 8;
      // fallthrough
    case 1:
      k1 ^= (str.charCodeAt(bytes) & 0xff);
      k1 = Math.imul(k1, c1);
      k1 = (k1 << r1) | (k1 >>> (32 - r1));
      k1 = Math.imul(k1, c2);
      hash ^= k1;
  }
  
  hash ^= str.length;
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x85ebca6b);
  hash ^= hash >>> 13;
  hash = Math.imul(hash, 0xc2b2ae35);
  hash ^= hash >>> 16;
  hash = hash & 0xffffffff;
  return hash >>> 0;
}

/**
 * CRC32 hash algorithm
 * @private
 */
function hashCrc32(str) {
  const crcTable = makeCrcTable();
  let crc = 0 ^ (-1);
  
  for (let i = 0; i < str.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xFF];
  }
  
  return (crc ^ (-1)) >>> 0;
}

/**
 * Generate CRC32 lookup table
 * @private
 */
function makeCrcTable() {
  let c;
  const crcTable = [];
  
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) {
      c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    }
    crcTable[n] = c;
  }
  
  return crcTable;
}

/**
 * Adler-32 checksum algorithm
 * @private
 */
function hashAdler32(str) {
  const MOD_ADLER = 65521;
  let a = 1;
  let b = 0;
  
  for (let index = 0; index < str.length; index++) {
    a = (a + str.charCodeAt(index)) % MOD_ADLER;
    b = (b + a) % MOD_ADLER;
  }
  
  return ( (b << 16) | a ) >>> 0;

}

/**
 * Generate a hash-based identifier
 * @param {string} input - Input string to hash
 * @param {Object} [options={}] - Configuration options
 * @param {string} [options.algorithm='djb2'] - Hash algorithm
 * @param {number} [options.length=8] - Length of output identifier
 * @param {string} [options.prefix=''] - Prefix for the identifier
 * @param {boolean} [options.uppercase=false] - Use uppercase letters
 * @returns {string} Hash-based identifier
 */
export function generateHashId(input, options = {}) {
  const {
    algorithm = 'djb2',
    length = 8,
    prefix = '',
    uppercase = false
  } = options;

  if (typeof input !== 'string') {
    throw new Error('Input must be a string');
  }

  if (typeof length !== 'number' || length < 1 || length > 16) {
    throw new Error('Length must be between 1 and 16');
  }

  const hash = generateHash(input, algorithm);
  
  // Convert hash to base36 and take desired length
  let hashStr = hash.toString(36);
  
  // Pad with leading zeros if needed
  hashStr = hashStr.padStart(length, '0').slice(0, length);
  
  if (uppercase) {
    hashStr = hashStr.toUpperCase();
  }
  
  return prefix + hashStr;
}

/**
 * Generate consistent hash for distributed systems
 * @param {string} key - Key to hash
 * @param {number} [buckets=100] - Number of buckets/partitions
 * @param {string} [algorithm='fnv1a'] - Hash algorithm to use
 * @returns {number} Bucket number (0 to buckets-1)
 */
export function generateConsistentHash(key, buckets = 100, algorithm = 'fnv1a') {
  if (typeof key !== 'string') {
    throw new Error('Key must be a string');
  }

  if (typeof buckets !== 'number' || buckets < 1) {
    throw new Error('Buckets must be a positive number');
  }

  const hash = generateHash(key, algorithm);
  return hash % buckets;
}

/**
 * Generate hash fingerprint for data integrity
 * @param {string} data - Data to fingerprint
 * @param {string[]} [algorithms=['djb2', 'fnv1a', 'murmur3']] - Algorithms to use
 * @returns {string} Fingerprint string
 */
export function generateFingerprint(data, algorithms = ['djb2', 'fnv1a', 'murmur3']) {
  const hashes = generateMultiHash(data, algorithms);
  
  const fingerprint = algorithms
    .map(alg => {
      const hash = hashes[alg];
      if (typeof hash === 'object' && hash.error) {
        throw new Error(`Error generating fingerprint: ${hash.error}`);
      }
      return hash.toString(16).padStart(8, '0');
    })
    .join('-');
    
  return fingerprint;
}