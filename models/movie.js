const mongoose = require('mongoose');

const movieScheme = mongoose.Schema({
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
    required: true,
    // url
  },
  trailer: {
    type: String,
    required: true,
    // url
  },
  thumbnail: {
    type: String,
    required: true,
    // url
  },
  owner: {
    type: moongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: String,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
}, { versionKey: '_somethingElse' })

const movie = mongoose.model('movie', movieScheme);

module.exports = movie;