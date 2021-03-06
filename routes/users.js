const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getInfoUser,
  updateInfoUser,
} = require('../controllers/users');

router.get('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
  }),
}), getInfoUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
}), updateInfoUser);

module.exports = router;
