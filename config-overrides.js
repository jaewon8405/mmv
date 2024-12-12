const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.fallback = {
    buffer: require.resolve("buffer/"),
    process: require.resolve("process/browser"),
    crypto: require.resolve("crypto-browserify"),
    path: require.resolve("path-browserify"),
    stream: require.resolve("stream-browserify"), // stream 모듈 추가
    vm: require.resolve("vm-browserify"),         // vm 모듈 추가
    fs: false,
  };

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
  ]);

  return config;
};
