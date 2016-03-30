var express = require('express');
var nodemailer = require('nodemailer');
var router = express.Router();
var appConfig = require('../config');

var emailConfig = appConfig.emailConfig;
var transporter = nodemailer.createTransport({
    host: emailConfig.host,
    secureConnection: true,
    port: emailConfig.port,
    auth: {
        user: emailConfig.user,
        pass:emailConfig.password
    }
});

router.post('/send', function (request, response) {
    var mailOptions = {
        from: emailConfig.host,
        to: request.body.address,
        subject: request.body.subject,
        text: request.body.text,
        html: request.body.html
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Message sent: ' + info.response);
        }
    })
});

module.exports = router;