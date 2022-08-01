const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

/* eslint-disable consistent-return */
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) { // убеждаемся, что он есть или начинается с Bearer
    return next(new Unauthorized('Необходима авторизация'));
  }
  const token = authorization.replace('Bearer ', '');

  let payload;
  console.log(3);
  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    // отправим ошибку, если не получилось
    next(new Unauthorized('Необходимо авторизоваться'));
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};
