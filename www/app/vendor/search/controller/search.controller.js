(function() {
  'use strict';

  angular.module('kidfriendly').controller('SearchController', SearchController);

  SearchController.$inject = ['$scope', '$state', '$ionicLoading', '$ionicScrollDelegate', 'CharacteristicService'];

  function SearchController($scope, $state, $ionicLoading, $ionicScrollDelegate, CharacteristicService) {
    var vm = this;
    vm.characteristics = [];
    vm.halfCharacteristics = [];
    initialize();

    function initialize() {
      $scope.$on('$ionicView.beforeEnter', function() {
        $ionicScrollDelegate.scrollTop();
        CharacteristicService.listByCategory($state.params.params).then(function(response) {
          vm.characteristics = response;
          vm.halfCharacteristics = vm.characteristics.splice((vm.characteristics.length / 2) + 1);
          $ionicLoading.hide();
        }, function(response) {
          vm.characteristics = [];
          vm.halfCharacteristics = 0;
          $ionicLoading.hide();
        });
      });
    }
  }
})();
