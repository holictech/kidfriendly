(function() {
  'use strict';

  angular.module('kidfriendly').service('ImageService', ImageService);
  ImageService.$inject = ['AbstractService'];

  function ImageService(AbstractService) {
    AbstractService.call(this, '/image');

    this.listByCompany = function(idCompany) {
      return this.httpGet(this.getURI() + '/listbycompany/' + idCompany);
    };
  }
})();
