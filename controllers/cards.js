const httpConstants = require("http2").constants;//200//status(httpConstants.HTTP_STATUS_OK)
const BadRequest = require("../errors/BadRequest");//400
const NotFoundError = require("../errors/NotFoundError");//404
const ForbiddenError = require("../errors/ForbiddenError");//403
const InternalServerError = require("../errors/InternalServerError");//500
//const ERROR_CODE = 400;
//if (err.name === 'SomeErrorName') return res.status(ERROR_CODE).send(...)

//then((card) => res.status(httpConstants.HTTP_STATUS_OK).send(card))
const Card = require('../models/Card');
module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    return res.send(cards);
  } catch (err) {
    return res
      .status(InternalServerError)
      .send({ message: "Ошибка на стороне сервера", err: err.message });
  }
};

module.exports.createCard = async (req, res) => {
  // console.log(req.user._id); // _id станет доступен
  try {
    const { name, link } = req.body;
    const newCard = await new Card({ name, link, owner: req.user._id });
    return res.status(201).send(await newCard.save());
  } catch (err) {
    if (err.name === "ValidationError") {
      return res
        .status(BadRequest)
        .send({ message: "Ошибка валидации полей", ...err });
    }
  }
};
module.exports.deleteCard = async (req, res) => {
  const objectID = req.params.cardId;
  Card.findById(objectID)
    .orFail(() => {
      throw new NotFoundError("Карточка не найдена");
    //throw new Error("NotValidId");
    })
    .then((card) => {
      const owner = card.owner.toString();
      if (req.user._id === owner) {
        Card.deleteOne(card)
          .then(() => {
            res.status(httpConstants.HTTP_STATUS_OK).send(card);
            //res.status(200).send({ data: card })
          })
          .catch((err) => {
            res.status(BadRequest).send({ message: "Передан не валидный id", ...err })
          })
      } else {
        throw new ForbiddenError("Нет прав на удаление карточки");
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BadRequest).send({ message: "Передан не валидный id" });
      }
      return res.status(NotFoundError).send({ message: "Карточка не найдена" });
      //res.status(500).send({ message: "На сервере произошла ошибка" })
    });
};
// module.exports.deleteCard = async (req, res) => {
//   const objectID = req.params.cardId;
//   Card.findByIdAndRemove(objectID)
//   .orFail(() => {
//     throw new Error("NotFound");
//   })
//     .then((card) => {
//       if (!card) {
//         return res.status(NotFoundError).send({ message: "Карточка не найдена" });
//       }
//       res.send({ data: card });
//     })
//     .catch(() =>
//       res.status(500).send({ message: "На сервере произошла ошибка" })
//     );
// };
/////
// module.exports.deleteCard = (req, res, next) => {
//   const { cardId } = req.params;
//   Card.findById(cardId)
//     .orFail(() => {
//       throw new NotFound('Карточка с указанным  _id не найдена');
//     })
//     .then((card) => {
//       const owner = card.owner.toString();
//       if (req.user._id === owner) {
//         Card.deleteOne(card)
//           .then(() => {
//             res.status(200).send(card);
//           })
//           .catch(next);
//       } else {
//         throw new Forbidden('Вы можете удалять только свои карточки');
//       }
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         next(new BadRequest('Переданы некорректные данные'));
//       } else {
//         next(err);
//       }
//     });
// };
/////

module.exports.likeCard = async (req, res) => {
  try {
    const likesCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
    if (!likesCard) {
      throw new Error("NotFoundError");
    }
    return res
      .status(201)
      .send(await likesCard.save());
  } catch (err) {
    if (err.message === "NotFoundError") {
      return res.status(NotFoundError).send({ message: "Карточка не найдена", ...err });
    }
    if (err.name === "CastError") {
      return res.status(BadRequest).send({ message: "Передан не валидный id" });
    }
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
      .status(httpConstants.HTTP_STATUS_OK)
      .send(await dislike.save());
  } catch (err) {
    if (err.message === "NotFoundError") {
      return res.status(NotFoundError).send({ message: "Карточка не найдена" });
    }

    if (err.name === "CastError") {
      return res.status(BadRequest).send({ message: "Передан не валидный id" });
    }
  }
}