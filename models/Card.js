//КАРТОЧКИ
const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: { // у карточки есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    //required: true, // оно должно быть у каждой карточки, так что имя — обязательное поле
    required: true,// оно должно быть у каждого пользователя, так что имя — обязательное поле
      // {value: true,
      // massage: "Вы не заполнили это поле"}
    minlength: 2,
    maxlength: 30,
  },
  link: {//ссылка на картинку
    type: String, // гендер — это строка
    required: true// оно должно быть у каждого пользователя, так что имя — обязательное пол
    //match: RegExp,// создает валидатор, который проверяет, соответствует ли значение заданному регулярному выражению
  },
  owner: {//ссылка на модель автора карточки
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  likes: {//список лайкнувших пост пользователей, массив ObjectId, по умолчанию — пустой массив (поле default);
    type: [
      {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
      },
    ],
    default: [],
    //required: true, //  — обязательное поле
  },
  createdAt: {
    type: { type: Date, default: Date.now },
  },
}, {versionKey: false}, {timestamps: true});
// создаём модель и экспортируем её
module.exports = mongoose.model("card", cardSchema);