angular.module('myApp').controller('searchCtrl', ['pageService', 'chatService', 'usersService', 'roomsService', searchCtrl]);
function searchCtrl(pageService, chatService, usersService) {
    var vm = this;
    vm.mainData = pageService.mainData;
    vm.usersList = usersService.usersList;
    vm.rooms = chatService.rooms;
    vm.messages = [];
    vm.formatDateTime = pageService.formatDateTime;
    vm.searchFilter = {};

    vm.selectedRoomChanged = function() {
        vm.messages = [];
        vm.loading = true;
        chatService.getAllMessages(vm.selectedRoom).then(
            function() {
                vm.messages = chatService.getRoom(vm.selectedRoom).messages;
                pageService.clearAlert();
            },
            function (res) {
                pageService.showResponseError(res);
            }
        ).finally(function() {
            vm.loading = false;
        })
    };

    vm.senderImage = function(senderId) {
        var image = usersService.getUserById(senderId).image;
        return image || 'public/img/user_avatar.png';
    };

    vm.senderName = function(senderId) {
        return usersService.getUserById(senderId).name;
    };

    vm.dateRangeFilter = function(value, index, array) {
        if (!vm.fromDate && !vm.toDate) {
            return true;
        }

        var testDate = new Date(value.submitDate);
        if (vm.fromDate) {
            var fromDate = new Date(vm.fromDate);
            if (!vm.toDate) {
                return testDate >= fromDate;
            }
            else {
                var toDate = new Date(vm.toDate);
                toDate.setDate(toDate.getDate() + 1);
                return testDate >= fromDate && testDate < toDate;
            }
        }
        else {
            var toDate = new Date(vm.toDate);
            toDate.setDate(toDate.getDate() + 1);
            return testDate < toDate;
        }
    };

    vm.likeMessage = function(message) {
        chatService.likeMessage(message._id, vm.selectedRoom);
    };

    vm.dislikeMessage = function(message) {
        chatService.dislikeMessage(message._id, vm.selectedRoom);
    };

    pageService.setPageTitle('Rooms Search', 'Find messages inside rooms');

    $(document).ready(function() {
        $('#fromDatepicker, #toDatepicker').datepicker({
            autoclose: true,
            format: 'dd MM yyyy'
        });
    });

    usersService.refreshUsers().then(
        function() {
            chatService.getMyRooms().then(
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
}
