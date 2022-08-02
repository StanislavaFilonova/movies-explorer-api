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

// const deleteMovie = (req, res, next) => {
//   console.log(req.params);
//   Movie.findById(req.params.movieId)
//     .then((movies) => {
//       if (!movies) {
//         return next(new NotFoundError('Фильм с указанным _id не найден.'));
//       }
//       if (JSON.stringify(req.user._id) !== JSON.stringify(movies.owner)) {
//         return next(new ForbiddenError('Чужой фильм нельзя удалить.'));
//       }
//       return Movie.deleteOne(movies).then(() => res.send(movies));
//     })
//      .catch((err) => {
//        if (err.name === 'CastError') {
//          return next(new BadRequestError('Переданы некорректные данные.'));
//        }
//        return next(err);
//      });
// };
// удаляет фильм
const deleteMovie = (req, res, next) => {
  console.log(filmid);
  console.log(owner)
  const filmid = req.params.movieId;
  const owner = req.user._id;
  Movie.findById(filmid)
    .orFail(() => new NotFoundError('Фильм с указанным _id не найден.'))
    .then((movie) => {
      if (!movie.owner.equals(owner)) {
        return next(new ForbiddenError('Чужой фильм нельзя удалить.'));
      }
      return movie.remove()
        .then(() => res.send({ data: movie }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
