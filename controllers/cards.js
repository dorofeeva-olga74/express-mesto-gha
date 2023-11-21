//const { StatusOK, StatusCreatedOK, BadRequest, ForbiddenError, NotFoundError, InternalServerError } = require("../errors/errors");

const httpConstants = require("http2").constants;
const BadRequest = require('../errors/BadRequest.js');
const ForbiddenError = require('../errors/ForbiddenError.js');
const NotFoundError = require('../errors/NotFoundError.js');
//const Conflict = require('../errors/Conflict.js');
//const InternalServerError = require('../errors/InternalServerError.js');
//const UnauthorizedError = require('../errors/UnauthorizedError.js');
const Card = require('../models/Card');

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    return res.send(cards);
  } catch (err) {
    // if (err.name === "InternalServerError") {
    // return res.status(new InternalServerError).send({ message: "Ошибка на стороне сервера", err: err.message });
    // }
    return next(err);
//  throw err; // проброс (*)
  }
};
///
// module.exports.createCard = (req, res) => Card.create({
//   name: req.body.name,
//   link: req.body.link,
//   owner: req.user._id // используем req.user
// });
///
module.exports.createCard = async (req, res, next) => {
  // console.log(req.user._id); // _id станет доступен
  try {
    const { name, link } = req.body;
    const newCard = await new Card({ name, link, owner: req.user._id });
    return res.status(httpConstants.HTTP_STATUS_CREATED).send(await newCard.save());
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new BadRequest("Переданы некорректные данные"));
      //return res.status(new BadRequest).send({ message: "Переданы некорректные данные", ...err });
      //return new BadRequest("Переданы некорректные данные");
    } else {
      return next(err);
    }
    //throw err; // проброс (*)
    //return res.status(new InternalServerError).send({ message: "Ошибка на стороне сервера" });
    //return new InternalServerError("Ошибка на стороне сервера");
  }
  }
//};
module.exports.deleteCard = async (req, res, next) => {
  const objectID = req.params.cardId;
  await Card.findById(objectID)
    .orFail(() => {
      throw new NotFoundError("Карточка не найдена");
      //return res.status(NotFoundError).send({ message: "Карточка не найдена" });
    })
    .then((card) => {
      const owner = card.owner.toString();
      if (req.user._id === owner) {
        Card.deleteOne(card)
          .then(() => {
            return res.status(httpConstants.HTTP_STATUS_OK).send(card);
          })
          .catch(next);
      } else {
        return next(new ForbiddenError("Нет прав на удаление карточки"));
        //res.status(new ForbiddenError).send({ message: "Нет прав на удаление карточки" });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequest("Передан не валидный id"));
        //res.status(new BadRequest).send({ message: "Передан не валидный id" });
      } else {
        return next(err);
      }
      //throw err; // проброс (*)
      //return res.status(new InternalServerError).send({ message: "Ошибка на стороне сервера" });
    });
};
module.exports.likeCard = async (req, res, next) => {
  try {
    const likesCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
      .orFail(() => {
        throw new NotFoundError("Карточка не найдена");
        //return res.status(NotFoundError).send({ message: "Карточка не найдена" });
      })
      return res.status(httpConstants.HTTP_STATUS_CREATED).send(await likesCard.save());
  } catch (err) {
    if (err.name === "CastError") {
      return next(new BadRequest("Передан не валидный id"));
      //return res.status(new BadRequest).send({ message: "Передан не валидный id" });
    } else {
      return next(err);
    }
    //throw err; // проброс (*)
    //return res.status(new InternalServerError).send({ message: "Ошибка на стороне сервера" });
  }
}
module.exports.dislikeCard = async (req, res, next) => {
  try {
    const dislike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    )
    if (!dislike) {
      throw new NotFoundError("Карточка не найдена");
      //throw new Error("NotFoundError");
    }
    return res.status(httpConstants.HTTP_STATUS_OK).send(await dislike.save());
  } catch (err) {
    if (err.message === "NotFound") {
      return next(new NotFoundError("Карточка не найдена"));
      //return res.status(new NotFoundError).send({ message: "Карточка не найдена" });
    }
    if (err.name === "CastError") {
      return next(new BadRequest("Передан не валидный id"));
      //return res.status(new BadRequest).send({ message: "Передан не валидный id" });
    } else {
      return next(err);
    }
    //throw err; // проброс (*)
    //return res.status(new InternalServerError).send({ message: "Ошибка на стороне сервера" });
  }
}