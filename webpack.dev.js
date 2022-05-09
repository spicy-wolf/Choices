const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

/**
 * @param {*} env from cli "--env"
 */
module.exports = (env) =>
  merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      static: './dist',
    },
    plugins: [
      new webpack.DefinePlugin({
        __USE_FAKE_DB__: JSON.stringify(JSON.parse(env.USE_FAKE_DB || 'false')),
      }),
    ],
  });
