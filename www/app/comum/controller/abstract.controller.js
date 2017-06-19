(function() {
  'use strict';

  angular.module('comum.controller').controller('AbstractController', AbstractController);
  AbstractController.$inject = ['$ionicLoading', '$timeout', '$state'];

  function AbstractController($ionicLoading, $timeout, $state) {
    var vm = this;
    
    vm.showLoading = function() {
      $ionicLoading.show();
    };

    vm.hideLoading = function() {
      $ionicLoading.hide();
    };

    vm.timeoutHideLoading = function() {
      $timeout(function() {
        vm.hideLoading();
      }, 1000);
    };

    vm.go = function(state, parameter, loading) {
      if (!$state.is(state) && !angular.isUndefined(loading) && loading) {
        vm.showLoading();
      }

      $state.go(state, (angular.isUndefined(parameter) ? null : parameter));
    };
    
    /*var abstractService = new AbstractService();
    var keyLocalStorageUser = 'keyLocalStorageUser';
    var modalLogin = null;
    vm.state = undefined;
    vm.login = {
      idLogin: null,
      desPassword: null
    };

    vm.showLoading = function() {
      $ionicLoading.show();
    };

    vm.hideLoading = function() {
      $ionicLoading.hide();
    };

    vm.timeoutHideLoading = function() {
      $timeout(function() {
        vm.hideLoading();
      }, 700);
    };

    vm.goBack = function() {
      $ionicHistory.goBack(-1);
    };

    vm.go = function(state, loading, parameter) {
      if (!angular.isUndefined(loading) && loading && !$state.is(state)) {
        vm.showLoading();
      }

      $state.go(state, (angular.isUndefined(parameter) ? null : parameter));
    };

    vm.isUserLogged = function() {
      return !angular.isUndefined(vm.getUserLogged());
    };

    vm.getUserLogged = function() {
      return abstractService.getLocalStorage(keyLocalStorageUser);
    };

    vm.openLogin = function() {
      vm.login.idLogin = null;
      vm.login.desPassword = null;
      $ionicModal.fromTemplateUrl('app/view/login/login.html', {
        scope: $scope,
        animation: 'kf-slide-in-down'
      }).then(function(modal) {
        var stopListeningLogin = $scope.$on('modal.hidden', function() {
          stopListeningLogin();
          modalLogin.remove();
        });
        modalLogin = modal;
        modalLogin.show();
      });
    };

    vm.closeLogin = function() {
      modalLogin.hide();
    };

    vm.authenticate = function(formLogin) {
      vm.showLoading();
      abstractService.httpGet(abstractService.getURI() + '/login/authenticateuser/' + vm.login.idLogin).then(function(response) {
        vm.hideLoading();

        if (response.error) {
          abstractService.ionicPopupAlertError(response.message);
        } else if (!response.data.login.stActive) {
          abstractService.ionicPopupAlertAttention('Email não está ativo.');
        } else if (getToken() !== response.data.login.desPassword) {
          abstractService.ionicPopupAlertAttention('Senha inválida.');
        } else {
          finishAuthenticateUser(response.data);
        }
      });
    };

    vm.authenticateFB = function() {
      ngFB.login().then(function(response) {
        vm.showLoading();

        if (response.status === 'connected') {
          ngFB.api({
            path: '/me',
            params: {fields: 'id, name, gender, picture, email'}
          }).then(function(response) {
            authenticateUserFB(response);
          }, function(response) {
            abstractService.ionicPopupAlertError('Falha ao se comunicar com o facebook.<br/>Tente mais tarde.');
            vm.hideLoading();
          });
        } else {
          vm.hideLoading();
        }
      });
    };

    vm.logout = function() {
      var isUserSocialNetwork = (vm.getUserLogged().idSocialNetwork !== null);
      var _buttonLabels = [];
      _buttonLabels.push("Meus Dados");

      if (!isUserSocialNetwork) {
        _buttonLabels.push('Alterar Senha');
      }

      _buttonLabels.push("Sair");

      var options = {
        androidTheme: window.plugins.actionsheet.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
        buttonLabels: _buttonLabels,
        androidEnableCancelButton : true,
        winphoneEnableCancelButton : true,
        addCancelButtonWithLabel: 'Cancelar',
        position: [20, 40]
      };

      window.plugins.actionsheet.show(options, function(buttonIndex) {
        if (buttonIndex === 1) {
          vm.go('main.user', true, {isUpdateUser: true});
        } else if (buttonIndex === 2 && !isUserSocialNetwork) {
          vm.go('main.user', true, {isUpdatePassword: true});
        } else if ((buttonIndex === 2 && isUserSocialNetwork) ||
            (buttonIndex === 3 && !isUserSocialNetwork)) {
          ngFB.logout();
          abstractService.removeLocalStorage(keyLocalStorageUser);          
          vm.go('main.home', true);
        }
      });
    };

    function getToken() {
      return abstractService.createToken(vm.login.idLogin + sha256_digest(vm.login.desPassword));
    }

    function authenticateUserFB(userFB) {
      authenticateUserSocialNetwork(userFB.id).then(function(response) {
        if (response.error) {
          abstractService.ionicPopupAlertError(response.message);
          vm.hideLoading();
        } else if (response.data !== null) {
          vm.hideLoading();
          finishAuthenticateUser(response.data);
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

      abstractService.urlToBase64(userFB.picture.data.url).then(function(response) {
        user.mgUser = response;
        includeUserSocicalNetwork(user);
      });
    }

    function authenticateUserSocialNetwork(idSocialNetwork) {
      return abstractService.httpGet(abstractService.getURI() + '/login/authenticateusersocialnetwork/' + idSocialNetwork).then(function(response) {
        return response;
      });
    }

    function includeUserSocicalNetwork(user) {
      abstractService.httpPost(abstractService.getURI() + '/user/includesocialnetwork', user).then(function(response) {
        if (response.error) {
          abstractService.ionicPopupAlertError(response.message);
          vm.hideLoading();
        } else {
          vm.hideLoading();
          finishAuthenticateUser(response.data);
        }
      });
    }

    function finishAuthenticateUser(user) {
      vm.closeLogin();
      abstractService.setLocalStorage(keyLocalStorageUser, user);
      $scope.$broadcast(EVENT_USER_LOGGED);
    }
    */
  }
})();
