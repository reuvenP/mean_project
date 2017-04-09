angular.module('myApp').factory('chatService', ['$http', '$q', '$rootScope', chatService]);
function chatService($http, $q, $rootScope) {
    var services = {};
    services.rooms = [];
    var socket = io();

    socket.on('send_msg', function(data){
        var room = services.getRoom(data.room);
        if (!room) return;
        $rootScope.$apply(function(){
            room.messages.push(data);
        });
    });

    services.getRoom = function (roomId) {
        for (var i = 0; i < services.rooms.length; i++) {
            if (services.rooms[i]._id == roomId) {
                return services.rooms[i];
            }
        }
    };

    services.getRooms = function () {
        services.rooms.length = 0;
        var deferred = $q.defer();
        $http.get('/chat/getRooms').then(
            function (res) {
                for (var i = 0; i < res.data.length; i++) {
                    services.rooms[i] = res.data[i];
                    services.rooms[i].messages = [];
                }
                deferred.resolve();
            }, function (res) {
                deferred.reject(res);
            }
        );

        return deferred.promise;
    };

    var getRoomOfflineMessages = function (roomId) {
        var deferred = $q.defer();
        $http.get('/chat/roomOfflineMessages/' + roomId).then(
            function (res) {
                var messagesList = services.getRoom(roomId).messages;
                messagesList.length = 0;
                var loadedMessages = res.data;
                for (var i = 0; i < loadedMessages.length; i++) {
                    messagesList[i] = loadedMessages[i];
                }
                deferred.resolve();
            }, function (res) {
                deferred.reject(res);
            }
        );

        return deferred.promise;
    };

    services.connectToRoom = function(roomId) {
        var deferred = $q.defer();
        getRoomOfflineMessages(roomId).then(
            function (res) {
                socket.emit('join', roomId);
                deferred.resolve();
                //otherwise:
                //deferred.reject(res);
            },
            function (res) {
                deferred.reject(res);
            }
        );
        return deferred.promise;
    };

    services.disconnectFromRoom = function(roomId) {
        var deferred = $q.defer();
        //TODO connect to socket.io channel, and in its success callback:
        services.getRoom(roomId).messages.length = 0;
        deferred.resolve();
        //otherwise:
        //deferred.reject(res);

        return deferred.promise;
    };

    services.sendMessage = function(message) {
        var room = services.getRoom(message.room);
        if (!room) {
            return;
        }

        var deferred = $q.defer();
        var req = {
            method: 'POST',
            url: '/chat/sendMessage',
            data: { message: message }
        };
        $http(req).then(
            function (res) {
                room.messages.push(res.data); //the new message
                deferred.resolve(res.data);
            }, function (res) {
                deferred.reject(res);
            }
        );

        return deferred.promise;
    };

    services.sendMessageSocket = function (msg) {
        var room = services.getRoom(msg.room);
        if (!room) {
            return;
        }
        socket.emit('publish', {room: room._id, text: msg.text,
            link: msg.link, img: msg.img, isOnlyForConnected: msg.isOnlyForConnected });
    };

    services.joinRoom = function (roomId) {
        if (!roomId) {
            return;
        }
        socket.emit('join', roomId);
    };

    services.leaveRoom = function (roomId) {
        if (!roomId) return;
        socket.emit('leave', roomId);
        services.getRoom(roomId).messages.length = 0;
    };

    return services;
}
