(function() {
  'use strict';

  angular.module('kidfriendly').service('LoginService', LoginService);
  LoginService.$inject = ['AbstractService'];

  function LoginService(AbstractService) {
    AbstractService.call(this, '/login');

    this.authenticateUser = function(token, email) {
      return this.httpGet(this.getURI() + '/authenticateuser/' + token + '/' + email);
    };

    this.authenticateUserSocialNetwork = function(idSocialNetwork) {
      return this.httpGet(this.getURI() + '/authenticateusersocialnetwork/' + idSocialNetwork);
    };
  }
})();
