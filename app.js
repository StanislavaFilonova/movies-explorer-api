require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes/routes');

const allowedCors = require('./utils/cors');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
// Подключаем корсы
app.use(allowedCors);

app.use(bodyParser.json()); // Собирание json
app.use(bodyParser.urlencoded({ extended: true })); // Приём страниц внутри Post-запроса
app.use(cookieParser());

app.use(requestLogger); // подключаем логгер запросов

// Краш-тест сервера
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(routes);

app.use(errorLogger); // подключаем логгер ошибок

// обработка ошибок celebrate по умолчанию
app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
