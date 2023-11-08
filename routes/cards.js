// GET /cards — возвращает все карточки
// POST /cards — создаёт карточку
// DELETE /cards/:cardId — удаляет карточку по идентификатору
// PUT /cards/:cardId/likes — поставить лайк карточке
// DELETE /cards/:cardId/likes — убрать лайк с карточки
// создадим express router
const cardRouter = require('express').Router();
const { getCards, createCard, deleteCard, likeCard, dislikeCard } = require('../controllers/cards.js');
//import { Router } from "express";
//const cardRouter = Router();

// Здесь роутинг
cardRouter.get('/', getCards);
cardRouter.post('/', createCard);
cardRouter.delete('/:cardId', deleteCard);
cardRouter.put('/:cardId/likes', likeCard);
cardRouter.delete('/:cardId/likes', dislikeCard);
// экспортируем его
module.exports = cardRouter; // экспортировали роутер