// /**
//  * Unified Color Pattern Generator
//  * Generates random color values and patterns in various formats
//  */

// // ===== HEX COLOR GENERATORS =====

// /**
//  * Generate a random hex color value
//  * @param {boolean} short - Whether to generate short (3-digit) hex
//  * @returns {string} Hex color string like "#ff6b35" or "#f63"
//  */
// function generateHexColorPattern(short = false) {
//   const getRandomHex = () => Math.floor(Math.random() * 16).toString(16);
//   const length = short ? 3 : 6;
//   return '#' + Array.from({ length }, getRandomHex).join('');
// }

// /**
//  * Generate a 3-character hex color (#RGB)
//  * @returns {string} 3-char hex color like "#f63"
//  */
// function generateHex3ColorPattern() {
//   const getRandomHex = () => Math.floor(Math.random() * 16).toString(16);
//   return '#' + Array.from({ length: 3 }, getRandomHex).join('');
// }

// /**
//  * Generate a 4-character hex color with alpha (#RGBA)
//  * @returns {string} 4-char hex color like "#f63a"
//  */
// function generateHex4ColorPattern() {
//   const getRandomHex = () => Math.floor(Math.random() * 16).toString(16);
//   return '#' + Array.from({ length: 4 }, getRandomHex).join('');
// }

// /**
//  * Generate a 6-character hex color (#RRGGBB)
//  * @returns {string} 6-char hex color like "#ff6633"
//  */
// function generateHex6ColorPattern() {
//   const getRandomHex = () => Math.floor(Math.random() * 16).toString(16);
//   return '#' + Array.from({ length: 6 }, getRandomHex).join('');
// }

// /**
//  * Generate an 8-character hex color with alpha (#RRGGBBAA)
//  * @returns {string} 8-char hex color like "#ff6633aa"
//  */
// function generateHex8ColorPattern() {
//   const getRandomHex = () => Math.floor(Math.random() * 16).toString(16);
//   return '#' + Array.from({ length: 8 }, getRandomHex).join('');
// }

// /**
//  * Generate any hex variant randomly
//  * @returns {string} Random hex color in any format
//  */
// function generateRandomHexPattern() {
//   const generators = [
//     generateHex3ColorPattern,
//     generateHex4ColorPattern,
//     generateHex6ColorPattern,
//     generateHex8ColorPattern
//   ];
//   const selectedGenerator = generators[Math.floor(Math.random() * generators.length)];
//   return selectedGenerator();
// }

// // ===== RGB/RGBA COLOR GENERATORS =====

// /**
//  * Generate a random RGB color string
//  * @returns {string} RGB color string like "rgb(255, 128, 64)"
//  */
// function generateRgbColorPattern() {
//   const r = Math.floor(Math.random() * 256);
//   const g = Math.floor(Math.random() * 256);
//   const b = Math.floor(Math.random() * 256);
//   return `rgb(${r}, ${g}, ${b})`;
// }

// /**
//  * Generate a random RGBA color string
//  * @returns {string} RGBA color string like "rgba(255, 128, 64, 0.5)"
//  */
// function generateRgbaColorPattern() {
//   const r = Math.floor(Math.random() * 256);
//   const g = Math.floor(Math.random() * 256);
//   const b = Math.floor(Math.random() * 256);
//   const a = Math.round(Math.random() * 100) / 100;
//   return `rgba(${r}, ${g}, ${b}, ${a})`;
// }

// // ===== HSL/HSLA COLOR GENERATORS =====

// /**
//  * Generate a random HSL color string
//  * @returns {string} HSL color string like "hsl(240, 75%, 50%)"
//  */
// function generateHslColorPattern() {
//   const h = Math.floor(Math.random() * 360);
//   const s = Math.floor(Math.random() * 101);
//   const l = Math.floor(Math.random() * 101);
//   return `hsl(${h}, ${s}%, ${l}%)`;
// }

// /**
//  * Generate a random HSLA color string
//  * @returns {string} HSLA color string like "hsla(240, 75%, 50%, 0.8)"
//  */
// function generateHslaColorPattern() {
//   const h = Math.floor(Math.random() * 360);
//   const s = Math.floor(Math.random() * 101);
//   const l = Math.floor(Math.random() * 101);
//   const a = Math.round(Math.random() * 100) / 100;
//   return `hsla(${h}, ${s}%, ${l}%, ${a})`;
// }

// // ===== HWB COLOR GENERATORS =====

// /**
//  * Generate a random HWB color string
//  * @returns {string} HWB color string like "hwb(240 25% 30%)"
//  */
// function generateHwbColorPattern() {
//   const h = Math.floor(Math.random() * 360);
//   const w = Math.floor(Math.random() * 101);
//   const b = Math.floor(Math.random() * 101);
//   return `hwb(${h} ${w}% ${b}%)`;
// }

// // ===== CMYK COLOR GENERATORS =====

// /**
//  * Generate a random CMYK color string
//  * @returns {string} CMYK color string like "cmyk(50%, 25%, 75%, 10%)"
//  */
// function generateCmykColorString() {
//   const c = Math.floor(Math.random() * 101);
//   const m = Math.floor(Math.random() * 101);
//   const y = Math.floor(Math.random() * 101);
//   const k = Math.floor(Math.random() * 101);
//   return `cmyk(${c}%, ${m}%, ${y}%, ${k}%)`;
// }

// // ===== OK COLOR SPACES =====

// /**
//  * Generate a random OKLab color value string
//  * @param {Object} options - Configuration options
//  * @param {number} [options.precision=3] - Decimal precision
//  * @param {boolean} [options.includeAlpha=false] - Include alpha channel
//  * @returns {string} OKLab color value like "oklab(0.628 0.225 0.126)"
//  */
// function generateOklabColorPattern(options = {}) {
//   const { precision = 3, includeAlpha = false } = options;
  
//   // OKLab ranges: L: 0-1, a: ~-0.4 to 0.4, b: ~-0.4 to 0.4
//   const l = Math.random(); // 0 to 1
//   const a = (Math.random() - 0.5) * 0.8; // -0.4 to 0.4
//   const b = (Math.random() - 0.5) * 0.8; // -0.4 to 0.4
  
//   const lValue = Number(l.toFixed(precision));
//   const aValue = Number(a.toFixed(precision));
//   const bValue = Number(b.toFixed(precision));
  
//   let alphaValue = '';
//   if (includeAlpha) {
//     const alpha = Math.random();
//     alphaValue = ` / ${Number(alpha.toFixed(precision))}`;
//   }
  
//   return `oklab(${lValue} ${aValue} ${bValue}${alphaValue})`;
// }

// /**
//  * Generate a random OKLCH color value string
//  * @param {Object} options - Configuration options
//  * @param {number} [options.precision=3] - Decimal precision
//  * @param {boolean} [options.includeAlpha=false] - Include alpha channel
//  * @returns {string} OKLCH color value like "oklch(0.628 0.258 29.234)"
//  */
// function generateOklchColorPattern(options = {}) {
//   const { precision = 3, includeAlpha = false } = options;
  
//   // OKLCH ranges: L: 0-1, C: 0-0.4, H: 0-360
//   const l = Math.random(); // 0 to 1
//   const c = Math.random() * 0.4; // 0 to 0.4
//   const h = Math.random() * 360; // 0 to 360
  
//   const lValue = Number(l.toFixed(precision));
//   const cValue = Number(c.toFixed(precision));
//   const hValue = Number(h.toFixed(precision));
  
//   let alphaValue = '';
//   if (includeAlpha) {
//     const alpha = Math.random();
//     alphaValue = ` / ${Number(alpha.toFixed(precision))}`;
//   }
  
//   return `oklch(${lValue} ${cValue} ${hValue}${alphaValue})`;
// }

// /**
//  * Generate a random LCH color value string
//  * @param {Object} options - Configuration options
//  * @param {number} [options.precision=1] - Decimal precision
//  * @param {boolean} [options.includeAlpha=false] - Include alpha channel
//  * @param {string} [options.colorSpace='lch'] - Color space variant
//  * @returns {string} LCH color value
//  */
// function generateLchColorPattern(options = {}) {
//   const { precision = 1, includeAlpha = false, colorSpace = 'lch' } = options;
  
//   const l = Math.random() * 100;
//   const c = Math.random() * 150;
//   const h = Math.random() * 360;
  
//   const lValue = Number(l.toFixed(precision));
//   const cValue = Number(c.toFixed(precision));
//   const hValue = Number(h.toFixed(precision));
  
//   let alphaValue = '';
//   if (includeAlpha) {
//     const a = Math.random();
//     alphaValue = ` ${Number(a.toFixed(precision))}`;
//   }
  
//   return `${colorSpace}(${lValue} ${cValue} ${hValue}${alphaValue})`;
// }

// // ===== LAB COLOR GENERATORS =====

// /**
//  * Generate a random LAB color value string
//  * @param {Object} options - Configuration options
//  * @param {number} [options.precision=1] - Decimal precision
//  * @param {boolean} [options.includeAlpha=false] - Include alpha channel
//  * @param {string} [options.colorSpace='lab'] - Color space variant
//  * @returns {string} LAB color value
//  */
// function generateLabColorPattern(options = {}) {
//   const { precision = 1, includeAlpha = false, colorSpace = 'lab' } = options;
  
//   const l = Math.random() * 100;
//   const a = (Math.random() * 255) - 127.5; // -127.5 to 127.5
//   const b = (Math.random() * 255) - 127.5; // -127.5 to 127.5
  
//   const lValue = Number(l.toFixed(precision));
//   const aValue = Number(a.toFixed(precision));
//   const bValue = Number(b.toFixed(precision));
  
//   let alphaValue = '';
//   if (includeAlpha) {
//     const alpha = Math.random();
//     alphaValue = ` ${Number(alpha.toFixed(precision))}`;
//   }
  
//   return `${colorSpace}(${lValue} ${aValue} ${bValue}${alphaValue})`;
// }

// // ===== NAMED COLOR GENERATORS =====

// /**
//  * Generate a random CSS named color
//  * @returns {string} Named color like "red" or "cornflowerblue"
//  */
// function generateNamedColorPattern() {
//   const basicColors = [
//     'aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure', 'beige', 'bisque',
//     'black', 'blanchedalmond', 'blue', 'blueviolet', 'brown', 'burlywood',
//     'cadetblue', 'chartreuse', 'chocolate', 'coral', 'cornflowerblue', 'cornsilk',
//     'crimson', 'cyan', 'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray',
//     'darkgreen', 'darkgrey', 'darkkhaki', 'darkmagenta', 'darkolivegreen',
//     'darkorange', 'darkorchid', 'darkred', 'darksalmon', 'darkseagreen',
//     'darkslateblue', 'darkslategray', 'darkslategrey', 'darkturquoise',
//     'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 'dimgrey', 'dodgerblue',
//     'firebrick', 'floralwhite', 'forestgreen', 'fuchsia', 'gainsboro',
//     'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'greenyellow', 'grey',
//     'honeydew', 'hotpink', 'indianred', 'indigo', 'ivory', 'khaki', 'lavender',
//     'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral',
//     'lightcyan', 'lightgoldenrodyellow', 'lightgray', 'lightgreen', 'lightgrey',
//     'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslategray',
//     'lightslategrey', 'lightsteelblue', 'lightyellow', 'lime', 'limegreen',
//     'linen', 'magenta', 'maroon', 'mediumaquamarine', 'mediumblue', 'mediumorchid',
//     'mediumpurple', 'mediumseagreen', 'mediumslateblue', 'mediumspringgreen',
//     'mediumturquoise', 'mediumvioletred', 'midnightblue', 'mintcream',
//     'mistyrose', 'moccasin', 'navajowhite', 'navy', 'oldlace', 'olive',
//     'olivedrab', 'orange', 'orangered', 'orchid', 'palegoldenrod', 'palegreen',
//     'paleturquoise', 'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink',
//     'plum', 'powderblue', 'purple', 'red', 'rosybrown', 'royalblue',
//     'saddlebrown', 'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna',
//     'silver', 'skyblue', 'slateblue', 'slategray', 'slategrey', 'snow',
//     'springgreen', 'steelblue', 'tan', 'teal', 'thistle', 'tomato', 'turquoise',
//     'violet', 'wheat', 'white', 'whitesmoke', 'yellow', 'yellowgreen'
//   ];
  
//   return basicColors[Math.floor(Math.random() * basicColors.length)];
// }

// // ===== UNIVERSAL COLOR GENERATORS =====

// /**
//  * Generate a random CSS color function value
//  * @returns {string} Color function like "rgb(255, 128, 0)" or "hsl(240, 50%, 75%)"
//  */
// function generateColorFunctionPattern() {
//   const generators = [
//     generateRgbColorPattern,
//     generateRgbaColorPattern,
//     generateHslColorPattern,
//     generateHslaColorPattern
//   ];
  
//   const selectedGenerator = generators[Math.floor(Math.random() * generators.length)];
//   return selectedGenerator();
// }

// /**
//  * Generate any valid CSS color value (universal format)
//  * @returns {string} Random color in any supported format
//  */
// function generateUniversalColorPattern() {
//   const basicGenerators = [
//     () => generateHexColorPattern(false), // long hex
//     () => generateHexColorPattern(true),  // short hex
//     generateNamedColorPattern,
//     generateRgbColorPattern,
//     generateRgbaColorPattern,
//     generateHslColorPattern,
//     generateHslaColorPattern,
//     generateHwbColorPattern,
//     () => generateLchColorPattern(),
//     () => generateLabColorPattern()
//   ];
  
//   const advancedGenerators = [
//     generateRandomHexPattern,
//     () => generateOklabColorPattern(),
//     () => generateOklchColorPattern(),
//     () => generateWideGamutColorPattern(),
//     () => generateSystemColorPattern()
//   ];
  
//   // 70% chance for basic formats, 30% for advanced formats
//   const allGenerators = Math.random() < 0.7 ? basicGenerators : [...basicGenerators, ...advancedGenerators];
//   const selectedGenerator = allGenerators[Math.floor(Math.random() * allGenerators.length)];
  
//   return selectedGenerator();
// }

// /**
//  * Generate modern CSS color value (focuses on newer color spaces)
//  * @returns {string} Modern color format
//  */
// function generateModernColorPattern() {
//   const modernGenerators = [
//     () => generateOklabColorPattern(),
//     () => generateOklchColorPattern(),
//     () => generateWideGamutColorPattern(),
//     () => generateSystemColorPattern(),
//     () => generateLchColorPattern(),
//     () => generateLabColorPattern(),
//     generateRandomHexPattern
//   ];
  
//   const selectedGenerator = modernGenerators[Math.floor(Math.random() * modernGenerators.length)];
//   return selectedGenerator();
// }

// // ===== REGEX PATTERN GENERATORS =====

// /**
//  * Generate CMYK regex pattern for pattern matching
//  * @param {Object} options - Configuration options
//  * @param {boolean} [options.anchors=true] - Include anchors
//  * @param {boolean} [options.capture=false] - Use capturing groups
//  * @returns {RegExp} CMYK pattern regex
//  */
// function generateCmykColorPattern(options = {}) {
//   const { anchors = true, capture = false } = options;

//   const num = '(?:100(?:\\.0+)?|\\d{1,2}(?:\\.\\d+)?)';
//   const numWithPercent = num + '%?';
//   const sep = '(?:\\s*,\\s*|\\s+)';
//   const group = capture ? '(' + numWithPercent + ')' : '(?:' + numWithPercent + ')';

//   const pattern = (anchors ? '^\\s*' : '') +
//     '[cC][mM][yY][kK]\\(\\s*' +
//     group + sep + group + sep + group + sep + group +
//     '\\s*\\)' +
//     (anchors ? '\\s*$' : '');

//   return new RegExp(pattern, 'i');
// }

// /**
//  * Create RGB regex pattern with flexible options
//  * @param {Object} options - Configuration options
//  * @returns {RegExp} RGB pattern regex
//  */
// function createRgbPattern(options = {}) {
//   const { 
//     allowAlpha = false, 
//     allowPercentage = false, 
//     allowSpaces = true,
//     strictSyntax = false 
//   } = options;
  
//   const numValue = allowPercentage 
//     ? '(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|(?:[0-9]{1,3}%|100%))'
//     : '(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';
  
//   const alphaValue = '(?:0(?:\\.[0-9]+)?|1(?:\\.0+)?|\\.[0-9]+|[0-9]{1,3}%)';
//   const space = allowSpaces ? '\\s*' : '';
//   const separator = strictSyntax ? ',' : '[,\\s]';
  
//   const basePattern = `rgb\\(${space}${numValue}${space}${separator}${space}${numValue}${space}${separator}${space}${numValue}${space}\\)`;
//   const alphaPattern = allowAlpha ? `|rgba\\(${space}${numValue}${space}${separator}${space}${numValue}${space}${separator}${space}${numValue}${space}${separator}${space}${alphaValue}${space}\\)` : '';
  
//   return new RegExp(`^(?:${basePattern}${alphaPattern})$`, 'i');
// }

// /**
//  * Generate RGBA regex pattern
//  * @param {Object} options - Configuration options
//  * @returns {RegExp} RGBA pattern regex
//  */
// function createRgbaPattern(options = {}) {
//   return createRgbPattern({ ...options, allowAlpha: true });
// }

// /**
//  * Create HSL regex pattern with flexible options
//  * @param {Object} options - Configuration options
//  * @returns {RegExp} HSL pattern regex
//  */
// function createHslPattern(options = {}) {
//   const { 
//     allowAlpha = false, 
//     allowSpaces = true,
//     allowTurns = false,
//     strictSyntax = false 
//   } = options;
  
//   const hueValue = allowTurns 
//     ? '(?:(?:360|3[0-5][0-9]|[12]?[0-9]{1,2})(?:deg)?|(?:1(?:\\.0+)?|0(?:\\.[0-9]+)?)turn|(?:[0-9]*\\.?[0-9]+)rad)'
//     : '(?:360|3[0-5][0-9]|[12]?[0-9]{1,2})(?:deg)?';
  
//   const percentValue = '(?:100|[0-9]{1,2})%';
//   const alphaValue = '(?:0(?:\\.[0-9]+)?|1(?:\\.0+)?|\\.[0-9]+|[0-9]{1,3}%)';
//   const space = allowSpaces ? '\\s*' : '';
//   const separator = strictSyntax ? ',' : '[,\\s]';
  
//   const basePattern = `hsl\\(${space}${hueValue}${space}${separator}${space}${percentValue}${space}${separator}${space}${percentValue}${space}\\)`;
//   const alphaPattern = allowAlpha ? `|hsla\\(${space}${hueValue}${space}${separator}${space}${percentValue}${space}${separator}${space}${percentValue}${space}${separator}${space}${alphaValue}${space}\\)` : '';
  
//   return new RegExp(`^(?:${basePattern}${alphaPattern})$`, 'i');
// }

// /**
//  * Generate HSLA regex pattern
//  * @param {Object} options - Configuration options
//  * @returns {RegExp} HSLA pattern regex
//  */
// function createHslaPattern(options = {}) {
//   return createHslPattern({ ...options, allowAlpha: true });
// }

// /**
//  * Generate HWB regex pattern
//  * @param {Object} options - Configuration options
//  * @returns {RegExp} HWB pattern regex
//  */
// function createHwbPattern(options = {}) {
//   const { 
//     allowAlpha = false, 
//     allowSpaces = true,
//     allowTurns = false,
//     strictSyntax = false 
//   } = options;
  
//   const hueValue = allowTurns 
//     ? '(?:(?:360|3[0-5][0-9]|[12]?[0-9]{1,2})(?:deg)?|(?:1(?:\\.0+)?|0(?:\\.[0-9]+)?)turn|(?:[0-9]*\\.?[0-9]+)rad)'
//     : '(?:360|3[0-5][0-9]|[12]?[0-9]{1,2})(?:deg)?';
  
//   const percentValue = '(?:100|[0-9]{1,2})%';
//   const alphaValue = '(?:0(?:\\.[0-9]+)?|1(?:\\.0+)?|\\.[0-9]+|[0-9]{1,3}%)';
//   const space = allowSpaces ? '\\s*' : '';
//   const separator = strictSyntax ? ',' : '[,\\s]';
  
//   const alphaPattern = allowAlpha ? `${separator}${space}${alphaValue}${space}` : '';
  
//   return new RegExp(`^hwb\\(${space}${hueValue}${space}${separator}${space}${percentValue}${space}${separator}${space}${percentValue}${alphaPattern}\\)$`, 'i');
// }

// // ===== PALETTE GENERATORS =====

// /**
//  * Generate a harmonious color palette
//  * @param {Object} options - Palette generation options
//  * @param {number} [options.count=5] - Number of colors to generate
//  * @param {string} [options.harmony='analogous'] - Harmony type
//  * @param {string} [options.format='hex'] - Output format
//  * @returns {string[]} Array of color values
//  */
// function generateColorPalette(options = {}) {
//   const { count = 5, harmony = 'analogous', format = 'hex' } = options;
//   const colors = [];
  
//   const baseHue = Math.random() * 360;
  
//   switch (harmony) {
//     case 'complementary':
//       colors.push(
//         generateColorByFormat(format, { hue: baseHue }),
//         generateColorByFormat(format, { hue: (baseHue + 180) % 360 })
//       );
//       break;
      
//     case 'triadic':
//       for (let i = 0; i < 3; i++) {
//         colors.push(generateColorByFormat(format, { hue: (baseHue + i * 120) % 360 }));
//       }
//       break;
      
//     case 'analogous':
//       for (let i = 0; i < count; i++) {
//         colors.push(generateColorByFormat(format, { hue: (baseHue + i * 30) % 360 }));
//       }
//       break;
      
//     case 'monochromatic':
//       for (let i = 0; i < count; i++) {
//         colors.push(generateColorByFormat(format, { 
//           hue: baseHue, 
//           lightness: 20 + (i / (count - 1)) * 60 
//         }));
//       }
//       break;
      
//     default:
//       for (let i = 0; i < count; i++) {
//         colors.push(generateColorByFormat(format));
//       }
//   }
  
//   return colors.slice(0, count);
// }

// /**
//  * Helper function to generate color in specific format
//  * @private
//  */
// function generateColorByFormat(format, constraints = {}) {
//   const { hue, lightness } = constraints;
  
//   switch (format) {
//     case 'hsl':
//       return `hsl(${hue || Math.floor(Math.random() * 360)}, ${Math.floor(Math.random() * 101)}%, ${lightness || Math.floor(Math.random() * 101)}%)`;
//     case 'rgb':
//       // Convert HSL to RGB if hue is specified
//       if (hue !== undefined) {
//         const rgb = hslToRgb(hue, 50, lightness || 50);
//         return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
//       }
//       return generateRgbColorPattern();
//     case 'hex':
//     default:
//       if (hue !== undefined) {
//         const rgb = hslToRgb(hue, 50, lightness || 50);
//         return `#${((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1)}`;
//       }
//       return generateHexColorPattern();
//   }
// }



// /**
//  * Generate Display P3 color pattern using the color(display-p3 ...) syntax
//  * Display P3 has a wider gamut than sRGB, commonly used in modern displays
//  */
// function generateDisplayP3ColorPattern(steps = 16) {
//   const colors = [];
//   for (let i = 0; i < steps; i++) {
//     const hue = (i / steps) * 360;
//     const saturation = 0.8;
//     const lightness = 0.6;
    
//     // Convert HSL to Display P3 RGB (approximate conversion)
//     const p3Color = hslToDisplayP3(hue, saturation, lightness);
//     colors.push(`color(display-p3 ${p3Color.r.toFixed(3)} ${p3Color.g.toFixed(3)} ${p3Color.b.toFixed(3)})`);
//   }
//   return colors;
// }

// /**
//  * Generate Rec2020 color pattern for HDR and wide gamut displays
//  * Rec2020 is used for 4K/8K TV and HDR content
//  */
// function generateRec2020ColorPattern(steps = 16) {
//   const colors = [];
//   for (let i = 0; i < steps; i++) {
//     const hue = (i / steps) * 360;
//     const saturation = 0.9;
//     const lightness = 0.5;
    
//     const rec2020Color = hslToRec2020(hue, saturation, lightness);
//     colors.push(`color(rec2020 ${rec2020Color.r.toFixed(3)} ${rec2020Color.g.toFixed(3)} ${rec2020Color.b.toFixed(3)})`);
//   }
//   return colors;
// }

// /**
//  * Generate ProPhoto RGB color pattern for professional photography
//  * ProPhoto RGB has an extremely wide gamut covering most visible colors
//  */
// function generateProPhotoRgbColorPattern(steps = 16) {
//   const colors = [];
//   for (let i = 0; i < steps; i++) {
//     const hue = (i / steps) * 360;
//     const saturation = 0.7;
//     const lightness = 0.5;
    
//     const proPhotoColor = hslToProPhotoRgb(hue, saturation, lightness);
//     colors.push(`color(prophoto-rgb ${proPhotoColor.r.toFixed(3)} ${proPhotoColor.g.toFixed(3)} ${proPhotoColor.b.toFixed(3)})`);
//   }
//   return colors;
// }

// /**
//  * Generate Adobe RGB (1998) color pattern for print and professional imaging
//  * A98 RGB has a wider gamut than sRGB, especially in cyan-green colors
//  */
// function generateA98RgbColorPattern(steps = 16) {
//   const colors = [];
//   for (let i = 0; i < steps; i++) {
//     const hue = (i / steps) * 360;
//     const saturation = 0.8;
//     const lightness = 0.5;
    
//     const a98Color = hslToA98Rgb(hue, saturation, lightness);
//     colors.push(`color(a98-rgb ${a98Color.r.toFixed(3)} ${a98Color.g.toFixed(3)} ${a98Color.b.toFixed(3)})`);
//   }
//   return colors;
// }

// /**
//  * Generate XYZ D50 color pattern (CIE XYZ with D50 illuminant)
//  * D50 is commonly used in print and graphic arts
//  */
// function generateXyzD50ColorPattern(steps = 16) {
//   const colors = [];
//   for (let i = 0; i < steps; i++) {
//     const hue = (i / steps) * 360;
//     const chroma = 30;
//     const lightness = 60;
    
//     const xyzColor = lchToXyzD50(lightness, chroma, hue);
//     colors.push(`color(xyz-d50 ${xyzColor.x.toFixed(3)} ${xyzColor.y.toFixed(3)} ${xyzColor.z.toFixed(3)})`);
//   }
//   return colors;
// }

// /**
//  * Generate XYZ D65 color pattern (CIE XYZ with D65 illuminant)
//  * D65 represents average daylight and is the standard for sRGB/Rec709
//  */
// function generateXyzD65ColorPattern(steps = 16) {
//   const colors = [];
//   for (let i = 0; i < steps; i++) {
//     const hue = (i / steps) * 360;
//     const chroma = 25;
//     const lightness = 65;
    
//     const xyzColor = lchToXyzD65(lightness, chroma, hue);
//     colors.push(`color(xyz-d65 ${xyzColor.x.toFixed(3)} ${xyzColor.y.toFixed(3)} ${xyzColor.z.toFixed(3)})`);
//   }
//   return colors;
// }

// /**
//  * Generate a wide gamut color pattern that automatically uses the widest available color space
//  * Falls back gracefully from Rec2020 -> Display P3 -> sRGB
//  */
// function generateWideGamutColorPattern(steps = 16, preferredSpace = 'rec2020') {
//   const spaces = {
//     'rec2020': generateRec2020ColorPattern,
//     'display-p3': generateDisplayP3ColorPattern,
//     'prophoto-rgb': generateProPhotoRgbColorPattern,
//     'a98-rgb': generateA98RgbColorPattern
//   };
  
//   const generator = spaces[preferredSpace] || generateDisplayP3ColorPattern;
//   const wideGamutColors = generator(steps);
  
//   // Add fallback versions for browsers that don't support wide gamut
//   return wideGamutColors.map(color => {
//     const fallback = convertToSrgbFallback(color);
//     return `${color}, ${fallback}`;
//   });
// }

// // System & environment functions

// /**
//  * Generate color mix patterns using CSS color-mix() function
//  * Allows blending colors in different color spaces
//  */
// function generateColorMixPattern(color1 = '#ff0000', color2 = '#0000ff', steps = 10, colorSpace = 'srgb') {
//   const colors = [];
//   const interpolationMethods = ['shorter hue', 'longer hue', 'increasing hue', 'decreasing hue'];
  
//   for (let i = 0; i <= steps; i++) {
//     const percentage = (i / steps) * 100;
//     const method = colorSpace === 'hsl' || colorSpace === 'hwb' ? 
//       interpolationMethods[i % interpolationMethods.length] : '';
    
//     const mixFunction = method ? 
//       `color-mix(in ${colorSpace} ${method}, ${color1} ${percentage}%, ${color2})` :
//       `color-mix(in ${colorSpace}, ${color1} ${percentage}%, ${color2})`;
    
//     colors.push(mixFunction);
//   }
//   return colors;
// }

// /**
//  * Generate color contrast patterns for accessibility testing
//  * Creates colors with specific contrast ratios against a background
//  */
// function generateColorContrastPattern(backgroundColor = '#ffffff', targetRatios = [3, 4.5, 7, 12]) {
//   const colors = [];
//   const bgLuminance = getLuminance(backgroundColor);
  
//   targetRatios.forEach(ratio => {
//     // Generate both lighter and darker variants
//     const darkerColor = generateColorForContrast(bgLuminance, ratio, 'darker');
//     const lighterColor = generateColorForContrast(bgLuminance, ratio, 'lighter');
    
//     colors.push({
//       ratio: ratio,
//       darker: darkerColor,
//       lighter: lighterColor,
//       css: `contrast(${ratio})` // CSS contrast() function syntax
//     });
//   });
  
//   return colors;
// }

// /**
//  * Generate system color patterns using CSS system colors
//  * These adapt to the user's OS theme and preferences
//  */
// function generateSystemColorPattern() {
//   const systemColors = [
//     'Canvas', 'CanvasText', 'LinkText', 'VisitedText', 'ActiveText',
//     'ButtonFace', 'ButtonText', 'ButtonBorder', 'Field', 'FieldText',
//     'Highlight', 'HighlightText', 'SelectedItem', 'SelectedItemText',
//     'Mark', 'MarkText', 'AccentColor', 'AccentColorText'
//   ];
  
//   const patterns = {
//     semantic: systemColors.map(color => ({
//       name: color,
//       value: color.toLowerCase(),
//       description: getSystemColorDescription(color)
//     })),
    
//     // Light/dark mode aware patterns
//     adaptive: [
//       'light-dark(#ffffff, #000000)', // White in light mode, black in dark mode
//       'light-dark(#f8f9fa, #212529)', // Light gray / dark gray
//       'light-dark(#007bff, #0d6efd)', // Blue variants
//       'light-dark(#28a745, #20c997)', // Green variants
//     ],
    
//     // Environment-based colors
//     environmental: [
//       'env(safe-area-inset-top, 0px)',
//       'env(safe-area-inset-bottom, 0px)',
//       'color-scheme: light dark', // Declares support for both schemes
//     ]
//   };
  
//   return patterns;
// }

// // Helper functions for color space conversions

// function hslToDisplayP3(h, s, l) {
//   // Simplified conversion - in practice, you'd use proper color management
//   const [r, g, b] = hslToRgb(h, s, l);
//   // Apply Display P3 matrix transformation (simplified)
//   return {
//     r: Math.min(1, r * 1.1), // Slightly expanded gamut
//     g: Math.min(1, g * 1.05),
//     b: Math.min(1, b * 1.08)
//   };
// }

// function hslToRec2020(h, s, l) {
//   const [r, g, b] = hslToRgb(h, s, l);
//   // Apply Rec2020 matrix transformation (simplified)
//   return {
//     r: Math.min(1, r * 1.2),
//     g: Math.min(1, g * 1.15),
//     b: Math.min(1, b * 1.25)
//   };
// }

// function hslToProPhotoRgb(h, s, l) {
//   const [r, g, b] = hslToRgb(h, s, l);
//   // ProPhoto RGB has the widest gamut
//   return {
//     r: Math.min(1, r * 1.3),
//     g: Math.min(1, g * 1.25),
//     b: Math.min(1, b * 1.35)
//   };
// }

// function hslToA98Rgb(h, s, l) {
//   const [r, g, b] = hslToRgb(h, s, l);
//   // Adobe RGB (1998) transformation
//   return {
//     r: Math.min(1, r * 1.15),
//     g: Math.min(1, g * 1.2),
//     b: Math.min(1, b * 1.1)
//   };
// }

// function lchToXyzD50(l, c, h) {
//   // Convert LCH to XYZ with D50 illuminant
//   const a = c * Math.cos(h * Math.PI / 180);
//   const b = c * Math.sin(h * Math.PI / 180);
  
//   // Simplified Lab to XYZ conversion for D50
//   return {
//     x: (l + 16) / 116 * 0.96422, // D50 white point
//     y: (l + 16) / 116,
//     z: (l + 16) / 116 * 0.82521
//   };
// }

// function lchToXyzD65(l, c, h) {
//   // Convert LCH to XYZ with D65 illuminant
//   const a = c * Math.cos(h * Math.PI / 180);
//   const b = c * Math.sin(h * Math.PI / 180);
  
//   // Simplified Lab to XYZ conversion for D65
//   return {
//     x: (l + 16) / 116 * 0.95047, // D65 white point
//     y: (l + 16) / 116,
//     z: (l + 16) / 116 * 1.08883
//   };
// }

// function hslToRgb(h, s, l) {
//   h /= 360;
//   s /= 100;
//   l /= 100;
  
//   const c = (1 - Math.abs(2 * l - 1)) * s;
//   const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
//   const m = l - c / 2;
  
//   let r, g, b;
  
//   if (h < 1/6) [r, g, b] = [c, x, 0];
//   else if (h < 2/6) [r, g, b] = [x, c, 0];
//   else if (h < 3/6) [r, g, b] = [0, c, x];
//   else if (h < 4/6) [r, g, b] = [0, x, c];
//   else if (h < 5/6) [r, g, b] = [x, 0, c];
//   else [r, g, b] = [c, 0, x];
  
//   return [r + m, g + m, b + m];
// }

// function convertToSrgbFallback(wideGamutColor) {
//   // Extract color values and convert to sRGB for fallback
//   // This is a simplified conversion
//   return '#808080'; // Placeholder gray fallback
// }

// function getLuminance(color) {
//   // Calculate relative luminance for contrast calculations
//   // Simplified implementation
//   return 0.5; // Placeholder
// }

// function generateColorForContrast(bgLuminance, targetRatio, direction) {
//   // Generate a color that meets the target contrast ratio
//   // Simplified implementation
//   return direction === 'darker' ? '#000000' : '#ffffff';
// }

// function getSystemColorDescription(colorName) {
//   const descriptions = {
//     'Canvas': 'Background color of application content or documents',
//     'CanvasText': 'Text color in application content or documents',
//     'LinkText': 'Color of non-visited links',
//     'VisitedText': 'Color of visited links',
//     'ActiveText': 'Color of active links',
//     'ButtonFace': 'Background color of controls',
//     'ButtonText': 'Text color on controls',
//     'Field': 'Background color of input fields',
//     'FieldText': 'Text color in input fields',
//     'Highlight': 'Background color of selected text',
//     'AccentColor': 'User\'s accent color preference'
//   };
//   return descriptions[colorName] || 'System color';
// };

// // ===== EXPORTS =====

// export {
//   // Basic color generators
//   generateHexColorPattern,
//   generateRgbColorPattern,
//   generateRgbaColorPattern,
//   generateHslColorPattern,
//   generateHslaColorPattern,
//   generateHwbColorPattern,
//   generateCmykColorString,
//   generateLchColorPattern,
//   generateLabColorPattern,
//   generateNamedColorPattern,
//   generateColorFunctionPattern,
//   generateUniversalColorPattern,
  
//   // Advanced hex variants
//   generateHex3ColorPattern,
//   generateHex4ColorPattern,
//   generateHex6ColorPattern,
//   generateHex8ColorPattern,
//   generateRandomHexPattern,
  
//   // OK color spaces
//   generateOklabColorPattern,
//   generateOklchColorPattern,
  
//   // Wide gamut & device color spaces
//   generateDisplayP3ColorPattern,
//   generateRec2020ColorPattern,
//   generateProPhotoRgbColorPattern,
//   generateA98RgbColorPattern,
//   generateXyzD50ColorPattern,
//   generateXyzD65ColorPattern,
//   generateWideGamutColorPattern,
  
//   // System & environment functions
//   generateColorMixPattern,
//   generateColorContrastPattern,
//   generateSystemColorPattern,
  
//   // Modern color patterns
//   generateModernColorPattern,
  
//   // Pattern generators for regex matching
//   generateCmykColorPattern,
//   createRgbPattern,
//   createRgbaPattern,
//   createHslPattern,
//   createHslaPattern,
//   createHwbPattern,
  
//   // Palette generators
//   generateColorPalette
// };