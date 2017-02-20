(function() {
  'use strict';

  angular.module('comum.controller').controller('AbstractController', AbstractController);
  AbstractController.$inject = ['$ionicLoading', '$timeout', '$ionicHistory', '$state'];

  function AbstractController($ionicLoading, $timeout, $ionicHistory, $state) {
    var vm = this;
    vm.state = undefined;

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
  }
})();
