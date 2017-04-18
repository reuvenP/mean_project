angular.module('myApp').controller('homeCtrl', ['$scope', '$routeParams', 'pageService', 'usersService', homeCtrl]);
function homeCtrl($scope, $routeParams, pageService, usersService) {
    var vm = this;
    vm.mainData = pageService.mainData;
    pageService.setPageTitle('Dashboard');
    $('#homeLink').addClass('active');


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
}
