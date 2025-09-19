/**
 * Basic Color Pattern Generators
 * Generates regex patterns to match common color formats: HEX, RGB, HSL, HWB, Named colors
 */

// ===== HEX COLOR PATTERN GENERATORS =====
/**
 * Generate a regex pattern for hex colors
 * @param {Object} options
 * @param {'3'|'4'|'6'|'8'|'all'|'random'} [options.type='all'] - Type of hex color
 * @returns {RegExp} Pattern that matches the selected hex color format
 */
function generateHexColorPattern({ type = 'all' } = {}) {
  const map = {
    '3': '#[0-9a-fA-F]{3}',
    '4': '#[0-9a-fA-F]{4}',
    '6': '#[0-9a-fA-F]{6}',
    '8': '#[0-9a-fA-F]{8}',
    'all': '#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})',
    'random':'/^#[0-9a-fA-F]{3,8}$/'
  };
  return new RegExp(`^${map[type] || map['all']}$`);
}

function generateCssColorPattern({ type = 'rgb' } = {}) {
  const map = {
    rgb:  /^rgb\(\s*(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\s*,\s*(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\s*,\s*(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\s*\)$/,
    rgba: /^rgba\(\s*(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\s*,\s*(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\s*,\s*(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\s*,\s*(0|0?\.\d+|1(\.0+)?)\s*\)$/,
    hsl:  /^hsl\(\s*(360|3[0-5]\d|[12]\d\d|[1-9]?\d)\s*,\s*(100|[1-9]?\d)%\s*,\s*(100|[1-9]?\d)%\s*\)$/,
    hsla: /^hsla\(\s*(360|3[0-5]\d|[12]\d\d|[1-9]?\d)\s*,\s*(100|[1-9]?\d)%\s*,\s*(100|[1-9]?\d)%\s*,\s*(0|0?\.\d+|1(\.0+)?)\s*\)$/,
    hwb:  /^hwb\(\s*(360|3[0-5]\d|[12]\d\d|[1-9]?\d)\s+(100|[1-9]?\d)%\s+(100|[1-9]?\d)%\s*\)$/
  };
  return map[type] || map['rgb'];
}

// ===== NAMED COLOR PATTERN GENERATORS =====

/**
 * Generate a regex pattern for CSS named colors
 * @returns {RegExp} Pattern that matches named colors like "red" or "cornflowerblue"
 */
function generateNamedColorPattern() {
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
  
  // Create a regex pattern that matches any of the named colors (case sensitive, lowercase only)
  return new RegExp(`^(${basicColors.join('|')})$`);
}

// ===== UNIVERSAL COLOR PATTERN GENERATORS =====
/**
 * Generate a highly optimized regex for all main CSS color functions.
 * Covers: rgb, rgba, hsl, hsla, hwb, lab, lch, color()
 * @returns {RegExp}
 */
function generateColorFunctionPattern() {
  // Số: optional sign, integer hoặc decimal, có thể kèm %
  const num = '[+-]?(?:\\d*\\.\\d+|\\d+)%?';
  // Ngăn cách: comma kèm khoảng trắng hoặc chỉ khoảng trắng
  const sep = '(?:\\s*,\\s*|\\s+)';

  // Hàm có 3 tham số (rgb, hsl, hwb, lab, lch)
  const triple = name => `${name}\\(\\s*${num}(?:${sep}${num}){2}\\s*\\)`;
  // Hàm có 4 tham số (rgba, hsla)
  const quadruple = name => `${name}\\(\\s*${num}(?:${sep}${num}){3}\\s*\\)`;

  // color(space numbers…)
  const color = `color\\(\\s*[a-z][\\w-]*\\s+${num}(?:${sep}${num})*\\s*\\)`;

  const combined =
    `^(?:${[
      triple('rgb'),
      quadruple('rgba'),
      triple('hsl'),
      quadruple('hsla'),
      triple('hwb'),
      triple('lab'),
      triple('lch'),
      triple('oklab'),    
      triple('oklch'),    
      color
    ].join('|')})$`;

  return new RegExp(combined, 'i');
}

/**
 * Add-ons for Basic Color Pattern Generators
 * Additional validation-oriented test functions and patterns
 */

// ===== HWB COLOR PATTERN GENERATOR =====
/**
 * Generate a regex pattern for HWB (Hue, Whiteness, Blackness) colors
 * @param {Object} options
 * @param {boolean} [options.allowAlpha=false] - Include alpha channel support
 * @returns {RegExp} Pattern that matches HWB color format
 */
function generateHwbColorPattern({ allowAlpha = false } = {}) {
  const hue = '(?:360|3[0-5]\\d|[12]\\d\\d|[1-9]?\\d)';
  const percentage = '(?:100|[1-9]?\\d)%';
  const alpha = '(?:0|0?\\.\\d+|1(?:\\.0+)?)';
  
  if (allowAlpha) {
    return new RegExp(
      `^hwb\\(\\s*${hue}\\s+${percentage}\\s+${percentage}\\s*(?:\\s*\\/\\s*${alpha})?\\s*\\)$`,
      'i'
    );
  }
  
  return new RegExp(
    `^hwb\\(\\s*${hue}\\s+${percentage}\\s+${percentage}\\s*\\)$`,
    'i'
  );
}

// ===== HEX ALPHA COLOR PATTERN GENERATOR =====
/**
 * Generate a regex pattern for hex colors with alpha channel support
 * @param {Object} options
 * @param {boolean} [options.strictAlpha=true] - Only match colors with alpha
 * @returns {RegExp} Pattern that matches hex colors with alpha (#RRGGBBAA, #RGBA)
 */
function generateHexAlphaColorPattern({ strictAlpha = true } = {}) {
  if (strictAlpha) {
    // Only match hex colors that have alpha channel
    return new RegExp('^#(?:[0-9a-fA-F]{4}|[0-9a-fA-F]{8})$');
  }
  
  // Match hex colors with optional alpha channel
  return new RegExp('^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6,8})$');
}

// ===== CSS GRADIENT PATTERN GENERATOR =====
/**
 * Generate a regex pattern for CSS gradients
 * @param {Object} options
 * @param {'linear'|'radial'|'conic'|'all'} [options.type='all'] - Type of gradient
 * @returns {RegExp} Pattern that matches CSS gradient functions
 */
function generateCssGradientPattern({ type = 'all' } = {}) {
  // Color stop pattern (color with optional position)
  const colorStop = '(?:#[0-9a-fA-F]{3,8}|rgba?\\([^)]+\\)|hsla?\\([^)]+\\)|[a-z]+)(?:\\s+[\\d.]+%?)?';
  const colorStops = `${colorStop}(?:\\s*,\\s*${colorStop})*`;
  
  const patterns = {
    linear: `linear-gradient\\(\\s*(?:(?:to\\s+(?:top|bottom|left|right)(?:\\s+(?:left|right|top|bottom))?|[\\d.]+deg)\\s*,\\s*)?${colorStops}\\s*\\)`,
    radial: `radial-gradient\\(\\s*(?:(?:circle|ellipse)(?:\\s+(?:closest-side|closest-corner|farthest-side|farthest-corner))?(?:\\s+at\\s+[\\d.]+%?\\s+[\\d.]+%?)?\\s*,\\s*)?${colorStops}\\s*\\)`,
    conic: `conic-gradient\\(\\s*(?:from\\s+[\\d.]+deg(?:\\s+at\\s+[\\d.]+%?\\s+[\\d.]+%?)?\\s*,\\s*)?${colorStops}\\s*\\)`,
  };
  
  if (type === 'all') {
    const allPatterns = Object.values(patterns).join('|');
    return new RegExp(`^(?:${allPatterns})$`, 'i');
  }
  
  return new RegExp(`^${patterns[type]}$`, 'i');
}


// ===== EXPORTS =====

 

export {
  generateHexColorPattern,
  generateCssColorPattern,
  generateNamedColorPattern,
  generateColorFunctionPattern,

  generateHwbColorPattern,
  generateHexAlphaColorPattern,
  generateCssGradientPattern,
  

};