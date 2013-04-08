'use strict';

/* Directives */

angular.module('myApp.directives', []).directive('appVersion', ['version',
function(version) {
	return function(scope, elm, attrs) {
		elm.text(version);
	};
}]).directive('hcScatter', function() {
	return {
		restrict : 'C',
		replace : true,
		scope : {
			items : '=',
			name : '='
		},
		controller : function($scope, $element, $attrs) {
			//console.log(2);

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
					formatter : function() {
						var hour = parseInt(this.x / 60)
						var minute = this.x % 60
						var time = hour + ":" + minute
						//console.log(hour,minute)
						//console.log(moment(this.value.toString(), 'mm'));
						return "<b>" + moment(time, 'hh:mm').format('h:mm A') + "</b> - " + this.y + " trips";
						//return this.x
					}
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
						formatter : function() {
							var hour = parseInt(this.value / 60)
							var minute = this.value % 60
							var time = hour + ":" + minute
							//console.log(hour, minute)
							//console.log(moment(this.value.toString(), 'mm'));
							return moment(time, 'hh:mm').format('h:mm A')
						}
					}
				},
				series : [{
					//type : 'pie',
					name : scope.name,
					data : scope.items
				}]
			});
			//	console.log(scope.items)

			scope.$watch("items", function(newValue) {
				//console.log(scope.name)
				//chart.series[0].name = 'test123'
				chart.series[0].update({
					name : scope.name
				})
				chart.series[0].setData(newValue, true);

			}, true);

		}
	}
});
