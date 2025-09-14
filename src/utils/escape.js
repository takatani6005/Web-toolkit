/**
 * Enhanced escape utilities for various contexts
 * Provides safe escaping for regex, CSS selectors, JSON, URIs, HTML, XML, and more
 */

// Original functions (improved)
function escapeForRegex(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeForCssSelector(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  // More comprehensive CSS selector escaping
  return str.replace(/([!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, '\\$1')
            .replace(/^(\d)/, '\\3$1 '); // Escape leading digits
}

function escapeForJson(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
    .replace(/\b/g, '\\b')
    .replace(/\f/g, '\\f')
    .replace(/\u0000/g, '\\u0000') // Null character
    .replace(/[\u0001-\u001F\u007F-\u009F]/g, (char) => {
      return '\\u' + char.charCodeAt(0).toString(16).padStart(4, '0').toUpperCase();
    });
}

function encodeUriComponentSafe(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  return encodeURIComponent(str)
    .replace(/[!'()*]/g, function(c) {
      return '%' + c.charCodeAt(0).toString(16).toUpperCase();
    });
}

function decodeUriComponentSafe(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  try {
    return decodeURIComponent(str);
  } catch (e) {
    // Return original string if decoding fails
    return str;
  }
}

// New escape functions

/**
 * Escapes HTML entities and dangerous characters
 */
function escapeForHtml(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  const htmlEscapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };
  
  return str.replace(/[&<>"'`=/]/g, (char) => htmlEscapeMap[char]);
}

/**
 * Escapes XML entities and dangerous characters
 */
function escapeForXml(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  const xmlEscapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;'
  };
  
  return str.replace(/[&<>"']/g, (char) => xmlEscapeMap[char]);
}

/**
 * Escapes shell command arguments
 */
function escapeForShell(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  // For POSIX shells - wrap in single quotes and escape existing single quotes
  return "'" + str.replace(/'/g, "'\"'\"'") + "'";
}

/**
 * Escapes SQL identifiers (table names, column names)
 */
function escapeForSqlIdentifier(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  // Double quotes for SQL identifiers, escape existing double quotes
  return '"' + str.replace(/"/g, '""') + '"';
}

/**
 * Escapes LDAP filter special characters
 */
function escapeForLdapFilter(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  const ldapEscapeMap = {
    '\\': '\\5c',
    '*': '\\2a',
    '(': '\\28',
    ')': '\\29',
    '\u0000': '\\00'
  };
  
  return str.replace(/[\\*()\u0000]/g, (char) => ldapEscapeMap[char]);
}

/**
 * Escapes CSV field values
 */
function escapeForCsv(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  // If contains comma, newline, or quote, wrap in quotes and escape quotes
  if (/[",\r\n]/.test(str)) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

/**
 * Escapes LaTeX special characters
 */
function escapeForLatex(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  const latexEscapeMap = {
    '\\': '\\textbackslash{}',
    '{': '\\{',
    '}': '\\}',
    '$': '\\$',
    '&': '\\&',
    '%': '\\%',
    '#': '\\#',
    '^': '\\textasciicircum{}',
    '_': '\\_',
    '~': '\\textasciitilde{}',
    '<': '\\textless{}',
    '>': '\\textgreater{}'
  };
  
  return str.replace(/[\\{}$&%#^_~<>]/g, (char) => latexEscapeMap[char]);
}

/**
 * Escapes Markdown special characters
 */
function escapeForMarkdown(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  return str.replace(/([\\`*_{}[\]()#+\-.!|>~])/g, '\\$1');
}

/**
 * Escapes JavaScript string literals
 */
function escapeForJavaScript(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/`/g, '\\`')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
    .replace(/\b/g, '\\b')
    .replace(/\f/g, '\\f')
    .replace(/\v/g, '\\v')
    .replace(/\0/g, '\\0')
    .replace(/[\u0001-\u001F\u007F-\u009F]/g, (char) => {
      return '\\u' + char.charCodeAt(0).toString(16).padStart(4, '0');
    });
}

/**
 * Generic escape function that handles multiple contexts
 */
function escapeFor(str, context) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  
  const escapers = {
    regex: escapeForRegex,
    css: escapeForCssSelector,
    json: escapeForJson,
    html: escapeForHtml,
    xml: escapeForXml,
    uri: encodeUriComponentSafe,
    shell: escapeForShell,
    sql: escapeForSqlIdentifier,
    ldap: escapeForLdapFilter,
    csv: escapeForCsv,
    latex: escapeForLatex,
    markdown: escapeForMarkdown,
    javascript: escapeForJavaScript,
    js: escapeForJavaScript
  };
  
  const escaper = escapers[context.toLowerCase()];
  if (!escaper) {
    throw new Error(`Unknown escape context: ${context}`);
  }
  
  return escaper(str);
}

/**
 * Batch escape multiple strings for the same context
 */
function batchEscape(strings, context) {
  if (!Array.isArray(strings)) {
    throw new TypeError('Expected an array of strings');
  }
  
  return strings.map(str => escapeFor(str, context));
}

/**
 * Conditionally escape based on whether string needs escaping
 */
function escapeIfNeeded(str, context) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  
  // Define patterns that indicate escaping is needed
  const needsEscaping = {
    regex: /[.*+?^${}()|[\]\\]/,
    css: /[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~]|^\d/,
    json: /[\\"\n\r\t\b\f\u0000-\u001F\u007F-\u009F]/,
    html: /[&<>"'`=/]/,
    xml: /[&<>"']/,
    csv: /[",\r\n]/,
    markdown: /[\\`*_{}[\]()#+\-.!|>~]/,
    javascript: /[\\'"` \n\r\t\b\f\v\0\u0001-\u001F\u007F-\u009F]/
  };
  
  const pattern = needsEscaping[context.toLowerCase()];
  if (pattern && pattern.test(str)) {
    return escapeFor(str, context);
  }
  
  return str;
}

export {
  escapeForRegex,
  escapeForCssSelector,
  escapeForJson,
  encodeUriComponentSafe,
  decodeUriComponentSafe,
  escapeForHtml,
  escapeForXml,
  escapeForShell,
  escapeForSqlIdentifier,
  escapeForLdapFilter,
  escapeForCsv,
  escapeForLatex,
  escapeForMarkdown,
  escapeForJavaScript,
  escapeFor,
  batchEscape,
  escapeIfNeeded
};