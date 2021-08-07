// eslint-disable-next-line no-unused-vars
module.exports.errorHandler = (err, req, res, next) => {
  const {
    message,
  } = err;
  const statusCode = err.statusCode || 500;

  res.status(statusCode).send({
    message: statusCode === 500
      ? `На сервере произошла ошибка ${err}`
      : message,
  });
};
