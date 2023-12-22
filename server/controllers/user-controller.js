const User = require('../models/User');
const bcrypt = require('bcrypt');
const passport = require('passport');

exports.getlogin = async (req, res) => {
    const locals = {
        title: 'Login',
        description: 'Zephyr Gaming'
    };
    if (req.isAuthenticated() && req.user.role === 'user') {
        return res.redirect('/dashboard');
    }
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return res.redirect('/admin/dashboard');
    }
    res.render('login', { locals });
};

exports.postlogin = (req, res) => {
    console.log('Login attempt with username:', req.body.username);
    console.log('Login request body:', req.body);
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return (err);
        }
        if (!user) {
            req.flash('error_msg', info.message);
            return res.redirect('/users/login');
        }
        req.logIn(user, function(err) {
            if (err) {
                return (err);
            }
            if (user.role === 'admin') {
                return res.redirect('/admin/dashboard');
            } else {
                return res.redirect('/dashboard');
            }
        });
    })(req, res);
};


// exports.checkgamertag = async (req, res) => {
//     try {
//         const { username } = req.body;
//         const query = { gamertag: username };
//         const user = await User.findOne( { query } );
//         if (user) {
//             res.render('login', {  });
//         }

//     } catch (err) {
//         console.error(err);
//         req.flash('error_msg', 'Something went wrong');
//         return res.redirect('/users/login');
//     }
// };


exports.getregister = (req, res) => {
    const locals = {
        title: 'Register',
        description: 'Zephyr Gaming'
    };
    if (!req.user) {
        return res.redirect('/users/login');
    }
    if (req.isAuthenticated() && req.user.role === 'user') {
        return res.redirect('/dashboard');
    } 

    res.render('register', { locals });
};

exports.postregister = async (req, res) => {
    const { firstname, lastname, gamertag, email, phone, address, password, password2, games, otherGame, role } = req.body;

    let selectedGames = games || [];

    if (games === 'otherCheckbox' && otherGame) {
        selectedGames = [otherGame];
    }

    let errors = [];

    const phoneRegex = /^\d{11}$/;
    if (!phone.match(phoneRegex)) {
        errors.push({ msg: 'Please enter a valid phone number' });
    }
 
    if (!firstname || !lastname || !gamertag || !email || !phone || !address || !password || !password2) {
        errors.push({ msg: 'Please fill in all required fields' });
    } else if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    } else if (password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters long' });
    }
 
    if (errors.length > 0) {
        res.render('register', { errors, firstname, lastname, gamertag, email, phone, address, games, otherGame, password, password2 });
    } else {
        try {
            const userByEmail  = await User.findOne({ email });
            const userByGamertag = await User.findOne({ gamertag });

            if (userByEmail) {
                errors.push({ msg: 'Email already in use.' });
                res.render('register', { errors, firstname, lastname, gamertag, email, phone, address, games, password, password2 });
             } else if (userByGamertag) {
                errors.push({ msg: 'Gamertag already in use.' });
                res.render('register', { errors, firstname, lastname, gamertag, email, phone, address, games, password, password2 });
             } else {
                const newUser = new User({ firstname, lastname, gamertag, email, phone, address, games, password, role, games: selectedGames });
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(newUser.password, salt);
                newUser.password = hash;
                await newUser.save();
                req.flash('success_msg', 'You are now registered and can login.');
                res.redirect('/users/login');
            }
        } catch (err) {
            console.error(err);
            res.render('error_page', { errorMsg: 'Something went wrong during registration' });
        }
    }
};

exports.getlogout = (req, res) => {
    req.logout(function(err) {
        if(err) {
            console.error(err);
            res.render('error_page', { errorMsg: 'Something went wrong during logout' });
        } else {
            req.flash('success_msg', 'You are now logged out');
            res.redirect('/users/login');
        }
    });
};