(function() {
  'use strict';

  angular.module('kidfriendly').run(Run);

  Run.$inject = ['$ionicPlatform', '$state', '$ionicHistory'];

  function Run($ionicPlatform, $state, $ionicHistory) {
    $ionicPlatform.ready(function() {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }

      if (window.StatusBar) {
        StatusBar.styleDefault();
      }

      $ionicPlatform.registerBackButtonAction(function(event) {
        if ($state.is('main.home')) {
          ionic.Platform.exitApp();
        } else {
          $ionicHistory.goBack(-1);
        }
      }, 100);
    });
  }
})();
