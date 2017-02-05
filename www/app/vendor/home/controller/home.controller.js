(function() {
  'use strict';

  angular.module('kidfriendly').controller('HomeController', HomeController);
  HomeController.$inject = ['HomeService', '$scope', '$state', '$controller'];

  function HomeController(HomeService, $scope, $state, $controller) {
    var vm = this;
    angular.extend(this, $controller('AbstractController', {'vm': vm}));
    vm.suggestions = [];
    vm.nextToMe = [];
    initialize(true);

    vm.refresh = function() {
      initialize(false);
    };

    vm.detailsCompany = function(company) {
      vm.showLoading();
      $state.go('main.company', (angular.isUndefined(company) ? null : {'params': {'company': company}}));
    };

    function initialize(isShowMessageGeolocation) {
      vm.showLoading();
      HomeService.getGeolocation().then(function(response) {
        if (response.error && isShowMessageGeolocation) {
          vm.hideLoading();
          HomeService.ionicPopupAlertAttention(response.message).then(function() {
            listCompanies();
          });
        } else {
          listCompanies(response.data);
        }
      });
    }

    function listCompanies(longitudeLatitude) {
      HomeService.get(longitudeLatitude).then(function(response) {
        var suggestions = [];
        var nextToMe = [];

        if (!response.error) {
          suggestions = response.data.suggestions;
          nextToMe = response.data.nextToMe;

          if (suggestions.length === 0 && nextToMe.length === 0) {
            vm.hideLoading();
            HomeService.ionicPopupAlertAttention('Nenhum estabelecimento encontrado.');
          }
        } else {
          vm.hideLoading();
          HomeService.ionicPopupAlertError(response.message);
        }

        vm.timeoutHideLoading();
        vm.suggestions = suggestions;
        vm.nextToMe = nextToMe;
      }).finally(function() {
        $scope.$broadcast('scroll.refreshComplete');
      });
    }
  }
})();
