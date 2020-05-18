const webpackMerge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.config.base.js');
const TerserPlugin = require('terser-webpack-plugin');
const webpackConfig = webpackMerge(baseWebpackConfig, {
  mode: 'production',
  stats: {children: false, warnings: false},
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          warnings: false,
          compress: {
            drop_console: false,
            dead_code: true,
            drop_debugger: true
          },
          output: {
            comments: false,
            beautify: false
          },
          mangle: true,
        },
        parallel: true,
        sourceMap: false
      })
    ],
    splitChunks: {
      cacheGroups: {
        commons: {
          name: "commons",
          chunks: "initial",
          minChunks: 3,
          enforce: true //强制
        }
      }
    }
  }
});

module.exports = webpackConfig;
