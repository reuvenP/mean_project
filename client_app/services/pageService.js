angular.module('myApp').factory('pageService', ['$http', '$q', '$uibModal', pageService]);
function pageService($http, $q, $uibModal) {
    var services = {};
    services.mainData = {};

    function setAlert(alert, type, title) {
        services.mainData.alert = alert;

        if (type) {
            services.mainData.alertType = 'alert-' + type;
        }
        else {
            services.mainData.alertType = 'alert-info';
        }
        if (title) {
            services.mainData.alertTitle = title;
        }
        else {
            delete(services.mainData.alertTitle);
        }
    }

    services.setNextAlert = function($scope, alert, type, title) {
        $scope.$on('$locationChangeSuccess', function(event) {
            setAlert(alert, type, title);
        });
    };

    services.showAlert = function(alert, type, title) {
        setAlert(alert, type, title);
    };

    services.clearAlert = function() {
        delete(services.mainData.alert);
        delete(services.mainData.alertType);
        delete(services.mainData.alertTitle);
    };

    services.setPageTitle = function(pageHeader, pageDescription) {
        services.mainData.pageHeader = pageHeader;
        if (pageDescription) {
            services.mainData.pageDescription = pageDescription;
        }
        else {
            delete(services.mainData.pageDescription);
        }
    };

    services.openModal = function(header, message, closeTitles, cancelTitle, modalType) {
        var modal = $uibModal.open({
            animation: true,
            backdrop: false,
            windowsClass: 'center-modal',
            size: 'md',
            templateUrl: '/client_app/views/modalBox.html',
            controller: modalCtrl,
            controllerAs: 'modal',
            resolve: {
                modalDetails: function() {
                    return {
                        header: header,
                        message: message,
                        closeTitles: closeTitles,
                        cancelTitle: cancelTitle,
                        modalType: modalType
                    };
                }
            }
        });

        return modal.result;
    };

    return services;
}
