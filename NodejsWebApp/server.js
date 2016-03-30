var express = require('express');
var path = require('path');
var users = require('./routes/user');
var fileHandler = require('./routes/fileHandler.js');
var app = express();
var bodyParser = require('body-parser');
var mail = require('./routes/email.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//设置允许跨域访问
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header('Content-Type', 'application/x-www-form-urlencoded');
    next();
});

app.use('/user', users);

app.use('/fileHandler', fileHandler);

app.use('/email', mail);

var debug = require('debug')('ExpressApp');

app.set('port', process.env.PORT || 3000);


var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});
//
module.exports = server;