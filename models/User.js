//ПОЛЬЗОВАТЕЛЬ
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
    minlength: [2, "Mинимальная длина  — 2 символа"],
    maxlength: [30, "Максимальная длина— 30 символов"],
    default: "Жак-Ив Кусто",
  },
  about: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, //  — это строка
    required: true, //  — обязательное поле
    minlength: [2, "Mинимальная длина  — 2 символа"],
    maxlength: [30, "Максимальная длина— 30 символов"],
    default: "Исследователь океана",
  },
  avatar: {
    type: String, //  — это строка
    required: true, //  — обязательное поле
    //default: "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
    //match: RegExp,// создает валидатор, который проверяет, соответствует ли значение заданному регулярному выражению
  },
}, {versionKey: false}, {timestamps: true});
// создаём модель и экспортируем её
module.exports = mongoose.model("user", userSchema);