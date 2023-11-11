const { StatusOK, StatusCreatedOK, BadRequest, NotFoundError, Conflict, InternalServerError } = require("../errors/errors");
const User = require('../models/User');
const ERROR_CODE_DUPLICATE_MONGO = 11000;//вынесены магические числа

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (err) {
    return res.status(InternalServerError).send({ message: "Ошибка на стороне сервера", err: err.message });
  }
};
module.exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("NotFound");
    }
    return res.status(StatusOK).send(user);
  } catch (err) {
    if (err.message === "NotFound") {
      return res.status(NotFoundError).send({ message: "Пользователь по id не найден" });
    }
    if (err.name === "CastError") {
      return res.status(BadRequest).send({ message: "Передан не валидный id" });
    }
    return res.status(InternalServerError).send({ message: "Ошибка на стороне сервера" });
  }
};
module.exports.createUser = async (req, res) => {
  try {
    const newUser = await new User(req.body);
    return res.status(StatusCreatedOK).send(await newUser.save());
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(BadRequest).send({ message: "Переданы некорректные данные" });
    }
    if (err.code === ERROR_CODE_DUPLICATE_MONGO) {
      return res.status(Conflict).send({ message: "Пользователь уже существует" });
    }
    return res.status(InternalServerError).send({ message: "Ошибка на стороне сервера" });
  }
};
module.exports.updateUser = async (req, res) => {
  try {
    const { name, about } = req.body;
    const updateUser = await User.findByIdAndUpdate(req.user._id, { name, about }, { new: "true", runValidators: "true" });
    return res.status(StatusOK).send(await updateUser.save());
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(BadRequest).send({ message: "Переданы некорректные данные", ...err });
    }
    return res.status(InternalServerError).send({ message: "Ошибка на стороне сервера" });
  }
};
module.exports.updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const updateAvatar = await User.findByIdAndUpdate(req.user._id, { avatar }, { new: "true", runValidators: "true" });
    return res.status(StatusOK).send(updateAvatar);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(BadRequest).send({ message: "Переданы некорректные данные", ...err });
    }
    return res.status(InternalServerError).send({ message: "Ошибка на стороне сервера" });
  }
};