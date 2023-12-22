exports.index = (req, res) => {
    const user = req.user;
    const locals = {
        title: 'Home - Zephyr Gaming',
        description: 'Zephyr Gaming'
    };
    if (req.isAuthenticated() && user.role == 'admin') {
        return res.redirect('/admin/dashboard');
    } else if (req.isAuthenticated() && user.role == 'user') {
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