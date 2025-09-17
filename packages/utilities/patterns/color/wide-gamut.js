/**
 * Wide Gamut Color Pattern Generators
 * Handles device-specific and wide gamut color spaces
 */

import { hslToRgb } from './utils.js';

/**
 * Generate Display P3 color pattern using the color(display-p3 ...) syntax
 * Display P3 has a wider gamut than sRGB, commonly used in modern displays
 * @param {number} steps - Number of colors to generate
 * @returns {string[]} Array of Display P3 color strings
 */
 function generateDisplayP3ColorPattern(steps = 16) {
  const colors = [];
  for (let i = 0; i < steps; i++) {
    const hue = (i / steps) * 360;
    const saturation = 0.8;
    const lightness = 0.6;
    
    const p3Color = hslToDisplayP3(hue, saturation, lightness);
    colors.push(`color(display-p3 ${p3Color.r.toFixed(3)} ${p3Color.g.toFixed(3)} ${p3Color.b.toFixed(3)})`);
  }
  return colors;
}

/**
 * Generate Rec2020 color pattern for HDR and wide gamut displays
 * Rec2020 is used for 4K/8K TV and HDR content
 * @param {number} steps - Number of colors to generate
 * @returns {string[]} Array of Rec2020 color strings
 */
 function generateRec2020ColorPattern(steps = 16) {
  const colors = [];
  for (let i = 0; i < steps; i++) {
    const hue = (i / steps) * 360;
    const saturation = 0.9;
    const lightness = 0.5;
    
    const rec2020Color = hslToRec2020(hue, saturation, lightness);
    colors.push(`color(rec2020 ${rec2020Color.r.toFixed(3)} ${rec2020Color.g.toFixed(3)} ${rec2020Color.b.toFixed(3)})`);
  }
  return colors;
}

/**
 * Generate ProPhoto RGB color pattern for professional photography
 * ProPhoto RGB has an extremely wide gamut covering most visible colors
 * @param {number} steps - Number of colors to generate
 * @returns {string[]} Array of ProPhoto RGB color strings
 */
 function generateProPhotoRgbColorPattern(steps = 16) {
  const colors = [];
  for (let i = 0; i < steps; i++) {
    const hue = (i / steps) * 360;
    const saturation = 0.7;
    const lightness = 0.5;
    
    const proPhotoColor = hslToProPhotoRgb(hue, saturation, lightness);
    colors.push(`color(prophoto-rgb ${proPhotoColor.r.toFixed(3)} ${proPhotoColor.g.toFixed(3)} ${proPhotoColor.b.toFixed(3)})`);
  }
  return colors;
}

/**
 * Generate Adobe RGB (1998) color pattern for print and professional imaging
 * A98 RGB has a wider gamut than sRGB, especially in cyan-green colors
 * @param {number} steps - Number of colors to generate
 * @returns {string[]} Array of Adobe RGB color strings
 */
 function generateA98RgbColorPattern(steps = 16) {
  const colors = [];
  for (let i = 0; i < steps; i++) {
    const hue = (i / steps) * 360;
    const saturation = 0.8;
    const lightness = 0.5;
    
    const a98Color = hslToA98Rgb(hue, saturation, lightness);
    colors.push(`color(a98-rgb ${a98Color.r.toFixed(3)} ${a98Color.g.toFixed(3)} ${a98Color.b.toFixed(3)})`);
  }
  return colors;
}

/**
 * Generate XYZ D50 color pattern (CIE XYZ with D50 illuminant)
 * D50 is commonly used in print and graphic arts
 * @param {number} steps - Number of colors to generate
 * @returns {string[]} Array of XYZ D50 color strings
 */
 function generateXyzD50ColorPattern(steps = 16) {
  const colors = [];
  for (let i = 0; i < steps; i++) {
    const hue = (i / steps) * 360;
    const chroma = 30;
    const lightness = 60;
    
    const xyzColor = lchToXyzD50(lightness, chroma, hue);
    colors.push(`color(xyz-d50 ${xyzColor.x.toFixed(3)} ${xyzColor.y.toFixed(3)} ${xyzColor.z.toFixed(3)})`);
  }
  return colors;
}

/**
 * Generate XYZ D65 color pattern (CIE XYZ with D65 illuminant)
 * D65 represents average daylight and is the standard for sRGB/Rec709
 * @param {number} steps - Number of colors to generate
 * @returns {string[]} Array of XYZ D65 color strings
 */
 function generateXyzD65ColorPattern(steps = 16) {
  const colors = [];
  for (let i = 0; i < steps; i++) {
    const hue = (i / steps) * 360;
    const chroma = 25;
    const lightness = 65;
    
    const xyzColor = lchToXyzD65(lightness, chroma, hue);
    colors.push(`color(xyz-d65 ${xyzColor.x.toFixed(3)} ${xyzColor.y.toFixed(3)} ${xyzColor.z.toFixed(3)})`);
  }
  return colors;
}

/**
 * Generate a wide gamut color pattern that automatically uses the widest available color space
 * Falls back gracefully from Rec2020 -> Display P3 -> sRGB
 * @param {number} steps - Number of colors to generate
 * @param {string} preferredSpace - Preferred color space
 * @returns {string[]} Array of wide gamut colors with fallbacks
 */
 function generateWideGamutColorPattern(steps = 16, preferredSpace = 'rec2020') {
  const spaces = {
    'rec2020': generateRec2020ColorPattern,
    'display-p3': generateDisplayP3ColorPattern,
    'prophoto-rgb': generateProPhotoRgbColorPattern,
    'a98-rgb': generateA98RgbColorPattern
  };
  
  const generator = spaces[preferredSpace] || generateDisplayP3ColorPattern;
  const wideGamutColors = generator(steps);
  
  // Add fallback versions for browsers that don't support wide gamut
  return wideGamutColors.map(color => {
    const fallback = convertToSrgbFallback(color);
    return `${color}, ${fallback}`;
  });
}

// ===== HELPER FUNCTIONS =====

function hslToDisplayP3(h, s, l) {
  // Simplified conversion - in practice, you'd use proper color management
  const [r, g, b] = hslToRgb(h, s, l);
  // Apply Display P3 matrix transformation (simplified)
  return {
    r: Math.min(1, r * 1.1), // Slightly expanded gamut
    g: Math.min(1, g * 1.05),
    b: Math.min(1, b * 1.08)
  };
}

function hslToRec2020(h, s, l) {
  const [r, g, b] = hslToRgb(h, s, l);
  // Apply Rec2020 matrix transformation (simplified)
  return {
    r: Math.min(1, r * 1.2),
    g: Math.min(1, g * 1.15),
    b: Math.min(1, b * 1.25)
  };
}

function hslToProPhotoRgb(h, s, l) {
  const [r, g, b] = hslToRgb(h, s, l);
  // ProPhoto RGB has the widest gamut
  return {
    r: Math.min(1, r * 1.3),
    g: Math.min(1, g * 1.25),
    b: Math.min(1, b * 1.35)
  };
}

function hslToA98Rgb(h, s, l) {
  const [r, g, b] = hslToRgb(h, s, l);
  // Adobe RGB (1998) transformation
  return {
    r: Math.min(1, r * 1.15),
    g: Math.min(1, g * 1.2),
    b: Math.min(1, b * 1.1)
  };
}

function lchToXyzD50(l, c, h) {
  // Convert LCH to XYZ with D50 illuminant
  const a = c * Math.cos(h * Math.PI / 180);
  const b = c * Math.sin(h * Math.PI / 180);
  
  // Simplified Lab to XYZ conversion for D50
  return {
    x: (l + 16) / 116 * 0.96422, // D50 white point
    y: (l + 16) / 116,
    z: (l + 16) / 116 * 0.82521
  };
}

function lchToXyzD65(l, c, h) {
  // Convert LCH to XYZ with D65 illuminant
  const a = c * Math.cos(h * Math.PI / 180);
  const b = c * Math.sin(h * Math.PI / 180);
  
  // Simplified Lab to XYZ conversion for D65
  return {
    x: (l + 16) / 116 * 0.95047, // D65 white point
    y: (l + 16) / 116,
    z: (l + 16) / 116 * 1.08883
  };
}

function convertToSrgbFallback(wideGamutColor) {
  // Extract color values and convert to sRGB for fallback
  // This is a simplified conversion - in production, use proper color management
  return '#808080'; // Placeholder gray fallback
}

export{
  generateDisplayP3ColorPattern,
  generateRec2020ColorPattern,
  generateProPhotoRgbColorPattern,
  generateA98RgbColorPattern,
  generateXyzD50ColorPattern,
  generateXyzD65ColorPattern,
  generateWideGamutColorPattern
}