(function() {
  'use strict';

  angular.module('kidfriendly').service('CharacteristicService', CharacteristicService);
  CharacteristicService.$inject = ['AbstractService', '$q'];

  function CharacteristicService(AbstractService, $q) {
    AbstractService.call(this, '/characteristic');

    this.listByCategory = function(idCategory) {
      return list(this, '/listbycategory/' + idCategory, 'kf_category_' + idCategory);
    };

    this.listByCompany = function(idCompany) {
      return this.httpGet(this.getURI() + '/listbycompany/' + idCompany);
    };

    this.listAll = function() {
      return list(this, '/listall', 'kf_category_all');
    };

    function list(vm, uri, keySessionStorage) {
      var defer = $q.defer();
      var responseSessionStorage = vm.getSessionStorage(keySessionStorage);

      if (angular.isUndefined(responseSessionStorage)) {
        vm.httpGet(vm.getURI() + uri).then(function(response) {
          if (response.error) {
            defer.reject(response);
          } else {
            defer.resolve(response);
            vm.setSessionStorage(keySessionStorage, response);
          }
        });
      } else {
        defer.resolve(responseSessionStorage);
      }

      return defer.promise;
    }
  }
})();
