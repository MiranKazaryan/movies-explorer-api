const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    validate: {
      validator: (image) => validator.isURL(image),
    },
    required: true,
  },
  trailerLink: {
    type: String,
    validate: {
      validator: (trailer) => validator.isURL(trailer),
    },
  },
  thumbnail: {
    type: String,
    validate: {
      validator: (image) => validator.isURL(image),
    },
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    required: true,
    type: Number,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
  },
});

module.exports = mongoose.model('movie', movieSchema);
