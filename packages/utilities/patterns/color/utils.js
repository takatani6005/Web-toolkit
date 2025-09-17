/**
 * Color Utility Functions
 * Shared utility functions for color conversion and manipulation
 */

/**
 * Convert HSL to RGB
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} l - Lightness (0-100)
 * @returns {number[]} RGB values as [r, g, b] (0-1 range)
 */
 function hslToRgb(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;
  
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
  const m = l - c / 2;
  
  let r, g, b;
  
  if (h < 1/6) [r, g, b] = [c, x, 0];
  else if (h < 2/6) [r, g, b] = [x, c, 0];
  else if (h < 3/6) [r, g, b] = [0, c, x];
  else if (h < 4/6) [r, g, b] = [0, x, c];
  else if (h < 5/6) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  
  return [r + m, g + m, b + m];
}

/**
 * Convert RGB to HSL
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {number[]} HSL values as [h, s, l]
 */
 function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  const sum = max + min;
  
  const l = sum / 2;
  
  if (diff === 0) {
    return [0, 0, l * 100]; // Achromatic
  }
  
  const s = l > 0.5 ? diff / (2 - sum) : diff / sum;
  
  let h;
  switch (max) {
    case r:
      h = ((g - b) / diff + (g < b ? 6 : 0)) / 6;
      break;
    case g:
      h = ((b - r) / diff + 2) / 6;
      break;
    case b:
      h = ((r - g) / diff + 4) / 6;
      break;
  }
  
  return [h * 360, s * 100, l * 100];
}

/**
 * Convert RGB to HEX
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {string} Hex color string
 */
 function rgbToHex(r, g, b) {
  const toHex = (c) => {
    const hex = Math.round(c).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Convert HEX to RGB
 * @param {string} hex - Hex color string
 * @returns {number[]} RGB values as [r, g, b] (0-255 range)
 */
 function hexToRgb(hex) {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Handle 3-digit hex
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return [r, g, b];
}

/**
 * Calculate relative luminance of a color
 * @param {string} color - Color string (hex, rgb, etc.)
 * @returns {number} Relative luminance (0-1)
 */
 function calculateLuminance(color) {
  const [r, g, b] = parseColorToRgb(color);
  
  // Convert to linear RGB
  const linearRgb = [r, g, b].map(c => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  // Calculate luminance using ITU-R BT.709 coefficients
  return 0.2126 * linearRgb[0] + 0.7152 * linearRgb[1] + 0.0722 * linearRgb[2];
}

/**
 * Calculate contrast ratio between two colors
 * @param {string} color1 - First color
 * @param {string} color2 - Second color
 * @returns {number} Contrast ratio (1-21)
 */
 function calculateContrastRatio(color1, color2) {
  const lum1 = calculateLuminance(color1);
  const lum2 = calculateLuminance(color2);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Parse any color string to RGB values
 * @param {string} color - Color string in any format
 * @returns {number[]} RGB values as [r, g, b] (0-255 range)
 */
 function parseColorToRgb(color) {
  // Handle hex colors
  if (color.startsWith('#')) {
    return hexToRgb(color);
  }
  
  // Handle rgb/rgba colors
  const rgbMatch = color.match(/rgba?\(([^)]+)\)/);
  if (rgbMatch) {
    return rgbMatch[1].split(',').slice(0, 3).map(v => parseInt(v.trim()));
  }
  
  // Handle hsl/hsla colors
  const hslMatch = color.match(/hsla?\(([^)]+)\)/);
  if (hslMatch) {
    const [h, s, l] = hslMatch[1].split(',').map(v => parseFloat(v.trim()));
    const [r, g, b] = hslToRgb(h, s, l);
    return [r * 255, g * 255, b * 255];
  }
  
  // Handle named colors (simplified)
  const namedColors = {
    'white': [255, 255, 255],
    'black': [0, 0, 0],
    'red': [255, 0, 0],
    'green': [0, 128, 0],
    'blue': [0, 0, 255],
    'yellow': [255, 255, 0],
    'cyan': [0, 255, 255],
    'magenta': [255, 0, 255]
  };
  
  return namedColors[color.toLowerCase()] || [128, 128, 128]; // Default to gray
}

/**
 * Lighten a color by a percentage
 * @param {string} color - Color string
 * @param {number} percentage - Percentage to lighten (0-100)
 * @returns {string} Lightened color in hex format
 */
 function lightenColor(color, percentage) {
  const [r, g, b] = parseColorToRgb(color);
  const [h, s, l] = rgbToHsl(r, g, b);
  
  const newL = Math.min(100, l + percentage);
  const [newR, newG, newB] = hslToRgb(h, s, newL);
  
  return rgbToHex(newR * 255, newG * 255, newB * 255);
}

/**
 * Darken a color by a percentage
 * @param {string} color - Color string
 * @param {number} percentage - Percentage to darken (0-100)
 * @returns {string} Darkened color in hex format
 */
 function darkenColor(color, percentage) {
  const [r, g, b] = parseColorToRgb(color);
  const [h, s, l] = rgbToHsl(r, g, b);
  
  const newL = Math.max(0, l - percentage);
  const [newR, newG, newB] = hslToRgb(h, s, newL);
  
  return rgbToHex(newR * 255, newG * 255, newB * 255);
}

/**
 * Saturate a color by a percentage
 * @param {string} color - Color string
 * @param {number} percentage - Percentage to increase saturation (0-100)
 * @returns {string} More saturated color in hex format
 */
 function saturateColor(color, percentage) {
  const [r, g, b] = parseColorToRgb(color);
  const [h, s, l] = rgbToHsl(r, g, b);
  
  const newS = Math.min(100, s + percentage);
  const [newR, newG, newB] = hslToRgb(h, newS, l);
  
  return rgbToHex(newR * 255, newG * 255, newB * 255);
}

/**
 * Desaturate a color by a percentage
 * @param {string} color - Color string
 * @param {number} percentage - Percentage to decrease saturation (0-100)
 * @returns {string} Less saturated color in hex format
 */
 function desaturateColor(color, percentage) {
  const [r, g, b] = parseColorToRgb(color);
  const [h, s, l] = rgbToHsl(r, g, b);
  
  const newS = Math.max(0, s - percentage);
  const [newR, newG, newB] = hslToRgb(h, newS, l);
  
  return rgbToHex(newR * 255, newG * 255, newB * 255);
}

/**
 * Mix two colors together
 * @param {string} color1 - First color
 * @param {string} color2 - Second color
 * @param {number} ratio - Mix ratio (0-1, where 0 = all color1, 1 = all color2)
 * @returns {string} Mixed color in hex format
 */
 function mixColors(color1, color2, ratio = 0.5) {
  const [r1, g1, b1] = parseColorToRgb(color1);
  const [r2, g2, b2] = parseColorToRgb(color2);
  
  const r = Math.round(r1 + (r2 - r1) * ratio);
  const g = Math.round(g1 + (g2 - g1) * ratio);
  const b = Math.round(b1 + (b2 - b1) * ratio);
  
  return rgbToHex(r, g, b);
}

/**
 * Get complementary color
 * @param {string} color - Color string
 * @returns {string} Complementary color in hex format
 */
 function getComplementaryColor(color) {
  const [r, g, b] = parseColorToRgb(color);
  const [h, s, l] = rgbToHsl(r, g, b);
  
  const complementaryH = (h + 180) % 360;
  const [newR, newG, newB] = hslToRgb(complementaryH, s, l);
  
  return rgbToHex(newR * 255, newG * 255, newB * 255);
}

/**
 * Check if a color is considered "dark" (luminance < 0.5)
 * @param {string} color - Color string
 * @returns {boolean} True if the color is dark
 */
 function isColorDark(color) {
  return calculateLuminance(color) < 0.5;
}

/**
 * Generate a random color component value (0-255)
 * @returns {number} Random color component
 */
 function randomColorComponent() {
  return Math.floor(Math.random() * 256);
}

/**
 * Clamp a number between min and max values
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
 function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
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

export {
    hslToRgb,
    rgbToHsl,
    rgbToHex,
    hexToRgb,
    calculateLuminance,
    calculateContrastRatio,
    parseColorToRgb,
    lightenColor,
    darkenColor,
    saturateColor,
    desaturateColor,
    mixColors,
    getComplementaryColor,
    isColorDark,
    randomColorComponent,
    clamp,
    degreesToRadians,
    radiansToDegrees
}