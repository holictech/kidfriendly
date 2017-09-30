(function() {
  'use strict';

  angular.module('kidfriendly').service('LocalityService', LocalityService);
  LocalityService.$inject = ['AbstractService', 'ID_BRAZIL', '$q', '$cordovaGeolocation'];

  function LocalityService(AbstractService, ID_BRAZIL, $q, $cordovaGeolocation) {
    AbstractService.call(this, '/locality');
    var coordinates = null;

    this.getGeolocation = function() {
      return $cordovaGeolocation.getCurrentPosition({timeout: 3000, enableHighAccuracy: true}).then(function(response) {
        return {
          error: false,
          data: {
            longitude: response.coords.longitude,
            latitude: response.coords.latitude
          }
        };
      }, function() {
        return {
          error: true,
          message: 'Não foi possível encontrar sua localização.'
        };
      });
    };

    this.watchPosition = function() {
      var watchPosition = $cordovaGeolocation.watchPosition({enableHighAccuracy: true}).then(null, function(response) {
        coordinates = null;
      }, function(response) {
        coordinates = {
          data: {
            longitude: response.coords.longitude,
            latitude: response.coords.latitude
          }
        };
      });

      return watchPosition;
    };

    this.clearWatch = function(watchPosition) {
      if (!angular.isUndefined(watchPosition)) {
        $cordovaGeolocation.clearWatch(watchPosition);
      }
    };

    this.getCoordinates = function() {
      return coordinates;
    };

    this.listStateWithCityByCountry = function(idCountry) {
      idCountry = idCountry || ID_BRAZIL;

      return execute(this, this.getURI() + '/liststatewithcitybycountry/' + idCountry, 'kf_states_country_' + idCountry);
    };

    this.listCityByState = function(idState) {
      return execute(this, this.getURI() + '/listcitybystate/' + idState, 'kf_cities_state_' + idState);
    };

    this.formattedAddress = function() {
      var vm = this;
      return this.getGeolocation().then(function(response) {
        if (!response.error) {
          return vm.formattedAddressByLongitudeLatitude(response.data);
        } else {
          return response;
        }
      });
    };

    this.formattedAddressByLongitudeLatitude = function(parameter) {
      return this.httpGet(this.getURI() + '/formattedaddress', parameter);
    };

    function execute(vm, uri, key) {
      var defer = $q.defer();
      var _response = vm.getSessionStorage(key);

      if (angular.isUndefined(_response)) {
        vm.httpGet(uri).then(function(response) {
          if (response.error) {
            defer.reject(response);
          } else {
            defer.resolve(response);
            vm.setSessionStorage(key, response);
          }
        });
      } else {
        defer.resolve(_response);
      }

      return defer.promise;
    }
  }
})();
