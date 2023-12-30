// "use strict";
require('dotenv').config();
const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
    // host: "smtp.gmail.com",
    // port: 587,
    // secure: false,
    service: 'gmail',
    auth: {
        user: "zephyr.limited@gmail.com",
        pass: process.env.MAILER_PASSWORD,
    }
    // tls: {
    //     ciphers: 'SSLv3',
    //     minVersion: 'TLSv1'
    // }
});

module.exports = transporter;