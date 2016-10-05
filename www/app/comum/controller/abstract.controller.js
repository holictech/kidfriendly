(function() {
  'use strict';

  angular.module('comum.controller').controller('AbstractController', AbstractController);

  AbstractController.$inject = ['AbstractService'];

  function AbstractController(AbstractService) {
  }
})();
