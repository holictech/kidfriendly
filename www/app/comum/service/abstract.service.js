(function() {
  'use strict';

  angular.module('comum.service').service('AbstractService', AbstractService);

  AbstractService.$inject = ['Upload', '$http', '$cordovaGeolocation', '$ionicPopup', '$cookies'];

  function AbstractService(Upload, $http, $cordovaGeolocation, $ionicPopup, $cookies) {
    var AbstractService = function(uri) {
      //var _uri = 'http://10.0.2.2:8080/kf' + (angular.isUndefined(uri) ? '' : uri);
      //var _uri = 'http://10.0.3.2:8080/kf' + (angular.isUndefined(uri) ? '' : uri);
      var _uri = 'http://192.168.0.13:8080/kf' + (angular.isUndefined(uri) ? '' : uri);
      var method = {
        success: function(response) {
          return response.data;
        },

        error: function(response) {
          return ((angular.isUndefined(response.data) || response.data === null || response.status === 0) ? 'Serviço indisponível.' : response.data.message);
        },

        upload: function (uri, method, formData) {
          return Upload.http({
              url: uri,
              method: method,
              headers: {'Content-Type': undefined},
              data: formData
            });
        },

        geolocationSuccess: function(response) {
          return {
            longitude: response.coords.longitude,
            latitude: response.coords.latitude
          };
        },

        geolocationError: function() {
          return "Localização não disponível.";
        },

        isObject: function(object) {
          return !method.isUndefined(object) && angular.isObject(object);
        },

        isUndefined: function(object) {
          return angular.isUndefined(object);
        }
      };

      this.getURI = function() {
        return _uri;
      };

      this.get = function(params) {
        return this.httpGet(this.getURI(), params);
      };

      this.httpGet = function(uri, params) {
        return $http.get(uri, {
          method: 'GET',
          params: ((!angular.isUndefined(params) && angular.isObject(params)) ? params : {})
        }).then(method.success, method.error);
      };

      this.include = function(data) {
        return this.httpPost(this.getURI(), data);
      };

      this.httpPost = function(uri, data, params) {
        return $http.post(uri, data, {
          method: 'POST',
          params: ((!angular.isUndefined(params) && angular.isObject(params)) ? params : {})
        }).then(method.success, method.error);
      };

      this.httpUploadPost = function(uri, formData) {
        return method.upload(uri, 'POST', formData).then(method.success, method.error);
      };

      this.update = function(data) {
        return this.httpPut(this.getURI(), data);
      };

      this.httpPut = function(uri, data, params) {
        return $http.put(uri, data, {
          method: 'PUT',
          params: ((!angular.isUndefined(params) && angular.isObject(params)) ? params : {})
        }).then(method.success, method.error);
      };

      this.httpUploadPut = function(uri, formData) {
        return method.upload(uri, 'PUT', formData).then(method.success, method.error);
      };

      this.delete = function(key) {
        return this.httpDelete(this.getURI() + "/" + key);
      };

      this.httpDelete = function(uri, params) {
        return $http.delete(uri + uri, {
          method: 'DELETE',
          params: ((!angular.isUndefined(params) && angular.isObject(params)) ? params : {})
        }).then(method.success, method.error);
      };

      this.getGeolocation = function() {
        return $cordovaGeolocation.getCurrentPosition({timeout: 5000, enableHighAccuracy: true})
          .then(method.geolocationSuccess, method.geolocationError);
      };

      this.ionicPopupAlert = function(title, message, cssClass) {
        return $ionicPopup.alert({
          title: title,
          template: message,
          cssClass: (method.isUndefined(cssClass) ? '' : cssClass)
        });
      };

      this.ionicPopupAlertError = function(message) {
        return this.ionicPopupAlert('Erro', message, 'kf-popup-error');
      };

      this.ionicPopupAlertAttention = function(message) {
        return this.ionicPopupAlert('Atenção', message, 'kf-popup-attention');
      };

      this.isObject = function(object) {
        return method.isObject(object);
      };

      this.isUndefined = function(object) {
        return method.isUndefined(object);
      };

      this.getCookies = function(key) {
        return $cookies.getObject(key);
      };

      this.putCookies = function(key, value, days) {
        var expire = new Date();
        expire.setDate(expire.getDate() + ((this.isUndefined(days)) ? 1 : days));
        $cookies.putObject(key, value, {expires: expire});
      };
    };

    return AbstractService;
  }
})();
