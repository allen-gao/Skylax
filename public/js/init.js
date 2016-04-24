var minYear = 1950;
var maxYear = 2030;

var urls = [
  'http://omniweb.gsfc.nasa.gov/staging/modelweb/helios_9034.lst', // mercury 2000 001 - 2015 365
  'http://omniweb.gsfc.nasa.gov/staging/modelweb/helios_2988.lst', // earth 1996 001 - 2016 365
  'http://omniweb.gsfc.nasa.gov/staging/modelweb/helios_9372.lst' // jupiter 1996 001 - 2016 365
]

var circle;
var gotCircle;

function init() {
  var stage = new createjs.Stage("demoCanvas");
  circle = new createjs.Shape();
  circle.graphics.beginFill("Crimson").drawCircle(0, 0, 10);
  circle.x = 100;
  circle.y = 100;
  stage.addChild(circle);
  gotCircle = createjs.Tween.get(circle, {loop: true});
  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener("tick", stage);

  var results = [];
  getAllData().done(function() {
    for (var i = 0; i < arguments.length; i++) {
      results.push(arguments[i][0]);
    }
    console.log(results);
  });
}

function getDataRequest(url) {
  return $.ajax({
    type: 'POST',
    url: '/getdata',
    data: {
      url: url,
      type: 'GET'
    }
  });
}

function getAllData() {
  var requestArray = [];
  urls.forEach(function(url) {
    requestArray.push(getDataRequest(url));
  });
  return $.when.apply(undefined, requestArray);

  $.when.apply($, requestArray.map(function(url) {
    return $.ajax(url);
  }));
}

/*
$.ajax({
  type: 'POST',
  url: '/getdata', //'/planets',
  data: {
    params: {
      'activity': 'retrieve',
      'object': '04', //'planet': '05',
      'resolution': '001',
      'coordinate': '2',
      'equinox': '3',
      'start_year': '1996',
      'start_day': '001',
      'stop_year': '2016',
      'stop_day': '365'
    },
    url: 'http://omniweb.gsfc.nasa.gov/staging/modelweb/helios_2988.lst',
    type: 'GET'
  }
}).done(function(response) {
  console.log(response);
  var response = parser(response.response2.body);
  console.log(response);
  response.forEach(function(array) {
    //var result = convertXY(array[2] * 100, array[3], array[4]);
    //console.log(result);
    gotCircle
      .to({x: Number(array[2])*50 + 600, y: Number(array[3])*50 + 600}, 50, createjs.Ease.getPowInOut(4))
  });
});

*/

function parser(body) {
  var responseArray = [];
  var lines = body.split('\n');

  lines = lines.map(function(line) {
    return line.split(/[\s,]+/);
  });
  lines.forEach(function(line) {
    var num = Number(line[0]);
    if (num !== NaN && num >= minYear && num <= maxYear) {
      responseArray.push(line);
    }
  });
  return responseArray;
}

function convertXY(radius, lat, long) {

  lat = lat*(180/Math.PI);
  long = long*(180/Math.PI);

  var x = radius * Math.cos(lat) * Math.cos(long);
  var y = radius * Math.cos(lat) * Math.sin(long);
  return {
    x: x,
    y: y
  };
}
