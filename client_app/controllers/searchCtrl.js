angular.module('myApp').controller('searchCtrl', ['$scope', 'pageService', 'chatService', 'usersService', searchCtrl]);
function searchCtrl($scope, pageService, chatService, usersService) {
    var vm = this;
    vm.mainData = pageService.mainData;
    vm.rooms = chatService.rooms;
    vm.messages = [];
    vm.formatDateTime = pageService.formatDateTime;
    vm.searchFilter = {};

    $scope.$on('$locationChangeStart', function(event) { //save search criteria
        pageService.lastRoomSearch = {
            selectedRoom: vm.selectedRoom,
            fromDate: vm.fromDate,
            toDate: vm.toDate,
            text: vm.searchFilter.text
        };
    });

    vm.selectedRoomChanged = function() {
        if (!vm.selectedRoom) return;
        vm.messages = [];
        vm.loading = true;
        chatService.getRoomMessages(vm.selectedRoom).then(
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
        chatService.likeMessage(message);
    };

    vm.dislikeMessage = function(message) {
        chatService.dislikeMessage(message);
    };

    pageService.setPageTitle('Rooms Search', 'Find messages inside rooms');
    $('#searchLink').addClass('active');

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
                    if (pageService.lastRoomSearch) { //restore search criteria
                        vm.selectedRoom = pageService.lastRoomSearch.selectedRoom;
                        vm.fromDate = pageService.lastRoomSearch.fromDate;
                        vm.toDate = pageService.lastRoomSearch.toDate;
                        vm.searchFilter.text =  pageService.lastRoomSearch.text;
                        delete (pageService.lastRoomSearch);
                        vm.selectedRoomChanged();
                    }
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
