(function() {
  'use strict';

  angular.module('kidfriendly').controller('ResultController', ResultController);

  ResultController.$inject = ['SearchService', '$scope', '$state', '$controller'];

  function ResultController(SearchService, $scope, $state, $controller) {
    var vm = this;
    var filters = null;
    var paginatorDto = null;
    angular.extend(this, $controller('AbstractController', {'vm': vm}));
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

      vm.showLoading();
      SearchService.get(params).then(function(response) {
        if (angular.isString(response)) {
          SearchService.ionicPopupAlertError(response);
        } else {
          paginatorDto = response.paginatorDto;
          vm.results = vm.results.concat(response.results);
          vm.isInfiniteScroll = (angular.isDefined(paginatorDto) && paginatorDto.currentPage !== paginatorDto.pageTotal);
        }

        $scope.$broadcast('scroll.infiniteScrollComplete');
        vm.timeoutHideLoading();
      });
    };

    vm.detailsCompany = function(company) {
      vm.showLoading();
      $state.go('main.company', (angular.isUndefined(company) ? null : {'params': company}));
    };

    function initialize() {
      $scope.$on('$ionicView.enter', function() {
        filters = $state.params.params.filters;
        paginatorDto = $state.params.params.response.paginatorDto;
        vm.results = $state.params.params.response.results;
        vm.isInfiniteScroll = (angular.isDefined(paginatorDto) && paginatorDto.currentPage !== paginatorDto.pageTotal);
        vm.timeoutHideLoading();
      });
    }
  }
})();
