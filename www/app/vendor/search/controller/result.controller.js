(function() {
  'use strict';

  angular.module('kidfriendly').controller('ResultController', ResultController);
  ResultController.$inject = ['SearchService', '$controller', '$scope', '$stateParams', '$ionicScrollDelegate'];

  function ResultController(SearchService, $controller, $scope, $stateParams, $ionicScrollDelegate) {
    var vm = this;
    angular.extend(this, $controller('AbstractController', {'vm': vm}));
    var filters = null;
    var paginatorDto = null;
    var scrollPosition = {
      left: 0,
      top: 0
    };
    vm.results = [];
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
      scrollPosition = $ionicScrollDelegate.getScrollPosition();
      vm.go('main.search-result-company', {
        idCompany: companyDto.idCompany,
        desName: companyDto.desName,
        numRate: companyDto.numRate,
        desSite: companyDto.desSite
      }, true);
    };

    function initialize() {
      $scope.$on('$ionicView.beforeEnter', function() {
        var object = angular.fromJson($stateParams.object);
        filters = object.filters;
        paginatorDto = object.response.data.paginatorDto;

        if (vm.results.length === 0) {
          vm.results = object.response.data.results;
        }

        vm.isInfiniteScroll = (angular.isDefined(paginatorDto) && paginatorDto.pagination);
        $ionicScrollDelegate.scrollTo(scrollPosition.left, scrollPosition.top);
        vm.timeoutHideLoading();
      });
    }
  }
})();
