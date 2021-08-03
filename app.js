const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');

const { createUser, login } = require('./controllers/users');
const userRouter = require('./routes/users');
const movieRouter = require('./routes/movies');
const { errorHandler } = require('./middlewares/errorHandler');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { sourcesCorsHandler } = require('./middlewares/CORS');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const { PORT = 3000 } = process.env;

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
});

const app = express();

app.use(helmet());

mongoose.connect('mongodb://localhost:27017/filmslistdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})

app.use(express.json());

app.use(requestLogger);
app.use(limiter);
app.use(sourcesCorsHandler);

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

app.use('/*', (req, res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
})