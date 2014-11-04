
var express      = require('express'),
  methodOverride = require('method-override'),
  bodyParser     = require('body-parser'),
  errorHandler   = require('errorhandler'),
  morgan         = require('morgan'),
  http           = require('http'),
  path           = require('path'),
  mongoose       = require('mongoose'),
  config         = require('./config'),
  routesVideoResume         = require('./routes/videoResume'),
  routesVideoBroadcasting   = require('./routes/videoBroadcasting');

var app = express();

/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
// app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

var env = process.env.NODE_ENV || 'development';

// development only
if (env === 'development') {
  app.use(errorHandler({showStack: true, dumpExceptions: true}));
}

// production only
if (env === 'production') {
  // TODO
}


mongoose.connect(config.mongo.domain, config.mongo.options, function (err, db) {
  console.log('Connection successful to: ' + mongodbURL);
});



/**
 * Routes
 */

// serve index and view partials
// app.get('/', routes.index);
// app.get('/partials/:name', routes.partials);

// // JSON API
// app.get('/api/name', api.name);

// // redirect all others to the index (HTML5 history)
// app.get('*', routes.index);


// var router = express.Router();
// router.use(routes(app));


routesVideoResume(app);
routesVideoBroadcasting(app);

/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
