(function() {
  'use strict';

  angular.module('kidfriendly').run(Run);
  Run.$inject = ['$ionicPlatform', '$state', '$ionicHistory', 'ngFB'];

  function Run($ionicPlatform, $state, $ionicHistory, ngFB) {
    $ionicPlatform.ready(function() {
      ngFB.init({appId: '256684451437869', version:'v2.8'});

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

      if (navigator && navigator.app) {
        navigator.app.overrideButton("menubutton", true);
      }
    });
  }
})();
