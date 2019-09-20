const path = require('path');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const vueConfig = require('./vue-loader.config');

process.env.NODE_ENV = process.env.DOCKER_ENV || 'development';
process.env.DOCKER_ENV = process.env.DOCKER_ENV || 'development';
const isProd = process.env.NODE_ENV !== 'development';

switch (process.env.DOCKER_ENV) {
    case "testing":
        env = require('../configs/test.env')
    case "production":
        env = require('../configs/prod.env')
    case "staging":
        env = require('../configs/staging.env')
    default:
        env = require('../configs/dev.env')
}

module.exports = {
  devtool: isProd ? false : '#cheap-module-source-map',
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
    filename: '[name].[chunkhash].js',
  },
  resolve: {
    alias: {
      public: path.resolve(__dirname, '../public'),
    },
  },
  module: {
    noParse: /es6-promise\.js$/, // avoid webpack shimming process
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueConfig,
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[ext]?[hash]',
        },
      },
      {
        test: /\.css$/,
        use: isProd
          ? ExtractTextPlugin.extract({
            use: 'css-loader?minimize',
            fallback: 'vue-style-loader',
          })
          : ['vue-style-loader', 'css-loader'],
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[ext]',
          },
        },
      },
    ],
  },
  performance: {
    maxEntrypointSize: 300000,
    hints: isProd ? 'warning' : false,
  },
  mode: process.env.DOCKER_ENV === 'development' ? 'development' : 'production',
  plugins: isProd
    ? [
      new webpack.DefinePlugin({
        'process.env.CONFIGS_ENV': env,
      }),
      new webpack.optimize.ModuleConcatenationPlugin(),
      new ExtractTextPlugin({
        filename: 'common.[chunkhash].css',
        allChunks: true,
      }),
      new VueLoaderPlugin(),
    ]
    : [
      new webpack.DefinePlugin({
        'process.env.CONFIGS_ENV': env,
      }),
      new FriendlyErrorsPlugin(),
      new VueLoaderPlugin(),
    ],
};
