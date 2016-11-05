(function() {
  'use strict';

  angular.module('comum.controller').controller('AbstractController', AbstractController);

  AbstractController.$inject = ['$ionicLoading', '$timeout'];

  function AbstractController($ionicLoading, $timeout) {
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
      }, 700);
    };
  }
})();
