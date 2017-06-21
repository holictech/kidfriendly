(function() {
  'use strict';

  angular.module('comum.directive').directive('disallowSpaces', function() {
    return {
      require: 'ngModel',
      restrict: 'A',
      link: function(scope, element, attributes, controller) {
        controller.$parsers.push(function(value) {
          if (value === null) {
            return '';
          }

          let newValue = value.replace(/\s/gi, '');

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