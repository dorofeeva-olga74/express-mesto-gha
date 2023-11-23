//КАРТОЧКИ
const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: { // у карточки есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    required: true,// оно должно быть у каждого пользователя, так что имя — обязательное поле
    minlength: 2,
    maxlength: 30,
  },
  link: {//ссылка на картинку
    type: String, // гендер — это строка
    required: true,// оно должно быть у каждого пользователя, так что имя — обязательное пол
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некорректная ссылка',
    },
  },
  owner: {//ссылка на модель автора карточки
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      }
    ],
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
  },
  createdAt: {
    type: { type: Date, default: Date.now },
  },
}, { versionKey: false }, { timestamps: true });
// создаём модель и экспортируем её
module.exports = mongoose.model("card", cardSchema);