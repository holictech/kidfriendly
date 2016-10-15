(function() {
  'use strict';

  angular.module('kidfriendly').controller('CompanyController', CompanyController);

  CompanyController.$inject = ['CompanyService', '$scope', '$state', '$controller'];

  function CompanyController(CompanyService, $scope, $state, $controller) {
    var vm = this;
    angular.extend(this, $controller('AbstractController', {'vm': vm}));
    initialize();

    function initialize() {
      $scope.$on('$ionicView.enter', function() {
        console.log($state.params.params);
        vm.timeoutHideLoading();
      });
    }
  }
})();
