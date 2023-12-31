const express = require('express');
const router = express.Router();
const indexController = require('../controllers/index-controller');

router.get('/', indexController.index);
router.get('/dashboard', indexController.dashboard);

module.exports = router;