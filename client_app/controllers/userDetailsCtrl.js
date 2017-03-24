angular.module('myApp').controller('userDetailsCtrl', ['$uibModalInstance', /* '$scope', */ 'pageService', 'user', userDetailsCtrl]);
function userDetailsCtrl($uibModalInstance, $scope, pageService, user) {
    //$scope.userDetails =  $scope.userDetails || {};
    //var vm = $scope.userDetails;

    var vm = this;
    vm.mainData = pageService.mainData;
    vm.newUser = !user;
    vm.user = user || {};
    vm.rawPassword = "";

    $uibModalInstance.rendered.then(function () {
        //$.getScript("/client_app/views/editUserValidator.js");
    });

    vm.ok = function () {
        if (vm.rawPassword) {
            var publicKey = $("#publicKey").val();
            var encrypter = new JSEncrypt();
            encrypter.setPublicKey(publicKey);
            vm.user.encryptedPassword = encrypter.encrypt(vm.rawPassword);
        }

        $uibModalInstance.close(vm.user);
    };

    vm.cancel = function () {
        $uibModalInstance.dismiss();
    };
}
