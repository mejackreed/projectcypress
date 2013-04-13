
/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes'),
  api = require('./routes/api');

var app = module.exports = express();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/:agency/stop/:stop', routes.stops);
app.get('/:agency/route/:route', routes.routes);
app.get('/:agency/:route', routes.routes)

//app.get('/partials/:name', routes.partials);
app.get('/:agency/', routes.agencies);

// JSON API
app.get('/api/yelp/:latlng/:radius', api.yelp);
app.get('/api/googleplaces/:cat/:latlng/:radius', api.googleplaces);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Start server
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});