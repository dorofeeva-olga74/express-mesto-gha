const Card = require('../models/Card');
module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Ошибка на стороне сервера", error: error.message });
  }
};

module.exports.createCard = async (req, res) => {
  // console.log(req.user._id); // _id станет доступен
  try {
    const { name, link } = req.body;
    const newCard = await new Card({ name, link, owner: req.user._id });
    return res.status(201).send(await newCard.save());
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .send({ message: "Ошибка валидации полей", ...error });
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
            res.status(200).send(card);
            //res.status(200).send({ data: card })
          })
          .catch(() => {
            res.status(500).send({ message: "На сервере произошла ошибка" })
          })
      } else {
        throw new ForbiddenError("Нет прав на удаление карточки");
      }
      // if (card.owner.equals(req.user._id)) {
      //   Card.deleteOne(card)
      //     .then(() => {
      //       //res.status(200).send({ data: card })
      //       res.status(200).send(card);
      //     })
      //     .catch(() => {
      //       res.status(500).send({ message: "На сервере произошла ошибка" })
      //     })
      // } else {
      //   throw new ForbiddenError("Нет прав на удаление карточки");
      // }
    })
    .catch((err) => {
      if (err.massage === "NotValidId") {
        return res.status(404).send({ message: "Карточка не найдена" });
       } else {
         res.status(500).send({ message: "На сервере произошла ошибка" })
       };
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
//         return res.status(404).send({ message: "Карточка не найдена" });
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
      throw new Error("NotFound");
    }
    return res
      .status(201)
      .send(await likesCard.save());
  } catch (error) {
    if (error.message === "NotFound") {
      return res.status(404).send({ message: "Карточка не найдена", ...error });
    }
    if (error.name === "CastError") {
      return res.status(400).send({ message: "Передан не валидный id" });
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
      throw new Error("NotFound");
    }
    return res
      .status(200)
      .send(await dislike.save());
  } catch (error) {
    if (error.message === "NotFound") {
      return res.status(404).send({ message: "Карточка не найдена" });
    }

    if (error.name === "CastError") {
      return res.status(400).send({ message: "Передан не валидный id" });
    }
  }
}