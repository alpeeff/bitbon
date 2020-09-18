const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

const isDev = process.env.NODE_ENV === 'development';

const optimization = () => {
  const config = {};
  if (!isDev) {
    config.minimizer = [new TerserWebpackPlugin()];
  }
  return config;
};

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: ['@babel/polyfill', './index.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: './js/app.js',
  },
  optimization: optimization(),
  devServer: {
    port: 3000,
    stats: 'errors-only',
    watchOptions: {
      poll: true,
    },
    proxy: {
      '/media': {
        target: 'https://bitbon.today/',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: './pages/index.pug',
      filename: 'index.html',
    }),
    new HTMLWebpackPlugin({
      template: './pages/about.pug',
      filename: 'about.html',
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: './css/index.css',
    }),
    new SpriteLoaderPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/assets'),
          to: path.resolve(__dirname, 'dist/assets'),
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: ['pug-loader'],
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        options: {
          extract: true,
          spriteFilename: './assets/sprite.svg',
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: path.relative(__dirname, '../'),
              hmr: isDev,
              reloadAll: true,
            },
          },
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpeg|gif|jpg)$/,
        use: ['file-loader'],
      },
      {
        test: /\.(eot|woff|woff2|ttf)$/,
        loader: 'file-loader',
        options: {
          outputPath: './assets',
          name: '[name].[ext]',
        },
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};
