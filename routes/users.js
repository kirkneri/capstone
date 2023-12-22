const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');


router.get('/login', userController.getlogin);
router.post('/login', userController.postlogin);
router.get('/register', userController.getregister);
router.post('/register', userController.postregister);
router.get('/logout', userController.getlogout);


module.exports = router;