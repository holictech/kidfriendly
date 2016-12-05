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
    vm.isVisible = false;
    initialize();

    function initialize() {
      $scope.$on('$ionicView.enter', function() {
        var companyDto = $state.params.params;

        if(CompanyService.isObject(companyDto)) {
          CompanyService.details(companyDto.idCompany).then(function(response) {
            if (angular.isString(response)) {
              CompanyService.ionicPopupAlertError(response);
            } else {
              console.log(response);
            }
          });
        }

        vm.company.imgLogo = null;
        vm.company.numRate = 4;
        vm.characteristics = [1, 2, 3, 4 , 5, 6, 7, 8, 9];
        vm.halfCharacteristics = vm.characteristics.splice(Math.ceil((vm.characteristics.length / 2)));
        vm.isVisible = true;
        vm.timeoutHideLoading();
      });
    }
  }

  angular.module('kidfriendly').directive('kfScrollHeigth', ScrollHeigth);

  ScrollHeigth.$inject = ['$window'];

  function ScrollHeigth($window) {
      return {
        restrict: 'A',
        link: function(scope, element, attributes, controllers) {
          scope.onResize = function() {
            var menu = angular.element(document.querySelector('#menu'))[0];
            var scrollRating = angular.element(document.querySelector('#scrollRating'))[0];
            var footer = angular.element(document.querySelector('.bar-footer'))[0];
            element.css('max-height', (footer.offsetTop - (scrollRating.offsetTop + (scrollRating.offsetTop - menu.offsetTop))) + 'px');
          };

          scope.onResize();
        }
      };
    }
})();
