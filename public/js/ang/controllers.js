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
	//$scope.serviceSelect = '40205'
	$scope.currentPage = 0;
	$scope.pageSize = 8;

	$scope.getService = function(input) {
		if (input != undefined) {
			console.log(input)
			$.each(input, function(i, value) {
				if (value[1] == $scope.serviceSelect) {
					return value
				}
			})
		}
	}

	$scope.numberOfPages = function() {
		if ($scope.routeStopResult == undefined) {
			return ""
		} else {
			return Math.ceil($scope.routeStopResult.length / $scope.pageSize);
		}
	}
	//$scope.agency = '456';
	//	var testParam = "SELECT * from " + agency
	$scope.serviceType = "this is the type";

	$scope.getRoute = function() {
		console.log($scope.route)
		$http({
			method : 'JSONP',
			url : fusionURL,
			params : {
				sql : "SELECT * from " + $scope.agency.gtfs.routes + " WHERE route_id ='" + $scope.route + "'",
				key : googleKey,
				callback : 'JSON_CALLBACK',
			}
		}).success(function(data) {
			$scope.routeResult = data;
			console.log(data)
			//		console.log($scope.routeResult.rows)
		}).error(function(data) {
			return data;
		})
		return null;
	}
	$scope.getStopRoute = function() {
		//console.log($scope.agency.output)
		$http({
			method : 'JSONP',
			url : fusionURL,
			params : {
				sql : "SELECT stop_name, stop_id from " + $scope.agency.output.stop_route + " WHERE route_id ='" + $scope.route + "'",
				key : googleKey,
				callback : 'JSON_CALLBACK'
			}
		}).success(function(data) {
			$scope.routeStopResult = data['rows'];
		})
	}
	$scope.getRouteStats = function() {
		//console.log($scope.agency.output)
		$http({
			method : 'JSONP',
			url : fusionURL,
			params : {
				sql : "SELECT * from " + $scope.agency.output.route + " WHERE route_id ='" + $scope.route + "' AND direction_id = 1",
				key : googleKey,
				callback : 'JSON_CALLBACK'
			}
		}).success(function(data) {
			//console.log(data)
			$scope.routeStats = data;
		})
	}

	$scope.getRouteTrips = function() {
		console.log($scope.agency.output)
		$http({
			method : 'JSONP',
			url : fusionURL,
			params : {
				sql : "SELECT * from " + $scope.agency.output.active_trips + " WHERE route_id ='" + $scope.route + "'",
				key : googleKey,
				callback : 'JSON_CALLBACK'
			}
		}).success(function(data) {
			//console.log(data)
			_.each(data['rows'], function(value, i) {
				//console.log(value[1])
				//console.log($scope.routeTrips)
				if (_.where($scope.routeTrips, {
					"service_id" : value[1]
				}).length == 0) {
					$scope.routeTrips.push({
						"service_id" : value[1],
						"trips" : [[parseInt(value[2]), parseInt(value[3])]]
						// "trips" : [{
						// "time" : value[2],
						// "sum" : value[3]
						// }]
					})
				} else {
					_.where($scope.routeTrips, {
						"service_id" : value[1]
					}, function(val) {
						return val
					}).trips.push([parseInt(value[2]), parseInt(value[3])]//{
					// "time" : value[2],
					// "sum" : value[3]
					//})
					)
				}
			})
			$scope.activeTrip = _.sortBy($scope.routeTrips[0]['trips'], function(val) {
				return val[0]
			})
			console.log($scope.testtrip)
			console.log($scope.routeTrips)
			//$scope.routeTrips = data['rows'];
			//$scope.drawChart($scope.routeTrips)
		})
	}
	$scope.routeTrips = [];

	$scope.updateChart = function() {
		console.log($scope.serviceSelect)
		$scope.activeTrip = _.sortBy(_.findWhere($scope.routeTrips, {"service_id" : $scope.serviceSelect[1]})['trips'], function(val) {
			return val[0]
		})
	}

	$scope.init = function(agency, route) {
		//This function is sort of private constructor for controller
		$scope.agency = agency;
		$scope.route = route;
		console.log($scope.route)
		//console.log($scope.agency)

		$scope.getRoute()
		$scope.getStopRoute()
		$scope.getRouteStats()
		$scope.getRouteTrips()

	};
}

function StopCtrl($scope, $http, $resource) {
	//	$scope.serviceSelect = "xxxxx"
	$scope.updateRoutes = function() {
		$scope.routeStopResults = []
		_.each($scope.routeStopResultsAll, function(val) {
			//console.log(val)
			//console.log($scope.serviceSelect)
			if (val[4] == $scope.serviceSelect[3]) {
				$scope.routeStopResults.push(val)
			}
		})
		console.log($scope.routeStopResults)
		//$scope.routeStopResults =
	}
	$scope.updateRouteInfo = function(){
		$scope.getRouteStats()
	}

	$scope.getStopRoute = function() {
		console.log($scope.agency.output)
		$http({
			method : 'JSONP',
			url : fusionURL,
			params : {
				sql : "SELECT * from " + $scope.agency.output.stop_route + " WHERE stop_id =" + $scope.stop,
				key : googleKey,
				callback : 'JSON_CALLBACK'
			}
		}).success(function(data) {
			//console.log(data)
			$scope.routeStopResultsAll = data['rows'];
		})
	}
	
	$scope.getRouteStats = function() {
		console.log($scope.serviceSelect)
		$http({
			method : 'JSONP',
			url : fusionURL,
			params : {
				sql : "SELECT * from " + $scope.agency.output.route + " WHERE route_id ='" + $scope.routeSelect[3] + "' AND direction_id = 1 AND service_id = " + $scope.serviceSelect[3],
				key : googleKey,
				callback : 'JSON_CALLBACK'
			}
		}).success(function(data) {
			console.log(data)
			$scope.routeStats = data['rows'];
		})
	}
	
	$scope.getStop = function() {
		console.log($scope.stop)
		$http({
			method : 'JSONP',
			url : fusionURL,
			params : {
				sql : "SELECT * from " + $scope.agency.output.stop + " WHERE direction_id = 0 AND stop_id ='" + $scope.stop + "'",
				key : googleKey,
				callback : 'JSON_CALLBACK'
			}
		}).success(function(data) {
				console.log(data)
			$scope.stopResults = data['rows'];
		})
	}
	$scope.init = function(agency, stop) {
		$scope.agency = agency;
		$scope.stop = stop;

		$scope.getStop()
		$scope.getStopRoute()
	}
}
