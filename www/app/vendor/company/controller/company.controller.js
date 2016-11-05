(function() {
  'use strict';

  angular.module('kidfriendly').controller('CompanyController', CompanyController);

  CompanyController.$inject = ['CompanyService', '$scope', '$state', '$controller'];

  function CompanyController(CompanyService, $scope, $state, $controller) {
    var vm = this;
    angular.extend(this, $controller('AbstractController', {'vm': vm}));
    vm.company = {};
    vm.characteristics = [];
    vm.halfCharacteristics = [];
    initialize();

    function initialize() {
      $scope.$on('$ionicView.enter', function() {
        vm.company.imgLogo = null;
        vm.company.numRate = 4;
        vm.characteristics = [1, 2, 3, 4 , 5, 6, 7, 8, 9];
        vm.halfCharacteristics = vm.characteristics.splice(Math.ceil((vm.characteristics.length / 2)));
        vm.timeoutHideLoading();
        console.log(angular.toJson($state.params.params));
      });
    }
  }
})();
