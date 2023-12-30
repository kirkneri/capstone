const User = require('../models/User');
const bcrypt = require('bcrypt');

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

exports.getview = async (req, res) => {
    try {
        const player = await User.findOne({ _id: req.params.id });
        const locals = {
            title: `View - ${player.lastname}, ${player.firstname}`,
            description: 'Zephyr Gaming'
        };
        res.render('users/view', { locals, player });
    } catch (err) {
        console.error(err);
    }
}

exports.getedit = async (req, res) => {
    try {
        const editPlayer = await User.findOne({ _id: req.params.id });
        const locals = {
            title: `Edit - ${editPlayer.lastname}, ${editPlayer.firstname}`,
            description: 'Zephyr Gaming'
        };
        res.render('users/edit', { locals, editPlayer });
    } catch (err) {
        console.error(err);
    }
}

exports.postedit = async (req, res) => {
    try {
        const {
            firstname,
            lastname,
            email,
            phone,
            address,
            gamertag,
            games,
            otherGame,
            discord,
            steam,
            riot,
            instagram,
            youtube,
            rank,
            bio,
        } = req.body;

        let selectedGame = games;

        if (games === 'other' && otherGame) {
            selectedGame = otherGame;
        }

        if (discord === '' || steam === '' || riot === '' || instagram === '' || youtube === '') {
           const addSocials = new User({
                discord,
                steam,
                riot,
                instagram,
                youtube
            })
            await addSocials.save();
        } else {
            await User.findByIdAndUpdate( req.params.id , {
                firstname,
                lastname,
                email,
                phone,
                address,
                gamertag,
                games: selectedGame,
                discord,
                steam,
                riot,
                instagram,
                youtube,
                rank,
                bio,
                updatedAt: Date.now(),
            });
            const user = req.user;
            if (user.role === 'user') {
                req.flash('success_msg', 'Successfully updated profile');
                await res.redirect(`/users/profile/`);
            } else {
                req.flash('success_msg', 'Successfully updated profile');
                await res.redirect(`/users/view/${req.params.id}`);
            }
        }
    } catch (err) {
        console.error(err);
    }
}

exports.postresetpassword = async (req, res) => {
    try {
        const { password, password2 } = req.body;
        const user = req.user;
        console.log(password, password2);
        let errors = [];
        if (!password || !password2) {
            errors.push({ msg: 'Please fill in all required fields' });
        } else if (password !== password2) {
            errors.push({ msg: 'Passwords do not match' });
        } else if (password.length < 6) {
            errors.push({ msg: 'Password should be at least 6 characters long' });
        } else {

        const newPass = await User.findOne({ _id: req.params.id });
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        newPass.password = hash;
        newPass.updatedAt = Date.now();
        
        await newPass.save();

        if (user.role === 'admin') {
            req.flash('success_msg', 'Password reset successful.');
            res.redirect(`/users/view/${newPass._id}`);
        } else {
            req.logout(async function(err) {
                if(err) {
                    console.error(err);
                    await res.render('error_page', { errorMsg: 'Something went wrong during resetting password' });
                } else {
                    await req.flash('success_msg', 'Password reset successful. You can now login.');
                    await res.redirect('/users/login');
                }
            });
        }
        }
    } catch (err) {
        console.log(err);
        res.redirect('/users/profile');
    }
};

exports.delete = async (req, res) => {
    try {
        await User.deleteOne({ _id: req.params.id });
        res.redirect('/admin/dashboard');
        console.log('User deleted successfully');
    } catch (err) {
        console.log(err);
    }
};