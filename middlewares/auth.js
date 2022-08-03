const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/UnauthorizedError');
const needAuthorization = require('../errors/errorMessages')

const { KEY_JWT } = require('../utils/constants');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) { // убеждаемся, что он есть или начинается с Bearer
    next(new Unauthorized(needAuthorization));
  }
  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, KEY_JWT);
  } catch (err) {
    // отправим ошибку, если не получилось
    next(new Unauthorized(needAuthorization));
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};

module.exports = auth;
