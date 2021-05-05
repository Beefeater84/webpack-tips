// Запуск ключевым словом webpack
// Базовая настройка webpack позволяет использовать import и require в js

const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const path = require('path')
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const ESLintPlugin = require('eslint-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// NODE_ENV устанавливается на Mac OC с помощью export NODE_ENV = development
// NODE_ENV устанавливается на Windows с помощью set NODE_ENV = development
// ну и запускаем билд
// мы же качаем пакет cross-env
// cross-env используем в package.json: "dev": "cross-env NODE_ENV=development webpack --mode development"

const isDev = process.env.NODE_ENV === 'development'; // Если в системную переменную NODE_ENV в package.json поставили development, то isDev = true
const isProd = !isDev;


// Мы же работает с обычным js, поэтому можем использовать функции
// Они помогают, когда нам в разных ситуациях нужно вернуть разное
// Для примера возьмем оптимизацию - в dev будем возвращать один объект, а в build другой

const optimisation = () => {
  const config = {
    // Если библиотеки подключены в нескольких файлах, то webpack будет автоматически выделять их в один файл, а не подключать в каждый
    splitChunks: {
      chunks: 'all'
    }
  }

  if (isProd){
    config.minimize = true;
    config.minimizer = [
      new CssMinimizerPlugin(),
      new TerserPlugin()
    ]
  }

  return config
}

// Функция названия bundle - сделана просто для оптимизации, потому что шаблон названия js и css файлов одинаков
// Но для prod вверсии мы оставляем [contenthash], чтобы он не кешировался у людей, а для разработки он нам не нужен, чтобы не мешал
const filename = ext => isDev ? `[name].bundle.${ext}` : `[name].[contenthash].bundle.${ext}`


// Функция для оптимизации.
// JS, React и TS обрабатываются примерно одинаково, только пресеты меняются.
// Поэтому создаем отдельную функцию для всех 3х

const babelOptions = preset => {
  const obj = {
    loader: "babel-loader",
    options: {
      "presets": []
    }
  }

  // Если передаем какой-то пресет из Babel, то добавляем его сюда
  // Список пресетов: https://babeljs.io/docs/en/presets
  if(!!preset){
    obj.options.presets.push(preset)
  }
  return obj;
}

const eslintLoader = loader => {
  const babelLoaders = babelOptions('@babel/preset-env');

  const result = [
    loader,
    babelLoaders
  ]

  return result
}

// Создаем отдельно функция со всеми плагинами, потому что в ней удобно добавлять какие-то плагины для разработки или для продакшена
const plugins = () => {
  const result =  [
    new HtmlWebpackPlugin({
      template: "./index.html",
      minify: {
        // Минификация html, конкретно этого template
        collapseWhitespace: isProd
      }
    }),
    // Выделяет css в отдельный файл, без него css инлайнится в js
    // Для работы требует еще записи в rules
    new MiniCssExtractPlugin({
      filename:  filename('css'), //  "[name].[contenthash].bundle.css"
    }),
    // Нужен для переноса файлов из src в дист.
    // Можно задавать паттерны и копировать все изображения
    new CopyPlugin({
      patterns: [
        {from: path.resolve(__dirname, 'src/assets/webpack-icon.svg'), to: path.resolve(__dirname, 'dist/img')},
        // { from: "source", to: "dest" },
        // { from: "other", to: "public" },
      ],
    }),
    // Ставится в конце и очищает все старые файлы в dist
    new CleanWebpackPlugin()
  ]

  if( isDev ){
    // Добавляем eslint: https://webpack.js.org/plugins/eslint-webpack-plugin/#root
    // Он также требует плагина и конфигурируется в файле .eslintrc
    result.push(new ESLintPlugin())
  }

  if ( isProd ){
    // анализатор финальной сборки. Запускается в новом окне и показывает размер использованных библиотек
    // Также, для него отдельно создан запуск npm run stats
    // https://github.com/webpack-contrib/webpack-bundle-analyzer
    result.push(new BundleAnalyzerPlugin())
  }

  return result;
}


module.exports = {
  // context - от какой папки отталкиваемся
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: {
    // Разные точки входа.
    // На каждую точку входа генерируется свой выходящий файл
    // @babel/polyfill - нужен для некоторых функций babel

    // При обработке React меняем входной файл на App.jsx
    // main: ['@babel/polyfill', './App.jsx'],
    main: ['@babel/polyfill', './index.js'],
    analytics: './analytics.js'
  },
  output: {
    // Если написать filename: bundle.js, то все файлы js будут компилироваться в него.
    // [name] - убираем проблему, что все файлы сыплются в один Bundle. Так мы понимаем какой файл где
    // [contenthash] - убираем проблему с кешем, файл при его изменении имеет новое название
    filename:  filename('js'), //"[name].[contenthash].bundle.js",
    path: path.resolve(__dirname, 'dist')
  },
  //optimization - необязательный параметр
  optimization: optimisation(),
  // devServer - перезагружает страницу.
  // Во время разработки он хранит все файлы в оперативной памяти, поэтому папка dist будет пуста
  devServer: {
    port: 4200,
    // обновление информации без перезагрузки страницы
    hot: isDev
  },
  // resolve необязательный, содержит дополнительные настройки
  resolve: {
    //Исключения, какие типы файлов можем писать без расширения
    extensions: ['.js'],
    alias: {
      // Помогаем себе сократить путь и не писать каждый раз ../../../html/templates и тд.
      // @models используем в html как переменные
      '@models': path.resolve(__dirname, 'src/models'),
      '@images': path.resolve(__dirname, 'src/img'),
      '@assets': path.resolve(__dirname, 'src/assets')
    }
  },
  plugins: plugins(),
  module: {
    // В массиве rules мы вносим loaders, которые помогают импортировать и обрабатывать что угодно
    rules: [
      {
        // test - регулярное выражение, к каким файлам применяем данные loader
        test: /\.css$/,
        // Сначала выполняется правый, потом левый
        // css-loader - обработка css
        // style-loader - загрузка стилей в head html, и его import в index.html
        // use: ['style-loader', 'css-loader'] // В этой записи мы просто инлайним стили в js
        use: [MiniCssExtractPlugin.loader, 'css-loader'] // Самая простая загрузка css в отдельный файл
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader"
        ]
      },
      // babel для обработки современных функций js
      // отдельно ставим пресет: npm install @babel/preset-env --save-dev
      // Для отдельных функций (ошибка regenerator-runtime) нужно ставить Polyfill
      // На практике это выглядит, что мы настройку с Index.js вверху превращаем в массив и добавляем @babel/polyfill

      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: babelOptions('@babel/preset-env')
      },
      // Обработка Type Script
      {
        test: /\.m?ts$/,
        exclude: /node_modules/,
        use: babelOptions('@babel/preset-typescript')
      },
      // Обработка React
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: babelOptions('@babel/preset-react')
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
  },
  // Конфигурация source map
  // https://webpack.js.org/configuration/devtool/
  devtool: isDev ? 'source-map' : false
}