(function() {
  'use strict';

  angular.module('kidfriendly').service('LoginService', LoginService);
  LoginService.$inject = ['AbstractService'];

  function LoginService(AbstractService) {
    AbstractService.call(this, '/login');

    this.isLogged = function() {
      return false;
    };

    this.authenticateUser = function() {
    };

    this.authenticateUserSocialNetwork = function() {
    };
  }
})();
