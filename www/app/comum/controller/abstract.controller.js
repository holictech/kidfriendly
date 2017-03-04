(function() {
  'use strict';

  angular.module('comum.controller').controller('AbstractController', AbstractController);
  AbstractController.$inject = ['$ionicLoading', '$timeout', '$ionicHistory', '$state', 'AbstractService', '$ionicModal', '$scope',
    'EVENT_USER_LOGGED', 'ngFB', 'Upload'];

  function AbstractController($ionicLoading, $timeout, $ionicHistory, $state, AbstractService, $ionicModal, $scope, EVENT_USER_LOGGED, ngFB, Upload) {
    var vm = this;
    var abstractService = new AbstractService();
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

    vm.go = function(state, loading, params) {
      if (!angular.isUndefined(loading) && loading && !$state.is(state)) {
        vm.showLoading();
      }

      $state.go(state, (angular.isUndefined(params) ? null : {'params': params}));
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
        if (response.error) {
          abstractService.ionicPopupAlertError(response.message);
        } else if (!response.data.login.stActive) {
          abstractService.ionicPopupAlertAttention('Email não está ativo.');
        } else if (getToken() !== response.data.login.desPassword) {
          abstractService.ionicPopupAlertAttention('Senha inválida.');
        } else {
          finishAuthenticateUser(response.data);
        }

        vm.hideLoading();
      });
    };

    vm.authenticateFB = function() {
      ngFB.login().then(function(response) {
        if (response.status === 'connected') {
          ngFB.api({
            path: '/me',
            params: {fields: 'id, name, gender, picture, email'}
          }).then(function(response) {
            authenticateUserFB(response);
          }, function(response) {
            abstractService.ionicPopupAlertError('Falha ao se comunicar com o facebook.<br/>Tente mais tarde.');
          });
        }
      });
    };

    vm.logout = function() {
      abstractService.removeLocalStorage(keyLocalStorageUser);
    };

    function getToken() {
      return "fRiEnDlY" + md5(vm.login.idLogin + md5(vm.login.desPassword)) + "KiD";
    }

    function authenticateUserFB(userFB) {
      vm.showLoading();
      authenticateUserSocialNetwork(userFB.id).then(function(response) {
        if (response.error) {
          abstractService.ionicPopupAlertError(response.message);
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
        dsName: userFB.name
      };

      includeUserSocicalNetwork(user, userFB.picture.data.url);
    }

    function authenticateUserSocialNetwork(idSocialNetwork) {
      return abstractService.httpGet(abstractService.getURI() + '/login/authenticateusersocialnetwork/' + idSocialNetwork).then(function(response) {
        return response;
      });
    }

    function includeUserSocicalNetwork(user, urlImg) {
      abstractService.httpPost(abstractService.getURI() + '/user/includesocialnetwork/', user, {urlImg: urlImg}).then(function(response) {
        if (response.error) {
          abstractService.ionicPopupAlertError(response.message);
          vm.hideLoading();
        } else {
          finishAuthenticateUser(response.data);
          vm.hideLoading();
        }
      });
    }

    function finishAuthenticateUser(user) {
      vm.closeLogin();
      abstractService.setLocalStorage(keyLocalStorageUser, user);
      $scope.$broadcast(EVENT_USER_LOGGED);
    }
  }
})();
