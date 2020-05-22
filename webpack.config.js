const nodeExternals = require('webpack-node-externals')

module.exports = {
  mode: 'production',
  entry: [
    'core-js/stable',
    'regenerator-runtime/runtime',
    './src/bin/chest.js',
  ],
  target: 'node',
  output: {
    filename: 'chest',
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
}
