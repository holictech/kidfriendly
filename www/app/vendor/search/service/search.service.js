(function() {
  'use strict';

  angular.module('kidfriendly').service('SearchService', SearchService);

  SearchService.$intect = ['AbstractService'];

  function SearchService(AbstractService) {
    AbstractService.call(this, '/search');
  }
})();
