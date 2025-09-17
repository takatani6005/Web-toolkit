/**
 * Universal Color Pattern Generators
 * High-level generators that combine multiple color formats and strategies
 */

import { 
  generateHexColorPattern, 
  generateRgbColorPattern, 
  generateRgbaColorPattern, 
  generateHslColorPattern, 
  generateHslaColorPattern,
  generateHwbColorPattern,
  generateNamedColorPattern,
  generateRandomHexPattern
} from './basic.js';

import { 
  generateOklabColorPattern, 
  generateOklchColorPattern,
  generateLchColorPattern,
  generateLabColorPattern,
  generateCmykColorString
} from './advanced.js';

import { 
  generateWideGamutColorPattern,
} from './wide-gamut.js';

import{
generateSystemColorPattern
} from './system.js';
import { generateColorPalette } from './palettes.js';

/**
 * Generate any valid CSS color value (universal format)
 * @param {Object} options - Generation options
 * @param {boolean} [options.includeAdvanced=true] - Include advanced color formats
 * @param {boolean} [options.includeWideGamut=false] - Include wide gamut colors
 * @param {string[]} [options.preferredFormats] - Preferred color formats
 * @returns {string} Random color in any supported format
 */
 function generateUniversalColorPattern(options = {}) {
  const { 
    includeAdvanced = true, 
    includeWideGamut = false,
    preferredFormats = null
  } = options;
  
  const basicGenerators = [
    () => generateHexColorPattern(false), // long hex
    () => generateHexColorPattern(true),  // short hex
    generateNamedColorPattern,
    generateRgbColorPattern,
    generateRgbaColorPattern,
    generateHslColorPattern,
    generateHslaColorPattern,
    generateHwbColorPattern
  ];
  
  const advancedGenerators = [
    generateRandomHexPattern,
    () => generateOklabColorPattern(),
    () => generateOklchColorPattern(),
    () => generateLchColorPattern(),
    () => generateLabColorPattern(),
    generateCmykColorString
  ];
  
  const wideGamutGenerators = [
    () => generateWideGamutColorPattern(1)[0], // Single color from wide gamut
    () => generateSystemColorPattern().adaptive[Math.floor(Math.random() * 4)]
  ];
  
  let allGenerators = [...basicGenerators];
  
  if (includeAdvanced) {
    allGenerators = [...allGenerators, ...advancedGenerators];
  }
  
  if (includeWideGamut) {
    allGenerators = [...allGenerators, ...wideGamutGenerators];
  }
  
  // If preferred formats are specified, filter generators
  if (preferredFormats && preferredFormats.length > 0) {
    const formatGeneratorMap = {
      'hex': [() => generateHexColorPattern(false), () => generateHexColorPattern(true), generateRandomHexPattern],
      'rgb': [generateRgbColorPattern, generateRgbaColorPattern],
      'hsl': [generateHslColorPattern, generateHslaColorPattern],
      'hwb': [generateHwbColorPattern],
      'named': [generateNamedColorPattern],
      'oklab': [() => generateOklabColorPattern()],
      'oklch': [() => generateOklchColorPattern()],
      'lch': [() => generateLchColorPattern()],
      'lab': [() => generateLabColorPattern()],
      'cmyk': [generateCmykColorString]
    };
    
    const filteredGenerators = [];
    preferredFormats.forEach(format => {
      if (formatGeneratorMap[format]) {
        filteredGenerators.push(...formatGeneratorMap[format]);
      }
    });
    
    allGenerators = filteredGenerators.length > 0 ? filteredGenerators : allGenerators;
  }
  
  const selectedGenerator = allGenerators[Math.floor(Math.random() * allGenerators.length)];
  return selectedGenerator();
}

/**
 * Generate modern CSS color value (focuses on newer color spaces)
 * @param {Object} options - Generation options
 * @param {boolean} [options.includeAlpha=false] - Include alpha channel where supported
 * @param {number} [options.precision=3] - Decimal precision for modern formats
 * @returns {string} Modern color format
 */
 function generateModernColorPattern(options = {}) {
  const { includeAlpha = false, precision = 3 } = options;
  
  const modernGenerators = [
    () => generateOklabColorPattern({ includeAlpha, precision }),
    () => generateOklchColorPattern({ includeAlpha, precision }),
    () => generateWideGamutColorPattern(1)[0],
    () => generateSystemColorPattern().adaptive[Math.floor(Math.random() * 4)],
    () => generateLchColorPattern({ includeAlpha, precision }),
    () => generateLabColorPattern({ includeAlpha, precision }),
    generateRandomHexPattern
  ];
  
  const selectedGenerator = modernGenerators[Math.floor(Math.random() * modernGenerators.length)];
  return selectedGenerator();
}

/**
 * Generate a complete color scheme with multiple related colors
 * @param {Object} options - Scheme generation options
 * @param {string} [options.baseColor] - Base color for the scheme
 * @param {string} [options.harmony='analogous'] - Color harmony type
 * @param {number} [options.count=5] - Number of colors in the scheme
 * @param {string} [options.format='mixed'] - Output format ('mixed' for variety)
 * @returns {Object} Color scheme object
 */
 function generateColorScheme(options = {}) {
  const { 
    baseColor,
    harmony = 'analogous',
    count = 5,
    format = 'mixed'
  } = options;
  
  let colors;
  
  if (format === 'mixed') {
    // Generate colors in various formats for visual interest
    colors = [];
    for (let i = 0; i < count; i++) {
      const formats = ['hex', 'rgb', 'hsl'];
      const selectedFormat = formats[i % formats.length];
      colors.push(...generateColorPalette({ 
        count: 1, 
        harmony, 
        format: selectedFormat,
        baseHue: baseColor ? extractHue(baseColor) : undefined
      }));
    }
  } else {
    colors = generateColorPalette({
      count,
      harmony,
      format,
      baseHue: baseColor ? extractHue(baseColor) : undefined
    });
  }
  
  return {
    colors,
    harmony,
    baseColor: baseColor || colors[0],
    metadata: {
      count: colors.length,
      format: format === 'mixed' ? 'mixed' : format,
      generated: new Date().toISOString()
    }
  };
}

/**
 * Generate colors optimized for specific use cases
 * @param {string} useCase - Use case ('web', 'print', 'accessibility', 'brand', 'data-viz')
 * @param {Object} options - Additional options
 * @returns {string[]} Array of colors optimized for the use case
 */
 function generateContextualColors(useCase, options = {}) {
  const { count = 6 } = options;
  
  switch (useCase.toLowerCase()) {
    case 'web':
      // Web-safe colors with good screen display
      return Array.from({ length: count }, () => 
        generateUniversalColorPattern({ 
          preferredFormats: ['hex', 'rgb', 'hsl'],
          includeAdvanced: false
        })
      );
      
    case 'print':
      // CMYK-friendly colors
      return Array.from({ length: count }, () => generateCmykColorString());
      
    case 'accessibility':
      // High contrast colors
      return generateAccessibilityColors(count);
      
    case 'brand':
      // Professional, harmonious colors
      return generateColorPalette({ 
        count, 
        harmony: 'monochromatic',
        format: 'hex'
      });
      
    case 'data-viz':
      // Distinct, perceptually uniform colors
      return generateDataVisualizationColors(count);
      
    case 'modern':
      // Latest CSS color features
      return Array.from({ length: count }, () => 
        generateModernColorPattern({ includeAlpha: true })
      );
      
    default:
      return Array.from({ length: count }, () => generateUniversalColorPattern());
  }
}

/**
 * Generate a random color with specific constraints
 * @param {Object} constraints - Color constraints
 * @param {number[]} [constraints.hueRange] - Hue range [min, max]
 * @param {number[]} [constraints.saturationRange] - Saturation range [min, max] 
 * @param {number[]} [constraints.lightnessRange] - Lightness range [min, max]
 * @param {string[]} [constraints.excludeFormats] - Formats to exclude
 * @returns {string} Constrained random color
 */
 function generateConstrainedColor(constraints = {}) {
  const {
    hueRange,
    saturationRange,
    lightnessRange,
    excludeFormats = []
  } = constraints;
  
  // If no constraints, use universal generator
  if (!hueRange && !saturationRange && !lightnessRange) {
    return generateUniversalColorPattern({
      preferredFormats: getAvailableFormats(excludeFormats)
    });
  }
  
  // Generate HSL color within constraints, then convert to random format
  const hue = hueRange ? 
    hueRange[0] + Math.random() * (hueRange[1] - hueRange[0]) : 
    Math.random() * 360;
    
  const saturation = saturationRange ?
    saturationRange[0] + Math.random() * (saturationRange[1] - saturationRange[0]) :
    Math.random() * 100;
    
  const lightness = lightnessRange ?
    lightnessRange[0] + Math.random() * (lightnessRange[1] - lightnessRange[0]) :
    Math.random() * 100;
  
  const availableFormats = getAvailableFormats(excludeFormats);
  const format = availableFormats[Math.floor(Math.random() * availableFormats.length)];
  
  return convertHslToFormat(hue, saturation, lightness, format);
}

// ===== HELPER FUNCTIONS =====

function extractHue(color) {
  // Extract hue from any color format
  // This is a simplified implementation
  return Math.random() * 360; // Placeholder
}

function generateAccessibilityColors(count) {
  // Generate high contrast colors for accessibility
  const colors = [];
  for (let i = 0; i < count; i++) {
    const lightness = i % 2 === 0 ? 20 + Math.random() * 30 : 70 + Math.random() * 30;
    colors.push(`hsl(${Math.random() * 360}, 70%, ${lightness}%)`);
  }
  return colors;
}

function generateDataVisualizationColors(count) {
  // Generate perceptually distinct colors for data visualization
  const colors = [];
  for (let i = 0; i < count; i++) {
    const hue = (i / count) * 360;
    colors.push(generateOklchColorPattern({ precision: 3 }));
  }
  return colors;
}

function getAvailableFormats(excludeFormats) {
  const allFormats = ['hex', 'rgb', 'hsl', 'hwb', 'named', 'oklab', 'oklch', 'lch', 'lab'];
  return allFormats.filter(format => !excludeFormats.includes(format));
}

function convertHslToFormat(h, s, l, format) {
  switch (format) {
    case 'hsl':
      return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
    case 'rgb':
      // Convert HSL to RGB
      const rgb = hslToRgb(h, s, l);
      return `rgb(${Math.round(rgb[0] * 255)}, ${Math.round(rgb[1] * 255)}, ${Math.round(rgb[2] * 255)})`;
    case 'hex':
    default:
      // Convert HSL to hex
      const [r, g, b] = hslToRgb(h, s, l);
      const toHex = (c) => Math.round(c * 255).toString(16).padStart(2, '0');
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
}

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

export {
  generateUniversalColorPattern,
  generateModernColorPattern,
  generateColorScheme,
  generateContextualColors,
  generateConstrainedColor
}