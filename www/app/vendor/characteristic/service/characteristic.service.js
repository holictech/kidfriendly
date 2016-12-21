(function() {
  'use strict';

  angular.module('kidfriendly').service('CharacteristicService', CharacteristicService);

  CharacteristicService.$inject = ['AbstractService', '$q'];

  function CharacteristicService(AbstractService, $q) {
    AbstractService.call(this, '/characteristic');

    this.listByCategory = function(category) {
      var q = $q.defer();
      var prefixCookie = "category_";
      var characteristics = this.getCookies(prefixCookie + category.idCategory);
      var abstractService = new AbstractService();

      if (this.isUndefined(characteristics) || characteristics === null) {
        this.httpGet(this.getURI() + '/listbycategory/' + category.idCategory).then(function(response) {
          if (angular.isString(response)) {
            q.reject(response);
          } else {
            q.resolve(response);
            abstractService.putCookies(prefixCookie + category.idCategory, response);
          }
        });
      } else if (this.isObject(characteristics)) {
        q.resolve(characteristics);
      } else {
        q.resolve([]);
      }

      return q.promise;
    };
  }
})();
