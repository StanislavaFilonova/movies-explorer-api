const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const isURL = (value) => {
  const result = validator.isURL(value, { require_protocol: true });
  if (result) {
    return value;
  }
  throw new Error('Неверный формат ссылки.');
};
// Валидауия введенного имени пользователя (PATCH /users/me)
const validatyUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
  }),
});
// Валидауия при создании фильма (Post /movies)
const validatyMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().custom(isURL).required(),
    trailerLink: Joi.string().custom(isURL).required(),
    thumbnail: Joi.string().custom(isURL).required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});
// Валидация идентификатора фильма при удалении фильма (DELETE /movies/_id)
const validatyMovieId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex(),
  }),
});
// Валидация при регистрации пользователя (POST /signup)
const validatySignup = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email({ minDomainSegments: 2 }),
    password: Joi.string().required().min(6),
  }),
});
// Валидация при входе пользователя на страничку (POST /signin)
const validatySignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ minDomainSegments: 2 }),
    password: Joi.string().required().min(6),
  }),
});

module.exports = {
  validatyMovie,
  validatyMovieId,
  validatyUser,
  validatySignup,
  validatySignin,
};
