(function() {
  'use strict';

  angular.module('kidfriendly').service('HomeService', HomeService);
  HomeService.$inject = ['AbstractService'];

  function HomeService(AbstractService) {
    AbstractService.call(this, '/home');

    this.listSuggestions = function() {
      return this.httpGet(this.getURI() + '/suggestions');
    }

    this.listNextToMe = function(parameter) {
      return this.httpGet(this.getURI() + '/nexttome', parameter);
    }
  }
})();
