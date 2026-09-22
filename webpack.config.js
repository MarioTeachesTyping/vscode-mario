//@ts-check
'use strict';

const path = require('path');

// Bundles extension.ts, which runs in Node inside the extension host process.
/** @type {import('webpack').Configuration} */
const extensionConfig =
{
  target: 'node',
  mode: 'none',
  entry: './src/extension/extension.ts',
  output:
  {
    path: path.resolve(__dirname, 'dist'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2',
  },
  externals:
  {
    vscode: 'commonjs vscode',
  },
  resolve:
  {
    extensions: ['.ts', '.js'],
  },
  module:
  {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [{ loader: 'ts-loader' }],
      },
    ],
  },
  devtool: 'source-map',
};

// Bundles panel/main.ts separately, since it runs in the webview's browser context
// and cannot use the Node-only APIs the extension host bundle relies on.
/** @type {import('webpack').Configuration} */
const panelConfig =
{
  target: 'web',
  mode: 'none',
  entry: './src/panel/main.ts',
  output:
  {
    path: path.resolve(__dirname, 'dist'),
    filename: 'panel.js',
  },
  resolve:
  {
    extensions: ['.ts', '.js'],
  },
  module:
  {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [{ loader: 'ts-loader' }],
      },
    ],
  },
  devtool: 'source-map',
};

module.exports = [extensionConfig, panelConfig];
