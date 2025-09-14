// src/security/export.js
import { SecurityConfig } from "./SecurityConfig.js";
import { SecurityDetector, scanForXSS,hasDangerousProtocols,containsInlineEventHandlers } from "./SecurityDetector.js";
import { HtmlSanitizer, sanitizeStrict,sanitizeWithPolicy,sanitizeHtml, stripEntities, isSafeHtml } from "./HtmlSanitizer.js";
import { OutputEncoder } from "./OutputEncoder.js";
import { SecurityAnalyzer,securityReport,autoRemediate } from "./SecurityAnalyzer.js";
import { HtmlValidator,isHtmlSafeSubset } from "./HtmlValidator.js";

console.log("Advanced security module loaded.");
export {
  sanitizeHtml, 
  stripEntities, 
  isSafeHtml,
  // Advanced Security Tools
  SecurityConfig,
  SecurityDetector,
  HtmlSanitizer,
  OutputEncoder,
  SecurityAnalyzer,
  HtmlValidator,
  
  scanForXSS,
  hasDangerousProtocols,
  containsInlineEventHandlers,
  sanitizeStrict,
  sanitizeWithPolicy,
  securityReport,
  autoRemediate,
  isHtmlSafeSubset,

};