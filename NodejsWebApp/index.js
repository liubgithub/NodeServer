var server = require("./server");
var user = require('./database/db').user;
var io = require('socket.io');

var ws = io.listen(server);
var date = new Date();
Array.prototype.delValue = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);  
    }
}

var messageRecord = {
    length:0
};
//和服务器端建立连接的用户列表
var userList = [];

ws.on('connection', function (client) {
    console.log('\033[96msomeone is connect\033[39m \n');
    client.on('join', function (data) {
        var index = 0;
        var from = data.from;
        client.user = from;
        userList.push(from);
        var emitName = from + "messages";
        if (!!messageRecord[from]) {
            ws.emit(emitName, messageRecord[from]);
            delete messageRecord[from];
        }
    });
    // 监听发送消息
    client.on('send.message', function (msg) {
        client.broadcast.emit('send.message', client.nickname, msg);
    });
    // 断开连接时，通知其它用户
    client.on('disconnect', function () {
        // userList.remove(client)
        if (client.user) {
            userList.delValue(client.user);
        }
        if (client.nickname) {
            client.broadcast.emit('send.message', '系统', client.nickname + '离开聊天室!');
        }
    });
    client.on('send.to', function (data) {
        var from = data.from;
        var to = data.to;
        var msg = data.msg;
        var query = { name: to };
        user.findOne(query, function (err, doc) {
            if (err == null) {
                if (doc != null) {
                    if (!messageRecord[to]) {
                        messageRecord[to] = [{
                            from: from,
                            msg: msg,
                            chatFriend: doc.nickName,
                            date: date.getTime()
                        }];
                    } 
                    else if (!!messageRecord[to]) {
                        messageRecord[to].push({
                            from: from,
                            msg: msg,
                            chatFriend: doc.nickName,
                            date: date.getTime()
                        });
                    }
                    ws.emit(to, messageRecord[to]);
                    if(userList.indexOf(to)>=0)
                    delete messageRecord[to];
                }
            }
            else if (err != null)
                console.log(err.toString());
        });
    });


});