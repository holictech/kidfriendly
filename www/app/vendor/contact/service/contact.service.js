(function() {
  'use strict';

  angular.module('kidfriendly').service('ContactService', ContactService);
  ContactService.$inject = ['AbstractService'];

  function ContactService(AbstractService) {
    AbstractService.call(this, '/contact');

    this.send = function(data) {
      return this.httpPost(this.getURI() + '/send', data);
    };

    this.contactUs = function(data) {
      return this.httpPost(this.getURI() + '/contact-us', data);
    };
  }
})();