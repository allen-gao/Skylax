
/**
 * Module dependencies
 */

var express = require('express'),
  bodyParser = require('body-parser'),
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
app.use(bodyParser());
app.use(methodOverride());
//app.use(express.json());
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

app.post('/planets', function(req, res) {
  console.log(req.body);

  var options = {
    url: 'http://omniweb.gsfc.nasa.gov/cgi/models/planet.cgi',
    method: 'POST',
    formData: req.body
  };
  var callback = function(response1, response2) {
    return res.send(response2);
  }
  request(options, callback);
});

app.post('/helios1', function(req, res) {
  console.log(req.body);

  var options = {
    url: 'http://omniweb.gsfc.nasa.gov/cgi/models/helios1.cgi',
    method: 'POST',
    formData: req.body
  };
  var callback = function(response1, response2) {
    return res.send(response2);
  }
  request(options, callback);
});

app.post('/getdata', function(req, res) {

  var options = {
    url: req.body.url,
    method: req.body.type,
    //formData: req.body.params
  };
  var callback = function(response1, response2) {
    return res.send({
      response1: response1,
      response2: response2
    });
  }
  request(options, callback);
});


/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));

})
