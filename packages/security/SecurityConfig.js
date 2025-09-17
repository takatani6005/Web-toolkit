// src/security/SecurityConfig.js

import fs from 'fs';

// Configuration loader
export class SecurityConfig {
  constructor(configPath = null) {
    this.config = this.loadConfig(configPath);
  }

  loadConfig(configPath) {
    const defaultConfig = {
      whitelist: {
        tags: ['p', 'br', 'strong', 'em', 'u', 'i', 'b', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
        attributes: ['class', 'id', 'title', 'alt', 'href', 'src', 'width', 'height'],
        protocols: ['http:', 'https:', 'mailto:', 'ftp:']
      },
      blacklist: {
        tags: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'textarea', 'select', 'option'],
        attributes: ['onclick', 'onload', 'onerror', 'onmouseover', 'onfocus', 'onblur', 'onchange', 'onsubmit'],
        protocols: ['javascript:', 'data:', 'vbscript:', 'file:', 'about:']
      },
      strictMode: {
        tags: ['p', 'br', 'strong', 'em'],
        attributes: ['class'],
        protocols: ['https:']
      },
      entities: {
        basic: ['&amp;', '&lt;', '&gt;', '&quot;', '&#x27;', '&apos;'],
        dangerous: ['&lt;script', '&lt;iframe', '&lt;object']
      }
    };

    if (configPath && fs.existsSync(configPath)) {
      try {
        const userConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        return this.mergeConfigs(defaultConfig, userConfig);
      } catch (error) {
        console.warn(`Failed to load config from ${configPath}, using defaults`);
        return defaultConfig;
      }
    }

    return defaultConfig;
  }

  mergeConfigs(defaultConfig, userConfig) {
    const merged = JSON.parse(JSON.stringify(defaultConfig));
    
    Object.keys(userConfig).forEach(key => {
      if (typeof userConfig[key] === 'object' && !Array.isArray(userConfig[key])) {
        merged[key] = { ...merged[key], ...userConfig[key] };
      } else {
        merged[key] = userConfig[key];
      }
    });

    return merged;
  }

  getWhitelist(type) {
    return this.config.whitelist[type] || [];
  }

  getBlacklist(type) {
    return this.config.blacklist[type] || [];
  }

  getStrictMode(type) {
    return this.config.strictMode[type] || [];
  }
}