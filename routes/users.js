const router = require('express').Router();
const {
  getInfoUser,
  updateInfoUser
} = require('../controllers/users');

router.get('/me', getInfoUser);
router.patch('/me', updateInfoUser);

module.exports = router;