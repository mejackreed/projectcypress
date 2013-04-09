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
				// clear the elements inside of the directive
				//vis.selectAll('*').remove();
				// if 'val' is undefined, exit
				if (!newVal) {
					return;
				} else {
					//console.log(newVal)
				}
				//console.log(newVal)
				values = newVal
				//values.push(newVal)
				//console.log(values)
				//console.log(newVal)
				//var values = newVal//d3.range(1000).map(d3.random.irwinHall(10));
				//console.log(values)

				// A formatter for counts.
				var formatCount = d3.format(",.0f");

				var mouseover = function(d, i) {
					d3.select(this).select('rect').style('fill', 'red')

				};

				var synchronizedMouseOut = function() {
					d3.select(this).select('rect').style('fill', 'steelblue')

				};

				var margin = {
					top : 10,
					right : 30,
					bottom : 30,
					left : 30
				}, width = 960 - margin.left - margin.right, height = 500 - margin.top - margin.bottom;

				var x = d3.scale.linear().domain([0, d3.max(values)]).range([0, width]);
				//console.log(d3.extent(values))
				// Generate a histogram using twenty uniformly-spaced bins.
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
				}).on('mouseover', mouseover).on("mouseout", synchronizedMouseOut)

				bar.append("rect").attr("x", 1).attr("width", x(data[0].dx) - 1).attr("height", function(d) {
					return height - y(d.y);
				});

				bar.append("text").attr("dy", ".75em").attr("y", 6).attr("x", x(data[0].dx) / 2).attr("text-anchor", "middle").text(function(d) {
					return formatCount(d.y);
				});

				svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);

				// // Based on: http://mbostock.github.com/d3/ex/stack.html
				// var n = newVal.length, // number of layers
				// m = newVal[0].length, // number of samples per layer
				// data = d3.layout.stack()(newVal);
				//
				// var mx = m, my = d3.max(data, function(d) {
				// return d3.max(d, function(d) {
				// return d.y0 + d.y;
				// });
				// }), mz = d3.max(data, function(d) {
				// return d3.max(d, function(d) {
				// return d.y;
				// });
				// }), x = function(d) {
				// return d.x * width / mx;
				// }, y0 = function(d) {
				// return height - d.y0 * height / my;
				// }, y1 = function(d) {
				// return height - (d.y + d.y0) * height / my;
				// }, y2 = function(d) {
				// return d.y * height / mz;
				// };
				// // or `my` not rescale
				//
				// // Layers for each color
				// // =====================
				//
				// var layers = vis.selectAll("g.layer").data(data).enter().append("g").style("fill", function(d, i) {
				// return color(i / (n - 1));
				// }).attr("class", "layer");
				//
				// // Bars
				// // ====
				//
				// var bars = layers.selectAll("g.bar").data(function(d) {
				// return d;
				// }).enter().append("g").attr("class", "bar").attr("transform", function(d) {
				// return "translate(" + x(d) + ",0)";
				// });
				//
				// bars.append("rect").attr("width", x({
				// x : .9
				// })).attr("x", 0).attr("y", height).attr("height", 0).transition().delay(function(d, i) {
				// return i * 10;
				// }).attr("y", y1).attr("height", function(d) {
				// return y0(d) - y1(d);
				// });
				//
				// // X-axis labels
				// // =============
				//
				// var labels = vis.selectAll("text.label").data(data[0]).enter().append("text").attr("class", "label").attr("x", x).attr("y", height + 6).attr("dx", x({
				// x : .45
				// })).attr("dy", ".71em").attr("text-anchor", "middle").text(function(d, i) {
				// return d.date;
				// });
				//
				// // Chart Key
				// // =========
				//
				// var keyText = vis.selectAll("text.key").data(data).enter().append("text").attr("class", "key").attr("y", function(d, i) {
				// return height + 42 + 30 * (i % 3);
				// }).attr("x", function(d, i) {
				// return 155 * Math.floor(i / 3) + 15;
				// }).attr("dx", x({
				// x : .45
				// })).attr("dy", ".71em").attr("text-anchor", "left").text(function(d, i) {
				// return d[0].user;
				// });
				//
				// var keySwatches = vis.selectAll("rect.swatch").data(data).enter().append("rect").attr("class", "swatch").attr("width", 20).attr("height", 20).style("fill", function(d, i) {
				// return color(i / (n - 1));
				// }).attr("y", function(d, i) {
				// return height + 36 + 30 * (i % 3);
				// }).attr("x", function(d, i) {
				// return 155 * Math.floor(i / 3);
				// });
				//
				// // Animate between grouped and stacked
				// // ===================================
				//
				// function transitionGroup() {
				// vis.selectAll("g.layer rect").transition().duration(500).delay(function(d, i) {
				// return (i % m) * 10;
				// }).attr("x", function(d, i) {
				// return x({
				// x : .9 * ~~(i / m) / n
				// });
				// }).attr("width", x({
				// x : .9 / n
				// })).each("end", transitionEnd);
				//
				// function transitionEnd() {
				// d3.select(this).transition().duration(500).attr("y", function(d) {
				// return height - y2(d);
				// }).attr("height", y2);
				// }
				//
				// }
				//
				// function transitionStack() {
				// vis.selectAll("g.layer rect").transition().duration(500).delay(function(d, i) {
				// return (i % m) * 10;
				// }).attr("y", y1).attr("height", function(d) {
				// return y0(d) - y1(d);
				// }).each("end", transitionEnd);
				//
				// function transitionEnd() {
				// d3.select(this).transition().duration(500).attr("x", 0).attr("width", x({
				// x : .9
				// }));
				// }
				//
				// }

				// reset grouped state to false
				scope.grouped = false;

				// setup a watch on 'grouped' to switch between views
				// scope.$watch('grouped', function(newVal, oldVal) {
				// // ignore first call which happens before we even have data from the Github API
				// if (newVal === oldVal) {
				// return;
				// }
				// if (newVal) {
				// transitionGroup();
				// } else {
				// transitionStack();
				// }
				// });
			});
		}
	}
});
