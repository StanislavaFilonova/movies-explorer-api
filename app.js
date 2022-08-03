require('dotenv').config();
// const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const errorHandler = require('./middlewares/errorHandler');
// const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const rateLimiter = require('./middlewares/rateLimiter');
const { BD_URL } = require('./utils/constants');

// const {
//   login,
//   createUser,
// } = require('./controllers/users');

const allowedCors = require('./utils/cors');

// const { validatySignup, validatySignin } = require('./middlewares/validation');

// const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3000 } = process.env;
const app = express();

const router = require('./routes/index');

// const usersRoute = require('./routes/users');
// const moviesRoute = require('./routes/movies');

// подключаемся к серверу mongo
mongoose.connect(BD_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
// Подключаем корсы
app.use(allowedCors);

app.use(requestLogger); // подключаем логгер запросов

app.use(rateLimiter);

app.use(helmet());

app.use(bodyParser.json()); // Собирание json
app.use(bodyParser.urlencoded({ extended: true })); // Приём страниц внутри Post-запроса
app.use(cookieParser());

// // Краш-тест сервера
// app.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Сервер сейчас упадёт');
//   }, 0);
// });

// app.post('/signin', validatySignin, login);
// app.post('/signup', validatySignup, createUser);

// авторизация
// app.use(auth);
// app.use(usersRoute);
// app.use(moviesRoute);

// app.all('*', (req, res, next) => {
//   next(new NotFoundError('Запрашиваемый ресурс не найден.'));
// });
app.use(router);

app.use(errorLogger); // подключаем логгер ошибок

// обработка ошибок celebrate по умолчанию
app.use(errors());

app.use(errorHandler);

app.listen(PORT);
