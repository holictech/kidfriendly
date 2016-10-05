(function() {
  'use strict';

  angular.module('kidfriendly').controller('HomeController', HomeController);

  HomeController.$inject = ['HomeService', '$ionicLoading', '$scope'];

  function HomeController(HomeService, $ionicLoading, $scope) {
    var vm = this;
    vm.suggestions = [];
    vm.nextToMe = [];
    initialize(true);

    vm.refresh = function() {
      initialize(false);
    };

    function initialize(isShowMessageGeolocation) {
      $ionicLoading.show();
      HomeService.getGeolocation().then(function(response) {
        $ionicLoading.hide();

        if (angular.isString(response) && isShowMessageGeolocation) {
          HomeService.ionicPopupAlertAttention(response).then(function() {
            listCompanies();
          });
        } else {
          listCompanies(response);
        }
      });
    }

    function listCompanies(longitudeLatitude) {
      $ionicLoading.show();
      HomeService.get(longitudeLatitude).then(function(response) {
        var suggestions = [];
        var nextToMe = [];
        $ionicLoading.hide();

        if (HomeService.isObject(response)) {
          suggestions = response.suggestions;
          nextToMe = response.nextToMe;

          if (suggestions.length === 0 && nextToMe.length === 0) {
            HomeService.ionicPopupAlertAttention('Nenhum estabelecimento encontrado.');
          }
        } else {
          HomeService.ionicPopupAlertError(response);
        }

        vm.suggestions = suggestions;
        vm.nextToMe = nextToMe;
      }).finally(function() {
        $scope.$broadcast('scroll.refreshComplete');
      });
    }
  }
})();
