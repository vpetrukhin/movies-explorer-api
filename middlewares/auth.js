const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;
const Unauthorized = require('./errors/Unauthorized');

const auth = (req, res, next) => {
  const { authorization } = req.headers;


  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Unauthorized('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    throw new Unauthorized('Необходима авторизация');
  }

  req.user = payload;

  next();
}

module.exports = auth;