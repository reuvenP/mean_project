angular.module('myApp').factory('chatService', ['$http', '$q', '$rootScope', 'roomsService', 'pageService', chatService]);
function chatService($http, $q, $rootScope, roomsService, pageService) {
    var services = {};
    services.rooms = roomsService.my_rooms;
    var socket = pageService.getSocket();

    socket.on('send_msg', function(data){
        var room = services.getRoom(data.room);
        if (!room) return;
        $rootScope.$apply(function(){
            room.messages.push(data);
            $rootScope.$emit('new_msg', room._id);
        });
    });

    services.getRoom = function (roomId) {
        for (var i = 0; i < services.rooms.length; i++) {
            if (services.rooms[i]._id == roomId) {
                return services.rooms[i];
            }
        }
    };

    services.getMyRooms = function () {
        var promise = roomsService.getMyRooms();
        promise.then(function() {
            //TODO should be moved to roomsService
            for (var i = 0; i < roomsService.my_rooms.length; i++) { //those rooms are referenced by services.rooms
                var room = roomsService.my_rooms[i];
                if (!room.messages) {
                    room.messages = [];
                    Object.defineProperty(room.messages, 'last', {
                        get: function () {
                            var fromIndex = this.length - 20;
                            if (fromIndex < 0) {
                                fromIndex = 0;
                            }
                            return this.slice(fromIndex, this.length);
                        }
                    });
                }
            }
        });

        return promise;
    };

    services.getRoomLastMessages = function(roomId) {
        var promise = $http.get('/chat/roomLastMessages/' + roomId);
        promise.then(function (res) {
            var messagesList = services.getRoom(roomId).messages;
            var loadedMessages = res.data;

            for (var i = 0; i < loadedMessages.length; i++) {
                for (var j = 0; j < messagesList.length; j++) {
                    if (messagesList[j]._id == loadedMessages[i]._id) {
                        messagesList[j] = loadedMessages[i];
                        loadedMessages[i].found = true;
                        break;
                    }
                }
            }

            for (i = 0; i < loadedMessages.length; i++) {
                if (!loadedMessages[i].found) {
                    messagesList.push(loadedMessages[i])
                }
                delete (!loadedMessages[i].found);
            }
        });

        return promise;
    };

    services.connectToRoom = function(roomId, scope, newMsgCallback) {
        var promise = services.getRoomLastMessages(roomId);
        promise.then(function (res) {
            socket.emit('join', roomId);
            var handler = $rootScope.$on('new_msg', newMsgCallback);
            scope.$on('$destroy', handler);
        });
        return promise;
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

    function replaceMessage(roomId, messageId, newMessage) {
        var messages = services.getRoom(roomId).messages;
        for(var i = 0; i < messages.length; i++) {
            if (messages[i]._id == messageId) {
                messages[i] = newMessage;
                return;
            }
        }
    }

    function updateVoteError(roomId, messageId, voteError) {
        var messages = services.getRoom(roomId).messages;
        for(var i = 0; i < messages.length; i++) {
            if (messages[i]._id == messageId) {
                messages[i].voteError = voteError;
                return;
            }
        }
    }

    services.likeMessage = function(message) {
        var deferred = $q.defer();
        var req = {
            method: 'POST',
            url: '/chat/likeMessage/' + message._id
        };
        $http(req).then(
            function (res) {
                replaceMessage(message.room, message._id, res.data); //the updated message
                deferred.resolve(res.data);
            }, function (res) {
                updateVoteError(message.room, message._id, res.data);
                deferred.reject(res);
            }
        );

        return deferred.promise;
    };

    services.dislikeMessage = function(message) {
        var deferred = $q.defer();
        var req = {
            method: 'POST',
            url: '/chat/dislikeMessage/' + message._id
        };
        $http(req).then(
            function (res) {
                replaceMessage(message.room, message._id, res.data); //the updated message
                deferred.resolve(res.data);
            }, function (res) {
                updateVoteError(message.room, message._id, res.data);
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
    };

    services.getRoomMessages = function(roomId) {
        var promise = $http.get('/chat/roomMessages/' + roomId);
        promise.then(function (res) {
            var messagesList = services.getRoom(roomId).messages;
            messagesList.length = 0;
            var loadedMessages = res.data;
            for (var i = 0; i < loadedMessages.length; i++) {
                messagesList[i] = loadedMessages[i];
            }
        });

        return promise;
    };

    services.getUserMessages = function(userId) {
        var promise = $http.get('/chat/userMessages/' + userId);
        return promise;
    };

    return services;
}
