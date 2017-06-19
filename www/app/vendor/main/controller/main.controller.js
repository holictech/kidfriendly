(function() {
  'use strict';

  angular.module('kidfriendly').controller('MainController', MainController);
  MainController.$inject = ['LoginService', '$controller'];

  function MainController(LoginService, $controller) {
    var vm = this;
    angular.extend(this, $controller('AbstractController', {'vm': vm}));
    
    vm.clickIconUser = function() {
      var state = 'main.user-login';

      if (LoginService.isLogged()) {
        state = 'main.user-perfil';
      }
      
      vm.go(state);
    };
  }
})();
