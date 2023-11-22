//const { StatusOK, StatusCreatedOK, BadRequest, NotFoundError, Conflict, InternalServerError } = require("../errors/errors");
const User = require("../models/User.js");
const bcrypt = require("bcrypt"); // импортируем bcrypt
const jwt = require("jsonwebtoken");
const ERROR_CODE_DUPLICATE_MONGO = 11000;//вынесены магические числа
const httpConstants = require("http2").constants;
const mongoose = require("mongoose");
//const StatusOK = require('../errors/StatusOK.js');
//const StatusCreatedOK = require('../errors/StatusCreatedOK.js');
const BadRequest = require("../errors/BadRequest.js");
const NotFoundError = require("../errors/NotFoundError.js");
const Conflict = require("../errors/Conflict.js");
//const InternalServerError = require('../errors/InternalServerError.js');
//const UnauthorizedError = require("../errors/UnauthorizedError.js");

// хешируем пароль
const SOLT_ROUNDS = 10;

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch(err) {
    return next(err);
    //     throw err; // проброс (*)
    // if (err.name === "InternalServerError") {
    //   //throw new InternalServerError("Ошибка на стороне сервера");// Описываем логику её обработки
    //   return res.status(new InternalServerError).send({ message: "Ошибка на стороне сервера", err: err.message });
    // } else {
    //   throw e; // проброс (*)
    // }
  //return res.status(InternalServerError).send({ message: "Ошибка на стороне сервера", err: err.message });
  }
};
module.exports.getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      //throw new Error("NotFound");
      throw new NotFoundError("Пользователь по id не найден");
    }
    return res.status(httpConstants.HTTP_STATUS_OK).send(user);
  } catch (err) {
    if (err.message === "NotFound") {
      return next(new NotFoundError("Пользователь по id не найден"));
      //return res.status(new NotFoundError).send({ message: "Пользователь по id не найден" });
    }
    if (err.name === "CastError") {
      return next(new BadRequest("Передан не валидный id"));
      //return res.status(new BadRequest).send({ message: "Передан не валидный id" });
    } else {
      return next(err);//return next(err);
    }
    //throw err;
    //throw new InternalServerError("Ошибка на стороне сервера");
    //return res.status(new InternalServerError).send({ message: "Ошибка на стороне сервера" });
  }
};

module.exports.createUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const hash = await bcrypt.hash(password, SOLT_ROUNDS);
    console.log(`hash: ${hash}`)
    // const newUser = await new User.create((req.body)); //так было
    const newUser = await User.create({ email, password: hash });
    console.log(`newUser: ${newUser}`)
    return res.status(httpConstants.HTTP_STATUS_CREATED).send({
      name: newUser.name,
      about: newUser.about,
      avatar: newUser.avatar,
      _id: newUser._id,
      email: newUser.email,
    });
  } catch (err) {
    console.log(err)
    if (err.code === ERROR_CODE_DUPLICATE_MONGO) {
      return next(new Conflict("Пользователь уже существует"));
      //return res.status(new Conflict).send({ message: "Пользователь уже существует" });
    } else if (err instanceof mongoose.Error.ValidationError) {
      return next(new BadRequest("Переданы некорректные данные"));
      //return res.status(new BadRequest).send({ message: "Переданы некорректные данные" });
    }
    else {
      return next(err);
    }
    //throw new InternalServerError("Ошибка на стороне сервера");
    //return res.status(new InternalServerError).send({ message: "Ошибка на стороне сервера" });
 }};
//Создайте контроллер и роут для получения информации о пользователе
module.exports.getCurrentUser = async (req, res, next) => {///Чем отличается от getUserById??????????
  try {
    const { _id } = req.body;//req.params??? одно и  то же
    const currentUser = await User.findById(_id)
    .orFail(() => {
      throw new NotFoundError({ message: "Пользователь по id не найден" });
    });//(req.user._id)
    //console.log(`currentUser: ${currentUser}`);
    return res.status(httpConstants.HTTP_STATUS_OK).send(currentUser);
  } catch (err)  {
    // if (err.message === "NotFound") {
    //   next(new NotFoundError("Пользователь по id не найден"));
    //   //return res.status(new NotFoundError).send({ message: "Пользователь по id не найден" });
    // }
    // if (err.name === "CastError") {
    //   next(new BadRequest("Передан не валидный id"));
    //   //return res.status(new BadRequest).send({ message: "Передан не валидный id" });
    // } else {
      return next(err);
    // }
    //throw new InternalServerError("Ошибка на стороне сервера");
    //return res.status(new InternalServerError).send({ message: "Ошибка на стороне сервера" });
  }
};
////
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
    //return res.status(new BadRequest).send({ message: "Переданы некорректные данные", ...err });
    } else {
      return next(err);
    }
    //throw new InternalServerError("Ошибка на стороне сервера");
    //return res.status(new InternalServerError).send({ message: "Ошибка на стороне сервера" });
  }
};
module.exports.updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    console.log(`avatar ${avatar}`)
    const updateAvatar = await User.findByIdAndUpdate(req.user._id, { avatar }, { new: "true", runValidators: "true" });
    return res.status(httpConstants.HTTP_STATUS_OK).send(updateAvatar);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new BadRequest("Переданы некорректные данные"));
      //return res.status(new BadRequest).send({ message: "Переданы некорректные данные", ...err });
    } else {
      return next(err);
    }
    //throw new InternalServerError("Ошибка на стороне сервера");
    //return res.status(new InternalServerError).send({ message: "Ошибка на стороне сервера" });
  }
};
// module.exports.login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     const checkedUser =  await User.findUserByCredentials(email, password);
//     const token = jwt.sign({ _id: checkedUser._id }, "some-secret-key", { exp: "7d" }); //exp (expiration time) — время жизни токена.
//     // аутентификация успешна! пользователь в переменной user
//     return res.status(httpConstants.HTTP_STATUS_OK).send(await checkedUser({ token }));
//   } catch (err) {
//     if (err.message === "NotAutanticate") {
//       return next(new UnauthorizedError("Не правильные email или password"));
//       //return res.status(new UnauthorizedError).send({ message: "Не правильные email или password" });
//     } else {
//       return next(err);
//     }
//     //throw new InternalServerError("Ошибка на стороне сервера");
//     //return res.status(new InternalServerError).send({ message: "Ошибка на стороне сервера" });
//   }
// };
///
module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  console.log(`email: ${email}`)
  console.log(`password: ${password}`)
  try {
    const user = await User.findUserByCredentials(email, password)
    console.log(`user: ${user}`)
    const token = await jwt.sign({ _id: user._id }, "some-secret-key", { expiresIn: "7d" }); //exp (expiration time) — время жизни токена.
    console.log(`token: ${token}`)
    return res.status(httpConstants.HTTP_STATUS_OK).send(({ token }));
    //res.send({ email: user.email });
  } catch (err) {
    console.log(`err: ${err}`)
       next(err);
    }
};