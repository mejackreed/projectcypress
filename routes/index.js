/*
 * GET home page.
 */
var _ = require('underscore')._;

var systems = {
	"marta" : {
		"name" : "MARTA",
		"censusID" : "1fMVqP0kBDm6xJerswSWdsAB59wHAjPrDJb5gZlI",
		"website" : "http://www.itsmarta.com",
		"gtfs" : {
			"trips" : "1226w9UDeUDKqz3UynnDRlfxqXnn7esgvvim64zU",
			"trips_per_route" : "unknown",
			"stop_times" : "12Mi_R6NyNEy-mQat4XJShXy_Q9hQOAomf6uTuH8",
			"stops" : "11eAYt_iVmfFIa_sUJ6WNq44Y48LrQ7WHD_Pm4_Q",
			"shapes" : "1X0x4ud2xSJp2w32SyC9QdtyAnE4CV86_oIZprFM",
			"routes" : "1vAAlfeAvvUQumHs64tYW5uBOduboZ-eu4jrQGQk",
			"calendar" : "1YxXy52xgur3dz6DODZTNHRqkIn0pZ8Re6yCHKgE",
			"calendar_dates" : "11qlAl8pt0clnXZMEq8XuTSIcQL6pEVM2COiIam4",
			"agency" : "1cJuMfn6uCQyCX1rFnaYc3Xqivow6I_4ma2xNYLc"
		},
		"output" : {
			"stop_route" : "1ZELvqKn0JE_KyEUi-15aWwnFhQ9u7HBARvdpDEo",
			"route" : "1cnkvllw7MoYy88qH5SrR5E2PbpdHA-_KudVSmqg",
			"active_trips" : "13PyAohHNDAuxgVEReX3BGrWPhj_7RifhGrlzi_0",
			"stop" : "1poD_G84Ax7QrF-Z-v6N8Q0F0TRUTohr8JwJTRdc",
			"all_trips_day" : "14ivHFZI39H7VY1gXw2sTZX4wy1odxtSZMNTqTvg",
			"all_trips_tod" : "1XUfX3I7XYFdUnB3aQru6gtvmPoh_gDjHIB24HBQ"
		}
	},
	"septa-rail" : {
		"name" : "Septa-Rail",
		"censusID" : "1bVQPes8ecGyaD2wCIdQ3mP8_0M0PZvx7lnECRGs",
		"website" : "http://www.septa.org/schedules/rail/index.html",
		"gtfs" : {
			"trips" : "1eGcJCunJb43NVE2V9EzLc_uwDKGeW8cGmnbR65g",
			"trips_per_route" : "unknown",
			"stop_times" : "unknown",
			"stops" : "11bWnhzXxGwxbkn_Nh0pthQFVMSO_SwbJVMySerY",
			"shapes" : "1qeCTpChzm6DLjpby7IrHx1r1hs5DiDBSNlU39DU",
			"routes" : "19iOTcGvHukrcxmrtb-JMrq_dwAARq2HP4k0s48A",
			"calendar" : "1cWKJuiMJIaLpwVu6JQQmlAWJueij4nHkS5ZIYJ8",
			"calendar_dates" : "16vS16yYeckG2GS81P_f2-3VoUptF-yGd_tCqUmA",
			"agency" : "1QmuCRA5ioCwPjlQxmWvv0GVEYz5Z113IfwynbsQ"
		},
		"output" : {
			"stop_route" : "1jOXT0VjrhC8hU_oxSoM3uXmNfoVikPicKcjM9W8",
			"route" : "1henfUvSofz2FgYWpVX6x6AdKdrOtQ7VvPrNR6OA",
			"active_trips" : "1SYTpPar5lr1-j2PMJaikK41VVc3X6NVvEuRxzVE",
			"stop" : "1oK5oxUd9AcEottLEc5zffkx3OLdPJDemANAySFY",
			"all_trips_day" : "17XCiVpgdSVWa6In8Dx8d1YsPvFcwfSCaTEhrjzY",
			"all_trips_tod" : "1uPGAd4zKYBsDHMQ6MZ5MJJTI_gbFAOweon0tZNw"

		}
		
		// SEPTA-bus
// route : 1gNdpc6oOV0hMahN2MU5byjPVR4WRY7YcI3NJnqI

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
		},
		"output" : {
			"stop_route" : "1bicK9T-3V3oZjBdZI5_Xh8Ox5_P-sK3E71fvSDw",
			"route" : "1mr6QLIgyohcA7bDO49S6baY8-xOvGDWmw7iJfm4",
			"active_trips" : "12cjopQyiJbh2NWthcPTKyJ1ySWLiqkeu3m50CjE",
			"stop" : "1nFhBi5XL5ETwkxmsB77o-Ik9Ldc9dL_ikYNA5n0"
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
		},
		"output" : {
			"stop_route" : "1NbSSQ3QnuXaIn9Ld8tBmNmv8RPoODWecD8_UKPQ",
			"route" : "1TTqFZx41tgmFno7wRrqgOPAo7Nhww5C5-3X3Vtw",
			"active_trips" : "1Mos8MBcBLOrtyNJInuSUGaBskmNnkcvUr23YRvU",
			"stop" : "18jlD7Lv8h4nncRKE1M3fAF7yjKvRdg3NLTOfABw",
			"all_trips_day" : "1_WlKqutfPlbF0BFwC7GxHXGgML-W2c1-1F8SbkA",
			"all_trips_tod" : "1aMXVnWiq7Hmykx-a1Dr5ufLBm4zaTmRfCJ2IvOs"
		}
	}
}

exports.agencies = function(req, res) {
	//console.log(req.params)
	var agency = req.params.agency.toLowerCase();
	res.render('agency', {
		agency : JSON.stringify(systems[agency]),
		name : systems[agency]["name"],
		website : systems[agency]["website"],
		title : " | " + systems[agency]["name"]
	});
}

exports.routes = function(req, res) {
	//console.log(req.params)
	var agency = req.params.agency.toLowerCase();
	var routeID = req.params.route;
	//console.log(route)
	res.render('route', {
		agency : JSON.stringify(systems[agency]),
		name : systems[agency]["name"],
		website : systems[agency]["website"],
		routeID : routeID,
		title : " | " + systems[agency]["name"] + " | " + routeID
	});
}

exports.index = function(req, res) {
	var sys = []
	_.each(systems, function(val){
		sys.push(val.name)
	})
	res.render('index', {
		systems : sys,
		title : ""
	});
};

// exports.stops = function(req, res) {
	// var stop = {
		// "stopID" : req.params.stop.toUpperCase()
	// };
	// var stopID = req.params.stop;
	// var agency = req.params.agency.toLowerCase();
	// res.render('stop', {
		// stopID : stopID,
		// stop : JSON.stringify(stop),
		// agency : JSON.stringify(systems[agency]),
		// name : systems[agency]["name"],
		// website : systems[agency]["website"]
	// });
	// //res.send()
// 
// }

exports.stoproute = function(req, res) {
	var stop = {
		"stopID" : req.params.stop.toUpperCase()
	};
	var routeID = req.params.route;
	var stopID = req.params.stop;
	var agency = req.params.agency.toLowerCase();
	res.render('stop', {
		stopID : stopID,
		stop : JSON.stringify(stop),
		routeID : routeID,
		agency : JSON.stringify(systems[agency]),
		name : systems[agency]["name"],
		website : systems[agency]["website"],
		title : " | " + systems[agency]["name"] + " | " + routeID + " | " + stopID
	});
	//res.send()

}

exports.partials = function(req, res) {
	var name = req.params.name;
	res.render('partials/' + name);
};

