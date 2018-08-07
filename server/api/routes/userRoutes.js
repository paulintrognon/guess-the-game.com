const express = require('express');
const routeCache = require('route-cache');
const usersController = require('../controllers/userController');

const router = express.Router();

router.post('/check-username-availability', (req, res, next) =>
  next(usersController.checkUsernameAvailability(req))
);

router.get('/pre-log', (req, res, next) => next(usersController.preLog(req)));

router.post('/login', (req, res, next) => next(usersController.login(req)));

router.post('/register', (req, res, next) =>
  next(usersController.register(req))
);

const SCORE_CACHE_DURATION = 60 * 10; // One minue
router.get(
  '/scores',
  routeCache.cacheSeconds(SCORE_CACHE_DURATION),
  (req, res, next) => next(usersController.getScores(req))
);

module.exports = router;
