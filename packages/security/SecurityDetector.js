// src/security/SecurityDetector.js
import { SecurityConfig } from "./SecurityConfig.js";
// Security Detection Functions
export class SecurityDetector {
  constructor(config = new SecurityConfig()) {
    this.config = config;
    this.xssPatterns = [
      /<script[\s\S]*?<\/script>/gi,
      /javascript:/gi,
      /vbscript:/gi,
      /on\w+\s*=/gi,
      /<iframe[\s\S]*?>/gi,
      /<object[\s\S]*?>/gi,
      /<embed[\s\S]*?>/gi,
      /<link[\s\S]*?>/gi,
      /<meta[\s\S]*?>/gi,
      /expression\s*\(/gi,
      /url\s*\(/gi,
      /&#x?[0-9a-f]+;?/gi
    ];
  }

  /**
   * Scan HTML for XSS attack patterns
   * @param {string} html - HTML string to scan
   * @returns {Object} Scan results with alerts
   */
  scanForXSS(html) {
    const alerts = [];
    const matches = [];

    this.xssPatterns.forEach((pattern, index) => {
      const patternMatches = html.match(pattern);
      if (patternMatches) {
        const alert = {
          type: 'XSS_PATTERN',
          severity: 'HIGH',
          pattern: pattern.toString(),
          matches: patternMatches,
          count: patternMatches.length
        };
        alerts.push(alert);
        matches.push(...patternMatches);
      }
    });

    // Check for dangerous HTML tags
    const dangerousTags = this.config.getBlacklist('tags');
    const tagPattern = new RegExp(`<(${dangerousTags.join('|')})\\b[^>]*>`, 'gi');
    const tagMatches = html.match(tagPattern);
    
    if (tagMatches) {
      alerts.push({
        type: 'DANGEROUS_TAG',
        severity: 'HIGH',
        matches: tagMatches,
        count: tagMatches.length
      });
    }

    return {
      safe: alerts.length === 0,
      alerts,
      totalMatches: matches.length,
      scannedLength: html.length
    };
  }

  /**
   * Check for dangerous protocols in URLs
   * @param {string} html - HTML string to check
   * @returns {Object} Detection results
   */
  hasDangerousProtocols(html) {
    const alerts = [];
    const dangerousProtocols = this.config.getBlacklist('protocols');
    
    // Extract URLs from href, src, action attributes
    const urlPattern = /(href|src|action)\s*=\s*["']([^"']+)["']/gi;
    let match;

    while ((match = urlPattern.exec(html)) !== null) {
      const url = match[2];
      const protocol = url.split(':')[0].toLowerCase() + ':';
      
      if (dangerousProtocols.includes(protocol)) {
        alerts.push({
          type: 'DANGEROUS_PROTOCOL',
          severity: 'HIGH',
          protocol: protocol,
          url: url,
          attribute: match[1]
        });
      }
    }

    return {
      safe: alerts.length === 0,
      alerts,
      totalUrls: (html.match(urlPattern) || []).length
    };
  }

  /**
   * Check for inline event handlers
   * @param {string} html - HTML string to check
   * @returns {Object} Detection results
   */
  containsInlineEventHandlers(html) {
    const alerts = [];
    const eventHandlers = this.config.getBlacklist('attributes');
    
    eventHandlers.forEach(handler => {
      const pattern = new RegExp(`${handler}\\s*=\\s*["'][^"']*["']`, 'gi');
      const matches = html.match(pattern);
      
      if (matches) {
        alerts.push({
          type: 'INLINE_EVENT_HANDLER',
          severity: 'HIGH',
          handler: handler,
          matches: matches,
          count: matches.length
        });
      }
    });

    return {
      safe: alerts.length === 0,
      alerts,
      totalHandlers: alerts.reduce((sum, alert) => sum + alert.count, 0)
    };
  }
}


export function scanForXSS(html, config ) {
  return new SecurityDetector(config).scanForXSS(html);
}
export function hasDangerousProtocols(html, config ) {
  return new SecurityDetector(config).hasDangerousProtocols(html);
}
export function containsInlineEventHandlers(html, config ) {
  return new SecurityDetector(config).containsInlineEventHandlers(html);
}