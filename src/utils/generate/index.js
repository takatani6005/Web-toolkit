// Main export file for generate utilities
export { generateId, generateIdBatch, validateId } from './id.js'; //passed test
export { generatePassword } from './password.js'; //passed test
export { generateUuid, generateNanoId } from './uuid.js'; 
export { generateHash } from './hash.js';
export { generatePlaceholder, generateTestData } from './data.js';


// Re-export legacy functions for backward compatibility
export {
  toBase64,
  fromBase64,
 generateWeightedString,
 generatePatternString,
 generateLoremIpsum
} from './legacy.js';
