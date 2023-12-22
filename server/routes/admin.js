const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin-controller');
const { ensureAuthenticated } = require('../config/auth');
const { ensureAdmin } = require('../config/adminAuth');

router.get('/dashboard', ensureAuthenticated, ensureAdmin, adminController.admindashboard);
router.get('/add', ensureAuthenticated, ensureAdmin, adminController.getplayer);
router.post('/add', ensureAuthenticated, ensureAdmin, adminController.postplayer);



module.exports = router;