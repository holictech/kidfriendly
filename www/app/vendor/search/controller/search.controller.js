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

    vm.isExists = function(item) {
      return vm.characteristcsSelected.indexOf(item) > -1;
    };

    vm.toggle = function(item) {
      var index = vm.characteristcsSelected.indexOf(item);

      if (index > -1) {
        vm.characteristcsSelected.splice(index, 1);
      } else {
        vm.characteristcsSelected.push(item);
      }
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
    
    /*
    vm.isVisible = false;
    vm.desNameCompany = null;
    vm.states = [];
    vm.idState = null;
    vm.cities = [];
    vm.idCity = null;
    vm.categories = [];
    vm.idCategory = null;
    vm.characteristics = [];
    vm.halfCharacteristics = [];
    vm.characteristcsSelected = [];
    vm.isSuperKidFriendly = false;
    vm.isNextToMe = false;
    initialize();

    vm.listCityByState = function() {
      vm.cities = [];
      vm.idCity = null;

      if (vm.idState !== null) {
        vm.showLoading();
        LocalityService.listCityByState(vm.idState).then(function(response) {
          vm.cities = response.data;
          vm.hideLoading();
        }, function(response) {
          LocalityService.ionicPopupAlertError(response.message);
          vm.hideLoading();
        });
      }
    };

    vm.listCharacteristicByCategiry = function() {
      vm.characteristics = [];
      vm.halfCharacteristics = [];
      vm.characteristcsSelected = [];

      if (vm.idCategory !== null) {
        vm.showLoading();
        CharacteristicService.listByCategory(vm.idCategory).then(function(response) {
          vm.characteristics = response.data;
          vm.halfCharacteristics = vm.characteristics.splice(Math.ceil((vm.characteristics.length / 2)));
          vm.hideLoading();
        }, function(response) {
          CharacteristicService.ionicPopupAlertError(response.message);
          vm.hideLoading();
        });
      } else {
        $ionicScrollDelegate.scrollTop();
      }
    };

    vm.toggle = function(item) {
      var index = vm.characteristcsSelected.indexOf(item);

      if (index > -1) {
        vm.characteristcsSelected.splice(index, 1);
      } else {
        vm.characteristcsSelected.push(item);
      }
    };

    vm.isExists = function(item) {
      return vm.characteristcsSelected.indexOf(item) > -1;
    };

    vm.search = function() {
      if (vm.formSearch.desNameCompany.$error.minlength) {
          SearchService.ionicPopupAlertAttention('A pesquisa deve ter, no mínimo, 5 caracteres.');
          return;
      }

      if (vm.formSearch.desNameCompany.$error.required && vm.idState === null && vm.idCity === null && vm.idCategory === null &&
        vm.characteristcsSelected.length === 0 && !vm.isSuperKidFriendly && !vm.isNextToMe) {
        SearchService.ionicPopupAlertAttention('Por favor, selecione, pelo menos, um filtro.');
        return;
      }

      vm.desNameCompany = (vm.desNameCompany !== null) ? vm.desNameCompany.trim() : null;
      var params = {
        desNameCompany: vm.desNameCompany,
        idState: vm.idState,
        idCity: vm.idCity,
        idCategory: vm.idCategory,
        characteristics: vm.characteristcsSelected,
        isSuperKidFriendly: vm.isSuperKidFriendly,
        longitude: null,
        latitude: null
      };

      if (vm.isNextToMe) {
        vm.showLoading();
        SearchService.getGeolocation().then(function(response) {
          if (response.error) {
            vm.hideLoading();
            SearchService.ionicPopupAlertAttention(response.message).then(function() {
              executeSearch(params);
            });
          } else {
            params.longitude = response.data.longitude;
            params.latitude = response.data.latitude;
            executeSearch(params);
          }
        });
      } else {
        executeSearch(params);
      }
    };

    function initialize() {
      if (statesPrepService.error || categoriesPrepService.error) {
        vm.hideLoading();
        SearchService.ionicPopupAlertError((statesPrepService.error) ? statesPrepService.message : categoriesPrepService.message).then(function() {
          vm.goBack();
        });
      } else {
        $scope.$on('$ionicView.beforeEnter', function() {
          $ionicScrollDelegate.scrollTop();
          vm.isVisible = true;
          vm.states = statesPrepService.data;
          vm.categories = categoriesPrepService.data;
          vm.timeoutHideLoading();
        });
      }
    }

    function executeSearch(params) {
      vm.showLoading();
      SearchService.get(params).then(function(response) {
        if (response.error) {
          vm.hideLoading();
          SearchService.ionicPopupAlertError(response.message);
        } else if (response.data.results.length === 0) {
          vm.hideLoading();
          SearchService.ionicPopupAlertAttention('Nenhum estabelecimento encontrado.');
        } else {
          vm.go('main.result', false, {filters: params, 'response': response});
        }
      });
    }*/
  }
})();
