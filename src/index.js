import {decodeLite, encodeLite} from "./core/lite"
import {decodeHtml, encodeHtml} from "./core/core"
import {encodeHtmlMinimal, encodeHtmlAttribute, escapeHtml, unescapeHtml} from "./convenience"
import {sanitizeHtml, stripEntities, isSafeHtml} from "./security/base_security"
import {isValidCodePoint, toSafeDisplay, escapeForRegex} from "./utils"
import {hasEntities, findEntities, validateEntities, normalizeEntities, countEntities, listUniqueEntities, getEntityStats,searchEntities,quickEncode} from "./analysis"
import {autoEscape, encodeHtmlText, encodeHtmlJsString, encodeHtmlUrlParam, encodeArray, decodeArray, stripHtmlTags, truncateHtmlSafe, balanceHtmlTags, encodeObjectValues, decodeObjectValues, deepEncode, deepDecode, decodeHtmlLazy, escapeCss, encodeMap, decodeMap} from "./convenience"

// Main export object
