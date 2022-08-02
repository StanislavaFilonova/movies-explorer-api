const router = require('express').Router();

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

const {
  validatyMovieId,
  validatyMovie,
} = require('../middlewares/validation');

router.get('/movies', getMovies);
router.post('/movies', validatyMovie, createMovie);
router.delete('/movies/:movieId', validatyMovieId, deleteMovie);

module.exports = router;
