(function() {
  'use strict';

  angular.module('comum.controller').controller('AbstractController', AbstractController);
  AbstractController.$inject = ['$ionicLoading', '$timeout', '$state', 'UserService'];

  function AbstractController($ionicLoading, $timeout, $state, UserService) {
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

      $state.go(state, ((angular.isUndefined(parameter) || parameter === null) ? {object: 'null'} : {object: angular.toJson(parameter)}));
    };

    vm.isLogged = function() {
      return UserService.isLogged();
    };

    vm.isLoggedSocialNetwork = function() {
      return UserService.isLoggedSocialNetwork();
    };

    vm.isLoggedSocialNetworkNotEmail = function() {
      return UserService.isLoggedSocialNetworkNotEmail();
    };

    vm.getUserLogged = function() {
      return UserService.getUserLogged();
    };
  }
})();
