(function() {
	'use strict';

	angular.module('comum.filter').filter('cpMaskDate', CPMaskDate);

	function CPMaskDate() {
		return function(input, format) {
			return moment(input).format(format);
		};
	}
})();
