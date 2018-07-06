const express = require('express');
const usersController = require('../controllers/userController');

const router = express.Router();

router.post('/register', (req, res, next) =>
  next(usersController.register(req))
);

module.exports = router;
