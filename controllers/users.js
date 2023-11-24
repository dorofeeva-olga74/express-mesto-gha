const User = require("../models/User.js");
const bcrypt = require("bcrypt"); // импортируем bcrypt
const jwt = require("jsonwebtoken");
//const { JWT_SECRET, NODE_ENV } = process.env;
const httpConstants = require("http2").constants;
const mongoose = require("mongoose");

const BadRequest = require("../errors/BadRequest.js");
const NotFoundError = require("../errors/NotFoundError.js");
const Conflict = require("../errors/Conflict.js");

const ERROR_CODE_DUPLICATE_MONGO = 11000;//вынесены магические числа
const SOLT_ROUNDS = 10;// хешируем пароль

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (err) {
    return next(err);
  }
};

module.exports.getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError("Пользователь по id не найден");
    }
    return res.status(httpConstants.HTTP_STATUS_OK).send(user);
  } catch (err) {
    if (err.message === "NotFound") {
      return next(new NotFoundError("Пользователь по id не найден"));
    }
    if (err.name === "CastError") {
      return next(new BadRequest("Передан не валидный id"));
    } else {
      return next(err);
    }
  }
};

module.exports.createUser = async (req, res, next) => {
  try {
    const { name, about, avatar, email, password, } = req.body;
    const hash = await bcrypt.hash(password, SOLT_ROUNDS);
    //console.log(`hash: ${hash}`)
    const newUser = await User.create({ name, about, avatar, email, password: hash });
    //console.log(`newUser: ${newUser}`)
    return res.status(httpConstants.HTTP_STATUS_CREATED).send({
      name: newUser.name,
      about: newUser.about,
      avatar: newUser.avatar,
      _id: newUser._id,
      email: newUser.email,
    });
  } catch (err) {
    //console.log(err)
    if (err.code === ERROR_CODE_DUPLICATE_MONGO) {
      return next(new Conflict("Пользователь уже существует"));
    } else if (err instanceof mongoose.Error.ValidationError) {
      return next(new BadRequest("Переданы некорректные данные"));
    }
    else {
      return next(err);
    }
  }
};
//Создайте контроллер и роут для получения информации о пользователе
module.exports.getCurrentUser = async (req, res, next) => {
  try {
    // console.log(`_id: ${_id}`)
    // console.log(`req.user._id: ${req.user._id}`)
    const currentUser = await User.findById(req.user._id)
      .orFail(() => {
        throw new NotFoundError({ message: "Пользователь по id не найден" });
      });
    //console.log(`currentUser: ${currentUser}`);
    return res.status(httpConstants.HTTP_STATUS_OK).send(currentUser);
  } catch (err) {
    return next(err);
  }
};

module.exports.getMeUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(httpConstants.HTTP_STATUS_OK).send(user))
    .catch(next);
};

module.exports.updateUser = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const updateUser = await User.findByIdAndUpdate(req.user._id, { name, about }, { new: "true", runValidators: "true" });
    return res.status(httpConstants.HTTP_STATUS_OK).send(await updateUser.save());
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new BadRequest("Переданы некорректные данные"));
    } else {
      return next(err);
    }
  }
};

module.exports.updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    //console.log(`avatar ${avatar}`)
    const updateAvatar = await User.findByIdAndUpdate(req.user._id, { avatar }, { new: "true", runValidators: "true" });
    return res.status(httpConstants.HTTP_STATUS_OK).send(updateAvatar);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new BadRequest("Переданы некорректные данные"));
    } else {
      return next(err);
    }
  }
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  //console.log(`email: ${email}`)
  try {
    const user = await User.findUserByCredentials(email, password)
    //console.log(`user: ${user}`)
    const token = jwt.sign({ _id: user._id }, "some-secret-key", { expiresIn: "7d" }); //exp (expiration time) — время жизни токена.
    //console.log(`token: ${token}`)
    // аутентификация успешна! пользователь в переменной user
    return res.status(httpConstants.HTTP_STATUS_OK).send(({ token }));
  } catch (err) {
    //console.log(`err: ${err}`)
    next(err);
  }
};