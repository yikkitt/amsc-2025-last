/**
 * Module resolution helper for the Next.js application
 * This script is used to help with module resolution in Webpack 5
 */

// Define the modules that need to be mocked or shimmed
const nodeBuiltins = {
  fs: false,
  path: false,
  os: false,
  crypto: false,
  stream: false,
  buffer: false,
  http: false,
  https: false,
  zlib: false,
  util: false,
  net: false,
  tls: false,
  child_process: false,
};

/**
 * Get the fallback configuration for Webpack 5
 * @returns {Object} The fallback configuration
 */
function getWebpackFallback() {
  return nodeBuiltins;
}

/**
 * Get the browser configuration for package.json
 * @returns {Object} The browser configuration
 */
function getBrowserConfig() {
  return nodeBuiltins;
}

/**
 * Configure webpack with node polyfills
 * @param {Object} config - Webpack configuration
 * @param {boolean} isServer - Whether this is server-side rendering
 * @returns {Object} Updated webpack configuration
 */
function configureWebpack(config, { isServer }) {
  // Only apply polyfills in the browser environment
  if (!isServer) {
    // Remove any existing node configuration to avoid webpack warnings
    if (config.node) {
      delete config.node;
    }

    // Use resolve.fallback for browser polyfills
    config.resolve.fallback = {
      ...config.resolve.fallback,
      ...nodeBuiltins
    };
  }
  
  return config;
}

module.exports = {
  getWebpackFallback,
  getBrowserConfig,
  configureWebpack,
  nodeBuiltins
}; 