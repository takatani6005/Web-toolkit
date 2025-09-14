// lengthHandler.js
export function validateLength(length) {
  // Handle edge cases for length - be very explicit about zero
  if (length === 0 || length === '0') {
    return 0;
  }
  
  // Convert length to valid number
  const numLength = Number(length);
  if (isNaN(numLength) || numLength <= 0) {
    return 10; // default
  }
  
  const validLength = Math.floor(Math.abs(numLength));
  
  // Double check for zero after conversion
  if (validLength === 0) {
    return 0;
  }

  return validLength;
}

export function ensureExactLength(result, targetLength) {
  // Ensure we have exactly the requested length by trimming or padding if necessary
  if (result.length > targetLength) {
    // Trim to exact length (this handles surrogate pairs properly)
    const chars = Array.from(result);
    return chars.slice(0, targetLength).join('');
  } else if (result.length < targetLength) {
    // Pad with basic Latin characters if we're short
    while (result.length < targetLength) {
      const basicCodePoint = Math.floor(Math.random() * 26) + 0x0061; // a-z
      const basicChar = String.fromCodePoint(basicCodePoint);
      if (result.length + basicChar.length <= targetLength) {
        result += basicChar;
      } else {
        break;
      }
    }
  }

  return result;
}
