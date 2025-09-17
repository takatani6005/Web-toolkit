/**
 * Basic Color Pattern Generators
 * Generates common color formats: HEX, RGB, HSL, HWB, Named colors
 */

// ===== HEX COLOR GENERATORS =====

/**
 * Generate a random hex color value
 * @param {boolean} short - Whether to generate short (3-digit) hex
 * @returns {string} Hex color string like "#ff6b35" or "#f63"
 */
 function generateHexColorPattern(short = false) {
  const getRandomHex = () => Math.floor(Math.random() * 16).toString(16);
  const length = short ? 3 : 6;
  return '#' + Array.from({ length }, getRandomHex).join('');
}

/**
 * Generate a 3-character hex color (#RGB)
 * @returns {string} 3-char hex color like "#f63"
 */
 function generateHex3ColorPattern() {
  const getRandomHex = () => Math.floor(Math.random() * 16).toString(16);
  return '#' + Array.from({ length: 3 }, getRandomHex).join('');
}

/**
 * Generate a 4-character hex color with alpha (#RGBA)
 * @returns {string} 4-char hex color like "#f63a"
 */
 function generateHex4ColorPattern() {
  const getRandomHex = () => Math.floor(Math.random() * 16).toString(16);
  return '#' + Array.from({ length: 4 }, getRandomHex).join('');
}

/**
 * Generate a 6-character hex color (#RRGGBB)
 * @returns {string} 6-char hex color like "#ff6633"
 */
 function generateHex6ColorPattern() {
  const getRandomHex = () => Math.floor(Math.random() * 16).toString(16);
  return '#' + Array.from({ length: 6 }, getRandomHex).join('');
}

/**
 * Generate an 8-character hex color with alpha (#RRGGBBAA)
 * @returns {string} 8-char hex color like "#ff6633aa"
 */
 function generateHex8ColorPattern() {
  const getRandomHex = () => Math.floor(Math.random() * 16).toString(16);
  return '#' + Array.from({ length: 8 }, getRandomHex).join('');
}

/**
 * Generate any hex variant randomly
 * @returns {string} Random hex color in any format
 */
 function generateRandomHexPattern() {
  const generators = [
    generateHex3ColorPattern,
    generateHex4ColorPattern,
    generateHex6ColorPattern,
    generateHex8ColorPattern
  ];
  const selectedGenerator = generators[Math.floor(Math.random() * generators.length)];
  return selectedGenerator();
}

// ===== RGB/RGBA COLOR GENERATORS =====

/**
 * Generate a random RGB color string
 * @returns {string} RGB color string like "rgb(255, 128, 64)"
 */
 function generateRgbColorPattern() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Generate a random RGBA color string
 * @returns {string} RGBA color string like "rgba(255, 128, 64, 0.5)"
 */
 function generateRgbaColorPattern() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  const a = Math.round(Math.random() * 100) / 100;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

// ===== HSL/HSLA COLOR GENERATORS =====

/**
 * Generate a random HSL color string
 * @returns {string} HSL color string like "hsl(240, 75%, 50%)"
 */
 function generateHslColorPattern() {
  const h = Math.floor(Math.random() * 360);
  const s = Math.floor(Math.random() * 101);
  const l = Math.floor(Math.random() * 101);
  return `hsl(${h}, ${s}%, ${l}%)`;
}

/**
 * Generate a random HSLA color string
 * @returns {string} HSLA color string like "hsla(240, 75%, 50%, 0.8)"
 */
 function generateHslaColorPattern() {
  const h = Math.floor(Math.random() * 360);
  const s = Math.floor(Math.random() * 101);
  const l = Math.floor(Math.random() * 101);
  const a = Math.round(Math.random() * 100) / 100;
  return `hsla(${h}, ${s}%, ${l}%, ${a})`;
}

// ===== HWB COLOR GENERATORS =====

/**
 * Generate a random HWB color string
 * @returns {string} HWB color string like "hwb(240 25% 30%)"
 */
 function generateHwbColorPattern() {
  const h = Math.floor(Math.random() * 360);
  const w = Math.floor(Math.random() * 101);
  const b = Math.floor(Math.random() * 101);
  return `hwb(${h} ${w}% ${b}%)`;
}

// ===== NAMED COLOR GENERATORS =====

/**
 * Generate a random CSS named color
 * @returns {string} Named color like "red" or "cornflowerblue"
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
  
  return basicColors[Math.floor(Math.random() * basicColors.length)];
}

// ===== UNIVERSAL COLOR GENERATORS =====

/**
 * Generate a random CSS color function value
 * @returns {string} Color function like "rgb(255, 128, 0)" or "hsl(240, 50%, 75%)"
 */
 function generateColorFunctionPattern() {
  const generators = [
    generateRgbColorPattern,
    generateRgbaColorPattern,
    generateHslColorPattern,
    generateHslaColorPattern
  ];
  
  const selectedGenerator = generators[Math.floor(Math.random() * generators.length)];
  return selectedGenerator();
}

export {
  generateHexColorPattern,
  generateHex3ColorPattern,
  generateHex4ColorPattern,
  generateHex6ColorPattern,
  generateHex8ColorPattern,
  generateRandomHexPattern,
  generateRgbColorPattern,
  generateRgbaColorPattern,
  generateHslColorPattern,
  generateHslaColorPattern,
  generateHwbColorPattern,
  generateNamedColorPattern,
  generateColorFunctionPattern
};