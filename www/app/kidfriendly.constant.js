(function() {
  'use strict';

  angular.module('kidfriendly')
    .constant('$ionicLoadingConfig', {
      template: '<ion-spinner icon="ios"></ion-spinner><p>Processando...</p>'
    })
    .constant('ID_BRAZIL', 1)
    .constant('EVENT_USER_LOGGED', 'EVENT_USER_LOGGED');
})();
