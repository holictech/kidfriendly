(function() {
  'use strict';

  angular.module('kidfriendly').controller('MainController', MainController);

  MainController.$inject = ['$rootScope', '$scope', '$state', '$ionicPopover', '$controller', '$ionicPlatform'];

  function MainController($rootScope, $scope, $state, $ionicPopover, $controller, $ionicPlatform) {
    var vm = this;
    var state;
    angular.extend(this, $controller('AbstractController', {'vm': vm}));
    initialize();

    vm.isShowBackButtonIOS = function() {
      return ionic.Platform.isIOS() && !angular.isUndefined(state) && !$state.is('main.home');
    };

    vm.showMenu = function(event) {
      $ionicPopover.fromTemplateUrl('app/view/main/menu.html', {
        scope: $scope
      }).then(function(popover) {
        var stopListening = $scope.$on('popover.hidden', function() {
          stopListening();
          popover.remove();
        });

        document.body.classList.remove('platform-ios');
        document.body.classList.add('platform-android');
        vm.popover = popover;
        vm.popover.show(event);
      });
    };

    vm.go = function(state, loading, params) {
      if (!angular.isUndefined(loading) && loading && !$state.is(state)) {
        vm.showLoading();
      }

      $state.go(state, (angular.isUndefined(params) ? null : {'params': params}));
      vm.popover.hide();
    };

    function initialize() {
      $rootScope.$on('$stateChangeStart',  function(event, toState, toParams, fromState, fromParams) {
        state = toState.name;
      });

      $ionicPlatform.on('menubutton', function(event) {
        angular.element(document.querySelector('#menuPopover')).triggerHandler('click');
      });
    }
  }
})();
