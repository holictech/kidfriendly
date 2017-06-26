(function() {
  'use strict';

  angular.module('kidfriendly').controller('MainController', MainController);
  MainController.$inject = ['UserService', '$controller'];

  function MainController(UserService, $controller) {
    var vm = this;
    angular.extend(this, $controller('AbstractController', {'vm': vm}));
    
    vm.clickIconUser = function() {
      var state = 'main.user-login';
      var loading = false;

      if (UserService.isLogged()) {
        state = 'main.user-perfil';
        loading = true;
      }
      
      vm.go(state, null, loading);
    };
  }
})();
