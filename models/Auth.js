// const mongoose = require('mongoose');

// const authSchema = new mongoose.Schema({
//   email: {
//     type: String, //  — это строка
//     unique: true, // - уникальный элемент
//     required: true, //  — обязательное поле
//     validate: {
//       validator: (email) => validator.isEmail(email),
//       //validator: (v) => validator.isEmail(v),
//       message: 'Введите корректный email',
//     },
//   },
//   password: {
//     type: String, //  — это строка
//     required: true, //  — обязательное поле
//     select: false,
//   },
// }, { versionKey: false }, { timestamps: true });
// // создаём модель и экспортируем её
// module.exports = mongoose.model("auth", authSchema);