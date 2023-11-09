const User = require('../models/User');
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
    if (error.message === "NotFound") {
      return res.status(404).send({ message: "Пользователь по id не найден" });
    }
    if (error.name === "CastError") {
      return res.status(400).send({ message: "Передан не валидный id" });
    }
    return res.status(500).send({ message: "Ошибка на стороне сервера" });
  }
};
module.exports.createUser = async (req, res) => {
  try {
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
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .send({ message: "Ошибка валидации полей", ...error });
    }
    // if (error.code === ERROR_CODE_DUPLICATE_MONGO) {
    //   return res.status(409).send({ message: "Пользователь уже существует" });
    // }
    return res.status(500).send({ message: "Ошибка на стороне сервера" });
  }
};
module.exports.updateAvatar = async (req, res) => {
  try {
    const {avatar} = req.body;
    //console.log(req.body)
    const updateAvatar = await User.findByIdAndUpdate(req.user._id, {avatar}, { new: "true", runValidators: "true" } );
    return res.status(200).send(updateAvatar);
    //return res.status(200).send(updateAvatar);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .send({ message: "Ошибка валидации полей", ...error });
    }
    // if (error.code === ERROR_CODE_DUPLICATE_MONGO) {
    //   return res.status(409).send({ message: "Пользователь уже существует" });
    // }
    return res.status(500).send({ message: "Ошибка на стороне сервера" });
  }
};