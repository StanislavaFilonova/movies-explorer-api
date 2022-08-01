const jwtToken = require('jsonwebtoken');
const Unauthorized = require('../errors/UnauthorizedError');
const { NODE_ENV, JWT_SECRET } = process.env;

/* eslint-disable consistent-return */
module.exports = (req, res, next) => {
  const { jwt } = req.cookies;

  if (!jwt || !jwt.startsWith('Bearer ')) {
    throw new Unauthorized('Необходима авторизация');
  }
  const token = jwt.replace('Bearer ', '');

  let payload;
  try {
    // попытаемся верифицировать токен
    payload = jwtToken.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
    req.user = payload; // записываем пейлоуд в объект запроса
    next(); // пропускаем запрос дальше
  } catch (err) {
    // отправим ошибку, если не получилось
    next(new Unauthorized('Необходимо авторизоваться'));
  }
};
