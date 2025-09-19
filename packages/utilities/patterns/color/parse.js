import {
  isValidRGB
} from './validation.js';
import {
  clamp,
  roundToDecimals
} from './utils.js';
import {
  hslToRgb,
  hsvToRgb,
  hwbToRgb,
  labToRgb,
  lchToRgb,
  oklabToRgb,
  oklchToRgb
} from './conversion.js';

// Extended named colors with CSS4 specification
const NAMED_COLORS = {
  // Basic colors
  'white': [255, 255, 255],
  'black': [0, 0, 0],
  'red': [255, 0, 0],
  'green': [0, 128, 0],
  'blue': [0, 0, 255],
  'yellow': [255, 255, 0],
  'cyan': [0, 255, 255],
  'magenta': [255, 0, 255],
  'silver': [192, 192, 192],
  'gray': [128, 128, 128],
  'grey': [128, 128, 128], // Alternative spelling
  'maroon': [128, 0, 0],
  'olive': [128, 128, 0],
  'lime': [0, 255, 0],
  'aqua': [0, 255, 255],
  'teal': [0, 128, 128],
  'navy': [0, 0, 128],
  'fuchsia': [255, 0, 255],
  'purple': [128, 0, 128],
  
  // Extended colors
  'orange': [255, 165, 0],
  'pink': [255, 192, 203],
  'brown': [165, 42, 42],
  'gold': [255, 215, 0],
  'violet': [238, 130, 238],
  'indigo': [75, 0, 130],
  'turquoise': [64, 224, 208],
  'coral': [255, 127, 80],
  'salmon': [250, 128, 114],
  'khaki': [240, 230, 140],
  'plum': [221, 160, 221],
  'orchid': [218, 112, 214],
  'crimson': [220, 20, 60],
  'chocolate': [210, 105, 30],
  'peru': [205, 133, 63],
  'tan': [210, 180, 140],
  'beige': [245, 245, 220],
  'ivory': [255, 255, 240],
  'lavender': [230, 230, 250],
  'azure': [240, 255, 255],
  
  // Additional CSS4 named colors
  'aliceblue': [240, 248, 255],
  'antiquewhite': [250, 235, 215],
  'blanchedalmond': [255, 235, 205],
  'blueviolet': [138, 43, 226],
  'burlywood': [222, 184, 135],
  'cadetblue': [95, 158, 160],
  'chartreuse': [127, 255, 0],
  'cornflowerblue': [100, 149, 237],
  'cornsilk': [255, 248, 220],
  'darkblue': [0, 0, 139],
  'darkcyan': [0, 139, 139],
  'darkgoldenrod': [184, 134, 11],
  'darkgray': [169, 169, 169],
  'darkgrey': [169, 169, 169],
  'darkgreen': [0, 100, 0],
  'darkkhaki': [189, 183, 107],
  'darkmagenta': [139, 0, 139],
  'darkolivegreen': [85, 107, 47],
  'darkorange': [255, 140, 0],
  'darkorchid': [153, 50, 204],
  'darkred': [139, 0, 0],
  'darksalmon': [233, 150, 122],
  'darkseagreen': [143, 188, 143],
  'darkslateblue': [72, 61, 139],
  'darkslategray': [47, 79, 79],
  'darkslategrey': [47, 79, 79],
  'darkturquoise': [0, 206, 209],
  'darkviolet': [148, 0, 211],
  'deeppink': [255, 20, 147],
  'deepskyblue': [0, 191, 255],
  'dimgray': [105, 105, 105],
  'dimgrey': [105, 105, 105],
  'dodgerblue': [30, 144, 255],
  'firebrick': [178, 34, 34],
  'floralwhite': [255, 250, 240],
  'forestgreen': [34, 139, 34],
  'gainsboro': [220, 220, 220],
  'ghostwhite': [248, 248, 255],
  'goldenrod': [218, 165, 32],
  'greenyellow': [173, 255, 47],
  'honeydew': [240, 255, 240],
  'hotpink': [255, 105, 180],
  'indianred': [205, 92, 92],
  'lawngreen': [124, 252, 0],
  'lemonchiffon': [255, 250, 205],
  'lightblue': [173, 216, 230],
  'lightcoral': [240, 128, 128],
  'lightcyan': [224, 255, 255],
  'lightgoldenrodyellow': [250, 250, 210],
  'lightgray': [211, 211, 211],
  'lightgrey': [211, 211, 211],
  'lightgreen': [144, 238, 144],
  'lightpink': [255, 182, 193],
  'lightsalmon': [255, 160, 122],
  'lightseagreen': [32, 178, 170],
  'lightskyblue': [135, 206, 250],
  'lightslategray': [119, 136, 153],
  'lightslategrey': [119, 136, 153],
  'lightsteelblue': [176, 196, 222],
  'lightyellow': [255, 255, 224],
  'limegreen': [50, 205, 50],
  'linen': [250, 240, 230],
  'mediumaquamarine': [102, 205, 170],
  'mediumblue': [0, 0, 205],
  'mediumorchid': [186, 85, 211],
  'mediumpurple': [147, 112, 219],
  'mediumseagreen': [60, 179, 113],
  'mediumslateblue': [123, 104, 238],
  'mediumspringgreen': [0, 250, 154],
  'mediumturquoise': [72, 209, 204],
  'mediumvioletred': [199, 21, 133],
  'midnightblue': [25, 25, 112],
  'mintcream': [245, 255, 250],
  'mistyrose': [255, 228, 225],
  'moccasin': [255, 228, 181],
  'navajowhite': [255, 222, 173],
  'oldlace': [253, 245, 230],
  'olivedrab': [107, 142, 35],
  'orangered': [255, 69, 0],
  'palegoldenrod': [238, 232, 170],
  'palegreen': [152, 251, 152],
  'paleturquoise': [175, 238, 238],
  'palevioletred': [219, 112, 147],
  'papayawhip': [255, 239, 213],
  'peachpuff': [255, 218, 185],
  'rosybrown': [188, 143, 143],
  'royalblue': [65, 105, 225],
  'saddlebrown': [139, 69, 19],
  'sandybrown': [244, 164, 96],
  'seagreen': [46, 139, 87],
  'seashell': [255, 245, 238],
  'sienna': [160, 82, 45],
  'skyblue': [135, 206, 235],
  'slateblue': [106, 90, 205],
  'slategray': [112, 128, 144],
  'slategrey': [112, 128, 144],
  'snow': [255, 250, 250],
  'springgreen': [0, 255, 127],
  'steelblue': [70, 130, 180],
  'thistle': [216, 191, 216],
  'tomato': [255, 99, 71],
  'wheat': [245, 222, 179],
  'whitesmoke': [245, 245, 245],
  'yellowgreen': [154, 205, 50],
  
  // System colors (approximations)
  'transparent': [0, 0, 0, 0],
  'currentcolor': null // Special handling required
};

// Color format parsers
const COLOR_PARSERS = {
  // RGB/RGBA parser with enhanced flexibility
  rgb: {
    regex: /^rgba?\(\s*([^)]+)\s*\)$/i,
    parse: (match, values) => {
      const parts = values.split(/[,\s\/]+/).map(v => v.trim()).filter(Boolean);
      
      if (parts.length < 3) return null;
      
      let r, g, b, a = 1;
      
      // Handle percentage values
      if (parts[0].includes('%')) {
        r = Math.round((parseFloat(parts[0]) / 100) * 255);
        g = Math.round((parseFloat(parts[1]) / 100) * 255);
        b = Math.round((parseFloat(parts[2]) / 100) * 255);
      } else {
        r = parseInt(parts[0], 10);
        g = parseInt(parts[1], 10);
        b = parseInt(parts[2], 10);
      }
      
      if (parts[3] !== undefined) {
        a = parts[3].includes('%') ? parseFloat(parts[3]) / 100 : parseFloat(parts[3]);
      }
      
      if (!isValidRGB(r, g, b)) return null;
      
      return {
        type: parts[3] !== undefined ? 'rgba' : 'rgb',
        r: clamp(r, 0, 255),
        g: clamp(g, 0, 255),
        b: clamp(b, 0, 255),
        a: clamp(a, 0, 1),
        values: parts[3] !== undefined ? [r, g, b, a] : [r, g, b]
      };
    }
  },
  
  // HSL/HSLA parser
  hsl: {
    regex: /^hsla?\(\s*([^)]+)\s*\)$/i,
    parse: (match, values) => {
      const parts = values.split(/[,\s\/]+/).map(v => v.trim()).filter(Boolean);
      
      if (parts.length < 3) return null;
      
      const h = parseFloat(parts[0]) % 360;
      const s = parseFloat(parts[1].replace('%', ''));
      const l = parseFloat(parts[2].replace('%', ''));
      const a = parts[3] !== undefined ? 
        (parts[3].includes('%') ? parseFloat(parts[3]) / 100 : parseFloat(parts[3])) : 1;
      
      return {
        type: parts[3] !== undefined ? 'hsla' : 'hsl',
        h: h < 0 ? h + 360 : h,
        s: clamp(s, 0, 100),
        l: clamp(l, 0, 100),
        a: clamp(a, 0, 1),
        values: parts[3] !== undefined ? [h, s + '%', l + '%', a] : [h, s + '%', l + '%']
      };
    }
  },
  
  // HSV parser
  hsv: {
    regex: /^hsv\(\s*([^)]+)\s*\)$/i,
    parse: (match, values) => {
      const parts = values.split(/[,\s]+/).map(v => v.trim()).filter(Boolean);
      
      if (parts.length < 3) return null;
      
      const h = parseFloat(parts[0]) % 360;
      const s = parseFloat(parts[1].replace('%', ''));
      const v = parseFloat(parts[2].replace('%', ''));
      
      return {
        type: 'hsv',
        h: h < 0 ? h + 360 : h,
        s: clamp(s, 0, 100),
        v: clamp(v, 0, 100),
        values: [h, s + '%', v + '%']
      };
    }
  },
  
  // HWB parser (CSS4)
  hwb: {
    regex: /^hwb\(\s*([^)]+)\s*\)$/i,
    parse: (match, values) => {
      const parts = values.split(/[,\s\/]+/).map(v => v.trim()).filter(Boolean);
      
      if (parts.length < 3) return null;
      
      const h = parseFloat(parts[0]) % 360;
      const w = parseFloat(parts[1].replace('%', ''));
      const b = parseFloat(parts[2].replace('%', ''));
      const a = parts[3] !== undefined ? 
        (parts[3].includes('%') ? parseFloat(parts[3]) / 100 : parseFloat(parts[3])) : 1;
      
      return {
        type: 'hwb',
        h: h < 0 ? h + 360 : h,
        w: clamp(w, 0, 100),
        b: clamp(b, 0, 100),
        a: clamp(a, 0, 1),
        values: parts[3] !== undefined ? [h, w + '%', b + '%', a] : [h, w + '%', b + '%']
      };
    }
  },
  
  // LAB parser (CSS4)
  lab: {
    regex: /^lab\(\s*([^)]+)\s*\)$/i,
    parse: (match, values) => {
      const parts = values.split(/[,\s\/]+/).map(v => v.trim()).filter(Boolean);
      
      if (parts.length < 3) return null;
      
      const l = parseFloat(parts[0].replace('%', ''));
      const a = parseFloat(parts[1]);
      const b = parseFloat(parts[2]);
      const alpha = parts[3] !== undefined ? 
        (parts[3].includes('%') ? parseFloat(parts[3]) / 100 : parseFloat(parts[3])) : 1;
      
      return {
        type: 'lab',
        l: clamp(l, 0, 100),
        a: clamp(a, -125, 125),
        b: clamp(b, -125, 125),
        alpha: clamp(alpha, 0, 1),
        values: parts[3] !== undefined ? [l, a, b, alpha] : [l, a, b]
      };
    }
  },
  
  // LCH parser (CSS4)
  lch: {
    regex: /^lch\(\s*([^)]+)\s*\)$/i,
    parse: (match, values) => {
      const parts = values.split(/[,\s\/]+/).map(v => v.trim()).filter(Boolean);
      
      if (parts.length < 3) return null;
      
      const l = parseFloat(parts[0].replace('%', ''));
      const c = parseFloat(parts[1]);
      const h = parseFloat(parts[2]) % 360;
      const alpha = parts[3] !== undefined ? 
        (parts[3].includes('%') ? parseFloat(parts[3]) / 100 : parseFloat(parts[3])) : 1;
      
      return {
        type: 'lch',
        l: clamp(l, 0, 100),
        c: Math.max(0, c),
        h: h < 0 ? h + 360 : h,
        alpha: clamp(alpha, 0, 1),
        values: parts[3] !== undefined ? [l, c, h, alpha] : [l, c, h]
      };
    }
  },
  
  // OKLAB parser (CSS4)
  oklab: {
    regex: /^oklab\(\s*([^)]+)\s*\)$/i,
    parse: (match, values) => {
      const parts = values.split(/[,\s\/]+/).map(v => v.trim()).filter(Boolean);
      
      if (parts.length < 3) return null;
      
      const l = parseFloat(parts[0].replace('%', ''));
      const a = parseFloat(parts[1]);
      const b = parseFloat(parts[2]);
      const alpha = parts[3] !== undefined ? 
        (parts[3].includes('%') ? parseFloat(parts[3]) / 100 : parseFloat(parts[3])) : 1;
      
      return {
        type: 'oklab',
        l: clamp(l, 0, 1),
        a: clamp(a, -0.4, 0.4),
        b: clamp(b, -0.4, 0.4),
        alpha: clamp(alpha, 0, 1),
        values: parts[3] !== undefined ? [l, a, b, alpha] : [l, a, b]
      };
    }
  },
  
  // OKLCH parser (CSS4)
  oklch: {
    regex: /^oklch\(\s*([^)]+)\s*\)$/i,
    parse: (match, values) => {
      const parts = values.split(/[,\s\/]+/).map(v => v.trim()).filter(Boolean);
      
      if (parts.length < 3) return null;
      
      const l = parseFloat(parts[0].replace('%', ''));
      const c = parseFloat(parts[1]);
      const h = parseFloat(parts[2]) % 360;
      const alpha = parts[3] !== undefined ? 
        (parts[3].includes('%') ? parseFloat(parts[3]) / 100 : parseFloat(parts[3])) : 1;
      
      return {
        type: 'oklch',
        l: clamp(l, 0, 1),
        c: Math.max(0, c),
        h: h < 0 ? h + 360 : h,
        alpha: clamp(alpha, 0, 1),
        values: parts[3] !== undefined ? [l, c, h, alpha] : [l, c, h]
      };
    }
  },
  
  // HEX parser with enhanced support
  hex: {
    regex: /^#([0-9a-f]{3,8})$/i,
    parse: (match, hex) => {
      let r, g, b, a = 1;
      
      if (hex.length === 3) {
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
      } else if (hex.length === 4) {
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
        a = parseInt(hex[3] + hex[3], 16) / 255;
      } else if (hex.length === 6) {
        r = parseInt(hex.substr(0, 2), 16);
        g = parseInt(hex.substr(2, 2), 16);
        b = parseInt(hex.substr(4, 2), 16);
      } else if (hex.length === 8) {
        r = parseInt(hex.substr(0, 2), 16);
        g = parseInt(hex.substr(2, 2), 16);
        b = parseInt(hex.substr(4, 2), 16);
        a = parseInt(hex.substr(6, 2), 16) / 255;
      } else {
        return null;
      }
      
      return {
        type: 'hex',
        r, g, b, 
        a: roundToDecimals(a, 3),
        hex: '#' + hex.toLowerCase(),
        values: [r, g, b, roundToDecimals(a, 3)]
      };
    }
  }
};

/**
 * Enhanced color string parser with comprehensive format support
 * @param {string} colorString - CSS color string to parse
 * @param {Object} options - Parsing options
 * @param {boolean} options.strict - Strict validation mode
 * @param {boolean} options.normalize - Normalize output values
 * @returns {Object|null} Parsed color object or null if invalid
 */
function parseColorString(colorString, options = {}) {
  const { strict = false, normalize = true } = options;
  
  if (typeof colorString !== 'string') {
    if (strict) throw new TypeError('Color must be a string');
    return null;
  }
  
  const str = colorString.trim().toLowerCase();
  
  if (!str) {
    if (strict) throw new Error('Empty color string');
    return null;
  }
  
  // Handle special cases
  if (str === 'transparent') {
    return {
      type: 'named',
      name: 'transparent',
      r: 0, g: 0, b: 0, a: 0,
      values: ['transparent']
    };
  }
  
  if (str === 'currentcolor') {
    return {
      type: 'named',
      name: 'currentcolor',
      values: ['currentcolor'],
      special: true
    };
  }
  
  // Try each parser
  for (const [type, parser] of Object.entries(COLOR_PARSERS)) {
    const match = str.match(parser.regex);
    if (match) {
      try {
        const result = parser.parse(match, match[1]);
        if (result && normalize) {
          // Add normalized RGB values for non-RGB formats
          if (type !== 'rgb' && type !== 'hex' && !result.r) {
            const rgb = convertToRgb(result);
            if (rgb) {
              Object.assign(result, rgb);
            }
          }
        }
        return result;
      } catch (error) {
        if (strict) throw error;
        continue;
      }
    }
  }
  
  // Try named colors
  const namedColor = NAMED_COLORS[str];
  if (namedColor) {
    return {
      type: 'named',
      name: str,
      r: namedColor[0],
      g: namedColor[1],
      b: namedColor[2],
      a: namedColor[3] !== undefined ? namedColor[3] : 1,
      values: [str]
    };
  }
  
  if (strict) {
    throw new Error(`Invalid color format: ${colorString}`);
  }
  
  return null;
}

/**
 * Convert parsed color object to RGB
 * @param {Object} colorObj - Parsed color object
 * @returns {Object|null} RGB object {r, g, b, a?}
 */
function convertToRgb(colorObj) {
  if (!colorObj) return null;
  
  const { type } = colorObj;
  
  switch (type) {
    case 'rgb':
    case 'rgba':
    case 'hex':
      return {
        r: colorObj.r,
        g: colorObj.g,
        b: colorObj.b,
        a: colorObj.a
      };
      
    case 'hsl':
    case 'hsla':
      const hslRgb = hslToRgb(colorObj.h, colorObj.s, colorObj.l);
      return hslRgb ? {
        r: hslRgb[0],
        g: hslRgb[1],
        b: hslRgb[2],
        a: colorObj.a
      } : null;
      
    case 'hsv':
      const hsvRgb = hsvToRgb(colorObj.h, colorObj.s, colorObj.v);
      return hsvRgb ? {
        r: hsvRgb[0],
        g: hsvRgb[1],
        b: hsvRgb[2],
        a: colorObj.alpha || 1
      } : null;
      
    case 'hwb':
      const hwbRgb = hwbToRgb(colorObj.h, colorObj.w, colorObj.b);
      return hwbRgb ? {
        r: hwbRgb[0],
        g: hwbRgb[1],
        b: hwbRgb[2],
        a: colorObj.a
      } : null;
      
    case 'lab':
      const labRgb = labToRgb(colorObj.l, colorObj.a, colorObj.b);
      return labRgb ? {
        r: labRgb[0],
        g: labRgb[1],
        b: labRgb[2],
        a: colorObj.alpha
      } : null;
      
    case 'lch':
      const lchRgb = lchToRgb(colorObj.l, colorObj.c, colorObj.h);
      return lchRgb ? {
        r: lchRgb[0],
        g: lchRgb[1],
        b: lchRgb[2],
        a: colorObj.alpha
      } : null;
      
    case 'oklab':
      const oklabRgb = oklabToRgb(colorObj.l, colorObj.a, colorObj.b);
      return oklabRgb ? {
        r: oklabRgb[0],
        g: oklabRgb[1],
        b: oklabRgb[2],
        a: colorObj.alpha
      } : null;
      
    case 'oklch':
      const oklchRgb = oklchToRgb(colorObj.l, colorObj.c, colorObj.h);
      return oklchRgb ? {
        r: oklchRgb[0],
        g: oklchRgb[1],
        b: oklchRgb[2],
        a: colorObj.alpha
      } : null;
      
    case 'named':
      if (colorObj.name === 'transparent') {
        return { r: 0, g: 0, b: 0, a: 0 };
      }
      if (colorObj.name === 'currentcolor') {
        return null; // Cannot convert without context
      }
      return {
        r: colorObj.r,
        g: colorObj.g,
        b: colorObj.b,
        a: colorObj.a
      };
      
    default:
      return null;
  }
}

/**
 * Enhanced parseColorToRgb with better error handling and format support
 * @param {string} color - Color string in any format
 * @param {Object} options - Parsing options
 * @returns {Object|null} RGB object {r, g, b, a?} or null if invalid
 */
function parseColorToRgb(color, options = {}) {
  try {
    const parsed = parseColorString(color, options);
    if (!parsed) return null;
    
    const rgb = convertToRgb(parsed);
    if (!rgb) return null;
    
    // Clean up the result
    const result = {
      r: Math.round(clamp(rgb.r, 0, 255)),
      g: Math.round(clamp(rgb.g, 0, 255)),
      b: Math.round(clamp(rgb.b, 0, 255))
    };
    
    if (rgb.a !== undefined && rgb.a !== 1) {
      result.a = roundToDecimals(clamp(rgb.a, 0, 1), 3);
    }
    
    return result;
  } catch (error) {
    if (options.strict) throw error;
    console.warn(`Unable to parse color: ${color}`, error.message);
    return null;
  }
}

/**
 * Parse multiple colors from a string (e.g., gradients)
 * @param {string} colorString - String containing multiple colors
 * @param {RegExp} separator - Regex to split colors (default: comma)
 * @returns {Array} Array of parsed color objects
 */
function parseMultipleColors(colorString, separator = /[,;]\s*/) {
  if (typeof colorString !== 'string') return [];
  
  return colorString
    .split(separator)
    .map(color => parseColorString(color.trim()))
    .filter(Boolean);
}

/**
 * Validate if a string represents a valid color
 * @param {string} colorString - Color string to validate
 * @param {Object} options - Validation options
 * @returns {boolean} True if valid color
 */
function isValidColor(colorString, options = {}) {
  return parseColorString(colorString, { ...options, strict: false }) !== null;
}

/**
 * Get supported color formats
 * @returns {Array} Array of supported format names
 */
function getSupportedFormats() {
  return Object.keys(COLOR_PARSERS).concat(['named']);
}

/**
 * Get all named colors
 * @returns {Object} Object with named colors and their RGB values
 */
function getNamedColors() {
  return { ...NAMED_COLORS };
}

export {
  parseColorString,
  parseColorToRgb,
  parseMultipleColors,
  convertToRgb,
  isValidColor,
  getSupportedFormats,
  getNamedColors,
  NAMED_COLORS,
  COLOR_PARSERS
};