angular.module('myApp').controller('loginCtrl', ['$scope', 'pageService', 'usersService', 'loginService', loginCtrl]);
function loginCtrl($scope, pageService, usersService, loginService){
    var vm = this;
    vm.mainData = pageService.mainData;
    $('.side-nav li').removeClass('active');

    vm.login = function() {
        var hash = CryptoJS.SHA1(vm.username + ':' + vm.password + ':' + vm.random);
        var hash_Base64 = hash.toString(CryptoJS.enc.Base64);
        loginService.login(vm.username, hash_Base64).then(
            function(res) {
                vm.mainData.myUser = res.data;
                pageService.setNextAlert($scope, 'Welcome ' + vm.mainData.myUser.name, 'info', 'Hello!');
                gotoHome();
            },
            function (res) {
                pageService.showAlert(res.data, 'danger', 'Login error');
            }
        );
    };

    vm.forgotPassword = function() {
        loginService.forgotPassword(vm.username).then(
            function(res) {
                pageService.showAlert(res.data, 'info');
            }, function (res) {
                pageService.showAlert(res.data, 'danger');
            }
        );
    };

    vm.signup = function() {
        usersService.openUserEditModal().then(
            function (newUser) {
                newUser.isBlocked = true;
                usersService.addUser(newUser).then(
                    function () {
                        pageService.showAlert('User created successfully, but it is blocked until the admin approves it');
                    }, function (res) {
                        pageService.showAlert(res.data, 'danger');
                    }
                );
            }
        );
    }
}
