(function() {
  'use strict';

  angular.module('kidfriendly').service('UserService', UserService);
  UserService.$inject = ['AbstractService'];

  function UserService(AbstractService) {
    AbstractService.call(this, '/user');
    var KEY_USER = 'KEY_USER';

    this.getUserLogged = function() {
      return this.getLocalStorage(KEY_USER);
    };

    this.isLogged = function() {
      return isLoggedInternal(this.getUserLogged());
    };

    this.isLoggedSocialNetwork = function() {
      var user = this.getUserLogged();
      
      return (isLoggedInternal(user) && user.idSocialNetwork !== null);
    };

    this.logout = function() {
      this.removeLocalStorage(KEY_USER);
    };

    this.includeLocalStorage = function(user) {
      this.setLocalStorage(KEY_USER, user);
    };

    this.includeSocialNetwork = function(user) {
      return this.httpPost(this.getURI() + '/includesocialnetwork', user);
    };

    this.getMinMaxDtBirthday = function() {
      return this.httpGet(this.getURI() + '/minmaxdtbirthday');
    };

    this.getGenders = function() {
      return [
        {
          value: 'FEMALE',
          label: 'Feminimo'
        }, {
          value: 'MALE',
          label: 'Masculino'
        }
      ];
    };
    
    function isLoggedInternal(user) {
      return (user !== null && !angular.isUndefined(user) && !angular.isString(user) && angular.isObject(user));
    }
  }
})();
