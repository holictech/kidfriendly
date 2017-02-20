(function() {
  'use strict';

  angular.module('kidfriendly').controller('SearchController', SearchController);
  SearchController.$inject = ['SearchService', 'CharacteristicService', '$scope', '$state', '$controller', '$ionicScrollDelegate',
    'statesPrepService', 'categoriesPrepService', 'LocalityService'];

  function SearchController(SearchService, CharacteristicService, $scope, $state, $controller, $ionicScrollDelegate,
    statesPrepService, categoriesPrepService, LocalityService) {
    var vm = this;
    angular.extend(this, $controller('AbstractController', {'vm': vm}));
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
          SearchService.ionicPopupAlertAttention('Estabeledimento deve conter no mínimo 5 caracteres.');
          return;
      }

      if (vm.formSearch.desNameCompany.$error.required && vm.idState === null && vm.idCity === null && vm.idCategory === null &&
        vm.characteristcsSelected.length === 0 && !vm.isSuperKidFriendly && !vm.isNextToMe) {
        SearchService.ionicPopupAlertAttention('Nenhum filtro informado.');
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
    }

    /*
    var vm = this;
    var idCategory;
    angular.extend(this, $controller('AbstractController', {'vm': vm}));
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
      if (vm.characteristcsSelected.length === 0 && !vm.isNextToMe && !vm.isSuperKidFriendly) {
        SearchService.ionicPopupAlertAttention('Nenhum filtro selecionado.');
        return;
      }

      var params = {
        'idCharacteristic': vm.characteristcsSelected,
        'idCategory': idCategory,
        'isSuperKidFriendly': vm.isSuperKidFriendly
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
          var category = $state.params.params;
          $ionicScrollDelegate.scrollTop();
          vm.showLoading();

          if (!angular.isDefined(idCategory) || idCategory !== category.idCategory) {
            idCategory = category.idCategory;
            vm.isSuperKidFriendly = false;
            vm.isNextToMe = false;
            vm.characteristcsSelected = [];
          }

          vm.dsCategory = getDsCategory(category.idCategory);
          CharacteristicService.listByCategory(category.idCategory).then(function(response) {
            vm.characteristics = response.data;
            vm.halfCharacteristics = vm.characteristics.splice(Math.ceil((vm.characteristics.length / 2)));
            vm.isVisible = true;
            vm.timeoutHideLoading();
          }, function(response) {
            vm.characteristics = [];
            vm.halfCharacteristics = [];
            vm.isVisible = false;
            vm.hideLoading();
            SearchService.ionicPopupAlertError(response.message);
          });
        });
      }
    }

    function getDsCategory(idCategory) {
      var dsCategory = '';

      switch (idCategory) {
        case 1:
          dsCategory = 'Restaurantes';
          break;
        case 2:
          dsCategory = 'Hoteis';
          break;
        case 3:
          dsCategory = 'Passeios';
          break;
      }

      return dsCategory;
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
          vm.go('main.result', false, {filters: params, 'response': response, 'dsCategory': getDsCategory(params.idCategory)});
        }
      });
    }
    */
  }
})();
