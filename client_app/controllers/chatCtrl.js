angular.module('myApp').controller('chatController', ['pageService', 'chatService', 'usersService', chatController]);
function chatController(pageService, chatService, usersService) {
    var vm = this;
    vm.mainData = pageService.mainData;

    pageService.setPageTitle('Chat Rooms', 'כאן אפשר לבקש כפית סוכר עד מחר');

    //vm.chatRoomsIds = [123, 456];
    vm.rooms = chatService.rooms;

    vm.getMessagesList = function(roomId) {
        return chatService.getMessagesList(roomId);
    };

    chatService.getRooms().then(
        function(res) {
            pageService.clearAlert();
        },
        function (res) {
            pageService.showAlert(res.status + ' - ' + res.statusText + ": " + (res.data.message || res.data.errmsg || res.data), 'danger', 'Error');
        }
    );
}
