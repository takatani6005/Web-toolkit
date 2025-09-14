// src/security/HtmlSanitizer.js
import { SecurityConfig } from "./SecurityConfig.js";
// Advanced Cleaning Functions
export class HtmlSanitizer {
  constructor(config = new SecurityConfig()) {
    this.config = config;
  }
  
/**
 * Sanitize HTML by encoding potentially dangerous entities
 * @param {string} str - String to sanitize
 * @param {Object} options - Sanitization options
 * @param {boolean} options.allowBasicEntities - Allow basic HTML entities (default: true)
 * @param {Array} options.whitelist - Array of allowed entities
 * @param {Array} options.blacklist - Array of forbidden entities
 * @returns {string} Sanitized string
 */
sanitizeHtml(str, options = {}) {
    if (typeof str !== 'string') {
        throw new TypeError('Input must be a string');
    }
    
    const {
        allowBasicEntities = true,
        whitelist = [],
        blacklist = []
    } = options;
    
    const basicEntities = ['&amp;', '&lt;', '&gt;', '&quot;', '&#x27;', '&apos;'];
    const allowedEntities = allowBasicEntities ? 
        [...basicEntities, ...whitelist] : 
        [...whitelist];
    
    return str.replace(/&[a-zA-Z0-9#]+;/g, (entity) => {
        // Check blacklist first
        if (blacklist.includes(entity)) {
        return encodeHtmlMinimal(entity);
        }
        
        // If we have a whitelist, only allow those
        if (allowedEntities.length > 0 && !allowedEntities.includes(entity)) {
        // Check if it's a valid entity that should be double-encoded
        try {
            const decoded = decodeHtml(entity, { strict: true });
            if (decoded !== entity) {
            // It's a valid entity but not whitelisted, double-encode it
            return encodeHtmlMinimal(entity);
            }
        } catch (e) {
            // Invalid entity, encode it
            return encodeHtmlMinimal(entity);
        }
        return encodeHtmlMinimal(entity);
        }
        
        return entity;
    });
    }

    /**
     * Strip all HTML entities from string
     * @param {string} str - String to process
     * @param {Object} options - Options
     * @param {boolean} options.decode - Decode entities before stripping (default: true)
     * @param {string} options.replacement - Replacement string (default: '')
     * @returns {string} String with entities removed
     */
    stripEntities(str, options = {}) {
    if (typeof str !== 'string') {
        throw new TypeError('Input must be a string');
    }
    
    const { decode = true, replacement = '' } = options;
    
    if (decode) {
        // First decode entities, then remove any remaining ones
        const decoded = decodeHtml(str);
        return decoded.replace(/&[a-zA-Z0-9#]+;/g, replacement);
    } else {
        // Just remove entity patterns
        return str.replace(/&[a-zA-Z0-9#]+;/g, replacement);
    }
    }

    /**
     * Check if HTML string is safe (contains only whitelisted entities)
     * @param {string} str - String to check
     * @param {Object} options - Safety options
     * @param {Array} options.whitelist - Array of allowed entities
     * @param {boolean} options.allowBasicEntities - Allow basic HTML entities (default: true)
     * @returns {Object} Safety analysis result
     */
    isSafeHtml(str, options = {}) {
    if (typeof str !== 'string') {
        return { safe: false, reason: 'Input must be a string', unsafe: [] };
    }
    
    const {
        whitelist = [],
        allowBasicEntities = true
    } = options;
    
    const basicEntities = ['&amp;', '&lt;', '&gt;', '&quot;', '&#x27;', '&apos;'];
    const allowedEntities = allowBasicEntities ? 
        [...basicEntities, ...whitelist] : 
        [...whitelist];
    
    const entities = findEntities(str);
    const unsafe = [];
    
    entities.forEach(entity => {
        if (!allowedEntities.includes(entity)) {
        // Check if it's a potentially dangerous numeric entity
        if (entity.startsWith('&#')) {
            const codePoint = entity.startsWith('&#x') || entity.startsWith('&#X') ?
            parseInt(entity.slice(3, -1), 16) :
            parseInt(entity.slice(2, -1), 10);
            
            // Check for dangerous control characters or private use areas
            if (codePoint < 32 && codePoint !== 9 && codePoint !== 10 && codePoint !== 13) {
            unsafe.push(entity);
            } else if (codePoint >= 0xE000 && codePoint <= 0xF8FF) {
            unsafe.push(entity);
            } else if (!allowedEntities.includes(entity)) {
            unsafe.push(entity);
            }
        } else {
            unsafe.push(entity);
        }
        }
    });
    
    return {
        safe: unsafe.length === 0,
        reason: unsafe.length > 0 ? `Contains unsafe entities: ${unsafe.join(', ')}` : 'All entities are safe',
        unsafe,
        total: entities.length,
        checked: entities.length
    };
    }
  /**
   * Strict sanitization - only allows very narrow whitelist
   * @param {string} html - HTML to sanitize
   * @returns {Object} Sanitization results
   */
  sanitizeStrict(html) {
    const allowedTags = this.config.getStrictMode('tags');
    const allowedAttributes = this.config.getStrictMode('attributes');
    const alerts = [];

    // Remove all tags except those in strict whitelist
    let sanitized = html.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/gi, (match, tagName) => {
      if (!allowedTags.includes(tagName.toLowerCase())) {
        alerts.push({
          type: 'TAG_REMOVED',
          severity: 'MEDIUM',
          tag: tagName,
          original: match
        });
        return '';
      }
      
      // Clean attributes
      return match.replace(/\s+([a-zA-Z-]+)\s*=\s*["'][^"']*["']/gi, (attrMatch, attrName) => {
        if (!allowedAttributes.includes(attrName.toLowerCase())) {
          alerts.push({
            type: 'ATTRIBUTE_REMOVED',
            severity: 'LOW',
            attribute: attrName,
            original: attrMatch
          });
          return '';
        }
        return attrMatch;
      });
    });

    return {
      sanitized,
      alerts,
      originalLength: html.length,
      sanitizedLength: sanitized.length
    };
  }

  /**
   * Sanitize with custom policy
   * @param {string} html - HTML to sanitize
   * @param {Object} policy - Custom policy with allowed tags/attributes
   * @returns {Object} Sanitization results
   */
  sanitizeWithPolicy(html, policy) {
    const { allowedTags = [], allowedAttributes = [], allowedProtocols = [] } = policy;
    const alerts = [];
    let sanitized = html;

    // Remove disallowed tags
    sanitized = sanitized.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/gi, (match, tagName) => {
      if (!allowedTags.includes(tagName.toLowerCase())) {
        alerts.push({
          type: 'POLICY_TAG_REMOVED',
          severity: 'MEDIUM',
          tag: tagName,
          original: match
        });
        return '';
      }
      return match;
    });

    // Clean attributes based on policy
    sanitized = sanitized.replace(/\s+([a-zA-Z-]+)\s*=\s*["']([^"']*)["']/gi, (match, attrName, attrValue) => {
      if (!allowedAttributes.includes(attrName.toLowerCase())) {
        alerts.push({
          type: 'POLICY_ATTRIBUTE_REMOVED',
          severity: 'LOW',
          attribute: attrName,
          original: match
        });
        return '';
      }

      // Check protocol for URL attributes
      if (['href', 'src', 'action'].includes(attrName.toLowerCase())) {
        const protocol = attrValue.split(':')[0].toLowerCase() + ':';
        if (allowedProtocols.length > 0 && !allowedProtocols.includes(protocol)) {
          alerts.push({
            type: 'POLICY_PROTOCOL_BLOCKED',
            severity: 'HIGH',
            protocol: protocol,
            original: match
          });
          return '';
        }
      }

      return match;
    });

    return {
      sanitized,
      alerts,
      policy,
      originalLength: html.length,
      sanitizedLength: sanitized.length
    };
  }

  /**
   * Remove inline styles
   * @param {string} html - HTML string
   * @returns {Object} Results with alerts
   */
  removeInlineStyles(html) {
    const alerts = [];
    const stylePattern = /\sstyle\s*=\s*["'][^"']*["']/gi;
    const matches = html.match(stylePattern) || [];
    
    matches.forEach(match => {
      alerts.push({
        type: 'INLINE_STYLE_REMOVED',
        severity: 'MEDIUM',
        original: match
      });
    });

    const cleaned = html.replace(stylePattern, '');

    return {
      cleaned,
      alerts,
      removedCount: matches.length,
      originalLength: html.length,
      cleanedLength: cleaned.length
    };
  }

  /**
   * Strip script tags and suspicious sources
   * @param {string} html - HTML string
   * @returns {Object} Results with alerts
   */
  stripScripts(html) {
    const alerts = [];
    const patterns = [
      { name: 'SCRIPT_TAG', pattern: /<script\b[^>]*>[\s\S]*?<\/script>/gi },
      { name: 'JAVASCRIPT_SRC', pattern: /<[^>]+src\s*=\s*["'][^"']*javascript:[^"']*["'][^>]*>/gi },
      { name: 'VBSCRIPT_SRC', pattern: /<[^>]+src\s*=\s*["'][^"']*vbscript:[^"']*["'][^>]*>/gi }
    ];

    let stripped = html;

    patterns.forEach(({ name, pattern }) => {
      const matches = html.match(pattern) || [];
      matches.forEach(match => {
        alerts.push({
          type: name,
          severity: 'HIGH',
          original: match
        });
      });
      stripped = stripped.replace(pattern, '');
    });

    return {
      stripped,
      alerts,
      originalLength: html.length,
      strippedLength: stripped.length
    };
  }

  
}

export function sanitizeStrict(html, config ) {
  return new HtmlSanitizer(config).sanitizeStrict(html);
}
export function sanitizeWithPolicy(html, policy, config ) {
  return new HtmlSanitizer(config).sanitizeWithPolicy(html, policy);
}
export function sanitizeHtml(html, options, config ) { 
    return new HtmlSanitizer(config).sanitizeHtml(html, options); 
} 
export function stripEntities(html, options, config ) { 
    return new HtmlSanitizer(config).stripEntities(html, options); 
} 
export function isSafeHtml(html, options, config ) { 
    return new HtmlSanitizer(config).isSafeHtml(html, options); 
}