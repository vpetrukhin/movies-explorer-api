const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { errors } = require('celebrate');

const indexRouter = require('./routes/index');
const { errorHandler } = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { sourcesCorsHandler } = require('./middlewares/CORS');
const NotFoundError = require('./middlewares/errors/NotFoundError');

const { PORT = 5000, DB_ADDRESS = 'mongodb://localhost:27017/filmslistdb' } = process.env;

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
});

const app = express();

app.use(requestLogger);
app.use(limiter);
app.use(helmet());

mongoose.connect(DB_ADDRESS, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

app.use(express.json());
app.use(sourcesCorsHandler);

app.use(indexRouter);

app.use('/*', (req, res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
