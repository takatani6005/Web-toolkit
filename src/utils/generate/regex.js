/**
 * Enhanced Regex Pattern Generation utilities
 * Provides comprehensive regex patterns with caching, composition, and advanced validation
 */


/**
 * Generate single pattern based on type
 * @private
 */
function generateSinglePattern(type, options) {
  const generators = {
    // Basic patterns
    email: generateEmailPattern,
    url: generateUrlPattern,
    phone: generatePhonePattern,
    ipv4: generateIpv4Pattern,
    ipv6: generateIpv6Pattern,
    ip: generateIpPattern,
    
    // Identifiers
    uuid: generateUuidPattern,
    nanoid: generateNanoIdPattern,
    objectid: generateObjectIdPattern,
    ulid: generateUlidPattern,
    
    // Financial
    creditCard: generateCreditCardPattern,
    iban: generateIbanPattern,
    bic: generateBicPattern,
    
    // Colors and media
    hexColor: generateHexColorPattern,
    rgbColor: generateRgbColorPattern,
    hslColor: generateHslColorPattern,
    
    // Security
    password: generatePasswordPattern,
    strongPassword: generateStrongPasswordPattern,
    jwt: generateJwtPattern,
    apiKey: generateApiKeyPattern,
    
    // Date and time
    date: generateDatePattern,
    time: generateTimePattern,
    datetime: generateDateTimePattern,
    iso8601: generateIso8601Pattern,
    
    // Identifiers and codes
    username: generateUsernamePattern,
    postalCode: generatePostalCodePattern,
    socialSecurity: generateSocialSecurityPattern,
    isbn: generateIsbnPattern,
    ean: generateEanPattern,
    
    // Network
    macAddress: generateMacAddressPattern,
    domain: generateDomainPattern,
    subdomain: generateSubdomainPattern,
    
    // Text formatting
    slug: generateSlugPattern,
    hashtag: generateHashtagPattern,
    mention: generateMentionPattern,
    
    // Data formats
    base64: generateBase64Pattern,
    json: generateJsonPattern,
    xml: generateXmlPattern,
    csv: generateCsvPattern,
    
    // Programming
    variable: generateVariablePattern,
    function: generateFunctionPattern,
    className: generateClassNamePattern,
    
    // Custom patterns
    custom: generateCustomPattern,
    template: generateTemplatePattern
  };

  const generator = generators[type];
  if (!generator) {
    const available = Object.keys(generators).sort().join(', ');
    throw new Error(`Pattern type '${type}' not supported. Available: ${available}`);
  }

  return generator(options);
}





