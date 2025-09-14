// Transliteration maps for various scripts
const transliterationMaps = {
  // Cyrillic to Latin
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh',
  'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
  'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts',
  'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
  'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'E', 'Ж': 'Zh',
  'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O',
  'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'H', 'Ц': 'Ts',
  'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sch', 'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya',
  
  // Greek to Latin
  'α': 'a', 'β': 'b', 'γ': 'g', 'δ': 'd', 'ε': 'e', 'ζ': 'z', 'η': 'e', 'θ': 'th',
  'ι': 'i', 'κ': 'k', 'λ': 'l', 'μ': 'm', 'ν': 'n', 'ξ': 'x', 'ο': 'o', 'π': 'p',
  'ρ': 'r', 'σ': 's', 'ς': 's', 'τ': 't', 'υ': 'u', 'φ': 'f', 'χ': 'ch', 'ψ': 'ps', 'ω': 'o',
  'Α': 'A', 'Β': 'B', 'Γ': 'G', 'Δ': 'D', 'Ε': 'E', 'Ζ': 'Z', 'Η': 'E', 'Θ': 'Th',
  'Ι': 'I', 'Κ': 'K', 'Λ': 'L', 'Μ': 'M', 'Ν': 'N', 'Ξ': 'X', 'Ο': 'O', 'Π': 'P',
  'Ρ': 'R', 'Σ': 'S', 'Τ': 'T', 'Υ': 'U', 'Φ': 'F', 'Χ': 'Ch', 'Ψ': 'Ps', 'Ω': 'O',
  'ά': 'a', 'έ': 'e', 'ή': 'e', 'ί': 'i', 'ό': 'o', 'ύ': 'u', 'ώ': 'o',
  
  // Extended Latin characters
  'ß': 'ss', 'ł': 'l', 'Ł': 'L', 'ø': 'o', 'Ø': 'O', 'đ': 'd', 'Đ': 'D',
  'ħ': 'h', 'Ħ': 'H', 'ŧ': 't', 'Ŧ': 'T', 'ð': 'd', 'Ð': 'D', 'þ': 'th', 'Þ': 'Th',
  
  // Arabic (basic transliteration)
  'ا': 'a', 'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j', 'ح': 'h', 'خ': 'kh', 'د': 'd',
  'ذ': 'dh', 'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'd', 'ط': 't',
  'ظ': 'z', 'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q', 'ك': 'k', 'ل': 'l', 'م': 'm',
  'ن': 'n', 'ه': 'h', 'و': 'w', 'ي': 'y', 'ة': 'h', 'ى': 'a', 'ء': 'a',
  
  // Hebrew (basic transliteration)
  'א': 'a', 'ב': 'b', 'ג': 'g', 'ד': 'd', 'ה': 'h', 'ו': 'w', 'ז': 'z', 'ח': 'h',
  'ט': 't', 'י': 'y', 'כ': 'k', 'ל': 'l', 'מ': 'm', 'נ': 'n', 'ס': 's', 'ע': 'a',
  'פ': 'p', 'צ': 'ts', 'ק': 'q', 'ר': 'r', 'ש': 'sh', 'ת': 't', 'ף': 'f', 'ך': 'k',
  'ם': 'm', 'ן': 'n', 'ץ': 'ts',
  
  // Chinese pinyin (basic common characters)
  '你': 'ni', '好': 'hao', '世': 'shi', '界': 'jie', '中': 'zhong', '国': 'guo',
  '人': 'ren', '大': 'da', '小': 'xiao', '天': 'tian', '地': 'di', '上': 'shang',
  '下': 'xia', '左': 'zuo', '右': 'you', '前': 'qian', '后': 'hou', '里': 'li',
  '外': 'wai', '东': 'dong', '西': 'xi', '南': 'nan', '北': 'bei',
  
  // Japanese hiragana/katakana (basic)
  'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
  'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
  'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
  'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
  'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
  'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
  'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
  'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
  'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
  'わ': 'wa', 'を': 'wo', 'ん': 'n',
  
  // Korean (basic)
  '안': 'an', '녕': 'nyeong', '하': 'ha', '세': 'se', '요': 'yo',
  '감': 'gam', '사': 'sa', '합': 'hab', '니': 'ni', '다': 'da'
};

// Full phrase mappings (processed before character-by-character transliteration)
const fullPhrases = {
  'こんにちは': 'konnichiwa',
  '안녕하세요': 'annyeonghaseyo'
};

/**
 * Transliterate non-Latin scripts to Latin equivalents
 * @param {string} str - Input string to transliterate
 * @returns {string} Transliterated string
 */
export function transliterate(str) {
  if (!str) return str;
  
  // Handle full word/phrase mappings first
  for (const [phrase, replacement] of Object.entries(fullPhrases)) {
    str = str.replace(new RegExp(phrase, 'g'), replacement);
  }
  
  // Then transliterate character by character
  let result = '';
  
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    
    if (transliterationMaps[char]) {
      const replacement = transliterationMaps[char];
      result += replacement;
      
      // Add space after CJK characters if there's another translatable character coming
      const nextChar = str[i + 1];
      if (nextChar && transliterationMaps[nextChar] && 
          /[\u4e00-\u9fff\u3400-\u4dbf]/.test(char)) {
        result += ' ';
      }
    } else {
      result += char;
    }
  }
  
  return result;
}

/**
 * Add a new transliteration mapping
 * @param {string} char - Character to map from
 * @param {string} replacement - Replacement string
 */
export function addTransliterationMapping(char, replacement) {
  transliterationMaps[char] = replacement;
}

/**
 * Add multiple transliteration mappings
 * @param {Object} mappings - Object with character->replacement mappings
 */
export function addTransliterationMappings(mappings) {
  Object.assign(transliterationMaps, mappings);
}

/**
 * Get all current transliteration mappings (read-only)
 * @returns {Object} Copy of transliteration mappings
 */
export function getTransliterationMappings() {
  return { ...transliterationMaps };
}