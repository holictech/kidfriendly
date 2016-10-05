(function() {
  'use strict';

  angular.module('kidfriendly').controller('CompanyController', CompanyController);

  CompanyController.$inject = ['CompanyService', '$state'];

  function CompanyController(CompanyService, $state) {
    var vm = this;

    console.log($state);
  }
})();
