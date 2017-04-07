/**
 * Created by reuvenp on 15/03/2017.
 */

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
                        if (rooms[i].name == room) {
                            console.log('joined room: ' + room);
                            socket.join(room);
                            return;
                        }
                        console.log('user not allowed');
                    }
                }
            })
        });

        socket.on('leave', function (room) {
            socket.leave(room);
        });

        socket.on('publish', function (msg) {
            dal_rooms.getRoomById(msg.room, function (err, room) {
                if (!room || !room.name) return;
                if (!err) {
                    if (io.sockets.adapter.sids[socket.id][room.name]) {
                        dal_messages.addMessage(userId, msg.room, msg.text, msg.link, msg.img, msg.isOnlyForConnected, function (err2) {
                            if (!err2) {
                                socket.broadcast.to(room.name).emit('send_msg', msg);
                            }
                        })
                    }
                }
            });


        });

    });
};

module.exports = configSocketIo;