// const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken
const User = require('../models/user');
// ------------------------------------------------------------------------------------------------
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const NotFoundError = require('../errors/NotFoundError');
const {
  notFoundUserId,
  incorrectData,
  userAlreadyCreated,
  invalidAuth,
} = require('../errors/errorMessages');

const { KEY_JWT } = require('../utils/constants');

// ------------------------------------------------------------------------------------------------
// POST /signup — создаём пользователя по обязательным полям email и pass
const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  // хешируем пароль
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash, // записываем хеш в базу
    }))
    .then((user) => User.findById(user._id)).then((user) => {
      res.status(200).send({
        name: user.name,
        _id: user._id,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(incorrectData));
      } else if (err.code === 11000) { // Ошибка дублирования ключа
        next(new ConflictError(userAlreadyCreated));
      } else {
        next(err);
      }
    });
};

// ------------------------------------------------------------------------------------------------
// login (/POST) Залогирование пользователя/авторизация пользователя по паролю и эмейлу
const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, KEY_JWT, { expiresIn: '7d' }); // Параметры: пейлоуд токена и секретный ключ
      res.send({ token });
      // аутентификация успешна! пользователь в переменной user
    })
    .catch(() => {
      // возвращаем ошибку аутентификации
      next(new UnauthorizedError(invalidAuth));
    });
};
// ------------------------------------------------------------------------------------------------
// GET /users/me — возвращает информацию о текущем пользователе
const getUser = (req, res, next) => {
  // Запустим проверку валидности параметров
  User.findById(req.user._id)
    .then((user) => {
      if (user == null) {
        next(new NotFoundError(notFoundUserId));
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => next(err));
};
// ------------------------------------------------------------------------------------------------
// PATCH /users/me — обновляет информацию о пользователе (имя и почтовый адрес)
const updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new NotFoundError(notFoundUserId));
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(incorrectData));
      } else {
        next(err);
      }
    });
};

// ------------------------------------------------------------------------------------------------
module.exports = {
  createUser,
  login,
  getUser,
  updateProfile,
};
