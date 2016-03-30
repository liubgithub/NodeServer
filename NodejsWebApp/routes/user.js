var express = require('express');
var router = express.Router();
var user = require('../database/db').user;
var uuid= require('node-uuid');

//用户注册
router.post('/register', function (req, res) {
    
    var data = { name: req.body.name, password: req.body.psd, email: req.body.email };
    var query = { name: req.body.name };
    user.count(query, function (err, doc) {    //count返回集合中文档的数量，和 find 一样可以接收查询条件。query 表示查询的条件
        var result = {
            status: 'ok'
        };
        if (doc >= 1) {
            console.log("user has existed");
            result.status = "failure";
            res.send(JSON.stringify(result));
        } 
        else if (doc == 0) {
            data.token = uuid.v1();
            var addUser = new user(data);
            addUser.save(function (err, small) {
                debug('添加用户失败!');
            });
            result.status = "ok";
            console.log(query.name + ": 注册成功，时间: " + new Date());
            res.send(JSON.stringify(result));
        }
    });
});
//用户登录
router.get('/login/:loginname/:loginpsd?', function (req, res) {
    var username = req.params.loginname;
    var password = req.params.loginpsd;
    var query = { name: username, password: password };
    user.find(query, function (err, doc) {
        if (doc.length == 1) {
            var user = doc[0];
            console.log(username + " login successful!");
            res.send(JSON.stringify({
                loginStatus: 'ok',
                name: user.name,
                token: user.token,
                nickName: user.nickName,
                realName:user.realName,
                phoneNumber: user.phoneNumber,
                signature: user.signature,
                QQ: user.QQ,
                WeiXin: user.WeiXin,
                Gender: user.Gender,
                Birthday: user.Birthday
            }));            
        }
        else if (doc <= 0) {
            console.log(username + " not exist");
            res.send(JSON.stringify({
                loginStatus: 'failure',
                token: "jdkdk5td87ewnhe"
            }));  
        }
    });
});

//搜索用户
router.get('/search/:username?', function (req, res) {
    var username = req.params.username;
    var query = { name: username };
    user.findOne(query, function (err, doc) {
        if (err == null) {
            var result = doc;
            if (doc != null)
                res.send(JSON.stringify({
                    name: doc.name,
                    region: doc.region,
                    signatures :doc.signatures 
                }));
        }
        else if(err!=null)
            console.log(err.toString());
    });
});

//添加用户到通讯录接口
router.get('/addOne/:username/:friendname?', function (req, res) {
    var friendname = req.params.friendname;
    var me = req.params.username;
            user.findOne({ name: friendname }, function (err, friend) {
                if (err == null) {
                //第一个参数是查询条件，第二个参数是更新的对象
                 user.findOne({ name: me }, function (err, doc) {
                    user.update({ name: me }, {
                      $set: {
                        friends: function () {
                            doc.friends.push({
                                face: friend.face|| "暂无",
                                nickName: friend.nickName||"暂无",
                                name: friend.name,
                                email: friend.email
                            });
                            return doc.friends;
                        }()
                    }
                }, function (err) {
                    if (err == null) {
                        console.log(me + " add friend " + friendname + " successful!");
                        res.send(JSON.stringify({
                            status: 'ok',
                            friend: friendname
                        }));
                    }
                    else
                        res.send({
                            status: 'fail',
                            friend: friendname
                        });
                });
                 });
                }
            });
});

//获取用户列表
router.get('/friends/:usertoken?', function (req, res) {
    var token = req.params.usertoken;
    var query = { token: token };
    user.find(query, function (err, o) {
        if (err == null) {
            var friends = o[0].friends;
            var len = friends.length;
            if (len!=undefined) {
                var friendlist = [];
                for (var i = 0; i < len; i++) {
                    var friend = friends[i];
                    var friendInfo = {
                        nickName: friend.nickname,
                        signature: friend.signature
                    };
                    friendlist.push(friend);
                }
                res.send(JSON.stringify(friendlist));
            }
        }
        else
            res.send("服务器出现问题!");
    });
});

//修改用户信息
router.get('/modify/:username/:token/:propertyName/:value?', function (req, res) {
    var username = req.params.username;
    var token = req.params.token;
    var propertyName = req.params.propertyName;
    var value = req.params.value;
    var query = { token: token };
    user.findOne(query, function (err, doc) {
        if (err == null) {
            var result = doc;
            result[propertyName] = value;
            user.update(query, result, function (err, o) {
                if (err == null) {
                    res.send(JSON.stringify({
                        status:'ok'
                    }));
                }
                else
                    res.send(JSON.stringify({
                        status: 'fail'
                    }));
            });
        }
    });
});
module.exports = router;