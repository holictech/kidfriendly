(function() {
  'use strict';

  angular.module('kidfriendly').controller('LoginController', LoginController);
  LoginController.$inject = ['LoginService', 'UserService', 'ngFB', '$controller', '$scope'];

  function LoginController(LoginService, UserService, ngFB, $controller, $scope) {
    var vm = this;
    angular.extend(this, $controller('AbstractController', {'vm': vm}));
    initialize();

    vm.authenticate = function() {
      vm.showLoading();
      LoginService.authenticateUser(sha256_digest(vm.login.token), vm.login.email).then(function(response) {
        if (!response.error) {
          finishAuthenticate(response.data);
          vm.login.email = null;
          vm.login.token = null;
          vm.go('main.home');
        } else {
          LoginService.ionicPopupAlertError(response.message);
        }

        vm.hideLoading();
      });
    };

    vm.authenticateFB = function() {
      ngFB.login().then(function(response) {
        if (response.status === 'connected') {
          vm.showLoading();
          ngFB.api({path: '/me', params: {fields: 'id, name, gender, picture, email'}}).then(function(response) {
            authenticateUserFB(response);
          }, function() {
            LoginService.ionicPopupAlertError('Falha ao se comunicar com o facebook.<br/>Tente mais tarde.');
            vm.hideLoading();
          });
        }
      });
    };

    function initialize() {
      $scope.$on('$ionicView.beforeEnter', function() {
        vm.login = {
          email: null,
          token: null
        }
      });
    }

    function authenticateUserFB(userFB) {
      LoginService.authenticateUserSocialNetwork(userFB.id).then(function(response) {
        if (response.error) {
          LoginService.ionicPopupAlertError(response.message);
          vm.hideLoading();
        } else if (response.data !== null) {
          finishAuthenticate(response.data);
          vm.hideLoading();
        } else {
          ngFB.api({path: '/' + userFB.id + '/picture', params: {type:'large', width: 300, height: 300, redirect: false}}).then(function(response) {
            userFB.picture.data = response.data;
            includeUserFB(userFB);
          }, function() {
            LoginService.ionicPopupAlertError('Falha ao se comunicar com o facebook.<br/>Tente mais tarde.');
            vm.hideLoading();
          });
        }
      });
    }

    function includeUserFB(userFB) {
      var user = {
        genderEnum: ((userFB.gender === null || angular.isUndefined(userFB.gender)) ? null : userFB.gender.toUpperCase()),
        idSocialNetwork: userFB.id,
        dsName: userFB.name,
        mgUser: null
      };

      LoginService.urlToBase64(userFB.picture.data.url).then(function(response) {
        user.mgUser = response;
        includeUserSocicalNetwork(user);
      });
    }

    function includeUserSocicalNetwork(user) {
      UserService.includeSocialNetwork(user).then(function(response) {
        if (!response.error) {
          finishAuthenticate(response.data);
        } else {
          UserService.ionicPopupAlertError(response.message);
        }

        vm.hideLoading();
      });
    }

    function finishAuthenticate(user) {
      UserService.includeLocalStorage(user);
      vm.go('main.home');
    }
  }
})();