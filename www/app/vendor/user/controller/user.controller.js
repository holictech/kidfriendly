(function() {
  'use strict';

  angular.module('kidfriendly').controller('UserController', UserController);
  UserController.$inject = ['UserService', '$controller', '$scope', 'statesPrepService'];

  function UserController(UserService, $controller, $scope, statesPrepService) {
    var vm = this;
    angular.extend(this, $controller('AbstractController', {'vm': vm, '$scope': $scope}));
    vm.isVisible = false;
    vm.user = {};
    vm.states = [];
    initialize();

    vm.include = function() {
      vm.user.dsName = "Wesley Garcia de Sousa";
      vm.user.genderEnum = "MALE";
      vm.user.dtBirthDay = new Date(moment('1982-05-04').toISOString()).getTime();
      vm.user.blHasChildren = false;
      vm.user.city = {idCity: 1};
      vm.user.login = {
        idLogin: 'wesley.developer@gmail.com',
        desPassword: md5('@g4rci482'),
        stActive: true
      };

      vm.showLoading();
      UserService.include(vm.user).then(function(response) {
        if (response.error) {
          UserService.ionicPopupAlertError(response.message);
        } else {
          UserService.setLocalStorage('keyLocalStorageUser', response.data);
          UserService.ionicPopupAlertSuccess('Suas informações foram cadastras.').then(function() {
            vm.goBack();
          });
        }

        vm.hideLoading();
      });
    };

    vm.update = function() {
      vm.showLoading();
      UserService.update(vm.user).then(function(response) {
        if (response.error) {
          UserService.ionicPopupAlertError(response.message);
        } else {
          UserService.setLocalStorage('keyLocalStorageUser', response.data);
          UserService.ionicPopupAlertSuccess('Suas informações foram atualizadas.').then(function() {
            vm.goBack();
          });
        }

        vm.hideLoading();
      });
    };

    function initialize() {
      if (statesPrepService.error) {
        vm.hideLoading();
        SearchService.ionicPopupAlertError(statesPrepService.message).then(function() {
          vm.goBack();
        });
      } else {
        $scope.$on('$ionicView.beforeEnter', function() {
          vm.isVisible = true;
          vm.user = {};
          vm.states = statesPrepService.data;
          vm.timeoutHideLoading();
        });
      }
    }
  }
})();
