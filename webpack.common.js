const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const resolve = (pathStr) => {
  return path.join(__dirname, pathStr);
};

const DIST_FOLDER = 'dist';
const ASSETS_FOLDER = 'assets';

module.exports = (env) => ({
  mode: 'development',
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, DIST_FOLDER),
    filename: '[name].[contenthash].js',
    clean: true,
    publicPath: process.env.BASE_URL ?? '/',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    alias: {
      '@src': resolve('src'),
      '@public': resolve('public'),
      '@resources': resolve('resources'),
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      __USE_FAKE_DB__: JSON.stringify(JSON.parse(env.USE_FAKE_DB || 'false')),
      __BASE_URL__: JSON.stringify(process.env.BASE_URL ?? ''),
    }),
    new CopyPlugin({
      patterns: [
        {
          from: ASSETS_FOLDER,
          to: '', // default output path
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
  ],
  devServer: {
    historyApiFallback: true,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
});
