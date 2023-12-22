
exports.index = (req, res) => {
    const locals = {
        title: 'Login',
        description: 'Zephyr Gaming'
    };
    if (req.isAuthenticated()) {
        return res.redirect('/dashboard');
    }
    res.render('welcome', { locals });
};

exports.dashboard = (req, res) => {
    const locals = {
        title: 'Dashboard',
        description: 'Zephyr Gaming'
    };
    res.render('user-dashboard', { locals });
};

exports.admindashboard = (req, res) => {
    const locals = {
        title: 'Admin Dashboard',
        description: 'Zephyr Gaming'
    };
    res.render('admin-dashboard', { locals });
};