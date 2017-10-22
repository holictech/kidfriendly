(function() {
  'use strict';

  angular.module('kidfriendly').controller('ResultController', ResultController);
  ResultController.$inject = ['SearchService', '$controller', '$scope', '$ionicScrollDelegate', '$stateParams', '$filter'];

  function ResultController(SearchService, $controller, $scope, $ionicScrollDelegate, $stateParams, $filter) {
    var vm = this;
    angular.extend(this, $controller('AbstractController', {'vm': vm}));
    var filters = null;
    var paginatorDto = null;
    vm.results = [];
    vm.isFilterState = false;
    vm.isInfiniteScroll = false;
    initialize();

    vm.infiniteScroll = function() {
      filters.currentPage = paginatorDto.currentPage + 1;
      filters.pageSize = paginatorDto.pageSize;
      vm.showLoading();
      SearchService.get(filters).then(function(response) {
        if (response.error) {
          vm.hideLoading();
          SearchService.ionicPopupAlertError(response.message);
        } else {
          paginatorDto = response.data.paginatorDto;
          vm.results = vm.results.concat(response.data.results);
          vm.isInfiniteScroll = (angular.isDefined(paginatorDto) && paginatorDto.currentPage !== paginatorDto.pageTotal);
          vm.timeoutHideLoading();
        }
      }).finally(function() {
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    };

    vm.details = function(companyDto) {
      var formattedAddress = companyDto.addressDto.desStreet;
      formattedAddress += ', nº ' + companyDto.addressDto.numStreet;
      formattedAddress += companyDto.addressDto.desComplement === null ? '' : ', ' + companyDto.addressDto.desComplement;
      formattedAddress += ', ' + companyDto.addressDto.desNeighborhood;
      formattedAddress += ', ' + companyDto.addressDto.cityDto.desCity + '-' + companyDto.addressDto.cityDto.desState
      formattedAddress += ', ' + $filter('mask')(companyDto.addressDto.descCode, '00000-000') + '.';
      vm.go('main.search-result-company', {
        idCompany: companyDto.idCompany,
        desName: companyDto.desName,
        imgLogo: companyDto.imgLogo,
        numRate: companyDto.numRate,
        desSite: companyDto.desSite,
        addressDto: {
          formattedAddress: formattedAddress,
          numLatitude: companyDto.addressDto.numLatitude,
          numLongitude: companyDto.addressDto.numLongitude
        }
      }, false);
    };

    function initialize() {
      $ionicScrollDelegate.scrollTop();
      $scope.$on('$ionicView.beforeEnter', function() {
        var object = angular.fromJson($stateParams.object);
        filters = object.filters;
        paginatorDto = object.response.data.paginatorDto;
        vm.results = object.response.data.results;
        vm.isFilterState = !angular.isDefined(filters.idState) || filters.idState === null;
        vm.isInfiniteScroll = (angular.isDefined(paginatorDto) && paginatorDto.pagination);
        vm.timeoutHideLoading();
      });
    }
  }
})();
