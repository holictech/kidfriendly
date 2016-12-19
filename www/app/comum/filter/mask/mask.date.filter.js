(function() {
	'use strict';

	angular.module('comum.filter').filter('maskDate', MaskDate);

	function MaskDate() {
		return function(input, format) {
			return moment(input).format(format);
		};
	}
})();
