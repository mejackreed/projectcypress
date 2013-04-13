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

function RouteCtrl($scope, $http, $resource, $filter) {
	//$scope.serviceSelect = '40205'
	$scope.dayButtons = "Tuesday"
	$scope.currentPage = 0;
	$scope.pageSize = 8;
	//$scope.setPage = function (pageNo) {

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
			//var dayFilter = $filter('dayButtons')
			//console.log($scope.routeStopUnique | filter:dayButtons)
			return Math.ceil(($scope.routeStopUnique).length / $scope.pageSize);
		}
	}
	//$scope.agency = '456';
	//	var testParam = "SELECT * from " + agency
	$scope.serviceType = "this is the type";

	$scope.getRoute = function() {
		//	console.log($scope.agency.name)
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
			$scope.routeResult = data['rows'];
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
				sql : "SELECT * from " + $scope.agency.output.stop_route + " WHERE route_id ='" + $scope.route + "'",
				key : googleKey,
				callback : 'JSON_CALLBACK'
			}
		}).success(function(data) {
			$scope.routeStopResult = data['rows'];
			$scope.routeStopUnique = [];
			_.each($scope.routeStopResult, function(v, i) {
				var stop = _.findWhere($scope.routeStopUnique, {
					'stop_id' : v[2],
					"dow" : v[4]
				})
				if (stop == undefined) {
					$scope.routeStopUnique.push({
						"stop_id" : v[2],
						"stop_name" : v[1],
						"dow" : v[4]
					})
				}
			})
		})
	}
	$scope.getRouteStats = function() {
		//console.log($scope.agency.output)
		$http({
			method : 'JSONP',
			url : fusionURL,
			params : {
				sql : "SELECT * from " + $scope.agency.output.route + " WHERE route_id ='" + $scope.route + "'",
				key : googleKey,
				callback : 'JSON_CALLBACK'
			}
		}).success(function(data) {
			//console.log(data)
			$scope.routeStats = data['rows'];
		})
	}

	$scope.getRouteTrips = function() {
		//console.log($scope.route)
		$http({
			method : 'JSONP',
			url : fusionURL,
			params : {
				sql : "SELECT * from " + $scope.agency.output.active_trips + " WHERE route_id ='" + $scope.route + "'",
				key : googleKey,
				callback : 'JSON_CALLBACK'
			}
		}).success(function(data) {
			console.log(data)
			if (data['rows']) {
				_.each(data['rows'], function(value, i) {

					if (_.where($scope.routeTrips, {
						"service_id" : value[1]
					}).length == 0) {
						$scope.routeTrips.push({
							"service_id" : value[1],
							"trips" : [[parseInt(value[2]), parseInt(value[3])]]
						})
					} else {
						_.where($scope.routeTrips, {
							"service_id" : value[1]
						}, function(val) {
							return val
						}).trips.push([parseInt(value[2]), parseInt(value[3])]//{

						)
					}
				})
			} else {
				return;
			}
			//console.log($scope.routeTrips)
			$scope.activeTrip = ["Tuesday", _.sortBy(_.findWhere($scope.routeTrips, {"service_id" : "Tuesday"})['trips'], function(val) {
				//console.log(val)
				return val[0]
			})]
		}).error(function(data) {
			console.log(data)
		})
	}

	$scope.routeTrips = [];

	$scope.updateChart = function() {
		//console.log($scope.dayButtons)
		//console.log($scope.serviceSelect)
		//console.log($scope.routeTrips)
		$scope.activeTrip = [$scope.tripSelect[1], _.sortBy(_.findWhere($scope.routeTrips, {"service_id" : $scope.tripSelect[1]})['trips'], function(val) {
			return val[0]
		})]
		//console.log($scope.activeTrip)
	}

	$scope.init = function(agency, route) {
		//This function is sort of private constructor for controller
		$scope.agency = agency;
		$scope.route = route;
		//console.log($scope.route)
		//console.log($scope.agency)

		$scope.getRoute()
		$scope.getStopRoute()
		$scope.getRouteStats()
		$scope.getRouteTrips()

	};
}

function StopCtrl($scope, $http, $resource) {
	$scope.dayButtons = "Tuesday"
	$scope.stop_name = "Stop Name"

	//	$scope.serviceSelect = "xxxxx"
	// $scope.updateRoutes = function() {
		// $scope.routeStopResults = []
		// _.each($scope.routeStopResultsAll, function(val) {
			// //console.log(val)
			// //console.log($scope.serviceSelect)
			// //if (val[4] == $scope.serviceSelect[3]) {
			// $scope.routeStopResults.push(val)
			// //	}
		// })
		// //console.log($scope.routeStopResults)
		// //$scope.routeStopResults =
	// }
	// $scope.updateRouteInfo = function() {
		// $scope.getRouteStats()
	// }
	$scope.getAllRoutes = function() {
		//console.log($scope.serviceSelect)
		$http({
			method : 'JSONP',
			url : fusionURL,
			params : {
				sql : "SELECT * from " + $scope.agency.output.route + " WHERE route_id ='" + $scope.route + "'",
				key : googleKey,
				callback : 'JSON_CALLBACK'
			}
		}).success(function(data) {
			console.log(data)
			$scope.routeStats = data['rows'];
		})
	}
	
	

	$scope.getStopRoute = function() {
		//console.log($scope.agency.output)
		$http({
			method : 'JSONP',
			url : fusionURL,
			params : {
				sql : "SELECT * from " + $scope.agency.output.stop_route + " WHERE stop_id ='" + $scope.stop + "' AND route_id ='" + $scope.route + "'",
				key : googleKey,
				callback : 'JSON_CALLBACK'
			}
		}).success(function(data) {
			//console.log($scope.stop, $scope.route)
			//console.log(data)
			$scope.routeStopResultsAll = data['rows'];
			if (data['rows']){
			$scope.stop_name = $scope.routeStopResultsAll[0][1]
			}
		})
	}

	$scope.getRouteStats = function() {
		//console.log($scope.serviceSelect)
		$http({
			method : 'JSONP',
			url : fusionURL,
			params : {
				sql : "SELECT * from " + $scope.agency.output.route + " WHERE route_id ='" + $scope.route + "'",
				key : googleKey,
				callback : 'JSON_CALLBACK'
			}
		}).success(function(data) {
			console.log(data)
			$scope.routeStats = data['rows'];
		})
	}
	
	$scope.getRouteInfo = function(){
		$http({
			method : 'JSONP',
			url : fusionURL,
			params : {
				sql : "SELECT * from " + $scope.agency.gtfs.routes + " WHERE route_id ='" + $scope.route + "'",
				key : googleKey,
				callback : 'JSON_CALLBACK'
			}
		}).success(function(data) {
			//console.log(data)
			$scope.routeResult = data['rows']
		})
	}

	$scope.init = function(agency, stop, route) {
		$scope.agency = agency;
		$scope.stop = stop
		$scope.route = route.toString()
//	console.log($scope.route, route.toString())
		$scope.getRouteInfo()
		$scope.getStopRoute()
		$scope.getRouteStats()
	}
}

function AgencyCtrl($scope, $http, $resource) {
	$scope.histLabel1 = "Speed in mph"
	$scope.histLabel2 = "Headway in minutes"
	$scope.currentPage = 0;
	$scope.pageSize = 8;
	//$scope.setPage = function (pageNo) {


	$scope.numberOfPages = function() {
		if ($scope.routeUniqueResults == undefined) {
			return ""
		} else {
			//var dayFilter = $filter('dayButtons')
			//console.log($scope.routeStopUnique | filter:dayButtons)
			return Math.ceil(($scope.routeUniqueResults).length / $scope.pageSize);
		}
	}

	//$scope.routeResults = []all_trips_tod
	$scope.getTripsPerTime = function() {
		$http({
			method : 'JSONP',
			url : fusionURL,
			params : {
				sql : "SELECT * from " + $scope.agency.output.all_trips_tod + " WHERE dow = 'Tuesday'",
				key : googleKey,
				callback : 'JSON_CALLBACK'
			}
		}).success(function(data) {
			//	console.log(data)
			$scope.tripsPerTime = data['rows']//[[],[]]
			//	console.log($scope.tripsPerTime)
		})
	}

	$scope.getTripsPerDay = function() {
		$http({
			method : 'JSONP',
			url : fusionURL,
			params : {
				sql : "SELECT * from " + $scope.agency.output.all_trips_day,
				key : googleKey,
				callback : 'JSON_CALLBACK'
			}
		}).success(function(data) {
			console.log(data)
			$scope.tripsPerDay = data['rows']//[[],[]]
			//console.log($scope.tripsPerDay)
		})
	}

	$scope.getRoutes = function() {
		$http({
			method : 'JSONP',
			url : fusionURL,
			params : {
				sql : "SELECT * from " + $scope.agency.output.route,
				key : googleKey,
				callback : 'JSON_CALLBACK'
			}
		}).success(function(data) {
			console.log(data);
			$scope.averageSpeed = [];
			$scope.averageHeadway = [];
			$scope.routeUniqueResults = [];
			_.forEach(data['rows'], function(val) {
				if ( typeof val[4] == 'number') {
					$scope.averageSpeed.push(val[4])
				}
				if ( typeof val[7] == 'number') {
					$scope.averageHeadway.push(val[7])
				}
				if (_.findWhere($scope.routeUniqueResults, {routeID : val[0]}) == undefined){
					$scope.routeUniqueResults.push({
						routeID : val[0],
						route_short_name : val[13],
						route_long_name : val[14]
					})
				}
			})
		
		})
	}

	$scope.init = function(agency) {
		$scope.agency = agency;
		//$scope.stop = stop;
		$scope.getRoutes()
		$scope.getTripsPerTime()
		$scope.getTripsPerDay()
		//$scope.getStop()
		//$scope.getStopRoute()
	}
}

function HomeCtrl($scope) {
	$scope.init = function(systems) {
		$scope.systems = systems.split(',')
		console.log(systems)
	}
}

