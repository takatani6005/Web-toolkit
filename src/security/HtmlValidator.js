// src/security/HtmlValidator.js
import { SecurityConfig } from "./SecurityConfig.js";
// Add-on Functions
export class HtmlValidator {
  constructor(config = new SecurityConfig()) {
    this.config = config;
  }

  /**
   * Check if HTML contains only basic safe tags
   * @param {string} html - HTML to check
   * @returns {Object} Validation results
   */
  isHtmlSafeSubset(html) {
    const basicSafeTags = ['p', 'br', 'b', 'i', 'strong', 'em', 'u', 'span'];
    const foundTags = [...html.matchAll(/<(\w+)/g)].map(match => match[1].toLowerCase());
    const unsafeTags = foundTags.filter(tag => !basicSafeTags.includes(tag));

    return {
      safe: unsafeTags.length === 0,
      foundTags,
      unsafeTags,
      allowedTags: basicSafeTags
    };
  }

  /**
   * Validate against Content Security Policy
   * @param {string} html - HTML to validate
   * @param {Object} csp - CSP configuration
   * @returns {Object} CSP validation results
   */
  validateCSPCompatibility(html, csp = {}) {
    const violations = [];
    const {
      'script-src': scriptSrc = [],
      'style-src': styleSrc = [],
      'img-src': imgSrc = [],
      'default-src': defaultSrc = []
    } = csp;

    // Check inline scripts
    if (html.includes('<script') && !scriptSrc.includes("'unsafe-inline'")) {
      violations.push({
        type: 'CSP_SCRIPT_VIOLATION',
        directive: 'script-src',
        reason: 'Inline scripts not allowed by CSP'
      });
    }

    // Check inline styles
    if (html.includes('style=') && !styleSrc.includes("'unsafe-inline'")) {
      violations.push({
        type: 'CSP_STYLE_VIOLATION',
        directive: 'style-src',
        reason: 'Inline styles not allowed by CSP'
      });
    }

    return {
      compatible: violations.length === 0,
      violations,
      csp
    };
  }
}
export function isHtmlSafeSubset(html, config ) {
  return new HtmlValidator(config).isHtmlSafeSubset(html);
}
