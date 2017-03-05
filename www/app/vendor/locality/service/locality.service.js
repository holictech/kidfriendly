(function() {
  'use strict';

  angular.module('kidfriendly').service('LocalityService', LocalityService);
  LocalityService.$inject = ['AbstractService', '$q', 'ID_BRAZIL'];

  function LocalityService(AbstractService, $q, ID_BRAZIL) {
    AbstractService.call(this, '/locality');

    this.listStateWithCityByCountry = function(idCountry) {
      idCountry = idCountry || ID_BRAZIL;

      return execute(this, this.getURI() + '/liststatewithcitybycountry/' + idCountry, 'kf_states_country_' + idCountry);
    };

    this.listCityByState = function(idState) {
      return execute(this, this.getURI() + '/listcitybystate/' + idState, 'kf_cities_state_' + idState);
    };

    function execute(_this, uri, key) {
      var defer = $q.defer();
      var _response = _this.getSessionStorage(key);

      if (angular.isUndefined(_response)) {
        _this.httpGet(uri).then(function(response) {
          if (response.error) {
            defer.reject(response);
          } else {
            defer.resolve(response);
            _this.setSessionStorage(key, response);
          }
        });
      } else {
        defer.resolve(_response);
      }

      return defer.promise;
    }
  }
})();
