angular.module('myApp').controller('homeCtrl', ['$scope', '$timeout', '$routeParams', 'chatService', 'pageService', 'usersService', 'bulletinService', homeCtrl]);
function homeCtrl($scope, $timeout, $routeParams, chatService, pageService, usersService, bulletinService) {
    var vm = this;

    usersService.refreshUsers().then(
        function() {
            bulletinService.getBulletin().then(
                function(res) {
                    afterAddingMessages();
                    pageService.clearAlert();
                },
                function (res) {
                    pageService.showResponseError(res);
                }
            )
        }, function (res) {
            pageService.showResponseError(res);
        }
    );

    vm.mainData = pageService.mainData;
    vm.bulletin = bulletinService.bulletin;
    pageService.setPageTitle('Home');
    $('#homeLink').addClass('active');

    var afterAddingMessages = function() {
        $timeout(function() {
            //remove ugly tooltip (huge url of image) after rendering, and scroll down
            $('#bulletin img').removeAttr('title');
            var body = $('#bulletin .direct-chat-messages');
            body.scrollTop(body[0].scrollHeight - body[0].clientHeight);
        }, 0);
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

    $timeout(function () {
        $('#bulletin .htmlarea').wysihtml5({
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
            customTemplates: buildImageButton('bulletin') //for loading our custom image button
        });
    },0);

    if ($routeParams.operation === 'editUser') {
        var modal = usersService.openUserEditModal(angular.copy(vm.mainData.myUser));
        modal.then(
            function(updatedUser) {
                usersService.editUser(updatedUser).then(function(newUser) {
                    vm.mainData.myUser = newUser;
                    pageService.setNextAlert($scope, 'Your user updated successfully', 'success', 'Success');
                    window.location.href  = '/#/home';
                }, function (res) {
                    pageService.setNextAlert($scope, res.data, 'danger', 'Error');
                    window.location.href  = '/#/home';
                })}
        );
    }

    vm.addBulletin = function() {
        var htmlArea = $("#bulletin .htmlarea");
        var html = htmlArea.html();
        if (!html) {
            return;
        }
        var message = {
            text: html
        };

        bulletinService.addBulletin(message).then(function() {
            afterAddingMessages();
            pageService.clearAlert();
        });
        htmlArea.html("");
    };

    vm.senderName = function(senderId) {
        if (senderId) {
            return usersService.getUserById(senderId).name;
        }
        return '';
    };

    vm.formatDateTime = pageService.formatDateTime;

    vm.senderImage = function(senderId) {
        if (senderId) {
            var image = usersService.getUserById(senderId).image;
            return image || 'public/img/user_avatar.png';
        }
        else {
            return 'public/img/user_avatar.png';
        }
    };
}
