'use strict'
const webpack = require('webpack')
    , {resolve} = require('path')

module.exports = {
  entry: './Map.js',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'map.js',
    libraryTarget: 'umd',
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
  resolve: {
      alias: {
        '~': __dirname,
      }
  },
  externals: {
    firebase: true,
    'firebase/firestore': true,
    react: true,
  }
}
