//const express = require('express');
const express = require('express');//???
const mongoose = require('mongoose');
//import "dotenv/config";
const router = require('./routes'); // импортируем роутеры
//const path = require('path');//????
const app = express();
//const __dirname = path.resolve();//???
//const user = require('../models/user');
// Слушаем 3000 порт
const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb' } =
 process.env;
// const { PORT = 3000, MONGO_URL = "mongodb://127.0.0.1:27017/parrots" } =
//   process.env;
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
 //app.use(express.static(path.join(__dirname, 'public'))); //????'mestodb'
//  app.use(json());
 app.use(express.json());
 app.use('/', router); // запускаем роутер

 app.use(function (req, res, next) {
  res
    .status(404)
    .send({
      message: "Переданы некорректные данные или такого маршрута несуществует",
    });
});

 app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`)
})

