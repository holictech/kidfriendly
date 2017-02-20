(function() {
  'use strict';

  angular.module('kidfriendly').service('CategoryService', CategoryService);
  CategoryService.inject = ['AbstractService', '$q'];

  function CategoryService(AbstractService, $q) {
    AbstractService.call(this, '/category');

    this.listAll = function() {
      var defer = $q.defer();
      var key = 'kf_categories';
      var _response = this.getSessionStorage(key);

      if (angular.isUndefined(_response)) {
        this.get().then(function(response) {
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
