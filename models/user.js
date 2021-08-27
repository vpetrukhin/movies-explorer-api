const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Unathorized = require('../middlewares/errors/Unauthorized');

const userScheme = new mongoose.Schema({
  // _id: mongoose.ObjectId,
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
}, { versionKey: false });

// eslint-disable-next-line func-names
userScheme.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .then((user) => {
      if (!user) throw new Unathorized('Неправильная почта или пароль');

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) throw new Unathorized('Неправильная почта или пароль');

          return user;
        });
    });
};

const user = mongoose.model('user', userScheme);

module.exports = user;
