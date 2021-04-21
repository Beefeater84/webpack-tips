// Запуск ключевым словом webpack
// Базовая настройка webpack позволяет использовать import и require в js

const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const path = require('path')

module.exports = {
  // context - от какой папки отталкиваемся
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: {
    // Разные точки входа.
    // На каждую точку входа генерируется свой выходящий файл
    main: './index.js',
    analytics: './analytics.js'
  },
  output: {
    // Если написать filename: bundle.js, то все файлы js будут компилироваться в него.
    // [name] - убираем проблему, что все файлы сыплются в один Bundle. Так мы понимаем какой файл где
    // [contenthash] - убираем проблему с кешем, файл при его изменении имеет новое название
    filename: "[name].[contenthash].bundle.js",
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html"
    }),
    // Ставится в конце и очищает все старые файлы в dist
    new CleanWebpackPlugin()
  ],
  module: {
    rules: [{
      test: /\.css$/,
      // Сначала выполняется правый, потом левый
      // css-loader - обработка css
      // style-loader - загрузка стилей в head html, и его import в index.html
      use: ['style-loader', 'css-loader']
    }]
  }
}