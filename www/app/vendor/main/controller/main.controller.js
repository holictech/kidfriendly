(function() {
  'use strict';

  angular.module('kidfriendly').controller('MainController', MainController);
  MainController.$inject = ['$controller'];

  function MainController($controller) {
    var vm = this;
    angular.extend(this, $controller('AbstractController', {'vm': vm}));
    
    vm.clickIconUser = function() {
      var state = 'main.user-login';
      var loading = false;

      if (vm.isLogged()) {
        state = 'main.user-perfil';
        loading = true;
      }
      
      vm.go(state, null, loading);
    };
  }
})();
