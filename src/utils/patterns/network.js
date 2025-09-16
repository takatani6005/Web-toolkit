/**
 * Enhanced Network Pattern Library
 * Comprehensive IP validation, MAC addresses, URLs, domains, ports, and more
 */

/**
 * Enhanced IPv4 pattern with comprehensive validation
 * @param {Object} options - Configuration options
 * @param {boolean} options.allowPrivate - Allow private IP ranges (default: true)
 * @param {boolean} options.allowLoopback - Allow loopback addresses (default: true)
 * @param {boolean} options.allowSubnet - Allow CIDR notation (default: false)
 * @param {boolean} options.allowReserved - Allow reserved ranges (default: false)
 * @param {boolean} options.allowMulticast - Allow multicast ranges (default: false)
 * @param {boolean} options.strict - Strict octet validation (default: false)
 * @returns {RegExp} IPv4 validation pattern
 */
export function generateIpv4Pattern(options = {}) {
  const {
    allowPrivate = true,
    allowLoopback = true,
    allowSubnet = false,
    allowReserved = false,
    allowMulticast = false,
    strict = false
  } = options;

  // More precise octet pattern
  const octet = strict
    ? '(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])'
    : '(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';

  let pattern = `^(?:${octet}\\.){3}${octet}`;
  
  // Add subnet support with validation
  if (allowSubnet) {
    pattern += '(?:/(?:3[0-2]|[12]?[0-9]))?';
  }
  
  pattern += '$';
  const regex = new RegExp(pattern);

  // Enhanced validation function
  if (!allowPrivate || !allowLoopback || !allowReserved || !allowMulticast) {
    const originalTest = regex.test.bind(regex);
    regex.test = function(input) {
      if (!originalTest(input)) return false;
      
      const [ip, subnet] = input.split('/');
      const octets = ip.split('.').map(Number);
      const firstOctet = octets[0];
      const secondOctet = octets[1];

      // Validate subnet if present
      if (subnet !== undefined) {
        const subnetNum = parseInt(subnet, 10);
        if (subnetNum < 0 || subnetNum > 32) return false;
      }

      // Loopback: 127.0.0.0/8
      if (!allowLoopback && firstOctet === 127) return false;

      // Private ranges
      if (!allowPrivate) {
        // 10.0.0.0/8
        if (firstOctet === 10) return false;
        // 172.16.0.0/12
        if (firstOctet === 172 && secondOctet >= 16 && secondOctet <= 31) return false;
        // 192.168.0.0/16
        if (firstOctet === 192 && secondOctet === 168) return false;
        // Link-local: 169.254.0.0/16
        if (firstOctet === 169 && secondOctet === 254) return false;
      }

      // Reserved ranges
      if (!allowReserved) {
        // 0.0.0.0/8 - Current network
        if (firstOctet === 0) return false;
        // 240.0.0.0/4 - Reserved for future use
        if (firstOctet >= 240) return false;
      }

      // Multicast: 224.0.0.0/4
      if (!allowMulticast && firstOctet >= 224 && firstOctet <= 239) return false;

      return true;
    };
  }

  return regex;
}

/**
 * Enhanced IPv6 pattern with comprehensive validation
 * @param {Object} options - Configuration options
 * @param {boolean} options.allowCompressed - Allow compressed notation (default: true)
 * @param {boolean} options.allowSubnet - Allow CIDR notation (default: false)
 * @param {boolean} options.allowV4Mapped - Allow IPv4-mapped addresses (default: true)
 * @param {boolean} options.allowLoopback - Allow loopback (::1) (default: true)
 * @param {boolean} options.allowLinkLocal - Allow link-local addresses (default: true)
 * @returns {RegExp} IPv6 validation pattern
 */
export function generateIpv6Pattern(options = {}) {
  const {
    allowCompressed = true,
    allowSubnet = false,
    allowV4Mapped = true,
    allowLoopback = true,
    allowLinkLocal = true
  } = options;

  let patterns = [];

  if (allowCompressed) {
    patterns = [
      // Full format: 2001:0db8:85a3:0000:0000:8a2e:0370:7334
      '(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}',
      
      // Compressed formats
      '::(?:[0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{1,4}',
      '(?:[0-9a-fA-F]{1,4}:){1,7}:',
      '(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}',
      '(?:[0-9a-fA-F]{1,4}:){1,5}(?::[0-9a-fA-F]{1,4}){1,2}',
      '(?:[0-9a-fA-F]{1,4}:){1,4}(?::[0-9a-fA-F]{1,4}){1,3}',
      '(?:[0-9a-fA-F]{1,4}:){1,3}(?::[0-9a-fA-F]{1,4}){1,4}',
      '(?:[0-9a-fA-F]{1,4}:){1,2}(?::[0-9a-fA-F]{1,4}){1,5}',
      '[0-9a-fA-F]{1,4}:(?::[0-9a-fA-F]{1,4}){1,6}',
      
      // Special cases
      '::',
      '::1'
    ];

    // IPv4-mapped IPv6 addresses (::ffff:192.0.2.1)
    if (allowV4Mapped) {
      patterns.push(
        '::(?:ffff|FFFF):(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)',
        '(?:[0-9a-fA-F]{1,4}:){1,4}:(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)'
      );
    }
  } else {
    patterns = ['(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}'];
  }

  let pattern = `^(?:${patterns.join('|')})`;
  
  if (allowSubnet) {
    pattern += '(?:/(?:12[0-8]|1[01][0-9]|[1-9]?[0-9]))?';
  }
  
  pattern += '$';
  const regex = new RegExp(pattern, 'i');

  // Enhanced validation
  if (!allowLoopback || !allowLinkLocal) {
    const originalTest = regex.test.bind(regex);
    regex.test = function(input) {
      if (!originalTest(input)) return false;
      
      const [ip] = input.split('/');
      const normalized = normalizeIpv6(ip);
      
      if (!allowLoopback && normalized === '0000:0000:0000:0000:0000:0000:0000:0001') {
        return false;
      }
      
      if (!allowLinkLocal && normalized.startsWith('fe80:')) {
        return false;
      }
      
      return true;
    };
  }

  return regex;
}

/**
 * Normalize IPv6 address for comparison
 * @private
 */
function normalizeIpv6(ip) {
  // Simple normalization for validation purposes
  if (ip === '::1') return '0000:0000:0000:0000:0000:0000:0000:0001';
  if (ip === '::') return '0000:0000:0000:0000:0000:0000:0000:0000';
  return ip.toLowerCase();
}

/**
 * Combined IP pattern (IPv4 and IPv6)
 * @param {Object} options - Configuration options for both IPv4 and IPv6
 * @returns {RegExp} Combined IP validation pattern
 */
export function generateIpPattern(options = {}) {
  const ipv4 = generateIpv4Pattern(options);
  const ipv6 = generateIpv6Pattern(options);
  
  const combinedPattern = `^(?:${ipv4.source.slice(1, -1)}|${ipv6.source.slice(1, -1)})$`;
  return new RegExp(combinedPattern, 'i');
}

/**
 * MAC address pattern with various formats
 * @param {Object} options - Configuration options
 * @param {string} options.format - 'colon', 'hyphen', 'dot', 'any' (default: 'any')
 * @param {boolean} options.caseSensitive - Case sensitive matching (default: false)
 * @returns {RegExp} MAC address validation pattern
 */
export function generateMacAddressPattern(options = {}) {
  const { format = 'any', caseSensitive = false } = options;
  
  const hex = '[0-9a-fA-F]';
  let patterns = [];
  
  switch (format) {
    case 'colon':
      patterns = [`^(?:${hex}{2}:){5}${hex}{2}$`];
      break;
    case 'hyphen':
      patterns = [`^(?:${hex}{2}-){5}${hex}{2}$`];
      break;
    case 'dot':
      patterns = [`^(?:${hex}{4}\\.){2}${hex}{4}$`];
      break;
    case 'any':
    default:
      patterns = [
        `^(?:${hex}{2}:){5}${hex}{2}$`,           // 00:1B:44:11:3A:B7
        `^(?:${hex}{2}-){5}${hex}{2}$`,           // 00-1B-44-11-3A-B7
        `^(?:${hex}{4}\\.){2}${hex}{4}$`,         // 001B.4411.3AB7
        `^${hex}{12}$`                            // 001B44113AB7
      ];
      break;
  }
  
  const flags = caseSensitive ? '' : 'i';
  return new RegExp(patterns.join('|'), flags);
}

/**
 * Port number pattern with validation
 * @param {Object} options - Configuration options
 * @param {boolean} options.allowWellKnown - Allow well-known ports 1-1023 (default: true)
 * @param {boolean} options.allowRegistered - Allow registered ports 1024-49151 (default: true)
 * @param {boolean} options.allowDynamic - Allow dynamic ports 49152-65535 (default: true)
 * @param {number} options.min - Minimum port number (default: 1)
 * @param {number} options.max - Maximum port number (default: 65535)
 * @returns {RegExp} Port validation pattern
 */
export function generatePortPattern(options = {}) {
  const {
    allowWellKnown = true,
    allowRegistered = true,
    allowDynamic = true,
    min = 1,
    max = 65535
  } = options;
  
  // Basic port pattern (1-65535)
  const pattern = /^(?:6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{0,3})$/;
  
  if (!allowWellKnown || !allowRegistered || !allowDynamic || min !== 1 || max !== 65535) {
    const originalTest = pattern.test.bind(pattern);
    pattern.test = function(input) {
      if (!originalTest(input)) return false;
      
      const port = parseInt(input, 10);
      
      if (port < min || port > max) return false;
      
      if (!allowWellKnown && port >= 1 && port <= 1023) return false;
      if (!allowRegistered && port >= 1024 && port <= 49151) return false;
      if (!allowDynamic && port >= 49152 && port <= 65535) return false;
      
      return true;
    };
  }
  
  return pattern;
}

/**
 * Domain name pattern with comprehensive validation
 * @param {Object} options - Configuration options
 * @param {boolean} options.allowSubdomains - Allow subdomains (default: true)
 * @param {boolean} options.allowInternational - Allow international domains (default: true)
 * @param {boolean} options.requireTLD - Require top-level domain (default: true)
 * @param {number} options.maxLength - Maximum domain length (default: 253)
 * @returns {RegExp} Domain validation pattern
 */
export function generateDomainPattern(options = {}) {
  const {
    allowSubdomains = true,
    allowInternational = true,
    requireTLD = true,
    maxLength = 253
  } = options;
  
  let labelPattern = '[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?';
  
  if (allowInternational) {
    labelPattern = '[a-zA-Z0-9\\u00a1-\\uffff](?:[a-zA-Z0-9\\u00a1-\\uffff-]{0,61}[a-zA-Z0-9\\u00a1-\\uffff])?';
  }
  
  let pattern;
  if (allowSubdomains) {
    pattern = `^(?:${labelPattern}\\.)*${labelPattern}`;
  } else {
    pattern = `^${labelPattern}`;
  }
  
  if (requireTLD) {
    const tldPattern = allowInternational 
      ? '[a-zA-Z\\u00a1-\\uffff]{2,}'
      : '[a-zA-Z]{2,}';
    pattern += `\\.${tldPattern}`;
  }
  
  pattern += '$';
  const regex = new RegExp(pattern, 'i');
  
  if (maxLength !== 253) {
    const originalTest = regex.test.bind(regex);
    regex.test = function(input) {
      if (!originalTest(input)) return false;
      return input.length <= maxLength;
    };
  }
  
  return regex;
}

/**
 * URL pattern with protocol validation
 * @param {Object} options - Configuration options
 * @param {Array<string>} options.protocols - Allowed protocols (default: ['http', 'https'])
 * @param {boolean} options.requireProtocol - Require protocol (default: true)
 * @param {boolean} options.allowPort - Allow port numbers (default: true)
 * @param {boolean} options.allowPath - Allow path (default: true)
 * @param {boolean} options.allowQuery - Allow query parameters (default: true)
 * @param {boolean} options.allowFragment - Allow fragments (default: true)
 * @returns {RegExp} URL validation pattern
 */
export function generateUrlPattern(options = {}) {
  const {
    protocols = ['http', 'https'],
    requireProtocol = true,
    allowPort = true,
    allowPath = true,
    allowQuery = true,
    allowFragment = true
  } = options;
  
  const protocolPattern = requireProtocol 
    ? `(?:${protocols.join('|')})://`
    : `(?:(?:${protocols.join('|')})://)?`;
  
  const domainPattern = generateDomainPattern({ allowSubdomains: true }).source.slice(1, -1);
  const portPattern = allowPort ? '(?::[0-9]{1,5})?' : '';
  const pathPattern = allowPath ? '(?:/[^\\s?#]*)?' : '';
  const queryPattern = allowQuery ? '(?:\\?[^\\s#]*)?' : '';
  const fragmentPattern = allowFragment ? '(?:#[^\\s]*)?' : '';
  
  const pattern = `^${protocolPattern}${domainPattern}${portPattern}${pathPattern}${queryPattern}${fragmentPattern}$`;
  
  return new RegExp(pattern, 'i');
}

/**
 * Network interface pattern (e.g., eth0, wlan1)
 * @param {Object} options - Configuration options
 * @param {Array<string>} options.types - Interface types (default: ['eth', 'wlan', 'lo', 'br', 'docker', 'veth'])
 * @returns {RegExp} Network interface validation pattern
 */
export function generateNetworkInterfacePattern(options = {}) {
  const { types = ['eth', 'wlan', 'lo', 'br', 'docker', 'veth'] } = options;
  
  const typePattern = types.join('|');
  return new RegExp(`^(?:${typePattern})\\d*$`, 'i');
}

/**
 * CIDR notation pattern for network blocks
 * @param {Object} options - Configuration options
 * @param {boolean} options.ipv4Only - Only IPv4 CIDR (default: false)
 * @param {boolean} options.ipv6Only - Only IPv6 CIDR (default: false)
 * @returns {RegExp} CIDR validation pattern
 */
export function generateCidrPattern(options = {}) {
  const { ipv4Only = false, ipv6Only = false } = options;
  
  let patterns = [];
  
  if (!ipv6Only) {
    const ipv4Pattern = generateIpv4Pattern({ allowSubnet: true }).source.slice(1, -1);
    patterns.push(ipv4Pattern);
  }
  
  if (!ipv4Only) {
    const ipv6Pattern = generateIpv6Pattern({ allowSubnet: true }).source.slice(1, -1);
    patterns.push(ipv6Pattern);
  }
  
  return new RegExp(`^(?:${patterns.join('|')})$`, 'i');
}

/**
 * Hostname pattern (more restrictive than domain)
 * @param {Object} options - Configuration options
 * @param {boolean} options.allowUnderscore - Allow underscores (default: false)
 * @param {number} options.maxLength - Maximum hostname length (default: 63)
 * @returns {RegExp} Hostname validation pattern
 */
export function generateHostnamePattern(options = {}) {
  const { allowUnderscore = false, maxLength = 63 } = options;
  
  const charSet = allowUnderscore ? '[a-zA-Z0-9_-]' : '[a-zA-Z0-9-]';
  const pattern = `^[a-zA-Z0-9](?:${charSet}{0,${maxLength - 2}}[a-zA-Z0-9])?$`;
  
  return new RegExp(pattern, 'i');
}

// Pre-configured common patterns
export const PATTERNS = {
  // IP addresses
  IPV4: generateIpv4Pattern(),
  IPV4_STRICT: generateIpv4Pattern({ strict: true }),
  IPV4_WITH_SUBNET: generateIpv4Pattern({ allowSubnet: true }),
  IPV4_PUBLIC_ONLY: generateIpv4Pattern({ allowPrivate: false, allowLoopback: false }),
  
  IPV6: generateIpv6Pattern(),
  IPV6_STRICT: generateIpv6Pattern({ allowCompressed: false }),
  IPV6_WITH_SUBNET: generateIpv6Pattern({ allowSubnet: true }),
  
  IP_ANY: generateIpPattern(),
  
  // MAC addresses
  MAC_ADDRESS: generateMacAddressPattern(),
  MAC_ADDRESS_COLON: generateMacAddressPattern({ format: 'colon' }),
  MAC_ADDRESS_HYPHEN: generateMacAddressPattern({ format: 'hyphen' }),
  MAC_ADDRESS_DOT: generateMacAddressPattern({ format: 'dot' }),
  
  // Ports
  PORT: generatePortPattern(),
  PORT_WELL_KNOWN: generatePortPattern({ allowRegistered: false, allowDynamic: false }),
  PORT_REGISTERED: generatePortPattern({ allowWellKnown: false, allowDynamic: false }),
  
  // Domains and URLs
  DOMAIN: generateDomainPattern(),
  HOSTNAME: generateHostnamePattern(),
  URL_HTTP: generateUrlPattern({ protocols: ['http', 'https'] }),
  URL_ANY: generateUrlPattern({ protocols: ['http', 'https', 'ftp', 'ftps', 'ssh', 'telnet'] }),
  
  // Network interfaces
  NETWORK_INTERFACE: generateNetworkInterfacePattern(),
  
  // CIDR
  CIDR: generateCidrPattern(),
  CIDR_IPV4: generateCidrPattern({ ipv4Only: true }),
  CIDR_IPV6: generateCidrPattern({ ipv6Only: true })
};

export default {
  generateIpv4Pattern,
  generateIpv6Pattern,
  generateIpPattern,
  generateMacAddressPattern,
  generatePortPattern,
  generateDomainPattern,
  generateUrlPattern,
  generateNetworkInterfacePattern,
  generateCidrPattern,
  generateHostnamePattern,
  PATTERNS
};