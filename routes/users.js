const { getUsers, getUserById, createUser, updateUser, updateAvatar } = require('../controllers/users');
// создадим express router
const userRouter = require('express').Router();
// Здесь роутинг
userRouter.get('/', getUsers);
userRouter.get('/:userId', getUserById);
userRouter.post('/', createUser);
userRouter.patch('/me', updateUser);
userRouter.patch('/me/avatar', updateAvatar);
// экспортируем его
module.exports = userRouter; // экспортировали роутер