//ПОЛЬЗОВАТЕЛЬ
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
    minlength: [2, "Mинимальная длина  — 2 символа"],
    maxlength: [30, "Максимальная длина— 30 символов"],
  },
  about: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, //  — это строка
    required: true, //  — обязательное поле
    minlength: [2, "Mинимальная длина  — 2 символа"],
    maxlength: [30, "Максимальная длина— 30 символов"],
  },
  avatar: {
    type: String, //  — это строка
    required: true, //  — обязательное поле
  },
}, { versionKey: false }, { timestamps: true });
// создаём модель и экспортируем её
module.exports = mongoose.model("user", userSchema);