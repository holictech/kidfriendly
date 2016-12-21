(function() {
  'use strict';

  angular.module('kidfriendly').service('CompanyService', CompanyService);

  CompanyService.$inject = ['AbstractService'];

  function CompanyService(AbstractService) {
    AbstractService.call(this, '/company');

    this.details = function(primaryKey, idCategory) {
      return this.httpGet(this.getURI() + '/details/' + primaryKey, ((!this.isUndefined(idCategory)) ? {'idCategory': idCategory} : undefined));
    };
  }
})();
