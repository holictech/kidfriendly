(function() {
  'use strict';

  angular.module('kidfriendly').service('CharacteristicService', CharacteristicService);
  CharacteristicService.$inject = ['AbstractService', '$q'];

  function CharacteristicService(AbstractService, $q) {
    AbstractService.call(this, '/characteristic');

    this.listByCategory = function(idCategory) {
      var q = $q.defer();
      var prefixCookie = "category_";
      var characteristics = this.getCookies(prefixCookie + idCategory);
      var abstractService = new AbstractService();

      if (angular.isUndefined(characteristics) || characteristics === null) {
        this.httpGet(this.getURI() + '/listbycategory/' + idCategory).then(function(response) {
          if (response.error) {
            q.reject(response);
          } else {
            q.resolve(response.data);
            abstractService.putCookies(prefixCookie + idCategory, response.data);
          }
        });
      } else if (angular.isObject(characteristics)) {
        q.resolve(characteristics);
      } else {
        q.resolve([]);
      }

      return q.promise;
    };
  }
})();
