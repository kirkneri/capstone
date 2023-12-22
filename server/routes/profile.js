const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile-controller');

router.get('/profile', profileController.getprofile);


module.exports = router;