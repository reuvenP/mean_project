angular.module('myApp').controller('userDetailsCtrl', ['$uibModalInstance', '$scope', 'pageService', 'user', 'fileReader', userDetailsCtrl]);
function userDetailsCtrl($uibModalInstance, $scope, pageService, user, fileReader) {
    //$scope.userDetails =  $scope.userDetails || {};
    //var vm = $scope.userDetails;

    var vm = this;
    vm.mainData = pageService.mainData;
    vm.newUser = !user;
    vm.user = user || {};
    vm.rawPassword = "";
    vm.userImage = vm.user.image || "public/img/user_avatar.png";

    $uibModalInstance.rendered.then(function () {
        //$.getScript("/client_app/views/editUserValidator.js");
    });

    vm.onFileSelection = function(file) {
        vm.progress = 0;
        fileReader.readAsDataUrl(file, $scope).then(
            function(result) {
                if (result.startsWith('data:image')) {
                    vm.user.image = vm.userImage = result;
                }
            }
        );
    };

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

    $scope.$on("fileProgress", function(e, progress) {
        vm.progress = progress.loaded / progress.total;
    });
}
