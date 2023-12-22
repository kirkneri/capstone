const User = require('../models/User');
const Applicant = require('../models/Applicant');

exports.dashboard = (req, res) => {
    const locals = {
        title: 'Dashboard',
        description: 'Zephyr Gaming'
    };
    res.render('user-dashboard', { locals });
};

exports.admindashboard = async (req, res) => {
    const locals = {
        title: 'Admin Dashboard',
        description: 'Zephyr Gaming'
    };
    let perPage = 12;
    let page = req.query.page || 1;

    try {
        const users = await User.aggregate([{ $sort: { createdAt: -1 } }])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();
        const count = await User.countDocuments({});

        res.render("admin-dashboard", {
        locals,
        users,
        current: page,
        pages: Math.ceil(count / perPage),
        });
    } catch (error) {
        console.log(error);
    }
};

exports.getplayer = async (req, res) => {
    const locals = {
      title: "Admin Dashboard - Add Player",
      description: "Zephyr Gaming",
    };
    res.render("user/add", locals);
  };
  
  
exports.postplayer = async (req, res) => {
console.log(req.body);
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
        goal
    } = req.body;

    let selectedGame = games;

    if (games === 'other' && otherGame) {
        selectedGame = otherGame;
    }

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
            goal
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

/**
 * GET /
 * Customer Data
 */
exports.view = async (req, res) => {
try {
    const customer = await Customer.findOne({ _id: req.params.id });

    const locals = {
    title: "View Customer Data",
    description: "Free NodeJs User Management System",
    };

    res.render("customer/view", {
    locals,
    customer,
    });
} catch (error) {
    console.log(error);
}
};

/**
 * GET /
 * Edit Customer Data
 */
exports.edit = async (req, res) => {
try {
    const customer = await Customer.findOne({ _id: req.params.id });

    const locals = {
    title: "Edit Customer Data",
    description: "Free NodeJs User Management System",
    };

    res.render("customer/edit", {
    locals,
    customer,
    });
} catch (error) {
    console.log(error);
}
};

/**
 * GET /
 * Update Customer Data
 */
exports.editPost = async (req, res) => {
try {
    await Customer.findByIdAndUpdate(req.params.id, {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    tel: req.body.tel,
    email: req.body.email,
    details: req.body.details,
    updatedAt: Date.now(),
    });
    await res.redirect(`/edit/${req.params.id}`);

    console.log("redirected");
} catch (error) {
    console.log(error);
}
};

/**
 * Delete /
 * Delete Customer Data
 */
exports.deleteCustomer = async (req, res) => {
try {
    await Customer.deleteOne({ _id: req.params.id });
    res.redirect("/");
} catch (error) {
    console.log(error);
}
};

/**
 * Get /
 * Search Customer Data
 */
exports.searchCustomers = async (req, res) => {
const locals = {
    title: "Search Customer Data",
    description: "Free NodeJs User Management System",
};

try {
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    const customers = await Customer.find({
    $or: [
        { firstName: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        { lastName: { $regex: new RegExp(searchNoSpecialChar, "i") } },
    ],
    });

    res.render("search", {
    customers,
    locals,
    });
} catch (error) {
    console.log(error);
}
};