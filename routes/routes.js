const express = require('express');

const router = express.Router();
const { login, createUser } = require('../controllers/users');

const userRouter = require('./users');
const moviesRouter = require('./movies');
const NotFoundError = require('../errors/NotFoundError');
const auth = require('../middlewares/auth');

const {
  validatySignup,
  validatySignin,
} = require('../middlewares/validation');

// Краш-тест сервера
router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
    }, 0);
});

// роуты, не требующие авторизации
router.post('/signup', validatySignup, createUser);
router.post('/signin', validatySignin, login);

// авторизация
router.use(auth);

router.use('/users', userRouter);
router.use('/movies', moviesRouter);
router.all('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден.'));
});

module.exports = router;
