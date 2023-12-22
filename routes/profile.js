const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/profile', (req, res) => {
    if (req.isAuthenticated()) {
        const user = req.user;
        const locals = {
            title: `Profile - ${user.lastname}, ${user.firstname}`,
            description: 'Zephyr Gaming'
        };
        res.render('profile', { locals, user });
    } else {
        res.redirect('/users/login');
    }
});



















module.exports = router;