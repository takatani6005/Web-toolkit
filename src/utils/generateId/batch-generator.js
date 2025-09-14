import { generateId } from './generate-id.js';
import { validateBatchParams } from './validators.js';

/**
 * Generate a batch of IDs efficiently
 * @param {number} count - Number of IDs to generate
 * @param {Object} options - Same options as generateId
 * @returns {string[]} Array of generated IDs
 */
export function generateIdBatch(count, options = {}) {
  validateBatchParams(count);

  const ids = [];
  const idsSet = new Set();
  let attempts = 0;
  const maxAttempts = count * 10; // Prevent infinite loops

  // Generate unique IDs
  while (ids.length < count && attempts < maxAttempts) {
    const id = generateId(options);
    if (!idsSet.has(id)) {
      ids.push(id);
      idsSet.add(id);
    }
    attempts++;
  }

  if (ids.length < count) {
    console.warn(`Could only generate ${ids.length} unique IDs out of ${count} requested. Consider increasing length or changing charset.`);
  }

  return ids;
}

/**
 * Generate a batch of unique IDs with guaranteed uniqueness
 * @param {number} count - Number of IDs to generate
 * @param {Object} options - Same options as generateId
 * @param {number} [maxRetries=100] - Maximum retry attempts per ID
 * @returns {string[]} Array of generated unique IDs
 * @throws {Error} When unable to generate enough unique IDs
 */
export function generateUniqueIdBatch(count, options = {}, maxRetries = 100) {
  validateBatchParams(count);
  
  const ids = new Set();
  let totalAttempts = 0;
  const maxTotalAttempts = count * maxRetries;

  while (ids.size < count && totalAttempts < maxTotalAttempts) {
    const id = generateId(options);
    ids.add(id);
    totalAttempts++;
  }

  if (ids.size < count) {
    throw new Error(`Could only generate ${ids.size} unique IDs out of ${count} requested after ${totalAttempts} attempts. Consider increasing ID length or changing charset for better uniqueness.`);
  }

  return Array.from(ids);
}

/**
 * Estimate collision probability for given parameters
 * @param {Object} options - ID generation options
 * @param {number} count - Number of IDs to generate
 * @returns {number} Estimated collision probability (0-1)
 */
export function estimateCollisionProbability(options = {}, count = 1000) {
  const { length = 8, charset = 'alphanumeric', avoidAmbiguous = false } = options;
  
  // Get character set size
  const baseCharsets = {
    alphanumeric: 62,
    alpha: 52,
    numeric: 10,
    hex: 16,
    hexLower: 16,
    base32: 32,
    base32Lower: 32,
    urlsafe: 64,
    base58: 58,
    safe: 32
  };
  
  let charsetSize = baseCharsets[charset] || options.charset?.length || 62;
  
  if (avoidAmbiguous) {
    // Approximate reduction for ambiguous characters
    charsetSize = Math.max(1, charsetSize - 5);
  }
  
  const totalPossibilities = Math.pow(charsetSize, length);
  
  // Birthday problem approximation
  const probability = 1 - Math.exp(-Math.pow(count, 2) / (2 * totalPossibilities));
  
  return Math.min(1, Math.max(0, probability));
}