angular.module('myApp').controller('homeCtrl', ['$scope', '$timeout', '$routeParams', 'chatService', 'pageService', 'usersService', 'bulletinService', homeCtrl]);
function homeCtrl($scope, $timeout, $routeParams, chatService, pageService, usersService, bulletinService) {
    var vm = this;

    usersService.refreshUsers().then(
        function() {
            bulletinService.getBulletin().then(
                function(res) {
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
            }
        })
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

        bulletinService.addBulletin(message);
        htmlArea.html("");
        pageService.clearAlert();
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
