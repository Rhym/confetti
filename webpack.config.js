const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'confetti.min.js',
    path: path.resolve(__dirname, 'docs')
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader',
          options: {presets: ['env']},
        }],
      },
    ],
  },
};
