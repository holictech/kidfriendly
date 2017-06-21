(function() {
  'use strict';

  angular.module('comum.validator').directive('emailValidator', EmailValidator);

  function EmailValidator() {
    var method = {
      isEmail: function(value) {
        var expression = /^[a-zA-Z0-9][a-zA-Z0-9\._-]+@([a-zA-Z0-9\._-]+\.)[a-zA-Z-0-9]{2,3}/g;

        return expression.test(value);
      }
    };

    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attributes, ngModel) {
        ngModel.$validators.email = function(value) {
          if (value) {
            return method.isEmail(value);
          }

          return true;
        };
      }
    };
  }
})();
