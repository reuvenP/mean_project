angular.module('myApp').controller('userProfileCtrl', ['pageService', 'chatService', 'usersService', 'userId', userProfileCtrl]);
function userProfileCtrl(pageService, chatService, usersService, userId) {
    var vm = this;
    vm.user = null;
    vm.mainData = pageService.mainData;
    vm.rooms = chatService.rooms;
    vm.messages = [];
    vm.formatDateTime = pageService.formatDateTime;
    vm.searchFilter = {};

    vm.roomName = function(roomId) {
        for (var i = 0; i < vm.rooms.length; i++) {
            if (vm.rooms[i]._id == roomId)
            return vm.rooms[i].name;
        }
    };

    vm.selectedRoomChanged = function() {
        vm.messages.length = 0;
        vm.loading = true;
        for (var i = 0; i < vm.allUserMessages.length; i++) {
            if (!vm.selectedRoom || vm.allUserMessages[i].room == vm.selectedRoom) {
                vm.messages.push(vm.allUserMessages[i]);
            }
        }
        vm.loading = false;
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
        chatService.likeMessage(message).then(
            function(updatedMsg) {
                message.positiveVotes = updatedMsg.positiveVotes;
                message.negativeVotes = updatedMsg.negativeVotes;
            },
            function(res) {
                message.voteError = res.data;
            }
        ).finally(function() {
            refreshVotes();
        });
    };

    vm.dislikeMessage = function(message) {
        chatService.dislikeMessage(message).then(
            function(updatedMsg) {
                message.positiveVotes = updatedMsg.positiveVotes;
                message.negativeVotes = updatedMsg.negativeVotes;
            },
            function(res) {
                message.voteError = res.data;
            }
        ).finally(function() {
            refreshVotes();
        });
    };

    pageService.setPageTitle('User Profile');

    $(document).ready(function() {
        $('#fromDatepicker, #toDatepicker').datepicker({
            autoclose: true,
            format: 'dd MM yyyy'
        });
    });

    usersService.refreshUsers().then(
        function() {
            vm.user = usersService.getUserById(userId);
            vm.user.image  = vm.user.image || 'public/img/user_avatar.png';
            chatService.getMyRooms().then(
                function(res) {
                    chatService.getUserMessages(vm.user._id).then(
                        function(res) {
                            vm.allUserMessages = res.data;
                            vm.selectedRoomChanged();
                            pageService.clearAlert();
                        }, function(res) {
                            pageService.showResponseError(res);
                        }
                    );
                },
                function (res) {
                    pageService.showResponseError(res);
                }
            );
        }, function (res) {
            pageService.showResponseError(res);
        }
    );

    var refreshVotes = function() {
        usersService.getVotesOfUser(userId).then(
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