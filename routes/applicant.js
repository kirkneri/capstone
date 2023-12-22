const express = require('express');
const router = express.Router();
const applicantController = require('../controllers/applicant-controller')

router.get('/apply', applicantController.getapply);

router.post('/apply', applicantController.postapply);

module.exports = router;