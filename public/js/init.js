var minYear = 1950;
var maxYear = 2030;

function init() {
  var stage = new createjs.Stage("demoCanvas");
  var circle = new createjs.Shape();
  circle.graphics.beginFill("Crimson").drawCircle(0, 0, 50);
  circle.x = 100;
  circle.y = 100;
  stage.addChild(circle);
  createjs.Tween.get(circle, {loop: true})
    .to({x: 400}, 1000, createjs.Ease.getPowInOut(4))
    .to({alpha: 0, y: 75}, 500, createjs.Ease.getPowInOut(2))
    .to({alpha: 0, y: 125}, 100)
    .to({alpha: 1, y: 100}, 500, createjs.Ease.getPowInOut(2))
    .to({x: 100}, 800, createjs.Ease.getPowInOut(2));
  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener("tick", stage);
}

$.ajax({
  type: 'POST',
  url: '/planets',
  data: {
    'activity': 'retrieve',
    'planet': '07',
    'coordinate': '2',
    'resolution': '001',
    'start_year': '1998',
    'start_day': '001',
    'stop_year': '1998',
    'stop_day': '365',
  }
}).done(function(response) {
  console.log(parser(response.body));
})

function parser(body) {
  var responseArray = [];
  var lines = body.split('\n');
  lines = lines.map(function(line) {
    return line.split(/[\s,]+/);
  });
  console.dir(lines);
  lines.forEach(function(line) {
    if (line.length > 1 && line[0] !== 'start_year=') {
      var num = Number(line[1]);
      if (num !== NaN && num >= minYear && num <= maxYear) {
        line.shift();
        responseArray.push(line);
      }
    }
  });
  return responseArray;
}
