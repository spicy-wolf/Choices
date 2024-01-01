const { mergeWithRules } = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common.js');

console.info('process.env:', process.env);

const resolve = (pathStr) => {
  return path.join(__dirname, pathStr);
};

module.exports = (env) =>
  mergeWithRules({
    module: {
      rules: {
        test: 'match',
        exclude: 'replace',
      },
    },
  })(common(env), {
    mode: 'production',
  });
