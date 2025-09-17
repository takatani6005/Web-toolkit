# Color Pattern Generator Library

A comprehensive JavaScript library for generating random color values and patterns in various formats, including modern CSS color spaces and wide gamut support.

## 🎨 Features

- **Complete CSS Color Support**: All CSS color formats including HEX, RGB, HSL, HWB, LAB, LCH, OKLab, OKLCH
- **Modern Color Spaces**: Wide gamut support (Display P3, Rec2020, ProPhoto RGB)
- **Smart Palettes**: Harmonious color palette generation with various harmony rules
- **Accessibility**: Contrast-aware color generation and WCAG compliance tools  
- **Regex Patterns**: Pattern matching for color validation
- **Utility Functions**: Color conversion, manipulation, and analysis tools
- **TypeScript Ready**: Full type definitions included

## 📁 File Structure

```
patterns/color/
├── basic.js          # Basic color formats (HEX, RGB, HSL, HWB, Named)
├── advanced.js       # Advanced formats (LAB, LCH, OKLab, OKLCH, CMYK)
├── wide-gamut.js     # Wide gamut and device colors
├── system.js         # System colors and CSS functions  
├── regex.js          # Pattern matching and validation
├── palettes.js       # Color palette and scheme generation
├── utils.js          # Utility functions and conversions
├── universal.js      # High-level generators and orchestration
└── index.js          # Main exports and convenience functions
```

## 🚀 Quick Start

### Basic Usage

```javascript
import { randomColor, palette, generateHexColorPattern } from './patterns/color/index.js';

// Generate any random color
const color = randomColor(); // "#ff6b35" or "hsl(240, 75%, 50%)" etc.

// Generate specific format
const hexColor = generateHexColorPattern(); // "#a3d5f1"
const rgbColor = generateRgbColorPattern(); // "rgb(163, 213, 241)"

// Generate color palette
const colors = palette('analogous', 5); 
// ["#ff6b35", "#ff8f35", "#ffb335", "#d4ff35", "#b0ff35"]
```

### Advanced Usage

```javascript
import { 
  generateModernColorPattern,
  generateColorScheme,
  generateAccessiblePalette,
  calculateContrastRatio
} from './patterns/color/index.js';

// Modern CSS color formats
const modernColor = generateModernColorPattern();
// "oklch(0.628 0.258 29.234)" or "color(display-p3 0.123 0.456 0.789)"

// Complete color scheme
const scheme = generateColorScheme({
  harmony: 'complementary',
  count: 4,
  format: 'mixed'
});

// Accessibility-focused colors
const accessibleColors = generateAccessiblePalette('#ffffff', 4.5, 6);
// Returns colors with WCAG AA contrast ratios
```

## 📚 API Reference

### Basic Color Generators

#### HEX Colors
- `generateHexColorPattern(short)` - Generate hex color
- `generateHex3ColorPattern()` - 3-digit hex (#RGB)
- `generateHex6ColorPattern()` - 6-digit hex (#RRGGBB)  
- `generateHex8ColorPattern()` - 8-digit hex with alpha (#RRGGBBAA)
- `generateRandomHexPattern()` - Any hex variant

#### RGB/RGBA Colors
- `generateRgbColorPattern()` - "rgb(255, 128, 64)"
- `generateRgbaColorPattern()` - "rgba(255, 128, 64, 0.5)"

#### HSL/HSLA Colors  
- `generateHslColorPattern()` - "hsl(240, 75%, 50%)"
- `generateHslaColorPattern()` - "hsla(240, 75%, 50%, 0.8)"

#### Other Basic Formats
- `generateHwbColorPattern()` - "hwb(240 25% 30%)"
- `generateNamedColorPattern()` - "cornflowerblue"

### Advanced Color Generators

#### Modern Color Spaces
- `generateOklabColorPattern(options)` - "oklab(0.628 0.225 0.126)"
- `generateOklchColorPattern(options)` - "oklch(0.628 0.258 29.234)"
- `generateLchColorPattern(options)` - "lch(70 50 180)"
- `generateLabColorPattern(options)` - "lab(70 20 -30)"

#### Print Colors
- `generateCmykColorString()` - "cmyk(50%, 25%, 75%, 10%)"

### Wide Gamut Colors

- `generateDisplayP3ColorPattern(steps)` - Display P3 colors
- `generateRec2020ColorPattern(steps)` - Rec2020/HDR colors  
- `generateProPhotoRgbColorPattern(steps)` - ProPhoto RGB
- `generateWideGamutColorPattern(steps, space)` - Auto-fallback wide gamut

### Palette Generation

#### Basic Palettes
```javascript
generateColorPalette({
  count: 5,
  harmony: 'analogous', // 'complementary', 'triadic', 'monochromatic'
  format: 'hex',
  baseHue: 180,
  saturation: 70,
  lightness: 50
});
```

#### Specialized Palettes
- `generateMaterialPalette(baseColor)` - Material Design color scales
- `generateSeasonalPalette(season, count)` - Season-themed colors
- `generateAccessiblePalette(bg, contrast, count)` - WCAG compliant colors

### System & CSS Functions

- `generateSystemColorPattern()` - CSS system colors
- `generateColorMixPattern(color1, color2, steps)` - color-mix() functions
- `generateColorContrastPattern(bg, ratios)` - Contrast-based colors

### Utility Functions

#### Color Conversion
```javascript
hslToRgb(240, 50, 75); // [r, g, b] values 0-1
rgbToHex(128, 64, 255); // "#8040ff"  
hexToRgb("#8040ff"); // [128, 64, 255]
parseColorToRgb("hsl(240, 50%, 75%)"); // [128, 64, 255]
```

#### Color Analysis
```javascript  
calculateLuminance("#8040ff"); // 0.123
calculateContrastRatio("#000", "#fff"); // 21
isColorDark("#8040ff"); // true
```

#### Color Manipulation
```javascript
lightenColor("#8040ff", 20); // "#a366ff"
darkenColor("#8040ff", 20); // "#5c1aff"  
saturateColor("#8040ff", 30); // "#6b00ff"
mixColors("#ff0000", "#0000ff", 0.5); // "#800080"
getComplementaryColor("#8040ff"); // "#40ff80"
```

### Regex Pattern Matching

```javascript
const hexPattern = createHexPattern({ allowShort: true, allowAlpha: true });
hexPattern.test("#ff0080"); // true

const rgbPattern = createRgbPattern({ allowAlpha: true, allowPercentage: true });
rgbPattern.test("rgba(255, 0, 128, 0.5)"); // true
```

### Universal Generators

#### High-Level Generation
```javascript
// Any CSS color format
generateUniversalColorPattern({
  includeAdvanced: true,
  includeWideGamut: false,
  preferredFormats: ['hex', 'hsl']
});

// Modern formats only  
generateModernColorPattern({
  includeAlpha: true,
  precision: 3
});

// Context-specific colors
generateContextualColors('accessibility', { count: 6 });
// 'web', 'print', 'accessibility', 'brand', 'data-viz', 'modern'
```

#### Constrained Generation
```javascript
generateConstrainedColor({
  hueRange: [180, 240], // Blue-cyan range
  saturationRange: [50, 80],
  lightnessRange: [40, 70],
  excludeFormats: ['cmyk', 'named']
});
```

## 🎯 Use Cases

### Web Development
```javascript
// Generate a cohesive brand palette
const brandColors = generateColorScheme({
  harmony: 'monochromatic',
  count: 5,
  format: 'hex'
});

// Ensure accessibility compliance
const accessibleText = generateAccessiblePalette('#ffffff', 4.5, 3);
```

### Design Systems
```javascript
// Material Design color scales
const primaryPalette = generateMaterialPalette('#1976d2');
// { 50: '#e3f2fd', 100: '#bbdefb', 500: '#1976d2', ... }

// Generate semantic color variations
const statusColors = {
  success: generateColorPalette({ baseHue: 120, harmony: 'monochromatic', count: 3 }),
  warning: generateColorPalette({ baseHue: 45, harmony: 'monochromatic', count: 3 }),
  danger: generateColorPalette({ baseHue: 0, harmony: 'monochromatic', count: 3 })
};
```

### Data Visualization
```javascript
// Perceptually distinct colors for charts
const chartColors = generateContextualColors('data-viz', { count: 8 });

// Color scale for heatmaps
const heatmapScale = generateGradientPalette('#000080', '#ff4500', 10);
```

### Print Design
```javascript
// CMYK colors for print
const printColors = Array.from({ length: 5 }, () => generateCmykColorString());
// ["cmyk(20%, 80%, 100%, 5%)", ...]
```

## 🔧 Configuration Options

Many generators accept options objects:

```javascript
{
  precision: 3,           // Decimal places for modern formats
  includeAlpha: false,    // Include alpha channel
  anchors: true,          // Include ^ $ in regex patterns  
  allowPercentage: false, // Allow percentage RGB values
  strictSyntax: false,    // Strict comma separation
  count: 5,              // Number of colors
  harmony: 'analogous',   // Palette harmony type
  format: 'hex'          // Output format
}
```

## 🎨 Color Harmony Types

- **analogous**: Adjacent hues (30° apart)
- **complementary**: Opposite hues (180° apart)  
- **triadic**: Three evenly spaced hues (120° apart)
- **tetradic**: Four evenly spaced hues (90° apart)
- **splitComplementary**: Base + two adjacent to complement
- **monochromatic**: Same hue, different lightness
- **compound**: Base + complement + analogous variants

## 🌈 Supported Color Formats

- **HEX**: `#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa`
- **RGB**: `rgb()`, `rgba()`
- **HSL**: `hsl()`, `hsla()`  
- **HWB**: `hwb()`
- **LAB**: `lab()` 
- **LCH**: `lch()`
- **OKLab**: `oklab()` 
- **OKLCH**: `oklch()`
- **CMYK**: `cmyk()`
- **Named**: CSS named colors
- **Wide Gamut**: `color(display-p3)`, `color(rec2020)`, etc.
- **System**: `Canvas`, `AccentColor`, etc.
- **Functions**: `color-mix()`, `light-dark()`, etc.

## 📱 Browser Support

- **Basic formats**: All modern browsers
- **HWB**: Chrome 101+, Firefox 96+, Safari 15+
- **LAB/LCH**: Chrome 111+, Firefox 113+, Safari 15+  
- **OKLab/OKLCH**: Chrome 111+, Firefox 113+, Safari 15.4+
- **Wide gamut**: Chrome 58+, Firefox 79+, Safari 10+
- **System colors**: Chrome 89+, Firefox 87+, Safari 14.1+

## 🤝 Contributing

The library is modular by design. To add new color formats:

1. Add generators to the appropriate module (`basic.js`, `advanced.js`, etc.)
2. Export functions in the module  
3. Re-export in `index.js`
4. Add tests and documentation
5. Update the format list in `COLOR_LIBRARY_INFO`

## 📄 License

MIT License - feel free to use in commercial and open source projects.

---

*Built with modern JavaScript ES modules for maximum compatibility and tree-shaking support.*