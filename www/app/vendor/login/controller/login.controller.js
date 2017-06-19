(function() {
  'use strict';

  angular.module('kidfriendly').controller('LoginController', LoginController);
  LoginController.$inject = ['LoginService', '$controller'];

  function LoginController(LoginService, $controller) {
    var vm = this;
    angular.extend(this, $controller('AbstractController', {'vm': vm}));
  }
})();