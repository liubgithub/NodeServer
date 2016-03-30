var express = require('express');
var mongoose = require("mongoose");
var con = require('../database/db').fileConnection;
var router = express.Router();
var filedb = require('../database/db').filedata;
var url = require("url");
var path = require('path'); 
var Grid = require('gridfs-stream');
var gridform = require('gridform');
var querystring = require("querystring"),
    fs = require("fs"),
    formidable = require("formidable");

var gfs = Grid(con.db, mongoose.mongo);

//文件上传
router.get('/', function (request, response) {
    console.log("file upload was called");

    var body = '<html>' +
    '<head>' +
    '<meta http-equiv="Content-Type" content="text/html; ' +
    'charset=UTF-8" />' +
    '</head>' +
    '<body>' +
    '<form action="/fileHandler/upload" enctype="multipart/form-data" ' +
    'method="post">' +
    '<input type="file" name="upload" multiple="multiple">' +
    '<input type="submit" value="Upload file" />' +
    '</form>' +
    '</body>' +
    '</html>';
    
    response.writeHead(200, { "Content-Type": "text/html" });
    response.write(body);
    response.end();
});

router.post('/upload', function (req, res, next) {
    var conn = mongoose.connection;
    var pathname = url.parse(req.url).pathname;
    var form = new formidable.IncomingForm();
        //upload////////////////////////////////////////////////////
    if (pathname.indexOf('/upload') >= 0 && 'POST' == req.method) {

        form.parse(req, function (error, fields, files) {
            if (error) {
                return;
            }
            else {
                for (var file in files) {
                    var fileObject = files[file];
                    var fName = fileObject.name;
                    var filepath = fileObject.path;
                    var writestream = gfs.createWriteStream({
                        _id: '50e03d29edfdc00d34000001', // a MongoDb ObjectId
                        filename: fName, // a filename
                        mode: 'w', // default value: w
                        chunkSize: 1024,
                        content_type: fileObject.type// For content_type to work properly, set "mode"-option to "w" too!
                    });
                    fs.createReadStream(filepath).pipe(writestream);
                }
            }
        });
    }
});


router.get('/show',function(request, response) {
    console.log("Request handler 'show' was called.");
    //fs.readFile("./tmp/test.png", "binary", function (error, file) {
    //    if (error) {
    //        response.writeHead(500, { "Content-Type": "text/plain" });
    //        response.write(error + "\n");
    //        response.end();
    //    } else {
    //        response.writeHead(200, { "Content-Type": "image/png" });
    //        response.write(file, "binary");
    //        response.end();
    //    }
    //});
    var readstream = gfs.createReadStream({
        filename: '712.png'
    });
    readstream.pipe(response, "binary");
})
/////////////////////////////////////

module.exports = router;