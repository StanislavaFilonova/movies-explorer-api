const express = require('express');

const router = express.Router();
const { login, createUser,logout } = require('../controllers/users');

const userRouter = require('./users');
const moviesRouter = require('./movies');
const NotFoundError = require('../errors/NotFoundError');
const auth = require('../middlewares/auth');

const {
  validatySignup,
  validatySignin,
} = require('../middlewares/validation');

// роуты, не требующие авторизации
router.post('/signup', validatySignup, createUser);
router.post('/signin', validatySignin, login);
router.get('/logout', logout);

// авторизация
router.use(auth);

router.use('/users', userRouter);
router.use('/movies', moviesRouter);
router.all('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден.'));
});

module.exports = router;
