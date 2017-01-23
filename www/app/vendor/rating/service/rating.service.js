(function() {
  'use strict';

  angular.module('kidfriendly').service('RatingService', RatingService);
  RatingService.$inject = ['AbstractService'];

  function RatingService(AbstractService) {
    AbstractService.call(this, '/rating');

    this.listByCompany = function(idCompany, params) {
      return this.httpGet(this.getURI() + '/listbycompany/' + idCompany, params);
    };
  }
})();
