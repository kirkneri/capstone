const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile-controller');

router.get('/profile', profileController.getprofile);
router.get('/view/:id', profileController.getview);
router.get('/edit/:id', profileController.getedit);
router.put('/edit/:id', profileController.postedit);
router.delete('/edit/:id', profileController.delete);


module.exports = router;