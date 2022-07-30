const router = require('express').Router();

const {
  getUsers,
  getUser,
  updateProfile,
} = require('../controllers/users');

const { validatyUser } = require('../middlewares/validation');

router.get('/', getUsers);
router.get('/me', getUser);
router.patch('/me', validatyUser, updateProfile);

module.exports = router;
