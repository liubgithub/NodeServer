var mongoose = require("mongoose"); //  顶会议用户组件
var debug = require('debug')('ExpressApp');
var con = mongoose.createConnection('mongodb://localhost:10001/lb_db');
var fileConnection = mongoose.createConnection("mongodb://localhost:10001/filedb");
var Schema = mongoose.Schema;   //  创建模型

//var friendsSchema = new Schema({
//    face:String,
//    nicname: String,
//    tele: String,
//    email:String
//});
var userScheMa = new Schema({
    face: String,
    token: String,
    nickName: String,
    realName:String,
    signature:String,
    name: String,
    password: String,
    email: String,
    phoneNumber: String,
    QQ: String,
    WeiXin: String,
    Gender: String,
    Birthday:String,
    friends: Array
}); //  定义了一个新的模型，但是此模式还未和users集合有关联
var user = mongoose.model('users', userScheMa); //  与users集合关联


var fileSchema = new Schema({
});

var filedata = mongoose.model('filedatas', fileSchema);
exports.user = user;
exports.filedata = filedata;
exports.fileConnection = fileConnection;