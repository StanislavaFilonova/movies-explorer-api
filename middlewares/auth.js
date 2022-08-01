const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

/* eslint-disable consistent-return */
module.exports = (req, res, next) => {
  // const token = req.cookies.jwt;
  const { authorization } = req.headers;
  console.log(1);
  const token = authorization.replace('Bearer ', '');
  console.log(2);
  if (!token) {
    throw new Unauthorized('Необходима авторизация');
  }
  let payload;
  console.log(3);
  try {
    // попытаемся верифицировать токен
    console.log("testPayload");
    console.log(token);
    console.log(NODE_ENV);
    console.log(JWT_SECRET);
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    // отправим ошибку, если не получилось
    console.log('testToken');
    next(new Unauthorized('Необходимо авторизоваться'));
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  console.log(4);
  next(); // пропускаем запрос дальше
};
