angular.module('myApp').controller('modalCtrl', ['$uibModalInstance', 'modalDetails', modalCtrl]);
function modalCtrl($uibModalInstance, modalDetails) {
    var vm = this;
    vm.header = modalDetails.header;
    vm.message = modalDetails.message;
    vm.closeTitles = modalDetails.closeTitles;
    vm.cancelTitle = modalDetails.cancelTitle;
    vm.modalType = modalDetails.modalType || 'primary';

    vm.close = function (closeTitle) {
        $uibModalInstance.close(vm.user);
    };

    vm.cancel = function () {
        $uibModalInstance.dismiss();
    };
}
