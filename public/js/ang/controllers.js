'use strict';

/* Controllers */
var fusionURL = "https://www.googleapis.com/fusiontables/v1/query/";
var googleKey = "AIzaSyBhwGfhVZK2JpmMVelyTojjHVSqbSyM1ls";

function AppCtrl($scope, $http) {
	$http({
		method : 'GET',
		url : '/api/name'
	}).success(function(data, status, headers, config) {
		$scope.name = data.name;
	}).error(function(data, status, headers, config) {
		$scope.name = 'Error!'
	});
}

function MyCtrl1() {
}

MyCtrl1.$inject = [];

function MyCtrl2() {
}

MyCtrl2.$inject = [];

function RouteCtrl($scope, $http, $resource) {

	//$scope.agency = '456';
	//	var testParam = "SELECT * from " + agency
	$scope.serviceType = "this is the type";

	$scope.getRoute = function() {
		$http({
			method : 'JSONP',
			url : fusionURL,
			params : {
				sql : "SELECT * from " + $scope.agency.gtfs.routes + " WHERE route_id =" + $scope.route,
				key : googleKey,
				callback : 'JSON_CALLBACK',
			}
		}).success(function(data) {
			$scope.routeResult =  data;
			console.log($scope.routeResult.rows)
		}).error(function(data) {
			return data;
		})
		return null;
	}

	$scope.init = function(agency, route) {
		//This function is sort of private constructor for controller
		$scope.agency = agency;
		$scope.route = route;
		console.log($scope.agency)

		$scope.getRoute()
		console.log($scope.routeResult)

		//Based on passed argument you can make a call to resource
		//and initialize more objects
		//$resource.getMeBond(007)
	};
	// $scope.route = $resource(fusionURL), {
	// callback : "?",
	// sql : "SELECT * from 1vAAlfeAvvUQumHs64tYW5uBOduboZ-eu4jrQGQk", //+ $scope.agency.gtfs.routes,
	// key : googleKey
	// }, {
	// get : {
	// method : 'JSONP',
	// params : 'test'
	// }
	// }

}
