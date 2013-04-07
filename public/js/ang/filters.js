'use strict';

/* Filters */

angular.module('myApp.filters', []).filter('interpolate', ['version',
function(version) {
	return function(text) {
		return String(text).replace(/\%VERSION\%/mg, version);
	}
}]).filter('startFrom', function() {
	return function(input, start) {
		start = +start;
		//parse to int
		if (input != undefined) {
			return input.slice(start);
		}
	}
})
// }).filter('serviceFilter', function() {
	// return function(input, service) {
		// console.log(service)
		// if (input != undefined) {
			// if (input[1] == service) {
				// return input;
			// }
		// }
	// }
// })
// .filter('serviceFilter', function() {
	// return function(input, service) {
		// console.log(service)
		// if (input != undefined) {
			// if (input[1] == service) {
				// return input;
			// }
		// }
	// }
// })
// 
