const express = require('express');//???
const mongoose = require('mongoose');
const router = require('./routes'); // импортируем роутеры
const app = express();

// Слушаем 3000 порт
const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb' } =
 process.env;
const { NotFoundError } = require("./errors/errors");

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

app.use((req, res, next) => {
  req.user = {
    _id: '654b9ed19d6ab6c6085de9ed' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
 next();
});
//мидлвэр
 app.use(express.json());
 app.use('/', router); // запускаем роутер

 app.use(function (req, res, next) {
  res
    .status(NotFoundError)
    .send({
      message: "Переданы некорректные данные или такого маршрута несуществует",
    });
});

 app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`)
})

