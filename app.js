// require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');
// const { errors } = require('celebrate');
// const auth = require('./middlewares/auth');
// const errorHandler = require('./middlewares/errorHandler');
// const { requestLogger, errorLogger } = require('./middlewares/logger');
// const {
//   login,
//   createUser,
// } = require('./controllers/users');
//
// const allowedCors = require('./utils/utils');

// const { validatySignup, validatySignin } = require('./middlewares/validity');
//
// const NotFoundError = require('./errors/NotFoundError');

// const { PORT = 3000 } = process.env;
const app = express();

// const usersRoute = require('./routes/users');
// const cardsRoute = require('./routes/cards');

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// app.use(allowedCors);
//
// app.use(bodyParser.json()); // Собирание json
// app.use(bodyParser.urlencoded({ extended: true })); // Приём страниц внутри Post-запроса
// app.use(cookieParser());
//
// app.use(requestLogger); // подключаем логгер запросов
//
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
// app.use(cardsRoute);

// app.all('*', (req, res, next) => {
//   next(new NotFoundError('Запрашиваемый ресурс не найден.'));
// });

// app.use(errorLogger); // подключаем логгер ошибок

// обработка ошибок celebrate по умолчанию
// app.use(errors());

// app.use(errorHandler);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
