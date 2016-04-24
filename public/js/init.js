var minYear = 1950;
var maxYear = 2030;

var xOffset = 400;
var yOffset = 400;

var sf = 10000;

var planetsData = [];

var interval;


var urls = [
  'http://omniweb.gsfc.nasa.gov/staging/modelweb/helios_9034.lst', // mercury 2000 001 - 2015 365
  'http://omniweb.gsfc.nasa.gov/staging/modelweb/helios_2988.lst', // earth 1996 001 - 2016 365
  'http://omniweb.gsfc.nasa.gov/staging/modelweb/helios_9372.lst', // jupiter 1996 001 - 2016 365
  'http://omniweb.gsfc.nasa.gov/staging/modelweb/helios_10131.lst' // saturn 1996 001 - 2016 365

]

var planetData = [];

function negSqrt(num) {
  if (num < 0) {
    return -Math.sqrt(Math.abs(num));
  }
  else {
    return Math.sqrt(num);
  }
}

function init() {
  var stage = new createjs.Stage("demoCanvas");
  // sun
  sunImage = new Image();
  sunImage.src = 'http://orig12.deviantart.net/c7d3/f/2013/292/7/5/sun_transparent_background_sun_world_by_royalblueiv-d6r3ze7.png';
  sunCircle = new createjs.Bitmap(sunImage);
  sunCircle.scaleX = sunCircle.scaleY = 0.13;
  sunCircle.x = xOffset;
  sunCircle.y = yOffset;
  stage.addChild(sunCircle);
  // earth
  var earthImage = new Image();
  earthImage.src = 'http://vignette1.wikia.nocookie.net/xenosaga/images/1/1e/Earth.png/revision/20141111161920';
  earthCircle = new createjs.Bitmap(earthImage);
  earthCircle.scaleX = earthCircle.scaleY = 0.10;
  stage.addChild(earthCircle);
  // mercury
  mercuryImage = new Image();
  mercuryImage.src = 'http://1.bp.blogspot.com/-S4WaVF7emzU/Tiz2l3xYegI/AAAAAAAAALI/PC7BtFc2lEk/s1600/mercury.png'
  mercuryCircle = new createjs.Bitmap(mercuryImage);
  mercuryCircle.scaleX = mercuryCircle.scaleY = 0.03;
  stage.addChild(mercuryCircle);
  // saturn
  saturnImage = new Image();
  saturnImage.src = 'http://nuvuthemes.com/extensions/wp-content/uploads/2013/09/saturn-1024x421.png';
  saturnCircle = new createjs.Bitmap(saturnImage);
  saturnCircle.scaleX = saturnCircle.scaleY = 0.07
  stage.addChild(saturnCircle);
  // jupiter
  jupiterImage = new Image();
  jupiterImage.src = 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Jupiter_(transparent).png';
  jupiterCircle = new createjs.Bitmap(jupiterImage);
  jupiterCircle.scaleX = jupiterCircle.scaleY = 0.05;
  stage.addChild(jupiterCircle);
  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener("tick", stage);

  var results = [];
  getAllData().done(function(response) {
    planetData.push(parser(response.earth));
    planetData.push(parser(response.mercury));
    planetData.push(parser(response.saturn));
    planetData.push(parser(response.jupiter));
    /*
    for (var i = 0; i < arguments.length; i++) {
      results.push(arguments[i][0]);
    }
    results.forEach(function(result) {
      console.log(result);
      console.log(parser(result.response2.body));
    })
    */
  });

  var interval;
  $(function() {

    function start() {
      if (!interval) {
        interval = setInterval(function(){ myTimer() }, 100);
      }
    }

    function myTimer() {
      var oldValue = $('#slider').slider("option", "value");
      var value = oldValue + 1;
      $("#slider").slider('value', value);

      var years = Math.floor(value / 365);
      var days = value % 365;
      $( "#currentTime" ).val( "year: " + (years + 1996) + " days: " + days );
      var earthArray = planetData[0][value];
      if (earthArray) {
        earthCircle.x = negSqrt(Number(earthArray[0]*sf)) + xOffset;
        earthCircle.y = negSqrt(Number(earthArray[1]*sf)) + yOffset;
      }
      var mercuryArray = planetData[1][value];
      if (mercuryArray) {
        mercuryCircle.x = negSqrt(Number(mercuryArray[0]*sf)) + xOffset;
        mercuryCircle.y = negSqrt(Number(mercuryArray[1]*sf)) + yOffset;
      }
      var saturnArray = planetData[2][value];
      if (saturnArray) {
        saturnCircle.x = negSqrt(Number(saturnArray[0]*sf)) + xOffset;
        saturnCircle.y = negSqrt(Number(saturnArray[1]*sf)) + yOffset;
      }
      var jupiterArray = planetData[3][value];
      if (jupiterArray) {
        jupiterCircle.x = negSqrt(Number(jupiterArray[0]*sf)) + xOffset;
        jupiterCircle.y = negSqrt(Number(jupiterArray[1]*sf)) + yOffset;
      }
    }
    function stop() {
      clearInterval(interval);
      interval = null;
    }
    $('#startButton').click(function() {
      start();
    });
    $('#stopButton').click(function() {
      stop();
    });

    $('#slider').slider({
      min: 1460,
      max: 7300, // days after 1996 001
      value: 1460,
      slide: function( event, ui ) {
        var value = ui.value;
        var years = Math.floor(value / 365);
        var days = value % 365;
        $( "#currentTime" ).val( "year: " + (years + 1996) + " days: " + days );
        var earthArray = planetData[0][ui.value];
        if (earthArray) {
          earthCircle.x = negSqrt(Number(earthArray[0]*sf)) + xOffset;
          earthCircle.y = negSqrt(Number(earthArray[1]*sf)) + yOffset;
        }
        var mercuryArray = planetData[1][ui.value];
        if (mercuryArray) {
          mercuryCircle.x = negSqrt(Number(mercuryArray[0]*sf)) + xOffset;
          mercuryCircle.y = negSqrt(Number(mercuryArray[1]*sf)) + yOffset;
        }
        var saturnArray = planetData[2][ui.value];
        if (saturnArray) {
          saturnCircle.x = negSqrt(Number(saturnArray[0]*sf)) + xOffset;
          saturnCircle.y = negSqrt(Number(saturnArray[1]*sf)) + yOffset;
        }
        var jupiterArray = planetData[3][ui.value];
        if (jupiterArray) {
          jupiterCircle.x = negSqrt(Number(jupiterArray[0]*sf)) + xOffset;
          jupiterCircle.y = negSqrt(Number(jupiterArray[1]*sf)) + yOffset;
        }
      }
    });
  });
  $.ajax({
    type: 'POST',
    url: '/allData',
  }).done(function(response) {
    console.log(response);
  })
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
  return $.ajax({
    type: 'POST',
    url: '/allData',
  });
/*
  var requestArray = [];
  urls.forEach(function(url) {
    requestArray.push(getDataRequest(url));
  });
  return $.when.apply(undefined, requestArray);

  $.when.apply($, requestArray.map(function(url) {
    return $.ajax(url);
  }));
  */
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
  var responseObject = {};
  var lines = body.split('\n');
  lines = lines.map(function(line) {
    //console.log(line.split(/[\s,]+/));
    return line.split(/[\s,]+/);
  });
  lines.forEach(function(line) {
    var num = Number(line[1]);
    if (num !== NaN && num >= minYear && num <= maxYear) {
      var timeNum = (Number(line[1]) - 1996)*365 + Number(line[2]);
      line.splice(0, 3);
      responseObject[timeNum] = line;
      //console.log(timeNum);
    }
  });
  //console.dir(responseObject);
  return responseObject;
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
