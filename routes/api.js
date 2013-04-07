/*
* Serve JSON to our AngularJS client
*
*
*/

//var keys = require('../keys.json')

var yelp = require("yelp").createClient({
	consumer_key : process.env.YELP_CONSUMER_KEY,
	consumer_secret : process.env.YELP_CONSUMER_SECRET,
	token : process.env.YELP_TOKEN,
	token_secret : process.env.YELP_TOKEN_SECRET
});

var GooglePlaces = require('google-places');

var places = new GooglePlaces(process.env.GOOGLEKEY)

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
		//console.log(error)
	});

}

