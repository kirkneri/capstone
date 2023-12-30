const transporter = require('../config/mailer');
const Applicant = require('../models/Applicant');
const User = require('../models/User');


exports.getapply = (req, res) => {
    const locals = {
        title: 'Apply',
        description: 'Zephyr Gaming'
    };
    const user = req.user;
    res.render('apply', { user, locals });
};

exports.postapply = async (req, res) => {
    try {
        const {
            firstname,
            lastname,
            email,
            phone,
            address,
            gamertag,
            games,
            discord,
            steam,
            riot,
            rank,
            bio,
        } = req.body;

        let selectedGame = games || [];

        let errors = [];

        if (!firstname || !lastname || !email || !phone || !address || !gamertag || !games || !discord || !steam || !riot || !rank || !bio) {
            errors.push({ msg: 'Please fill in all required fields' });
        }

        if (errors.length > 0) {
            const user = req.user;
            res.render('apply', { user, errors });
        } else {

            const maxSelectedGames = 3;

            if (req.body.games.length > maxSelectedGames) {
                const user = req.user;
                const error = { msg: `You can select up to ${maxSelectedGames} games.` };
                return res.render('apply', { user, errors: [error] });
            }

            const newApplicant = new Applicant({
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
            });

            await newApplicant.save();

            await User.findOneAndUpdate(
                { _id: req.user._id },
                {
                    $addToSet: { games: selectedGame },
                    discord,
                    steam,
                    riot,
                    rank,
                    bio
                },
                { new: true }
            );    

            const mailOptions = {
                from: 'noreply@zephyrgaming.com',
                to: email, 
                subject: 'Thank you for your application!',
                text: `Hello ${firstname},\n\nYour application has been submitted successfully to Zephyr Gaming. Please keep your lines open, we will get back to you within 48 hrs.\n\nThank you!`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                } else {
                    console.log('Email sent:', info.response);
                }
            });


            req.flash('success_msg', 'Application sent successfully. Please check your email.');
            res.redirect('/');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error submitting application');
    }
};