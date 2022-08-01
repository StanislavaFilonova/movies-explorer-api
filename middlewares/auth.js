const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

/* eslint-disable consistent-return */
module.exports = (req, res, next) => {
  // const token = req.cookies.jwt;
  const { authorization } = req.headers;
  const token = authorization.replace('Bearer ', '');

  if (!token) {
    throw new Unauthorized('Необходима авторизация');
  }
  let payload;
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
