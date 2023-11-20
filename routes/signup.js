const { createUser } = require('../controllers/users');
const { Joi, celebrate, errors } = require('celebrate');
const patternURL = /https?:\/\/(\w{3}\.)?[1-9a-z\-.]{1,}\w\w(\/[1-90a-z.,_@%&?+=~/-]{1,}\/?)?#?/i;
// создадим express router
const signapRouter = require('express').Router();
// Здесь роутинг
signapRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(patternURL),
    email: Joi.string().required().email(),
    password: Joi.string().required().label('Password'),
  }),
}), createUser);
//signapRouter.post('/', createUser);
signapRouter.use(errors());// обработчик ошибок celebrate
// экспортируем его
module.exports = signapRouter; // экспортировали роутер