/**
 * Enhanced Color Utility Functions
 * Comprehensive color conversion, manipulation, and analysis utilities
 * @version 2.0.0
 */
// Constants for color calculations
const WCAG_CONSTANTS = {
  NORMAL_AA: 4.5,
  NORMAL_AAA: 7,
  LARGE_AA: 3,
  LARGE_AAA: 4.5
};

const COLOR_TEMPERATURE = {
  WARM: { min: 1000, max: 4000 },
  NEUTRAL: { min: 4000, max: 6500 },
  COOL: { min: 6500, max: 10000 }
};


/**
 * Luminance and contrast calculations (enhanced)
 */

/**
 * Calculate relative luminance with improved precision
 * @param {string|object} color - Color string or RGB object
 * @returns {number|null} Relative luminance (0-1) or null if invalid
 */
function calculateLuminance(color) {
  const rgb = typeof color === 'string' ? parseColorToRgb(color) : color;
  if (!rgb) return null;
  
  const { r, g, b } = rgb;
  
  // Convert to linear RGB with enhanced precision
  const linearRgb = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  // ITU-R BT.709 coefficients
  return 0.2126 * linearRgb[0] + 0.7152 * linearRgb[1] + 0.0722 * linearRgb[2];
}

/**
 * Calculate contrast ratio with WCAG compliance checking
 * @param {string|object} color1 - First color
 * @param {string|object} color2 - Second color
 * @returns {object|null} Contrast info object or null if invalid
 */
function calculateContrastRatio(color1, color2) {
  const lum1 = calculateLuminance(color1);
  const lum2 = calculateLuminance(color2);
  
  if (lum1 === null || lum2 === null) return null;
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  const ratio = (brightest + 0.05) / (darkest + 0.05);
  
  return {
    ratio: Math.round(ratio * 100) / 100,
    AA: ratio >= WCAG_CONSTANTS.NORMAL_AA,
    AAA: ratio >= WCAG_CONSTANTS.NORMAL_AAA,
    largeAA: ratio >= WCAG_CONSTANTS.LARGE_AA,
    largeAAA: ratio >= WCAG_CONSTANTS.LARGE_AAA,
    level: ratio >= WCAG_CONSTANTS.NORMAL_AAA ? 'AAA' :
           ratio >= WCAG_CONSTANTS.NORMAL_AA ? 'AA' :
           ratio >= WCAG_CONSTANTS.LARGE_AAA ? 'Large AAA' :
           ratio >= WCAG_CONSTANTS.LARGE_AA ? 'Large AA' : 'Fail'
  };
}

/**
 * Color manipulation functions (enhanced)
 */

/**
 * Adjust color lightness with precise control
 * @param {string} color - Color string
 * @param {number} amount - Amount to adjust (-100 to 100)
 * @returns {string|null} Adjusted color in hex format or null if invalid
 */
function adjustLightness(color, amount) {
  const rgb = parseColorToRgb(color);
  if (!rgb) return null;
  
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  if (!hsl) return null;
  
  const [h, s, l] = hsl;
  const newL = clamp(l + amount, 0, 100);
  const newRgb = hslToRgb(h, s, newL);
  
  return newRgb ? rgbToHex(newRgb[0], newRgb[1], newRgb[2], rgb.a) : null;
}

/**
 * Adjust color saturation with precise control
 * @param {string} color - Color string
 * @param {number} amount - Amount to adjust (-100 to 100)
 * @returns {string|null} Adjusted color in hex format or null if invalid
 */
function adjustSaturation(color, amount) {
  const rgb = parseColorToRgb(color);
  if (!rgb) return null;
  
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  if (!hsl) return null;
  
  const [h, s, l] = hsl;
  const newS = clamp(s + amount, 0, 100);
  const newRgb = hslToRgb(h, newS, l);
  
  return newRgb ? rgbToHex(newRgb[0], newRgb[1], newRgb[2], rgb.a) : null;
}

/**
 * Rotate hue by specified degrees
 * @param {string} color - Color string
 * @param {number} degrees - Degrees to rotate (-360 to 360)
 * @returns {string|null} Rotated color in hex format or null if invalid
 */
function rotateHue(color, degrees) {
  const rgb = parseColorToRgb(color);
  if (!rgb) return null;
  
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  if (!hsl) return null;
  
  const [h, s, l] = hsl;
  const newH = ((h + degrees) % 360 + 360) % 360;
  const newRgb = hslToRgb(newH, s, l);
  
  return newRgb ? rgbToHex(newRgb[0], newRgb[1], newRgb[2], rgb.a) : null;
}

/**
 * Legacy function wrappers for backward compatibility
 */
const lightenColor = (color, percentage) => adjustLightness(color, percentage);
const darkenColor = (color, percentage) => adjustLightness(color, -percentage);
const saturateColor = (color, percentage) => adjustSaturation(color, percentage);
const desaturateColor = (color, percentage) => adjustSaturation(color, -percentage);

/**
 * Advanced color mixing with multiple blend modes
 * @param {string} color1 - First color
 * @param {string} color2 - Second color
 * @param {number} ratio - Mix ratio (0-1)
 * @param {string} mode - Blend mode ('normal', 'multiply', 'screen', 'overlay')
 * @returns {string|null} Mixed color in hex format or null if invalid
 */
function mixColors(color1, color2, ratio = 0.5, mode = 'normal') {
  const rgb1 = parseColorToRgb(color1);
  const rgb2 = parseColorToRgb(color2);
  
  if (!rgb1 || !rgb2) return null;
  
  ratio = clamp(ratio, 0, 1);
  
  let r, g, b;
  
  switch (mode.toLowerCase()) {
    case 'multiply':
      r = (rgb1.r * rgb2.r) / 255;
      g = (rgb1.g * rgb2.g) / 255;
      b = (rgb1.b * rgb2.b) / 255;
      break;
    case 'screen':
      r = 255 - ((255 - rgb1.r) * (255 - rgb2.r)) / 255;
      g = 255 - ((255 - rgb1.g) * (255 - rgb2.g)) / 255;
      b = 255 - ((255 - rgb1.b) * (255 - rgb2.b)) / 255;
      break;
    case 'overlay':
      r = rgb1.r < 128 ? 
          (2 * rgb1.r * rgb2.r) / 255 : 
          255 - (2 * (255 - rgb1.r) * (255 - rgb2.r)) / 255;
      g = rgb1.g < 128 ? 
          (2 * rgb1.g * rgb2.g) / 255 : 
          255 - (2 * (255 - rgb1.g) * (255 - rgb2.g)) / 255;
      b = rgb1.b < 128 ? 
          (2 * rgb1.b * rgb2.b) / 255 : 
          255 - (2 * (255 - rgb1.b) * (255 - rgb2.b)) / 255;
      break;
    default: // normal
      r = rgb1.r + (rgb2.r - rgb1.r) * ratio;
      g = rgb1.g + (rgb2.g - rgb1.g) * ratio;
      b = rgb1.b + (rgb2.b - rgb1.b) * ratio;
  }
  
  return rgbToHex(Math.round(r), Math.round(g), Math.round(b));
}

/**
 * Color harmony and relationship functions
 */

/**
 * Get complementary color (180° hue rotation)
 * @param {string} color - Color string
 * @returns {string|null} Complementary color in hex format or null if invalid
 */
function getComplementaryColor(color) {
  return rotateHue(color, 180);
}

/**
 * Generate triadic color scheme (120° apart)
 * @param {string} color - Base color string
 * @returns {string[]|null} Array of triadic colors or null if invalid
 */
function getTriadicColors(color) {
  const color2 = rotateHue(color, 120);
  const color3 = rotateHue(color, 240);
  
  if (color2 && color3) {
    return [color, color2, color3];
  }
  return null;
}

/**
 * Generate analogous color scheme (±30° from base)
 * @param {string} color - Base color string
 * @param {number} angle - Angle between colors (default: 30°)
 * @returns {string[]|null} Array of analogous colors or null if invalid
 */
function getAnalogousColors(color, angle = 30) {
  const color1 = rotateHue(color, -angle);
  const color2 = rotateHue(color, angle);
  
  if (color1 && color2) {
    return [color1, color, color2];
  }
  return null;
}

/**
 * Generate split-complementary color scheme
 * @param {string} color - Base color string
 * @returns {string[]|null} Array of split-complementary colors or null if invalid
 */
function getSplitComplementaryColors(color) {
  const color1 = rotateHue(color, 150);
  const color2 = rotateHue(color, 210);
  
  if (color1 && color2) {
    return [color, color1, color2];
  }
  return null;
}

/**
 * Generate tetradic (square) color scheme
 * @param {string} color - Base color string
 * @returns {string[]|null} Array of tetradic colors or null if invalid
 */
function getTetradicColors(color) {
  const colors = [90, 180, 270].map(angle => rotateHue(color, angle));
  
  if (colors.every(c => c !== null)) {
    return [color, ...colors];
  }
  return null;
}

/**
 * Color analysis functions
 */

/**
 * Determine if a color is considered "dark" with configurable threshold
 * @param {string} color - Color string
 * @param {number} threshold - Luminance threshold (0-1, default: 0.5)
 * @returns {boolean|null} True if dark, null if invalid color
 */
function isColorDark(color, threshold = 0.5) {
  const luminance = calculateLuminance(color);
  return luminance !== null ? luminance < threshold : null;
}

/**
 * Get perceived brightness using YIQ formula
 * @param {string} color - Color string
 * @returns {number|null} Brightness value (0-255) or null if invalid
 */
function getPerceivedBrightness(color) {
  const rgb = parseColorToRgb(color);
  if (!rgb) return null;
  
  return Math.round(0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b);
}

/**
 * Determine color temperature category
 * @param {string} color - Color string
 * @returns {string|null} 'warm', 'neutral', or 'cool', null if invalid
 */
function getColorTemperature(color) {
  const rgb = parseColorToRgb(color);
  if (!rgb) return null;
  
  const { r, g, b } = rgb;
  
  // Simplified color temperature estimation
  if (r > g && r > b) return 'warm';
  if (b > r && b > g) return 'cool';
  return 'neutral';
}

/**
 * Utility functions (enhanced)
 */

/**
 * Generate random color component (0-255)
 * @returns {number} Random color component
 */
function randomColorComponent() {
  return Math.floor(Math.random() * 256);
}

/**
 * Generate random percentage (0-100)
 * @param {number} precision - Decimal places (default: 0)
 * @returns {number} Random percentage
 */
function randomPercentage(precision = 0) {
  const value = Math.random() * 100;
  return precision > 0 ? Number(value.toFixed(precision)) : Math.floor(value);
}

/**
 * Generate random alpha value (0-1)
 * @param {number} precision - Decimal places (default: 3)
 * @returns {number} Random alpha value
 */
function randomAlpha(precision = 3) {
  const value = Math.random();
  return Number(value.toFixed(precision));
}

/**
 * Format numeric value with specified precision
 * @param {number} value - Value to format
 * @param {number} precision - Decimal places
 * @returns {number} Formatted value
 */
function formatValue(value, precision) {
  return Number(value.toFixed(precision));
}

/**
 * Create CSS alpha string for modern CSS syntax
 * @param {boolean} includeAlpha - Whether to include alpha
 * @param {number} precision - Alpha precision (default: 3)
 * @returns {string} Alpha string or empty string
 */
function createAlphaString(includeAlpha, precision = 3) {
  return includeAlpha ? ` / ${formatValue(randomAlpha(), precision)}` : '';
}

/**
 * Convert degrees to radians
 * @param {number} degrees - Degrees
 * @returns {number} Radians
 */
function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 * @param {number} radians - Radians
 * @returns {number} Degrees
 */
function radiansToDegrees(radians) {
  return radians * (180 / Math.PI);
}

/**
 * Advanced color generation functions
 */

/**
 * Generate random color in specified format
 * @param {string} format - Output format ('hex', 'rgb', 'hsl', 'hsv')
 * @param {object} options - Generation options
 * @returns {string|null} Random color or null if invalid format
 */
function generateRandomColor(format = 'hex', options = {}) {
  const {
    includeAlpha = false,
    hueRange = [0, 360],
    saturationRange = [0, 100],
    lightnessRange = [0, 100],
    alphaRange = [0, 1]
  } = options;
  
  const h = Math.random() * (hueRange[1] - hueRange[0]) + hueRange[0];
  const s = Math.random() * (saturationRange[1] - saturationRange[0]) + saturationRange[0];
  const l = Math.random() * (lightnessRange[1] - lightnessRange[0]) + lightnessRange[0];
  const a = includeAlpha ? 
    Math.random() * (alphaRange[1] - alphaRange[0]) + alphaRange[0] : 1;
  
  const rgb = hslToRgb(h, s, l);
  if (!rgb) return null;
  
  switch (format.toLowerCase()) {
    case 'hex':
      return rgbToHex(rgb[0], rgb[1], rgb[2], includeAlpha ? a : null);
    case 'rgb':
      return includeAlpha ? 
        `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${formatValue(a, 3)})` :
        `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    case 'hsl':
      return includeAlpha ?
        `hsla(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%, ${formatValue(a, 3)})` :
        `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
    case 'hsv':
      const hsv = rgbToHsv(rgb[0], rgb[1], rgb[2]);
      return hsv ? `hsv(${hsv[0]}, ${hsv[1]}%, ${hsv[2]}%)` : null;
    default:
      console.warn(`Unsupported format: ${format}`);
      return null;
  }
}

/**
 * Generate color palette with specified harmony
 * @param {string} baseColor - Base color for palette
 * @param {string} harmony - Harmony type ('complementary', 'triadic', 'analogous', etc.)
 * @param {number} count - Number of colors to generate
 * @returns {string[]|null} Array of colors or null if invalid
 */
function generateColorPalette(baseColor, harmony = 'analogous', count = 5) {
  const rgb = parseColorToRgb(baseColor);
  if (!rgb) return null;
  
  switch (harmony.toLowerCase()) {
    case 'complementary':
      return getComplementaryColors(baseColor, count);
    case 'triadic':
      return getTriadicColors(baseColor);
    case 'analogous':
      return getAnalogousColors(baseColor);
    case 'split-complementary':
      return getSplitComplementaryColors(baseColor);
    case 'tetradic':
      return getTetradicColors(baseColor);
    case 'monochromatic':
      return generateMonochromaticPalette(baseColor, count);
    default:
      console.warn(`Unsupported harmony type: ${harmony}`);
      return null;
  }
}

/**
 * Generate monochromatic palette by varying lightness
 * @param {string} baseColor - Base color
 * @param {number} count - Number of colors
 * @returns {string[]|null} Array of monochromatic colors or null if invalid
 */
function generateMonochromaticPalette(baseColor, count = 5) {
  const rgb = parseColorToRgb(baseColor);
  if (!rgb) return null;
  
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  if (!hsl) return null;
  
  const [h, s] = hsl;
  const colors = [];
  
  for (let i = 0; i < count; i++) {
    const lightness = (100 / (count - 1)) * i;
    const newRgb = hslToRgb(h, s, lightness);
    if (newRgb) {
      colors.push(rgbToHex(newRgb[0], newRgb[1], newRgb[2]));
    }
  }
  
  return colors.length === count ? colors : null;
}

/**
 * Generate complementary colors with variations
 * @param {string} baseColor - Base color
 * @param {number} count - Number of colors to generate
 * @returns {string[]|null} Array of complementary colors or null if invalid
 */
function getComplementaryColors(baseColor, count = 2) {
  const complementary = getComplementaryColor(baseColor);
  if (!complementary) return null;
  
  if (count <= 2) {
    return [baseColor, complementary];
  }
  
  // Generate variations by adjusting lightness
  const colors = [baseColor, complementary];
  const rgb = parseColorToRgb(baseColor);
  const compRgb = parseColorToRgb(complementary);
  
  if (!rgb || !compRgb) return null;
  
  for (let i = 2; i < count; i++) {
    const variation = i % 2 === 0 ? 
      adjustLightness(baseColor, (i / 2) * 10) :
      adjustLightness(complementary, (Math.floor(i / 2)) * 10);
    
    if (variation) colors.push(variation);
  }
  
  return colors.slice(0, count);
}

/**
 * Accessibility and WCAG compliance functions
 */

/**
 * Find best text color (black or white) for background
 * @param {string} backgroundColor - Background color
 * @returns {string|null} Best text color ('#000000' or '#ffffff') or null if invalid
 */
function getBestTextColor(backgroundColor) {
  const blackContrast = calculateContrastRatio(backgroundColor, '#000000');
  const whiteContrast = calculateContrastRatio(backgroundColor, '#ffffff');
  
  if (!blackContrast || !whiteContrast) return null;
  
  return blackContrast.ratio > whiteContrast.ratio ? '#000000' : '#ffffff';
}

/**
 * Generate accessible color that meets contrast requirements
 * @param {string} backgroundColor - Background color
 * @param {number} targetRatio - Target contrast ratio (default: 4.5)
 * @param {string} preferredDirection - 'lighter' or 'darker'
 * @returns {string|null} Accessible color or null if impossible
 */
function generateAccessibleColor(backgroundColor, targetRatio = 4.5, preferredDirection = 'auto') {
  const bgRgb = parseColorToRgb(backgroundColor);
  if (!bgRgb) return null;
  
  const bgLuminance = calculateLuminance(backgroundColor);
  if (bgLuminance === null) return null;
  
  const bgHsl = rgbToHsl(bgRgb.r, bgRgb.g, bgRgb.b);
  if (!bgHsl) return null;
  
  let direction = preferredDirection;
  if (direction === 'auto') {
    direction = bgLuminance > 0.5 ? 'darker' : 'lighter';
  }
  
  // Calculate target luminance
  const targetLuminance = direction === 'lighter' 
    ? (bgLuminance + 0.05) * targetRatio - 0.05
    : (bgLuminance + 0.05) / targetRatio - 0.05;
  
  const clampedLuminance = clamp(targetLuminance, 0, 1);
  
  // Convert luminance back to lightness (approximation)
  const targetLightness = Math.sqrt(clampedLuminance) * 100;
  
  const [h, s] = bgHsl;
  const adjustedS = Math.max(0, s - 10); // Slightly desaturate for better readability
  
  const finalLightness = direction === 'lighter' 
    ? Math.max(targetLightness, bgHsl[2] + 10)
    : Math.min(targetLightness, bgHsl[2] - 10);
  
  const newRgb = hslToRgb(h, adjustedS, clamp(finalLightness, 0, 100));
  
  return newRgb ? rgbToHex(newRgb[0], newRgb[1], newRgb[2]) : null;
}

/**
 * Color conversion helper functions
 */


/**
 * Legacy compatibility functions
 */

/**
 * Generate color for contrast (legacy compatibility)
 * @deprecated Use generateAccessibleColor instead
 */
function generateColorForContrast(bgLuminance, targetRatio, direction, bgHSL) {
  console.warn('generateColorForContrast is deprecated. Use generateAccessibleColor instead.');
  
  const targetLuminance = direction === 'darker' 
    ? (bgLuminance + 0.05) / targetRatio - 0.05
    : (bgLuminance + 0.05) * targetRatio - 0.05;
  
  const clampedLuminance = clamp(targetLuminance, 0, 1);
  const targetLightness = Math.sqrt(clampedLuminance) * 100;
  
  return hslToHex({
    h: bgHSL.h,
    s: Math.max(0, bgHSL.s - 10),
    l: direction === 'darker' 
      ? Math.min(targetLightness, bgHSL.l - 10)
      : Math.max(targetLightness, bgHSL.l + 10)
  });
}
/**
 * Enhanced Color Utility Functions
 * Mathematical and utility functions for color operations
 */

// ========================================
// Mathematical Constants
// ========================================

const MATH_CONSTANTS = {
  PI: Math.PI,
  TWO_PI: Math.PI * 2,
  HALF_PI: Math.PI / 2,
  DEG_TO_RAD: Math.PI / 180,
  RAD_TO_DEG: 180 / Math.PI,
  GOLDEN_RATIO: 1.618033988749895,
  EULER: Math.E
};

// ========================================
// Number Utilities
// ========================================

/**
 * Clamp a number between min and max values
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export function clamp(value, min, max) {
  if (typeof value !== 'number' || isNaN(value)) {
    console.warn('Invalid value provided to clamp:', value);
    return min;
  }
  
  if (min > max) {
    console.warn('Min value is greater than max value:', { min, max });
    [min, max] = [max, min]; // Swap values
  }
  
  return Math.max(min, Math.min(max, value));
}

/**
 * Round a number to specified decimal places with proper precision handling
 * @param {number} value - Number to round
 * @param {number} precision - Number of decimal places (0-15)
 * @returns {number} Rounded number
 */
export function roundToPrecision(value, precision = 2) {
  if (typeof value !== 'number' || isNaN(value)) {
    console.warn('Invalid value provided to roundToPrecision:', value);
    return 0;
  }
  
  if (typeof precision !== 'number' || precision < 0 || precision > 15) {
    console.warn('Invalid precision provided, using default (2):', precision);
    precision = 2;
  }
  
  // Handle edge cases
  if (!isFinite(value)) {
    return value;
  }
  
  // Use parseFloat to avoid floating point precision issues
  const factor = Math.pow(10, precision);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/**
 * Round to a specific number of significant figures
 * @param {number} value - Number to round
 * @param {number} sigFigs - Number of significant figures (1-15)
 * @returns {number} Rounded number
 */
export function roundToSignificantFigures(value, sigFigs = 3) {
  if (typeof value !== 'number' || isNaN(value) || value === 0) {
    return value;
  }
  
  if (typeof sigFigs !== 'number' || sigFigs < 1 || sigFigs > 15) {
    console.warn('Invalid significant figures provided, using default (3):', sigFigs);
    sigFigs = 3;
  }
  
  const magnitude = Math.floor(Math.log10(Math.abs(value)));
  const scale = Math.pow(10, magnitude - sigFigs + 1);
  
  return Math.round(value / scale) * scale;
}

/**
 * Check if two numbers are approximately equal within a tolerance
 * @param {number} a - First number
 * @param {number} b - Second number
 * @param {number} [tolerance=1e-10] - Tolerance for comparison
 * @returns {boolean} True if numbers are approximately equal
 */
export function isApproximatelyEqual(a, b, tolerance = 1e-10) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    return false;
  }
  
  return Math.abs(a - b) <= tolerance;
}

// ========================================
// Angle Conversion Functions
// ========================================

/**
 * Convert degrees to radians with input validation
 * @param {number} degrees - Angle in degrees
 * @returns {number} Angle in radians
 */
export function degreeToRadian(degrees) {
  if (typeof degrees !== 'number' || isNaN(degrees)) {
    console.warn('Invalid degrees value provided:', degrees);
    return 0;
  }
  
  return degrees * MATH_CONSTANTS.DEG_TO_RAD;
}

/**
 * Convert radians to degrees with input validation
 * @param {number} radians - Angle in radians
 * @returns {number} Angle in degrees
 */
export function radianToDegree(radians) {
  if (typeof radians !== 'number' || isNaN(radians)) {
    console.warn('Invalid radians value provided:', radians);
    return 0;
  }
  
  return radians * MATH_CONSTANTS.RAD_TO_DEG;
}

/**
 * Normalize angle to 0-360 degree range
 * @param {number} degrees - Angle in degrees
 * @returns {number} Normalized angle (0-360)
 */
export function normalizeAngle(degrees) {
  if (typeof degrees !== 'number' || isNaN(degrees)) {
    console.warn('Invalid degrees value provided:', degrees);
    return 0;
  }
  
  degrees = degrees % 360;
  return degrees < 0 ? degrees + 360 : degrees;
}

/**
 * Normalize angle to 0-2π radian range
 * @param {number} radians - Angle in radians
 * @returns {number} Normalized angle (0-2π)
 */
export function normalizeAngleRadians(radians) {
  if (typeof radians !== 'number' || isNaN(radians)) {
    console.warn('Invalid radians value provided:', radians);
    return 0;
  }
  
  radians = radians % MATH_CONSTANTS.TWO_PI;
  return radians < 0 ? radians + MATH_CONSTANTS.TWO_PI : radians;
}

/**
 * Calculate the angular difference between two angles in degrees
 * @param {number} angle1 - First angle in degrees
 * @param {number} angle2 - Second angle in degrees
 * @returns {number} Angular difference (-180 to 180)
 */
export function angleDifference(angle1, angle2) {
  if (typeof angle1 !== 'number' || typeof angle2 !== 'number') {
    console.warn('Invalid angle values provided:', { angle1, angle2 });
    return 0;
  }
  
  let diff = normalizeAngle(angle2 - angle1);
  return diff > 180 ? diff - 360 : diff;
}

// ========================================
// Interpolation Functions
// ========================================

/**
 * Linear interpolation between two values
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} t - Interpolation factor (0-1)
 * @returns {number} Interpolated value
 */
export function lerp(start, end, t) {
  if (typeof start !== 'number' || typeof end !== 'number' || typeof t !== 'number') {
    console.warn('Invalid parameters provided to lerp:', { start, end, t });
    return start;
  }
  
  t = clamp(t, 0, 1);
  return start + (end - start) * t;
}

/**
 * Inverse linear interpolation - find t value for a given interpolated result
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} value - Current value
 * @returns {number} t value (0-1)
 */
export function inverseLerp(start, end, value) {
  if (typeof start !== 'number' || typeof end !== 'number' || typeof value !== 'number') {
    console.warn('Invalid parameters provided to inverseLerp:', { start, end, value });
    return 0;
  }
  
  if (isApproximatelyEqual(start, end)) {
    return 0;
  }
  
  return clamp((value - start) / (end - start), 0, 1);
}

/**
 * Smooth step interpolation (cubic Hermite interpolation)
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} t - Interpolation factor (0-1)
 * @returns {number} Smoothly interpolated value
 */
export function smoothStep(start, end, t) {
  if (typeof start !== 'number' || typeof end !== 'number' || typeof t !== 'number') {
    console.warn('Invalid parameters provided to smoothStep:', { start, end, t });
    return start;
  }
  
  t = clamp(t, 0, 1);
  t = t * t * (3 - 2 * t); // Cubic Hermite interpolation
  return lerp(start, end, t);
}

/**
 * Smoother step interpolation (quintic interpolation)
 * @param {number} start - Start value
 * @param {number} end - End value  
 * @param {number} t - Interpolation factor (0-1)
 * @returns {number} Very smoothly interpolated value
 */
export function smootherStep(start, end, t) {
  if (typeof start !== 'number' || typeof end !== 'number' || typeof t !== 'number') {
    console.warn('Invalid parameters provided to smootherStep:', { start, end, t });
    return start;
  }
  
  t = clamp(t, 0, 1);
  t = t * t * t * (t * (t * 6 - 15) + 10); // Quintic interpolation
  return lerp(start, end, t);
}

// ========================================
// Range and Mapping Functions
// ========================================

/**
 * Map a value from one range to another
 * @param {number} value - Value to map
 * @param {number} inMin - Input range minimum
 * @param {number} inMax - Input range maximum
 * @param {number} outMin - Output range minimum
 * @param {number} outMax - Output range maximum
 * @returns {number} Mapped value
 */
export function mapRange(value, inMin, inMax, outMin, outMax) {
  if (typeof value !== 'number' || typeof inMin !== 'number' || 
      typeof inMax !== 'number' || typeof outMin !== 'number' || 
      typeof outMax !== 'number') {
    console.warn('Invalid parameters provided to mapRange');
    return outMin;
  }
  
  if (isApproximatelyEqual(inMin, inMax)) {
    console.warn('Input range has zero width');
    return outMin;
  }
  
  const t = (value - inMin) / (inMax - inMin);
  return outMin + t * (outMax - outMin);
}

/**
 * Check if a value is within a specified range
 * @param {number} value - Value to check
 * @param {number} min - Range minimum
 * @param {number} max - Range maximum
 * @param {boolean} [inclusive=true] - Whether range is inclusive
 * @returns {boolean} True if value is in range
 */
export function inRange(value, min, max, inclusive = true) {
  if (typeof value !== 'number' || typeof min !== 'number' || typeof max !== 'number') {
    return false;
  }
  
  if (min > max) {
    [min, max] = [max, min];
  }
  
  return inclusive ? 
    (value >= min && value <= max) : 
    (value > min && value < max);
}

// ========================================
// Array Utilities
// ========================================

/**
 * Round all numbers in an array to specified precision
 * @param {number[]} array - Array of numbers
 * @param {number} [precision=2] - Decimal places
 * @returns {number[]} Array with rounded values
 */
export function roundArray(array, precision = 2) {
  if (!Array.isArray(array)) {
    console.warn('Invalid array provided to roundArray:', array);
    return [];
  }
  
  return array.map(value => 
    typeof value === 'number' ? roundToPrecision(value, precision) : value
  );
}

/**
 * Clamp all numbers in an array to specified range
 * @param {number[]} array - Array of numbers
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number[]} Array with clamped values
 */
export function clampArray(array, min, max) {
  if (!Array.isArray(array)) {
    console.warn('Invalid array provided to clampArray:', array);
    return [];
  }
  
  return array.map(value => 
    typeof value === 'number' ? clamp(value, min, max) : value
  );
}

// ========================================
// Validation Utilities
// ========================================

/**
 * Validate if a value is a finite number
 * @param {any} value - Value to validate
 * @returns {boolean} True if value is a finite number
 */
export function isValidNumber(value) {
  return typeof value === 'number' && isFinite(value) && !isNaN(value);
}

/**
 * Validate if all values in an array are finite numbers
 * @param {any[]} array - Array to validate
 * @returns {boolean} True if all values are finite numbers
 */
export function areAllValidNumbers(array) {
  if (!Array.isArray(array)) {
    return false;
  }
  
  return array.every(value => isValidNumber(value));
}

/**
 * Sanitize a number by ensuring it's valid and finite
 * @param {any} value - Value to sanitize
 * @param {number} [fallback=0] - Fallback value for invalid inputs
 * @returns {number} Sanitized number
 */
export function sanitizeNumber(value, fallback = 0) {
  if (isValidNumber(value)) {
    return value;
  }
  
  // Try to parse if it's a string
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    if (isValidNumber(parsed)) {
      return parsed;
    }
  }
  
  console.warn('Invalid number provided, using fallback:', { value, fallback });
  return fallback;
}

// ========================================
// Statistical Functions
// ========================================

/**
 * Calculate the average of an array of numbers
 * @param {number[]} array - Array of numbers
 * @returns {number|null} Average value or null if invalid
 */
export function average(array) {
  if (!Array.isArray(array) || array.length === 0) {
    console.warn('Invalid or empty array provided to average');
    return null;
  }
  
  const validNumbers = array.filter(isValidNumber);
  
  if (validNumbers.length === 0) {
    console.warn('No valid numbers found in array');
    return null;
  }
  
  const sum = validNumbers.reduce((acc, val) => acc + val, 0);
  return sum / validNumbers.length;
}

/**
 * Find the minimum value in an array
 * @param {number[]} array - Array of numbers
 * @returns {number|null} Minimum value or null if invalid
 */
export function arrayMin(array) {
  if (!Array.isArray(array) || array.length === 0) {
    return null;
  }
  
  const validNumbers = array.filter(isValidNumber);
  return validNumbers.length > 0 ? Math.min(...validNumbers) : null;
}

/**
 * Find the maximum value in an array
 * @param {number[]} array - Array of numbers
 * @returns {number|null} Maximum value or null if invalid
 */
export function arrayMax(array) {
  if (!Array.isArray(array) || array.length === 0) {
    return null;
  }
  
  const validNumbers = array.filter(isValidNumber);
  return validNumbers.length > 0 ? Math.max(...validNumbers) : null;
}

// ========================================
// Performance Utilities
// ========================================

/**
 * Memoize a function to cache results
 * @param {Function} fn - Function to memoize
 * @param {Function} [keyGenerator] - Custom key generator function
 * @returns {Function} Memoized function
 */
export function memoize(fn, keyGenerator) {
  if (typeof fn !== 'function') {
    throw new Error('First argument must be a function');
  }
  
  const cache = new Map();
  
  return function memoized(...args) {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

/**
 * Debounce a function to limit how often it can be called
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(fn, delay) {
  if (typeof fn !== 'function') {
    throw new Error('First argument must be a function');
  }
  
  let timeoutId;
  
  return function debounced(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// ========================================
// Export All Functions
// ========================================


// Export all functions for use in other modules
export {
  MATH_CONSTANTS,
  
  
  // Luminance and contrast
  calculateLuminance,
  calculateContrastRatio,
  
  // Color manipulation
  adjustLightness,
  adjustSaturation,
  rotateHue,
  mixColors,
  
  // Legacy compatibility
  lightenColor,
  darkenColor,
  saturateColor,
  desaturateColor,
  
  // Color relationships
  getComplementaryColor,
  getTriadicColors,
  getAnalogousColors,
  getSplitComplementaryColors,
  getTetradicColors,
  
  // Color analysis
  isColorDark,
  getPerceivedBrightness,
  getColorTemperature,
  
  // Color generation
  generateRandomColor,
  generateColorPalette,
  generateMonochromaticPalette,
  getComplementaryColors,
  
  // Accessibility
  getBestTextColor,
  generateAccessibleColor,
  
  // Utility functions
  
  randomColorComponent,
  randomPercentage,
  randomAlpha,
  formatValue,
  createAlphaString,
  degreesToRadians,
  radiansToDegrees,
  
  // Legacy compatibility
  generateColorForContrast,
  
  // Constants
  WCAG_CONSTANTS,
  COLOR_TEMPERATURE,
};