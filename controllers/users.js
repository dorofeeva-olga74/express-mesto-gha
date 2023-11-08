//const mongoose = require('mongoose');
const User = require('../models/User');
//import User from './models/User';
const ERROR_CODE_DUPLICATE_MONGO = 11000;//вынесены магические числа

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Ошибка на стороне сервера", error: error.message });
  }
};
module.exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("NotFound");
    }
    return res.status(200).send(user);
  } catch (error) {
    console.log(error);
    if (error.message === "NotFound") {
      return res.status(404).send({ message: "Пользователь по id не найден" });
    }
    if (error.name === "CastError") {
      return res.status(400).send({ message: "Передан не валидный id" });
    }
    return res.status(500).send({ message: "Ошибка на стороне сервера" });
  }
};
// export const createUser = (req, res) => {
//   const { name, about, avatar} = req.body;
//   res.json(req.body = { name, about, avatar});
//   // записываем данные в базу
//   User.create({ name, about, avatar })
//     // возвращаем записанные в базу данные пользователю
//       .then(user => res.send({ data: user }))
//     // если данные не записались, вернём ошибку
//       .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
//   //res.send({name, about, avatar});
// }, createUser);
module.exports.createUser = async (req, res) => {
  try {
    //const {name, about, avatar} = req.body;
    // if (name.length <= 2) return res.status(400).send({ message: "Ошибка валидации полей", ...error })d
    //console.log(req.body)
    //const newUser = await new User(/{name, about, avatar});
    const newUser = await new User(req.body);
    return res.status(201).send(await newUser.save());
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .send({ message: "Ошибка валидации полей"});
    }
    if (error.code === ERROR_CODE_DUPLICATE_MONGO) {
      return res.status(409).send({ message: "Пользователь уже существует" });
    }
  }
};
module.exports.updateUser = async (req, res) => {
  try {
    const {name, about} = req.body;
    const updateUser = await User.findByIdAndUpdate(req.user._id, {name, about}, { new: "true", runValidators: "true" } );
    return res.status(200).send(await updateUser.save());
    //return res.status(200).send(updatedUser);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .send({ message: "Ошибка валидации полей", ...error });
    }
    if (error.code === ERROR_CODE_DUPLICATE_MONGO) {
      return res.status(409).send({ message: "Пользователь уже существует" });
    }
    return res.status(500).send({ message: "Ошибка на стороне сервера" });
    //console.log(error.code);
  }
};
module.exports.updateAvatar = async (req, res) => {
  try {
    const {avatar} = req.body;
    //console.log(req.body)
    const updateAvatar = await User.findByIdAndUpdate(req.user._id, {avatar});
    return res.status(200).send(updateAvatar);
    //return res.status(200).send(updateAvatar);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .send({ message: "Ошибка валидации полей", ...error });
    }
    if (error.code === ERROR_CODE_DUPLICATE_MONGO) {
      return res.status(409).send({ message: "Пользователь уже существует" });
    }
    return res.status(500).send({ message: "Ошибка на стороне сервера" });
  }
};