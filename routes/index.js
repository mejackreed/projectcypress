/*
 * GET home page.
 */




exports.index = function(req, res) {
	res.render('index');
};

exports.stops = function(req, res) {
	var stop = req.params.stop;
	res.render('stop', {
		stop : stop
	});
	
}

exports.partials = function(req, res) {
	var name = req.params.name;
	res.render('partials/' + name);
};

