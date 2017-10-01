(function() {
  'use strict';

  angular.module('kidfriendly').controller('ResultController', ResultController);
  ResultController.$inject = ['SearchService', '$controller', '$scope', '$ionicScrollDelegate', '$stateParams'];

  function ResultController(SearchService, $controller, $scope, $ionicScrollDelegate, $stateParams) {
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

    vm.details = function(primarykey) {
      vm.go('main.result-company', {'primarykey': primarykey}, true);
    };

    function initialize() {
      $scope.$on('$ionicView.beforeEnter', function() {
        $ionicScrollDelegate.scrollTop();
        var object = angular.fromJson($stateParams.object);
        filters = object.filters;
        paginatorDto = object.response.data.paginatorDto;
        vm.results = object.response.data.results;
        vm.isFilterState = !angular.isDefined(filters.idState) || filters.idState === null;
        vm.isInfiniteScroll = (angular.isDefined(paginatorDto) && paginatorDto.currentPage !== paginatorDto.pageTotal);
        vm.timeoutHideLoading();
      });
    }
  }
})();
