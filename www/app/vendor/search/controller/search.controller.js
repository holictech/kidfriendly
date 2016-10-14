(function() {
  'use strict';

  angular.module('kidfriendly').controller('SearchController', SearchController);

  SearchController.$inject = ['$scope', '$state', '$ionicLoading', '$ionicScrollDelegate', 'SearchService', 'CharacteristicService'];

  function SearchController($scope, $state, $ionicLoading, $ionicScrollDelegate, SearchService, CharacteristicService) {
    var vm = this;
    var idCategory;
    vm.characteristics = [];
    vm.halfCharacteristics = [];
    vm.dsCategory = "";
    vm.isSuperKidFriendly = false;
    vm.isNextToMe = false;
    vm.characteristcsSelected = [];
    vm.isVisible = false;
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
      if (vm.characteristcsSelected.length === 0) {
        SearchService.ionicPopupAlertAttention('Nenhum filtro selecionado.');
        return;
      }

      var params = {
        'idCharacteristic': vm.characteristcsSelected,
        'idCategory': idCategory,
        'isSuperKidFriendly': vm.isSuperKidFriendly
      };

      if (vm.isNextToMe) {
        $ionicLoading.show();
        SearchService.getGeolocation().then(function(response) {
          $ionicLoading.hide();

          if (angular.isString(response)) {
            SearchService.ionicPopupAlertAttention(response).then(function() {
              executeSearch(params);
            });
          } else {
            params.longitude = response.longitude;
            params.latitude = response.latitude;
            executeSearch(params);
          }
        });
      } else {
        executeSearch(params);
      }
    };

    function initialize() {
      $scope.$on('$ionicView.enter', function() {
        $ionicScrollDelegate.scrollTop();
        $ionicLoading.show();
        var category = $state.params.params;

        if (!angular.isDefined(idCategory) || idCategory !== category.idCategory) {
          idCategory = category.idCategory;
          vm.isSuperKidFriendly = false;
          vm.isNextToMe = false;
          vm.characteristcsSelected = [];
        }

        vm.dsCategory = getDsCategory(category.idCategory);
        CharacteristicService.listByCategory(category).then(function(response) {
          vm.characteristics = response;
          vm.halfCharacteristics = vm.characteristics.splice((vm.characteristics.length / 2) + 1);
          vm.isVisible = true;
          $ionicLoading.hide();
        }, function(response) {
          vm.characteristics = [];
          vm.halfCharacteristics = 0;
          vm.isVisible = false;
          SearchService.ionicPopupAlertError(response);
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

    function executeSearch(params) {
      $ionicLoading.show();
      SearchService.get(params).then(function(response) {
        if (angular.isString(response)) {
          $ionicLoading.hide();
          SearchService.ionicPopupAlertError(response);
        } else if (angular.isObject(response) &&
                   ((response.results === null) ||
                   (angular.isArray(response.results) && response.results.length === 0))) {
          $ionicLoading.hide();
          SearchService.ionicPopupAlertAttention('Nenhum estabelecimento encontrado.');
        } else if (angular.isObject(response) &&
                   angular.isArray(response.results) &&
                   response.results.length !== 0) {
          $state.go('main.result', {'params': {filters: params, 'response': response}});
        } else {
          $ionicLoading.hide();
        }
      });
    }
  }
})();
