(function() {
  'use strict';

  angular.module('kidfriendly').service('UserService', UserService);
  UserService.$inject = ['AbstractService'];

  function UserService(AbstractService) {
    AbstractService.call(this, '/user');
  }
})();
