//import jwt from "jsonwebtoken";
const jwt = require("jsonwebtoken");
//const InternalServerError = require('../errors/InternalServerError.js');
const UnauthorizedError = require('../errors/UnauthorizedError.js');
const { JWT_SECRET, NODE_ENV } = process.env;
module.exports = (req, res, next) => {
  // Верификация токена
  let payload;
  try {
    // const token = req.headers.authorization;
    const token = req.cookies.parrotToken;
    if (!token) {
      //throw new Error("NotAutanticate");
      throw new UnauthorizedError("Не правильные email или password");
    }
    const validTocken = token.replace("Bearer ", "");
    payload = jwt.verify(validTocken, NODE_ENV ? JWT_SECRET : "dev_secret");
    //const { authorization } = req.headers;
  } catch (err) {//!authorization || !authorization.startsWith('Bearer ')
    if (err.message === "NotAutanticate") {
      return next(new UnauthorizedError("Необходима авторизация"));
      //return res.status(new UnauthorizedError).send({ message: "Необходима авторизация" });//401
    }
    if ((err.name = "JsonWebTokenError")) {
      return next(new UnauthorizedError("С токеном что-то не так"));
      //return res.status(new UnauthorizedError).send({ message: "С токеном что-то не так" });//401
    } else {
      return next(err);
    }
    //return res.status(new InternalServerError).send({ message: "Ошибка на стороне сервера" });
  }
// Добавление пейлоуда в объект запроса
  req.user = payload;
  next();
}
///
// module.exports = (req, res, next) => {
//   const { authorization } = req.headers;

//   if (!authorization || !authorization.startsWith("Bearer ")) {
//     return next(new UnauthorizedError("Необходима авторизация"));
//   }
//   const token = authorization.replace("Bearer ", "");
//   try {
//     // Верификация токена
//     const payload = jwt.verify(token, "super-secret-key");
//     // Добавление пейлоуда в объект запроса
//     req.user = payload;
//     next();
//   } catch (err) {
//     return next(new UnauthorizedError("Необходима авторизация"));
//   }
// };