const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const SRC_PATH = path.resolve(__dirname, 'src', 'client')
const DST_PATH = path.resolve(__dirname, 'static')

module.exports = (env, argv) => ({
  entry: [
    path.resolve(SRC_PATH, 'ts', 'index.tsx'),
    path.resolve(SRC_PATH, 'scss', 'index.scss'),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: path.resolve(SRC_PATH, 'ts', 'tsconfig.json'),
          },
        },
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          argv.mode === 'production'
            ? MiniCssExtractPlugin.loader
            : 'style-loader',
          { loader: 'css-loader', options: { url: false } },
          'sass-loader',
        ],
      },
    ],
  },
  output: {
    path: path.resolve(DST_PATH, 'js'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  plugins:
    argv.mode === 'production'
      ? [new MiniCssExtractPlugin({ filename: '../css/[name].css' })]
      : [],
})
