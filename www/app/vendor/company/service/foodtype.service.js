(function() {
  'use strict';

  angular.module('kidfriendly').service('FoodTypeService', FoodTypeService);
  FoodTypeService.$inject = ['AbstractService'];

  function FoodTypeService(AbstractService) {
    AbstractService.call(this, '/foodtype');

    this.listByCompany = function(idCompany) {
      return this.httpGet(this.getURI() + '/listbycompany/' + idCompany);
    };
  }
})();
