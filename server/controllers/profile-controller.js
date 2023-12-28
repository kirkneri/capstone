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
            rank,
            bio,
        } = req.body;

        let selectedGame = games;

        if (games === 'other' && otherGame) {
            selectedGame = otherGame;
        }
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
            rank,
            bio,
            updatedAt: Date.now(),
        });
        const user = req.user;
        if (user.role === 'user') {
            await res.redirect(`/users/profile/`);
        } else {
            await res.redirect(`/users/view/${req.params.id}`);
        }
    } catch (err) {
        console.error(err);
    }
}

exports.delete = async (req, res) => {
    try {
        await User.deleteOne({ _id: req.params.id });
        res.redirect('/admin/dashboard');
        console.log('User deleted successfully');
    } catch (err) {
        console.log(err);
    }
};