const Movie = require('../models/movie');

// Импорт ошибок
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

// GET /movies — возвращает все фильмы movies
const getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => res.send(movies))
    .catch(next);
};

// POST /movies — создаёт movies
const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании фильма.'));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  console.log(movieId);
  console.log(owner)
  const { movieId } = req.params;
  const owner = req.user._id;

  Movie.findById(movieId)
    .then((movies) => {
      console.log(1);
      if (!movies) {
        throw new NotFoundError('Фильм с указанным _id не найден.');
      } else if (movies.owner.toString() === req.user._id.toString()) {
        console.log(2);
        return Movie.findByIdAndRemove(movieId)
          .then((deletedMovie) => {
            console.log(3);
            res.status(200).send({ data: deletedMovie });
          })
      }
      return next(new ForbiddenError('Чужой фильм нельзя удалить.'));
    })
     .catch((err) => {
       if (err.name === 'CastError') {
         return next(new BadRequestError('Переданы некорректные данные.'));
       }
       console.log(4);
       return next(err);
     });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
