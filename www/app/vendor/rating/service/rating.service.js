(function() {
  'use strict';

  angular.module('kidfriendly').service('RatingService', RatingService);
  RatingService.$inject = ['AbstractService', '$http'];

  function RatingService(AbstractService, $http) {
    AbstractService.call(this, '/rating');

    this.listByCompany = function(idCompany, params) {
      return this.httpGet(this.getURI() + '/listbycompany/' + idCompany, params);
    };

    this.haspermission = function(idCompany, idUser) {
      return this.httpGet(this.getURI() + '/haspermission/' + idCompany + '/' + idUser);
    };
  }
})();
