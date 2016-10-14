(function() {
  'use strict';

  angular.module('kidfriendly').controller('ResultController', ResultController);

  ResultController.$inject = ['$scope', '$state', '$ionicLoading', 'SearchService'];

  function ResultController($scope, $state, $ionicLoading, SearchService) {
    var vm = this;
    var filters = null;
    var paginatorDto = null;
    vm.results = [];
    vm.isInfiniteScroll = false;
    initialize();

    vm.infiniteScroll = function() {
      var params = {
        'idCharacteristic': filters.idCharacteristic,
        'idCategory': filters.idCategory,
        'isSuperKidFriendly': filters.isSuperKidFriendly,
        'longitude': (angular.isDefined(filters.longitude) ? filters.longitude : null),
        'latitude': (angular.isDefined(filters.latitude) ? filters.latitude : null),
        'currentPage': paginatorDto.currentPage + 1,
        'pageSize': paginatorDto.pageSize
      };

      $ionicLoading.show();
      SearchService.get(params).then(function(response) {
        if (angular.isString(response)) {
          SearchService.ionicPopupAlertError(response);
        } else {
          paginatorDto = response.paginatorDto;
          vm.results = vm.results.concat(response.results);
          vm.isInfiniteScroll = (angular.isDefined(paginatorDto) && paginatorDto.currentPage !== paginatorDto.pageTotal);
        }

        $scope.$broadcast('scroll.infiniteScrollComplete');
        $ionicLoading.hide();
      });
    };

    function initialize() {
      $scope.$on('$ionicView.enter', function() {
        filters = $state.params.params.filters;
        paginatorDto = $state.params.params.response.paginatorDto;
        vm.results = $state.params.params.response.results;
        vm.isInfiniteScroll = (angular.isDefined(paginatorDto) && paginatorDto.currentPage !== paginatorDto.pageTotal);
        $ionicLoading.hide();
      });
    }
  }
})();
