const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const User = require('../models/user');
const MongoError = require('../middlewares/errors/MongoError');
const BadRequest = require('../middlewares/errors/BadRequest');
const NotFoundError = require('../middlewares/errors/NotFoundError');

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) throw new MongoError('Пользователь с таким email уже существует');

      bcrypt.hash(password, 10)
        .then((hash) => User.create({
          name,
          email,
          password: hash,
        })
          .then((candidate) => {
            if (!candidate) throw new BadRequest('Переданы некорректные данные при создании пользователя');

            res.send({
              name: candidate.name,
              email: candidate.email,
            });
          })
          .catch((err) => {
            if (err._message === 'user validation failed') {
              return next(new BadRequest('Переданы некорректные данные при создании пользователя'));
            }
            return (err);
          }));
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) throw new NotFoundError('Пользователь не найден');

      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' },
      );

      res.send({
        token,
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    })
    .catch(next);
};

const getInfoUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      console.log(user);
      if (!user) throw new NotFoundError("Пользователь не найден");

      res.send({
        name: user.name,
        email: user.email,
      });
    })
    .catch(next);
};

const updateInfoUser = (req, res, next) => {
  const { email, name } = req.body;

  User.findByIdAndUpdate(req.user._id, { email, name }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((user) => {
      if (user) {
        res.send({
          name: user.name,
          email: user.email,
        });
      } else {
        throw new NotFoundError('Пользователь не найден');
      }
    })
    .catch(next);
};

module.exports = {
  createUser,
  login,
  getInfoUser,
  updateInfoUser,
};
