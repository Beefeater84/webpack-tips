// Предположим что это внешний js файл, который не относится к нашему основному функционалу
// Подключается в webpack.config как доп.точка входа
// а как точка выхода используем паттерны в output [name].bundle.js

// Для примера устанавливаем нашу библиотеку сюда, чтобы попробовать оптимизацию и не подгружать ее дважды
import 'materialize-css'

function clicker(){
  let counter = 0;
  let isDestroyed = false;

  const listener = () => counter++

  document.addEventListener('click', listener)

  return {
      getClicks(){
        if(isDestroyed){
          return "Analytics is destroyed"
        }
        return counter
      },

      destroy(){
        document.removeEventListener('click', listener)
        isDestroyed = true
      }
  }

}

// Чтобы мы могли вызывать его глобально
window.clicker = clicker()