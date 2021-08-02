const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userScheme = new mongoose.Schema({
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
}, { versionKey: false })

userScheme.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .then((user) => {
      if (!user) throw new Unathorized('Неправильная почта или пароль');

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) throw new Unauthorized('Неправильная почта или пароль');

          return user;
        });
    })

}

const user = mongoose.model('user', userScheme);

module.exports = user;