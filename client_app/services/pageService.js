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

    services.showResponseError = function(res, type, title) {
        services.showAlert(res.status + ' - ' + res.statusText + ": " + (res.data.message || res.data.errmsg || res.data), type || 'danger',  title || 'Error');
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

    services.refreshMyUserIfNeeded = function(user) {
        if (services.mainData.myUser && services.mainData.myUser._id === user._id) {
            services.mainData.myUser = user;
        }
    };

    services.formatDateTime = function(dateString) {
        var date = new Date(dateString);
        var monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
        ];

        var monthIndex = date.getMonth();
        return ('00' + date.getDate()).slice(-2) + ' ' + monthNames[monthIndex] + ' ' +
            ('00' + date.getHours()).slice(-2) + ':' + ('00' + date.getMinutes()).slice(-2);
    };

    return services;
}
