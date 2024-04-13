// импортируем нужные модули
const winston = require('winston');
const expressWinston = require('express-winston');

// создадим логгер запросов
const requestLogger = expressWinston.logger({
  transports: [          //отвечает за то, куда нужно писать лог
    new winston.transports.File({ filename: 'request.log' }),
  ],
  format: winston.format.json(), //отвечает за формат записи логов//json
});
// логгер ошибок
const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: 'error.log' }),
  ],
  format: winston.format.json(),
});
module.exports = {
  requestLogger,
  errorLogger,
};