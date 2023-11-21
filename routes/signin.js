const { login } = require('../controllers/users');
const { Joi, celebrate, errors } = require('celebrate');
//const patternURL = /https?:\/\/(\w{3}\.)?[1-9a-z\-.]{1,}\w\w(\/[1-90a-z.,_@%&?+=~/-]{1,}\/?)?#?/i;
// создадим express router
const signinRouter = require('express').Router();
// Здесь роутинг
signinRouter.post('/', celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
//signinRouter.post('/', login);
signinRouter.use(errors());// обработчик ошибок celebrate
// экспортируем его
module.exports = signinRouter; // экспортировали роутер