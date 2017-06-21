(function() {
  'use strict';

  angular.module('kidfriendly').service('UserService', UserService);
  UserService.$inject = ['AbstractService'];

  function UserService(AbstractService) {
    AbstractService.call(this, '/user');
    var KEY_USER = 'KEY_USER'

    this.includeLocalStorage = function(user) {
      this.setLocalStorage(KEY_USER, user);
    };

    this.getUserLogged = function() {
      return this.getLocalStorage(KEY_USER);
    }

    this.isLogged = function() {
      var user = this.getUserLogged();

      return (user !== null && !angular.isUndefined(user) && !angular.isString(user) && angular.isObject(user));
    };

    this.includeSocialNetwork = function(user) {
      return this.httpPost(this.getURI() + '/includeSocialNetwork', user);
    };

    this.getMinMaxDtBirthday = function() {
      return this.httpGet(this.getURI() + '/minmaxdtbirthday');
    };
  }
})();
