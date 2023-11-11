const { StatusOK, StatusCreatedOK, BadRequest, ForbiddenError, NotFoundError, InternalServerError } = require("../errors/errors");
const Card = require('../models/Card');
module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    return res.send(cards);
  } catch (err) {
    return res.status(InternalServerError).send({ message: "Ошибка на стороне сервера", err: err.message });
  }
};
module.exports.createCard = async (req, res) => {
  // console.log(req.user._id); // _id станет доступен
  try {
    const { name, link } = req.body;
    const newCard = await new Card({ name, link, owner: req.user._id });
    return res.status(StatusCreatedOK).send(await newCard.save());
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(BadRequest).send({ message: 'Переданы некорректные данные для создания карточки', ...err });
    }
    return res.status(InternalServerError).send({ message: "Ошибка на стороне сервера" });
  }
};
module.exports.deleteCard = async (req, res, next) => {
  const objectID = req.params.cardId;
  await Card.findById(objectID)
    .orFail(() => {
      return res.status(NotFoundError).send({ message: "Карточка не найдена" });
    })
    .then((card) => {
      const owner = card.owner.toString();
      if (req.user._id === owner) {
        Card.deleteOne(card)
          .then(() => {
            res.status(StatusOK).send(card);
          })
          .catch(next);
      } else {
        res.status(ForbiddenError).send({ message: "Нет прав на удаление карточки" });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(BadRequest).send({ message: "Передан не валидный id" });
      }
      return res.status(InternalServerError).send({ message: "Ошибка на стороне сервера" });
    });
};
module.exports.likeCard = async (req, res) => {
  try {
    const likesCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
      .orFail(() => {
        return res.status(NotFoundError).send({ message: "Карточка не найдена" });
      })
    return res.status(StatusCreatedOK).send(await likesCard.save());
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(BadRequest).send({ message: "Передан не валидный id" });
    }
    return res.status(InternalServerError).send({ message: "Ошибка на стороне сервера" });
  }
}
module.exports.dislikeCard = async (req, res) => {
  try {
    const dislike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    )
    if (!dislike) {
      throw new Error("NotFoundError");
    }
    return res
      .status(StatusOK)
      .send(await dislike.save());
  } catch (err) {
    if (err.message === "NotFoundError") {
      return res.status(NotFoundError).send({ message: "Карточка не найдена" });
    }
    if (err.name === "CastError") {
      return res.status(BadRequest).send({ message: "Передан не валидный id" });
    }
    return res.status(InternalServerError).send({ message: "Ошибка на стороне сервера" });
  }
}