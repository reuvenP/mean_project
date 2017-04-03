/**
 * Created by reuvenp on 15/03/2017.
 */

var dal_messages = require('./dal_messages');
var dal_rooms = require('./dal_rooms');
var dal_users = require('./dal_users');
var dal_users_rooms = require('./dal_user_rooms')

var configSocketIo = function(httpServer) {
    var io = require('socket.io')(httpServer);
    io.on('connection', function (socket) {
        socket.on('send_user', function (data) {
            user_id = data.user_id;
            dal_users_rooms.getRoomsOfUser(user_id, function (err, rooms) {
                if (err) {
                    //TODO: handle error
                }
                else {
                    for (var i = 0; i < rooms.length; i++) {
                        socket.join(rooms[i].name);
                    }
                }
            })
        })
    });
};

module.exports = configSocketIo;