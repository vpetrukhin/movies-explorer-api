const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');

const { createUser, login } = require('./controllers/users');
const userRouter = require('./routes/users');
const movieRouter = require('./routes/movies');
const { errorHandler } = require('./middlewares/errorHandler');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/filmslistdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})

app.use(express.json());

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  })
}) , createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  })
}), login)

app.use('/users', auth, userRouter);
app.use('/movies', auth, movieRouter);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log('App listening on port 3000');
})