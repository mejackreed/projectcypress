/*
* Serve JSON to our AngularJS client
*
*
*/

// var keys = require('../keys.json')
//
// var yelp = require("yelp").createClient({
// consumer_key : keys.yelp.consumer_key,
// consumer_secret : keys.yelp.consumer_secret,
// token : keys.yelp.token,
// token_secret : keys.yelp.token_secret
// });

var GooglePlaces = require('google-places');
if (process.env.NODE_ENV == "production") {
	var places = new GooglePlaces(process.env.googlekey);
}else{
	var keys = require('../keys.json')
	var places = new GooglePlaces(keys.googlekey)
}

exports.googleplaces = function(req, res) {
	latlng = req.params.latlng.split(',');
	lat = parseFloat(latlng[0]);
	lng = parseFloat(latlng[1]);
	places.search({
		keyword : 'Food',
		location : [lat, lng],
		radius : req.params.radius * 1609.34
	}, function(err, response) {
		res.send(response);
	});

}

exports.yelp = function(req, res) {
	yelp.search({
		term : "food",
		radius_filter : req.params.radius * 1609.34,
		ll : req.params.latlng
	}, function(error, data) {
		res.send(data)
	});

}

