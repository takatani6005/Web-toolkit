// src/security/SecurityAnalyzer.js
import { SecurityConfig } from "./SecurityConfig.js";
import { SecurityDetector } from "./SecurityDetector.js";
import { HtmlSanitizer } from "./HtmlSanitizer.js";
// Testing and Monitoring
export class SecurityAnalyzer {
  constructor(config = new SecurityConfig()) {
    this.config = config;
    this.detector = new SecurityDetector(config);
    this.sanitizer = new HtmlSanitizer(config);
  }

  /**
   * Generate comprehensive security report
   * @param {string} html - HTML to analyze
   * @returns {Object} Detailed security report
   */
  securityReport(html) {
    const xssResults = this.detector.scanForXSS(html);
    const protocolResults = this.detector.hasDangerousProtocols(html);
    const eventResults = this.detector.containsInlineEventHandlers(html);
    
    // Count dangerous elements
    const dangerousTagCount = (html.match(/<(script|iframe|object|embed)\b/gi) || []).length;
    const suspiciousUrls = protocolResults.alerts.map(alert => alert.url);

    return {
      timestamp: new Date().toISOString(),
      summary: {
        safe: xssResults.safe && protocolResults.safe && eventResults.safe,
        totalAlerts: xssResults.alerts.length + protocolResults.alerts.length + eventResults.alerts.length,
        dangerousTagCount,
        suspiciousUrlCount: suspiciousUrls.length,
        contentLength: html.length
      },
      details: {
        xssPatterns: xssResults,
        dangerousProtocols: protocolResults,
        inlineEventHandlers: eventResults,
        suspiciousUrls
      },
      recommendations: this.generateRecommendations(xssResults, protocolResults, eventResults)
    };
  }

  /**
   * Auto-remediate HTML with logging
   * @param {string} html - HTML to remediate
   * @param {Object} options - Remediation options
   * @returns {Object} Remediation results with detailed log
   */
  autoRemediate(html, options = {}) {
    const { mode = 'moderate', preserveContent = true } = options;
    const log = [];
    let remediated = html;

    // Step 1: Strip dangerous scripts
    const scriptResults = this.sanitizer.stripScripts(remediated);
    remediated = scriptResults.stripped;
    log.push({
      step: 'STRIP_SCRIPTS',
      alerts: scriptResults.alerts,
      before: html.length,
      after: remediated.length
    });

    // Step 2: Remove inline styles if requested
    if (!preserveContent || mode === 'strict') {
      const styleResults = this.sanitizer.removeInlineStyles(remediated);
      remediated = styleResults.cleaned;
      log.push({
        step: 'REMOVE_INLINE_STYLES',
        alerts: styleResults.alerts,
        removedCount: styleResults.removedCount
      });
    }

    // Step 3: Apply policy-based sanitization
    const policy = mode === 'strict' ? 
      { allowedTags: this.config.getStrictMode('tags'), allowedAttributes: this.config.getStrictMode('attributes') } :
      { allowedTags: this.config.getWhitelist('tags'), allowedAttributes: this.config.getWhitelist('attributes') };
    
    const policyResults = this.sanitizer.sanitizeWithPolicy(remediated, policy);
    remediated = policyResults.sanitized;
    log.push({
      step: 'APPLY_POLICY',
      alerts: policyResults.alerts,
      policy: policyResults.policy
    });

    return {
      original: html,
      remediated,
      log,
      summary: {
        totalSteps: log.length,
        totalAlerts: log.reduce((sum, step) => sum + step.alerts.length, 0),
        sizeReduction: html.length - remediated.length,
        reductionPercentage: ((html.length - remediated.length) / html.length * 100).toFixed(2)
      }
    };
  }

  generateRecommendations(xssResults, protocolResults, eventResults) {
    const recommendations = [];

    if (!xssResults.safe) {
      recommendations.push('Remove or encode XSS patterns detected in content');
    }
    if (!protocolResults.safe) {
      recommendations.push('Replace dangerous protocols with safe alternatives');
    }
    if (!eventResults.safe) {
      recommendations.push('Remove inline event handlers and use external JavaScript');
    }

    return recommendations;
  }
}

export function securityReport(html, config ) {
  return new SecurityAnalyzer(config).securityReport(html);
}
export function autoRemediate(html, options, config ) {
  return new SecurityAnalyzer(config).autoRemediate(html, options);
}
