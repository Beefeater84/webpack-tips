// ToDo Как загружать SVG
// ToDo Как загружать картинки из html шаблона

// Базовая настройка webpack позволяет нам сразу использовать импорты
import Article from "./article";
// @assets - мы сами установили как @alias в webpack.config.js
import WebpackLogo from '@assets/webpack-logo.png'

// Требует loader в webpack.config
// Все css библиотеки подключаются в style.css
import './css/styles.css'
import './css/sass.scss'

// import js библиотек.
// Устанавливаем библиотеку и импортируем по названию.
import 'materialize-css'

import './js/babel'
import './js/typescript.ts'

// динамический импорт библиотек. Таким образом библиотека будет подгружена только в момент появления
import('lodash').then(() => {
  console.log('Lodash: ', _.random(0, 42, true))
})


document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.dropdown-trigger');
  var instances = M.Dropdown.init(elems);
});



// Json загружается и парсится из коробки
import json from './assets/json.json'

//CSV
import hostings from './assets/hostings.csv'

//XML
import note from './assets/note.xml'


const article = new Article('Webpack course', WebpackLogo)
console.log('Article\'s meta: ',   article.meta())

// Json импортируется сразу как обект
// console.log('JSON: ', json)


// // CSV импортируется сразу как обект
// console.log('CSV: ', hostings)

// XML импортируется сразу как обект
console.log('XML: ', note)
