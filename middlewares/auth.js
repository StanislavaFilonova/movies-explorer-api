
//   // const token = req.cookies.jwt;
//   const { authorization } = req.headers;
//   const token = authorization.replace('Bearer ', '');
//   console.log(token);
//
//   if (!token) {
//     throw new Unauthorized('Необходима авторизация');
//   }
//   let payload;
//   try {
//     // попытаемся верифицировать токен
//     payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
//   } catch (err) {
//     // отправим ошибку, если не получилось
//     next(new Unauthorized('Необходимо авторизоваться'));
//   }
//   req.user = payload; // записываем пейлоуд в объект запроса
//
//   next(); // пропускаем запрос дальше
// };


const jwtToken = require('jsonwebtoken');
const Unauthorized = require('../errors/UnauthorizedError');
const { KEY_JWT } = require('../utils/constants');

/* eslint-disable consistent-return */
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Unauthorized('Необходимо авторизоваться');
  }
  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    payload = jwtToken.verify(token, KEY_JWT);
    req.user = payload;
    next();
  } catch (err) {
    next(new Unauthorized('Необходимо авторизоваться'));
  }
};
