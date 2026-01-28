module.exports = function override(config, env) {
  // Ignore Node.js modules that aren't needed in browser
  config.resolve.fallback = {
    ...config.resolve.fallback,
    fs: false,
    net: false,
    tls: false,
    crypto: false,
    stream: false,
    util: false,
    buffer: false,
    events: false,
    string_decoder: false,
    path: false,
    querystring: false,
    url: false,
    zlib: false,
    http: false,
    https: false,
    assert: false,
    os: false,
  };

  return config;
};