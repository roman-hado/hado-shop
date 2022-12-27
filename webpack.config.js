require('dotenv').config();
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');
const path = require('path');
const nodeEnv = process.env.NODE_ENV || 'production';

module.exports = {
  devtool: 'source-map',
  entry: './src/scripts/app.js',
  mode: 'production',
  resolve: {
   alias: {
     Scripts: path.resolve(__dirname, './src/scripts/templates')
   }
  },
  output: {
    path: path.resolve(__dirname, './src/assets'),
    filename: 'theme.js'
  },
  optimization: nodeEnv == 'production' ? {
    minimizer: [new TerserPlugin()],
  } : {
    minimize: false,
    minimizer: [new UglifyJsPlugin({
      include: /theme.js$/
    })]
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules\/(?!(dom7|swiper)\/).*/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    },
    {
      test: /scripts\/modernizr\.js$/,
      loader: 'imports-loader?this=>window!exports-loader?window.Modernizr'
    }]
  },
  plugins: [
    // env plugin
    new webpack.DefinePlugin({
      'proccess.env': { NODE_ENV: JSON.stringify(nodeEnv) }
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jquery': 'jquery',
      'window.jQuery': 'jquery',
      'window.$': 'jquery'
    }),
  ]
};
