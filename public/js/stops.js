var routeID;
var map;
//var stopPopulation = 0;
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
	console.log(stopID.stopID)
	var url = buildFTQuery("SELECT stop_name, stop_lat, stop_lon FROM " + agency.gtfs.stops + " WHERE stop_id = '" + stopID.stopID + "'" )
	$.ajax({
		url : url,
		dataType : "jsonp"
	}).done(function(data) {
		if (data['rows']) {
			console.log(data)
			$('#stopname').html(data['rows'][0][0])
			name = data['rows'][0][0]
			latlng = data['rows'][0][1] + ", " + data['rows'][0][2]
			blockQuery(name, latlng)
			yelpQuery(latlng, 0.25)
			addMap(name, new google.maps.LatLng(data['rows'][0][1], data['rows'][0][2]))
		} else {
			$('#stopname').html("Sorry that isn't a stop")
			console.log('not a valid stop')
		}
	});
}

function addMap(name, latlng) {
	initialize();
	map.setCenter(latlng)
	map.setZoom(15)
	var radius = new google.maps.Circle({
		center : latlng,
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
		position : latlng,
		map : map,
		title : name
	})
}

function yelpQuery(latlng, radius) {
	$.ajax({
		url : '/api/yelp/' + latlng + '/' + radius,
	}).done(function(data) {
		console.log(data)
		$('#numrest').html(data.total)
		$.each(data.businesses, function(index, value) {
			$('#restlist').append('<li>' + value.name + '</li>')
		})
		console.log(data)
	})
}

function blockQuery(name, latlng) {
	var url = buildFTQuery("SELECT * FROM " + agency.censusID + " WHERE ST_INTERSECTS(geometry, CIRCLE(LATLNG(" + latlng + "), 400))")
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
			race : [['white', value[24]], ['black', value[25]], ['americanindian', value[26]], ['asian', value[27]], ['pacific', value[28]], ['other', value[29]], ['twoOrMore', value[30]]],
			employment : [['employedOver16', value[31]], ['privateSector', value[32]], ['publicSector', value[33]], ['self', value[34]], ['privateNonProfit', value[35]], ['unpaidFamilyWorkers', value[36]]],
			householdIncome : {
				numHouseHolds : value[37],
				range1 : value[38],
				range2 : value[39],
				range3 : value[40],
				range4 : value[41],
				range5 : value[42],
				range6 : value[43],
				range7 : value[44],
				range8 : value[45],
				range9 : value[46],
				range10 : value[47],
				range11 : value[48],
				range12 : value[49],
				range13 : value[50],
				range14 : value[51],
				range15 : value[52],
				range16 : value[53],
			},
			perCapitaIncome : value[54],
			housingUnits : value[55],
			occupancyStatus : {
				occupied : value[57],
				vacant : value[58]
			},
			workTransport : {
				workers : value[59],
				carTruckVan : value[60],
				publicTransit : value[61],
				motorcycle : value[62],
				bicycle : value[63],
				walked : value[64],
				other : value[65],
				workAtHome : value[66]
			},
			travelTimetoWork : {
				workers : value[67],
				less_ten : value[69],
				ten_nineteen : value[70],
				twenty_twentynine : value[71],
				thirty_thirtynine : value[72],
				forty_fiftynine : value[73],
				sixty_eightynine : value[74],
				ninety_more : value[75],
				workAtHome : value[76]
			}
		}))

	})
	totalBlocks(stopBlocks);
}

function totalBlocks(blks) {
	console.log(blks)
	var totalPop = 0, weightedPop = 0, totalArea = 0, searchArea = 0, age = [], race = [], weightRatio = 0
	$.each(blks, function(i, value) {
		totalPop += parseInt(value['totalPopulation'])
		totalArea += parseFloat(value['area'])
		$.each(value['age'], function(i, ageV) {
			if (age[i] == undefined) {
				age.push([ageV[0], 0])
			}
			//console.log(age[i])
			age[i][1] += parseInt(ageV[1])
		})
		$.each(value['race'], function(i, raceV) {
			if (race[i] == undefined) {
				race.push([raceV[0], 0])
			}
			race[i][1] += parseInt(raceV[1])
		})
	})
	console.log(age)
	weightRatio = Math.PI / 16 / totalArea
	totalArea = Math.round(totalArea * 100) / 100;
	$('#totpop').html(totalPop);
	$('#totarea').html(totalArea)
	$('#weightedpop').html(Math.round(weightRatio * totalPop * 100) / 100)
	$('#searcharea').html(Math.round(.25 * .25 * Math.PI * 100) / 100 + ' miles')
	ageChart(age, weightRatio)
	raceChart(race, weightRatio)
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
		var label = ""
		switch (value[0]) {
			case 'white':
				label = "White alone";
				break;
			case 'black':
				label = "Black or African American Alone";
				break;
			case 'americanindian':
				label = "American Indian and Alaska Native Alone";
				break;
			case 'asian':
				label = "Asian Alone"
				break;
			case 'pacific':
				label = "Native Hawaiian and Other Pacific Islander Alone";
				break;
			case 'other':
				label = "Some Other Race Alone";
				break;
			case 'twoOrMore':
				label = "Two or More races";
				break;
		}

		vals.push([label, Math.round(value[1] * weight)])
	})
	return vals;
}

function raceChart(race, weight) {
	var raceValues = getRaceValues(race, weight)
	console.log(raceValues)
	chart = new Highcharts.Chart({
		chart : {
			renderTo : 'race-chart',
			plotBackgroundColor : null,
			plotBorderWidth : null,
			plotShadow : false
		},
		title : {
			text : 'Race'
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
			text : 'Age Distribution'
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
		plotOptions : {
			column : {
				pointPadding : 0.2,
				borderWidth : 0
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

var buildQuery, censusKey, censusURL, fusionCensusID, fusionURL, googleKey, latlng, obj, params, pop_tract, routesQuery, routesTableID, stopsRoutesQuery, stopsRoutesTableID, stopsTableID, _i, _len;

tables = [];

stopsTableID = "11eAYt_iVmfFIa_sUJ6WNq44Y48LrQ7WHD_Pm4_Q";

fusionCensusID = "1fMVqP0kBDm6xJerswSWdsAB59wHAjPrDJb5gZlI";

stopsRoutesTableID = "1k8rQw5krM5mUr5-2Q-vytLMAn8iIGDMF5jYXcOw";

routesTableID = "1vAAlfeAvvUQumHs64tYW5uBOduboZ-eu4jrQGQk";

censusKey = "ae0a36244578b82533c25a3aea85bb66052aecfc";

googleKey = "AIzaSyBhwGfhVZK2JpmMVelyTojjHVSqbSyM1ls";

censusURL = "http://api.census.gov/data/2010/sf1";

fusionURL = "https://www.googleapis.com/fusiontables/v1/query";

stopsRoutesQuery = "SELECT route_id FROM " + stopsRoutesTableID + " WHERE stop_id = ";

routesQuery = "SELECT route_short_name, route_long_name FROM " + routesTableID + " WHERE route_id = ";

