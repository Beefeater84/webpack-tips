// Базовая настройка webpack позволяет нам сразу использовать импорты
import Article from "./article";

//Требует loader в webpack.config
import './css/styles.css'

// Json загружается и парсится из коробки
import json from './assets/json.json'



const article = new Article('Webpack course')
// console.log('Article\'s meta: ',   article.meta())

console.log('JSON: ', json)