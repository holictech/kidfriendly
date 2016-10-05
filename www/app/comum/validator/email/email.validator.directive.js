(function() {
  'use strict';

  angular.module('comum.validator').directive('cpEmailValidator', CPEmailValidator);

  function CPEmailValidator() {
    var method = {
      isEmail: function(email) {
        var expression = /^[a-zA-Z0-9][a-zA-Z0-9\._-]+@([a-zA-Z0-9\._-]+\.)[a-zA-Z-0-9]{2,3}/g;

        return expression.test(email);
      }
    };

    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attributes, ngModel) {
        ngModel.$validators.email = function(modelValue) {
          if (modelValue) {
            return method.isEmail(modelValue);
          }

          return true;
        };
      }
    };
  }
})();
