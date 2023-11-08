//КАРТОЧКИ
const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: { // у карточки есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    //required: true, // оно должно быть у каждой карточки, так что имя — обязательное поле
    required: [true, "Вы не заполнили это поле"],// оно должно быть у каждого пользователя, так что имя — обязательное поле
      // {value: true,
      // massage: "Вы не заполнили это поле"}
    minlength: [2, "Mинимальная длина  — 2 символа"],
    maxlength: [30, "Максимальная длина— 30 символов"],
  },
  link: {//ссылка на картинку
    type: String, // гендер — это строка
    required: [true, "Вы не заполнили это поле"], // оно должно быть у каждого пользователя, так что имя — обязательное поле
    default: "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
    //match: RegExp,// создает валидатор, который проверяет, соответствует ли значение заданному регулярному выражению
  },
  owner: {//ссылка на модель автора карточки
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  likes: {//список лайкнувших пост пользователей, массив ObjectId, по умолчанию — пустой массив (поле default);
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    //required: true, //  — обязательное поле
    default: [],
  },
  createdAt: {// — дата создания, тип Date, значение по умолчанию Date.now.
    type: Date,
    default: Date.now,
  }
}, {versionKey: false}, {timestamps: true});
// создаём модель и экспортируем её
module.exports = mongoose.model("card", cardSchema);