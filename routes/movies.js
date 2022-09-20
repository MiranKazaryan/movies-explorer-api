const movieRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getMovies,
  createMovie,
  deleteMovie
} = require('../controllers/movies');

movieRouter.get('/', getMovies);

movieRouter.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(30),
    director: Joi.string().required().min(2).max(30),
    duration: Joi.number().required(),
    year: Joi.date().required(),
    description: Joi.string().required().min(2),
    image: Joi.string()
    .required()
    .pattern(
      /(http(s)?:\/\/)?(www\.)?[A-Za-zА-Яа-я0-9-]*\.[A-Za-zА-Яа-я0-9-]{2,8}(\/?[\wа-яА-Я#!:.?+=&%@!_~[\]$'*+,;=()-]*)*/,
    ),
    trailer: Joi.string()
    .required()
    .pattern(
      /(http(s)?:\/\/)?(www\.)?[A-Za-zА-Яа-я0-9-]*\.[A-Za-zА-Яа-я0-9-]{2,8}(\/?[\wа-яА-Я#!:.?+=&%@!_~[\]$'*+,;=()-]*)*/,
    ),
    nameRU: Joi.string().required().min(1),
    nameEN: Joi.string().required().min(1),
    thumbnail: Joi.string()
    .required()
    .pattern(
      /(http(s)?:\/\/)?(www\.)?[A-Za-zА-Яа-я0-9-]*\.[A-Za-zА-Яа-я0-9-]{2,8}(\/?[\wа-яА-Я#!:.?+=&%@!_~[\]$'*+,;=()-]*)*/,
    ),
    movieId: Joi.string().required(),
  }),
}), createMovie);

movieRouter.delete('/:movieId',celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), deleteMovie);

module.exports = movieRouter;
