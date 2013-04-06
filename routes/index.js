/*
 * GET home page.
 */

var systems = {
	"marta" : {
		"name" : "MARTA",
		"censusID" : "1fMVqP0kBDm6xJerswSWdsAB59wHAjPrDJb5gZlI",
		"website" : "http://www.itsmarta.com",
		"gtfs" : {
			"trips" : "1226w9UDeUDKqz3UynnDRlfxqXnn7esgvvim64zU",
			"trips_per_route" : "1of01Kl4aZXMiuGxECAEmVc5sg17N-x7MbF6-DqQ",
			"stop_times" : "12Mi_R6NyNEy-mQat4XJShXy_Q9hQOAomf6uTuH8",
			"stops" : "11eAYt_iVmfFIa_sUJ6WNq44Y48LrQ7WHD_Pm4_Q",
			"shapes" : "1X0x4ud2xSJp2w32SyC9QdtyAnE4CV86_oIZprFM",
			"routes" : "1vAAlfeAvvUQumHs64tYW5uBOduboZ-eu4jrQGQk",
			"calendar" : "1YxXy52xgur3dz6DODZTNHRqkIn0pZ8Re6yCHKgE",
			"calendar_dates" : "11qlAl8pt0clnXZMEq8XuTSIcQL6pEVM2COiIam4",
			"agency" : "1cJuMfn6uCQyCX1rFnaYc3Xqivow6I_4ma2xNYLc"
		}

	},
	"septa" : {
		"gtfs" : {
			"trips" : "unknown",
			"trips_per_route" : "unknown",
			"stop_times" : "unknown",
			"stops" : "unknown",
			"shapes" : "unknown",
			"routes" : "unknown",
			"calendar" : "unknown",
			"calendar_dates" : "unknown",
			"agency" : "unknown"
		}

	},
	"cta" : {
		"name" : "CTA",
		"censusID" : "12Xx42FS78rI-2-uG_CzSQDZ73mbpbQnvYY0houQ",
		"website" : "http://transitchicago.combart.gov",
		"gtfs" : {
			"trips" : "1FkPcilk2xjRQCI63ZPRSMAroBuLXWuzWdI3brds",
			"trips_per_route" : "unknown",
			"stop_times" : "unknown",
			"stops" : "1Vo-T0TLtHhKg0hVxIDqpAjj4TOYVNZXjMiZWtSQ",
			"shapes" : "1WNSDPPF7xQIhX5W41Klzg-kI9cERNUCi0YC8Y94",
			"routes" : "1SRgnmz5K29C6WL6Pf8YiWlO6lq3S9q1MMAe-JKE",
			"calendar" : "1UvcmZPITGce92bESRjSWCd0ZRt7FMKxcLl-heIk",
			"calendar_dates" : "1QtzsuAPkVK2J1zfEUHPhAQEjKtU0_sFd68AsMgI",
			"agency" : "13Qswnscl9VmvmlZXGrMhRrK2Q8bkRKD231dVW5k"
		}

	},
	"bart" : {
		"name" : "BART",
		"censusID" : "1vw_dCjWaKCXKUP6Q8IZ4H3K8pvj-Ap1risu-qWg",
		"website" : "http://bart.gov",
		"gtfs" : {
			"trips" : "1TECIqPpAuY5_wzGYmGjQCKD47JlKy1ZRnWREdeg",
			"trips_per_route" : "unknown",
			"stop_times" : "1591dgH533phqidACdcUY3HGHq6-si5z2lx_YeSk",
			"stops" : "15jXoM-BogStFR7TsbWAtkvRX0vc2aX0_SmR_wDc",
			"shapes" : "1jDFeZ04VDD03Sjm7unAzUNY-tKqJgw558dfJnkA",
			"routes" : "1BGFjkGUINxqXsd6GPzjR63Akdk4CjgFmLhNREL0",
			"calendar" : "1z1DG3wZaKAr3HSXz0Ho8KQXYckdxAWNKoQn056U",
			"calendar_dates" : "1TD65p5fX4Q9Eh61AzoOtb4e7V7XFKLFdfqMWSCE",
			"agency" : "1b_C6WurzKwGGm2_A4uaS-GmFqpJ43X6ul9_YOfo"
		}
	}
}

exports.agencies = function(req, res) {
	console.log(req.params)
	var agency = req.params.agency.toLowerCase();
	res.render('agency', {
		agency : JSON.stringify(systems[agency]),
		name : systems[agency]["name"],
		website : systems[agency]["website"]
	});
}

exports.routes = function(req, res) {
	console.log(req.params)
	var agency = req.params.agency.toLowerCase();
	var route = req.params.route.toLowerCase();
	res.render('route', {
		agency : JSON.stringify(systems[agency]),
		name : systems[agency]["name"],
		website : systems[agency]["website"],
		route : route
	});
}

exports.index = function(req, res) {
	res.render('index');
};

exports.stops = function(req, res) {
	var stop = {
		"stopID" : req.params.stop.toUpperCase()
	};
	var stopID = req.params.stop;
	var agency = req.params.agency.toLowerCase();
	res.render('stop', {
		stopID : stopID,
		stop : JSON.stringify(stop),
		agency : JSON.stringify(systems[agency]),
		name : systems[agency]["name"],
		website : systems[agency]["website"]
	});
	//res.send()

}

exports.partials = function(req, res) {
	var name = req.params.name;
	res.render('partials/' + name);
};

