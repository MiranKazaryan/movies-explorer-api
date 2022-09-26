const Movie = require('../models/movie');
const BAD_REQUEST = require('../errors/BadRequesError');
const NOT_FOUND = require('../errors/NotFoundError');
const FORBIDDEN = require('../errors/ForbiddenError');

// получение всех карточек
const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};
// создание карточки
const createMovie = (req, res, next) => {
  const { country, director, duration, year, description, image, trailerLink, nameRU, nameEN, thumbnail, movieId } = req.body;
  Movie.create({ country, director, duration, year, description, image, trailerLink, nameRU, nameEN, thumbnail, movieId, owner: req.user._id })
    .then((movie) => res.status(201).send(movie))
    .catch((e) => {
      console.log(e);
      if (e.name === 'ValidationError') {
        next(new BAD_REQUEST('Error validating movie'));
      } else {
        next(e);
      }
    });
};
// удаление карточек
const deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .orFail(() => {
      throw new NOT_FOUND('Movie not found');
    })
    .then((movie) => {
      if (movie.owner._id.toString() !== req.user._id) {
        throw new FORBIDDEN('Can not delete this movie');
      }
      return movie.remove().then(() => {
        res.send({ message: 'movie deleted' });
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BAD_REQUEST('Data is not correct'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie
};
