(function() {
  'use strict';

  angular.module('kidfriendly')
    .constant('$ionicLoadingConfig', {
      template: '<ion-spinner icon="ios"></ion-spinner><p>Processando...</p>'
    });
})();
