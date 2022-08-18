require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const rateLimiter = require('./middlewares/rateLimiter');
const { BD_URL } = require('./utils/constants');

const allowedCors = require('./utils/cors');

const { PORT = 3001 } = process.env;
const app = express();

const router = require('./routes/index');

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

app.use(router);

app.use(errorLogger); // подключаем логгер ошибок

// обработка ошибок celebrate по умолчанию
app.use(errors());

app.use(errorHandler);

app.listen(PORT);
