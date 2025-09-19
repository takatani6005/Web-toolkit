/**
 * System and Environment Color Generators
 * Handles CSS system colors, color-mix(), accessibility features, and environment-aware color patterns
 */
import {hexToHSL, generateColorForContrast } from './utils.js';

/**
 * Generate color mix patterns using CSS color-mix() function
 * Allows blending colors in different color spaces with various interpolation methods
 * @param {string} color1 - First color (hex, rgb, hsl, etc.)
 * @param {string} color2 - Second color (hex, rgb, hsl, etc.)
 * @param {number} steps - Number of mix steps (default: 10)
 * @param {string} colorSpace - Color space for mixing (srgb, display-p3, hsl, hwb, lch, oklch)
 * @param {Object} options - Additional options for mixing
 * @returns {Object} Object containing different mix patterns and utilities
 */
function generateColorMixPattern(color1 = '#ff0000', color2 = '#0000ff', steps = 10, colorSpace = 'srgb', options = {}) {
  const {
    includeAlpha = false,
    bidirectional = true,
    generateCSS = true,
    includePresets = true
  } = options;

  const interpolationMethods = {
    hue: ['shorter hue', 'longer hue', 'increasing hue', 'decreasing hue'],
    polar: colorSpace === 'hsl' || colorSpace === 'hwb' || colorSpace === 'lch' || colorSpace === 'oklch'
  };

  // Basic gradient mix
  const gradient = [];
  for (let i = 0; i <= steps; i++) {
    const percentage = (i / steps) * 100;
    const method = interpolationMethods.polar ? 
      interpolationMethods.hue[0] : ''; // Use shorter hue by default
    
    const mixFunction = method ? 
      `color-mix(in ${colorSpace} ${method}, ${color1} ${percentage}%, ${color2})` :
      `color-mix(in ${colorSpace}, ${color1} ${percentage}%, ${color2})`;
    
    gradient.push({
      step: i,
      percentage: Math.round(percentage * 100) / 100,
      mix: mixFunction,
      cssCustomProperty: `--color-mix-${i}: ${mixFunction}`
    });
  }

  // Advanced mixing patterns
  const patterns = {
    gradient,
    
    // Hue rotation patterns (for polar color spaces)
    hueRotations: interpolationMethods.polar ? 
      interpolationMethods.hue.map(method => ({
        method,
        colors: Array.from({length: steps + 1}, (_, i) => {
          const percentage = (i / steps) * 100;
          return `color-mix(in ${colorSpace} ${method}, ${color1} ${percentage}%, ${color2})`;
        })
      })) : [],

    // Triadic mixing (three colors)
    triadic: (() => {
      const midColor = gradient[Math.floor(steps / 2)]?.mix || color1;
      return Array.from({length: steps + 1}, (_, i) => {
        const t = i / steps;
        if (t < 0.5) {
          const percentage = (t * 2) * 100;
          return `color-mix(in ${colorSpace}, ${color1} ${percentage}%, ${midColor})`;
        } else {
          const percentage = ((t - 0.5) * 2) * 100;
          return `color-mix(in ${colorSpace}, ${midColor} ${percentage}%, ${color2})`;
        }
      });
    })(),

    // Alpha blending patterns
    alphaBlend: includeAlpha ? Array.from({length: steps + 1}, (_, i) => {
      const alpha = i / steps;
      return {
        alpha: Math.round(alpha * 100) / 100,
        mix: `color-mix(in ${colorSpace}, ${color1} ${alpha * 100}%, transparent)`,
        overlay: `color-mix(in ${colorSpace}, ${color1}, ${color2} ${alpha * 100}%)`
      };
    }) : []
  };

  // CSS utilities
  const cssUtilities = generateCSS ? {
    customProperties: gradient.map(g => g.cssCustomProperty).join(';\n  '),
    gradientCSS: `linear-gradient(to right, ${gradient.map(g => g.mix).join(', ')})`,
    steppedGradient: `linear-gradient(to right, ${gradient.map((g, i) => 
      `${g.mix} ${i * (100/steps)}%, ${g.mix} ${(i + 1) * (100/steps)}%`
    ).join(', ')})`,
    
    // CSS class generators
    classes: gradient.map((g, i) => ({
      className: `mix-${i}`,
      css: `.mix-${i} { background-color: ${g.mix}; }`
    }))
  } : {};

  return {
    colors: patterns,
    css: cssUtilities,
    metadata: {
      colorSpace,
      steps,
      baseColors: [color1, color2],
      supportsPolarInterpolation: interpolationMethods.polar
    }
  };
}

/**
 * Enhanced color contrast pattern generator with proper WCAG calculations
 * @param {string} backgroundColor - Background color to test against
 * @param {number[]} targetRatios - Target contrast ratios (WCAG AA: 4.5, AAA: 7)
 * @param {Object} options - Generation options
 * @returns {Object} Comprehensive contrast analysis
 */
function generateColorContrastPattern(backgroundColor = '#ffffff', targetRatios = [3, 4.5, 7, 12, 21], options = {}) {
  const {
    includeWCAGInfo = true,
    generateTestColors = true,
    includeCSS = true,
    colorFormats = ['hex', 'rgb', 'hsl']
  } = options;

  const bgLuminance = calculateLuminance(backgroundColor);
  const bgHSL = hexToHSL(backgroundColor);
  
  const contrastResults = targetRatios.map(ratio => {
    const darkerColor = generateColorForContrast(bgLuminance, ratio, 'darker', bgHSL);
    const lighterColor = generateColorForContrast(bgLuminance, ratio, 'lighter', bgHSL);
    
    // Calculate actual achieved ratios
    const darkerRatio = calculateContrastRatio(calculateLuminance(darkerColor), bgLuminance);
    const lighterRatio = calculateContrastRatio(calculateLuminance(lighterColor), bgLuminance);
    
    const result = {
      targetRatio: ratio,
      wcagLevel: getWCAGLevel(ratio),
      colors: {
        darker: {
          hex: darkerColor,
          rgb: hexToRgb(darkerColor),
          hsl: hexToHSL(darkerColor),
          actualRatio: Math.round(darkerRatio * 100) / 100
        },
        lighter: {
          hex: lighterColor,
          rgb: hexToRgb(lighterColor),
          hsl: hexToHSL(lighterColor),
          actualRatio: Math.round(lighterRatio * 100) / 100
        }
      },
      css: {
        darker: `color-contrast(${backgroundColor} vs ${darkerColor})`,
        lighter: `color-contrast(${backgroundColor} vs ${lighterColor})`,
        auto: `color-contrast(${backgroundColor} vs black, white)` // Automatic contrast
      }
    };

    // Add test color variations if requested
    if (generateTestColors) {
      result.testSuite = generateContrastTestSuite(backgroundColor, ratio);
    }

    return result;
  });

  // Accessibility compliance summary
  const compliance = {
    AA_Normal: contrastResults.filter(r => r.targetRatio >= 4.5),
    AA_Large: contrastResults.filter(r => r.targetRatio >= 3),
    AAA_Normal: contrastResults.filter(r => r.targetRatio >= 7),
    AAA_Large: contrastResults.filter(r => r.targetRatio >= 4.5)
  };

  return {
    backgroundColor,
    backgroundLuminance: Math.round(bgLuminance * 1000) / 1000,
    contrastColors: contrastResults,
    compliance,
    recommendations: generateAccessibilityRecommendations(contrastResults),
    css: includeCSS ? generateContrastCSS(contrastResults, backgroundColor) : null
  };
}

/**
 * Comprehensive system color pattern generator
 * Includes modern CSS system colors, environment variables, and theme-aware patterns
 * @param {Object} options - Generation options
 * @returns {Object} Complete system color patterns
 */
function generateSystemColorPattern(options = {}) {
  const {
    includeDeprecated = false,
    includeExperimental = true,
    generateCSS = true,
    includeCustomProperties = true
  } = options;

  // Modern CSS system colors (Level 4)
  const modernSystemColors = [
    { name: 'Canvas', value: 'Canvas', description: 'Background color of application content or documents', type: 'surface' },
    { name: 'CanvasText', value: 'CanvasText', description: 'Text color in application content', type: 'text' },
    { name: 'LinkText', value: 'LinkText', description: 'Color of non-visited links', type: 'interactive' },
    { name: 'VisitedText', value: 'VisitedText', description: 'Color of visited links', type: 'interactive' },
    { name: 'ActiveText', value: 'ActiveText', description: 'Color of active links', type: 'interactive' },
    { name: 'ButtonFace', value: 'ButtonFace', description: 'Background color of controls', type: 'control' },
    { name: 'ButtonText', value: 'ButtonText', description: 'Text color on controls', type: 'control' },
    { name: 'ButtonBorder', value: 'ButtonBorder', description: 'Border color of controls', type: 'control' },
    { name: 'Field', value: 'Field', description: 'Background color of input fields', type: 'input' },
    { name: 'FieldText', value: 'FieldText', description: 'Text color in input fields', type: 'input' },
    { name: 'Highlight', value: 'Highlight', description: 'Background color of selected text', type: 'selection' },
    { name: 'HighlightText', value: 'HighlightText', description: 'Text color of selected text', type: 'selection' },
    { name: 'SelectedItem', value: 'SelectedItem', description: 'Background color of selected items', type: 'selection' },
    { name: 'SelectedItemText', value: 'SelectedItemText', description: 'Text color of selected items', type: 'selection' },
    { name: 'Mark', value: 'Mark', description: 'Background color of marked text', type: 'highlight' },
    { name: 'MarkText', value: 'MarkText', description: 'Text color of marked text', type: 'highlight' },
    { name: 'AccentColor', value: 'AccentColor', description: 'User\'s accent color preference', type: 'brand' },
    { name: 'AccentColorText', value: 'AccentColorText', description: 'Text color that contrasts with accent color', type: 'brand' }
  ];

  // Experimental and newer system colors
  const experimentalColors = includeExperimental ? [
    { name: 'GrayText', value: 'GrayText', description: 'Disabled text color', type: 'state' },
    { name: 'WindowText', value: 'WindowText', description: 'Window text color', type: 'text' },
    { name: 'Window', value: 'Window', description: 'Window background color', type: 'surface' }
  ] : [];

  // Light/dark mode patterns
  const adaptivePatterns = [
    {
      name: 'Primary Background',
      lightDark: 'light-dark(#ffffff, #0f0f0f)',
      description: 'Main background that adapts to color scheme'
    },
    {
      name: 'Secondary Background', 
      lightDark: 'light-dark(#f8f9fa, #1a1a1a)',
      description: 'Secondary surfaces like cards, panels'
    },
    {
      name: 'Primary Text',
      lightDark: 'light-dark(#212529, #f8f9fa)',
      description: 'Primary text color'
    },
    {
      name: 'Secondary Text',
      lightDark: 'light-dark(#6c757d, #adb5bd)',
      description: 'Secondary/muted text'
    },
    {
      name: 'Border Color',
      lightDark: 'light-dark(#dee2e6, #343a40)',
      description: 'Border and divider colors'
    },
    {
      name: 'Brand Primary',
      lightDark: 'light-dark(#0066cc, #4da6ff)',
      description: 'Primary brand color adaptation'
    },
    {
      name: 'Success Color',
      lightDark: 'light-dark(#28a745, #20c997)',
      description: 'Success state color'
    },
    {
      name: 'Warning Color',
      lightDark: 'light-dark(#ffc107, #ffcd39)',
      description: 'Warning state color'
    },
    {
      name: 'Error Color',
      lightDark: 'light-dark(#dc3545, #ff6b7a)',
      description: 'Error state color'
    }
  ];

  // Environment variables and safe area patterns
  const environmentPatterns = {
    safeArea: {
      top: 'env(safe-area-inset-top, 0px)',
      right: 'env(safe-area-inset-right, 0px)', 
      bottom: 'env(safe-area-inset-bottom, 0px)',
      left: 'env(safe-area-inset-left, 0px)',
      description: 'Safe area insets for mobile devices'
    },
    
    viewport: {
      width: 'env(viewport-width, 100vw)',
      height: 'env(viewport-height, 100vh)',
      description: 'Viewport dimensions accounting for browser UI'
    },

    // Keyboard avoidance (experimental)
    keyboard: includeExperimental ? {
      height: 'env(keyboard-inset-height, 0px)',
      description: 'Virtual keyboard height on mobile'
    } : null,

    // Fold and hinge support (experimental)
    foldable: includeExperimental ? {
      foldLeft: 'env(fold-left, 0px)',
      foldRight: 'env(fold-right, 0px)',
      foldTop: 'env(fold-top, 0px)',
      foldBottom: 'env(fold-bottom, 0px)',
      description: 'Foldable device hinge positions'
    } : null
  };

  // Color scheme declarations
  const colorSchemes = [
    'light',
    'dark',
    'light dark', // Supports both
    'only light',
    'only dark',
    // Custom schemes (experimental)
    ...(includeExperimental ? ['high-contrast', 'forced-colors'] : [])
  ];

  // Preference-based patterns
  const preferencePatterns = {
    reducedMotion: '@media (prefers-reduced-motion: reduce)',
    highContrast: '@media (prefers-contrast: high)',
    reducedData: '@media (prefers-reduced-data: reduce)',
    colorScheme: '@media (prefers-color-scheme: dark)',
    reducedTransparency: includeExperimental ? '@media (prefers-reduced-transparency: reduce)' : null
  };

  const result = {
    systemColors: {
      modern: modernSystemColors,
      experimental: experimentalColors,
      byType: groupSystemColorsByType([...modernSystemColors, ...experimentalColors])
    },
    
    adaptive: {
      lightDark: adaptivePatterns,
      schemes: colorSchemes
    },

    environment: Object.fromEntries(
      Object.entries(environmentPatterns).filter(([_, value]) => value !== null)
    ),

    preferences: Object.fromEntries(
      Object.entries(preferencePatterns).filter(([_, value]) => value !== null)
    ),

    // CSS generation
    css: generateCSS ? generateSystemColorCSS({
      systemColors: [...modernSystemColors, ...experimentalColors],
      adaptive: adaptivePatterns,
      environment: environmentPatterns,
      includeCustomProperties
    }) : null
  };

  return result;
}

// ===== ENHANCED HELPER FUNCTIONS =====


/**
 * Get WCAG compliance level for contrast ratio
 */
function getWCAGLevel(ratio) {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA Large';
  return 'Fail';
}

/**
 * Group system colors by their functional type
 */
function groupSystemColorsByType(colors) {
  return colors.reduce((acc, color) => {
    if (!acc[color.type]) acc[color.type] = [];
    acc[color.type].push(color);
    return acc;
  }, {});
}

/**
 * Generate comprehensive CSS for system colors
 */
function generateSystemColorCSS(config) {
  const { systemColors, adaptive, environment, includeCustomProperties } = config;
  
  let css = '';
  
  // Root custom properties
  if (includeCustomProperties) {
    css += ':root {\n';
    css += '  /* System Colors */\n';
    systemColors.forEach(color => {
      css += `  --sys-${color.name.toLowerCase().replace(/([A-Z])/g, '-$1')}: ${color.value};\n`;
    });
    
    css += '\n  /* Adaptive Colors */\n';
    adaptive.forEach(pattern => {
      const name = pattern.name.toLowerCase().replace(/\s+/g, '-');
      css += `  --adaptive-${name}: ${pattern.lightDark};\n`;
    });
    
    if (environment.safeArea) {
      css += '\n  /* Environment Variables */\n';
      Object.entries(environment.safeArea).forEach(([key, value]) => {
        if (key !== 'description') {
          css += `  --safe-area-${key}: ${value};\n`;
        }
      });
    }
    
    css += '}\n\n';
  }
  
  // Color scheme support
  css += `html {\n  color-scheme: light dark;\n}\n\n`;
  
  // Utility classes
  css += '/* System Color Utilities */\n';
  systemColors.forEach(color => {
    const className = color.name.toLowerCase().replace(/([A-Z])/g, '-$1');
    css += `.bg-${className} { background-color: ${color.value}; }\n`;
    css += `.text-${className} { color: ${color.value}; }\n`;
  });
  
  return css;
}

/**
 * Generate accessibility recommendations based on contrast analysis
 */
function generateAccessibilityRecommendations(contrastResults) {
  const recommendations = [];
  
  contrastResults.forEach(result => {
    if (result.targetRatio >= 4.5) {
      recommendations.push({
        level: 'WCAG AA Normal Text',
        ratio: result.targetRatio,
        status: 'compliant',
        colors: result.colors
      });
    }
  });
  
  return recommendations;
}

/**
 * Generate CSS for contrast patterns
 */
function generateContrastCSS(contrastResults, backgroundColor) {
  let css = `:root {\n  --bg-color: ${backgroundColor};\n`;
  
  contrastResults.forEach((result, index) => {
    css += `  --contrast-${result.targetRatio}-dark: ${result.colors.darker.hex};\n`;
    css += `  --contrast-${result.targetRatio}-light: ${result.colors.lighter.hex};\n`;
  });
  
  css += '}\n';
  return css;
}

/**
 * Generate test suite for contrast validation
 */
function generateContrastTestSuite(backgroundColor, targetRatio) {
  return {
    backgroundColor,
    targetRatio,
    testColors: [
      '#000000', '#ffffff', '#808080',
      '#ff0000', '#00ff00', '#0000ff',
      '#ffff00', '#ff00ff', '#00ffff'
    ].map(color => ({
      color,
      ratio: calculateContrastRatio(
        calculateLuminance(color),
        calculateLuminance(backgroundColor)
      ),
      passes: calculateContrastRatio(
        calculateLuminance(color),
        calculateLuminance(backgroundColor)
      ) >= targetRatio
    }))
  };
}

export {
  generateColorMixPattern,
  generateColorContrastPattern,
  generateSystemColorPattern,
};