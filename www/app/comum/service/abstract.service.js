(function() {
  'use strict';

  angular.module('comum.service').service('AbstractService', AbstractService);
  AbstractService.$inject = ['Upload', '$http', '$cordovaGeolocation', '$ionicPopup', '$cookies'];

  function AbstractService(Upload, $http, $cordovaGeolocation, $ionicPopup, $cookies) {
    var AbstractService = function(uri) {
      //var _uri = 'http://localhost:8080/kf' + (angular.isUndefined(uri) ? '' : uri);
      //var _uri = 'http://10.0.2.2:8080/kf' + (angular.isUndefined(uri) ? '' : uri);
      //var _uri = 'http://10.0.3.2:8080/kf' + (angular.isUndefined(uri) ? '' : uri);
      //var _uri = 'http://192.168.0.14:8080/kf' + (angular.isUndefined(uri) ? '' : uri);
      var _uri = 'http://kidfriendly.servehttp.com:8080/kf' + (angular.isUndefined(uri) ? '' : uri);
      var method = {
        success: function(response) {
          var _response = {
            error: false,
            data: ((angular.isString(response.data) && response.data.trim().length === 0) ? null : response.data)
          };

          return _response;
        },

        error: function(response) {
          var _response = {
            error: true,
            message: ((angular.isUndefined(response.data) || response.data === null || angular.isUndefined(response.data.message) || response.data.message === null) ? "Serviço indisponível.<br/>Tente mais tarde." : response.data.message)
          };

          return _response;
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
          var _response = {
            error: false,
            data: {
              longitude: response.coords.longitude,
              latitude: response.coords.latitude
            }
          };

          return _response;
        },

        geolocationError: function() {
          var _response = {
            error: true,
            message: 'Não foi possível encontrar nenhuma localização.'
          };

          return _response;
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
          cssClass: (angular.isUndefined(cssClass) ? '' : cssClass)
        });
      };

      this.ionicPopupAlertError = function(message) {
        return this.ionicPopupAlert('Erro', message, 'kf-popup-error');
      };

      this.ionicPopupAlertAttention = function(message) {
        return this.ionicPopupAlert('Atenção', message, 'kf-popup-attention');
      };

      this.ionicPopupAlertSuccess = function(message) {
        return this.ionicPopupAlert('Sucesso', angular.isUndefined(message) ? 'Operação realizada com sucesso.' : message, 'kf-popup-success');
      };

      this.getCookies = function(key) {
        return $cookies.getObject(key);
      };

      this.putCookies = function(key, value, hours, minutes) {
        var expire = new Date();

        if (!angular.isUndefined(hours)) {
          expire.setHours(expire.getHours() + hours);
        }

        if (!angular.isUndefined(minutes)) {
          expire.setMinutes(expire.getMinutes() + minutes);
        }

        if (angular.isUndefined(hours) && angular.isUndefined(minutes)) {
          expire.setDate(expire.getDate() + 1);
        }

        $cookies.putObject(key, value, {expires: expire});
      };

      this.setLocalStorage = function(key, value) {
        localStorage.setItem(key, angular.toJson(value));
      };

      this.getLocalStorage = function(key) {
        return angular.fromJson(localStorage[key]);
      };

      this.removeLocalStorage = function(key) {
        localStorage.removeItem(key);
      };

      this.setSessionStorage = function(key, value) {
        sessionStorage.setItem(key, angular.toJson(value));
      };

      this.getSessionStorage = function(key) {
        return angular.fromJson(sessionStorage[key]);
      };
    };

    return AbstractService;
  }
})();
