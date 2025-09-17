/**
 * System and Environment Color Generators
 * Handles CSS system colors, color-mix(), and accessibility features
 */

/**
 * Generate color mix patterns using CSS color-mix() function
 * Allows blending colors in different color spaces
 * @param {string} color1 - First color
 * @param {string} color2 - Second color
 * @param {number} steps - Number of mix steps
 * @param {string} colorSpace - Color space for mixing
 * @returns {string[]} Array of color-mix() functions
 */
 function generateColorMixPattern(color1 = '#ff0000', color2 = '#0000ff', steps = 10, colorSpace = 'srgb') {
  const colors = [];
  const interpolationMethods = ['shorter hue', 'longer hue', 'increasing hue', 'decreasing hue'];
  
  for (let i = 0; i <= steps; i++) {
    const percentage = (i / steps) * 100;
    const method = colorSpace === 'hsl' || colorSpace === 'hwb' ? 
      interpolationMethods[i % interpolationMethods.length] : '';
    
    const mixFunction = method ? 
      `color-mix(in ${colorSpace} ${method}, ${color1} ${percentage}%, ${color2})` :
      `color-mix(in ${colorSpace}, ${color1} ${percentage}%, ${color2})`;
    
    colors.push(mixFunction);
  }
  return colors;
}

/**
 * Generate color contrast patterns for accessibility testing
 * Creates colors with specific contrast ratios against a background
 * @param {string} backgroundColor - Background color to test against
 * @param {number[]} targetRatios - Target contrast ratios to achieve
 * @returns {Object[]} Array of contrast color objects
 */
 function generateColorContrastPattern(backgroundColor = '#ffffff', targetRatios = [3, 4.5, 7, 12]) {
  const colors = [];
  const bgLuminance = getLuminance(backgroundColor);
  
  targetRatios.forEach(ratio => {
    // Generate both lighter and darker variants
    const darkerColor = generateColorForContrast(bgLuminance, ratio, 'darker');
    const lighterColor = generateColorForContrast(bgLuminance, ratio, 'lighter');
    
    colors.push({
      ratio: ratio,
      darker: darkerColor,
      lighter: lighterColor,
      css: `contrast(${ratio})` // CSS contrast() function syntax
    });
  });
  
  return colors;
}

/**
 * Generate system color patterns using CSS system colors
 * These adapt to the user's OS theme and preferences
 * @returns {Object} Object with different system color categories
 */
 function generateSystemColorPattern() {
  const systemColors = [
    'Canvas', 'CanvasText', 'LinkText', 'VisitedText', 'ActiveText',
    'ButtonFace', 'ButtonText', 'ButtonBorder', 'Field', 'FieldText',
    'Highlight', 'HighlightText', 'SelectedItem', 'SelectedItemText',
    'Mark', 'MarkText', 'AccentColor', 'AccentColorText'
  ];
  
  const patterns = {
    semantic: systemColors.map(color => ({
      name: color,
      value: color.toLowerCase(),
      description: getSystemColorDescription(color)
    })),
    
    // Light/dark mode aware patterns
    adaptive: [
      'light-dark(#ffffff, #000000)', // White in light mode, black in dark mode
      'light-dark(#f8f9fa, #212529)', // Light gray / dark gray
      'light-dark(#007bff, #0d6efd)', // Blue variants
      'light-dark(#28a745, #20c997)', // Green variants
    ],
    
    // Environment-based colors
    environmental: [
      'env(safe-area-inset-top, 0px)',
      'env(safe-area-inset-bottom, 0px)',
      'color-scheme: light dark', // Declares support for both schemes
    ]
  };
  
  return patterns;
}

// ===== HELPER FUNCTIONS =====

function getLuminance(color) {
  // Calculate relative luminance for contrast calculations
  // This is a simplified implementation - in production, use proper color conversion
  return 0.5; // Placeholder
}

function generateColorForContrast(bgLuminance, targetRatio, direction) {
  // Generate a color that meets the target contrast ratio
  // This is a simplified implementation
  return direction === 'darker' ? '#000000' : '#ffffff';
}

function getSystemColorDescription(colorName) {
  const descriptions = {
    'Canvas': 'Background color of application content or documents',
    'CanvasText': 'Text color in application content or documents',
    'LinkText': 'Color of non-visited links',
    'VisitedText': 'Color of visited links',
    'ActiveText': 'Color of active links',
    'ButtonFace': 'Background color of controls',
    'ButtonText': 'Text color on controls',
    'ButtonBorder': 'Border color of controls',
    'Field': 'Background color of input fields',
    'FieldText': 'Text color in input fields',
    'Highlight': 'Background color of selected text',
    'HighlightText': 'Text color of selected text',
    'SelectedItem': 'Background color of selected items',
    'SelectedItemText': 'Text color of selected items',
    'Mark': 'Background color of marked text',
    'MarkText': 'Text color of marked text',
    'AccentColor': 'User\'s accent color preference',
    'AccentColorText': 'Text color that contrasts with accent color'
  };
  return descriptions[colorName] || 'System color';
}

export{
  generateColorMixPattern,
  generateColorContrastPattern,
  generateSystemColorPattern
}