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
  } catch (err) {
    next(new Unauthorized('Необходимо авторизоваться'));
  }

  req.user = payload;

  next();
};
