const { MONGODB_URL, NODE_ENV, JWT_SECRET } = process.env;

const KEY_JWT = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';

module.exports = {
  KEY_JWT,
};
