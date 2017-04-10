angular.module('myApp').controller('chatController', ['pageService', 'chatService', 'usersService', '$timeout', chatController]);
function chatController(pageService, chatService, usersService, $timeout) {
    var vm = this;
    vm.mainData = pageService.mainData;

    pageService.setPageTitle('Chat Rooms', 'כאן אפשר לבקש כפית סוכר עד מחר');

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
        var htmlArea = $('#' + room._id + " .htmlarea");
        var html = htmlArea.html();
        if (!html) {
            return;
        }
        var message = {
            room: room._id,
            text: html,
            isOnlyForConnected: false //TODO allow selection for this
        };

        chatService.sendMessageSocket(message);
        htmlArea.html("");
        pageService.clearAlert();
    };

    vm.sendOnEnterKey = function(keyEvent, room) {
        if (keyEvent.which === 13) {
            vm.sendMessage(room);
        }
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

    var openRoom = function(room) {
        room.loading = true;
        chatService.connectToRoom(room._id).then(
            function () {
                room.showRoom = true;
                //TODO scroll down
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
                //remove ugly tooltip (huge url of image) after rendering
                $timeout(function() {
                    $('#' + room._id + " img").removeAttr('title')
                }, 0);
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
