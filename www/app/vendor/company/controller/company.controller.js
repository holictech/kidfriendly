(function() {
  'use strict';

  angular.module('kidfriendly').controller('CompanyController', CompanyController);

  CompanyController.$inject = ['CompanyService', '$scope', '$state', '$controller', 'maskFilter', 'RatingService'];

  function CompanyController(CompanyService, $scope, $state, $controller, maskFilter, RatingService) {
    var vm = this;
    var paginatorDto = null;
    angular.extend(this, $controller('AbstractController', {'vm': vm}));
    vm.company = {};
    vm.address = null;
    vm.characteristics = [];
    vm.halfCharacteristics = [];
    vm.ratings = [];
    vm.isInfiniteScroll = false;
    vm.isVisible = false;
    initialize();

    vm.infiniteScroll = function() {
      var params = {
        'currentPage': paginatorDto.currentPage + 1,
        'pageSize': paginatorDto.pageSize
      };

      vm.showLoading();
      RatingService.listByCompany(vm.company.idCompany, params).then(function(response) {
        if (angular.isString(response)) {
          vm.hideLoading();
          RatingService.ionicPopupAlertError(response);
        } else {
          paginatorDto = response.paginatorDto;
          vm.ratings = vm.ratings.concat(response.results);
          vm.isInfiniteScroll = (angular.isDefined(paginatorDto) && paginatorDto.currentPage !== paginatorDto.pageTotal);
          vm.timeoutHideLoading();
        }
      });
    };

    vm.getFirstLastName = function(name) {
      var strName = '';
      name = name.split(' ');
      strName = name[0] + ' ' + ((name.length > 1) ? name[name.length - 1] : '');

      return strName;
    };

    vm.launchNavigator = function() {
      vm.showLoading();
      CompanyService.getGeolocation().then(function(response) {
        if (angular.isString(response)) {
          CompanyService.ionicPopupAlertAttention(response);
        } else {
          if (angular.isObject(vm.company.address)) {
            var destination = [vm.company.address.numLatitude, vm.company.address.numLongitude];
            var start = [response.latitude, response.longitude];

            launchnavigator.navigate(destination, {
              'start': start,
              'appSelectionDialogHeader': 'Selecione o aplicativo para navegação.',
              'appSelectionCancelButton': 'Cancelar'
            });
          }
        }

        vm.hideLoading();
      });
    };

    function initialize() {
      $scope.$on('$ionicView.beforeEnter', function () {
        vm.isVisible = false;
        var company = $state.params.params.company;
        var idCategory = $state.params.params.idCategory;

        if(CompanyService.isObject(company)) {
          CompanyService.details(company.idCompany, idCategory).then(function(response) {
            if (angular.isString(response)) {
              vm.hideLoading();
              CompanyService.ionicPopupAlertError(response).then(function() {
                vm.goBack();
              });
            } else {
              paginatorDto = response.ratings.paginatorDto;
              vm.company = response.company;
              vm.address = getAddress(vm.company);
              vm.ratings = response.ratings.results;
              vm.characteristics = response.characteristics;
              vm.halfCharacteristics = vm.characteristics.splice(Math.ceil((vm.characteristics.length / 2)));
              vm.isInfiniteScroll = (angular.isDefined(paginatorDto) && paginatorDto.currentPage !== paginatorDto.pageTotal);
              vm.isVisible = true;
              vm.timeoutHideLoading();
            }
          });
        }
      });
    }

    function getAddress(company) {
      var address = '';

      if (angular.isObject(company.address)) {
        address += company.address.desStreet;
        address += (company.address.numStreet !== null) ? ', ' + company.address.numStreet : '';
        address += (company.address.desComplement !== null) ? ', ' + company.address.desComplement : '';
        address += (company.address.desNeighborhood !== null) ? ', ' + company.address.desNeighborhood : '';
        address += ' - ' + maskFilter(company.address.descCode, '00000-000');
        address += ' - ' + company.address.city.desCity + '/' + company.address.city.state.desSigla;
      }

      return address;
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
            element.css('max-height', (footer.offsetTop - (scrollRating.offsetTop + (scrollRating.offsetTop - menu.offsetTop))) - 15 + 'px');
          };

          scope.onResize();
        }
      };
    }
})();
