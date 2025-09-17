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
        const adjustedLightness = Math.max(10, Math.min(90, lightness + (i - count/2) * 15));
        colors.push(generateColorByFormat(format, { 
          hue: baseHue, 
          saturation, 
          lightness: adjustedLightness 
        }));
      }
      break;
      
    case 'compound':
      // Base color + complementary + analogous variants
      colors.push(
        generateColorByFormat(format, { hue: baseHue, saturation, lightness }),
        generateColorByFormat(format, { hue: (baseHue + 180) % 360, saturation, lightness }),
        generateColorByFormat(format, { hue: (baseHue + 30) % 360, saturation, lightness }),
        generateColorByFormat(format, { hue: (baseHue - 30 + 360) % 360, saturation, lightness })
      );
      break;
      
    default:
      // Random palette
      for (let i = 0; i < count; i++) {
        colors.push(generateColorByFormat(format));
      }
  }
  
  return colors.slice(0, count);
}

/**
 * Generate a gradient palette between two colors
 * @param {string} startColor - Starting color
 * @param {string} endColor - Ending color
 * @param {number} steps - Number of steps in the gradient
 * @param {string} [colorSpace='hsl'] - Color space for interpolation
 * @returns {string[]} Array of gradient colors
 */
 function generateGradientPalette(startColor, endColor, steps = 10, colorSpace = 'hsl') {
  const colors = [];
  
  // This is a simplified implementation
  // In production, you'd want proper color space conversion
  for (let i = 0; i < steps; i++) {
    const ratio = i / (steps - 1);
    const interpolatedColor = interpolateColors(startColor, endColor, ratio, colorSpace);
    colors.push(interpolatedColor);
  }
  
  return colors;
}

/**
 * Generate a material design color palette
 * @param {string} baseColor - Base color for the palette
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
    500: { lightness: 50, saturation: 1.0 }, // Base
    600: { lightness: 45, saturation: 1.0 },
    700: { lightness: 40, saturation: 1.0 },
    800: { lightness: 30, saturation: 1.0 },
    900: { lightness: 20, saturation: 1.0 }
  };
  
  const palette = {};
  const baseHue = extractHueFromColor(baseColor);
  
  Object.entries(shades).forEach(([shade, { lightness, saturation }]) => {
    palette[shade] = generateColorByFormat(format, {
      hue: baseHue,
      saturation: saturation * 50, // Convert to percentage
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
  
  const range = seasonalRanges[season] || seasonalRanges.spring;
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
 * @param {string} backgroundColor - Background color to test against
 * @param {number} minContrast - Minimum contrast ratio (e.g., 4.5 for AA, 7 for AAA)
 * @param {number} count - Number of colors
 * @param {string} format - Output format
 * @returns {Object} Accessible color palette with contrast information
 */
 function generateAccessiblePalette(backgroundColor = '#ffffff', minContrast = 4.5, count = 8, format = 'hex') {
  const colors = [];
  const bgLuminance = calculateLuminance(backgroundColor);
  
  for (let i = 0; i < count; i++) {
    let attempts = 0;
    let color;
    let contrast;
    
    // Try to generate a color that meets the contrast requirement
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
      contrast: contrast.toFixed(2),
      accessible: contrast >= minContrast
    });
  }
  
  return colors;
}

// ===== HELPER FUNCTIONS =====

/**
 * Generate color in specific format
 * @private
 */
function generateColorByFormat(format, constraints = {}) {
  const { hue, lightness, saturation } = constraints;
  
  switch (format.toLowerCase()) {
    case 'hsl':
      return `hsl(${hue || Math.floor(Math.random() * 360)}, ${saturation || Math.floor(Math.random() * 101)}%, ${lightness || Math.floor(Math.random() * 101)}%)`;
    
    case 'rgb':
      if (hue !== undefined) {
        const [r, g, b] = hslToRgb(hue, saturation || 50, lightness || 50);
        return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
      }
      return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    
    case 'hex':
    default:
      if (hue !== undefined) {
        const [r, g, b] = hslToRgb(hue, saturation || 50, lightness || 50);
        const rHex = Math.round(r * 255).toString(16).padStart(2, '0');
        const gHex = Math.round(g * 255).toString(16).padStart(2, '0');
        const bHex = Math.round(b * 255).toString(16).padStart(2, '0');
        return `#${rHex}${gHex}${bHex}`;
      }
      return '#' + Array.from({ length: 6 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  }
}

function interpolateColors(color1, color2, ratio, colorSpace = 'hsl') {
  // Simplified color interpolation
  // In production, use proper color space conversion
  return color1; // Placeholder
}

function extractHueFromColor(color) {
  // Extract hue from color string
  // This is a simplified implementation
  return Math.random() * 360; // Placeholder
}

function calculateLuminance(color) {
  // Calculate relative luminance
  // This is a simplified implementation
  return 0.5; // Placeholder
}

function calculateContrastRatio(color1, color2) {
  // Calculate contrast ratio between two colors
  // This is a simplified implementation
  return 4.5; // Placeholder
}

export {
  generateColorPalette,
  generateGradientPalette,
  generateMaterialPalette,
  generateSeasonalPalette,
  generateAccessiblePalette
}