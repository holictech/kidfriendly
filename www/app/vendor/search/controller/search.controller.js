(function() {
  'use strict';

  angular.module('kidfriendly').controller('SearchController', SearchController);
  SearchController.$inject = ['SearchService', 'StatesPrepService', 'LocalityService', 'CategoryPrepService', 'CharacteristicService', '$controller', '$scope', '$ionicScrollDelegate'];

  function SearchController(SearchService, StatesPrepService, LocalityService, CategoryPrepService, CharacteristicService, $controller, $scope, $ionicScrollDelegate) {
    var vm = this;
    angular.extend(this, $controller('AbstractController', {'vm': vm}));
    vm.establishment = null;
    vm.idState = null;
    vm.idCity = null;
    vm.idCategory = null;
    vm.characteristics = [];
    vm.characteristcsSelected = [];
    vm.isNextToMe = false;
    vm.isSuperKidFriendly = false;

    initialize();

    vm.fastSearch = function() {
      executeSearch({desNameCompany: vm.establishment === null || angular.isUndefined(vm.establishment) ? null : vm.establishment.trim()});
    };

    vm.listCityByState = function(idState) {
      vm.cities = [];

      if (idState !== null) {
        vm.showLoading();
        LocalityService.listCityByState(idState).then(function(response) {
          vm.cities = response.data;
          vm.hideLoading();
        }, function(response) {
          LocalityService.ionicPopupAlertError(response.message);
          vm.hideLoading();
        });
      }
    };

    vm.listCharacteristicByCategory = function(idCategory) {
      vm.characteristcsSelected = [];
      vm.characteristics = [];

      if (idCategory !== null) {
        vm.showLoading();
        CharacteristicService.listByCategory(idCategory).then(function(response) {
          vm.characteristics = response.data;
          vm.hideLoading();
        }, function(response) {
          CharacteristicService.ionicPopupAlertError(response.message);
          vm.hideLoading();
        });
      } else {
        $ionicScrollDelegate.scrollTop();
      }
    };

    vm.onValueChanged = function(value) {
      vm.characteristcsSelected = [];

      angular.forEach(value, function(item, key) {
        if (item.checked) {
          vm.characteristcsSelected.push(item.idCharacteristic);
        }
      });
    };

    vm.search = function() {
      var filters = {
        idState: vm.idState,
        idCity: vm.idCity,
        idCategory: vm.idCategory,
        characteristics: vm.characteristcsSelected,
        longitude: null,
        latitude: null,
        isSuperKidFriendly: vm.isSuperKidFriendly
      }

      if (vm.isNextToMe) {
        vm.showLoading();
        SearchService.getGeolocation().then(function(response) {
          if (response.error) {
            vm.hideLoading();
            SearchService.ionicPopupAlertAttention(response.message).then(function() {
              executeSearch(filters);
            });
          } else {
            params.longitude = response.data.longitude;
            params.latitude = response.data.latitude;
            executeSearch(filters);
          }
        });
      } else {
        executeSearch(filters);
      }
    };

    function initialize() {
      $scope.$on('$ionicView.beforeEnter', function() {
        $ionicScrollDelegate.scrollTop();
        vm.states = StatesPrepService.data;
        vm.categories = CategoryPrepService.data;
        vm.timeoutHideLoading();
      });
    }

    function executeSearch(filters) {
      vm.showLoading();
      SearchService.get(filters).then(function(response) {
        if (response.error) {
          vm.hideLoading();
          SearchService.ionicPopupAlertError(response.message);
        } else if (response.data.results.length === 0) {
          vm.hideLoading();
          SearchService.ionicPopupAlertAttention('Nenhum estabelecimento.');
        } else {
          vm.go('main.result', false, {'filters': filters, 'response': response});
        }
      });
    }

    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      if (toState.name === 'main.search' && fromState.name !== 'main.search-result') {
        vm.establishment = null;
        vm.idState = null;
        vm.idCity = null;
        vm.idCategory = null;
        vm.characteristics = [];
        vm.characteristcsSelected = [];
        vm.isNextToMe = false;
        vm.isSuperKidFriendly = false;
      }
    });
  }
})();
