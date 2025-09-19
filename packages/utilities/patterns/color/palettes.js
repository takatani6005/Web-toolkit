/**
 * Color Palette Generators
 * Creates harmonious color palettes and schemes
 */

import { hslToRgb } from './utils.js';

/**
 * Generate a harmonious color palette
 * @param {Object} options - Palette generation options
 * @param {number} [options.count=5] - Number of colors to generate
 * @param {string} [options.harmony='analogous'] - Harmony type
 * @param {string} [options.format='hex'] - Output format
 * @param {number} [options.baseHue] - Base hue (0-360), random if not specified
 * @param {number} [options.saturation=50] - Base saturation (0-100)
 * @param {number} [options.lightness=50] - Base lightness (0-100)
 * @returns {string[]} Array of color values
 */
function generateColorPalette(options = {}) {
  const { 
    count = 5, 
    harmony = 'analogous', 
    format = 'hex',
    baseHue = Math.random() * 360,
    saturation = 50,
    lightness = 50
  } = options;
  
  const colors = [];
  
  switch (harmony) {
    case 'complementary':
      colors.push(
        generateColorByFormat(format, { hue: baseHue, saturation, lightness }),
        generateColorByFormat(format, { hue: (baseHue + 180) % 360, saturation, lightness })
      );
      break;
      
    case 'triadic':
      for (let i = 0; i < 3; i++) {
        colors.push(generateColorByFormat(format, { 
          hue: (baseHue + i * 120) % 360, 
          saturation, 
          lightness 
        }));
      }
      break;
      
    case 'tetradic':
      for (let i = 0; i < 4; i++) {
        colors.push(generateColorByFormat(format, { 
          hue: (baseHue + i * 90) % 360, 
          saturation, 
          lightness 
        }));
      }
      break;
      
    case 'splitComplementary':
      colors.push(
        generateColorByFormat(format, { hue: baseHue, saturation, lightness }),
        generateColorByFormat(format, { hue: (baseHue + 150) % 360, saturation, lightness }),
        generateColorByFormat(format, { hue: (baseHue + 210) % 360, saturation, lightness })
      );
      break;
      
    case 'analogous':
      for (let i = 0; i < count; i++) {
        colors.push(generateColorByFormat(format, { 
          hue: (baseHue + i * 30) % 360, 
          saturation, 
          lightness 
        }));
      }
      break;
      
    case 'monochromatic':
      for (let i = 0; i < count; i++) {
        const adjustedLightness = Math.max(10, Math.min(90, lightness + (i - count / 2) * 15));
        colors.push(generateColorByFormat(format, { 
          hue: baseHue, 
          saturation, 
          lightness: adjustedLightness 
        }));
      }
      break;
      
    case 'compound':
      colors.push(
        generateColorByFormat(format, { hue: baseHue, saturation, lightness }),
        generateColorByFormat(format, { hue: (baseHue + 180) % 360, saturation, lightness }),
        generateColorByFormat(format, { hue: (baseHue + 30) % 360, saturation, lightness }),
        generateColorByFormat(format, { hue: (baseHue - 30 + 360) % 360, saturation, lightness })
      );
      break;
      
    default:
      for (let i = 0; i < count; i++) {
        colors.push(generateColorByFormat(format));
      }
  }
  
  return colors.slice(0, count);
}

/**
 * Generate a gradient palette between two colors
 * @param {string} startColor - Starting color (hex format)
 * @param {string} endColor - Ending color (hex format)
 * @param {number} steps - Number of steps in the gradient
 * @returns {string[]} Array of gradient colors in hex format
 */
function generateGradientPalette(startColor, endColor, steps = 10) {
  const colors = [];
  
  const startRgb = hexToRgb(startColor);
  const endRgb = hexToRgb(endColor);
  
  if (!startRgb || !endRgb) {
    throw new Error('Invalid color format. Please use hex colors (e.g., #ff0000)');
  }
  
  for (let i = 0; i < steps; i++) {
    const ratio = i / (steps - 1);
    const r = Math.round(startRgb.r + (endRgb.r - startRgb.r) * ratio);
    const g = Math.round(startRgb.g + (endRgb.g - startRgb.g) * ratio);
    const b = Math.round(startRgb.b + (endRgb.b - startRgb.b) * ratio);
    
    colors.push(rgbToHex(r, g, b));
  }
  
  return colors;
}

/**
 * Generate a material design color palette
 * @param {string} baseColor - Base color for the palette (hex format)
 * @param {string} [format='hex'] - Output format
 * @returns {Object} Material design color object with different shades
 */
function generateMaterialPalette(baseColor, format = 'hex') {
  const shades = {
    50: { lightness: 95, saturation: 0.1 },
    100: { lightness: 90, saturation: 0.2 },
    200: { lightness: 80, saturation: 0.3 },
    300: { lightness: 70, saturation: 0.4 },
    400: { lightness: 60, saturation: 0.6 },
    500: { lightness: 50, saturation: 1.0 },
    600: { lightness: 45, saturation: 1.0 },
    700: { lightness: 40, saturation: 1.0 },
    800: { lightness: 30, saturation: 1.0 },
    900: { lightness: 20, saturation: 1.0 }
  };
  
  const palette = {};
  const baseHue = extractHueFromColor(baseColor);
  const baseSaturation = extractSaturationFromColor(baseColor);
  
  Object.entries(shades).forEach(([shade, { lightness, saturation }]) => {
    palette[shade] = generateColorByFormat(format, {
      hue: baseHue,
      saturation: saturation * baseSaturation,
      lightness
    });
  });
  
  return palette;
}

/**
 * Generate a seasonal color palette
 * @param {string} season - Season name ('spring', 'summer', 'autumn', 'winter')
 * @param {number} count - Number of colors
 * @param {string} format - Output format
 * @returns {string[]} Seasonal color palette
 */
function generateSeasonalPalette(season, count = 6, format = 'hex') {
  const seasonalRanges = {
    spring: { hueRange: [60, 150], saturation: [50, 80], lightness: [60, 85] },
    summer: { hueRange: [120, 240], saturation: [60, 90], lightness: [50, 75] },
    autumn: { hueRange: [10, 60], saturation: [70, 95], lightness: [35, 65] },
    winter: { hueRange: [200, 300], saturation: [20, 60], lightness: [20, 50] }
  };
  
  const range = seasonalRanges[season.toLowerCase()] || seasonalRanges.spring;
  const colors = [];
  
  for (let i = 0; i < count; i++) {
    const hue = range.hueRange[0] + Math.random() * (range.hueRange[1] - range.hueRange[0]);
    const saturation = range.saturation[0] + Math.random() * (range.saturation[1] - range.saturation[0]);
    const lightness = range.lightness[0] + Math.random() * (range.lightness[1] - range.lightness[0]);
    
    colors.push(generateColorByFormat(format, { hue, saturation, lightness }));
  }
  
  return colors;
}

/**
 * Generate an accessibility-focused color palette
 * @param {string} backgroundColor - Background color to test against (hex format)
 * @param {number} minContrast - Minimum contrast ratio (e.g., 4.5 for AA, 7 for AAA)
 * @param {number} count - Number of colors
 * @param {string} format - Output format
 * @returns {Object[]} Accessible color palette with contrast information
 */
function generateAccessiblePalette(backgroundColor = '#ffffff', minContrast = 4.5, count = 8, format = 'hex') {
  const colors = [];
  const bgLuminance = calculateLuminance(backgroundColor);
  
  for (let i = 0; i < count; i++) {
    let attempts = 0;
    let color;
    let contrast;
    
    do {
      const hue = (i / count) * 360;
      const saturation = 60 + Math.random() * 40;
      const lightness = Math.random() * 100;
      
      color = generateColorByFormat(format, { hue, saturation, lightness });
      contrast = calculateContrastRatio(backgroundColor, color);
      attempts++;
    } while (contrast < minContrast && attempts < 50);
    
    colors.push({
      color,
      contrast: parseFloat(contrast.toFixed(2)),
      accessible: contrast >= minContrast
    });
  }
  
  return colors;
}

/**
 * Generate a vintage/retro color palette
 * @param {string} era - Era style ('70s', '80s', '90s', 'vintage', 'pastel')
 * @param {number} count - Number of colors
 * @param {string} format - Output format
 * @returns {string[]} Vintage color palette
 */
function generateVintagePalette(era = '70s', count = 6, format = 'hex') {
  const eraStyles = {
    '70s': { 
      hues: [25, 45, 120, 200, 300], 
      saturation: [60, 85], 
      lightness: [30, 60] 
    },
    '80s': { 
      hues: [300, 320, 180, 60, 0], 
      saturation: [80, 100], 
      lightness: [45, 75] 
    },
    '90s': { 
      hues: [180, 220, 260, 40, 120], 
      saturation: [40, 70], 
      lightness: [40, 70] 
    },
    vintage: { 
      hues: [30, 45, 200, 280, 350], 
      saturation: [40, 70], 
      lightness: [35, 65] 
    },
    pastel: { 
      hues: [0, 60, 120, 180, 240, 300], 
      saturation: [25, 45], 
      lightness: [75, 90] 
    }
  };
  
  const style = eraStyles[era.toLowerCase()] || eraStyles['70s'];
  const colors = [];
  
  for (let i = 0; i < count; i++) {
    const hue = style.hues[i % style.hues.length] + (Math.random() - 0.5) * 20;
    const saturation = style.saturation[0] + Math.random() * (style.saturation[1] - style.saturation[0]);
    const lightness = style.lightness[0] + Math.random() * (style.lightness[1] - style.lightness[0]);
    
    colors.push(generateColorByFormat(format, { hue, saturation, lightness }));
  }
  
  return colors;
}

/**
 * Generate a brand-inspired color palette
 * @param {string} brandType - Brand type ('tech', 'luxury', 'eco', 'playful', 'medical', 'financial')
 * @param {number} count - Number of colors
 * @param {string} format - Output format
 * @returns {string[]} Brand-inspired color palette
 */
function generateBrandPalette(brandType = 'tech', count = 5, format = 'hex') {
  const brandStyles = {
    tech: { 
      primary: { hue: 210, saturation: 80, lightness: 50 },
      secondary: [{ hue: 0, saturation: 0, lightness: 20 }, { hue: 0, saturation: 0, lightness: 95 }],
      accent: [{ hue: 120, saturation: 60, lightness: 45 }, { hue: 40, saturation: 90, lightness: 55 }]
    },
    luxury: {
      primary: { hue: 280, saturation: 30, lightness: 25 },
      secondary: [{ hue: 45, saturation: 80, lightness: 60 }, { hue: 0, saturation: 0, lightness: 15 }],
      accent: [{ hue: 0, saturation: 0, lightness: 90 }, { hue: 25, saturation: 100, lightness: 50 }]
    },
    eco: {
      primary: { hue: 120, saturation: 60, lightness: 40 },
      secondary: [{ hue: 60, saturation: 40, lightness: 30 }, { hue: 200, saturation: 50, lightness: 70 }],
      accent: [{ hue: 30, saturation: 80, lightness: 50 }, { hue: 90, saturation: 70, lightness: 85 }]
    },
    playful: {
      primary: { hue: 340, saturation: 85, lightness: 60 },
      secondary: [{ hue: 60, saturation: 90, lightness: 70 }, { hue: 200, saturation: 80, lightness: 65 }],
      accent: [{ hue: 30, saturation: 100, lightness: 55 }, { hue: 280, saturation: 75, lightness: 70 }]
    },
    medical: {
      primary: { hue: 200, saturation: 70, lightness: 45 },
      secondary: [{ hue: 120, saturation: 40, lightness: 50 }, { hue: 0, saturation: 0, lightness: 95 }],
      accent: [{ hue: 0, saturation: 80, lightness: 55 }, { hue: 220, saturation: 30, lightness: 85 }]
    },
    financial: {
      primary: { hue: 220, saturation: 50, lightness: 30 },
      secondary: [{ hue: 210, saturation: 80, lightness: 45 }, { hue: 0, saturation: 0, lightness: 20 }],
      accent: [{ hue: 120, saturation: 60, lightness: 45 }, { hue: 0, saturation: 0, lightness: 90 }]
    }
  };
  
  const brand = brandStyles[brandType.toLowerCase()] || brandStyles.tech;
  const colors = [];
  
  // Add primary color
  colors.push(generateColorByFormat(format, brand.primary));
  
  // Add secondary colors
  brand.secondary.forEach(color => {
    if (colors.length < count) {
      colors.push(generateColorByFormat(format, color));
    }
  });
  
  // Add accent colors
  brand.accent.forEach(color => {
    if (colors.length < count) {
      colors.push(generateColorByFormat(format, color));
    }
  });
  
  return colors.slice(0, count);
}

/**
 * Generate a nature-inspired color palette
 * @param {string} theme - Nature theme ('ocean', 'forest', 'desert', 'mountain', 'sunset', 'flower')
 * @param {number} count - Number of colors
 * @param {string} format - Output format
 * @returns {string[]} Nature-inspired color palette
 */
function generateNaturePalette(theme = 'forest', count = 6, format = 'hex') {
  const natureThemes = {
    ocean: [
      { hue: 200, saturation: 80, lightness: 25 },
      { hue: 190, saturation: 70, lightness: 40 },
      { hue: 180, saturation: 60, lightness: 65 },
      { hue: 210, saturation: 50, lightness: 85 },
      { hue: 0, saturation: 0, lightness: 95 },
      { hue: 45, saturation: 60, lightness: 70 }
    ],
    forest: [
      { hue: 90, saturation: 60, lightness: 20 },
      { hue: 110, saturation: 70, lightness: 35 },
      { hue: 80, saturation: 50, lightness: 55 },
      { hue: 30, saturation: 40, lightness: 40 },
      { hue: 60, saturation: 30, lightness: 75 },
      { hue: 25, saturation: 60, lightness: 65 }
    ],
    desert: [
      { hue: 35, saturation: 70, lightness: 55 },
      { hue: 25, saturation: 80, lightness: 45 },
      { hue: 40, saturation: 60, lightness: 70 },
      { hue: 15, saturation: 50, lightness: 40 },
      { hue: 45, saturation: 40, lightness: 85 },
      { hue: 200, saturation: 80, lightness: 60 }
    ],
    mountain: [
      { hue: 210, saturation: 30, lightness: 30 },
      { hue: 0, saturation: 0, lightness: 60 },
      { hue: 220, saturation: 20, lightness: 50 },
      { hue: 0, saturation: 0, lightness: 85 },
      { hue: 120, saturation: 40, lightness: 45 },
      { hue: 30, saturation: 50, lightness: 35 }
    ],
    sunset: [
      { hue: 15, saturation: 90, lightness: 55 },
      { hue: 35, saturation: 100, lightness: 60 },
      { hue: 320, saturation: 80, lightness: 65 },
      { hue: 280, saturation: 60, lightness: 40 },
      { hue: 250, saturation: 70, lightness: 25 },
      { hue: 45, saturation: 70, lightness: 80 }
    ],
    flower: [
      { hue: 320, saturation: 80, lightness: 70 },
      { hue: 300, saturation: 70, lightness: 60 },
      { hue: 60, saturation: 90, lightness: 75 },
      { hue: 120, saturation: 60, lightness: 55 },
      { hue: 30, saturation: 80, lightness: 80 },
      { hue: 280, saturation: 50, lightness: 85 }
    ]
  };
  
  const themeColors = natureThemes[theme.toLowerCase()] || natureThemes.forest;
  const colors = [];
  
  for (let i = 0; i < count && i < themeColors.length; i++) {
    const variation = (Math.random() - 0.5) * 10;
    const color = {
      hue: (themeColors[i].hue + variation + 360) % 360,
      saturation: Math.max(5, Math.min(100, themeColors[i].saturation + variation)),
      lightness: Math.max(5, Math.min(95, themeColors[i].lightness + variation))
    };
    colors.push(generateColorByFormat(format, color));
  }
  
  return colors;
}

/**
 * Generate a monochromatic palette with extended variations
 * @param {string} baseColor - Base color (hex format)
 * @param {string} variation - Variation type ('tints', 'shades', 'tones', 'all')
 * @param {number} count - Number of colors
 * @param {string} format - Output format
 * @returns {string[]} Monochromatic color palette
 */
function generateMonochromaticPalette(baseColor, variation = 'all', count = 7, format = 'hex') {
  const baseHue = extractHueFromColor(baseColor);
  const baseSaturation = extractSaturationFromColor(baseColor);
  const colors = [];
  
  switch (variation.toLowerCase()) {
    case 'tints':
      // Add white to create tints
      for (let i = 0; i < count; i++) {
        const lightness = 50 + (i / (count - 1)) * 45;
        colors.push(generateColorByFormat(format, { 
          hue: baseHue, 
          saturation: baseSaturation * (1 - i / (count * 1.5)), 
          lightness 
        }));
      }
      break;
      
    case 'shades':
      // Add black to create shades
      for (let i = 0; i < count; i++) {
        const lightness = 50 - (i / (count - 1)) * 40;
        colors.push(generateColorByFormat(format, { 
          hue: baseHue, 
          saturation: baseSaturation, 
          lightness 
        }));
      }
      break;
      
    case 'tones':
      // Add gray to create tones
      for (let i = 0; i < count; i++) {
        const saturation = baseSaturation * (1 - i / (count * 1.2));
        colors.push(generateColorByFormat(format, { 
          hue: baseHue, 
          saturation, 
          lightness: 50 
        }));
      }
      break;
      
    case 'all':
    default:
      // Mix of tints, shades, and tones
      const step = count / 3;
      for (let i = 0; i < count; i++) {
        let color;
        if (i < step) {
          // Tints
          const lightness = 50 + (i / step) * 40;
          const saturation = baseSaturation * (1 - i / (step * 2));
          color = { hue: baseHue, saturation, lightness };
        } else if (i < step * 2) {
          // Shades
          const lightness = 50 - ((i - step) / step) * 35;
          color = { hue: baseHue, saturation: baseSaturation, lightness };
        } else {
          // Tones
          const saturation = baseSaturation * (1 - (i - step * 2) / step * 0.8);
          color = { hue: baseHue, saturation, lightness: 50 };
        }
        colors.push(generateColorByFormat(format, color));
      }
  }
  
  return colors;
}

/**
 * Generate a temperature-based color palette
 * @param {string} temperature - Temperature ('warm', 'cool', 'hot', 'cold', 'neutral')
 * @param {number} count - Number of colors
 * @param {string} format - Output format
 * @returns {string[]} Temperature-based color palette
 */
function generateTemperaturePalette(temperature = 'warm', count = 6, format = 'hex') {
  const tempRanges = {
    warm: { hueRange: [0, 60], saturation: [60, 90], lightness: [45, 75] },
    cool: { hueRange: [180, 270], saturation: [50, 80], lightness: [40, 70] },
    hot: { hueRange: [0, 30], saturation: [80, 100], lightness: [50, 70] },
    cold: { hueRange: [200, 260], saturation: [30, 70], lightness: [30, 60] },
    neutral: { hueRange: [0, 360], saturation: [0, 30], lightness: [20, 80] }
  };
  
  const range = tempRanges[temperature.toLowerCase()] || tempRanges.warm;
  const colors = [];
  
  for (let i = 0; i < count; i++) {
    const hue = range.hueRange[0] + Math.random() * (range.hueRange[1] - range.hueRange[0]);
    const saturation = range.saturation[0] + Math.random() * (range.saturation[1] - range.saturation[0]);
    const lightness = range.lightness[0] + Math.random() * (range.lightness[1] - range.lightness[0]);
    
    colors.push(generateColorByFormat(format, { hue, saturation, lightness }));
  }
  
  return colors;
}

// ===== HELPER FUNCTIONS =====

/**
 * Generate color in specific format
 * @private
 * @param {string} format - Color format ('hex', 'rgb', 'hsl')
 * @param {Object} constraints - Color constraints
 * @returns {string} Formatted color string
 */
function generateColorByFormat(format, constraints = {}) {
  const { hue, lightness, saturation } = constraints;
  
  switch (format.toLowerCase()) {
    case 'hsl':
      return `hsl(${Math.round(hue || Math.random() * 360)}, ${Math.round(saturation || Math.random() * 101)}%, ${Math.round(lightness || Math.random() * 101)}%)`;
    
    case 'rgb':
      if (hue !== undefined) {
        const [r, g, b] = hslToRgb(hue / 360, (saturation || 50) / 100, (lightness || 50) / 100);
        return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
      }
      return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    
    case 'hex':
    default:
      if (hue !== undefined) {
        const [r, g, b] = hslToRgb(hue / 360, (saturation || 50) / 100, (lightness || 50) / 100);
        return rgbToHex(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
      }
      return '#' + Array.from({ length: 6 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  }
}

/**
 * Convert hex color to RGB object
 * @private
 * @param {string} hex - Hex color string
 * @returns {Object|null} RGB object or null if invalid
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Convert RGB values to hex string
 * @private
 * @param {number} r - Red value (0-255)
 * @param {number} g - Green value (0-255)
 * @param {number} b - Blue value (0-255)
 * @returns {string} Hex color string
 */
function rgbToHex(r, g, b) {
  const toHex = (n) => {
    const hex = Math.max(0, Math.min(255, Math.round(n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Extract hue from hex color
 * @private
 * @param {string} color - Hex color string
 * @returns {number} Hue value (0-360)
 */
function extractHueFromColor(color) {
  const rgb = hexToRgb(color);
  if (!rgb) return Math.random() * 360;
  
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  
  if (delta === 0) return 0;
  
  let hue;
  if (max === r) {
    hue = ((g - b) / delta) % 6;
  } else if (max === g) {
    hue = (b - r) / delta + 2;
  } else {
    hue = (r - g) / delta + 4;
  }
  
  return (hue * 60 + 360) % 360;
}

/**
 * Extract saturation from hex color
 * @private
 * @param {string} color - Hex color string
 * @returns {number} Saturation value (0-100)
 */
function extractSaturationFromColor(color) {
  const rgb = hexToRgb(color);
  if (!rgb) return 50;
  
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  
  if (max === 0) return 0;
  
  return (delta / max) * 100;
}

/**
 * Calculate relative luminance of a color
 * @private
 * @param {string} color - Hex color string
 * @returns {number} Relative luminance (0-1)
 */
function calculateLuminance(color) {
  const rgb = hexToRgb(color);
  if (!rgb) return 0.5;
  
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate contrast ratio between two colors
 * @private
 * @param {string} color1 - First color (hex)
 * @param {string} color2 - Second color (hex)
 * @returns {number} Contrast ratio (1-21)
 */
function calculateContrastRatio(color1, color2) {
  const lum1 = calculateLuminance(color1);
  const lum2 = calculateLuminance(color2);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
}

// ===== HARMONIC PALETTE GENERATORS =====

/**
 * Generate complementary color palette
 */
function generateComplementaryPalette  (baseColor, options = {})  {
  const { variations = 3, precision = 3 } = options;
  
  try {
    const rgb = parseColorToRgb(baseColor);
    if (!rgb) throw new Error('Invalid base color');
    
    const [h, s, l] = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const complementaryHue = (h + 180) % 360;
    
    const palette = [baseColor];
    
    // Add complementary color
    const complementaryRgb = hslToRgb(complementaryHue, s, l);
    palette.push(`rgb(${complementaryRgb.r}, ${complementaryRgb.g}, ${complementaryRgb.b})`);
    
    // Add variations
    for (let i = 1; i <= variations; i++) {
      const lightness = clamp(l + (i * 15) - 30, 0, 100);
      const varRgb = hslToRgb(h, s, lightness);
      const compVarRgb = hslToRgb(complementaryHue, s, lightness);
      
      palette.push(
        `rgb(${varRgb.r}, ${varRgb.g}, ${varRgb.b})`,
        `rgb(${compVarRgb.r}, ${compVarRgb.g}, ${compVarRgb.b})`
      );
    }
    
    return palette;
  } catch (error) {
    console.warn('Complementary palette generation failed:', error.message);
    return [baseColor];
  }
};

/**
 * Generate triadic color palette
 */
 function generateTriadicPalette (baseColor, options = {}) {
  const { variations = 2, precision = 3 } = options;
  
  try {
    const rgb = parseColorToRgb(baseColor);
    if (!rgb) throw new Error('Invalid base color');
    
    const [h, s, l] = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const palette = [baseColor];
    
    // Add triadic colors (120° apart)
    const triadic1 = (h + 120) % 360;
    const triadic2 = (h + 240) % 360;
    
    const triadic1Rgb = hslToRgb(triadic1, s, l);
    const triadic2Rgb = hslToRgb(triadic2, s, l);
    
    palette.push(
      `rgb(${triadic1Rgb.r}, ${triadic1Rgb.g}, ${triadic1Rgb.b})`,
      `rgb(${triadic2Rgb.r}, ${triadic2Rgb.g}, ${triadic2Rgb.b})`
    );
    
    // Add variations
    for (let i = 1; i <= variations; i++) {
      const lightness = clamp(l + (i * 20) - 30, 10, 90);
      
      [h, triadic1, triadic2].forEach(hue => {
        const varRgb = hslToRgb(hue, s, lightness);
        palette.push(`rgb(${varRgb.r}, ${varRgb.g}, ${varRgb.b})`);
      });
    }
    
    return palette;
  } catch (error) {
    console.warn('Triadic palette generation failed:', error.message);
    return [baseColor];
  }
};

export {
  generateColorPalette,
  generateGradientPalette,
  generateMaterialPalette,
  generateSeasonalPalette,
  generateAccessiblePalette,
  generateVintagePalette,
  generateBrandPalette,
  generateNaturePalette,
  generateMonochromaticPalette,
  generateTemperaturePalette,
  generateComplementaryPalette,
  generateTriadicPalette
};