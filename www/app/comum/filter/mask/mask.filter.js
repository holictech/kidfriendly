(function() {
	'use strict';

	angular.module('comum.filter').filter('mask', CPMask);

	function CPMask() {
		return function(input, format) {
			return new StringMask(format).apply(input);
		};
	}
})();
