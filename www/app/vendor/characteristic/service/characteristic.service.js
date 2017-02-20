(function() {
  'use strict';

  angular.module('kidfriendly').service('CharacteristicService', CharacteristicService);
  CharacteristicService.$inject = ['AbstractService', '$q'];

  function CharacteristicService(AbstractService, $q) {
    AbstractService.call(this, '/characteristic');

    this.listByCategory = function(idCategory) {
      var defer = $q.defer();
      var key =  'kf_category_' + idCategory;
      var _response = this.getSessionStorage(key);

      if (angular.isUndefined(_response)) {
        this.httpGet(this.getURI() + '/listbycategory/' + idCategory).then(function(response) {
          if (response.error) {
            defer.reject(response);
          } else {
            defer.resolve(response);
            new AbstractService().setSessionStorage(key, response);
          }
        });
      } else {
        defer.resolve(_response);
      }

      return defer.promise;
    };
  }
})();
