(function() {
  'use strict';

  angular.module('kidfriendly').service('HomeService', HomeService);

  HomeService.$inject = ['AbstractService'];

  function HomeService(AbstractService) {
    AbstractService.call(this, '/home');
  }
})();
