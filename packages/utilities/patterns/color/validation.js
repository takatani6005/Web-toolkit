import { parseColorString } from './parse.js';

// ===== CONSTANTS =====
const NAMED_COLORS = new Set([
  'aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure', 'beige', 'bisque',
  'black', 'blanchedalmond', 'blue', 'blueviolet', 'brown', 'burlywood',
  'cadetblue', 'chartreuse', 'chocolate', 'coral', 'cornflowerblue', 'cornsilk',
  'crimson', 'cyan', 'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray',
  'darkgreen', 'darkgrey', 'darkkhaki', 'darkmagenta', 'darkolivegreen',
  'darkorange', 'darkorchid', 'darkred', 'darksalmon', 'darkseagreen',
  'darkslateblue', 'darkslategray', 'darkslategrey', 'darkturquoise',
  'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 'dimgrey', 'dodgerblue',
  'firebrick', 'floralwhite', 'forestgreen', 'fuchsia', 'gainsboro',
  'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'greenyellow', 'grey',
  'honeydew', 'hotpink', 'indianred', 'indigo', 'ivory', 'khaki', 'lavender',
  'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral',
  'lightcyan', 'lightgoldenrodyellow', 'lightgray', 'lightgreen', 'lightgrey',
  'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslategray',
  'lightslategrey', 'lightsteelblue', 'lightyellow', 'lime', 'limegreen',
  'linen', 'magenta', 'maroon', 'mediumaquamarine', 'mediumblue', 'mediumorchid',
  'mediumpurple', 'mediumseagreen', 'mediumslateblue', 'mediumspringgreen',
  'mediumturquoise', 'mediumvioletred', 'midnightblue', 'mintcream',
  'mistyrose', 'moccasin', 'navajowhite', 'navy', 'oldlace', 'olive',
  'olivedrab', 'orange', 'orangered', 'orchid', 'palegoldenrod', 'palegreen',
  'paleturquoise', 'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink',
  'plum', 'powderblue', 'purple', 'red', 'rosybrown', 'royalblue',
  'saddlebrown', 'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna',
  'silver', 'skyblue', 'slateblue', 'slategray', 'slategrey', 'snow',
  'springgreen', 'steelblue', 'tan', 'teal', 'thistle', 'tomato', 'turquoise',
  'violet', 'wheat', 'white', 'whitesmoke', 'yellow', 'yellowgreen',
  // CSS Level 4 additions
  'rebeccapurple', 'transparent'
]);

const CSS_SYSTEM_COLORS = new Set([
  'canvas', 'canvastext', 'linktext', 'visitedtext', 'activetext',
  'buttonface', 'buttontext', 'buttonborder', 'field', 'fieldtext',
  'highlight', 'highlighttext', 'selecteditem', 'selecteditemtext',
  'mark', 'marktext', 'graytext'
]);

// Regular expressions for validation
const HEX_REGEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
const RGB_REGEX = /^rgba?\(\s*([+-]?\d+(?:\.\d+)?)\s*,\s*([+-]?\d+(?:\.\d+)?)\s*,\s*([+-]?\d+(?:\.\d+)?)\s*(?:,\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))(?:%?)?)?\s*\)$/i;
const HSL_REGEX = /^hsla?\(\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))(?:deg|grad|rad|turn)?\s*,\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))%\s*,\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))%\s*(?:,\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))(?:%?)?)?\s*\)$/i;
const HWB_REGEX = /^hwb\(\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))(?:deg|grad|rad|turn)?\s+([+-]?(?:\d+(?:\.\d+)?|\.\d+))%\s+([+-]?(?:\d+(?:\.\d+)?|\.\d+))%\s*(?:\/\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))(?:%?)?)?\s*\)$/i;
const LAB_REGEX = /^lab\(\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))%?\s+([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s+([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*(?:\/\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))(?:%?)?)?\s*\)$/i;
const LCH_REGEX = /^lch\(\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))%?\s+([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s+([+-]?(?:\d+(?:\.\d+)?|\.\d+))(?:deg|grad|rad|turn)?\s*(?:\/\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))(?:%?)?)?\s*\)$/i;
const OKLAB_REGEX = /^oklab\(\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))%?\s+([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s+([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*(?:\/\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))(?:%?)?)?\s*\)$/i;
const OKLCH_REGEX = /^oklch\(\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))%?\s+([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s+([+-]?(?:\d+(?:\.\d+)?|\.\d+))(?:deg|grad|rad|turn)?\s*(?:\/\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))(?:%?)?)?\s*\)$/i;

// ===== BASIC VALIDATION FUNCTIONS =====

/**
 * Validates CSS named colors (including system colors)
 * @param {string} colorName - The color name to validate
 * @param {Object} options - Validation options
 * @param {boolean} [options.allowSystemColors=true] - Allow CSS system colors
 * @returns {boolean} True if valid CSS named color
 */
function isValidColorName(colorName, { allowSystemColors = true } = {}) {
  if (typeof colorName !== 'string') return false;
  
  const normalizedName = colorName.toLowerCase().trim();
  
  if (NAMED_COLORS.has(normalizedName)) return true;
  if (allowSystemColors && CSS_SYSTEM_COLORS.has(normalizedName)) return true;
  
  return false;
}

/**
 * Validates hex color strings with comprehensive error checking
 * @param {string} hex - The hex color to validate
 * @param {Object} options - Validation options
 * @param {boolean} [options.allowAlpha=true] - Allow alpha channel in hex
 * @param {boolean} [options.allowShorthand=true] - Allow 3/4 digit shorthand
 * @returns {boolean} True if valid hex color
 */
function isValidHex(hex, { allowAlpha = true, allowShorthand = true } = {}) {
  if (typeof hex !== 'string') return false;
  
  const trimmed = hex.trim();
  if (!trimmed.startsWith('#')) return false;
  
  const hexDigits = trimmed.slice(1);
  if (hexDigits.length === 0) return false;
  
  // Check allowed lengths
  const allowedLengths = [];
  if (allowShorthand) {
    allowedLengths.push(3); // #RGB
    if (allowAlpha) allowedLengths.push(4); // #RGBA
  }
  allowedLengths.push(6); // #RRGGBB
  if (allowAlpha) allowedLengths.push(8); // #RRGGBBAA
  
  if (!allowedLengths.includes(hexDigits.length)) return false;
  
  return /^[0-9a-fA-F]+$/.test(hexDigits);
}

/**
 * Validates RGB/RGBA color strings with range checking
 * @param {string} rgbString - The RGB string to validate
 * @param {Object} options - Validation options
 * @param {boolean} [options.allowPercentage=true] - Allow percentage values
 * @param {boolean} [options.strictRange=true] - Enforce strict 0-255 range
 * @returns {boolean} True if valid RGB color
 */
function isValidRgbString(rgbString, { allowPercentage = true, strictRange = true } = {}) {
  if (typeof rgbString !== 'string') return false;
  
  const match = rgbString.trim().match(RGB_REGEX);
  if (!match) return false;
  
  const [, r, g, b, a] = match;
  
  // Validate RGB values
  const rgbValues = [parseFloat(r), parseFloat(g), parseFloat(b)];
  
  if (strictRange) {
    const validRange = rgbValues.every(val => val >= 0 && val <= 255);
    if (!validRange) return false;
  }
  
  // Validate alpha if present
  if (a !== undefined) {
    const alpha = parseFloat(a);
    if (isNaN(alpha) || alpha < 0 || alpha > 1) return false;
  }
  
  return true;
}

/**
 * Validates HSL/HSLA color strings with range checking
 * @param {string} hslString - The HSL string to validate
 * @param {Object} options - Validation options
 * @param {boolean} [options.strictRange=true] - Enforce strict value ranges
 * @returns {boolean} True if valid HSL color
 */
function isValidHslString(hslString, { strictRange = true } = {}) {
  if (typeof hslString !== 'string') return false;
  
  const match = hslString.trim().match(HSL_REGEX);
  if (!match) return false;
  
  const [, h, s, l, a] = match;
  
  if (strictRange) {
    const hue = parseFloat(h);
    const saturation = parseFloat(s);
    const lightness = parseFloat(l);
    
    // Hue can be any number (wraps around), but typically 0-360
    if (saturation < 0 || saturation > 100) return false;
    if (lightness < 0 || lightness > 100) return false;
  }
  
  // Validate alpha if present
  if (a !== undefined) {
    const alpha = parseFloat(a);
    if (isNaN(alpha) || alpha < 0 || alpha > 1) return false;
  }
  
  return true;
}

/**
 * Validates HWB color strings (CSS Color Level 4)
 * @param {string} hwbString - The HWB string to validate
 * @returns {boolean} True if valid HWB color
 */
function isValidHwbString(hwbString) {
  if (typeof hwbString !== 'string') return false;
  
  const match = hwbString.trim().match(HWB_REGEX);
  if (!match) return false;
  
  const [, h, w, b, a] = match;
  
  const whiteness = parseFloat(w);
  const blackness = parseFloat(b);
  
  if (whiteness < 0 || whiteness > 100) return false;
  if (blackness < 0 || blackness > 100) return false;
  
  // Validate alpha if present
  if (a !== undefined) {
    const alpha = parseFloat(a);
    if (isNaN(alpha) || alpha < 0 || alpha > 1) return false;
  }
  
  return true;
}

/**
 * Validates LAB color strings (CSS Color Level 4)
 * @param {string} labString - The LAB string to validate
 * @returns {boolean} True if valid LAB color
 */
function isValidLabString(labString) {
  if (typeof labString !== 'string') return false;
  return LAB_REGEX.test(labString.trim());
}

/**
 * Validates LCH color strings (CSS Color Level 4)
 * @param {string} lchString - The LCH string to validate
 * @returns {boolean} True if valid LCH color
 */
function isValidLchString(lchString) {
  if (typeof lchString !== 'string') return false;
  return LCH_REGEX.test(lchString.trim());
}

/**
 * Validates OKLAB color strings (CSS Color Level 4)
 * @param {string} oklabString - The OKLAB string to validate
 * @returns {boolean} True if valid OKLAB color
 */
function isValidOklabString(oklabString) {
  if (typeof oklabString !== 'string') return false;
  return OKLAB_REGEX.test(oklabString.trim());
}

/**
 * Validates OKLCH color strings (CSS Color Level 4)
 * @param {string} oklchString - The OKLCH string to validate
 * @returns {boolean} True if valid OKLCH color
 */
function isValidOklchString(oklchString) {
  if (typeof oklchString !== 'string') return false;
  return OKLCH_REGEX.test(oklchString.trim());
}

// ===== COMPREHENSIVE VALIDATION =====

/**
 * Validates any CSS color format with detailed options
 * @param {string} color - Color string to validate
 * @param {Object} options - Validation options
 * @param {boolean} [options.allowModernFormats=true] - Allow CSS Color Level 4 formats
 * @param {boolean} [options.allowSystemColors=true] - Allow CSS system colors
 * @param {boolean} [options.allowTransparent=true] - Allow 'transparent' keyword
 * @param {boolean} [options.strictSyntax=false] - Use strict syntax validation vs parsing
 * @returns {boolean} True if valid CSS color
 */
function isValidCssColor(color, {
  allowModernFormats = true,
  allowSystemColors = true,
  allowTransparent = true,
  strictSyntax = false
} = {}) {
  if (typeof color !== 'string') return false;
  
  const trimmed = color.trim();
  if (trimmed === '') return false;
  
  // Handle transparent keyword
  if (allowTransparent && trimmed.toLowerCase() === 'transparent') {
    return true;
  }
  
  if (strictSyntax) {
    // Use regex-based validation for strict syntax checking
    return (
      isValidColorName(trimmed, { allowSystemColors }) ||
      isValidHex(trimmed) ||
      isValidRgbString(trimmed) ||
      isValidHslString(trimmed) ||
      (allowModernFormats && (
        isValidHwbString(trimmed) ||
        isValidLabString(trimmed) ||
        isValidLchString(trimmed) ||
        isValidOklabString(trimmed) ||
        isValidOklchString(trimmed)
      ))
    );
  } else {
    // Use parser-based validation (more permissive)
    return parseColorString(trimmed) !== null;
  }
}

/**
 * Determines the color format type
 * @param {string} color - Color string to analyze
 * @returns {string|null} Color format type or null if invalid
 */
function getColorFormat(color) {
  if (typeof color !== 'string') return null;
  
  const trimmed = color.trim().toLowerCase();
  
  if (trimmed === 'transparent') return 'transparent';
  if (NAMED_COLORS.has(trimmed)) return 'named';
  if (CSS_SYSTEM_COLORS.has(trimmed)) return 'system';
  if (isValidHex(color)) return 'hex';
  if (isValidRgbString(color)) return color.includes('rgba') ? 'rgba' : 'rgb';
  if (isValidHslString(color)) return color.includes('hsla') ? 'hsla' : 'hsl';
  if (isValidHwbString(color)) return 'hwb';
  if (isValidLabString(color)) return 'lab';
  if (isValidLchString(color)) return 'lch';
  if (isValidOklabString(color)) return 'oklab';
  if (isValidOklchString(color)) return 'oklch';
  
  return null;
}

// ===== COMPONENT VALUE VALIDATION =====

/**
 * Validates RGB component values
 * @param {number} r - Red value (0-255)
 * @param {number} g - Green value (0-255)
 * @param {number} b - Blue value (0-255)
 * @param {number} [a] - Alpha value (0-1)
 * @returns {boolean} True if valid RGB values
 */
function isValidRGB(r, g, b, a = null) {
  const rgbValid = [r, g, b].every(val => 
    typeof val === 'number' && !isNaN(val) && val >= 0 && val <= 255
  );
  
  if (!rgbValid) return false;
  
  if (a !== null) {
    return typeof a === 'number' && !isNaN(a) && a >= 0 && a <= 1;
  }
  
  return true;
}

/**
 * Validates HSL component values
 * @param {number} h - Hue value (0-360, can wrap)
 * @param {number} s - Saturation value (0-100)
 * @param {number} l - Lightness value (0-100)
 * @param {number} [a] - Alpha value (0-1)
 * @returns {boolean} True if valid HSL values
 */
function isValidHSL(h, s, l, a = null) {
  const hValid = typeof h === 'number' && !isNaN(h);
  const slValid = [s, l].every(val => 
    typeof val === 'number' && !isNaN(val) && val >= 0 && val <= 100
  );
  
  if (!hValid || !slValid) return false;
  
  if (a !== null) {
    return typeof a === 'number' && !isNaN(a) && a >= 0 && a <= 1;
  }
  
  return true;
}

/**
 * Validates HWB component values
 * @param {number} h - Hue value (0-360, can wrap)
 * @param {number} w - Whiteness value (0-100)
 * @param {number} b - Blackness value (0-100)
 * @param {number} [a] - Alpha value (0-1)
 * @returns {boolean} True if valid HWB values
 */
function isValidHWB(h, w, b, a = null) {
  const hValid = typeof h === 'number' && !isNaN(h);
  const wbValid = [w, b].every(val => 
    typeof val === 'number' && !isNaN(val) && val >= 0 && val <= 100
  );
  
  if (!hValid || !wbValid) return false;
  
  if (a !== null) {
    return typeof a === 'number' && !isNaN(a) && a >= 0 && a <= 1;
  }
  
  return true;
}

// ===== BATCH VALIDATION =====

/**
 * Validates multiple colors and returns detailed results
 * @param {string[]} colors - Array of color strings to validate
 * @param {Object} options - Validation options
 * @returns {Array<{color: string, valid: boolean, format: string|null, error?: string}>}
 */
function validateColors(colors, options = {}) {
  if (!Array.isArray(colors)) {
    throw new TypeError('Expected an array of colors');
  }
  
  return colors.map(color => {
    try {
      const valid = isValidCssColor(color, options);
      const format = valid ? getColorFormat(color) : null;
      
      return {
        color,
        valid,
        format,
        ...(valid ? {} : { error: 'Invalid color format' })
      };
    } catch (error) {
      return {
        color,
        valid: false,
        format: null,
        error: error.message
      };
    }
  });
}

/**
 * Validates a color palette object
 * @param {Object} palette - Color palette object
 * @param {Object} options - Validation options
 * @returns {{valid: boolean, errors: Array<{key: string, error: string}>}}
 */
function validatePalette(palette, options = {}) {
  if (typeof palette !== 'object' || palette === null) {
    return {
      valid: false,
      errors: [{ key: 'root', error: 'Palette must be an object' }]
    };
  }
  
  const errors = [];
  
  for (const [key, color] of Object.entries(palette)) {
    if (!isValidCssColor(color, options)) {
      errors.push({
        key,
        error: `Invalid color: ${color}`
      });
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// ===== EXPORTS =====

export {
  // Basic validation
  isValidColorName,
  isValidHex,
  isValidRgbString,
  isValidHslString,
  isValidHwbString,
  isValidLabString,
  isValidLchString,
  isValidOklabString,
  isValidOklchString,
  
  // Comprehensive validation
  isValidCssColor,
  getColorFormat,
  
  // Component validation
  isValidRGB,
  isValidHSL,
  isValidHWB,
  
  // Batch validation
  validateColors,
  validatePalette,
  
  // Constants (for external use)
  NAMED_COLORS,
  CSS_SYSTEM_COLORS
};