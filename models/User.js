//ПОЛЬЗОВАТЕЛЬ
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const UnauthorizedError = require('../errors/errors.js');

const userSchema = new mongoose.Schema({
  name: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    //required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
    minlength: [2, "Mинимальная длина  — 2 символа"],
    maxlength: [30, "Максимальная длина— 30 символов"],
    default: 'Жак-Ив Кусто',
  },
  about: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, //  — это строка
    //required: true, //  — обязательное поле
    minlength: [2, "Mинимальная длина  — 2 символа"],
    maxlength: [30, "Максимальная длина— 30 символов"],
    default: 'Исследователь',
  },
  avatar: {
    type: String, //  — это строка
    //required: true, //  — обязательное поле
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v) => validator.isURL(v),
      message: "Введите корректный URL",
    },
  },
  email: {
    type: String, //  — это строка
    unique: true, // - уникальный элемент
    required: true, //  — обязательное поле
    validate: {
      validator: (email) => validator.isEmail(email),
      //validator: (v) => validator.isEmail(v),
      message: 'Введите корректный email',
    },
  },
  password: {
    type: String, //  — это строка
    required: true, //  — обязательное поле
    select: false, // - чтобы API не возвращал хеш пароля
  },
}, { versionKey: false }, { timestamps: true });

// User.findOne({ email }).select('+password')
//   .then((user) => {
//     // здесь в объекте user будет хеш пароля
//   });

// добавим метод findUserByCredentials схеме пользователя//Функция findUserByCredentials
//не должна быть стрелочной. Это сделано, чтобы мы могли пользоваться this
// у него будет два параметра — почта и пароль
userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  // попытаемся найти пользователя по почте
  return this.findOne({ email }).select('+password')
    .then((user) => { // не нашёлся — отклоняем промис
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      } // нашёлся — сравниваем хеши
      return bcrypt.compare(password, user.password)
    .then((matched) => {
      if (!matched) {// отклоняем промис//return user; // но переменной user нет в этой области видимости
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }
      return user; // теперь user доступен
      });
   });
};

// создаём модель и экспортируем её
module.exports = mongoose.model("user", userSchema);

