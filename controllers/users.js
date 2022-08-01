// const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken
const User = require('../models/user');
// ------------------------------------------------------------------------------------------------
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const NotFoundError = require('../errors/NotFoundError');

const { NODE_ENV, JWT_SECRET } = process.env;

// ------------------------------------------------------------------------------------------------
// POST /signup — создаём пользователя по обязательным полям email и password
const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  // Поля email и password обязательны, добавим проверку: если поля не заполнены, вернем ошибку
  if (!email || !password) {
    next(new BadRequestError('Поля email и password обязательны'));
  } else {
    // проверяеим, что пользователь с указанным email еще не создан
    User.findOne({ email })
      .then((result) => {
        if (result) {
          next(new ConflictError('Пользователь с таким email уже существует.'));
        } else {
          // хешируем пароль
          bcrypt.hash(password, 10)
            .then((hash) => User.create({
              name,
              email,
              password: hash, // записываем хеш в базу
            })
              .then((user) => User.findById(user._id)).then((user) => {
                res.status(200).send({
                  name: user.name,
                  _id: user._id,
                  email: user.email,
                });
              })
              .catch((err) => {
                if (err.name === 'ValidationError') {
                  next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
                } else if (err.code === 11000) { // Ошибка дублирования ключа
                  next(new ConflictError('Пользователь с таким email уже существует.'));
                } else {
                  next(err);
                }
              }));
        }
      }).catch((err) => {
      next(err);
    });
  }
};
// ------------------------------------------------------------------------------------------------
// login (/POST) Залогирование пользователя/авторизация пользователя по паролю и эмейлу
const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' }); // Параметры: пейлоуд токена и секретный ключ
      // res.cookie('jwt', `Bearer ${token}`, {
      //  maxAge: 3600000,
      //  httpOnly: true,
      //  sameSite: 'none',
      //  secure: true,
      // })
      res.send({ token });
      // аутентификация успешна! пользователь в переменной user
    })
    .catch(() => {
      // возвращаем ошибку аутентификации
      next(new UnauthorizedError('Неправильные почта или пароль.'));
    });
};
// ------------------------------------------------------------------------------------------------
// GET /users/me — возвращает информацию о текущем пользователе
const getUser = (req, res, next) => {
  // Запустим проверку валидности параметров
  User.findById(req.user._id)
    .then((user) => {
      if (user == null) {
        next(new NotFoundError('Пользователь с данным Id не найден'));
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.user === 'CastError') {
        next(new BadRequestError('Введен некорректный id'));
      } else {
        next(err);
      }
    });
};
// ------------------------------------------------------------------------------------------------
// PATCH /users/me — обновляет информацию о пользователе (имя и почтовый адрес)
const updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении пользователя'));
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
