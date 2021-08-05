const router = require('express').Router();
const validator = require('validator');
const { celebrate, Joi } = require('celebrate');

const { addFilm, getFilms, deleteFilm } = require('../controllers/movies');
const NotValid = require('../middlewares/errors/NotValid');

const isURL = (value) => {
  const result = validator.isURL(value);
  if (!result) throw new NotValid('Передан некорректный URL');
  return value;
};

router.get('/', getFilms);
router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(isURL),
    trailer: Joi.string().required().custom(isURL),
    thumbnail: Joi.string().required().custom(isURL),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), addFilm);
router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
}), deleteFilm);

module.exports = router;
