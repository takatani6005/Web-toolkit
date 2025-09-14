// Main export file for generate utilities
export { generateId, generateIdBatch, validateId } from './id.js';
export { generatePassword } from './password.js';
export { generateUuid, generateNanoId } from './uuid.js';
export { generateHash } from './hash.js';
export { generatePlaceholder, generateTestData } from './data.js';
export { generateRegexPattern } from './regex.js';

// Re-export legacy functions for backward compatibility
export {
  toSlug,
  toBase64,
  fromBase64,
  generateRandomUnicode
} from './legacy.js';