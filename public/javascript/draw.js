var canvas = document.getElementById('canvas0');
var context = canvas.getContext("2d");
var data = {};

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

function initdraw() {
  canvas.addEventListener('mousedown', ev_canvas, false);
  canvas.addEventListener('mousemove', ev_canvas, false);
  canvas.addEventListener('mouseup', ev_canvas, false);
}

// grab the mouse state and "emit" is to the server
function tool_pencil() {
  var tool = this;
  context.lineWidth = 1;
  this.started = false;

  this.mousedown = function(ev) {
    //context.beginPath();
    // context.moveTo(ev._x, ev._y);
    tool.started = true;
    data.mousestate = "mousedown";
    emitDraw(data);
  };
  this.mousemove = function(ev) {
    if (tool.started) {
      data.x = Math.round(ev._x);
      data.y = Math.round(ev._y);
      data.mousestate = "mousemove";
      //  data.started = tool.started
      //drawline(data);
      emitDraw(data);
    }
  };
  // This is called when you release the mouse button
  this.mouseup = function(ev) {
    if (tool.started) {
      //  tool.mousemove(ev);
      data.mousestate = "mouseup";
      emitDraw(data);
      tool.started = false;
    }
  };
}

// draw the line when recieving an emit from the server
function drawline(data) {
  console.log("drawline at client", data);
  switch (data.mousestate) {
    case "mousedown":
      context.moveTo(data.x, data.y);
      context.beginPath();
      break;
    case "mousemove":
      context.strokeStyle = data.color;
      context.lineTo(data.x, data.y);
      context.stroke();
      break;
    case "mouseup":
      context.strokeStyle = data.color;
      context.lineTo(data.x, data.y);
      context.stroke();
      break;
  }
}

function emitDraw(data) {
  var sessionId = socketServer.sessionid;
  socketServer.emit('drawLine', data, sessionId);
}

socketServer.on('drawLine', function (data) {
  drawline(data);
});