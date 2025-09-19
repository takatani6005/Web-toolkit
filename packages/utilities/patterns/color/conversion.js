/**
 * Enhanced Color Conversion Module
 * Comprehensive color space conversions with improved precision and additional formats
 */

import {
  isValidRGB,
  isValidHSL,
  isValidHex,
  isValidHSV,
  isValidLab,
  isValidXYZ
} from './validation.js';
import { clamp, roundToPrecision, degreeToRadian, radianToDegree } from './utils.js';
import { parseColorToRgb } from './parse.js';

// Enhanced conversion matrices and constants
export const CONVERSION_CONSTANTS = {
  // Standard illuminant D65 (daylight)
  WHITE_POINT: [95.047, 100.000, 108.883],
  
  // sRGB to XYZ transformation matrix
  sRGB_to_XYZ: [
    [0.4124564, 0.3575761, 0.1804375],
    [0.2126729, 0.7151522, 0.0721750],
    [0.0193339, 0.1191920, 0.9503041]
  ],
  
  // XYZ to sRGB transformation matrix
  XYZ_to_sRGB: [
    [3.2404542, -1.5371385, -0.4985314],
    [-0.9692660, 1.8760108, 0.0415560],
    [0.0556434, -0.2040259, 1.0572252]
  ],

  // CIE Lab constants
  LAB_EPSILON: 0.008856,
  LAB_KAPPA: 903.3,
  LAB_DELTA: 6.0 / 29.0,

  // Color temperature constants
  PLANCK_CONSTANT: 6.62607015e-34,
  BOLTZMANN_CONSTANT: 1.380649e-23,
  SPEED_OF_LIGHT: 299792458
};

// ========================================
// RGB ↔ HSL Conversions (Enhanced)
// ========================================

/**
 * Convert HSL to RGB with enhanced precision and validation
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} l - Lightness (0-100)
 * @param {number} [precision=0] - Decimal places for rounding
 * @returns {number[]|null} RGB values as [r, g, b] (0-255 range) or null if invalid
 */
export function hslToRgb(h, s, l, precision = 0) {
  if (!isValidHSL(h, s, l)) {
    console.warn('Invalid HSL values provided:', { h, s, l });
    return null;
  }
  
  // Normalize inputs
  h = ((h % 360) + 360) % 360; // Ensure positive hue
  s = clamp(s, 0, 100) / 100;
  l = clamp(l, 0, 100) / 100;
  
  // Calculate chroma and intermediate values
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  
  let r, g, b;
  
  // Determine RGB values based on hue sector
  if (h >= 0 && h < 60) {
    [r, g, b] = [c, x, 0];
  } else if (h >= 60 && h < 120) {
    [r, g, b] = [x, c, 0];
  } else if (h >= 120 && h < 180) {
    [r, g, b] = [0, c, x];
  } else if (h >= 180 && h < 240) {
    [r, g, b] = [0, x, c];
  } else if (h >= 240 && h < 300) {
    [r, g, b] = [x, 0, c];
  } else {
    [r, g, b] = [c, 0, x];
  }
  
  // Convert to 0-255 range and apply precision
  const result = [
    (r + m) * 255,
    (g + m) * 255,
    (b + m) * 255
  ];
  
  return precision > 0 
    ? result.map(val => roundToPrecision(val, precision))
    : result.map(val => Math.round(val));
}

/**
 * Convert RGB to HSL with enhanced precision and validation
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @param {number} [precision=1] - Decimal places for rounding
 * @returns {number[]|null} HSL values as [h, s, l] or null if invalid
 */
export function rgbToHsl(r, g, b, precision = 1) {
  if (!isValidRGB(r, g, b)) {
    console.warn('Invalid RGB values provided:', { r, g, b });
    return null;
  }
  
  // Normalize to 0-1 range
  const rNorm = clamp(r, 0, 255) / 255;
  const gNorm = clamp(g, 0, 255) / 255;
  const bNorm = clamp(b, 0, 255) / 255;
  
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const diff = max - min;
  const sum = max + min;
  
  // Calculate lightness
  const l = sum / 2;
  
  // Handle grayscale case
  if (diff === 0) {
    return [0, 0, roundToPrecision(l * 100, precision)];
  }
  
  // Calculate saturation
  const s = l > 0.5 ? diff / (2 - sum) : diff / sum;
  
  // Calculate hue
  let h;
  switch (max) {
    case rNorm:
      h = ((gNorm - bNorm) / diff + (gNorm < bNorm ? 6 : 0)) / 6;
      break;
    case gNorm:
      h = ((bNorm - rNorm) / diff + 2) / 6;
      break;
    case bNorm:
      h = ((rNorm - gNorm) / diff + 4) / 6;
      break;
    default:
      h = 0;
  }
  
  return [
    roundToPrecision(h * 360, precision),
    roundToPrecision(s * 100, precision),
    roundToPrecision(l * 100, precision)
  ];
}

// ========================================
// RGB ↔ HSV Conversions (Enhanced)
// ========================================

/**
 * Convert RGB to HSV with enhanced precision
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @param {number} [precision=1] - Decimal places for rounding
 * @returns {number[]|null} HSV values as [h, s, v] or null if invalid
 */
export function rgbToHsv(r, g, b, precision = 1) {
  if (!isValidRGB(r, g, b)) {
    console.warn('Invalid RGB values provided:', { r, g, b });
    return null;
  }
  
  const rNorm = clamp(r, 0, 255) / 255;
  const gNorm = clamp(g, 0, 255) / 255;
  const bNorm = clamp(b, 0, 255) / 255;
  
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const diff = max - min;
  
  // Value is the maximum
  const v = max;
  
  // Saturation calculation
  const s = max === 0 ? 0 : diff / max;
  
  // Hue calculation
  let h;
  if (diff === 0) {
    h = 0; // Undefined hue for grayscale
  } else {
    switch (max) {
      case rNorm:
        h = ((gNorm - bNorm) / diff + (gNorm < bNorm ? 6 : 0)) / 6;
        break;
      case gNorm:
        h = ((bNorm - rNorm) / diff + 2) / 6;
        break;
      case bNorm:
        h = ((rNorm - gNorm) / diff + 4) / 6;
        break;
      default:
        h = 0;
    }
  }
  
  return [
    roundToPrecision(h * 360, precision),
    roundToPrecision(s * 100, precision),
    roundToPrecision(v * 100, precision)
  ];
}

/**
 * Convert HSV to RGB with enhanced precision
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} v - Value (0-100)
 * @param {number} [precision=0] - Decimal places for rounding
 * @returns {number[]|null} RGB values as [r, g, b] (0-255 range) or null if invalid
 */
export function hsvToRgb(h, s, v, precision = 0) {
  if (!isValidHSV(h, s, v)) {
    console.warn('Invalid HSV values provided:', { h, s, v });
    return null;
  }
  
  h = ((h % 360) + 360) % 360;
  s = clamp(s, 0, 100) / 100;
  v = clamp(v, 0, 100) / 100;
  
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  
  let r, g, b;
  
  if (h >= 0 && h < 60) {
    [r, g, b] = [c, x, 0];
  } else if (h >= 60 && h < 120) {
    [r, g, b] = [x, c, 0];
  } else if (h >= 120 && h < 180) {
    [r, g, b] = [0, c, x];
  } else if (h >= 180 && h < 240) {
    [r, g, b] = [0, x, c];
  } else if (h >= 240 && h < 300) {
    [r, g, b] = [x, 0, c];
  } else {
    [r, g, b] = [c, 0, x];
  }
  
  const result = [
    (r + m) * 255,
    (g + m) * 255,
    (b + m) * 255
  ];
  
  return precision > 0 
    ? result.map(val => roundToPrecision(val, precision))
    : result.map(val => Math.round(val));
}

// ========================================
// RGB ↔ HEX Conversions (Enhanced)
// ========================================

/**
 * Convert RGB to HEX with alpha support and validation
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @param {number} [a] - Alpha (0-1)
 * @param {boolean} [uppercase=false] - Return uppercase hex
 * @returns {string|null} Hex color string or null if invalid
 */
export function rgbToHex(r, g, b, a = null, uppercase = false) {
  if (!isValidRGB(r, g, b)) {
    console.warn('Invalid RGB values provided:', { r, g, b });
    return null;
  }
  
  const toHex = (c) => {
    const clamped = Math.round(clamp(c, 0, 255));
    const hex = clamped.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  let hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  
  // Add alpha channel if provided
  if (a !== null && a !== undefined) {
    const alpha = Math.round(clamp(a, 0, 1) * 255);
    hex += toHex(alpha);
  }
  
  return uppercase ? hex.toUpperCase() : hex.toLowerCase();
}

/**
 * Convert HEX to RGB with comprehensive format support
 * @param {string} hex - Hex color string
 * @param {boolean} [includeAlpha=true] - Include alpha in result when present
 * @returns {object|null} RGB object {r, g, b, a?} or null if invalid
 */
export function hexToRgb(hex, includeAlpha = true) {
  if (!isValidHex(hex)) {
    console.warn('Invalid hex color provided:', hex);
    return null;
  }
  
  // Clean and normalize hex string
  hex = hex.replace(/^#/, '').toLowerCase();
  
  // Expand 3-digit hex to 6-digit
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  
  // Expand 4-digit hex (with alpha) to 8-digit
  if (hex.length === 4) {
    hex = hex.split('').map(char => char + char).join('');
  }
  
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  const result = { r, g, b };
  
  // Handle alpha channel
  if (hex.length === 8 && includeAlpha) {
    const a = parseInt(hex.substring(6, 8), 16) / 255;
    result.a = roundToPrecision(a, 3);
  }
  
  return result;
}

// ========================================
// Advanced Color Space Conversions
// ========================================

/**
 * Convert RGB to XYZ color space (CIE 1931)
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {number[]|null} XYZ values or null if invalid
 */
export function rgbToXyz(r, g, b) {
  if (!isValidRGB(r, g, b)) {
    console.warn('Invalid RGB values provided:', { r, g, b });
    return null;
  }
  
  // Normalize and apply gamma correction (sRGB to linear RGB)
  function gammaCorrection(c) {
    c = c / 255;
    return c > 0.04045 
      ? Math.pow((c + 0.055) / 1.055, 2.4) 
      : c / 12.92;
  }

  const rLinear = gammaCorrection(r);
  const gLinear = gammaCorrection(g);
  const bLinear = gammaCorrection(b);

  // Apply transformation matrix
  const [m1, m2, m3] = CONVERSION_CONSTANTS.sRGB_to_XYZ;

  return [
    m1[0] * rLinear + m1[1] * gLinear + m1[2] * bLinear,
    m2[0] * rLinear + m2[1] * gLinear + m2[2] * bLinear,
    m3[0] * rLinear + m3[1] * gLinear + m3[2] * bLinear
  ].map(val => roundToPrecision(val * 100, 3)); // Scale to 0-100 range
}

/**
 * Convert XYZ to RGB color space
 * @param {number} x - X value (0-100)
 * @param {number} y - Y value (0-100)
 * @param {number} z - Z value (0-100)
 * @returns {number[]|null} RGB values [r, g, b] (0-255) or null if invalid
 */
export function xyzToRgb(x, y, z) {
  if (!isValidXYZ(x, y, z)) {
    console.warn('Invalid XYZ values provided:', { x, y, z });
    return null;
  }
  
  // Normalize from 0-100 to 0-1 range
  x = x / 100;
  y = y / 100;
  z = z / 100;
  
  // Apply inverse transformation matrix
  const [m1, m2, m3] = CONVERSION_CONSTANTS.XYZ_to_sRGB;
  
  let r = m1[0] * x + m1[1] * y + m1[2] * z;
  let g = m2[0] * x + m2[1] * y + m2[2] * z;
  let b = m3[0] * x + m3[1] * y + m3[2] * z;
  
  // Apply gamma correction (linear RGB to sRGB)
  function inverseGammaCorrection(c) {
    return c > 0.0031308 
      ? 1.055 * Math.pow(c, 1 / 2.4) - 0.055 
      : 12.92 * c;
  }
  
  r = inverseGammaCorrection(r);
  g = inverseGammaCorrection(g);
  b = inverseGammaCorrection(b);
  
  return [
    Math.round(clamp(r * 255, 0, 255)),
    Math.round(clamp(g * 255, 0, 255)),
    Math.round(clamp(b * 255, 0, 255))
  ];
}

/**
 * Convert XYZ to LAB color space (CIELAB)
 * @param {number} x - X value (0-100)
 * @param {number} y - Y value (0-100)
 * @param {number} z - Z value (0-100)
 * @returns {number[]|null} LAB values [L, a, b] or null if invalid
 */
export function xyzToLab(x, y, z) {
  if (!isValidXYZ(x, y, z)) {
    console.warn('Invalid XYZ values provided:', { x, y, z });
    return null;
  }
  
  const [xn, yn, zn] = CONVERSION_CONSTANTS.WHITE_POINT;

  const fx = x / xn;
  const fy = y / yn;
  const fz = z / zn;

  function labFunction(t) {
    return t > CONVERSION_CONSTANTS.LAB_EPSILON 
      ? Math.cbrt(t) 
      : (CONVERSION_CONSTANTS.LAB_KAPPA * t + 16) / 116;
  }

  const fxTransformed = labFunction(fx);
  const fyTransformed = labFunction(fy);
  const fzTransformed = labFunction(fz);

  const L = 116 * fyTransformed - 16;
  const a = 500 * (fxTransformed - fyTransformed);
  const b = 200 * (fyTransformed - fzTransformed);

  return [
    roundToPrecision(L, 2),
    roundToPrecision(a, 2),
    roundToPrecision(b, 2)
  ];
}

/**
 * Convert LAB to XYZ color space
 * @param {number} L - Lightness (0-100)
 * @param {number} a - Green-Red axis (-128 to 128)
 * @param {number} b - Blue-Yellow axis (-128 to 128)
 * @returns {number[]|null} XYZ values [x, y, z] or null if invalid
 */
export function labToXyz(L, a, b) {
  if (!isValidLab(L, a, b)) {
    console.warn('Invalid LAB values provided:', { L, a, b });
    return null;
  }
  
  const [xn, yn, zn] = CONVERSION_CONSTANTS.WHITE_POINT;
  
  const fy = (L + 16) / 116;
  const fx = a / 500 + fy;
  const fz = fy - b / 200;
  
  function inverseLab(t) {
    const t3 = t * t * t;
    return t3 > CONVERSION_CONSTANTS.LAB_EPSILON 
      ? t3 
      : (116 * t - 16) / CONVERSION_CONSTANTS.LAB_KAPPA;
  }
  
  const x = xn * inverseLab(fx);
  const y = yn * inverseLab(fy);
  const z = zn * inverseLab(fz);
  
  return [
    roundToPrecision(x, 3),
    roundToPrecision(y, 3),
    roundToPrecision(z, 3)
  ];
}

/**
 * Convert LAB to LCH color space (Lightness, Chroma, Hue)
 * @param {number} L - Lightness (0-100)
 * @param {number} a - Green-Red axis
 * @param {number} b - Blue-Yellow axis
 * @returns {number[]|null} LCH values [L, C, H] or null if invalid
 */
export function labToLch(L, a, b) {
  if (!isValidLab(L, a, b)) {
    console.warn('Invalid LAB values provided:', { L, a, b });
    return null;
  }
  
  const c = Math.sqrt(a * a + b * b);
  let h = Math.atan2(b, a) * 180 / Math.PI;
  
  // Normalize hue to 0-360 range
  h = h < 0 ? h + 360 : h;
  
  return [
    roundToPrecision(L, 2),
    roundToPrecision(c, 2),
    roundToPrecision(h, 2)
  ];
}

/**
 * Convert LCH to LAB color space
 * @param {number} L - Lightness (0-100)
 * @param {number} C - Chroma (0-100+)
 * @param {number} H - Hue (0-360)
 * @returns {number[]|null} LAB values [L, a, b] or null if invalid
 */
export function lchToLab(L, C, H) {
  if (typeof L !== 'number' || typeof C !== 'number' || typeof H !== 'number') {
    console.warn('Invalid LCH values provided:', { L, C, H });
    return null;
  }
  
  const hRad = degreeToRadian(H);
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);
  
  return [
    roundToPrecision(L, 2),
    roundToPrecision(a, 2),
    roundToPrecision(b, 2)
  ];
}

/**
 * Direct RGB to LAB conversion
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {number[]|null} LAB values [L, a, b] or null if invalid
 */
export function rgbToLab(r, g, b) {
  const xyz = rgbToXyz(r, g, b);
  return xyz ? xyzToLab(xyz[0], xyz[1], xyz[2]) : null;
}

/**
 * Direct LAB to RGB conversion
 * @param {number} L - Lightness (0-100)
 * @param {number} a - Green-Red axis
 * @param {number} b - Blue-Yellow axis
 * @returns {number[]|null} RGB values [r, g, b] or null if invalid
 */
export function labToRgb(L, a, b) {
  const xyz = labToXyz(L, a, b);
  return xyz ? xyzToRgb(xyz[0], xyz[1], xyz[2]) : null;
}

// ========================================
// HSI Color Space Conversions
// ========================================

/**
 * Convert RGB to HSI color space (Hue, Saturation, Intensity)
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {number[]|null} HSI values [h, s, i] or null if invalid
 */
export function rgbToHsi(r, g, b) {
  if (!isValidRGB(r, g, b)) {
    console.warn('Invalid RGB values provided:', { r, g, b });
    return null;
  }
  
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const intensity = (rNorm + gNorm + bNorm) / 3;
  const min = Math.min(rNorm, gNorm, bNorm);
  const saturation = intensity === 0 ? 0 : 1 - (min / intensity);

  let hue = 0;
  if (saturation !== 0) {
    const numerator = 0.5 * ((rNorm - gNorm) + (rNorm - bNorm));
    const denominator = Math.sqrt((rNorm - gNorm) ** 2 + (rNorm - bNorm) * (gNorm - bNorm));
    
    if (denominator !== 0) {
      hue = Math.acos(clamp(numerator / denominator, -1, 1)) * 180 / Math.PI;
      if (bNorm > gNorm) {
        hue = 360 - hue;
      }
    }
  }

  return [
    roundToPrecision(hue, 1),
    roundToPrecision(saturation * 100, 1),
    roundToPrecision(intensity * 100, 1)
  ];
}

/**
 * Convert HSI to RGB color space
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} i - Intensity (0-100)
 * @returns {number[]|null} RGB values [r, g, b] or null if invalid
 */
export function hsiToRgb(h, s, i) {
  if (typeof h !== 'number' || typeof s !== 'number' || typeof i !== 'number') {
    console.warn('Invalid HSI values provided:', { h, s, i });
    return null;
  }
  
  h = ((h % 360) + 360) % 360;
  s = clamp(s, 0, 100) / 100;
  i = clamp(i, 0, 100) / 100;

  const hRad = degreeToRadian(h);
  let r, g, b;

  if (h < 120) {
    b = i * (1 - s);
    r = i * (1 + (s * Math.cos(hRad)) / Math.cos(degreeToRadian(60) - hRad));
    g = 3 * i - (r + b);
  } else if (h < 240) {
    const h2 = hRad - degreeToRadian(120);
    r = i * (1 - s);
    g = i * (1 + (s * Math.cos(h2)) / Math.cos(degreeToRadian(60) - h2));
    b = 3 * i - (r + g);
  } else {
    const h3 = hRad - degreeToRadian(240);
    g = i * (1 - s);
    b = i * (1 + (s * Math.cos(h3)) / Math.cos(degreeToRadian(60) - h3));
    r = 3 * i - (g + b);
  }

  return [
    Math.round(clamp(r * 255, 0, 255)),
    Math.round(clamp(g * 255, 0, 255)),
    Math.round(clamp(b * 255, 0, 255))
  ];
}

// ========================================
// Color Temperature Conversions
// ========================================

/**
 * Convert color temperature (Kelvin) to RGB
 * @param {number} kelvin - Color temperature in Kelvin (1000-40000)
 * @returns {number[]|null} RGB values [r, g, b] or null if invalid
 */
export function kelvinToRgb(kelvin) {
  if (typeof kelvin !== 'number' || kelvin < 1000 || kelvin > 40000) {
    console.warn('Invalid Kelvin temperature provided:', kelvin);
    return null;
  }
  
  const temp = kelvin / 100;
  let r, g, b;
  
  // Calculate red
  if (temp <= 66) {
    r = 255;
  } else {
    r = temp - 60;
    r = 329.698727446 * Math.pow(r, -0.1332047592);
    r = clamp(r, 0, 255);
  }
  
  // Calculate green
  if (temp <= 66) {
    g = temp;
    g = 99.4708025861 * Math.log(g) - 161.1195681661;
  } else {
    g = temp - 60;
    g = 288.1221695283 * Math.pow(g, -0.0755148492);
  }
  g = clamp(g, 0, 255);
  
  // Calculate blue
  if (temp >= 66) {
    b = 255;
  } else if (temp <= 19) {
    b = 0;
  } else {
    b = temp - 10;
    b = 138.5177312231 * Math.log(b) - 305.0447927307;
    b = clamp(b, 0, 255);
  }
  
  return [Math.round(r), Math.round(g), Math.round(b)];
}

/**
 * Convert RGB to approximate color temperature (Kelvin)
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {number|null} Color temperature in Kelvin or null if invalid
 */
export function rgbToKelvin(r, g, b) {
  if (!isValidRGB(r, g, b)) {
    console.warn('Invalid RGB values provided:', { r, g, b });
    return null;
  }
  
  // Normalize RGB values
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  
  // Calculate chromaticity coordinates
  const total = rNorm + gNorm + bNorm;
  if (total === 0) return null;
  
  const x = rNorm / total;
  const y = gNorm / total;
  
  // McCamy's approximation formula
  const n = (x - 0.3320) / (0.1858 - y);
  const kelvin = 449 * Math.pow(n, 3) + 3525 * Math.pow(n, 2) + 6823.3 * n + 5520.33;
  
  return Math.round(clamp(kelvin, 1000, 40000));
}

// ========================================
// CMYK Color Space Conversions
// ========================================

/**
 * Convert RGB to CMYK color space
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {object|null} CMYK object {c, m, y, k} or null if invalid
 */
export function rgbToCmyk(r, g, b) {
  if (!isValidRGB(r, g, b)) {
    console.warn('Invalid RGB values provided:', { r, g, b });
    return null;
  }
  
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  
  const k = 1 - Math.max(rNorm, gNorm, bNorm);
  
  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }
  
  const c = (1 - rNorm - k) / (1 - k);
  const m = (1 - gNorm - k) / (1 - k);
  const y = (1 - bNorm - k) / (1 - k);
  
  return {
    c: roundToPrecision(c * 100, 1),
    m: roundToPrecision(m * 100, 1),
    y: roundToPrecision(y * 100, 1),
    k: roundToPrecision(k * 100, 1)
  };
}

/**
 * Convert CMYK to RGB color space
 * @param {number} c - Cyan (0-100)
 * @param {number} m - Magenta (0-100)
 * @param {number} y - Yellow (0-100)
 * @param {number} k - Black/Key (0-100)
 * @returns {number[]|null} RGB values [r, g, b] or null if invalid
 */
export function cmykToRgb(c, m, y, k) {
  if (typeof c !== 'number' || typeof m !== 'number' || 
      typeof y !== 'number' || typeof k !== 'number') {
    console.warn('Invalid CMYK values provided:', { c, m, y, k });
    return null;
  }
  
  c = clamp(c, 0, 100) / 100;
  m = clamp(m, 0, 100) / 100;
  y = clamp(y, 0, 100) / 100;
  k = clamp(k, 0, 100) / 100;
  
  const r = 255 * (1 - c) * (1 - k);
  const g = 255 * (1 - m) * (1 - k);
  const b = 255 * (1 - y) * (1 - k);
  
  return [Math.round(r), Math.round(g), Math.round(b)];
}

// ========================================
// Utility Conversion Functions
// ========================================

/**
 * Enhanced hexToHSL conversion
 * @param {string} hex - Hex color string
 * @returns {object|null} HSL object {h, s, l} or null if invalid
 */
export function hexToHsl(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  if (!hsl) return null;
  
  return {
    h: hsl[0],
    s: hsl[1],
    l: hsl[2]
  };
}

/**
 * Enhanced hslToHex conversion
 * @param {object|number} hslOrH - HSL object {h, s, l} or hue value
 * @param {number} [s] - Saturation (0-100)
 * @param {number} [l] - Lightness (0-100)
 * @returns {string|null} Hex color string or null if invalid
 */
export function hslToHex(hslOrH, s, l) {
  let h, saturation, lightness;
  
  if (typeof hslOrH === 'object') {
    h = hslOrH.h;
    saturation = hslOrH.s;
    lightness = hslOrH.l;
  } else {
    h = hslOrH;
    saturation = s;
    lightness = l;
  }
  
  const rgb = hslToRgb(h, saturation, lightness);
  return rgb ? rgbToHex(rgb[0], rgb[1], rgb[2]) : null;
}

/**
 * Convert hex to HSV
 * @param {string} hex - Hex color string
 * @returns {object|null} HSV object {h, s, v} or null if invalid
 */
export function hexToHsv(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
  if (!hsv) return null;
  
  return {
    h: hsv[0],
    s: hsv[1],
    v: hsv[2]
  };
}

/**
 * Convert HSV to hex
 * @param {object|number} hsvOrH - HSV object {h, s, v} or hue value
 * @param {number} [s] - Saturation (0-100)
 * @param {number} [v] - Value (0-100)
 * @returns {string|null} Hex color string or null if invalid
 */
export function hsvToHex(hsvOrH, s, v) {
  let h, saturation, value;
  
  if (typeof hsvOrH === 'object') {
    h = hsvOrH.h;
    saturation = hsvOrH.s;
    value = hsvOrH.v;
  } else {
    h = hsvOrH;
    saturation = s;
    value = v;
  }
  
  const rgb = hsvToRgb(h, saturation, value);
  return rgb ? rgbToHex(rgb[0], rgb[1], rgb[2]) : null;
}

// ========================================
// Universal Color Converter
// ========================================

/**
 * Convert color between any supported formats
 * @param {string|object} input - Input color in any supported format
 * @param {string} targetFormat - Target format ('hex', 'rgb', 'hsl', 'hsv', 'cmyk', 'lab', 'xyz', 'lch', 'css', 'hsi')
 * @param {object} [options={}] - Conversion options
 * @param {number} [options.precision=2] - Decimal places for floating point values
 * @param {boolean} [options.uppercase=false] - Return uppercase hex values
 * @param {boolean} [options.includeAlpha=true] - Include alpha channel when available
 * @returns {string|object|null} Converted color or null if invalid
 */
export function convertColor(input, targetFormat, options = {}) {
  const {
    precision = 2,
    uppercase = false,
    includeAlpha = true
  } = options;
  
  // Parse input to RGB first
  const rgb = parseColorToRgb ? parseColorToRgb(input) : null;
  if (!rgb) {
    console.warn('Could not parse input color:', input);
    return null;
  }
  
  const format = targetFormat.toLowerCase();
  
  switch (format) {
    case 'hex':
      return rgbToHex(rgb.r, rgb.g, rgb.b, 
        includeAlpha ? rgb.a : null, uppercase);
    
    case 'rgb':
      return includeAlpha && rgb.a !== undefined ? 
        { r: rgb.r, g: rgb.g, b: rgb.b, a: rgb.a } : 
        { r: rgb.r, g: rgb.g, b: rgb.b };
    
    case 'hsl': {
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b, precision);
      return hsl ? { h: hsl[0], s: hsl[1], l: hsl[2] } : null;
    }
    
    case 'hsv': {
      const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b, precision);
      return hsv ? { h: hsv[0], s: hsv[1], v: hsv[2] } : null;
    }
    
    case 'cmyk':
      return rgbToCmyk(rgb.r, rgb.g, rgb.b);
    
    case 'lab': {
      const lab = rgbToLab(rgb.r, rgb.g, rgb.b);
      return lab ? { l: lab[0], a: lab[1], b: lab[2] } : null;
    }
    
    case 'xyz': {
      const xyz = rgbToXyz(rgb.r, rgb.g, rgb.b);
      return xyz ? { x: xyz[0], y: xyz[1], z: xyz[2] } : null;
    }
    
    case 'lch': {
      const lab = rgbToLab(rgb.r, rgb.g, rgb.b);
      if (!lab) return null;
      const lch = labToLch(lab[0], lab[1], lab[2]);
      return lch ? { l: lch[0], c: lch[1], h: lch[2] } : null;
    }
    
    case 'hsi': {
      const hsi = rgbToHsi(rgb.r, rgb.g, rgb.b);
      return hsi ? { h: hsi[0], s: hsi[1], i: hsi[2] } : null;
    }
    
    case 'css':
      return rgb.a !== undefined ?
        `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})` :
        `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    
    case 'kelvin':
      return rgbToKelvin(rgb.r, rgb.g, rgb.b);
    
    default:
      console.warn(`Unsupported target format: ${targetFormat}`);
      return null;
  }
}

// ========================================
// Batch Conversion Functions
// ========================================

/**
 * Convert multiple colors at once
 * @param {Array} colors - Array of colors to convert
 * @param {string} targetFormat - Target format for all colors
 * @param {object} [options={}] - Conversion options
 * @returns {Array} Array of converted colors
 */
export function convertColors(colors, targetFormat, options = {}) {
  if (!Array.isArray(colors)) {
    console.warn('Colors parameter must be an array');
    return [];
  }
  
  return colors.map(color => convertColor(color, targetFormat, options))
                .filter(result => result !== null);
}

/**
 * Get all supported formats for a given color
 * @param {string|object} input - Input color
 * @param {object} [options={}] - Conversion options
 * @returns {object|null} Object containing all format conversions
 */
export function getAllFormats(input, options = {}) {
  const formats = ['hex', 'rgb', 'hsl', 'hsv', 'cmyk', 'lab', 'xyz', 'lch', 'hsi', 'css', 'kelvin'];
  const result = {};
  
  for (const format of formats) {
    const converted = convertColor(input, format, options);
    if (converted !== null) {
      result[format] = converted;
    }
  }
  
  return Object.keys(result).length > 0 ? result : null;
}

// ========================================
// Color Space Information
// ========================================

/**
 * Get information about a color space
 * @param {string} colorSpace - Color space name
 * @returns {object|null} Color space information
 */
export function getColorSpaceInfo(colorSpace) {
  const colorSpaces = {
    rgb: {
      name: 'RGB',
      fullName: 'Red, Green, Blue',
      type: 'additive',
      channels: ['red', 'green', 'blue'],
      ranges: { red: [0, 255], green: [0, 255], blue: [0, 255] },
      description: 'Device-dependent additive color model'
    },
    hsl: {
      name: 'HSL',
      fullName: 'Hue, Saturation, Lightness',
      type: 'cylindrical',
      channels: ['hue', 'saturation', 'lightness'],
      ranges: { hue: [0, 360], saturation: [0, 100], lightness: [0, 100] },
      description: 'Intuitive color model based on human perception'
    },
    hsv: {
      name: 'HSV',
      fullName: 'Hue, Saturation, Value',
      type: 'cylindrical',
      channels: ['hue', 'saturation', 'value'],
      ranges: { hue: [0, 360], saturation: [0, 100], value: [0, 100] },
      description: 'Alternative to HSL with different brightness calculation'
    },
    lab: {
      name: 'CIELAB',
      fullName: 'Lightness, a*, b*',
      type: 'perceptual',
      channels: ['lightness', 'a', 'b'],
      ranges: { lightness: [0, 100], a: [-128, 128], b: [-128, 128] },
      description: 'Perceptually uniform color space'
    },
    xyz: {
      name: 'CIE XYZ',
      fullName: 'X, Y, Z tristimulus values',
      type: 'linear',
      channels: ['x', 'y', 'z'],
      ranges: { x: [0, 100], y: [0, 100], z: [0, 100] },
      description: 'Device-independent linear color space'
    },
    cmyk: {
      name: 'CMYK',
      fullName: 'Cyan, Magenta, Yellow, Black',
      type: 'subtractive',
      channels: ['cyan', 'magenta', 'yellow', 'black'],
      ranges: { cyan: [0, 100], magenta: [0, 100], yellow: [0, 100], black: [0, 100] },
      description: 'Subtractive color model used in printing'
    },
    lch: {
      name: 'LCH',
      fullName: 'Lightness, Chroma, Hue',
      type: 'cylindrical-perceptual',
      channels: ['lightness', 'chroma', 'hue'],
      ranges: { lightness: [0, 100], chroma: [0, 150], hue: [0, 360] },
      description: 'Cylindrical representation of CIELAB'
    },
    hsi: {
      name: 'HSI',
      fullName: 'Hue, Saturation, Intensity',
      type: 'cylindrical',
      channels: ['hue', 'saturation', 'intensity'],
      ranges: { hue: [0, 360], saturation: [0, 100], intensity: [0, 100] },
      description: 'Alternative cylindrical color space'
    }
  };
  
  return colorSpaces[colorSpace.toLowerCase()] || null;
}

// ========================================
// Export All Functions
// ========================================

export {
  // Constants
  CONVERSION_CONSTANTS,
  
  // Main conversion functions are already exported above
  
  // Utility functions
  convertColors,
  getAllFormats,
  getColorSpaceInfo
};