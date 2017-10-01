(function() {
  'use strict';

  angular.module('kidfriendly').controller('SearchController', SearchController);
  SearchController.$inject = ['SearchService', 'StatesPrepService', 'LocalityService', 'CategoryPrepService', 'CharacteristicService', '$controller', '$scope', '$ionicScrollDelegate', '$rootScope'];

  function SearchController(SearchService, StatesPrepService, LocalityService, CategoryPrepService, CharacteristicService, $controller, $scope, $ionicScrollDelegate, $rootScope) {
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

    /*
    vm.fastSearch = function() {
      executeSearch({desNameCompany: vm.establishment === null || angular.isUndefined(vm.establishment) ? null : vm.establishment.trim()});
    };
    */

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
        desNameCompany: (vm.establishment === null || angular.isUndefined(vm.establishment) ? null : vm.establishment.trim()),
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
        LocalityService.getGeolocation().then(function(response) {
          if (response.error) {
            vm.hideLoading();
            LocalityService.ionicPopupAlertAttention(response.message).then(function() {
              executeSearch(filters);
            });
          } else {
            filters.longitude = response.data.longitude;
            filters.latitude = response.data.latitude;
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

        if (StatesPrepService.error || CategoryPrepService.error) {
          vm.hideLoading();
          SearchService.ionicPopupAlertError(StatesPrepService.error ? StatesPrepService.message : CategoryPrepService.message).then(function() {
            vm.go('main.home');
          });

          return;
        }

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
          vm.go('main.result', {'filters': filters, 'response': response}, true);
        }
      });
    }

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      if (toState.name === 'main.search' && fromState.name !== 'main.result') {
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
