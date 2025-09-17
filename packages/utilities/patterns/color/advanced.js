/**
 * Advanced Color Pattern Generators
 * Handles modern color spaces: LAB, LCH, OKLab, OKLCH, CMYK
 */

// ===== CMYK COLOR GENERATORS =====

/**
 * Generate a random CMYK color string
 * @returns {string} CMYK color string like "cmyk(50%, 25%, 75%, 10%)"
 */
 function generateCmykColorString() {
  const c = Math.floor(Math.random() * 101);
  const m = Math.floor(Math.random() * 101);
  const y = Math.floor(Math.random() * 101);
  const k = Math.floor(Math.random() * 101);
  return `cmyk(${c}%, ${m}%, ${y}%, ${k}%)`;
}

// ===== OK COLOR SPACES =====

/**
 * Generate a random OKLab color value string
 * @param {Object} options - Configuration options
 * @param {number} [options.precision=3] - Decimal precision
 * @param {boolean} [options.includeAlpha=false] - Include alpha channel
 * @returns {string} OKLab color value like "oklab(0.628 0.225 0.126)"
 */
 function generateOklabColorPattern(options = {}) {
  const { precision = 3, includeAlpha = false } = options;
  
  // OKLab ranges: L: 0-1, a: ~-0.4 to 0.4, b: ~-0.4 to 0.4
  const l = Math.random(); // 0 to 1
  const a = (Math.random() - 0.5) * 0.8; // -0.4 to 0.4
  const b = (Math.random() - 0.5) * 0.8; // -0.4 to 0.4
  
  const lValue = Number(l.toFixed(precision));
  const aValue = Number(a.toFixed(precision));
  const bValue = Number(b.toFixed(precision));
  
  let alphaValue = '';
  if (includeAlpha) {
    const alpha = Math.random();
    alphaValue = ` / ${Number(alpha.toFixed(precision))}`;
  }
  
  return `oklab(${lValue} ${aValue} ${bValue}${alphaValue})`;
}

/**
 * Generate a random OKLCH color value string
 * @param {Object} options - Configuration options
 * @param {number} [options.precision=3] - Decimal precision
 * @param {boolean} [options.includeAlpha=false] - Include alpha channel
 * @returns {string} OKLCH color value like "oklch(0.628 0.258 29.234)"
 */
 function generateOklchColorPattern(options = {}) {
  const { precision = 3, includeAlpha = false } = options;
  
  // OKLCH ranges: L: 0-1, C: 0-0.4, H: 0-360
  const l = Math.random(); // 0 to 1
  const c = Math.random() * 0.4; // 0 to 0.4
  const h = Math.random() * 360; // 0 to 360
  
  const lValue = Number(l.toFixed(precision));
  const cValue = Number(c.toFixed(precision));
  const hValue = Number(h.toFixed(precision));
  
  let alphaValue = '';
  if (includeAlpha) {
    const alpha = Math.random();
    alphaValue = ` / ${Number(alpha.toFixed(precision))}`;
  }
  
  return `oklch(${lValue} ${cValue} ${hValue}${alphaValue})`;
}

// ===== LCH COLOR GENERATORS =====

/**
 * Generate a random LCH color value string
 * @param {Object} options - Configuration options
 * @param {number} [options.precision=1] - Decimal precision
 * @param {boolean} [options.includeAlpha=false] - Include alpha channel
 * @param {string} [options.colorSpace='lch'] - Color space variant
 * @returns {string} LCH color value
 */
 function generateLchColorPattern(options = {}) {
  const { precision = 1, includeAlpha = false, colorSpace = 'lch' } = options;
  
  const l = Math.random() * 100;
  const c = Math.random() * 150;
  const h = Math.random() * 360;
  
  const lValue = Number(l.toFixed(precision));
  const cValue = Number(c.toFixed(precision));
  const hValue = Number(h.toFixed(precision));
  
  let alphaValue = '';
  if (includeAlpha) {
    const a = Math.random();
    alphaValue = ` ${Number(a.toFixed(precision))}`;
  }
  
  return `${colorSpace}(${lValue} ${cValue} ${hValue}${alphaValue})`;
}

// ===== LAB COLOR GENERATORS =====

/**
 * Generate a random LAB color value string
 * @param {Object} options - Configuration options
 * @param {number} [options.precision=1] - Decimal precision
 * @param {boolean} [options.includeAlpha=false] - Include alpha channel
 * @param {string} [options.colorSpace='lab'] - Color space variant
 * @returns {string} LAB color value
 */
 function generateLabColorPattern(options = {}) {
  const { precision = 1, includeAlpha = false, colorSpace = 'lab' } = options;
  
  const l = Math.random() * 100;
  const a = (Math.random() * 255) - 127.5; // -127.5 to 127.5
  const b = (Math.random() * 255) - 127.5; // -127.5 to 127.5
  
  const lValue = Number(l.toFixed(precision));
  const aValue = Number(a.toFixed(precision));
  const bValue = Number(b.toFixed(precision));
  
  let alphaValue = '';
  if (includeAlpha) {
    const alpha = Math.random();
    alphaValue = ` ${Number(alpha.toFixed(precision))}`;
  }
  
  return `${colorSpace}(${lValue} ${aValue} ${bValue}${alphaValue})`;
}

export{
  generateCmykColorString,
  generateOklabColorPattern,
  generateOklchColorPattern,
  generateLchColorPattern,
  generateLabColorPattern
}