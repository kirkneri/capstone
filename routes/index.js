const express = require('express');
const router = express.Router();
const indexController = require('../controllers/index-controller');
const { ensureAuthenticated } = require('../config/auth');
const { ensureAdmin } = require('../config/adminAuth');

router.get('/', ensureAuthenticated, indexController.index);
router.get('/dashboard', ensureAuthenticated, indexController.dashboard);
router.get('/admin/dashboard', ensureAuthenticated, indexController.admindashboard);

module.exports = router;