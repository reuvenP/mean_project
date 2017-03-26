angular.module('myApp').factory('usersService', ['$http', '$q', '$uibModal', usersService]);
function usersService($http, $q, $uibModal) {
    var services = {};
    services.usersList = [];

    function refreshUsersList(newUsersList) {
        services.usersList.length = 0;
        for(var i = 0, len = newUsersList.length; i < len; ++i) {
            services.usersList[i] = newUsersList[i];
        }
    }

    function replaceUserInList(oldUser, newUser) {
        for(var i = 0, len = services.usersList.length; i < len; ++i) {
            if (services.usersList[i]._id === oldUser._id) {
                services.usersList[i] = newUser;
            }
        }
    }

    function deleteUserFromList(userId) {
        var newUserList = [];
        for(var i = 0, j = 0, len = services.usersList.length; i < len; ++i) {
            if (services.usersList[i]._id != userId) {
                newUserList[j++] = services.usersList[i];
            }
        }
        refreshUsersList(newUserList);
    }

    var refreshUsers = function () {
        var deferred = $q.defer();
        $http.get('/users/getUsers').then(function (res) {
            refreshUsersList(res.data);
            deferred.resolve();
        }, function (res) {
            deferred.reject(res);
        });

        return deferred.promise;
    };

    var deleteUser = function (userId) {
        var deferred = $q.defer();
        $http.delete('/users/deleteUser/' + userId)
            .then(function (res) {
                deleteUserFromList(userId);
                deferred.resolve(userId);
            }, function (res) {
                deferred.reject(res);
            });

        return deferred.promise;
    };

    var addUser = function(user) {
        var deferred = $q.defer();
        var req = {
            method: 'POST',
            url: '/users/addUser',
            data: { user: user }
        };
        $http(req).then(
            function (res) {
                services.usersList.push(res.data);
                deferred.resolve(res.data);
            }, function (res) {
                deferred.reject(res);
            }
        );

        return deferred.promise;
    };

    var editUser = function(user) {
        var deferred = $q.defer();
        var req = {
            method: 'PUT',
            url: '/users/editUser/' + user._id,
            data: { user: user }
        };
        $http(req).then(
            function (res) {
                replaceUserInList(user, res.data);
                deferred.resolve(res.data);
            }, function (res) {
                deferred.reject(res);
            }
        );

        return deferred.promise;
    };

    var openUserEditModal = function(user /*, $scope*/) {
        var modal = $uibModal.open({
            animation: true,
            backdrop: 'static',
            windowsClass: 'center-modal',
            size: 'md',
            templateUrl: '/client_app/views/editUser.html',
            controller: userDetailsCtrl,
            controllerAs: 'userDetails',
            //scope: $scope,
            resolve: {
                user: function () {
                    return user;
                }
            }
        });
        return modal.result;
    };

    services.refreshUsers = refreshUsers;
    services.deleteUser = deleteUser;
    services.addUser = addUser;
    services.editUser = editUser;
    services.openUserEditModal = openUserEditModal;

    return services;
}
