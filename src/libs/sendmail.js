const nodemailer = require("nodemailer");
const config = require("config");
const asyncHandle = require('express-async-handler');

// async..await is not allowed in global scope, must use a wrapper
const sendMail = asyncHandle(async (email, html) => {
    const transporter = nodemailer.createTransport({
        host: config.get("mail.host"),
        port: config.get("mail.port"),
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: config.get("mail.user"),
            pass: config.get("mail.pass"),
        },
    });
    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: '"Cửa hàng điện tử 👻" <no-relply@cuahangdientu.com>', // sender address
        to: email, // list of receivers
        subject: "Forgot Password", // Subject line
        html: html, // html body
    });
    return info;
})


module.exports = {
    sendMail,
}

