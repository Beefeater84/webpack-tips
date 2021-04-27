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
    // В массиве rules мы вносим loaders, которые помогают импортировать и обрабатывать что угодно
    rules: [
      {
        // test - регулярное выражение, к каким файлам применяем данные loader
        test: /\.css$/,
        // Сначала выполняется правый, потом левый
        // css-loader - обработка css
        // style-loader - загрузка стилей в head html, и его import в index.html
        use: ['style-loader', 'css-loader']
      },
      {
        // npm install file-loader --save-dev
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: ['file-loader']
      },
      {
        // для удобства отдельно прописываем шрифты
        test: /\.(ttf|wott|wott2|eot)$/i,
        use: ['file-loader']
      },
      {
        // csv loader, для работы необходимо установить papaparse
        test: /\.(csv)$/i,
        use: ['csv-loader']
      },
      {
        // xml loader
        test: /\.(xml)$/i,
        use: ['xml-loader']
      }
    ]
  }
}