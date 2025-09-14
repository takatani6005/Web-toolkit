
// options.js
export function normalizeOptions(options = {}) {
  // Handle null/undefined options
  if (!options || typeof options !== 'object') {
    options = {};
  }

  const {
    length = 10,
    includeEmoji = true,
    includeSymbols = true,
    includeLetters = true,
    includeNumbers = true,
    scripts = ['latin', 'greek', 'cyrillic']
  } = options;

  // Ensure scripts is an array
  const validScripts = Array.isArray(scripts) ? scripts : ['latin'];

  return {
    length,
    includeEmoji,
    includeSymbols,
    includeLetters,
    includeNumbers,
    scripts: validScripts
  };
}