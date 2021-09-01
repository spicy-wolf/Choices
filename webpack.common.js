const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const resolve = (pathStr) => {
  return path.join(__dirname, pathStr);
};

const DIST_FOLDER = 'dist';
const PUBLIC_FOLDER = 'public';

module.exports = {
  mode: 'development',
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, DIST_FOLDER),
    filename: 'bundle.js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@src': resolve('src'),
      '@public': resolve('public'),
    },
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: PUBLIC_FOLDER,
          to: '', // default output path
        },
      ],
    }),
  ],
};
