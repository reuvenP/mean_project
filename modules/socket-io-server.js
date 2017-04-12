/**
 * Created by reuvenp on 15/03/2017.
 */

var mqtt = require('mqtt');
var clientId = 'mqtt_3000';
var dal_messages = require('./dal_messages');
var dal_rooms = require('./dal_rooms');
var dal_users = require('./dal_users');
var dal_users_rooms = require('./dal_user_rooms');


var configSocketIo = function(httpServer, session) {
    var sharedsession = require("express-socket.io-session");
    var io = require('socket.io')(httpServer);
    io.use(sharedsession(session));
    io.on('connection', function (socket) {
        if (!socket || !socket.handshake || !socket.handshake.session || !socket.handshake.session.passport || !socket.handshake.session.passport.user) {
            console.log('user undefined');
            socket.disconnect();
            return;
        }
        var userId = socket.handshake.session.passport.user;

        socket.on('join', function (room) {
            dal_users_rooms.getRoomsOfUser(userId, function (err, rooms) {
                if (err) {
                    console.log(err);
                }
                else {
                    for (var i = 0; i < rooms.length; i++) {
                        if (rooms[i]._id == room) {
                            console.log('joined room: ' + rooms[i].name);
                            socket.join(rooms[i].name);
                            return;
                        }
                        console.log('user not allowed');
                    }
                }
            })
        });

        socket.on('leave', function (roomId) {
            dal_rooms.getRoomById(roomId, function (err, room) {
                if (err) return;
                socket.leave(room.name);
            });
        });

        socket.on('publish', function (msg) {
            dal_rooms.getRoomById(msg.room, function (err, room) {
                if (!room || !room.name) return;
                if (!err) {
                    if (io.sockets.adapter.sids[socket.id][room.name]) {
                        dal_messages.addMessage(userId, msg.room, msg.text, msg.link, msg.img, msg.isOnlyForConnected, function (err2, newMsg) {
                            if (!err2) {
                                io.to(room.name).emit('send_msg', newMsg);
                                client.publish('msgs_back', JSON.stringify(newMsg));
                            }
                        })
                    }
                }
            });
        });
    });


    var client  = mqtt.connect('mqtt://localhost', {clientId: clientId});

    client.on('connect', function () {
        client.subscribe('msgs');
    });

    client.on('message', function (topic, message) {
        // message is Buffer
        //console.log(topic, message.toString());
        if (topic == 'msgs') {
            var stringBuf = message.toString('utf-8');
            var obj = JSON.parse(stringBuf);
            if (obj.clientId != clientId) {
                obj.clientId = undefined;
                io.to(room.name).emit('send_msg', obj);
            }
        }
    });
};

module.exports = configSocketIo;