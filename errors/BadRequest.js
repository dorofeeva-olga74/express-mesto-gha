// const process = require('process');

// process.on('uncaughtException', (err, origin) => {
//    console.log(`${origin} ${err.name} c текстом ${err.message} не была обработана. Обратите внимание!`);
// });

// // Выбросим синхронную ошибку
// throw new Error(`Ошибка, которую мы пропустили`); 

module.exports = class BadRequest extends Error {
  constructor(message) {
    super(message);
    this.name = "BadRequest";
    this.statusCode = 400;
  }
}