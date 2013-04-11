var map;
var streetmap;
var searchRadius = .25;
var name;
var latlng;
var sv;
//var stopPopulation = 0;
function updateRadius(value) {
	//console.log(value)
	if (!value) {
		value = .25
	}
	$('.radius').val(value)
	searchRadius = value;
	blockQuery(name, latlng)
	//googleQuery(latlng, 0.25)
	yelpQuery(latlng, searchRadius);
	//console.log(searchRadius)
}


$(window).load(function() {

	stopQuery()

})
function initialize() {
	var mapOptions = {
		zoom : 8,
		center : new google.maps.LatLng(33.755, -84.39),
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

	var streetOptions = {
		position : new google.maps.LatLng(39.755, -84.39)//,
		// pov : {
		// heading : 34,
		// pitch : 10
		// }
	};

	// var mapOptions = {
	// zoom : 8,
	// center : new google.maps.LatLng(33.755, -84.39),
	// mapTypeId : google.maps.MapTypeId.ROADMAP
	// };
	streetmap = new google.maps.StreetViewPanorama(document.getElementById("street-canvas"), streetOptions);

}

function buildFTQuery(query) {
	var url = [fusionURL];
	url.push('?sql=');
	url.push(encodeURIComponent(query))
	url.push('&callback=?');
	url.push('&key=' + googleKey);
	return url.join('');
}

function buildCensus(query) {
	var url = [censusURL];
	url.push('?get=');
	url.push(query)
	url.push('&key=' + censusKey);
	url.push('&jsonp=?')
	return url.join('');
}

function stopQuery() {
	//console.log(stopID.stopID)
	var url = buildFTQuery("SELECT stop_name, stop_lat, stop_lon FROM " + agency.gtfs.stops + " WHERE stop_id = '" + stopID.stopID + "'")
	$.ajax({
		url : url,
		dataType : "jsonp"
	}).done(function(data) {
		if (data['rows']) {
			//console.log(data)
			$('#stopname').html(data['rows'][0][0])
			name = data['rows'][0][0]
			latlng = data['rows'][0][1] + ", " + data['rows'][0][2]
			//blockQuery(name, latlng)
			//googleQuery(latlng, 0.25)
			//yelpQuery(latlng, searchRadius);
			addMap(name, new google.maps.LatLng(data['rows'][0][1], data['rows'][0][2]))
		} else {
			$('#stopname').html("Sorry that isn't a stop")
			console.log('not a valid stop')
		}
	});
}

function outputQuery() {
	var url = buildFTQuery("SELECT * FROM " + agency.output.stop + " WHERE stop_id = '" + stopID.stopID + "'")
	$.ajax({
		url : url,
		dataType : "jsonp"
	}).done(function(data) {
		if (data['rows']) {
			console.log(data)
			$('#firstarrival').html(data['rows'][0][0])
			name = data['rows'][0][0]
			latlng = data['rows'][0][1] + ", " + data['rows'][0][2]
			blockQuery(name, latlng)
			//googleQuery(latlng, 0.25)
			yelpQuery(latlng, searchRadius);
			addMap(name, new google.maps.LatLng(data['rows'][0][1], data['rows'][0][2]))
		} else {
			$('#stopname').html("Sorry that isn't a stop")
			console.log('not a valid stop')
		}
	});
}

function addMap(name, glatlng) {
	initialize();
	//var nglatlng = new google.maps.LatLng(latlng)
	map.setCenter(glatlng)

	map.setZoom(15)
	var radius = new google.maps.Circle({
		center : glatlng,
		map : map,
		radius : 402.336,
		clickable : false,
		strokeColor : "#43A2CA",
		strokeOpacity : 0.9,
		strokeWeight : 2,
		fillColor : "#43A2CA",
		fillOpacity : 0.5
	})
	var marker = new google.maps.Marker({
		position : glatlng,
		map : map,
		title : name
	})
	streetmap.setPosition(glatlng)

}

function googleQuery(latlng, radius) {
	$.ajax({
		url : '/api/googleplaces/' + latlng + '/' + radius,
	}).done(function(data, error) {
		console.log(data)
		if (data.status == "OK") {
			var total
			if (data.next_page_token) {
				total = "20+"
			} else {
				total = data.results.length
			}
			$('#numrest').html(total)
			$.each(data.results, function(index, value) {
				$('#restlist').append('<li>' + value.name + '</li>')
			})
		}
		//console.log(data)
	})
}

function yelpQuery(latlng, radius) {
	$.ajax({
		url : '/api/yelp/' + latlng + '/' + radius,
		success : function(data) {
			$('#numrest').html(data.total)
			var restaurants = '<dl class="dl-horizontal">';
			if (!data.total) {
				return;
			}
			$.each(data.businesses, function(index, value) {
				restaurants += '<dt>' + value.name + '</dt><dd><div class="rating"><i class="star-img stars_' + addStarClass(value.rating) + '"></i></div><small class="muted">' + value.review_count + ' Reviews</small></dd>';
			})
			$('#restlist').html(restaurants);

		}
	})
}

function addStarClass(value) {
	half_stars = Math.floor(value * 2 + 0.5);
	stars_to_nearest_half = half_stars / 2;
	whole_stars = Math.floor(stars_to_nearest_half);
	var c = (stars_to_nearest_half > whole_stars) ? ("" + whole_stars + "_half") : ("" + whole_stars);
	return c
}

function blockQuery(name, latlng) {
	var url = buildFTQuery("SELECT * FROM " + agency.censusID + " WHERE ST_INTERSECTS(geometry, CIRCLE(LATLNG(" + latlng + ")," + searchRadius * 1609.34 + "))")
	$.ajax({
		url : url,
		dataType : "jsonp"
	}).done(function(data) {
		if (data['rows']) {
			console.log(data)
			//censusQuery(data['rows'])
			handleCensusResponse(data)
		} else {
			console.log('not a valid block')
		}
	})
}

function Block(args) {
	$.extend(this, args);
}

function handleCensusResponse(data) {
	var stopBlocks = []
	//console.log(data)
	$.each(data['rows'], function(i, value) {
		//console.log(value)
		stopBlocks.push(new Block({
			totalPopulation : value[7],
			area : value[9],
			age : [['under_five', value[11]], ['five_nine', value[12]], ['ten_fourteen', value[13]], ['fifteen_seventeen', value[14]], ['eighteen_twentyfour', value[15]], ['twentyfive_thirtyfour', value[16]], ['thirtyfive_fourtyfour', value[17]], ['fourtyfive_fiftyfour', value[18]], ['fiftyfive_sixtyfour', value[19]], ['sixtyfive_seventyfour', value[20]], ['seventyfive_eightfour', value[21]], ['eightyfive_over', value[22]]],
			race : [['White Alone', value[24]], ['Black or African American Alone', value[25]], ['American Indian and Alaska Native Alone', value[26]], ['Asian Alone', value[27]], ['Native Hawaiian and Other Pacific Islander Alone', value[28]], ['Some Other Race Alone', value[29]], ['Two or More races', value[30]]],
			employment : [['Private Sector', value[32]], ['Public Sector', value[33]], ['Self-Employed', value[34]], ['Private Non-Profit', value[35]], ['Unpaid Family Workers', value[36]]],
			householdIncome : [["Less than $10,000", value[38]], ["$10,000 to $14,999", value[39]], ["$15,000 to $19,999", value[40]], ["$20,000 to $24,999", value[41]], ["$25,000 to $29,999", value[42]], ["$30,000 to $34,999", value[43]], ["$35,000 to $39,999", value[44]], ["$40,000 to $44,999", value[45]], ["$45,000 to $49,999", value[46]], ["$50,000 to $59,999", value[47]], ["$60,000 to $74,999", value[48]], ["$75,000 to $99,999", value[49]], ["$100,000 to $124,999", value[50]], ["$125,000 to $149,999", value[51]], ["$150,000 to $199,999", value[52]], ["$200,000 or More", value[53]]],
			perCapitaIncome : value[54],
			housingUnits : value[55],
			occupancyStatus : {
				occupied : value[57],
				vacant : value[58]
			},
			workTransport : [["Car, truck, or van", value[60]], ["Public transportation (Includes Taxicab)", value[61]], ["Motorcycle", value[62]], ["Bicycle", value[63]], ["Walked", value[64]], ["Other means", value[65]], ["Worked at home", value[66]]],
			travelTime : [["Less than 10 minutes", value[69]], ["10 to 19 minutes", value[70]], ["20 to 29 minutes", value[71]], ["30 to 39 minutes", value[72]], ["40 to 59 minutes", value[73]], ["60 to 89 minutes", value[74]], ["90 or More minutes", value[75]], ["Worked at home", value[76]]]
		}))

	})
	//console.log(stopBlocks)
	totalBlocks(stopBlocks);
}

function totalBlocks(blks) {
	//console.log(blks)
	var totalPop = 0, weightedPop = 0, totalArea = 0, searchArea = 0, perCapitaIncome = 0, age = [], race = [], employment = [], income = [], workTransport = [], travelTime = [], weightRatio = 0
	$.each(blks, function(i, value) {
		totalPop += parseInt(value['totalPopulation'])
		totalArea += parseFloat(value['area'])
		perCapitaIncome += parseInt(value['perCapitaIncome'])
		age = aggValues(value['age'], age)
		race = aggValues(value['race'], race)
		employment = aggValues(value['employment'], employment)
		income = aggValues(value['householdIncome'], income)
		workTransport = aggValues(value['workTransport'], workTransport)
		travelTime = aggValues(value['travelTime'], travelTime)
		//console.log(income)
	})
	//console.log(totalArea)
	perCapitaIncome = Math.round(perCapitaIncome / blks.length * 100) / 100
	//console.log(searchRadius)
	weightRatio = (Math.PI * (searchRadius * searchRadius)) / totalArea
	//console.log(weightRatio)
	totalArea = Math.round(totalArea * 100) / 100;
	$('#totpop').html(totalPop);
	$('#totarea').html(totalArea + ' miles <sup>2</sup>')
	$('#weightedpop').html(Math.round(weightRatio * totalPop * 100) / 100)
	$('#searcharea').html(Math.round(searchRadius * searchRadius * Math.PI * 100) / 100 + ' miles <sup>2</sup>')
	$('#percapitaincome').html("$" + addCommas(perCapitaIncome))
	workChart(workTransport)
	ageChart(age, weightRatio)
	raceChart(race, weightRatio)
	employmentChart(employment, weightRatio)
	incomeChart(income, weightRatio)//parseInt(blks.length))
	travelChart(travelTime, weightRatio)// blks.length)
}

function aggValues(raw, out) {
	//console.log(raw, out)
	$.each(raw, function(i, v) {
		if (out[i] == undefined) {
			out.push([v[0], 0])
		}
		out[i][1] += parseInt(v[1])
	})
	return out
}

function addCommas(nStr) {
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

function getIncomeValues(income, ratio) {
	var inc = [];
	var labels = [];
	var data = [];
	$.each(income, function(i, val) {
		inc.push(parseInt(val[1] * ratio))
		labels.push(val[0])
		//console.log(val)
	})
	data = [inc, labels];
	return data;
}

function getTravelValues(travel, ratio) {
	vals = [];
	labels = [];
	$.each(travel, function(i, value) {
		vals.push(Math.round(value[1] * ratio));
		labels.push(value[0].replace(" minutes", ""));
	})
	return [labels, vals]
}

function getValues(arr, weight) {
	vals = []
	$.each(arr, function(i, value) {
		vals.push(Math.round(value[1] * weight))
	})
	return vals;
}

function getRaceValues(arr, weight) {
	vals = []
	$.each(arr, function(i, value) {

		vals.push([value[0], Math.round(value[1] * weight)])
	})
	return vals;
}

var travel_chart;

function travelChart(travel, ratio) {
	travel = getTravelValues(travel, ratio)
	travel_chart = new Highcharts.Chart({
		chart : {
			renderTo : 'travel-chart',
			type : 'column'
		},
		title : {
			text : ''
		},
		xAxis : {
			categories : travel[0],
			title : {
				text : "Minutes"
			}

		},
		tooltip : {
			pointFormat : 'Number of Residents: <b>{point.y}</b>',
		},
		yAxis : {
			min : 0,
			title : {
				text : 'Number of Residents'
			}

		},
		legend : {
			enabled : false
		},
		plotOptions : {
			column : {
				pointPadding : 0,
				borderWidth : 1
			}
		},
		series : [{
			name : 'Number of residents',
			data : travel[1]

		}],
		credits : {
			enabled : false
		},
	});
}

function workChart(work) {
	chart = new Highcharts.Chart({
		chart : {
			renderTo : 'workTransport-chart',
			spacingBottom : 0,
			spacingTop : 0,
			spacingleft : 0,
			spacingRight : 0
		},
		title : {
			text : '',
		},
		tooltip : {
			formatter : function() {
				return '<b>' + this.point.name + '</b>: ' + Math.round(this.percentage * 100) / 100 + ' %';
			}
		},
		plotOptions : {
			pie : {
				allowPointSelect : true,
				cursor : 'pointer',
				dataLabels : {
					enabled : false,
				}
			}
		},
		series : [{
			type : 'pie',
			name : 'Sector',
			data : work
		}],
		credits : {
			enabled : false
		},
	});
}

function incomeChart(inc, ratio) {
	inc = getIncomeValues(inc, ratio)
	chart = new Highcharts.Chart({
		chart : {
			renderTo : 'income-chart',
			type : 'bar'
		},
		title : {
			text : ''
		},
		subtitle : {
			text : ''
		},
		xAxis : {
			categories : inc[1],
			title : {
				text : "Income Bracket"
			}
		},
		yAxis : {
			min : 0,
			title : {
				text : ""

			}
		},
		tooltip : {
			formatter : function() {
				return '' + this.series.name + ': ' + this.y;
			}
		},
		plotOptions : {
			bar : {
				dataLabels : {
					enabled : true
				}
			}
		},
		legend : {
			enabled : false,
		},
		credits : {
			enabled : false
		},
		series : [{
			name : "Number of Households",
			data : inc[0]
		}]
	});
}

function employmentChart(emp, weight) {
	chart = new Highcharts.Chart({
		chart : {
			renderTo : 'employment-chart',
			spacingBottom : 0,
			spacingTop : 0,
			spacingleft : 0,
			spacingRight : 0
		},
		title : {
			text : '',
		},
		tooltip : {
			pointFormat : '<b>{point.percentage}%</b>',
			percentageDecimals : 2
		},
		plotOptions : {
			pie : {
				allowPointSelect : true,
				cursor : 'pointer',
				dataLabels : {
					enabled : false,
				}
			}
		},
		tooltip : {
			formatter : function() {
				return '<b>' + this.point.name + '</b>: ' + Math.round(this.percentage * 100) / 100 + ' %';
			}
		},

		series : [{
			type : 'pie',
			name : 'Sector',
			data : emp
		}],
		credits : {
			enabled : false
		},
	});
}

function raceChart(race, weight) {
	var raceValues = getRaceValues(race, weight)
	chart = new Highcharts.Chart({
		chart : {
			renderTo : 'race-chart',
			spacingBottom : 0,
			spacingTop : 0,
			spacingleft : 0,
			spacingRight : 0
		},
		title : {
			text : ''
		},
		tooltip : {
			formatter : function() {
				return '<b>' + this.point.name + '</b>: ' + Math.round(this.percentage * 100) / 100 + ' %';
			}
		},
		plotOptions : {
			pie : {
				allowPointSelect : true,
				cursor : 'pointer',
				dataLabels : {
					enabled : false,
				}
			}
		},
		series : [{
			type : 'pie',
			name : 'Race',
			data : raceValues
		}],
		credits : {
			enabled : false
		},
	});
}

function ageChart(age, weight) {
	ageValues = getValues(age, weight)
	chart = new Highcharts.Chart({
		chart : {
			renderTo : 'age-chart',
			type : 'column'
		},
		title : {
			text : ''
		},
		xAxis : {
			categories : ['Under 5', '5 to 9', '10 to 14', '15 to 17', '18 to 24', '25 to 34', '35 to 44', '45 to 54', '55 to 64', '65 to 74', '75 to 84', '85 and over']
		},
		tooltip : {
			pointFormat : 'Residents: <b>{point.y}</b>',
		},
		yAxis : {
			min : 0,
			title : {
				text : 'Population'
			}

		},
		legend : {
			enabled : false
		},
		plotOptions : {
			column : {
				pointPadding : 0,
				borderWidth : 1
			}
		},
		series : [{
			name : 'Number of residents',
			data : ageValues

		}],
		credits : {
			enabled : false
		},
	});
}

googleKey = "AIzaSyBhwGfhVZK2JpmMVelyTojjHVSqbSyM1ls";

fusionURL = "https://www.googleapis.com/fusiontables/v1/query";
