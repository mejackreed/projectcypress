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
		template : '<div id="container" class="span12" style="margin: 0 auto; height:400px;">not working</div>',
		link : function(scope, element, attrs) {
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
			scope.$watch("name", function(newValue) {
				chart.series[0].update({
					name : scope.name
				})
				chart.series[0].setData(scope.items, true)
			}, true);

			scope.$watch("items", function(newValue) {
				//console.log(scope.items)
				//chart.series[0].name = 'test123'
				chart.series[0].update({
					name : scope.name
				})
				chart.series[0].setData(newValue, true);

			}, true);

		}
	}
}).directive('dHist', function() {

	// constants
	var margin = 20, width = 960, height = 500 - .5 - margin, color = d3.interpolateRgb("#f77", "#77f");

	return {
		restrict : 'E',
		terminal : true,
		scope : {
			val : '='//,
			//grouped : '='
		},
		link : function(scope, element, attrs) {

			// set up initial svg object
			//var vis = d3.select(element[0]).append("svg").attr("width", width).attr("height", height + margin + 100);

			scope.$watch('val', function(newVal, oldVal) {
				var values = new Array();

				if (!newVal) {
					return;
				} else {
					//console.log(newVal)
				}
				//console.log(newVal)
				values = newVal
				
				//console.log(values)
				if (values.length < 1){
					return;
				}

				var formatCount = d3.format(",.0f");

				var mouseover = function(d, i) {
					d3.select(this).select('rect').style('fill', 'red')

				};

				var mouseout = function() {
					d3.select(this).select('rect').style('fill', 'steelblue')

				};

				var margin = {
					top : 10,
					right : 30,
					bottom : 30,
					left : 30
				}, width = 960 - margin.left - margin.right, height = 500 - margin.top - margin.bottom;

				var x = d3.scale.linear().domain([0, d3.max(values)]).range([0, width]);

				var data = d3.layout.histogram()
				.bins(x.ticks(20))(values);
				//console.log(data)

				var y = d3.scale.linear().domain([0, d3.max(data, function(d) {
					return d.y;
				})]).range([height, 0]);

				var xAxis = d3.svg.axis().scale(x).orient("bottom");
				var svg = d3.select(element[0]).append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				var bar = svg.selectAll(".bar").data(data).enter().append("g").attr("class", "bar").attr("transform", function(d) {
					return "translate(" + x(d.x) + "," + y(d.y) + ")";
				}).on('mouseover', mouseover).on("mouseout", mouseout)

				bar.append("rect").attr("x", 1).attr("width", x(data[0].dx) - 1).attr("height", function(d) {
					return height - y(d.y);
				});

				bar.append("text").attr("dy", ".75em").attr("y", 6).attr("x", x(data[0].dx) / 2).attr("text-anchor", "middle").text(function(d) {
					return formatCount(d.y);
				});

				svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);

			});
		}
	}
}).directive('dScat', function() {

	// constants
	var margin = 50, width = $('d-scat').width(), height = 300, color = d3.interpolateRgb("#f77", "#77f");

	return {
		restrict : 'E',
		terminal : true,
		scope : {
			items : '=',
			name : '='
			//grouped : '='
		},
		link : function(scope, element, attrs) {
			width = $('d-scat').width()

			function formatTime(d) {
				var hour = parseInt(d / 60)
				var minute = d % 60
				var time = hour + ":" + minute
				return moment(time, 'hh:mm').format('h:mm a')
			}

			//console.log(d3.select(element[0]))
			//console.log($('d-scat').width())
			// set up initial svg object
			//var vis = d3.select(element[0]).append("svg").attr("width", width).attr("height", height + margin + 100);
			var svg = d3.select(element[0]).append("svg").attr("width", width).attr("height", height);
			var div = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

			scope.$watch('items', function(newVal, oldVal) {

				svg.selectAll('*').remove();

				var values = new Array();

				if (!newVal) {
					return;
				} else {
					//console.log(newVal)
				}
				//console.log(newVal)
				function mouseon() {
					//console.log(d3.select(this).data())
					var d = d3.select(this).data()
					d3.select(this).transition().duration(150).style('fill', 'red').attr('r', 10)
					div.transition().duration(0).style("opacity", .9);
					div.html(formatTime(d[0][0]) + " - " + d[0][1] + " trips").style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY - 28) + "px");
					//console.log(this)
					//d3.select(this).select('circle').style('fill', 'red')

				}

				function mouseout() {
					d3.select(this).transition().duration(100).style('fill', 'steelblue').attr('r', 5)
					div.transition().duration(100).style("opacity", 0);
				}

				values = newVal

				var padding = 20;

				var xScale = d3.scale.linear().domain([0, d3.max(values, function(d) {
					return d[0];
				})]).range([margin, width - margin]).nice();

				var yScale = d3.scale.linear().domain([0, d3.max(values, function(d) {
					return d[1];
				})]).range([height - margin, margin]).nice();

				var xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(12).tickFormat(function(d, i) {
					return formatTime(d)
				});
				var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(5);

				svg.append("g").attr("class", "axis")//Assign "axis" class
				.call(xAxis).attr("transform", "translate(0," + (height - margin ) + ")").attr('')

				svg.append("g").attr("class", "axis").attr("transform", "translate(" + padding + ",0)").call(yAxis);

				svg.selectAll("circle").data(values).enter().append("circle").attr("cx", function(d) {
					var hour = parseInt(d[0] / 60)
					var minute = d[0] % 60
					var time = hour + ":" + minute
					//return time
					//console.log(hour, minute)
					//console.log(moment(this.value.toString(), 'mm'));
					//return moment(time, 'hh:mm').format('h:mm A')

					return xScale(d[0]);
				}).attr("cy", function(d) {
					return yScale(d[1]);
				})
				//.transition().duration(800)
				.attr("r", 5).attr("fill", 'steelblue').attr("fill-opacity", '.5').on('mouseover', mouseon).on('mouseout', mouseout).append("svg:title").text(function(d) {
					return d;
				});
				// svg.selectAll("text").data(values).enter().append("text").text(function(d) {
				// return d[0] + "," + d[1];
				// }).attr("x", function(d) {
				// return xScale(d[0]);
				// }).attr("y", function(d) {
				// return yScale(d[1]);
				// }).attr("font-family", "sans-serif").attr("font-size", "11px").attr("fill", "red");
			});
		}
	}
});
