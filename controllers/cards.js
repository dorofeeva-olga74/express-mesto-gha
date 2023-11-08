const Card = require('../models/Card');
//{ getCards, createCard, deleteCard, likeCard, dislikeCard }
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
  console.log(req.user._id); // _id станет доступен
  try {
    const {name, link} = req.body;
    //console.log(req.body)
    const newCard = await new Card({name, link, owner: req.user._id}, { new: "true", runValidators: "true" } );
    return res
          .status(201)
          .send(newCard);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .send({ message: "Ошибка валидации полей", ...error });
    }
  }
};
module.exports.deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params.cardId;
    const card = await Card.findById(cardId);
    const validationRegExp = new RegExp(/\w{24}/gm);
    const isValidate = validationRegExp.test(cardId);
    if (!isValidate) {
      return res.status(400).send({ message: "Переданы некорректные данные" });
    }
    if (!card) {
      throw new Error("NotFound");
    }
    if (!card.owner.equals(req.user._id)) { //Васька.equals(Мурзик) //equals -сравнение
      throw new Error("Нет доступа для удаления карточки");
    }
    Card.deleteOne(card)
    return res
       .status(200)
       .send({ message: "Карточка удалена" });
    } catch (error) {
      if (error.message === "NotFound") {
        return res.status(404).send({ message: "Карточка не найдена", ...error });
      }
    return res
      .status(500)
      .send({ message: "Ошибка на стороне сервера", error: error.message });
  }
}
module.exports.likeCard = async (req, res) => {
  try {
    const likesCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
    return res
      .status(201)
      .send(await likesCard.save());//???
    //res.status(200).send(card);
  } catch (error) {
    if (error.message === "NotFound") {
      return res.status(404).send({ message: "Пользователь не найден", ...error });
    }
    if (error.name === "CastError") {
      return res.status(400).send({ message: "Передан не валидный id" });
    }
  }}
// Requiring ObjectId from mongoose npm package
// const ObjectId = require('mongoose').Types.ObjectId;
// // Validator function
// function isValidObjectId(id){
//     if(ObjectId.isValid(id)){
//         if((String)(new ObjectId(id)) === id)
//             return true;
//         return false;
//     }
//     return false;
// }
module.exports.dislikeCard = async (req, res) => {
  try {
    const dislike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    )
    return res
      .status(201)
      .send(await dislike.save());//???
    //res.status(200).send(card);
  } catch (error) {
    if (error.message === "NotFound") {
      return res.status(404).send({ message: "Карточка не найдена" });
    }

    if (error.name === "CastError") {
      return res.status(400).send({ message: "Передан не валидный id" });
    }
  }
}