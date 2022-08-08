const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { invalidAuth, notMatchedMail } = require('../errors/errorMessages');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: notMatchedMail,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 5,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

// добавим метод findUserByCredentials схеме пользователя
userSchema.statics.findUserByCredentials = function findUser(email, password) {
  // попытаемся найти пользователя по почте
  return this.findOne({ email }).select('+password') // this — это модель User
    .then((user) => {
      // не нашёлся — отклоняем промис
      if (!user) {
        return Promise.reject(new UnauthorizedError(invalidAuth));
      }
      // нашёлся — сравниваем хеши
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError(invalidAuth));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
