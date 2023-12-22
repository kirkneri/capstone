const User = require('../models/User');


exports.getprofile = (req, res) => {
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
}