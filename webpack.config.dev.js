'use strict';
const path = require('path')
const pascalCase = require('pascal-case')
const webpack = require('webpack')
const failPlugin = require('webpack-fail-plugin')
const pjson = require('./package.json')

const packageName = pjson.name
const filename = packageName.slice(1).split('/').join('-')
const version = pjson.version
const ns = pascalCase(filename) // or specify manually

module.exports = {
  externals: {
    // TODO: list external dependencies, e.g.:
    // lodash: '_'
  },
  devtool: 'inline-source-map',
  entry: {
    [filename]: './src/index'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: `${filename}.js`,
    library: ns,
    libraryTarget: 'var'
  },
  resolve: {
    extensions: ['', '.ts', '.tsx', '.js']
  },
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        include: [
          path.join(__dirname, 'src')
        ]
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin(`${filename}.js version: ${version} generated on: ${new Date().toDateString()}`),
    failPlugin
  ],
  ts: {
    configFileName: 'tsconfig.webpack.json'
  }
}
