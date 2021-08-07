const Movie = require('../models/movie');

const BadRequest = require('../middlewares/errors/BadRequest');
const NotFoundError = require('../middlewares/errors/NotFoundError');
const Forbidden = require('../middlewares/errors/Forbidden');

const getFilms = (req, res, next) => {
  const owner = req.user._id;

  Movie.find({ owner })
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
};
const addFilm = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
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
    trailer,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => {
      if (!movie) throw new BadRequest('Переданы некоректные данные');

      res.send({ movie });
    })
    .catch(next);
};
const deleteFilm = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) throw new NotFoundError('Фильм по указанному _id не найден');

      if (String(movie.owner) !== req.user._id) throw new Forbidden('Невозможно удалить чужой фильм');

      Movie.deleteOne({ _id: movie._id })
        .then((removedMovie) => res.send(removedMovie))
        .catch(next);
    })
    .catch(next);
};

module.exports = {
  addFilm,
  getFilms,
  deleteFilm,
};
