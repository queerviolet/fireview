'use strict'
const webpack = require('webpack')
    , {dirname, resolve} = require('path')

const parent = dirname(__dirname)
module.exports = {
  entry: './index.js',
  context: __dirname,
  output: {
    path: resolve(parent, 'dist'),
    filename: 'fireview.js',
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: ['.jsx', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['env', {modules: false}],
              'stage-2',
              'react',
            ],
          }
        }
      }
    ]
  },
  externals: {
    firebase: true,
    'firebase/firestore': true,
    react: true,
  }
}
