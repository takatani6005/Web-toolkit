/**
 * Color Pattern Generator Library
 * Main entry point - imports and exports everything from core
 * 
 * @author Color Pattern Generator Team
 * @version 2.0.0
 * @license MIT
 */

// Import everything from core logic
import {
  VERSION,
  NAME,
  LIBRARY_INFO,
  random,
  colors,
  palette,
  convert,
  analyze,
  manipulate,
  patterns,
  theme,
  ColorInstance,
  ColorLib,
  colorLib
} from './core.js';

// Import all modules for re-export
import * as basic from './basic.js';
import * as advanced from './advanced.js';
import * as wideGamut from './wide-gamut.js';
import * as system from './system.js';
import * as regex from './regex.js';
import * as palettes from './palettes.js';
import * as utils from './utils.js';
import * as universal from './universal.js';

// ===== RE-EXPORT EVERYTHING FROM CORE =====
export {
  VERSION,
  NAME,
  random,
  colors,
  palette,
  convert,
  analyze,
  manipulate,
  patterns,
  theme,
  ColorInstance,
  ColorLib
};

// ===== RE-EXPORT ALL MODULES =====
export {
  basic,
  advanced,
  wideGamut,
  system,
  regex,
  palettes,
  utils,
  universal
};

// ===== FORMAT-SPECIFIC SHORTCUTS =====
export const hex = basic.generateHexColorPattern;
export const rgb = basic.generateRgbColorPattern;
export const rgba = basic.generateRgbaColorPattern;
export const hsl = basic.generateHslColorPattern;
export const hsla = basic.generateHslaColorPattern;
export const hwb = basic.generateHwbColorPattern;
export const named = basic.generateNamedColorPattern;

// Modern color formats
export const oklab = advanced.generateOklabColorPattern;
export const oklch = advanced.generateOklchColorPattern;
export const lab = advanced.generateLabColorPattern;
export const lch = advanced.generateLchColorPattern;
export const cmyk = advanced.generateCmykColorString;

// Wide gamut formats
export const displayP3 = wideGamut.generateDisplayP3ColorPattern;
export const rec2020 = wideGamut.generateRec2020ColorPattern;

// ===== LIBRARY INFORMATION =====
export const info = LIBRARY_INFO;

// ===== DEFAULT EXPORT =====

/**
 * Default export is the pre-configured library instance
 * This follows the pattern used by libraries like Lodash, Axios, etc.
 */
export default colorLib;

// ===== COMPATIBILITY LAYERS =====

// CommonJS compatibility (Node.js)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = colorLib;
  module.exports.default = colorLib;
  
  // Individual exports for destructuring
  Object.assign(module.exports, {
    VERSION, random, colors, palette, hex, rgb, rgba, hsl, hsla,
    basic, advanced, utils, convert, analyze, manipulate,
    info, ColorLib, ColorInstance
  });
}

// Browser globals (UMD-style)
if (typeof window !== 'undefined') {
  window.ColorLib = colorLib;
  // Also expose the class for advanced users
  window.ColorLibClass = ColorLib;
}

// AMD compatibility (RequireJS)
if (typeof define === 'function' && define.amd) {
  define('ColorLib', [], () => colorLib);
}

console.log('ColorLib version', VERSION, 'loaded successfully.');