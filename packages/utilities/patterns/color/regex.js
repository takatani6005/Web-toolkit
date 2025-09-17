/**
 * Color Regex Pattern Generators
 * Creates regex patterns for matching various color formats
 */

/**
 * Generate CMYK regex pattern for pattern matching
 * @param {Object} options - Configuration options
 * @param {boolean} [options.anchors=true] - Include anchors
 * @param {boolean} [options.capture=false] - Use capturing groups
 * @returns {RegExp} CMYK pattern regex
 */
 function generateCmykColorPattern(options = {}) {
  const { anchors = true, capture = false } = options;

  const num = '(?:100(?:\\.0+)?|\\d{1,2}(?:\\.\\d+)?)';
  const numWithPercent = num + '%?';
  const sep = '(?:\\s*,\\s*|\\s+)';
  const group = capture ? '(' + numWithPercent + ')' : '(?:' + numWithPercent + ')';

  const pattern = (anchors ? '^\\s*' : '') +
    '[cC][mM][yY][kK]\\(\\s*' +
    group + sep + group + sep + group + sep + group +
    '\\s*\\)' +
    (anchors ? '\\s*$' : '');

  return new RegExp(pattern, 'i');
}

/**
 * Create RGB regex pattern with flexible options
 * @param {Object} options - Configuration options
 * @param {boolean} [options.allowAlpha=false] - Allow alpha channel
 * @param {boolean} [options.allowPercentage=false] - Allow percentage values
 * @param {boolean} [options.allowSpaces=true] - Allow spaces as separators
 * @param {boolean} [options.strictSyntax=false] - Use strict comma separation
 * @returns {RegExp} RGB pattern regex
 */
 function createRgbPattern(options = {}) {
  const { 
    allowAlpha = false, 
    allowPercentage = false, 
    allowSpaces = true,
    strictSyntax = false 
  } = options;
  
  const numValue = allowPercentage 
    ? '(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|(?:[0-9]{1,3}%|100%))'
    : '(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';
  
  const alphaValue = '(?:0(?:\\.[0-9]+)?|1(?:\\.0+)?|\\.[0-9]+|[0-9]{1,3}%)';
  const space = allowSpaces ? '\\s*' : '';
  const separator = strictSyntax ? ',' : '[,\\s]';
  
  const basePattern = `rgb\\(${space}${numValue}${space}${separator}${space}${numValue}${space}${separator}${space}${numValue}${space}\\)`;
  const alphaPattern = allowAlpha ? `|rgba\\(${space}${numValue}${space}${separator}${space}${numValue}${space}${separator}${space}${numValue}${space}${separator}${space}${alphaValue}${space}\\)` : '';
  
  return new RegExp(`^(?:${basePattern}${alphaPattern})$`, 'i');
}

/**
 * Generate RGBA regex pattern
 * @param {Object} options - Configuration options
 * @returns {RegExp} RGBA pattern regex
 */
 function createRgbaPattern(options = {}) {
  return createRgbPattern({ ...options, allowAlpha: true });
}

/**
 * Create HSL regex pattern with flexible options
 * @param {Object} options - Configuration options
 * @param {boolean} [options.allowAlpha=false] - Allow alpha channel
 * @param {boolean} [options.allowSpaces=true] - Allow spaces as separators
 * @param {boolean} [options.allowTurns=false] - Allow turn units for hue
 * @param {boolean} [options.strictSyntax=false] - Use strict comma separation
 * @returns {RegExp} HSL pattern regex
 */
 function createHslPattern(options = {}) {
  const { 
    allowAlpha = false, 
    allowSpaces = true,
    allowTurns = false,
    strictSyntax = false 
  } = options;
  
  const hueValue = allowTurns 
    ? '(?:(?:360|3[0-5][0-9]|[12]?[0-9]{1,2})(?:deg)?|(?:1(?:\\.0+)?|0(?:\\.[0-9]+)?)turn|(?:[0-9]*\\.?[0-9]+)rad)'
    : '(?:360|3[0-5][0-9]|[12]?[0-9]{1,2})(?:deg)?';
  
  const percentValue = '(?:100|[0-9]{1,2})%';
  const alphaValue = '(?:0(?:\\.[0-9]+)?|1(?:\\.0+)?|\\.[0-9]+|[0-9]{1,3}%)';
  const space = allowSpaces ? '\\s*' : '';
  const separator = strictSyntax ? ',' : '[,\\s]';
  
  const basePattern = `hsl\\(${space}${hueValue}${space}${separator}${space}${percentValue}${space}${separator}${space}${percentValue}${space}\\)`;
  const alphaPattern = allowAlpha ? `|hsla\\(${space}${hueValue}${space}${separator}${space}${percentValue}${space}${separator}${space}${percentValue}${space}${separator}${space}${alphaValue}${space}\\)` : '';
  
  return new RegExp(`^(?:${basePattern}${alphaPattern})$`, 'i');
}

/**
 * Generate HSLA regex pattern
 * @param {Object} options - Configuration options
 * @returns {RegExp} HSLA pattern regex
 */
 function createHslaPattern(options = {}) {
  return createHslPattern({ ...options, allowAlpha: true });
}

/**
 * Generate HWB regex pattern
 * @param {Object} options - Configuration options
 * @param {boolean} [options.allowAlpha=false] - Allow alpha channel
 * @param {boolean} [options.allowSpaces=true] - Allow spaces as separators
 * @param {boolean} [options.allowTurns=false] - Allow turn units for hue
 * @param {boolean} [options.strictSyntax=false] - Use strict comma separation
 * @returns {RegExp} HWB pattern regex
 */
 function createHwbPattern(options = {}) {
  const { 
    allowAlpha = false, 
    allowSpaces = true,
    allowTurns = false,
    strictSyntax = false 
  } = options;
  
  const hueValue = allowTurns 
    ? '(?:(?:360|3[0-5][0-9]|[12]?[0-9]{1,2})(?:deg)?|(?:1(?:\\.0+)?|0(?:\\.[0-9]+)?)turn|(?:[0-9]*\\.?[0-9]+)rad)'
    : '(?:360|3[0-5][0-9]|[12]?[0-9]{1,2})(?:deg)?';
  
  const percentValue = '(?:100|[0-9]{1,2})%';
  const alphaValue = '(?:0(?:\\.[0-9]+)?|1(?:\\.0+)?|\\.[0-9]+|[0-9]{1,3}%)';
  const space = allowSpaces ? '\\s*' : '';
  const separator = strictSyntax ? ',' : '[,\\s]';
  
  const alphaPattern = allowAlpha ? `${separator}${space}${alphaValue}${space}` : '';
  
  return new RegExp(`^hwb\\(${space}${hueValue}${space}${separator}${space}${percentValue}${space}${separator}${space}${percentValue}${alphaPattern}\\)$`, 'i');
}

/**
 * Create a hex color regex pattern
 * @param {Object} options - Configuration options
 * @param {boolean} [options.allowShort=true] - Allow 3-digit hex
 * @param {boolean} [options.allowAlpha=true] - Allow alpha channel
 * @param {boolean} [options.requireHash=true] - Require # prefix
 * @returns {RegExp} Hex pattern regex
 */
 function createHexPattern(options = {}) {
  const { allowShort = true, allowAlpha = true, requireHash = true } = options;
  
  const prefix = requireHash ? '#' : '#?';
  let patterns = ['[0-9A-Fa-f]{6}']; // 6-digit hex
  
  if (allowShort) {
    patterns.push('[0-9A-Fa-f]{3}'); // 3-digit hex
  }
  
  if (allowAlpha) {
    patterns.push('[0-9A-Fa-f]{8}'); // 8-digit hex with alpha
    if (allowShort) {
      patterns.push('[0-9A-Fa-f]{4}'); // 4-digit hex with alpha
    }
  }
  
  return new RegExp(`^${prefix}(?:${patterns.join('|')})$`, 'i');
}

/**
 * Create a named color regex pattern
 * @param {string[]} [colorNames] - Array of color names to match
 * @returns {RegExp} Named color pattern regex
 */
 function createNamedColorPattern(colorNames = null) {
  const defaultColors = [
    'aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure', 'beige', 'bisque',
    'black', 'blanchedalmond', 'blue', 'blueviolet', 'brown', 'burlywood',
    'cadetblue', 'chartreuse', 'chocolate', 'coral', 'cornflowerblue', 'cornsilk',
    'crimson', 'cyan', 'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray',
    'darkgreen', 'darkgrey', 'darkkhaki', 'darkmagenta', 'darkolivegreen',
    'darkorange', 'darkorchid', 'darkred', 'darksalmon', 'darkseagreen',
    'darkslateblue', 'darkslategray', 'darkslategrey', 'darkturquoise',
    'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 'dimgrey', 'dodgerblue',
    'firebrick', 'floralwhite', 'forestgreen', 'fuchsia', 'gainsboro',
    'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'greenyellow', 'grey',
    'honeydew', 'hotpink', 'indianred', 'indigo', 'ivory', 'khaki', 'lavender',
    'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral',
    'lightcyan', 'lightgoldenrodyellow', 'lightgray', 'lightgreen', 'lightgrey',
    'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslategray',
    'lightslategrey', 'lightsteelblue', 'lightyellow', 'lime', 'limegreen',
    'linen', 'magenta', 'maroon', 'mediumaquamarine', 'mediumblue', 'mediumorchid',
    'mediumpurple', 'mediumseagreen', 'mediumslateblue', 'mediumspringgreen',
    'mediumturquoise', 'mediumvioletred', 'midnightblue', 'mintcream',
    'mistyrose', 'moccasin', 'navajowhite', 'navy', 'oldlace', 'olive',
    'olivedrab', 'orange', 'orangered', 'orchid', 'palegoldenrod', 'palegreen',
    'paleturquoise', 'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink',
    'plum', 'powderblue', 'purple', 'red', 'rosybrown', 'royalblue',
    'saddlebrown', 'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna',
    'silver', 'skyblue', 'slateblue', 'slategray', 'slategrey', 'snow',
    'springgreen', 'steelblue', 'tan', 'teal', 'thistle', 'tomato', 'turquoise',
    'violet', 'wheat', 'white', 'whitesmoke', 'yellow', 'yellowgreen'
  ];
  
  const colors = colorNames || defaultColors;
  return new RegExp(`^(?:${colors.join('|')})$`, 'i');
}

/**
 * Create a universal color pattern that matches any valid CSS color
 * @param {Object} options - Configuration options
 * @returns {RegExp} Universal color pattern regex
 */
 function createUniversalColorPattern(options = {}) {
  const hexPattern = createHexPattern(options).source.slice(1, -1); // Remove ^ and $
  const namedPattern = createNamedColorPattern().source.slice(1, -1);
  const rgbPattern = createRgbPattern({ allowAlpha: true }).source.slice(1, -1);
  const hslPattern = createHslPattern({ allowAlpha: true }).source.slice(1, -1);
  const hwbPattern = createHwbPattern({ allowAlpha: true }).source.slice(1, -1);
  
  const allPatterns = [hexPattern, namedPattern, rgbPattern, hslPattern, hwbPattern];
  
  return new RegExp(`^(?:${allPatterns.join('|')})$`, 'i');
}
export {
  generateCmykColorPattern,
  createRgbPattern,
  createRgbaPattern,
  createHslPattern,
  createHslaPattern,
  createHwbPattern,
  createHexPattern,
  createNamedColorPattern,
  createUniversalColorPattern
};