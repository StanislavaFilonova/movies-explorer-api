const router = require('express').Router();

const {
  getUser,
  updateProfile,
} = require('../controllers/users');

const { validatyUser } = require('../middlewares/validation');

router.get('/users/me', getUser);
router.patch('/users/me', validatyUser, updateProfile);

module.exports = router;
