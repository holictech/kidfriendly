(function() {
  'use strict';

  angular.module('comum.directive').directive('disallowSpaces', function() {
    var expression = /\s/g;

    return {
      require: 'ngModel',
      restrict: 'A',
      link: function(scope, element, attributes, controller) {
        controller.$parsers.push(function(value) {
          if (value === null) {
            return '';
          }

          var newValue = value.replace(expression, '');

          if (value != newValue) {
            controller.$setViewValue(newValue);
            controller.$render();
          }

          return newValue;
        });
      }
    };
  });
})();