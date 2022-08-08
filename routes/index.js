const express = require('express');
const { validatySignup, validatySignin } = require('../middlewares/validation');
const usersRoute = require('./users');
const moviesRoute = require('./movies');
const NotFoundError = require('../errors/NotFoundError');
const {
  login,
  createUser,
} = require('../controllers/users');

const auth = require('../middlewares/auth'); // авторизация

const app = express();
// Краш-тест сервера
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// роуты, не требующие авторизации
//  логин
app.post('/signin', validatySignin, login);
//  регистрация
app.post('/signup', validatySignup, createUser);

// авторизация
app.use(auth);

// роуты, которым авторизация нужна
app.use(usersRoute);
app.use(moviesRoute);

app.all('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден.'));
});

module.exports = app;
