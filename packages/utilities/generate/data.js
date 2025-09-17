/**
 * Data Generation utilities
 * Provides placeholder text generation and test data creation
 */

/**
 * Generate placeholder text (Lorem Ipsum style)
 * @param {Object} [options={}] - Configuration options
 * @param {string} [options.type='text'] - Type of placeholder ('text', 'words', 'sentences', 'paragraphs', 'html')
 * @param {number} [options.length=50] - Length for word-based generation
 * @param {number} [options.sentences=3] - Number of sentences per paragraph
 * @param {number} [options.paragraphs=1] - Number of paragraphs
 * @param {boolean} [options.includeHtml=false] - Wrap paragraphs in HTML tags
 * @param {boolean} [options.startWithLorem=true] - Start with "Lorem ipsum"
 * @param {string[]} [options.customWords] - Custom word list to use instead of Lorem Ipsum
 * @returns {string} Generated placeholder text
 */
function generatePlaceholder(options = {}) {
  const {
    type = 'text',
    length = 50,
    sentences = 3,
    paragraphs = 1,
    includeHtml = false,
    startWithLorem = true,
    customWords
  } = options;

  // Validate parameters
  if (typeof length !== 'number' || length < 0) {
    throw new Error('Length must be a non-negative number');
  }
  if (typeof sentences !== 'number' || sentences < 1) {
    throw new Error('Sentences must be a positive number');
  }
  if (typeof paragraphs !== 'number' || paragraphs < 1) {
    throw new Error('Paragraphs must be a positive number');
  }

  // Validate type
  const validTypes = ['text', 'words', 'sentences', 'paragraphs', 'html'];
  if (!validTypes.includes(type)) {
    throw new Error(`Invalid placeholder type '${type}'. Valid types are not supported for this type.`);
  }
  
  const defaultWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'mauris', 'blandit',
    'aliquet', 'at', 'volutpat', 'diam', 'sollicitudin', 'tempor', 'commodo',
    'ullamcorper', 'a', 'lacinia', 'quis', 'pellentesque', 'habitant', 'morbi',
    'tristique', 'senectus', 'netus', 'malesuada', 'fames', 'ac', 'turpis', 'egestas'
  ];

  const words = customWords || defaultWords;
  
  function generateSentence(wordCount = 8 + Math.floor(Math.random() * 8), isFirst = false) {
    const sentence = [];
    let startIdx = 0;
    
    if (isFirst && startWithLorem && !customWords) {
      sentence.push('Lorem', 'ipsum');
      startIdx = 2;
    }
    
    for (let i = startIdx; i < wordCount; i++) {
      sentence.push(words[Math.floor(Math.random() * words.length)]);
    }
    
    const text = sentence.join(' ');
    return text.charAt(0).toUpperCase() + text.slice(1) + '.';
  }
  
  function generateParagraph(sentenceCount, isFirst = false) {
    const sentences = [];
    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(generateSentence(undefined, i === 0 && isFirst));
    }
    return sentences.join(' ');
  }
  
  switch (type) {
    case 'words':
      if (length === 0) return '';
      const wordList = [];
      if (startWithLorem && !customWords && length >= 2) {
        wordList.push('lorem', 'ipsum');
        for (let i = 2; i < length; i++) {
          wordList.push(words[Math.floor(Math.random() * words.length)]);
        }
      } else {
        for (let i = 0; i < length; i++) {
          wordList.push(words[Math.floor(Math.random() * words.length)]);
        }
      }
      return wordList.join(' ');
    
    case 'sentences':
      const sentenceList = [];
      for (let i = 0; i < length; i++) {
        sentenceList.push(generateSentence(undefined, i === 0));
      }
      return sentenceList.join(' ');
    
    case 'paragraphs':
      const paras = Array.from({length: paragraphs}, (_, i) => 
        generateParagraph(sentences, i === 0)
      );
      if (includeHtml) {
        return paras.map(p => `<p>${p}</p>`).join('\n');
      }
      return paras.join('\n\n');
    
    case 'html':
      const htmlPara = generateParagraph(sentences, true);
      return `<div class="placeholder">\n  <p>${htmlPara}</p>\n</div>`;
    
    case 'text':
    default:
      return generateParagraph(sentences, true);
  }
}

/**
 * Generate various types of test data
 * @param {string} type - Type of test data to generate
 * @param {number} [count] - Number of items to generate (if omitted, returns single item)
 * @param {Object} [options={}] - Additional options
 * @returns {string|string[]} Generated test data
 */
function generateTestData(type, count, options = {}) {
  // Validate inputs - handle all edge cases
  if (type === null || type === undefined) {
    throw new Error('Type is not supported. Must be a non-empty string');
  }
  
  if (typeof type !== 'string') {
    throw new Error('Type is not supported. Must be a non-empty string');
  }
  
  if (!type.trim()) {
    throw new Error('Type is not supported. Must be a non-empty string');
  }

  // If count is not provided, return single item
  const returnSingle = count === undefined;
  
  // Default count to 1 if not provided
  if (count === undefined) count = 1;

  if (typeof count !== 'number' || count < 0 || !Number.isInteger(count)) {
    throw new Error('Count must be a non-negative integer');
  }

  // Validate type first, before trying to use it
  const supportedTypes = ['email', 'url', 'phone', 'name', 'date', 'time', 'datetime', 'color', 'number', 'boolean', 'json', 'csv', 'username', 'company', 'product', 'sentence', 'paragraph'];
  
  if (!supportedTypes.includes(type)) {
    throw new Error(`Test data type '${type}' is not supported. Available types: ${supportedTypes.join(', ')}`);
  }

  const generators = {
    email: generateEmail,
    url: generateUrl,
    phone: generatePhone,
    name: generateName,
    date: generateDate,
    time: generateTime,
    datetime: generateDateTime,
    color: generateColor,
    number: generateNumber,
    boolean: generateBoolean,
    json: generateJson,
    csv: generateCsv,
    username: generateUsername,
    company: generateCompany,
    product: generateProduct,
    sentence: generateSentence,
    paragraph: generateParagraphData
  };
  
  const generator = generators[type];

  if (count === 0) {
    return [];
  }
  
  // If count was not explicitly provided, return single item
  if (returnSingle) {
    return generator(options);
  }
  
  // If count was explicitly provided (even if 1), return array
  return Array.from({length: count}, () => generator(options));
}

/**
 * Generate fake email addresses
 * @private
 */
function generateEmail(options = {}) {
  const { domain, tld } = options;
  const domains = domain ? [domain] : ['example.com', 'test.org', 'demo.net', 'sample.co', 'mock.io'];
  const names = ['john', 'jane', 'bob', 'alice', 'charlie', 'diana', 'alex', 'sam', 'taylor', 'morgan'];
  const suffixes = ['', '.dev', '.test', '2024', '123', '.work'];
  
  const name = names[Math.floor(Math.random() * names.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  const selectedDomain = domains[Math.floor(Math.random() * domains.length)];
  
  return `${name}${suffix}@${selectedDomain}`;
}

/**
 * Generate fake URLs
 * @private
 */
function generateUrl(options = {}) {
  const { protocol, secure = false } = options;
  const protocols = protocol ? [protocol] : (secure ? ['https'] : ['http', 'https']);
  const domains = ['example.com', 'test.org', 'demo.net', 'sample.co', 'mock.dev'];
  const paths = ['', '/page', '/about', '/contact', '/products', '/services', '/blog', '/docs'];
  const queries = ['', '?id=123', '?page=1', '?sort=name', '?filter=active'];
  
  const selectedProtocol = protocols[Math.floor(Math.random() * protocols.length)];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  const path = paths[Math.floor(Math.random() * paths.length)];
  const query = queries[Math.floor(Math.random() * queries.length)];
  
  return `${selectedProtocol}://${domain}${path}${query}`;
}

/**
 * Generate fake phone numbers
 * @private
 */
function generatePhone(options = {}) {
  const { format = 'us', includeCountryCode = false } = options;
  
  const formats = {
    us: [
      () => `${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
      () => `(${Math.floor(Math.random() * 900 + 100)}) ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
      () => `${Math.floor(Math.random() * 900 + 100)}.${Math.floor(Math.random() * 900 + 100)}.${Math.floor(Math.random() * 9000 + 1000)}`
    ],
    international: [
      () => `+${Math.floor(Math.random() * 90 + 10)}-${Math.floor(Math.random() * 9000000000 + 1000000000)}`
    ]
  };
  
  const formatters = formats[format] || formats.us;
  const phone = formatters[Math.floor(Math.random() * formatters.length)]();
  
  return includeCountryCode && !phone.startsWith('+') ? `+1-${phone}` : phone;
}

/**
 * Generate fake names
 * @private
 */
function generateName(options = {}) {
  const { type = 'full', gender } = options;
  
  const firstNames = {
    male: ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald'],
    female: ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Lisa', 'Nancy', 'Betty', 'Dorothy', 'Sandra'],
    neutral: ['Alex', 'Taylor', 'Jordan', 'Casey', 'Riley', 'Avery', 'Quinn', 'Sage', 'River', 'Phoenix']
  };
  
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright'];
  
  let firstNameList = firstNames.neutral;
  if (gender === 'male') firstNameList = [...firstNames.male, ...firstNames.neutral];
  if (gender === 'female') firstNameList = [...firstNames.female, ...firstNames.neutral];
  if (!gender) firstNameList = [...firstNames.male, ...firstNames.female, ...firstNames.neutral];
  
  const firstName = firstNameList[Math.floor(Math.random() * firstNameList.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  switch (type) {
    case 'first': return firstName;
    case 'last': return lastName;
    case 'full': return `${firstName} ${lastName}`;
    default: return `${firstName} ${lastName}`;
  }
}

/**
 * Generate fake addresses
 * @private
 */
function generateAddress(options = {}) {
  const { format = 'full', country = 'US' } = options;
  
  const streetNumbers = () => Math.floor(Math.random() * 9999 + 1);
  const streetNames = ['Main St', 'Oak Ave', 'Park Rd', 'First St', 'Second Ave', 'Elm St', 'Washington St', 'Maple Ave'];
  const cities = ['Springfield', 'Franklin', 'Georgetown', 'Clinton', 'Riverside', 'Madison', 'Chester', 'Marion'];
  const states = ['CA', 'TX', 'FL', 'NY', 'PA', 'IL', 'OH', 'GA', 'NC', 'MI'];
  const zipCodes = () => Math.floor(Math.random() * 90000 + 10000);
  
  const street = `${streetNumbers()} ${streetNames[Math.floor(Math.random() * streetNames.length)]}`;
  const city = cities[Math.floor(Math.random() * cities.length)];
  const state = states[Math.floor(Math.random() * states.length)];
  const zip = zipCodes();
  
  switch (format) {
    case 'street': return street;
    case 'city': return city;
    case 'state': return state;
    case 'zip': return zip.toString();
    case 'full': return `${street}, ${city}, ${state} ${zip}`;
    default: return `${street}, ${city}, ${state} ${zip}`;
  }
}

/**
 * Generate fake dates
 * @private
 */
function generateDate(options = {}) {
  const { 
    format = 'iso',
    minDate = new Date(2020, 0, 1),
    maxDate = new Date(),
    future = false
  } = options;
  
  const min = future ? new Date() : minDate;
  const max = future ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) : maxDate;
  
  const date = new Date(min.getTime() + Math.random() * (max.getTime() - min.getTime()));
  
  switch (format) {
    case 'iso': return date.toISOString().split('T')[0];
    case 'us': return date.toLocaleDateString('en-US');
    case 'eu': return date.toLocaleDateString('en-GB');
    case 'timestamp': return date.getTime();
    case 'object': return date;
    default: return date.toISOString().split('T')[0];
  }
}

/**
 * Generate fake times
 * @private
 */
function generateTime(options = {}) {
  const { format = '24h', includeSeconds = false } = options;
  
  const hours24 = Math.floor(Math.random() * 24);
  const hours12 = hours24 === 0 ? 12 : (hours24 > 12 ? hours24 - 12 : hours24);
  const minutes = Math.floor(Math.random() * 60);
  const seconds = Math.floor(Math.random() * 60);
  const ampm = hours24 < 12 ? 'AM' : 'PM';
  
  const pad = (n) => n.toString().padStart(2, '0');
  
  switch (format) {
    case '24h':
      return includeSeconds ? `${pad(hours24)}:${pad(minutes)}:${pad(seconds)}` : `${pad(hours24)}:${pad(minutes)}`;
    case '12h':
      return includeSeconds ? `${hours12}:${pad(minutes)}:${pad(seconds)} ${ampm}` : `${hours12}:${pad(minutes)} ${ampm}`;
    default:
      return includeSeconds ? `${pad(hours24)}:${pad(minutes)}:${pad(seconds)}` : `${pad(hours24)}:${pad(minutes)}`;
  }
}

/**
 * Generate fake datetimes
 * @private
 */
function generateDateTime(options = {}) {
  const date = generateDate(options);
  const time = generateTime(options);
  return `${date} ${time}`;
}

/**
 * Generate fake colors
 * @private
 */
function generateColor(options = {}) {
  const { format = 'hex', palette } = options;
  
  if (palette) {
    const palettes = {
      pastel: ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFBA', '#BAE1FF'],
      vibrant: ['#FF5733', '#33FF57', '#3357FF', '#FF33F1', '#33FFF1'],
      earth: ['#8B4513', '#D2691E', '#CD853F', '#F4A460', '#DEB887'],
      ocean: ['#006994', '#0085C3', '#00A6FB', '#7FB3D3', '#B8E0D2']
    };
    
    const colors = palettes[palette] || palettes.vibrant;
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  switch (format) {
    case 'hex':
      return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
    case 'rgb':
      return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    case 'hsl':
      return `hsl(${Math.floor(Math.random() * 360)}, ${Math.floor(Math.random() * 101)}%, ${Math.floor(Math.random() * 101)}%)`;
    default:
      return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
  }
}

/**
 * Generate fake numbers
 * @private
 */
function generateNumber(options = {}) {
  const { min = 0, max = 100, decimals = 0, type = 'random' } = options;
  
  let num;
  
  switch (type) {
    case 'random':
      num = Math.random() * (max - min) + min;
      break;
    case 'integer':
      return Math.floor(Math.random() * (max - min + 1)) + min;
    case 'positive':
      num = Math.random() * Math.abs(max) + Math.abs(min);
      break;
    case 'negative':
      num = -(Math.random() * Math.abs(max) + Math.abs(min));
      break;
    default:
      num = Math.random() * (max - min) + min;
  }
  
  return decimals > 0 ? parseFloat(num.toFixed(decimals)) : Math.round(num);
}

/**
 * Generate fake booleans
 * @private
 */
function generateBoolean(options = {}) {
  const { probability = 0.5 } = options;
  return Math.random() < probability;
}

/**
 * Generate fake JSON objects
 * @private
 */
function generateJson(options = {}) {
  const { 
    fields = ['id', 'name', 'email', 'active'],
    depth = 1,
    arrayLength = 3
  } = options;
  
  const obj = {};
  
  for (const field of fields) {
    switch (field) {
      case 'id':
        obj.id = Math.floor(Math.random() * 10000);
        break;
      case 'name':
        obj.name = generateName();
        break;
      case 'email':
        obj.email = generateEmail();
        break;
      case 'active':
        obj.active = generateBoolean();
        break;
      case 'date':
        obj.date = generateDate();
        break;
      case 'phone':
        obj.phone = generatePhone();
        break;
      case 'address':
        obj.address = generateAddress();
        break;
      case 'tags':
        obj.tags = Array.from({length: arrayLength}, () => 
          ['important', 'urgent', 'completed', 'pending', 'archived'][Math.floor(Math.random() * 5)]
        );
        break;
      default:
        obj[field] = `sample_${field}_${Math.floor(Math.random() * 1000)}`;
    }
  }
  
  if (depth > 1) {
    obj.nested = generateJson({...options, depth: depth - 1});
  }
  
  return obj;
}

/**
 * Generate fake CSV data
 * @private
 */
function generateCsv(options = {}) {
  const {
    headers = ['id', 'name', 'email', 'phone'],
    rows = 5,
    includeHeaders = true
  } = options;
  
  const csvRows = [];
  
  if (includeHeaders) {
    csvRows.push(headers.join(','));
  }
  
  for (let i = 0; i < rows; i++) {
    const row = headers.map(header => {
      switch (header.toLowerCase()) {
        case 'id': return i + 1;
        case 'name': return `"${generateName()}"`;
        case 'email': return generateEmail();
        case 'phone': return `"${generatePhone()}"`;
        case 'date': return generateDate();
        case 'active': return generateBoolean();
        default: return `sample_${header}_${i + 1}`;
      }
    });
    csvRows.push(row.join(','));
  }
  
  return csvRows.join('\n');
}

/**
 * Generate fake usernames
 * @private
 */
function generateUsername(options = {}) {
  const { style = 'mixed', includeNumbers = true } = options;
  
  const adjectives = ['cool', 'smart', 'quick', 'brave', 'happy', 'bright', 'swift', 'bold'];
  const nouns = ['cat', 'dog', 'bird', 'fish', 'lion', 'wolf', 'bear', 'fox'];
  const numbers = includeNumbers ? Math.floor(Math.random() * 1000) : '';
  
  switch (style) {
    case 'adjective_noun':
      return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${numbers}`;
    case 'noun_numbers':
      return `${nouns[Math.floor(Math.random() * nouns.length)]}${numbers || Math.floor(Math.random() * 10000)}`;
    case 'mixed':
    default:
      const patterns = [
        () => `${adjectives[Math.floor(Math.random() * adjectives.length)]}${numbers}`,
        () => `${nouns[Math.floor(Math.random() * nouns.length)]}${numbers}`,
        () => `${adjectives[Math.floor(Math.random() * adjectives.length)]}_${nouns[Math.floor(Math.random() * nouns.length)]}${numbers}`
      ];
      return patterns[Math.floor(Math.random() * patterns.length)]();
  }
}

/**
 * Generate fake company names
 * @private
 */
function generateCompany(options = {}) {
  const { type = 'full' } = options;
  
  const prefixes = ['Global', 'United', 'International', 'Advanced', 'Premier', 'Elite', 'Dynamic', 'Innovative'];
  const words = ['Systems', 'Solutions', 'Technologies', 'Industries', 'Enterprises', 'Corporation', 'Group', 'Associates'];
  const suffixes = ['Inc', 'LLC', 'Corp', 'Ltd', 'Co'];
  
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const word = words[Math.floor(Math.random() * words.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  
  switch (type) {
    case 'name': return `${prefix} ${word}`;
    case 'full': return `${prefix} ${word}, ${suffix}.`;
    case 'short': return `${word} ${suffix}`;
    default: return `${prefix} ${word}, ${suffix}.`;
  }
}

/**
 * Generate fake product names
 * @private
 */
function generateProduct(options = {}) {
  const { category = 'general' } = options;
  
  const categories = {
    general: {
      adjectives: ['Premium', 'Deluxe', 'Professional', 'Advanced', 'Ultimate', 'Smart', 'Modern', 'Classic'],
      nouns: ['Widget', 'Gadget', 'Device', 'Tool', 'System', 'Solution', 'Product', 'Item']
    },
    tech: {
      adjectives: ['Smart', 'Digital', 'Cloud', 'AI-Powered', 'Next-Gen', 'Quantum', 'Nano', 'Ultra'],
      nouns: ['Processor', 'Scanner', 'Monitor', 'Drive', 'Router', 'Hub', 'Terminal', 'Interface']
    },
    fashion: {
      adjectives: ['Stylish', 'Elegant', 'Trendy', 'Vintage', 'Modern', 'Classic', 'Luxury', 'Designer'],
      nouns: ['Jacket', 'Shoes', 'Bag', 'Watch', 'Dress', 'Shirt', 'Pants', 'Accessory']
    }
  };
  
  const cat = categories[category] || categories.general;
  const adjective = cat.adjectives[Math.floor(Math.random() * cat.adjectives.length)];
  const noun = cat.nouns[Math.floor(Math.random() * cat.nouns.length)];
  
  return `${adjective} ${noun}`;
}

/**
 * Generate fake sentences
 * @private
 */
function generateSentence(options = {}) {
  const { length = 'medium', topic } = options;
  
  const lengths = {
    short: [5, 8],
    medium: [8, 15],
    long: [15, 25]
  };
  
  const [min, max] = lengths[length] || lengths.medium;
  const wordCount = Math.floor(Math.random() * (max - min + 1)) + min;
  
  return generatePlaceholder({
    type: 'words',
    length: wordCount,
    startWithLorem: false,
    customWords: topic ? getTopicWords(topic) : undefined
  }) + '.';
}

/**
 * Generate fake paragraphs for data generation
 * @private
 */
function generateParagraphData(options = {}) {
  const { sentences = 4, topic } = options;
  
  return generatePlaceholder({
    type: 'sentences',
    length: sentences,
    startWithLorem: false,
    customWords: topic ? getTopicWords(topic) : undefined
  });
}

/**
 * Get topic-specific words
 * @private
 */
function getTopicWords(topic) {
  const topics = {
    business: ['strategy', 'management', 'revenue', 'profit', 'client', 'market', 'growth', 'innovation', 'leadership', 'efficiency'],
    technology: ['software', 'algorithm', 'database', 'server', 'network', 'security', 'development', 'system', 'interface', 'protocol'],
    science: ['research', 'experiment', 'hypothesis', 'analysis', 'data', 'methodology', 'observation', 'theory', 'discovery', 'investigation']
  };
  
  return topics[topic] || null;
}

export {
  generatePlaceholder,
  generateTestData
};