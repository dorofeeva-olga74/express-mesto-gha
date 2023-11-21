const express = require('express');//???
//Ключ заносят в переменные окружения в файл с расширением .env в корне проекта и
//Чтобы загрузить этот файл в Node.js, нужно установить в проект модуль dotenv
const dotenv = require('dotenv');
dotenv.config();
console.log(process.env.NODE_ENV); // production
const mongoose = require('mongoose');
//const { Joi, celebrate, errors } = require('celebrate');
//'helmet' Заголовки безопасности можно проставлять автоматическиnpm i
const helmet = require('helmet');
//'express-rate-limit' Используется для ограничения повторных запросов к общедоступным API
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');

const router = require('./routes'); // импортируем роутеры
const app = express();
const NotFoundError = require('./errors/NotFoundError.js');
const InternalServerError = require('./errors/InternalServerError.js');
//const { NotFoundError } = require("./errors/errors");
// Слушаем 3000 порт
const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb' } =
 process.env;

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4,
}).then(() => {
  console.log("Connected to MongoDB");
})
.catch((error) => {
  console.log("Error connecting to MongoDB:", error);
});
/////авторизация
// app.use((req, res, next) => {
//   req.user = {
//     _id: '654b9ed19d6ab6c6085de9ed' // вставьте сюда _id созданного в предыдущем пункте пользователя
//   };
//  next();
// });
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 100 // можно совершить максимум 100 запросов с одного IP
});
//мидлвэр
// подключаем rate-limiter
 app.use(limiter);
 app.use(helmet());
 app.use(express.json());
 app.use('/', router); // запускаем роутер

 app.use(function (req, res, next) {
  return next(new NotFoundError("Переданы некорректные данные или такого маршрута несуществует"));
  // res.status(new NotFoundError).send({
  //     message: "Переданы некорректные данные или такого маршрута несуществует",
  //   });
});
app.use(errors());
// здесь обрабатываем все ошибки
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = new InternalServerError, message } = err;//500
  res.status(statusCode).send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === new InternalServerError
        ? 'На сервере произошла ошибка'
        : message
    });
    next();
});
 app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`)
})
// app.post('/signin', login);
// app.post('/signup', createUser);

