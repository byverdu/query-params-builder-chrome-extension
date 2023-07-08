import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import FileManagerPlugin from 'filemanager-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

const __dirname = dirname(fileURLToPath(import.meta.url));
const mode = process.env.MODE || 'development';
const BASE_PATH_PAGES = 'src/react/pages';

const config = {
  entry: {
    options: {
      import: path.join(__dirname, `${BASE_PATH_PAGES}`, 'options/index.jsx'),
      dependOn: 'shared',
    },
    popup: {
      import: path.join(__dirname, `${BASE_PATH_PAGES}`, 'popup/index.jsx'),
      dependOn: 'shared',
    },
    shared: ['react', 'react-dom'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]/[name].js',
  },
  optimization: {
    runtimeChunk: 'single',
  },
  target: ['web', 'es13'],
  mode,
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.?jsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: mode === 'production' ? 'static' : 'disabled',
    }),
    new ESLintPlugin({
      extensions: ['js', 'jsx'],
      fix: true,
    }),
    new HtmlWebpackPlugin({
      template: `${BASE_PATH_PAGES}/options/index.html`,
      inject: 'body',
      excludeChunks: ['popup'],
      filename: 'options/index.html',
    }),
    new HtmlWebpackPlugin({
      template: `${BASE_PATH_PAGES}/popup/index.html`,
      inject: 'body',
      excludeChunks: ['options'],
      filename: 'popup/index.html',
    }),
    new FileManagerPlugin({
      events: {
        onEnd: [
          {
            copy: [{ source: 'src/extension', destination: 'dist' }],
            ...(mode === 'production' && {
              archive: [
                { source: './dist', destination: './queryParamsBuilder.zip' },
              ],
            }),
          },
        ],
      },
    }),
  ],
};

export default config;
