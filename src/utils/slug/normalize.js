/**
 * Normalize Unicode and remove diacritics from text
 * @param {string} str - Input string
 * @returns {string} Normalized string without diacritics
 */
export function removeDiacritics(str) {
  if (!str) return str;
  
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Remove combining diacritical marks
}

/**
 * Remove emojis and other Unicode symbols from text
 * @param {string} str - Input string
 * @returns {string} String with emojis removed
 */
export function removeEmojis(str) {
  if (!str) return str;
  
  // Remove various emoji ranges
  return str.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '');
}

/**
 * Remove various Unicode symbols and pictographs
 * @param {string} str - Input string
 * @returns {string} String with symbols removed
 */
export function removeSymbols(str) {
  if (!str) return str;
  
  return str
    // Remove emojis
    .replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '')
    // Remove other symbol ranges
    .replace(/[\u{2000}-\u{206F}]/gu, '') // General punctuation
    .replace(/[\u{2070}-\u{209F}]/gu, '') // Superscripts and subscripts
    .replace(/[\u{20A0}-\u{20CF}]/gu, '') // Currency symbols
    .replace(/[\u{2100}-\u{214F}]/gu, '') // Letterlike symbols
    .replace(/[\u{2190}-\u{21FF}]/gu, '') // Arrows
    .replace(/[\u{2200}-\u{22FF}]/gu, '') // Mathematical operators
    .replace(/[\u{2300}-\u{23FF}]/gu, '') // Miscellaneous technical
    .replace(/[\u{2400}-\u{243F}]/gu, '') // Control pictures
    .replace(/[\u{2440}-\u{245F}]/gu, '') // Optical character recognition
    .replace(/[\u{2460}-\u{24FF}]/gu, '') // Enclosed alphanumerics
    .replace(/[\u{2500}-\u{257F}]/gu, '') // Box drawing
    .replace(/[\u{2580}-\u{259F}]/gu, '') // Block elements
    .replace(/[\u{25A0}-\u{25FF}]/gu, '') // Geometric shapes
    .replace(/[\u{2600}-\u{26FF}]/gu, '') // Miscellaneous symbols
    .replace(/[\u{2700}-\u{27BF}]/gu, ''); // Dingbats
}

/**
 * Normalize text for slug creation
 * Combines Unicode normalization, diacritic removal, and symbol removal
 * @param {string} str - Input string
 * @param {Object} options - Normalization options
 * @param {boolean} options.removeDiacritics - Remove diacritics (default: true)
 * @param {boolean} options.removeEmojis - Remove emojis (default: true)
 * @param {boolean} options.removeSymbols - Remove Unicode symbols (default: true)
 * @returns {string} Normalized string
 */
export function normalizeForSlug(str, options = {}) {
  if (!str) return str;
  
  const {
    removeDiacritics: shouldRemoveDiacritics = true,
    removeEmojis: shouldRemoveEmojis = true,
    removeSymbols: shouldRemoveSymbols = true
  } = options;
  
  let result = str;
  
  // Apply normalizations in order
  if (shouldRemoveDiacritics) {
    result = removeDiacritics(result);
  }
  
  if (shouldRemoveEmojis) {
    result = removeEmojis(result);
  }
  
  if (shouldRemoveSymbols) {
    result = removeSymbols(result);
  }
  
  return result;
}

/**
 * Check if a string contains diacritics
 * @param {string} str - Input string
 * @returns {boolean} True if string contains diacritics
 */
export function hasDiacritics(str) {
  if (!str) return false;
  return str.normalize('NFD') !== str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Check if a string contains emojis
 * @param {string} str - Input string
 * @returns {boolean} True if string contains emojis
 */
export function hasEmojis(str) {
  if (!str) return false;
  return /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu.test(str);
}