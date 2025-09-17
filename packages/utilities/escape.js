/**
 * Enhanced escape utilities for various contexts
 * Provides safe escaping for regex, CSS selectors, JSON, URIs, HTML, XML, databases, shells, and more
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

// Web & Document escape functions

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

// NEW ESCAPE FUNCTIONS

// 1. Programming Language & Syntax Pattern

/**
 * Escapes C/C++/Java string literals
 */
function escapeForCString(str) {
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
    .replace(/\v/g, '\\v')
    .replace(/\a/g, '\\a')
    .replace(/\0/g, '\\0');
}

/**
 * Escapes PHP string literals
 */
function escapeForPhp(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\$/g, '\\$')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

/**
 * Escapes Python f-string expressions
 */
function escapeForPythonFString(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  return str
    .replace(/\\/g, '\\\\')
    .replace(/{/g, '{{')
    .replace(/}/g, '}}')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"');
}

/**
 * Escapes Handlebars/Mustache template syntax
 */
function escapeForHandlebars(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  return str
    .replace(/\{\{\{/g, '\\{\\{\\{')
    .replace(/\{\{/g, '\\{\\{')
    .replace(/\}\}\}/g, '\\}\\}\\}')
    .replace(/\}\}/g, '\\}\\}');
}

// 2. Web Protocol / Data Transfer

/**
 * Escapes URL path segments (preserves slashes)
 */
function escapeForUrlPath(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  return str
    .split('/')
    .map(segment => encodeURIComponent(segment))
    .join('/');
}

/**
 * Escapes multipart/form-data boundary values
 */
function escapeForMultipart(str, boundary) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  // Ensure boundary doesn't appear in content
  if (str.includes(boundary)) {
    throw new Error('Content contains boundary string');
  }
  // Escape CRLF injection
  return str.replace(/\r\n/g, '\r\n ');
}

/**
 * Escapes cookie name/value
 */
function escapeForCookie(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  // RFC 6265 compliance
  return str.replace(/[;,\s"\\]/g, (char) => {
    return '%' + char.charCodeAt(0).toString(16).toUpperCase();
  });
}

/**
 * Escapes HTTP header values (prevents CRLF injection)
 */
function escapeForHttpHeader(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  return str
    .replace(/\r/g, '')
    .replace(/\n/g, '')
    .replace(/[\x00-\x1F\x7F]/g, ''); // Remove control characters
}

// 3. Database & Query

/**
 * Escapes SQL string literals
 */
function escapeForSqlLiteral(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  return "'" + str.replace(/'/g, "''") + "'";
}

/**
 * Escapes MongoDB keys (avoids . and $)
 */
function escapeForMongoDB(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  return str
    .replace(/\./g, '\\u002e')
    .replace(/\$/g, '\\u0024');
}

/**
 * Escapes Elasticsearch/Lucene query special characters
 */
function escapeForElasticsearch(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  return str.replace(/[+\-&|!(){}[\]^"~*?:\\\/]/g, '\\$&');
}

// 4. Document Formats

/**
 * Escapes YAML special characters
 */
function escapeForYaml(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  // Quote if starts with special chars or contains control chars
  if (/^[-:>|]|[\n\r\t]|^[0-9]/.test(str) || /[{}[\],"'`]/.test(str)) {
    return '"' + str.replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r') + '"';
  }
  return str;
}

/**
 * Escapes INI/TOML values
 */
function escapeForIni(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

/**
 * Escapes RTF special characters
 */
function escapeForRtf(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  return str
    .replace(/\\/g, '\\\\')
    .replace(/{/g, '\\{')
    .replace(/}/g, '\\}')
    .replace(/\n/g, '\\par\n');
}

/**
 * Escapes PDF text strings
 */
function escapeForPdf(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  return str
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n')
    .replace(/\t/g, '\\t');
}

// 5. System / Command

/**
 * Escapes PowerShell command arguments
 */
function escapeForPowerShell(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  return '"' + str.replace(/["$`]/g, '`$&') + '"';
}

/**
 * Escapes Windows CMD command arguments
 */
function escapeForWindowsCmd(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  return '"' + str.replace(/["%^&|<>]/g, '^$&') + '"';
}

/**
 * Escapes Makefile variables
 */
function escapeForMakefile(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  return str.replace(/\$/g, '$$');
}

// 6. Interface & Display

/**
 * Escapes CSS content strings
 */
function escapeForCssContent(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\A ')
    .replace(/\r/g, '\\D ')
    .replace(/\t/g, '\\9 ');
}

/**
 * Escapes SVG attribute values
 */
function escapeForSvg(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Escapes ANSI/Terminal control characters
 */
function escapeForTerminal(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  return str.replace(/\x1B\[[0-9;]*[mGKH]/g, ''); // Remove ANSI escape sequences
}

// 7. Other Contexts

/**
 * Escapes regex replacement strings
 */
function escapeForRegexReplacement(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  return str.replace(/[\$\\]/g, '\\$&');
}

/**
 * Escapes JSONPath expressions
 */
function escapeForJsonPath(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  if (/[^a-zA-Z0-9_]/.test(str)) {
    return "['" + str.replace(/'/g, "\\'") + "']";
  }
  return str;
}

/**
 * Escapes XPath expressions
 */
function escapeForXPath(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  if (str.includes("'")) {
    if (str.includes('"')) {
      // Contains both quotes, use concat
      const parts = str.split("'").map(part => `'${part}'`);
      return `concat(${parts.join(', "\'",')}`;
    }
    return `"${str}"`;
  }
  return `'${str}'`;
}

/**
 * Escapes GraphQL string values
 */
function escapeForGraphQL(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

/**
 * Escapes shell glob patterns
 */
function escapeForGlob(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  return str.replace(/[*?[\]]/g, '\\$&');
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
    'css-content': escapeForCssContent,
    json: escapeForJson,
    html: escapeForHtml,
    xml: escapeForXml,
    svg: escapeForSvg,
    uri: encodeUriComponentSafe,
    'uri-path': escapeForUrlPath,
    shell: escapeForShell,
    powershell: escapeForPowerShell,
    'windows-cmd': escapeForWindowsCmd,
    makefile: escapeForMakefile,
    sql: escapeForSqlIdentifier,
    'sql-literal': escapeForSqlLiteral,
    mongodb: escapeForMongoDB,
    elasticsearch: escapeForElasticsearch,
    ldap: escapeForLdapFilter,
    csv: escapeForCsv,
    latex: escapeForLatex,
    markdown: escapeForMarkdown,
    yaml: escapeForYaml,
    ini: escapeForIni,
    rtf: escapeForRtf,
    pdf: escapeForPdf,
    javascript: escapeForJavaScript,
    js: escapeForJavaScript,
    'c-string': escapeForCString,
    php: escapeForPhp,
    'python-fstring': escapeForPythonFString,
    handlebars: escapeForHandlebars,
    cookie: escapeForCookie,
    'http-header': escapeForHttpHeader,
    'regex-replacement': escapeForRegexReplacement,
    jsonpath: escapeForJsonPath,
    xpath: escapeForXPath,
    graphql: escapeForGraphQL,
    glob: escapeForGlob,
    terminal: escapeForTerminal
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
    javascript: /[\\'"` \n\r\t\b\f\v\0\u0001-\u001F\u007F-\u009F]/,
    yaml: /^[-:>|]|[\n\r\t]|^[0-9]|[{}[\],"'`]/,
    shell: /[^a-zA-Z0-9._/-]/,
    sql: /[^a-zA-Z0-9_]/,
    elasticsearch: /[+\-&|!(){}[\]^"~*?:\\\/]/,
    glob: /[*?[\]]/
  };
  
  const pattern = needsEscaping[context.toLowerCase()];
  if (pattern && pattern.test(str)) {
    return escapeFor(str, context);
  }
  
  return str;
}

/**
 * Validates if a string is safe for a given context (no escaping needed)
 */
function isSafeFor(str, context) {
  if (typeof str !== 'string') {
    return false;
  }
  
  try {
    return escapeIfNeeded(str, context) === str;
  } catch {
    return false;
  }
}

/**
 * Auto-detects the best escape method based on content analysis
 */
function smartEscape(str, possibleContexts = []) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  
  if (possibleContexts.length === 0) {
    possibleContexts = ['html', 'javascript', 'css', 'sql', 'shell'];
  }
  
  // Find contexts where string is already safe
  const safeContexts = possibleContexts.filter(context => isSafeFor(str, context));
  
  if (safeContexts.length > 0) {
    return { escaped: str, context: safeContexts[0], wasSafe: true };
  }
  
  // Default to HTML escaping if no safe context found
  const defaultContext = possibleContexts[0] || 'html';
  return { 
    escaped: escapeFor(str, defaultContext), 
    context: defaultContext, 
    wasSafe: false 
  };
}

export {
  // Original functions
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
  
  // Programming languages
  escapeForCString,
  escapeForPhp,
  escapeForPythonFString,
  escapeForHandlebars,
  
  // Web protocols
  escapeForUrlPath,
  escapeForMultipart,
  escapeForCookie,
  escapeForHttpHeader,
  
  // Databases
  escapeForSqlLiteral,
  escapeForMongoDB,
  escapeForElasticsearch,
  
  // Document formats
  escapeForYaml,
  escapeForIni,
  escapeForRtf,
  escapeForPdf,
  
  // System commands
  escapeForPowerShell,
  escapeForWindowsCmd,
  escapeForMakefile,
  
  // Interface & display
  escapeForCssContent,
  escapeForSvg,
  escapeForTerminal,
  
  // Other contexts
  escapeForRegexReplacement,
  escapeForJsonPath,
  escapeForXPath,
  escapeForGraphQL,
  escapeForGlob,
  
  // Utility functions
  escapeFor,
  batchEscape,
  escapeIfNeeded,
  isSafeFor,
  smartEscape
};