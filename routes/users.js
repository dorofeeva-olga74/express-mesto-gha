const { getUsers, getUserById, getCurrentUser, updateUser, updateAvatar } = require('../controllers/users');
const { Joi, celebrate, errors } = require('celebrate');
const patternURL = /https?:\/\/(\w{3}\.)?[1-9a-z\-.]{1,}\w\w(\/[1-90a-z.,_@%&?+=~/-]{1,}\/?)?#?/i;
// создадим express router
const userRouter = require('express').Router();
// Здесь роутинг
userRouter.get('/', getUsers);
userRouter.get("/me", getCurrentUser);
userRouter.get('/:userId', celebrate({
  // валидируем параметры
  params: Joi.object().keys({
      userId: Joi.string().hex().length(24).required(),
    }),
}), getUserById);
//userRouter.get('/:userId', getUserById);
//userRouter.post('/', createUser);
userRouter.patch('/me', celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);
//userRouter.patch('/me', updateUser);
userRouter.patch('/me/avatar', celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(patternURL),
  }),
}), updateAvatar);
//userRouter.patch('/me/avatar', updateAvatar);
userRouter.use(errors());// обработчик ошибок celebrate
// экспортируем его
module.exports = userRouter; // экспортировали роутер