angular.module('myApp').controller('chatController', ['pageService', 'chatService', 'usersService', chatController]);
function chatController(pageService, chatService, usersService) {
    var vm = this;
    vm.mainData = pageService.mainData;

    pageService.setPageTitle('Chat Rooms', 'כאן אפשר לבקש כפית סוכר עד מחר');

    //vm.chatRoomsIds = [123, 456];
    vm.rooms = chatService.rooms;

    vm.getRoom = function(roomId) {
        return chatService.getRoom(roomId);
    };

    vm.formatDate = function(dateString) {
        var date = new Date(dateString);
        var monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
        ];

        var monthIndex = date.getMonth();
        return date.getDate() + ' ' + monthNames[monthIndex] + ' ' + date.getHours() + ':' + date.getMinutes();
    };

    vm.isMyMessage = function(message) {
        return message.sender == vm.mainData.myUser._id;
    };

    vm.senderName = function(senderId) {
        return usersService.getUserById(senderId).name;
    };

    vm.senderImage = function(senderId) {
        var image = usersService.getUserById(senderId).image;
        return image || 'public/img/user_avatar.png';
    };

    vm.sendMessage = function(room) {
        if (!vm[room._id].text) {
            return;
        }
        var message = {
            room: room._id,
            text: vm[room._id].text,
            //TODO link, image
            isOnlyForConnected: false //TODO allow selection for this
        };
        delete(vm[room._id].text);
        chatService.sendMessage(message).then(
            function (res) {
                pageService.clearAlert();
                //TODO scroll down
            },
            function (res) {
                pageService.showAlert(res.status + ' - ' + res.statusText + ": " + (res.data.message || res.data.errmsg || res.data), 'danger', 'Error');
            }
        );
    };

    vm.sendOnEnterKey = function(keyEvent, room) {
        if (keyEvent.which === 13) {
            vm.sendMessage(room);
        }
    };

    var openRoom = function(room) {
        room.loading = true;
        chatService.connectToRoom(room._id).then(
            function () {
                room.showRoom = true;
                //TODO scroll down
                pageService.clearAlert();
            }, function () {
                pageService.showResponseError(res);
            }
        ).finally(function () {
            room.loading = false;
        });
    };

    vm.roomSelectionChanged = function(room) {
        if (room.showRoom) {
            openRoom(room);
        }
        else {
            vm.closeRoom(room);
        }
    };

    vm.closeRoom = function(room) {
        chatService.disconnectFromRoom(room._id).then(
            function() {
                room.showRoom = false;
                pageService.clearAlert();
            },
            function (res) {
                pageService.showResponseError(res);
            }
        );
    };

    usersService.refreshUsers().then(
        function() {
            chatService.getRooms().then(
                function(res) {
                    pageService.clearAlert();
                    for (var i = 0; i < vm.rooms.length; i++) {
                        vm[vm.rooms[i]._id] = {};
                    }
                },
                function (res) {
                    pageService.showResponseError(res);
                }
            )
        }, function (res) {
            pageService.showResponseError(res);
        }
    );
}
