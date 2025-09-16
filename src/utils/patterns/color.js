// Enhanced Color Pattern Generators with comprehensive CSS color format support

/**
 * Generate RGB color pattern with flexible options
 * @param {Object} options - Configuration options
 * @returns {RegExp} RGB pattern regex
 */
 function generateRgbColorPattern(options = {}) {
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
 * Generate RGBA color pattern (alias for RGB with alpha enabled)
 * @param {Object} options - Configuration options
 * @returns {RegExp} RGBA pattern regex
 */
 function generateRgbaColorPattern(options = {}) {
  return generateRgbColorPattern({ ...options, allowAlpha: true });
}

/**
 * Generate HSL color pattern with flexible options
 * @param {Object} options - Configuration options
 * @returns {RegExp} HSL pattern regex
 */
 function generateHslColorPattern(options = {}) {
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
 * Generate HSLA color pattern (alias for HSL with alpha enabled)
 * @param {Object} options - Configuration options
 * @returns {RegExp} HSLA pattern regex
 */
 function generateHslaColorPattern(options = {}) {
  return generateHslColorPattern({ ...options, allowAlpha: true });
}

/**
 * Generate HWB color pattern
 * @param {Object} options - Configuration options
 * @returns {RegExp} HWB pattern regex
 */
 function generateHwbColorPattern(options = {}) {
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
 * Generate LAB color pattern
 * @param {Object} options - Configuration options
 * @returns {RegExp} LAB pattern regex
 */
 function generateLabColorPattern(options = {}) {
  const { 
    allowAlpha = false, 
    allowSpaces = true,
    strictSyntax = false 
  } = options;
  
  const lightnessValue = '(?:100|[0-9]{1,2}(?:\\.[0-9]+)?)%?';
  const abValue = '(?:-?(?:12[0-8]|1[01][0-9]|[0-9]{1,2})(?:\\.[0-9]+)?)';
  const alphaValue = '(?:0(?:\\.[0-9]+)?|1(?:\\.0+)?|\\.[0-9]+|[0-9]{1,3}%)';
  const space = allowSpaces ? '\\s*' : '';
  const separator = strictSyntax ? ',' : '[,\\s]';
  
  const alphaPattern = allowAlpha ? `${separator}${space}${alphaValue}${space}` : '';
  
  return new RegExp(`^lab\\(${space}${lightnessValue}${space}${separator}${space}${abValue}${space}${separator}${space}${abValue}${alphaPattern}\\)$`, 'i');
}

/**
 * Generate LCH color pattern
 * @param {Object} options - Configuration options
 * @returns {RegExp} LCH pattern regex
 */
 function generateLchColorPattern(options = {}) {
  const { 
    allowAlpha = false, 
    allowSpaces = true,
    allowTurns = false,
    strictSyntax = false 
  } = options;
  
  const lightnessValue = '(?:100|[0-9]{1,2}(?:\\.[0-9]+)?)%?';
  const chromaValue = '(?:1[0-5][0-9]|[0-9]{1,2}(?:\\.[0-9]+)?)';
  const hueValue = allowTurns 
    ? '(?:(?:360|3[0-5][0-9]|[12]?[0-9]{1,2})(?:deg)?|(?:1(?:\\.0+)?|0(?:\\.[0-9]+)?)turn|(?:[0-9]*\\.?[0-9]+)rad)'
    : '(?:360|3[0-5][0-9]|[12]?[0-9]{1,2})(?:deg)?';
  
  const alphaValue = '(?:0(?:\\.[0-9]+)?|1(?:\\.0+)?|\\.[0-9]+|[0-9]{1,3}%)';
  const space = allowSpaces ? '\\s*' : '';
  const separator = strictSyntax ? ',' : '[,\\s]';
  
  const alphaPattern = allowAlpha ? `${separator}${space}${alphaValue}${space}` : '';
  
  return new RegExp(`^lch\\(${space}${lightnessValue}${space}${separator}${space}${chromaValue}${space}${separator}${space}${hueValue}${alphaPattern}\\)$`, 'i');
}

/**
 * Generate hex color pattern with comprehensive options
 * @param {Object} options - Configuration options
 * @returns {RegExp} Hex pattern regex
 */
 function generateHexColorPattern(options = {}) {
  const { 
    allowShort = true, 
    requireHash = true, 
    allowAlpha = false,
    caseInsensitive = true 
  } = options;
  
  const hash = requireHash ? '#' : '#?';
  const flags = caseInsensitive ? 'i' : '';
  const hexChar = caseInsensitive ? '[A-Fa-f0-9]' : '[A-F0-9]';
  
  let patterns = [`${hexChar}{6}`];
  
  if (allowShort) {
    patterns.push(`${hexChar}{3}`);
  }
  
  if (allowAlpha) {
    patterns.push(`${hexChar}{8}`);
    if (allowShort) {
      patterns.push(`${hexChar}{4}`);
    }
  }
  
  return new RegExp(`^${hash}(?:${patterns.join('|')})$`, flags);
}

/**
 * Generate named color pattern (CSS named colors)
 * @param {Object} options - Configuration options
 * @returns {RegExp} Named color pattern regex
 */
 function generateNamedColorPattern(options = {}) {
  const { 
    includeSystemColors = false,
    includeDeprecated = false,
    caseInsensitive = true 
  } = options;
  
  const basicColors = [
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
  
  let colors = [...basicColors];
  
  if (includeSystemColors) {
    const systemColors = [
      'activeborder', 'activecaption', 'appworkspace', 'background', 'buttonface',
      'buttonhighlight', 'buttonshadow', 'buttontext', 'captiontext', 'graytext',
      'highlight', 'highlighttext', 'inactiveborder', 'inactivecaption',
      'inactivecaptiontext', 'infobackground', 'infotext', 'menu', 'menutext',
      'scrollbar', 'threeddarkshadow', 'threedface', 'threedhighlight',
      'threedlightshadow', 'threedshadow', 'window', 'windowframe', 'windowtext'
    ];
    colors.push(...systemColors);
  }
  
  if (includeDeprecated) {
    const deprecatedColors = ['activeborder', 'activecaption', 'appworkspace'];
    colors.push(...deprecatedColors);
  }
  
  const flags = caseInsensitive ? 'i' : '';
  return new RegExp(`^(?:${colors.join('|')})$`, flags);
}

/**
 * Generate comprehensive color function pattern (matches any CSS color function)
 * @param {Object} options - Configuration options
 * @returns {RegExp} Color function pattern regex
 */
 function generateColorFunctionPattern(options = {}) {
  const {
    includeRgb = true,
    includeHsl = true,
    includeHwb = true,
    includeLab = true,
    includeLch = true,
    includeOklab = true,
    includeOklch = true,
    includeColorMix = false,
    caseInsensitive = true
  } = options;
  
  const functions = [];
  
  if (includeRgb) functions.push('rgba?');
  if (includeHsl) functions.push('hsla?');
  if (includeHwb) functions.push('hwb');
  if (includeLab) functions.push('lab');
  if (includeLch) functions.push('lch');
  if (includeOklab) functions.push('oklab');
  if (includeOklch) functions.push('oklch');
  if (includeColorMix) functions.push('color-mix');
  
  if (functions.length === 0) {
    throw new Error('At least one color function must be included');
  }
  
  const flags = caseInsensitive ? 'i' : '';
  return new RegExp(`^(?:${functions.join('|')})\\s*\\([^)]+\\)$`, flags);
}

/**
 * Generate universal color pattern (matches any valid CSS color)
 * @param {Object} options - Configuration options
 * @returns {RegExp} Universal color pattern regex
 */
 function generateUniversalColorPattern(options = {}) {
  const {
    includeNamed = true,
    includeHex = true,
    includeFunctions = true,
    includeTransparent = true,
    includeCurrentColor = true,
    caseInsensitive = true
  } = options;
  
  const patterns = [];
  const flags = caseInsensitive ? 'i' : '';
  
  if (includeNamed) {
    patterns.push(generateNamedColorPattern(options).source);
  }
  
  if (includeHex) {
    patterns.push(generateHexColorPattern(options).source);
  }
  
  if (includeFunctions) {
    patterns.push(generateColorFunctionPattern(options).source);
  }
  
  if (includeTransparent) {
    patterns.push('transparent');
  }
  
  if (includeCurrentColor) {
    patterns.push('currentcolor');
  }
  
  return new RegExp(`^(?:${patterns.join('|')})$`, flags);
}

/** * Generate CMYK color pattern
 * @param {Object} options - Configuration options
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

// Export all functions for easy import
export {
  generateRgbColorPattern,
  generateRgbaColorPattern,
  generateHslColorPattern,
  generateHslaColorPattern,
  generateHwbColorPattern,
  generateLabColorPattern,
  generateLchColorPattern,
  generateHexColorPattern,
  generateNamedColorPattern,
  generateColorFunctionPattern,
  generateUniversalColorPattern,
  generateCmykColorPattern
};