var canvas = document.getElementById('canvas0');
var context = canvas.getContext("2d");
var data = {};
var points = [];
var s = 0;

tool = new tool_pencil();











// The general-purpose event handler.
function ev_canvas(ev) {
  // Firefox
  if (ev.layerX || ev.layerX === 0) {
    ev._x = ev.layerX;
    ev._y = ev.layerY;
    // Opera
  } else if (ev.offsetX || ev.offsetX === 0) {
    ev._x = ev.offsetX;
    ev._y = ev.offsetY;
  }
  // Call the event handler of the tool (tool_pencil)
  var func = tool[ev.type];
  if (func) {
    func(ev);
  }
}

function initDraw() {
  canvas.addEventListener('mousedown', ev_canvas, false);
  canvas.addEventListener('mousemove', ev_canvas, false);
  canvas.addEventListener('mouseup', ev_canvas, false);

  document.getElementById("canvaspane").className = "canvascenter";

  canvas.style.width ='100%';
  canvas.style.height='100%';
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  document.getElementById("canvaspane").style.visibility = "visible";

  box0Height = document.getElementById("box0").offsetHeight;
  box0Width = document.getElementById("box0").offsetWidth;

  document.getElementById("canvaspane").offsetHeight = box0Height;
  document.getElementById("canvaspane").offsetWidth = box0Width;
}

// grab the mouse state and "emit" is to the server
function tool_pencil() {
  var tool = this;
  context.lineWidth = 1;
  this.started = false;

  this.mousedown = function (ev) {
    //context.beginPath();
    // context.moveTo(ev._x, ev._y);
    tool.started = true;
    data.mouseState = "mouseDown";
    emitDraw(data);
  };

  this.mousemove = function (ev) {
    if (tool.started) {
      data.x = Math.round(ev._x);
      data.y = Math.round(ev._y);
      data.mouseState = "mouseMove";
      //  data.started = tool.started
      //drawline(data);
      emitDraw(data);
    }
  };

  this.mouseup = function (ev) {
    if (tool.started) {
      //  tool.mousemove(ev);
      data.mouseState = "mouseUp";
      emitDraw(data);
      tool.started = false;
    }
  };
}
_____________________________________________________________________

// draw the line (points) when recieving an emit from the server
function drawline(data) {
  //console.log("drawline at client", data);
  switch (data.mouseState) {
    case "mouseDown":
      context.moveTo(data.x, data.y);
      context.beginPath();
      // reset the array for a new line
      points.length = 0;
      break;
    case "mouseMove":
      context.strokeStyle = data.color;
      context.lineTo(data.x, data.y);
      context.stroke();
    // build the array of points coming in
      points.push({x: data.x, y: data.y, color: data.color, client: data.client});
      //console.log(points);
      break;
    case "mouseUp":
      context.strokeStyle = data.color;
      context.lineTo(data.x, data.y);
      context.stroke();
      fadeOut();
      break;
  }
}







//function fadeOut() {
//    content.fillStyle = "rgba(255,255,255,0.3)";
//    content.fillRect(0, 0, canvas.width, canvas.height);
//    setTimeout(fadeOut,100);
//}
//
//fadeOut();

function fadeLatestLine() {

    s += 0.50;
    var ss = parseInt(s);
    if (s > points.length - 2) {
        return;
    }
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    context.moveTo(points[ss].x, points[ss].y);
    for (var i = ss; i < points.length; i++) {
        context.lineTo(points[i].x, points[i].y);
    }
    context.stroke();
}

//var fadeTimer=setInterval(function(){fadeOut()},1000);

function fadeOut() {

    var opac = .1;
    context.lineWidth = 3;
    context.strokeStyle = "rgba(215, 44, 244, " + opac + ")";
    fadeLatestLine();
    //setTimeout(fadeout , 1000);
}


function emitDraw(data) {
  var sessionId = socketServer.sessionid;
  socketServer.emit('drawLine', data, sessionId);
}

socketServer.on('drawLine', function (data) {
  drawline(data);
});