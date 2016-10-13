(function() {
  'use strict';

  angular.module('kidfriendly').controller('ResultController', ResultController);

  ResultController.$inject = ['$scope', '$state', '$ionicLoading'];

  function ResultController($scope, $state, $ionicLoading) {
    var vm = this;
    var filters = null;
    var paginatorDto = null;
    vm.results = [];
    initialize();

    function initialize() {
      $scope.$on('$ionicView.beforeEnter', function() {
        $ionicLoading.hide();
        filters = $state.params.params.filters;
        paginatorDto = $state.params.params.response.paginatorDto;
        vm.results = $state.params.params.response.results;
      });
    }
  }
})();
