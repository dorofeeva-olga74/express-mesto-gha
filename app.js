const express = require('express');//???
const mongoose = require('mongoose');
//const { Joi, celebrate, errors } = require('celebrate');
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
//мидлвэр
 app.use(express.json());
 app.use('/', router); // запускаем роутер

 app.use(function (req, res, next) {
  next(new NotFoundError("Переданы некорректные данные или такого маршрута несуществует"));
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

