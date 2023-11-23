// создадим express router
const cardRouter = require("express").Router();
const { Joi, celebrate, errors } = require("celebrate");
const { getCards, createCard, deleteCard, likeCard, dislikeCard } = require("../controllers/cards.js");
const patternURL = /https?:\/\/(\w{3}\.)?[1-9a-z\-.]{1,}\w\w(\/[1-90a-z.,_@%&?+=~/-]{1,}\/?)?#?/i;

// Здесь роутинг
cardRouter.get("/", getCards);

cardRouter.post("/", celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(patternURL),
  }),
}), createCard);

cardRouter.delete("/:cardId", celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
}), deleteCard);

cardRouter.put("/:cardId/likes", celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),//alphanum().
  }),
}), likeCard);

cardRouter.delete("/:cardId/likes", celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
}), dislikeCard);

cardRouter.use(errors());// обработчик ошибок celebrate
// экспортируем его
module.exports = cardRouter; // экспортировали роутер