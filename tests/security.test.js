// /**
//  * HTML Security Library - Usage Examples and Test Cases
//  * Demonstrates all the enhanced security features
//  */

// import {
//   SecurityConfig,
//   SecurityDetector,
//   HtmlSanitizer,
//   OutputEncoder,
//   SecurityAnalyzer,
//   HtmlValidator,
//   scanForXSS,
//   hasDangerousProtocols,
//   containsInlineEventHandlers,
//   sanitizeStrict,
//   sanitizeWithPolicy,
//   securityReport,
//   autoRemediate,
//   isHtmlSafeSubset
// } from '../src/security/index.js';

// // Example 1: Basic XSS Detection
// console.log('=== XSS Detection Examples ===');

// const maliciousHtml = `
//   <div>
//     <script>alert('XSS')</script>
//     <img src="javascript:alert('XSS')" />
//     <p onclick="alert('clicked')">Click me</p>
//     <iframe src="http://evil.com"></iframe>
//   </div>
// `;

// const xssResults = scanForXSS(maliciousHtml);
// console.log('XSS Scan Results:', JSON.stringify(xssResults, null, 2));

// // Example 2: Protocol Detection
// console.log('\n=== Dangerous Protocol Detection ===');

// const urlHtml = `
//   <a href="javascript:alert('xss')">Link 1</a>
//   <a href="https://safe.com">Safe Link</a>
//   <img src="data:image/svg+xml;base64,..." />
//   <form action="vbscript:alert('xss')">Form</form>
// `;

// const protocolResults = hasDangerousProtocols(urlHtml);
// console.log('Protocol Results:', JSON.stringify(protocolResults, null, 2));

// // Example 3: Event Handler Detection
// console.log('\n=== Event Handler Detection ===');

// const eventHtml = `
//   <div onload="malicious()">
//     <button onclick="steal()">Button</button>
//     <input onfocus="keylog()" />
//   </div>
// `;

// const eventResults = containsInlineEventHandlers(eventHtml);
// console.log('Event Handler Results:', JSON.stringify(eventResults, null, 2));

// // Example 4: Strict Sanitization
// console.log('\n=== Strict Sanitization ===');

// const richHtml = `
//   <div class="content">
//     <h1>Title</h1>
//     <p>Safe content</p>
//     <script>alert('bad')</script>
//     <img src="image.jpg" onclick="bad()" />
//   </div>
// `;

// const strictResults = sanitizeStrict(richHtml);
// console.log('Strict Sanitization:', JSON.stringify(strictResults, null, 2));

// // Example 5: Policy-based Sanitization
// console.log('\n=== Policy-based Sanitization ===');

// const customPolicy = {
//   allowedTags: ['p', 'strong', 'em', 'a', 'img'],
//   allowedAttributes: ['href', 'src', 'alt', 'class'],
//   allowedProtocols: ['https:', 'mailto:']
// };

// const policyResults = sanitizeWithPolicy(richHtml, customPolicy);
// console.log('Policy Sanitization:', JSON.stringify(policyResults, null, 2));

// // Example 6: Output Encoding
// console.log('\n=== Output Encoding Examples ===');

// const userInput = `<script>alert("XSS")</script> & 'quotes' "test"`;

// console.log('For HTML Attribute:', OutputEncoder.encodeForAttr(userInput));
// console.log('For CSS:', OutputEncoder.encodeForCss(userInput));
// console.log('For JavaScript:', OutputEncoder.encodeForJs(userInput));

// // Example 7: Comprehensive Security Report
// console.log('\n=== Security Report ===');

// const complexHtml = `
//   <html>
//     <head>
//       <script src="javascript:alert('xss')"></script>
//       <style>body { background: url(javascript:alert('xss')); }</style>
//     </head>
//     <body onload="steal()">
//       <div onclick="malicious()">
//         <iframe src="http://evil.com"></iframe>
//         <object data="malicious.swf"></object>
//         <img src="image.jpg" onerror="exploit()" />
//       </div>
//     </body>
//   </html>
// `;

// const report = securityReport(complexHtml);
// console.log('Security Report:', JSON.stringify(report, null, 2));

// // Example 8: Auto Remediation
// console.log('\n=== Auto Remediation ===');

// const remediationResults = autoRemediate(complexHtml, {
//   mode: 'moderate',
//   preserveContent: true
// });

// console.log('Remediation Results:', JSON.stringify(remediationResults, null, 2));

// // Example 9: Safe Subset Validation
// console.log('\n=== Safe Subset Validation ===');

// const basicHtml = '<p><strong>Bold text</strong> and <em>italic</em></p>';
// const unsafeHtml = '<p><script>alert("xss")</script>Safe text</p>';

// console.log('Basic HTML is safe subset:', isHtmlSafeSubset(basicHtml));
// console.log('Unsafe HTML is safe subset:', isHtmlSafeSubset(unsafeHtml));

// // Example 10: CSP Validation
// console.log('\n=== CSP Validation ===');

// const validator = new HtmlValidator();
// const cspPolicy = {
//   'script-src': ["'self'"],
//   'style-src': ["'self'"],
//   'img-src': ["'self'", "data:"]
// };

// const inlineStyleHtml = '<div style="color: red;">Styled text</div>';
// const cspResults = validator.validateCSPCompatibility(inlineStyleHtml, cspPolicy);
// console.log('CSP Validation:', JSON.stringify(cspResults, null, 2));

// // Example 11: Using Configuration Files
// console.log('\n=== Configuration-based Usage ===');

// // Load custom configuration
// const customConfig = new SecurityConfig('./config/security-config.json');
// const detector = new SecurityDetector(customConfig);
// const sanitizer = new HtmlSanitizer(customConfig);

// const testHtml = '<script>alert("test")</script><p onclick="bad()">Content</p>';

// const configXssResults = detector.scanForXSS(testHtml);
// const configSanitizeResults = sanitizer.sanitizeStrict(testHtml);

// console.log('Config-based XSS Detection:', JSON.stringify(configXssResults, null, 2));
// console.log('Config-based Sanitization:', JSON.stringify(configSanitizeResults, null, 2));

// // Example 12: Advanced Security Analysis
// console.log('\n=== Advanced Security Analysis ===');

// const analyzer = new SecurityAnalyzer();

// // Analyze complex mixed content
// const mixedContent = `
//   <article class="post">
//     <header>
//       <h1 onclick="trackClick()">Article Title</h1>
//       <script>
//         // Analytics code
//         gtag('event', 'page_view');
//       </script>
//     </header>
//     <content>
//       <p>Safe paragraph content</p>
//       <img src="https://example.com/image.jpg" onerror="handleError()" />
//       <iframe src="javascript:void(0)"></iframe>
//       <div style="background: url('data:image/svg+xml;base64,PHN2Zz4KPC9zdmc+')">
//         Styled content
//       </div>
//     </content>
//   </article>
// `;

// const analysisReport = analyzer.securityReport(mixedContent);
// console.log('Advanced Analysis Report:');
// console.log('Summary:', analysisReport.summary);
// console.log('Recommendations:', analysisReport.recommendations);

// // Example 13: Batch Processing with Alerts
// console.log('\n=== Batch Processing Example ===');

// const htmlBatch = [
//   '<p>Safe content</p>',
//   '<script>alert("xss")</script>',
//   '<img src="javascript:alert()" />',
//   '<div onclick="bad()">Click</div>',
//   '<p><strong>More safe content</strong></p>'
// ];

// const batchResults = htmlBatch.map((html, index) => {
//   const xssCheck = scanForXSS(html);
//   const protocolCheck = hasDangerousProtocols(html);
//   const eventCheck = containsInlineEventHandlers(html);
  
//   return {
//     index,
//     html,
//     safe: xssCheck.safe && protocolCheck.safe && eventCheck.safe,
//     totalAlerts: xssCheck.alerts.length + protocolCheck.alerts.length + eventCheck.alerts.length,
//     alerts: [
//       ...xssCheck.alerts,
//       ...protocolCheck.alerts,
//       ...eventCheck.alerts
//     ]
//   };
// });

// console.log('Batch Processing Results:');
// batchResults.forEach(result => {
//   console.log(`Item ${result.index}: ${result.safe ? 'SAFE' : 'UNSAFE'} (${result.totalAlerts} alerts)`);
//   if (!result.safe) {
//     console.log('  Alerts:', result.alerts.map(a => a.type).join(', '));
//   }
// });

// // Example 14: Real-time Content Filtering
// console.log('\n=== Real-time Content Filtering ===');

// class ContentFilter {
//   constructor() {
//     this.analyzer = new SecurityAnalyzer();
//   }

//   filterUserContent(content, userLevel = 'standard') {
//     const policies = {
//       'basic': { allowedTags: ['p', 'br', 'strong', 'em'], allowedAttributes: [] },
//       'standard': { allowedTags: ['p', 'br', 'strong', 'em', 'a', 'img'], allowedAttributes: ['href', 'src', 'alt'] },
//       'advanced': { allowedTags: ['p', 'br', 'strong', 'em', 'a', 'img', 'div', 'span'], allowedAttributes: ['href', 'src', 'alt', 'class', 'id'] }
//     };

//     const policy = policies[userLevel] || policies['basic'];
    
//     // First, detect threats
//     const threats = this.analyzer.securityReport(content);
    
//     // If threats found, auto-remediate
//     if (!threats.summary.safe) {
//       const remediated = this.analyzer.autoRemediate(content, { mode: 'strict' });
//       return {
//         original: content,
//         filtered: remediated.remediated,
//         threats: threats.summary.totalAlerts,
//         actions: remediated.log.map(l => l.step),
//         safe: true
//       };
//     }

//     // Apply policy-based filtering
//     const sanitizer = new HtmlSanitizer();
//     const filtered = sanitizer.sanitizeWithPolicy(content, policy);
    
//     return {
//       original: content,
//       filtered: filtered.sanitized,
//       threats: 0,
//       actions: ['POLICY_APPLIED'],
//       safe: true
//     };
//   }
// }

// const filter = new ContentFilter();
// const userContent = `
//   <div>
//     <p>Hello <script>alert('xss')</script> world!</p>
//     <img src="image.jpg" onerror="steal()" />
//     <a href="https://example.com">Safe link</a>
//   </div>
// `;

// const filterResult = filter.filterUserContent(userContent, 'standard');
// console.log('Content Filtering Result:');
// console.log('Safe:', filterResult.safe);
// console.log('Threats detected:', filterResult.threats);
// console.log('Actions taken:', filterResult.actions);
// console.log('Original length:', filterResult.original.length);
// console.log('Filtered length:', filterResult.filtered.length);

// // Example 15: Performance Monitoring
// console.log('\n=== Performance Monitoring ===');

// function performanceTest(html, iterations = 1000) {
//   const start = process.hrtime.bigint();
  
//   for (let i = 0; i < iterations; i++) {
//     scanForXSS(html);
//     hasDangerousProtocols(html);
//     containsInlineEventHandlers(html);
//   }
  
//   const end = process.hrtime.bigint();
//   const duration = Number(end - start) / 1000000; // Convert to milliseconds
  
//   return {
//     iterations,
//     totalTime: duration,
//     averageTime: duration / iterations,
//     htmlSize: html.length
//   };
// }

// const performanceResult = performanceTest(complexHtml, 100);
// console.log('Performance Test Results:', performanceResult);

// console.log('\n=== All Examples Complete ===');