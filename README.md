# html-entities-lite

A lightweight library to **encode** and **decode** HTML entities.  
It is built from a single `entities.json` dataset and auto-generates both decode and encode maps.  

---

## ✨ Features
- 🔄 Decode **named entities** (e.g. `&copy; → ©`)
- 🔢 Decode **numeric entities**:
  - Decimal: `&#169; → ©`
  - Hex: `&#x00A9; → ©`
- ⏩ Encode characters back to their HTML entity form
- 🪶 Lightweight:
  - `lite` map (5 core entities: `& < > " '`)
  - `full` map (all HTML5 entities)

---

## 📦 Installation

```bash
npm install html-entities-lite

🚀 Usage

const { encodeHtml, decodeHtml } = require('html-entities-lite');

// Decode entities
console.log(decodeHtml('5 &lt; 10 &amp; &copy; &infin; &#198; &#x00C6;'));
// Output: 5 < 10 & © ∞ Æ Æ

// Encode characters
console.log(encodeHtml('Æ < © ∞'));
// Output: &AElig; &lt; &copy; &infin;

🗂 Project structure
html-entities-lite/
├─ data/
│  ├─ entities.json         # master dataset (entity → { codepoints, characters })
│  ├─ decode-map.json       # generated entity → character map
│  ├─ encode-map-full.json  # generated character → entity map
│  └─ encode-map-lite.json  # minimal map (& < > " ')
├─ src/
│  └─ index.js              # main API (encodeHtml, decodeHtml)
├─ scripts/
│  └─ build-encode-map.js   # build maps from entities.json
├─ test/
│  └─ decode.test.js        # basic tests
├─ package.json
└─ README.md

## 📖 License

This project is licensed under the MIT License – see the [LICENSE](./LICENSE) file for details.
