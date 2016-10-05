(function() {
  'use strict';

  angular.module('kidfriendly').controller('ResultController', ResultController);

  ResultController.$inject = ['$state', '$ionicLoading'];

  function ResultController($state, $ionicLoading) {
    var vm = this;
    initialize();

    function initialize() {
      $ionicLoading.hide();
      console.log("Pagina de resultados");
    }
  }
})();
