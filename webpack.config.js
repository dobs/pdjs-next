const path = require('path');

module.exports = {
  entry: './src/index.ts',
  devtool: 'source-map',
  output: {
    filename: 'pdjs.js',
    library: 'PagerDuty',
    path: path.resolve(__dirname, 'dist'),
  },
  entry: './src/index.ts',
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
  },
};
