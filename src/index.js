import {decodeLite, encodeLite} from "./lite"
import {decodeHtml, encodeHtml} from "./core"
import {encodeHtmlMinimal, encodeHtmlAttribute, escapeHtml, unescapeHtml} from "./convenience"
import {sanitizeHtml, stripEntities, isSafeHtml} from "./security"
import {isValidCodePoint, toSafeDisplay, escapeForRegex} from "./utils"
import {hasEntities, findEntities, validateEntities, normalizeEntities, countEntities, listUniqueEntities, getEntityStats,searchEntities} from "./analysis"
// Main export object

module.exports = {
  core: { decodeHtml, encodeHtml },
  lite: { decodeLite, encodeLite },
  convenience: { encodeHtmlMinimal, encodeHtmlAttribute, escapeHtml, unescapeHtml },
  analysis: { hasEntities, findEntities, validateEntities, normalizeEntities,
              countEntities, listUniqueEntities, getEntityStats, searchEntities },
  security: { sanitizeHtml, stripEntities, isSafeHtml },
  utils: { isValidCodePoint, toSafeDisplay, escapeForRegex }
};
