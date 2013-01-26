/*
 * Serve JSON to our AngularJS client
 */
var yelp = require("yelp").createClient({
	consumer_key : "R8jMKdv-87s4EJTVWjbIaQ",
	consumer_secret : "FyvXHlygYBVYhepJj-c-R61Itp8",
	token : "orGl4pCaHxx5c7iorAL-gz0lcawZtXON",
	token_secret : "C5rxOZTzIxH7QRl9rXp0uFe4D04"
});


exports.yelp = function(req, res) {
	yelp.search({
		term : "food",
		radius_filter : req.params.radius*1609.34,
		ll : req.params.latlng
	}, function(error, data) {
		res.send(data)
	});

}
