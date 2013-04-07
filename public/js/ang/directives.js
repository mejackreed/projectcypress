'use strict';

/* Directives */

angular.module('myApp.directives', []).directive('appVersion', ['version',
function(version) {
	return function(scope, elm, attrs) {
		elm.text(version);
	};
}]).directive('hcPie', function() {
	return {
		restrict : 'C',
		replace : true,
		scope : {
			items : '='
		},
		controller : function($scope, $element, $attrs) {
			console.log(2);

		},
		template : '<div id="container" class="span12" style="margin: 0 auto">not working</div>',
		link : function(scope, element, attrs) {
			console.log(3);
			var chart = new Highcharts.Chart({
				chart : {
					type : 'scatter',
					renderTo : 'container',
					plotBackgroundColor : null,
					plotBorderWidth : null,
					plotShadow : false,
				},
				title : {
					text : ''
				},
				tooltip : {
					//pointFormat : '{series.name}: <b>{point.percentage}%</b>',
					//percentageDecimals : 1
				},
				plotOptions : {
					scatter : {
						marker : {
							fillColor : 'rgba(0,136,204,.25)',
							radius : 3,
							states : {
								hover : {
									enabled : true,
									lineColor : 'rgb(100,100,100)'
								}
							}
						},
					}
				},
				credits : {
					enabled : false
				},
				yAxis : {
					min : 0
				},
				xAxis : {
					labels : {
						formatter : function(){
							return this.value
						}
					}
				},
				series : [{
					//type : 'pie',
					name : 'test',
					data : scope.items
				}]
			});
			//	console.log(scope.items)

			scope.$watch("items", function(newValue) {
				//console.log(newValue)
				chart.series[0].setData(newValue, true);
			}, true);

		}
	}
});
