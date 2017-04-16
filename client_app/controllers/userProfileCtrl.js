angular.module('myApp').controller('userProfileCtrl', ['pageService', 'chatService', 'usersService', 'userId', userProfileCtrl]);
function userProfileCtrl(pageService, chatService, usersService, userId) {
    var vm = this;
    vm.userId = userId;
    vm.user = null;
    vm.mainData = pageService.mainData;
    vm.rooms = chatService.rooms;
    vm.messages = [];
    vm.formatDateTime = pageService.formatDateTime;
    vm.searchFilter = {};

    vm.senderName = function(senderId) {
        return usersService.getUserById(senderId).name;
    };

    pageService.setPageTitle('User Profile');

    usersService.refreshUsers().then(
        function() {
            vm.user = usersService.getUserById(userId);
            vm.user.image  = vm.user.image || 'public/img/user_avatar.png';
            chatService.getMyRooms().then(
                function(res) {
                    // if (pageService.lastRoomSearch) { //restore search criteria
                    //     vm.selectedRoom = pageService.lastRoomSearch.selectedRoom;
                    //     vm.fromDate = pageService.lastRoomSearch.fromDate;
                    //     vm.toDate = pageService.lastRoomSearch.toDate;
                    //     vm.searchFilter.text =  pageService.lastRoomSearch.text;
                    //     delete (pageService.lastRoomSearch);
                    //     vm.selectedRoomChanged();
                    // }
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

    var refreshVotes = function() {
        usersService.getVotesOfUser(vm.userId).then(
            function (res) {
                vm.totalPositive = res.data.positive;
                vm.totalNegative = res.data.negative;
            }, function (res) {
                pageService.showResponseError(res);
            }
        );
    };

    refreshVotes();
}