
/**
 * Module dependencies
 */

var express = require('express'),
  //bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  errorHandler = require('express-error-handler'),
  morgan = require('morgan'),
  routes = require('./routes'),
  api = require('./routes/api'),
  http = require('http'),
  path = require('path'),
  request = require('request');

var app = module.exports = express();


/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));

var env = process.env.NODE_ENV || 'development';

// development only
if (env === 'development') {
  app.use(errorHandler());
}

// production only
if (env === 'production') {
  // TODO
}


/**
 * Routes
 */

// serve index and view partials
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API
app.get('/api/name', api.name);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);


/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));

  var options = {
    url: 'http://omniweb.gsfc.nasa.gov/cgi/models/planet.cgi',
    method: 'POST',
    formData: {
      'activity': 'retrieve',
      'planet': '07',
      'coordinate': '2',
      'resolution': '001',
      'start_year': '1998',
      'start_day': '001',
      'stop_year': '1998',
      'stop_day': '365',
    }
  };
  var callback = function(response, err) {
      //console.log(err);
      //console.log(response);
  }

  request(options, callback);
})
