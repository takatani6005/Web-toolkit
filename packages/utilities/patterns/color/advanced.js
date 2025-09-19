/**
 * Advanced Color Pattern Generators
 * Handles modern color spaces: LAB, LCH, OKLab, OKLCH, CMYK, HSV, HSI
 * Plus advanced conversion, mixing, and palette generation utilities
 */
import { 
  randomPercentage, 
  randomAlpha, 
  formatValue, 
  createAlphaString, 
  clamp,
  calculateLuminance,
  calculateContrastRatio,
  parseColorToRgb,
  rgbToHsv,
  rgbToLab,
  rgbToHsi,
  labToLch,
} from './utils.js';

// ===== CONSTANTS =====

const COLOR_SPACE_RANGES = {
  OKLAB: { a: 0.4, b: 0.4 },
  OKLCH: { c: 0.37 },
  LCH: { maxChroma: 132, peak: 140 },
  LAB: { minAB: -128, maxAB: 128 },
  GAUSSIAN: { std: 40 },
  WIDE_GAMUT: {
    displayP3: { 
      red: [0, 1.093], 
      green: [-0.227, 1.166], 
      blue: [-0.150, 1.059] 
    }
  }
};

const DEFAULT_OPTIONS = {
  precision: 3,
  includeAlpha: false
};

// Color space conversion matrices
const CONVERSION_MATRICES = {
  sRGB_to_XYZ: [
    [0.4124564, 0.3575761, 0.1804375],
    [0.2126729, 0.7151522, 0.0721750],
    [0.0193339, 0.1191920, 0.9503041]
  ],
  XYZ_to_sRGB: [
    [3.2404542, -1.5371385, -0.4985314],
    [-0.9692660, 1.8760108, 0.0415560],
    [0.0556434, -0.2040259, 1.0572252]
  ],
  // D65 white point
  WHITE_POINT: [0.95047, 1.00000, 1.08883]
};

// ===== UTILITY FUNCTIONS =====

/**
 * Generate random Gaussian-distributed number using Box-Muller transform
 */
const randomGaussian = (mean = 0, std = COLOR_SPACE_RANGES.GAUSSIAN.std) => {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return mean + std * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
};

/**
 * Calculate maximum chroma for given lightness in LCH color space
 */
const maxChromaForLightness = (lightness) => {
  const { peak } = COLOR_SPACE_RANGES.LCH;
  const scale = Math.sin((lightness * Math.PI) / 100);
  return peak * scale;
};

// ===== COLOR GENERATORS =====

/**
 * Generate a random CMYK color string
 */
const generateCmykColor = (options = {}) => {
  const { precision = 0 } = { ...DEFAULT_OPTIONS, ...options };
  
  const values = Array(4)
    .fill(0)
    .map(() => `${formatValue(randomPercentage(), precision)}%`)
    .join(', ');
  
  return `cmyk(${values})`;
};

/**
 * Generate a random HSV color string
 */
const generateHsvColor = (options = {}) => {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const { precision, includeAlpha } = config;
  
  const h = `${formatValue(Math.random() * 360, precision)}deg`;
  const s = `${formatValue(randomPercentage(), precision)}%`;
  const v = `${formatValue(randomPercentage(), precision)}%`;
  const alpha = createAlphaString(includeAlpha, precision);
  
  return `hsv(${h}, ${s}, ${v}${alpha})`;
};

/**
 * Generate a random HSI color string
 */
const generateHsiColor = (options = {}) => {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const { precision, includeAlpha } = config;
  
  const h = `${formatValue(Math.random() * 360, precision)}deg`;
  const s = `${formatValue(randomPercentage(), precision)}%`;
  const i = `${formatValue(randomPercentage(), precision)}%`;
  const alpha = createAlphaString(includeAlpha, precision);
  
  return `hsi(${h}, ${s}, ${i}${alpha})`;
};

/**
 * Generate a random OKLab color value string
 */
const generateOklabColor = (options = {}) => {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const { precision, includeAlpha } = config;
  const { a: aRange, b: bRange } = COLOR_SPACE_RANGES.OKLAB;
  
  const l = `${formatValue(randomPercentage(), precision)}%`;
  const a = formatValue((Math.random() - 0.5) * 2 * aRange, precision);
  const b = formatValue((Math.random() - 0.5) * 2 * bRange, precision);
  const alpha = createAlphaString(includeAlpha, precision);
  
  return `oklab(${l} ${a} ${b}${alpha})`;
};

/**
 * Generate a random OKLCH color value string
 */
const generateOklchColor = (options = {}) => {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const { precision, includeAlpha } = config;
  const { c: maxChroma } = COLOR_SPACE_RANGES.OKLCH;
  
  const l = `${formatValue(randomPercentage(), precision)}%`;
  const c = formatValue(Math.random() * maxChroma, precision);
  const h = `${formatValue(Math.random() * 360, precision)}deg`;
  const alpha = createAlphaString(includeAlpha, precision);
  
  return `oklch(${l} ${c} ${h}${alpha})`;
};

/**
 * Generate a random LCH color value string
 */
const generateLchColor = (options = {}) => {
  const config = { precision: 1, includeAlpha: false, ...options };
  const { precision, includeAlpha } = config;
  const { maxChroma } = COLOR_SPACE_RANGES.LCH;
  
  const lightness = randomPercentage();
  const chromaLimit = Math.min(maxChroma, maxChromaForLightness(lightness));
  
  const l = `${formatValue(lightness, precision)}%`;
  const c = formatValue(Math.random() * chromaLimit, precision);
  const h = `${formatValue(Math.random() * 360, precision)}deg`;
  const alpha = createAlphaString(includeAlpha, precision);
  
  return `lch(${l} ${c} ${h}${alpha})`;
};

/**
 * Generate a random LAB color value string
 */
const generateLabColor = (options = {}) => {
  const config = { 
    precision: 1, 
    includeAlpha: false, 
    colorSpace: 'lab',
    ...options 
  };
  const { precision, includeAlpha, colorSpace } = config;
  const { minAB, maxAB } = COLOR_SPACE_RANGES.LAB;
  
  const l = `${formatValue(randomPercentage(), precision)}%`;
  const a = formatValue(clamp(randomGaussian(), minAB, maxAB), precision);
  const b = formatValue(clamp(randomGaussian(), minAB, maxAB), precision);
  
  const alpha = includeAlpha ? ` ${formatValue(randomAlpha(), precision)}` : '';
  
  return `${colorSpace}(${l} ${a} ${b}${alpha})`;
};

/**
 * Generate a wide-gamut color (Display-P3)
 */
const randomWideGamutColor = (options = {}) => {
  const config = { precision: 3, colorSpace: 'display-p3', ...options };
  const { precision, colorSpace } = config;
  const { displayP3 } = COLOR_SPACE_RANGES.WIDE_GAMUT;
  
  const r = formatValue(
    displayP3.red[0] + Math.random() * (displayP3.red[1] - displayP3.red[0]), 
    precision
  );
  const g = formatValue(
    displayP3.green[0] + Math.random() * (displayP3.green[1] - displayP3.green[0]), 
    precision
  );
  const b = formatValue(
    displayP3.blue[0] + Math.random() * (displayP3.blue[1] - displayP3.blue[0]), 
    precision
  );
  
  return `color(${colorSpace} ${r} ${g} ${b})`;
};

// ===== ADVANCED COLOR PROCESSING =====

/**
 * Mix two colors with specified ratio
 */
const mixColors = (colorA, colorB, ratio = 0.5, options = {}) => {
  const { space = 'rgb', precision = 3 } = options;
  
  try {
    const rgbA = parseColorToRgb(colorA);
    const rgbB = parseColorToRgb(colorB);
    
    if (!rgbA || !rgbB) {
      throw new Error('Invalid color format');
    }
    
    if (space === 'lab') {
      const [L1, a1, b1] = rgbToLab(rgbA.r, rgbA.g, rgbA.b);
      const [L2, a2, b2] = rgbToLab(rgbB.r, rgbB.g, rgbB.b);
      
      const mixedL = L1 + (L2 - L1) * ratio;
      const mixedA = a1 + (a2 - a1) * ratio;
      const mixedB = b1 + (b2 - b1) * ratio;
      
      return `lab(${formatValue(mixedL, precision)}% ${formatValue(mixedA, precision)} ${formatValue(mixedB, precision)})`;
    }
    
    // Default RGB mixing
    const r = Math.round(rgbA.r + (rgbB.r - rgbA.r) * ratio);
    const g = Math.round(rgbA.g + (rgbB.g - rgbA.g) * ratio);
    const b = Math.round(rgbA.b + (rgbB.b - rgbA.b) * ratio);
    
    return `rgb(${r}, ${g}, ${b})`;
  } catch (error) {
    console.warn('Color mixing failed:', error.message);
    return colorA; // Return original color on error
  }
};

/**
 * Convert between color spaces
 */
const convertColor = (fromSpace, toSpace, value, options = {}) => {
  const { precision = 3 } = options;
  
  try {
    // Parse to RGB first
    const rgb = parseColorToRgb(value);
    if (!rgb) throw new Error('Invalid color value');
    
    const { r, g, b } = rgb;
    
    switch (toSpace.toLowerCase()) {
      case 'lab': {
        const [L, a, labB] = rgbToLab(r, g, b);
        return `lab(${formatValue(L, precision)}% ${formatValue(a, precision)} ${formatValue(labB, precision)})`;
      }
      
      case 'lch': {
        const [L, a, labB] = rgbToLab(r, g, b);
        const [lchL, c, h] = labToLch(L, a, labB);
        return `lch(${formatValue(lchL, precision)}% ${formatValue(c, precision)} ${formatValue(h, precision)}deg)`;
      }
      
      case 'hsi': {
        const [h, s, i] = rgbToHsi(r, g, b);
        return `hsi(${formatValue(h, precision)}deg, ${formatValue(s, precision)}%, ${formatValue(i, precision)}%)`;
      }
      
      case 'hsv': {
        const [h, s, v] = rgbToHsv(r, g, b);
        return `hsv(${formatValue(h, precision)}deg, ${formatValue(s, precision)}%, ${formatValue(v, precision)}%)`;
      }
      
      case 'rgb':
      default:
        return `rgb(${r}, ${g}, ${b})`;
    }
  } catch (error) {
    console.warn('Color conversion failed:', error.message);
    return value;
  }
};

/**
 * Calculate relative luminance according to WCAG
 */
const relativeLuminance = (color) => {
  return calculateLuminance(color); // Use existing utility
};

/**
 * Calculate contrast ratio between two colors
 */
const contrastRatio = (color1, color2) => {
  return calculateContrastRatio(color1, color2); // Use existing utility
};

/**
 * Interpolate between two colors with specified steps
 */
const interpolateColor = (color1, color2, steps = 5, space = 'lab') => {
  const colors = [];
  
  for (let i = 0; i < steps; i++) {
    const ratio = i / (steps - 1);
    colors.push(mixColors(color1, color2, ratio, { space }));
  }
  
  return colors;
};

// ===== BATCH GENERATORS =====




// ===== EXPORTS =====

export {
  // Basic generators
  generateCmykColor,
  generateOklabColor,
  generateOklchColor,
  generateLchColor,
  generateLabColor,
  generateHsvColor,
  generateHsiColor,
  randomWideGamutColor,
  
  // Advanced processing
  mixColors,
  convertColor,
  relativeLuminance,
  contrastRatio,
  interpolateColor,
  
  randomGaussian,
  maxChromaForLightness,
};