// Чтобы заработали async / await нужно установить polyfill

async function start(){
  return await Promise.resolve('Hello, I am babel')
}

start().then(console.log)

//

class Time {
  static date = Date.now()
}

console.log('Today: ', Time.date)