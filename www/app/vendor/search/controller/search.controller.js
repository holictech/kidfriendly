(function() {
  'use strict';

  angular.module('kidfriendly').controller('SearchController', SearchController);

  SearchController.$inject = ['$scope', '$state', '$ionicLoading', '$ionicScrollDelegate', 'CharacteristicService'];

  function SearchController($scope, $state, $ionicLoading, $ionicScrollDelegate, CharacteristicService) {
    var vm = this;
    var idCategory;
    vm.characteristics = [];
    vm.halfCharacteristics = [];
    vm.dsCategory = "";
    vm.isSuperKidFriendly = false;
    vm.isNextToMe = false;
    vm.characteristcsSelected = [];
    initialize();

    vm.toggle = function(item, list) {
      var index = list.indexOf(item);

      if (index > -1) {
        list.splice(index, 1);
      } else {
        list.push(item);
      }
    };

    vm.isExists = function(item, list) {
      return list.indexOf(item) > -1;
    };

    vm.search = function() {
      console.log(vm.characteristcsSelected);
    };

    function initialize() {
      $scope.$on('$ionicView.beforeEnter', function() {
        $ionicScrollDelegate.scrollTop();
        var category = $state.params.params;

        if (!angular.isDefined(idCategory) || idCategory !== category.idCategory) {
          vm.isSuperKidFriendly = false;
          vm.isNextToMe = false;
          vm.characteristcsSelected = [];
        }

        vm.dsCategory = getDsCategory(category.idCategory);
        CharacteristicService.listByCategory(category).then(function(response) {
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

    function getDsCategory(idCategory) {
      var dsCategory = "";

      switch (idCategory) {
        case 1:
          dsCategory = "Restaurantes";
          break;
        case 2:
          dsCategory = "Hoteis";
          break;
        case 3:
          dsCategory = "Passeios";
          break;
      }

      return dsCategory;
    }
  }
})();
