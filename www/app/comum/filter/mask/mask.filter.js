(function() {
	'use strict';

	angular.module('comum.filter').filter('cpMask', CPMask);

	function CPMask() {
		return function(input, format) {
			return new StringMask(format).apply(input);
		};
	}
})();
