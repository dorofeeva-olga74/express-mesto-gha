// создадим express router
const router = require("express").Router();
const usersRouter = require("./users");
const cardRouter = require("./cards");
const signinRouter = require("./signin");
const signupRouter = require("./signup");
const auth = require("../middlewares/auth");
//const auth = require("../middlewares/auth");
//const UnauthorizedError = require('../errors/NotFound');
const NotFoundError = require("../errors/NotFoundError.js");

//const authRouter = require('./auths');
const pageNotAccess = (req, res, next) => {//401
  //return res.status(new UnauthorizedError).send({ message: "Нет доступа к странице" });
  return next (new NotFoundError("Страница не найдена"));
};
router.use("/signin", signinRouter); //login
router.use("/signup", signupRouter); //createUser
// авторизация
router.use(auth);/// защищаем доступ к роутам, расположенным ниже
router.use("/users", usersRouter);
router.use("/cards", cardRouter);
router.use("*", pageNotAccess);
//по вебинару
// routes.get("*", (req, res) => {
//   res.sendFile(INDEX_FILE);
// });

module.exports = router;