const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const ZipPlugin = require('zip-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

// module.exports is a function so webpack can pass --env flags at build time.
// Running `npm run build` produces the normal release zip.
// Running `npm run build:test` passes env.test=true, which:
//   - appends "-test" to the zip filename and extension display name
//   - changes the addon ID so Firefox installs it alongside the release version
//     rather than replacing it. Source files (manifest.json, locale) are never
//     modified; the patching happens in-memory during the webpack emit step.

const version = require('./src/manifest.json').version;
const baseName = require('./src/locale/en_GB/messages.json').appName.message;
const baseId = require('./src/manifest.json').browser_specific_settings.gecko.id;

module.exports = (env = {}) => {
  const isTest = !!env.test;
  const name = isTest ? baseName + '-test' : baseName;
  const geckoId = isTest ? baseId.replace('@', '-test@') : baseId;

  const testOnlyPlugins = isTest ? [
    new CopyPlugin({
      patterns: [
        {
          from: './src/manifest.json',
          to: './manifest.json',
          force: true,
          transform(content) {
            const manifest = JSON.parse(content.toString());
            manifest.browser_specific_settings.gecko.id = geckoId;
            return JSON.stringify(manifest, null, 2);
          }
        },
        {
          from: './src/locale/en_GB/messages.json',
          to: './_locales/en_GB/messages.json',
          force: true,
          transform(content) {
            const messages = JSON.parse(content.toString());
            messages.appName.message = name;
            messages.appShortName.message = name;
            return JSON.stringify(messages, null, 2);
          }
        }
      ]
    })
  ] : [];

  return merge(common, {
    mode: 'production',
    optimization: {
      minimize: true,
      minimizer: [
        new CssMinimizerPlugin({
          minify: CssMinimizerPlugin.cleanCssMinify
        }),
        new TerserPlugin({
          terserOptions: {
            format: {
              comments: false,
            },
          },
          extractComments: false,
        })
      ]
    },
    module: {
      rules: [{
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      }],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css'
      }),
      new ZipPlugin({
        path: path.resolve(__dirname, 'dist/extension'),
        filename: name + '_' + version + '.zip'
      }),
      ...testOnlyPlugins
    ]
  });
};
