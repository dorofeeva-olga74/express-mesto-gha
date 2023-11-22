const { getUsers, getUserById, getCurrentUser, updateUser, updateAvatar } = require("../controllers/users.js");
const { Joi, celebrate, errors } = require("celebrate");
const patternURL = /https?:\/\/(\w{3}\.)?[1-9a-z\-.]{1,}\w\w(\/[1-90a-z.,_@%&?+=~/-]{1,}\/?)?#?/i;
// создадим express router
const usersRouter = require("express").Router();
// Здесь роутинг
usersRouter.get("/", getUsers);
usersRouter.get("/me", getCurrentUser);
usersRouter.get("/:userId", celebrate({
  // валидируем параметры
  params: Joi.object().keys({
      userId: Joi.string().hex().length(24).required(),
    }),
}), getUserById);
//usersRouter.get('/:userId', getUserById);
//usersRouter.post('/', createUser);
usersRouter.patch("/me", celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);
//usersRouter.patch('/me', updateUser);
usersRouter.patch("/me/avatar", celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(patternURL),
  }),
}), updateAvatar);
//usersRouter.patch('/me/avatar', updateAvatar);
usersRouter.use(errors());// обработчик ошибок celebrate
// экспортируем его
module.exports = usersRouter; // экспортировали роутер