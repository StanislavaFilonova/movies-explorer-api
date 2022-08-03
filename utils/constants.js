require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

// const BD_URL = NODE_ENV === 'production' ? MONGODB_URL : 'mongodb://localhost:27017/bitfilmsdb';
const KEY_JWT = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';
module.exports = {
  KEY_JWT,
};
