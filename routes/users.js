const router = require('express').Router();

const {
  getCurrentUser,
  updateProfile,
} = require('../controllers/users');

const {validatyUser} = require('../middlewares/validity');
const {route} = require("express/lib/router");

router.get('/users/me', getCurrentUser);
router.patch('/users/me', validatyUser, updateProfile);

module.exports = router;
