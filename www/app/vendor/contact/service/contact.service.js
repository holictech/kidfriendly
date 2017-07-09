(function() {
  'use strict';

  angular.module('kidfriendly').service('ContactService', ContactService);
  ContactService.$inject = ['AbstractService'];

  function ContactService(AbstractService) {
    AbstractService.call(this, '/contact');

    this.contactUs = function(parameter) {
      return this.httpPost(this.getURI() + '/contact-us', parameter);
    };

    this.indicate = function(parameter) {
      return this.httpPost(this.getURI() + '/indicate', parameter);
    };
  }
})();