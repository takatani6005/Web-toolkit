export interface DecodeOptions {
  strict?: boolean;
  attributeMode?: boolean;
}

export interface EncodeOptions {
  useNamedEntities?: boolean;
  encodeEverything?: boolean;
  allowUnsafeSymbols?: boolean;
  level?: 'html4' | 'html5' | 'xml';
  decimal?: boolean;
}

export interface AttributeEncodeOptions {
  double?: boolean;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  validEntities: string[];
  invalidEntities: string[];
  totalEntities: number;
}

export function decodeHtml(str: string, options?: DecodeOptions): string;
export function encodeHtml(str: string, options?: EncodeOptions): string;
export function encodeHtmlMinimal(str: string): string;
export function encodeHtmlAttribute(str: string, options?: AttributeEncodeOptions): string;
export function escapeHtml(str: string): string;
export function unescapeHtml(str: string): string;
export function hasEntities(str: string): boolean;
export function findEntities(str: string): string[];
export function validateEntities(str: string): ValidationResult;
export function normalizeEntities(str: string, options?: EncodeOptions): string;
export function isValidCodePoint(codePoint: number): boolean;
export function toSafeDisplay(str: string): string;

// Legacy aliases
export const decode: typeof decodeHtml;
export const encode: typeof encodeHtml;