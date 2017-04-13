angular.module('myApp').controller('chatController', ['$scope', 'pageService', 'chatService', 'usersService', '$timeout', chatController]);
function chatController($scope, pageService, chatService, usersService, $timeout) {
    var vm = this;
    vm.mainData = pageService.mainData;

    pageService.setPageTitle('Chat Rooms', 'כאן אפשר לבקש כפית סוכר עד מחר');

    vm.rooms = chatService.rooms;

    vm.getRoom = function(roomId) {
        return chatService.getRoom(roomId);
    };

    vm.formatDateTime = pageService.formatDateTime;

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
        var htmlArea = $('#' + room._id + " .htmlarea");
        var html = htmlArea.html();
        if (!html) {
            return;
        }
        var message = {
            room: room._id,
            text: html,
            isOnlyForConnected: room.onlyForConnected || false
        };

        chatService.sendMessageSocket(message);
        htmlArea.html("");
        pageService.clearAlert();
    };

    vm.likeMessage = function(message, room) {
        chatService.likeMessage(message._id, room._id).then(
            function(res) {
                pageService.clearAlert();
            }
        )
    };

    vm.dislikeMessage = function(message, room) {
        chatService.dislikeMessage(message._id, room._id).then(
            function(res) {
                pageService.clearAlert();
            }
        )
    };

    var buildImageButton = function(roomId) {
        return {
            image : function(context) {
                var locale = context.locale;
                var options = context.options;
                var htmlButton =
                    '<li>' +
                        '<label class="btn btn-sm btn-default" title="Insert image" tabindex="-1">' +
                        '<span class="fa fa-file-image-o"></span>' +
                            '<input type="file" style="display: none;" name="imageFile" id="imageFile" onchange="insertImage(\'' + roomId + '\')">' +
                        '</label>' +
                    '</li>';
                return htmlButton;
            }
        };
    };

    var newMsgCallback = function(event, roomId) {
        //remove ugly tooltip (huge url of image) after rendering, and scroll down
        $timeout(function() {
            $('#' + roomId + ' img').removeAttr('title');
            var body = $('#' + roomId + ' .direct-chat-messages');
            body.scrollTop(body[0].scrollHeight - body[0].clientHeight);

            //play sound for async message from other user (not offline message)
            if (event) {
                var messages = vm.getRoom(roomId).messages;
                if (messages.length > 0 && messages[messages.length - 1].sender != vm.mainData.myUser._id) {
                    var audio = new Audio('public/sound/newMsg.mp3');
                    audio.play();
                }
            }
        }, 0);
    };

    var setContentHeight = function() {
        $timeout(function() {
            var minHeight = $('.wrapper').get(0).clientHeight;
            if (minContentHeight > minHeight) {
                minHeight = minContentHeight;
            }
            $('.content-wrapper').get(0).style.minHeight = minHeight + 'px';
        }, 0);
    };

    var openRoom = function(room) {
        room.loading = true;
        setContentHeight();

        chatService.connectToRoom(room._id, $scope, newMsgCallback).then(
            function () {
                room.showRoom = true;
                pageService.clearAlert();
                //run bootstrap3-wysiwyg - html editor
                $('#' + room._id + " .htmlarea").wysihtml5({
                    toolbar: {
                        "font-styles": false, //Font styling, e.g. h1, h2, etc. Default true
                        // "emphasis": true, //Italics, bold, etc. Default true
                        // "lists": true, //(Un)ordered lists, e.g. Bullets, Numbers. Default true
                        // "html": false, //Button which allows you to edit the generated HTML. Default false
                        // "link": true, //Button to insert a link. Default true
                        // "image": true, //Button to insert an image. Default true,
                        // "color": false, //Button to change color of font
                        "blockquote": false, //Blockquote
                        "size": 'sm', //default: none, other options are xs, sm, lg
                        fa: true
                    },
                    customTemplates: buildImageButton(room._id) //for loading our custom image button
                });
                newMsgCallback(null, room._id);
            }, function (res) {
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
        chatService.leaveRoom(room._id);
        room.showRoom = false;
        pageService.clearAlert();
        // chatService.disconnectFromRoom(room._id).then(
        //     function() {
        //         room.showRoom = false;
        //         pageService.clearAlert();
        //     },
        //     function (res) {
        //         pageService.showResponseError(res);
        //     }
        // );
    };

    vm.toggleExpanded = function(room) {
        var currentStatus = room.isExpanded || false;
        room.isExpanded = !currentStatus;
        setContentHeight();
    };

    usersService.refreshUsers().then(
        function() {
            chatService.getRooms().then(
                function(res) {
                    pageService.clearAlert();
                    // for (var i = 0; i < vm.rooms.length; i++) {
                    //     vm[vm.rooms[i]._id] = {};
                    // }
                },
                function (res) {
                    pageService.showResponseError(res);
                }
            )
        }, function (res) {
            pageService.showResponseError(res);
        }
    );

    var minContentHeight = $('.content-wrapper').get(0).clientHeight;
}
