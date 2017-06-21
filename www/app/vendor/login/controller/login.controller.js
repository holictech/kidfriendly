(function() {
  'use strict';

  angular.module('kidfriendly').controller('LoginController', LoginController);
  LoginController.$inject = ['LoginService', 'UserService', 'ngFB', '$controller'];

  function LoginController(LoginService, UserService, ngFB, $controller) {
    var vm = this;
    angular.extend(this, $controller('AbstractController', {'vm': vm}));
    vm.login = {
      email: null,
      token: null
    }

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
          ngFB.api({path: '/me',params: {fields: 'id, name, gender, picture, email'}}).then(function(response) {
            authenticateUserFB(response);
          }, function(response) {
            LoginService.ionicPopupAlertError('Falha ao se comunicar com o facebook.<br/>Tente mais tarde.');
            vm.hideLoading();
          });
        }
      });
    };

    function authenticateUserFB(userFB) {
      LoginService.authenticateUserSocialNetwork(userFB.id).then(function(response) {
        if (response.error) {
          LoginService.ionicPopupAlertError(response.message);
          vm.hideLoading();
        } else if (response.data !== null) {
          finishAuthenticateUser(response.data);
          vm.hideLoading();
        } else {
          includeUserFB(userFB);
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
        if (!reponse.error) {
          finishAuthenticate(response.data);
        } else {
          UserService.ionicPopupAlertError(response.message);
        }

        vm.hideLoading();
      });
    }

    function finishAuthenticate(user) {
      UserService.includeLocalStorage(user);
    }
  }
})();