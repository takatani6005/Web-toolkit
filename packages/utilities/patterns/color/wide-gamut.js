/**
 * Wide Gamut Color Pattern Generators
 * Handles device-specific color spaces, HDR, and professional color workflows
 * Supports CSS Color Level 4+ wide gamut specifications
 */

// Color space definitions and gamut boundaries
const COLOR_SPACES = {
  WIDE_GAMUT: {
    'display-p3': { 
      name: 'Display P3', 
      coverage: 'DCI-P3 for digital cinema and modern displays',
      gamutSize: 1.25 // relative to sRGB
    },
    'rec2020': { 
      name: 'Rec. 2020', 
      coverage: 'Ultra HD TV, HDR content, future displays',
      gamutSize: 1.76
    },
    'prophoto-rgb': { 
      name: 'ProPhoto RGB', 
      coverage: 'Professional photography, print workflows',
      gamutSize: 1.90
    },
    'a98-rgb': { 
      name: 'Adobe RGB (1998)', 
      coverage: 'Print, professional imaging, web-to-print',
      gamutSize: 1.35
    }
  },
  
  DEVICE_INDEPENDENT: {
    'xyz-d50': { 
      name: 'CIE XYZ D50', 
      coverage: 'Print industry standard, graphic arts',
      illuminant: 'D50'
    },
    'xyz-d65': { 
      name: 'CIE XYZ D65', 
      coverage: 'Display standard, daylight equivalent',
      illuminant: 'D65'
    },
    'xyz': { 
      name: 'CIE XYZ (D65)', 
      coverage: 'Generic XYZ color space',
      illuminant: 'D65'
    }
  }
};

// Standard illuminants and their chromaticity coordinates
const ILLUMINANTS = {
  D50: { x: 0.96422, y: 1.00000, z: 0.82521 },
  D65: { x: 0.95047, y: 1.00000, z: 1.08883 },
  C: { x: 0.98074, y: 1.00000, z: 1.18232 }
};

// HDR transfer functions
const HDR_TRANSFER_FUNCTIONS = {
  PQ: 'rec2100-pq',    // Perceptual Quantization (Dolby Vision, HDR10)
  HLG: 'rec2100-hlg',  // Hybrid Log-Gamma (BBC/NHK HDR)
  LINEAR: 'linear'     // Linear light
};

/**
 * Enhanced HSL to RGB conversion with precision improvements
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-100) 
 * @param {number} l - Lightness (0-100)
 * @returns {number[]} RGB values as [r, g, b] (0-1 range)
 */
function hslToRgb(h, s, l) {
  h = ((h % 360) + 360) % 360; // Normalize hue to 0-360
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;
  
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  
  let r, g, b;
  
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  
  return [r + m, g + m, b + m];
}

/**
 * Generate comprehensive Display P3 color patterns
 * Display P3 covers ~25% more colors than sRGB, used in modern Apple devices
 * @param {Object} options - Configuration options
 * @returns {Object} Complete Display P3 color pattern set
 */
function generateDisplayP3ColorPattern(options = {}) {
  const defaultOptions = {
    steps: 16,
    includeVibrant: true,
    includeSubtle: true,
    includePastel: true,
    includeDeep: true,
    hdrSupport: false
  };
  
  const config = { ...defaultOptions, ...options };
  const patterns = {};
  
  // Primary color wheel in Display P3
  patterns.primary = generateColorWheelInSpace('display-p3', config.steps, {
    saturation: 0.85,
    lightness: 0.65
  });
  
  if (config.includeVibrant) {
    patterns.vibrant = generateColorWheelInSpace('display-p3', config.steps, {
      saturation: 1.0,
      lightness: 0.55
    });
  }
  
  if (config.includeSubtle) {
    patterns.subtle = generateColorWheelInSpace('display-p3', config.steps, {
      saturation: 0.3,
      lightness: 0.75
    });
  }
  
  if (config.includePastel) {
    patterns.pastel = generateColorWheelInSpace('display-p3', config.steps, {
      saturation: 0.4,
      lightness: 0.9
    });
  }
  
  if (config.includeDeep) {
    patterns.deep = generateColorWheelInSpace('display-p3', config.steps, {
      saturation: 0.9,
      lightness: 0.3
    });
  }
  
  // Display P3 gamut boundary colors (most saturated colors possible)
  patterns.gamutBoundary = generateGamutBoundaryColors('display-p3');
  
  // CSS with fallbacks
  patterns.cssWithFallbacks = generateCSSWithFallbacks(patterns.primary, 'display-p3');
  
  return {
    colorSpace: 'display-p3',
    patterns,
    metadata: {
      gamutCoverage: COLOR_SPACES.WIDE_GAMUT['display-p3'],
      totalColors: Object.values(patterns).flat().length,
      cssSupport: '@supports (color: color(display-p3 1 0 0))'
    }
  };
}

/**
 * Generate Rec. 2020 patterns for HDR and Ultra HD content
 * Rec2020 covers ~76% more colors than sRGB, used in 4K/8K HDR
 * @param {Object} options - Configuration options
 * @returns {Object} Complete Rec2020 color pattern set
 */
function generateRec2020ColorPattern(options = {}) {
  const defaultOptions = {
    steps: 20,
    includeHDR: true,
    includeBT2100: true,
    maxNits: 4000,
    transferFunction: HDR_TRANSFER_FUNCTIONS.PQ
  };
  
  const config = { ...defaultOptions, ...options };
  const patterns = {};
  
  // Standard dynamic range colors
  patterns.sdr = generateColorWheelInSpace('rec2020', config.steps, {
    saturation: 0.8,
    lightness: 0.6
  });
  
  if (config.includeHDR) {
    // HDR colors with extended luminance range
    patterns.hdr = generateHDRColorWheel('rec2020', config.steps, {
      maxNits: config.maxNits,
      transferFunction: config.transferFunction
    });
    
    // Ultra-saturated colors only possible in wide gamut
    patterns.ultraSaturated = generateColorWheelInSpace('rec2020', config.steps, {
      saturation: 1.0,
      lightness: 0.5,
      extendedGamut: true
    });
  }
  
  if (config.includeBT2100) {
    // BT.2100 specific patterns for broadcast HDR
    patterns.bt2100 = generateBT2100ColorPatterns(config.steps);
  }
  
  // Rec2020 gamut boundary demonstration
  patterns.gamutComparison = generateGamutComparison(['srgb', 'display-p3', 'rec2020']);
  
  return {
    colorSpace: 'rec2020',
    patterns,
    metadata: {
      gamutCoverage: COLOR_SPACES.WIDE_GAMUT.rec2020,
      hdrSupport: config.includeHDR,
      transferFunction: config.transferFunction,
      maxLuminance: config.maxNits + ' nits'
    }
  };
}

/**
 * Generate ProPhoto RGB patterns for professional photography
 * ProPhoto RGB covers ~90% of surface colors, widest practical gamut
 * @param {Object} options - Configuration options
 * @returns {Object} Complete ProPhoto RGB color pattern set
 */
function generateProPhotoRgbColorPattern(options = {}) {
  const defaultOptions = {
    steps: 24,
    includePrintSafe: true,
    includeExtreme: true,
    workingSpace: 'prophoto-rgb'
  };
  
  const config = { ...defaultOptions, ...options };
  const patterns = {};
  
  // Professional photography color wheel
  patterns.professional = generateColorWheelInSpace('prophoto-rgb', config.steps, {
    saturation: 0.7,
    lightness: 0.5
  });
  
  // Extreme colors only visible in ProPhoto RGB
  if (config.includeExtreme) {
    patterns.extreme = generateColorWheelInSpace('prophoto-rgb', config.steps, {
      saturation: 1.0,
      lightness: 0.5,
      extendedGamut: true
    });
    
    // Colors that would clip in smaller gamuts
    patterns.gamutExclusive = generateGamutExclusiveColors('prophoto-rgb', ['display-p3', 'a98-rgb']);
  }
  
  // Print-safe subset (colors reproducible in CMYK)
  if (config.includePrintSafe) {
    patterns.printSafe = generatePrintSafeColors('prophoto-rgb', config.steps);
  }
  
  // Skin tone optimized palette
  patterns.skinTones = generateSkinTonesPalette('prophoto-rgb');
  
  // Nature photography palette (enhanced greens and earth tones)
  patterns.nature = generateNaturePalette('prophoto-rgb');
  
  return {
    colorSpace: 'prophoto-rgb',
    patterns,
    metadata: {
      gamutCoverage: COLOR_SPACES.WIDE_GAMUT['prophoto-rgb'],
      useCase: 'Professional photography, fine art printing',
      workingSpace: config.workingSpace
    }
  };
}

/**
 * Generate Adobe RGB (1998) patterns for print workflows
 * A98-RGB optimized for CMYK printing with extended cyan-green gamut
 * @param {Object} options - Configuration options  
 * @returns {Object} Complete Adobe RGB color pattern set
 */
function generateA98RgbColorPattern(options = {}) {
  const defaultOptions = {
    steps: 18,
    includeCMYK: true,
    includeWebSafe: true,
    optimizeForPrint: true
  };
  
  const config = { ...defaultOptions, ...options };
  const patterns = {};
  
  // Standard Adobe RGB color wheel
  patterns.standard = generateColorWheelInSpace('a98-rgb', config.steps, {
    saturation: 0.8,
    lightness: 0.55
  });
  
  // CMYK-reproducible colors
  if (config.includeCMYK) {
    patterns.cmykSafe = generateCMYKSafeColors('a98-rgb', config.steps);
    patterns.printOptimized = generatePrintOptimizedColors('a98-rgb');
  }
  
  // Web-to-print colors (safe for both web and print)
  if (config.includeWebSafe) {
    patterns.webToPrint = generateWebToPrintColors('a98-rgb', config.steps);
  }
  
  // Enhanced cyan-green range (Adobe RGB's strength)
  patterns.cyanGreenRange = generateEnhancedCyanGreen('a98-rgb');
  
  // Corporate brand colors in Adobe RGB
  patterns.brandColors = generateBrandColorVariations('a98-rgb');
  
  return {
    colorSpace: 'a98-rgb',
    patterns,
    metadata: {
      gamutCoverage: COLOR_SPACES.WIDE_GAMUT['a98-rgb'],
      printOptimization: config.optimizeForPrint,
      cmykCompatibility: config.includeCMYK
    }
  };
}

/**
 * Generate device-independent XYZ color patterns
 * XYZ is the foundation of all color spaces, device-independent
 * @param {string} illuminant - D50, D65, or C
 * @param {Object} options - Configuration options
 * @returns {Object} XYZ color pattern set
 */
function generateXYZColorPattern(illuminant = 'D65', options = {}) {
  const defaultOptions = {
    steps: 16,
    includeSpectral: true,
    includeChromaticity: true,
    precision: 4
  };
  
  const config = { ...defaultOptions, ...options };
  const colorSpace = illuminant === 'D50' ? 'xyz-d50' : 'xyz-d65';
  const patterns = {};
  
  // Primary XYZ color progression
  patterns.primary = generateXYZProgression(illuminant, config.steps);
  
  // Spectral locus colors (pure wavelengths)
  if (config.includeSpectral) {
    patterns.spectral = generateSpectralLocus(illuminant);
  }
  
  // Chromaticity diagram samples
  if (config.includeChromaticity) {
    patterns.chromaticity = generateChromaticitySamples(illuminant, config.steps);
  }
  
  // MacAdam ellipses (just noticeable differences)
  patterns.macadamEllipses = generateMacAdamEllipses(illuminant);
  
  return {
    colorSpace,
    illuminant,
    patterns,
    metadata: {
      whitePoint: ILLUMINANTS[illuminant],
      precision: config.precision,
      deviceIndependent: true
    }
  };
}

/**
 * Generate adaptive wide gamut patterns with automatic fallbacks
 * Intelligently selects the best color space for the user's device
 * @param {Object} options - Configuration options
 * @returns {Object} Adaptive color pattern system
 */
function generateWideGamutColorPattern(options = {}) {
  const defaultOptions = {
    steps: 16,
    preferredSpace: 'display-p3',
    includeFallbacks: true,
    detectCapabilities: true,
    adaptiveQuality: true
  };
  
  const config = { ...defaultOptions, ...options };
  
  // Generate patterns for multiple color spaces
  const patterns = {
    'rec2020': generateColorWheelInSpace('rec2020', config.steps),
    'display-p3': generateColorWheelInSpace('display-p3', config.steps),  
    'a98-rgb': generateColorWheelInSpace('a98-rgb', config.steps),
    'srgb': generateColorWheelInSpace('srgb', config.steps) // fallback
  };
  
  // Create progressive enhancement CSS
  const progressiveCSS = generateProgressiveEnhancementCSS(patterns);
  
  // Device capability detection
  const capabilityTests = generateCapabilityTests();
  
  // Adaptive quality levels
  const qualityLevels = {
    premium: patterns['rec2020'],      // HDR displays
    enhanced: patterns['display-p3'],  // Modern displays  
    standard: patterns['a98-rgb'],     // Professional displays
    basic: patterns['srgb']            // Legacy displays
  };
  
  return {
    patterns,
    progressiveCSS,
    capabilityTests,
    qualityLevels,
    metadata: {
      preferredSpace: config.preferredSpace,
      fallbackStrategy: 'progressive enhancement',
      deviceAdaptive: config.detectCapabilities
    }
  };
}

/**
 * Generate HDR color patterns with extended luminance
 * Supports modern HDR displays and content creation
 * @param {Object} options - HDR configuration
 * @returns {Object} HDR color pattern collection
 */
function generateHDRColorPattern(options = {}) {
  const defaultOptions = {
    maxNits: 4000,
    minNits: 0.01,
    transferFunction: HDR_TRANSFER_FUNCTIONS.PQ,
    colorSpace: 'rec2020',
    steps: 20
  };
  
  const config = { ...defaultOptions, ...options };
  const patterns = {};
  
  // HDR white point progression
  patterns.whitePoints = generateHDRWhitePoints(config);
  
  // Extended luminance color wheel
  patterns.extendedLuminance = generateExtendedLuminanceColors(config);
  
  // HDR accent colors for UI
  patterns.hdrAccents = generateHDRAccentColors(config);
  
  // Tone mapping test patterns
  patterns.toneMapping = generateToneMappingPatterns(config);
  
  return {
    patterns,
    hdrMetadata: {
      maxNits: config.maxNits,
      minNits: config.minNits,
      transferFunction: config.transferFunction,
      colorSpace: config.colorSpace
    }
  };
}

// ===== HELPER FUNCTIONS =====

function generateColorWheelInSpace(colorSpace, steps, options = {}) {
  const { saturation = 0.8, lightness = 0.6, extendedGamut = false } = options;
  const colors = [];
  
  for (let i = 0; i < steps; i++) {
    const hue = (i / steps) * 360;
    const color = convertHSLToColorSpace(hue, saturation * 100, lightness * 100, colorSpace, extendedGamut);
    
    colors.push({
      hue,
      css: color,
      description: `${Math.round(hue)}° in ${colorSpace}`,
      gamutPosition: calculateGamutPosition(hue, saturation, colorSpace)
    });
  }
  
  return colors;
}

function convertHSLToColorSpace(h, s, l, colorSpace, extended = false) {
  const [r, g, b] = hslToRgb(h, s, l);
  
  let convertedColor;
  switch (colorSpace) {
    case 'display-p3':
      convertedColor = sRGBToDisplayP3(r, g, b, extended);
      break;
    case 'rec2020':
      convertedColor = sRGBToRec2020(r, g, b, extended);
      break;
    case 'prophoto-rgb':
      convertedColor = sRGBToProPhotoRGB(r, g, b, extended);
      break;
    case 'a98-rgb':
      convertedColor = sRGBToA98RGB(r, g, b, extended);
      break;
    case 'xyz-d50':
      convertedColor = sRGBToXYZD50(r, g, b);
      break;
    case 'xyz-d65':
    case 'xyz':
      convertedColor = sRGBToXYZD65(r, g, b);
      break;
    default:
      return `rgb(${Math.round(r*255)}, ${Math.round(g*255)}, ${Math.round(b*255)})`;
  }
  
  return formatColorString(convertedColor, colorSpace);
}

// Color space conversion functions with proper matrix transformations
function sRGBToDisplayP3(r, g, b, extended = false) {
  // sRGB to Display P3 conversion matrix
  const matrix = [
    [0.822461969, 0.177538031, 0.000000000],
    [0.033194199, 0.966805801, 0.000000000], 
    [0.017082631, 0.072397222, 0.910520147]
  ];
  
  // Apply gamma correction (sRGB -> linear)
  const linear = [r, g, b].map(applyGammaCorrection);
  
  // Matrix multiplication
  const p3Linear = multiplyMatrix(matrix, linear);
  
  // Apply Display P3 gamma
  const p3 = p3Linear.map(applyDisplayP3Gamma);
  
  // Extend gamut if requested
  if (extended) {
    return p3.map(c => Math.min(1, c * 1.1));
  }
  
  return p3.map(c => Math.max(0, Math.min(1, c)));
}

function sRGBToRec2020(r, g, b, extended = false) {
  // sRGB to Rec2020 conversion matrix  
  const matrix = [
    [0.627404078, 0.329282966, 0.043312956],
    [0.069097233, 0.919540395, 0.011362372],
    [0.016391438, 0.088013307, 0.895595255]
  ];
  
  const linear = [r, g, b].map(applyGammaCorrection);
  const rec2020Linear = multiplyMatrix(matrix, linear);
  const rec2020 = rec2020Linear.map(applyRec2020Gamma);
  
  if (extended) {
    return rec2020.map(c => Math.min(1, c * 1.2));
  }
  
  return rec2020.map(c => Math.max(0, Math.min(1, c)));
}

function sRGBToProPhotoRGB(r, g, b, extended = false) {
  // sRGB to ProPhoto RGB conversion matrix
  const matrix = [
    [0.797675896, 0.135192013, 0.067132091],
    [0.288071311, 0.711928689, 0.000000000],
    [0.000000000, 0.000000000, 0.825210474]
  ];
  
  const linear = [r, g, b].map(applyGammaCorrection);
  const proPhotoLinear = multiplyMatrix(matrix, linear);
  const proPhoto = proPhotoLinear.map(applyProPhotoGamma);
  
  if (extended) {
    return proPhoto.map(c => Math.min(1, c * 1.3));
  }
  
  return proPhoto.map(c => Math.max(0, Math.min(1, c)));
}

function sRGBToA98RGB(r, g, b, extended = false) {
  // sRGB to Adobe RGB conversion matrix
  const matrix = [
    [0.715119063, 0.284880937, 0.000000000],
    [0.000000000, 1.000000000, 0.000000000],
    [0.000000000, 0.041775264, 0.958224736]
  ];
  
  const linear = [r, g, b].map(applyGammaCorrection);
  const a98Linear = multiplyMatrix(matrix, linear);
  const a98 = a98Linear.map(applyA98Gamma);
  
  if (extended) {
    return a98.map(c => Math.min(1, c * 1.15));
  }
  
  return a98.map(c => Math.max(0, Math.min(1, c)));
}

function sRGBToXYZD50(r, g, b) {
  // sRGB to XYZ D50 conversion
  const matrix = [
    [0.436052025, 0.385081766, 0.143087414],
    [0.222488403, 0.716842305, 0.060669292],
    [0.013916016, 0.097076381, 0.714096445]
  ];
  
  const linear = [r, g, b].map(applyGammaCorrection);
  return multiplyMatrix(matrix, linear);
}

function sRGBToXYZD65(r, g, b) {
  // sRGB to XYZ D65 conversion
  const matrix = [
    [0.412391, 0.357584, 0.180481],
    [0.212639, 0.715169, 0.072192],
    [0.019331, 0.119195, 0.950532]
  ];
  
  const linear = [r, g, b].map(applyGammaCorrection);
  return multiplyMatrix(matrix, linear);
}

// Gamma correction functions
function applyGammaCorrection(value) {
  return value <= 0.04045 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
}

function applyDisplayP3Gamma(value) {
  return value <= 0.0031308 ? value * 12.92 : 1.055 * Math.pow(value, 1/2.4) - 0.055;
}

function applyRec2020Gamma(value) {
  const alpha = 1.09929682680944;
  const beta = 0.018053968510807;
  return value < beta ? 4.5 * value : alpha * Math.pow(value, 0.45) - (alpha - 1);
}

function applyProPhotoGamma(value) {
  return Math.pow(value, 1/1.8);
}

function applyA98Gamma(value) {
  return Math.pow(value, 1/2.2);
}

function multiplyMatrix(matrix, vector) {
  return matrix.map(row => 
    row.reduce((sum, coeff, i) => sum + coeff * vector[i], 0)
  );
}

function formatColorString(color, colorSpace) {
  if (colorSpace.startsWith('xyz')) {
    return `color(${colorSpace} ${color[0].toFixed(4)} ${color[1].toFixed(4)} ${color[2].toFixed(4)})`;
  } else {
    return `color(${colorSpace} ${color[0].toFixed(4)} ${color[1].toFixed(4)} ${color[2].toFixed(4)})`;
  }
}

function calculateGamutPosition(hue, saturation, colorSpace) {
  // Calculate relative position within color space gamut
  const gamutSize = COLOR_SPACES.WIDE_GAMUT[colorSpace]?.gamutSize || 1;
  return {
    hue,
    saturation,
    gamutUtilization: saturation * gamutSize,
    colorSpace
  };
}

function generateGamutBoundaryColors(colorSpace) {
  // Generate the most saturated colors possible in the color space
  const boundaryColors = [];
  const primaryHues = [0, 60, 120, 180, 240, 300]; // R, Y, G, C, B, M
  
  primaryHues.forEach(hue => {
    const color = convertHSLToColorSpace(hue, 100, 50, colorSpace, true);
    boundaryColors.push({
      hue,
      css: color,
      type: 'gamut-boundary',
      description: `Maximum saturation ${colorSpace} at ${hue}°`
    });
  });
  
  return boundaryColors;
}

function generateCSSWithFallbacks(colors, primarySpace) {
  return colors.map(color => ({
    ...color,
    cssWithFallback: `${color.css}, ${convertToSRGBFallback(color.css)}`,
    featureQuery: `@supports (color: ${color.css})`
  }));
}

function convertToSRGBFallback(wideGamutColor) {
  // Simplified fallback conversion - in production, implement proper gamut mapping
  const match = wideGamutColor.match(/color\([^)]+\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/);
  if (match) {
    const [, r, g, b] = match;
    return `rgb(${Math.round(parseFloat(r) * 255)}, ${Math.round(parseFloat(g) * 255)}, ${Math.round(parseFloat(b) * 255)})`;
  }
  return '#808080'; // Gray fallback
}

function generateProgressiveEnhancementCSS(patterns) {
  return {
    base: '/* Base sRGB colors for all browsers */',
    enhanced: '@supports (color: color(display-p3 1 0 0)) { /* Display P3 enhanced colors */ }',
    premium: '@supports (color: color(rec2020 1 0 0)) { /* Rec2020 premium colors */ }',
    hdr: '@media (dynamic-range: high) { /* HDR-specific colors */ }'
  };
}

function generateCapabilityTests() {
  return {
    displayP3: '@supports (color: color(display-p3 1 0 0))',
    rec2020: '@supports (color: color(rec2020 1 0 0))',
    wideGamut: '@media (color-gamut: p3)',
    hdr: '@media (dynamic-range: high)',
    colorScheme: '@media (prefers-color-scheme: dark)'
  };
}

// Specialized pattern generators
function generateHDRColorWheel(colorSpace, steps, options) {
  const { maxNits = 4000, transferFunction = 'rec2100-pq' } = options;
  const colors = [];
  
  for (let i = 0; i < steps; i++) {
    const hue = (i / steps) * 360;
    const nits = 100 + (i / steps) * (maxNits - 100); // Scale from 100 to maxNits
    
    colors.push({
      hue,
      nits,
      css: `color(${colorSpace} ${convertHDRColor(hue, nits, transferFunction)})`,
      description: `HDR ${hue}° at ${Math.round(nits)} nits`
    });
  }
  
  return colors;
}

function convertHDRColor(hue, nits, transferFunction) {
  // Simplified HDR conversion - implement proper PQ/HLG curves in production
  const [r, g, b] = hslToRgb(hue, 80, 50);
  const scale = nits / 100; // Scale relative to SDR white (100 nits)
  
  if (transferFunction === 'rec2100-pq') {
    return applyPQTransferFunction([r, g, b], scale).map(v => v.toFixed(4)).join(' ');
  } else if (transferFunction === 'rec2100-hlg') {
    return applyHLGTransferFunction([r, g, b], scale).map(v => v.toFixed(4)).join(' ');
  }
  
  return [r * scale, g * scale, b * scale].map(v => Math.min(1, v).toFixed(4)).join(' ');
}

function applyPQTransferFunction(rgb, scale) {
  // Perceptual Quantization (SMPTE ST 2084) - simplified implementation
  const m1 = 2610 / 16384;
  const m2 = 2523 / 4096 * 128;
  const c1 = 3424 / 4096;
  const c2 = 2413 / 4096 * 32;
  const c3 = 2392 / 4096 * 32;
  
  return rgb.map(v => {
    const L = v * scale / 10000; // Scale to 0-1 range for 10,000 nits
    const Lm1 = Math.pow(L, m1);
    return Math.pow((c1 + c2 * Lm1) / (1 + c3 * Lm1), m2);
  });
}

function applyHLGTransferFunction(rgb, scale) {
  // Hybrid Log-Gamma (ITU-R BT.2100) - simplified implementation
  const a = 0.17883277;
  const b = 0.28466892;
  const c = 0.55991073;
  
  return rgb.map(v => {
    const L = v * scale;
    if (L <= 1/12) {
      return Math.sqrt(3 * L);
    } else {
      return a * Math.log(12 * L - b) + c;
    }
  });
}

function generateBT2100ColorPatterns(steps) {
  // ITU-R BT.2100 specific patterns for HDR broadcast
  const patterns = [];
  const systemColors = [
    { name: 'Reference White', y: 0.75, cb: 0, cr: 0 },
    { name: 'Reference Black', y: 0.0625, cb: 0, cr: 0 },
    { name: 'Red', y: 0.2627, cb: 0.1016, cr: 0.4414 },
    { name: 'Green', y: 0.6778, cb: -0.2773, cr: -0.1641 },
    { name: 'Blue', y: 0.0593, cb: 0.4766, cr: -0.2773 },
    { name: 'Yellow', y: 0.9405, cb: -0.1758, cr: 0.2773 },
    { name: 'Cyan', y: 0.7371, cb: 0.1992, cr: -0.4414 },
    { name: 'Magenta', y: 0.3220, cb: 0.3789, cr: 0.1641 }
  ];
  
  systemColors.forEach(color => {
    patterns.push({
      name: color.name,
      ycbcr: color,
      css: `color(rec2020 ${convertYCbCrToRGB(color.y, color.cb, color.cr).join(' ')})`,
      description: `BT.2100 system color: ${color.name}`
    });
  });
  
  return patterns;
}

function convertYCbCrToRGB(y, cb, cr) {
  // BT.2100 YCbCr to RGB conversion - simplified
  const r = y + 1.7166 * cr;
  const g = y - 0.1873 * cb - 0.6508 * cr;
  const b = y + 1.8556 * cb;
  
  return [
    Math.max(0, Math.min(1, r)).toFixed(4),
    Math.max(0, Math.min(1, g)).toFixed(4),
    Math.max(0, Math.min(1, b)).toFixed(4)
  ];
}

function generateGamutComparison(colorSpaces) {
  const comparison = {};
  const testColors = [
    { name: 'Pure Red', h: 0, s: 100, l: 50 },
    { name: 'Pure Green', h: 120, s: 100, l: 50 },
    { name: 'Pure Blue', h: 240, s: 100, l: 50 },
    { name: 'Cyan', h: 180, s: 100, l: 50 },
    { name: 'Magenta', h: 300, s: 100, l: 50 },
    { name: 'Yellow', h: 60, s: 100, l: 50 }
  ];
  
  testColors.forEach(color => {
    comparison[color.name] = {};
    colorSpaces.forEach(space => {
      comparison[color.name][space] = convertHSLToColorSpace(
        color.h, color.s, color.l, space
      );
    });
  });
  
  return comparison;
}

function generateGamutExclusiveColors(targetSpace, excludeSpaces) {
  // Colors that exist in targetSpace but not in excludeSpaces
  const exclusiveColors = [];
  const testHues = Array.from({ length: 36 }, (_, i) => i * 10); // Every 10 degrees
  
  testHues.forEach(hue => {
    const targetColor = convertHSLToColorSpace(hue, 100, 50, targetSpace, true);
    const isExclusive = excludeSpaces.every(excludeSpace => {
      const excludeColor = convertHSLToColorSpace(hue, 100, 50, excludeSpace, false);
      return !colorsAreEquivalent(targetColor, excludeColor);
    });
    
    if (isExclusive) {
      exclusiveColors.push({
        hue,
        css: targetColor,
        description: `Exclusive to ${targetSpace} at ${hue}°`,
        gamutAdvantage: excludeSpaces
      });
    }
  });
  
  return exclusiveColors;
}

function generatePrintSafeColors(colorSpace, steps) {
  // Colors that can be reproduced in CMYK printing
  const printSafe = [];
  
  for (let i = 0; i < steps; i++) {
    const hue = (i / steps) * 360;
    // Reduce saturation and adjust lightness for CMYK compatibility
    const saturation = 70; // Lower saturation for print
    const lightness = 40 + (i % 3) * 20; // Vary lightness: 40, 60, 80
    
    const color = convertHSLToColorSpace(hue, saturation, lightness, colorSpace);
    
    printSafe.push({
      hue,
      css: color,
      cmykApprox: calculateCMYKApproximation(hue, saturation, lightness),
      description: `Print-safe ${colorSpace} color at ${hue}°`,
      printability: 'excellent'
    });
  }
  
  return printSafe;
}

function calculateCMYKApproximation(h, s, l) {
  // Simplified CMYK approximation
  const [r, g, b] = hslToRgb(h, s, l);
  const k = 1 - Math.max(r, g, b);
  const c = (1 - r - k) / (1 - k) || 0;
  const m = (1 - g - k) / (1 - k) || 0;
  const y = (1 - b - k) / (1 - k) || 0;
  
  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100)
  };
}

function generateSkinTonesPalette(colorSpace) {
  // Optimized skin tone palette for portrait photography
  const skinTones = [
    { name: 'Fair', h: 25, s: 35, l: 85 },
    { name: 'Light', h: 30, s: 45, l: 75 },
    { name: 'Medium', h: 35, s: 55, l: 65 },
    { name: 'Olive', h: 40, s: 45, l: 55 },
    { name: 'Tan', h: 30, s: 65, l: 45 },
    { name: 'Deep', h: 25, s: 75, l: 35 },
    { name: 'Dark', h: 20, s: 60, l: 25 },
    { name: 'Very Dark', h: 15, s: 45, l: 15 }
  ];
  
  return skinTones.map(tone => ({
    name: tone.name,
    css: convertHSLToColorSpace(tone.h, tone.s, tone.l, colorSpace),
    hsl: tone,
    description: `${tone.name} skin tone in ${colorSpace}`,
    category: 'portrait'
  }));
}

function generateNaturePalette(colorSpace) {
  // Nature photography optimized palette
  const natureColors = [
    { name: 'Forest Green', h: 140, s: 70, l: 30 },
    { name: 'Moss Green', h: 100, s: 60, l: 40 },
    { name: 'Sage Green', h: 90, s: 30, l: 60 },
    { name: 'Sky Blue', h: 200, s: 80, l: 70 },
    { name: 'Ocean Blue', h: 210, s: 90, l: 45 },
    { name: 'Sunset Orange', h: 25, s: 90, l: 60 },
    { name: 'Earth Brown', h: 30, s: 60, l: 35 },
    { name: 'Stone Gray', h: 0, s: 5, l: 55 },
    { name: 'Snow White', h: 0, s: 0, l: 95 },
    { name: 'Deep Shadow', h: 0, s: 0, l: 10 }
  ];
  
  return natureColors.map(color => ({
    name: color.name,
    css: convertHSLToColorSpace(color.h, color.s, color.l, colorSpace),
    hsl: color,
    description: `${color.name} optimized for nature photography`,
    category: 'nature'
  }));
}

function generateCMYKSafeColors(colorSpace, steps) {
  // Colors specifically safe for CMYK reproduction
  const cmykSafe = [];
  const cmykFriendlyHues = [0, 30, 60, 120, 180, 240, 300]; // Avoid problematic hues
  
  cmykFriendlyHues.forEach(hue => {
    for (let i = 0; i < Math.ceil(steps / cmykFriendlyHues.length); i++) {
      const lightness = 30 + (i * 15); // 30, 45, 60, 75
      const saturation = 60 - (i * 10); // 60, 50, 40, 30
      
      if (lightness <= 90 && saturation >= 20) {
        const color = convertHSLToColorSpace(hue, saturation, lightness, colorSpace);
        cmykSafe.push({
          hue,
          lightness,
          saturation,
          css: color,
          cmyk: calculateCMYKApproximation(hue, saturation, lightness),
          description: `CMYK-safe ${colorSpace} color`,
          printQuality: 'high'
        });
      }
    }
  });
  
  return cmykSafe;
}

function generateWebToPrintColors(colorSpace, steps) {
  // Colors that work well for both web and print
  const webToPrint = [];
  
  for (let i = 0; i < steps; i++) {
    const hue = (i / steps) * 360;
    const saturation = 50 + Math.sin(i) * 20; // Vary saturation organically
    const lightness = 40 + Math.cos(i) * 25; // Vary lightness organically
    
    // Ensure values are within print-safe ranges
    const safeSaturation = Math.max(30, Math.min(70, saturation));
    const safeLightness = Math.max(20, Math.min(80, lightness));
    
    const color = convertHSLToColorSpace(hue, safeSaturation, safeLightness, colorSpace);
    
    webToPrint.push({
      hue,
      css: color,
      webHex: convertToSRGBFallback(color),
      cmyk: calculateCMYKApproximation(hue, safeSaturation, safeLightness),
      description: `Dual-purpose web/print color at ${Math.round(hue)}°`,
      compatibility: 'universal'
    });
  }
  
  return webToPrint;
}

function generateEnhancedCyanGreen(colorSpace) {
  // Showcase Adobe RGB's strength in cyan-green range
  const cyanGreenColors = [];
  
  // Focus on 120-180 degree hue range where Adobe RGB excels
  for (let hue = 120; hue <= 180; hue += 10) {
    [70, 85, 100].forEach(saturation => {
      [40, 55, 70].forEach(lightness => {
        const color = convertHSLToColorSpace(hue, saturation, lightness, colorSpace);
        cyanGreenColors.push({
          hue,
          saturation,
          lightness,
          css: color,
          description: `Enhanced cyan-green at ${hue}°`,
          gamutAdvantage: 'Adobe RGB strength'
        });
      });
    });
  }
  
  return cyanGreenColors;
}

function generateBrandColorVariations(colorSpace) {
  // Professional brand color variations
  const brandColors = [
    { name: 'Corporate Blue', base: { h: 210, s: 80, l: 50 } },
    { name: 'Tech Green', base: { h: 140, s: 70, l: 45 } },
    { name: 'Creative Purple', base: { h: 270, s: 75, l: 55 } },
    { name: 'Energy Orange', base: { h: 30, s: 85, l: 60 } }
  ];
  
  const variations = [];
  
  brandColors.forEach(brand => {
    const { h, s, l } = brand.base;
    
    // Generate tints, tones, and shades
    const tints = [10, 20, 30].map(amount => ({
      name: `${brand.name} Tint ${amount}%`,
      css: convertHSLToColorSpace(h, s, l + amount, colorSpace),
      variation: 'tint'
    }));
    
    const shades = [10, 20, 30].map(amount => ({
      name: `${brand.name} Shade ${amount}%`,
      css: convertHSLToColorSpace(h, s, l - amount, colorSpace),
      variation: 'shade'
    }));
    
    const tones = [10, 20, 30].map(amount => ({
      name: `${brand.name} Tone ${amount}%`,
      css: convertHSLToColorSpace(h, s - amount, l, colorSpace),
      variation: 'tone'
    }));
    
    variations.push({
      brand: brand.name,
      base: convertHSLToColorSpace(h, s, l, colorSpace),
      tints,
      shades,
      tones
    });
  });
  
  return variations;
}

function generateXYZProgression(illuminant, steps) {
  // Generate progression through XYZ color space
  const whitePoint = ILLUMINANTS[illuminant];
  const colors = [];
  
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    
    // Create progression from black point to white point
    const x = whitePoint.x * t;
    const y = whitePoint.y * t;
    const z = whitePoint.z * t;
    
    colors.push({
      xyz: { x, y, z },
      css: `color(xyz-${illuminant.toLowerCase()} ${x.toFixed(4)} ${y.toFixed(4)} ${z.toFixed(4)})`,
      luminance: y,
      description: `XYZ ${illuminant} progression step ${i + 1}`
    });
  }
  
  return colors;
}

function generateSpectralLocus(illuminant) {
  // Generate colors along the spectral locus (pure wavelengths)
  const spectralColors = [];
  
  // Wavelengths from violet (380nm) to red (700nm)
  for (let wavelength = 380; wavelength <= 700; wavelength += 20) {
    const xyz = wavelengthToXYZ(wavelength, illuminant);
    spectralColors.push({
      wavelength,
      xyz,
      css: `color(xyz-${illuminant.toLowerCase()} ${xyz.x.toFixed(4)} ${xyz.y.toFixed(4)} ${xyz.z.toFixed(4)})`,
      description: `Spectral ${wavelength}nm`,
      purity: 'monochromatic'
    });
  }
  
  return spectralColors;
}

function wavelengthToXYZ(wavelength, illuminant) {
  // Simplified wavelength to XYZ conversion
  // In production, use CIE color matching functions
  let x, y, z;
  
  if (wavelength >= 380 && wavelength < 440) {
    // Violet to blue
    x = 0.1;
    y = 0.05;
    z = 0.8;
  } else if (wavelength < 490) {
    // Blue to cyan
    x = 0.05;
    y = 0.3;
    z = 0.7;
  } else if (wavelength < 510) {
    // Cyan to green
    x = 0.1;
    y = 0.8;
    z = 0.1;
  } else if (wavelength < 580) {
    // Green to yellow
    x = 0.6;
    y = 0.9;
    z = 0.05;
  } else if (wavelength < 645) {
    // Yellow to orange
    x = 0.9;
    y = 0.5;
    z = 0.05;
  } else {
    // Orange to red
    x = 0.9;
    y = 0.1;
    z = 0.05;
  }
  
  // Normalize to illuminant
  const whitePoint = ILLUMINANTS[illuminant];
  return {
    x: x * whitePoint.x,
    y: y * whitePoint.y,
    z: z * whitePoint.z
  };
}

function generateChromaticitySamples(illuminant, steps) {
  // Sample points across the chromaticity diagram
  const samples = [];
  
  for (let i = 0; i < steps; i++) {
    for (let j = 0; j < steps; j++) {
      const x = i / (steps - 1);
      const y = j / (steps - 1);
      
      // Only include valid chromaticity coordinates (x + y <= 1)
      if (x + y <= 1) {
        const z = 1 - x - y;
        const whitePoint = ILLUMINANTS[illuminant];
        
        const X = x * whitePoint.x;
        const Y = y * whitePoint.y;
        const Z = z * whitePoint.z;
        
        samples.push({
          chromaticity: { x, y, z },
          xyz: { x: X, y: Y, z: Z },
          css: `color(xyz-${illuminant.toLowerCase()} ${X.toFixed(4)} ${Y.toFixed(4)} ${Z.toFixed(4)})`,
          description: `Chromaticity (${x.toFixed(2)}, ${y.toFixed(2)})`
        });
      }
    }
  }
  
  return samples;
}

function generateMacAdamEllipses(illuminant) {
  // Simplified MacAdam ellipse centers (just noticeable differences)
  const ellipseCenters = [
    { x: 0.16, y: 0.057 },  // Blue
    { x: 0.187, y: 0.468 }, // Green
    { x: 0.253, y: 0.363 }, // Green-Yellow
    { x: 0.447, y: 0.386 }, // Yellow
    { x: 0.587, y: 0.353 }, // Orange
    { x: 0.667, y: 0.284 }  // Red
  ];
  
  return ellipseCenters.map((center, index) => {
    const whitePoint = ILLUMINANTS[illuminant];
    const z = 1 - center.x - center.y;
    
    const X = center.x * whitePoint.x;
    const Y = center.y * whitePoint.y;
    const Z = z * whitePoint.z;
    
    return {
      ellipse: index + 1,
      chromaticity: { x: center.x, y: center.y, z },
      xyz: { x: X, y: Y, z: Z },
      css: `color(xyz-${illuminant.toLowerCase()} ${X.toFixed(4)} ${Y.toFixed(4)} ${Z.toFixed(4)})`,
      description: `MacAdam ellipse center ${index + 1}`,
      jnd: 'just noticeable difference'
    };
  });
}

function generateHDRWhitePoints(config) {
  // Generate HDR white points at different nit levels
  const whitePoints = [];
  const nitLevels = [100, 400, 1000, 4000, 10000];
  
  nitLevels.forEach(nits => {
    if (nits <= config.maxNits) {
      const scale = nits / 100; // Relative to SDR
      whitePoints.push({
        nits,
        css: `color(${config.colorSpace} ${scale.toFixed(4)} ${scale.toFixed(4)} ${scale.toFixed(4)})`,
        description: `${nits} nit white point`,
        category: nits <= 400 ? 'standard' : 'premium'
      });
    }
  });
  
  return whitePoints;
}

function generateExtendedLuminanceColors(config) {
  // HDR colors with extended luminance range
  const colors = [];
  const hues = [0, 60, 120, 180, 240, 300];
  const nitLevels = [100, 600, 1500, 4000];
  
  hues.forEach(hue => {
    nitLevels.forEach(nits => {
      if (nits <= config.maxNits) {
        const color = convertHDRColor(hue, nits, config.transferFunction);
        colors.push({
          hue,
          nits,
          css: `color(${config.colorSpace} ${color})`,
          description: `${hue}° at ${nits} nits`,
          luminanceCategory: categorizeNitLevel(nits)
        });
      }
    });
  });
  
  return colors;
}

function categorizeNitLevel(nits) {
  if (nits <= 100) return 'standard';
  if (nits <= 400) return 'enhanced';
  if (nits <= 1000) return 'premium';
  return 'reference';
}

function generateHDRAccentColors(config) {
  // UI accent colors optimized for HDR
  const accents = [
    { name: 'Primary', h: 210, nits: 400 },
    { name: 'Success', h: 140, nits: 300 },
    { name: 'Warning', h: 45, nits: 600 },
    { name: 'Error', h: 0, nits: 500 },
    { name: 'Info', h: 200, nits: 350 }
  ];
  
  return accents.map(accent => ({
    name: accent.name,
    css: `color(${config.colorSpace} ${convertHDRColor(accent.h, accent.nits, config.transferFunction)})`,
    nits: accent.nits,
    description: `HDR ${accent.name} accent color`,
    useCase: 'UI elements'
  }));
}

function generateToneMappingPatterns(config) {
  // Test patterns for tone mapping algorithms
  const patterns = [];
  const testNits = [100, 500, 1000, 2000, 4000, 8000];
  
  testNits.forEach(nits => {
    if (nits <= config.maxNits) {
      patterns.push({
        nits,
        white: `color(${config.colorSpace} ${convertHDRColor(0, nits, config.transferFunction)})`,
        gray: `color(${config.colorSpace} ${convertHDRColor(0, nits * 0.18, config.transferFunction)})`,
        description: `Tone mapping test at ${nits} nits`,
        reference: '18% gray and white point'
      });
    }
  });
  
  return patterns;
}

// Utility functions
function colorsAreEquivalent(color1, color2, tolerance = 0.01) {
  // Simple color equivalence check - improve for production
  return Math.abs(color1.length - color2.length) < tolerance;
}

function generatePrintOptimizedColors(colorSpace) {
  // Colors specifically optimized for print reproduction
  return [
    { name: 'Rich Black', css: convertHSLToColorSpace(0, 0, 5, colorSpace) },
    { name: 'Pure Black', css: convertHSLToColorSpace(0, 0, 0, colorSpace) },
    { name: 'Paper White', css: convertHSLToColorSpace(0, 0, 96, colorSpace) },
    { name: 'Offset White', css: convertHSLToColorSpace(45, 5, 94, colorSpace) }
  ];
}

// Export all functions
export {
  generateDisplayP3ColorPattern,
  generateRec2020ColorPattern,
  generateProPhotoRgbColorPattern,
  generateA98RgbColorPattern,
  generateXYZColorPattern,
  generateWideGamutColorPattern,
  generateHDRColorPattern,
  COLOR_SPACES,
  ILLUMINANTS,
  HDR_TRANSFER_FUNCTIONS
};