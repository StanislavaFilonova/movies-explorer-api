const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const isURL = (v) => {
  const result = validator.isURL(value, { require_protocol: true });
  if (result) {
    return value;
  }
  throw new Error('Неверный формат ссылки.');
};
const validatyUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
  }),
});
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
})
// const validatyCard = celebrate({
//   body: Joi.object().keys({
//     name: Joi.string().required().min(2).max(30),
//     link: Joi.string().required().pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/),
//   }),
// });
//
const  validatyMovieId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex(),
  }),
});
//
// const validatyUserId = celebrate({
//   params: Joi.object().keys({
//     userId: Joi.string().length(24).hex(),
//   }),
// });



// const validatySignup = celebrate({
//   body: Joi.object().keys({
//     name: Joi.string().min(2).max(30),
//     about: Joi.string().min(2).max(30),
//     avatar: Joi.string().pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/),
//     email: Joi.string().required().email({ minDomainSegments: 2 }),
//     password: Joi.string().required(),
//   }),
// });
//
// const validatySignin = celebrate({
//   body: Joi.object().keys({
//     email: Joi.string().required().email({ minDomainSegments: 2 }),
//     password: Joi.string().required(),
//   }),
// });

module.exports = {
  validatyMovie,
  validatyMovieId,
  validatyUserId,
  validatyUser,
  validatyAvatar,
  validatySignup,
  validatySignin,
};
