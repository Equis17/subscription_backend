const webpackMerge = require('webpack-merge');
const baseWepackConfig = require('./webpack.config.base');

const webpackConfig = webpackMerge(baseWepackConfig, {
  mode: 'development',
  devtool: 'eval-source-map',
  stats: {children: false}
});

module.exports = webpackConfig;
