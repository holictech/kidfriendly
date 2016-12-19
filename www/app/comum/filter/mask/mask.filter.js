(function() {
	'use strict';

	angular.module('comum.filter').filter('mask', Mask);

	function Mask() {
		return function(input, format) {
			return new StringMask(format).apply(input);
		};
	}
})();
