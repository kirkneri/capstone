module.exports = {
    ensureAdmin: function (req, res, next) {
        if (req.isAuthenticated() && req.user.role === 'admin') {
            return next();
        }
        req.flash('error_msg', 'You do not have permission to view this resource');
        res.redirect('/dashboard');
    }
    
};