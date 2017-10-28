(function() {
  'use strict';

  angular.module('kidfriendly').controller('MainController', MainController);
  MainController.$inject = ['$controller', '$state', '$ionicHistory'];

  function MainController($controller, $state, $ionicHistory) {
    var vm = this;
    angular.extend(this, $controller('AbstractController', {'vm': vm}));

    vm.clickIconHome = function() {
      if (!($state.is('main.home') || $state.is('main.home-company'))) {
        console.log($state.current.name);
        $ionicHistory.clearCache().then(function() { 
          $state.go('main.home') 
        });
      } else {
        vm.go('main.home');
      }
    }
    
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
