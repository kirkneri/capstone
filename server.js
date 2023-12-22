require('dotenv').config();

const express = require('express');
const app = express();
const connectDB = require('./config/config')
const path = require('path');
const port = process.env.PORT || 8080;
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');

connectDB();

require('./config/passport')(passport);

app.use(expressLayouts);
app.set('layout', 'partials/layout');
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'src')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride('_method'));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use((req, res, next) => {
    console.log('Session ID:', req.sessionID);
    console.log('Session:', req.session);
    next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user;
    next();
});

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.isAuthenticated();
    res.locals.user = req.user;
    next();
});

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/', require('./routes/applicant'));
app.use('/users', require('./routes/applicant'));
app.use('/users', require('./routes/profile'));

app.listen(port, () => {
    console.log('listening on port ' + port);
});
