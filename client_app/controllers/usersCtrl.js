angular.module('myApp').controller('usersController', ['$scope', 'pageService', 'usersService', usersController]);
function usersController($scope, pageService, usersService) {
    var vm = this;
    vm.mainData = pageService.mainData;
    vm.usersList = usersService.usersList;
    vm.searchFilter = {};

    pageService.setPageTitle('Neighbors');
    $('#usersLink').addClass('active');

    usersService.refreshUsers().then(
        function (res) {
            pageService.clearAlert();
        },
        function (res) {
            pageService.showAlert(res.status + ' - ' + res.statusText + ": " + (res.data.message || res.data.errmsg || res.data), 'danger', 'Error');
        }
    );

    vm.deleteUser = function (user) {
        pageService.clearAlert();
        pageService.openModal('Warning', 'Are you sure to delete ' + user.name + '?', ['Yes'], 'Cancel', 'warning').then(
            function(){
                usersService.deleteUser(user._id).then(
                    function (res) {
                        pageService.showAlert('User deleted successfully', 'success', 'Success');
                    },
                    function (res) {
                        pageService.showAlert(res.status + ' - ' + res.statusText + ": " + (res.data.message || res.data.errmsg || res.data), 'danger', 'Error');
                    }
                );
            },
            function () {
                pageService.showAlert('User was not deleted', 'info')
            }
        );
    };

    vm.addUser = function() {
        pageService.clearAlert();
        var modal =  usersService.openUserEditModal(); //new user
        modal.then(function(user) {
            usersService.addUser(user).then(
                function (res) {
                    pageService.showAlert('User added successfully', 'success', 'Success');
                }, function (res) {
                    pageService.showAlert(res.status + ' - ' + res.statusText + ": " + (res.data.message || res.data.errmsg || res.data), 'danger', 'Error');
                }
            )
        });
    };

    vm.editUser = function (user) {
        pageService.clearAlert();
        var modal = usersService.openUserEditModal(angular.copy(user));
        modal.then(function(userResult) {
            usersService.editUser(userResult).then(
                function (res) {
                    pageService.refreshMyUserIfNeeded(userResult);
                    pageService.showAlert('User updated successfully', 'success', 'Success');
                }, function (res) {
                    pageService.showAlert(res.status + ' - ' + res.statusText + ": " + (res.data.message || res.data.errmsg || res.data), 'danger', 'Error');
                }
            )
        });
    };
}
