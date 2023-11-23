const jwt = require("jsonwebtoken");
const UnauthorizedError = require('../errors/UnauthorizedError.js');

module.exports = async (req, res, next) => {
  // Верификация токена
  let payload;
  try {
    const token = req.headers.authorization;
    //console.log(token)
    if (!token) {
      throw new UnauthorizedError("Не правильные email или password");
    }
    const validTocken = token.replace("Bearer ", "");
    //console.log(`validTocken: ${validTocken}`)
    payload = await jwt.verify(validTocken, "some-secret-key");
    //console.log(`payload: ${payload}`)
  } catch (err) {
    if (err.message === "NotAutanticate") {
      return next(new UnauthorizedError("Необходима авторизация"));//401
    }
    if ((err.name = "JsonWebTokenError")) {
      return next(new UnauthorizedError("С токеном что-то не так"));//401
    } else {
      return next(err);
    }
  }
  // Добавление пейлоуда в объект запроса
  req.user = payload;
  next();
}