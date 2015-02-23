var canvas = document.getElementById('canvas0');
var context = canvas.getContext("2d");
var data = {};
var points = [];
var line = [];
var lineArray = [];
var s = 0;
var fade = false;
var fadeTimer;
var fadeSwitch = true;

function baseLineStyle() {
  context.lineWidth = 2;
  context.lineJoin = 'round';
  context.lineCap = 'round';
  context.shadowBlur = 2;
};

tool = new tool_pencil();

var Line = function(line, c, client) {
  this.line = line;
  this.color = c;
  this.client = client;
};

function initDraw() {

  line.length = 0;
  lineArray.length = 0;

  canvas.addEventListener('mousedown', ev_canvas, false);
  canvas.addEventListener('mousemove', ev_canvas, false);
  canvas.addEventListener('mouseup', ev_canvas, false);

  canvas.addEventListener('touchstart', touchStartHandler, false);
  canvas.addEventListener('touchmove', touchMoveHandler, false);
  canvas.addEventListener('touchend', touchEndHandler, false);

  document.getElementById("canvaspane").className = "canvascenter";

  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  box0Height = document.getElementById("box0").offsetHeight;
  box0Width = document.getElementById("box0").offsetWidth;

  document.getElementById("canvaspane").style.visibility = "visible";
  document.getElementById("canvaspane").offsetHeight = box0Height;
  document.getElementById("canvaspane").offsetWidth = box0Width;

  baseLineStyle();

  drawUI(); // Test UI widget for the draw canvas

  // list the z-factors

  //$('*').filter(function() {
 //   return $(this).css('z-index') >= 10;
 // }).each(function() {
  //  console.log("z-index:", $(this), "is:", $(this).css('z-index'))
  //});
}

// The general-purpose event handler for mouse events.
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
    console.log("at func:", ev._x, ev._y);
    console.log("at func:", func);
    func(ev);
  }
};

function touchStartHandler(e) {
    tool.started = true;
    data.mouseState = "mouseDown";
    console.log("touchstart:", data);
    emitDraw(data);
  };

function touchMoveHandler(e) {
  e.preventDefault();
  if (tool.started) {
    touches = e.touches.item(0);
    console.log('touchMoveHandler:', touches.pageX, touches.pageY);
    var canvasLocation = canvas.getBoundingClientRect();
    data.x = Math.round(touches.clientX - canvasLocation.left);
    data.y = Math.round(touches.clientY - canvasLocation.top);
    data.mouseState = "mouseMove";
    emitDraw(data);
  }
};

  function touchEndHandler(e) {
    if (tool.started) {
      data.mouseState = "mouseUp";
      console.log("touchend:", data)
      emitDraw(data);
      tool.started = false;
    }
  };

// grab the mouse state and "emit" is TO the server

function tool_pencil() {
  var tool = this;
  this.started = false;

  this.mousedown = function(ev) {
    //context.beginPath();
    // context.moveTo(ev._x, ev._y);
    tool.started = true;
    data.mouseState = "mouseDown";
    emitDraw(data);
  };

  this.mousemove = function(ev) {
    if (tool.started) {
      data.x = Math.round(ev._x);
      data.y = Math.round(ev._y);
      data.mouseState = "mouseMove";
      emitDraw(data);
    }
  };

  this.mouseup = function(ev) {
    if (tool.started) {
      //  tool.mousemove(ev);
      data.mouseState = "mouseUp";
      emitDraw(data);
      tool.started = false;
    }
  };
}

//
// collect the points FROM the server and form the canvas lineArray
//   - draw the initial line in real-time to provide the live drawing effect

function recieveLineFromServer(data) {

  //console.log("drawline at client", data);
  switch (data.mouseState) {
    case "mouseDown":
      context.beginPath();
      context.moveTo(data.x, data.y);
      context.beginPath();
      // reset the array for a new line
      points.length = 0;
      break;
    case "mouseMove":
      context.strokeStyle = data.color;
      context.shadowColor = data.color;
      context.lineTo(data.x, data.y);
      baseLineStyle();
      context.stroke();
      // build the array of points coming in
      points.push({
        x: data.x,
        y: data.y,
        color: data.color,
        client: data.client
      });
      //arr = [data.x, data.y];
      line.push({
        x: data.x,
        y: data.y,
        color: data.color
      });
      break;
    case "mouseUp":
      context.lineTo(data.x, data.y);
      context.stroke();
      // add the new complete line
      line.reverse;
      lineArray.push(new Line(line, data.color, data.client));
      line = [];
      context.beginPath();
      //console.log("new line added ---------------------------");
      drawCanvaslineArray();
      break;
  }
}

function drawCanvaslineArray() {

  //console.log("enter drawCanvaslineArray - fade :", fade);
  if (fade == false) {
    fade = true;
    toggleFade();
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < lineArray.length; i++) {

    var points = lineArray[i].line;

    points.slice(10, points.length);

    // draw the points for a line

    for (var j = 0; j < points.length; j++) {
      context.strokeStyle = lineArray[i].line[j].color;
      context.shadowColor = lineArray[i].line[j].shadowColor;

      if (j === 0) {
        context.beginPath();
        context.moveTo(lineArray[i].line[j].x, lineArray[i].line[j].y);
      }
      context.lineTo(lineArray[i].line[j].x, lineArray[i].line[j].y);
      //console.log("point:",  j, points[j].x, points[j].y);


      context.lineWidth = 5;
  context.lineJoin = 'round';
  context.lineCap = 'round';
  context.shadowBlur = 5;

      context.stroke();
    }

    if (fadeSwitch == true) {

      // create the fade "comet tail, dripping water, etc."

      var tail = [];
      tail = lineArray[i].line.slice(0, 5);

      tail.reverse;

      lineArray[i].line.shift(10);

      var l = lineArray[i].line.length;

      for (var k = 0; k < l; k++) {

        // console.log("tail", tail);

        for (var p = 0; p < tail.length; p++) {

          //foo = getColorValues(tail[p].color);
          //
          //console.log(foo);
          //
          //var r = f//oo.red;
          //var g = f//oo.green;
          //var b = f//oo.blue;
          //var alpha// = foo.alpha;
          //
          //bar = foo.blue - 10;
          //// baz = foo.red - 10;
          //
          //tail[p].color = 'rgba(' + r + ', ' + g + ', ' + b +' , ' + alpha + ' )';

          //a = (bar) + ")";
          //tail[p].color = lineArray[i].color.replace(/[\d\.]+\)$/g, a);

          context.strokeStyle = tail[p].color;
          if (p === 0) {
            context.beginPath();
            context.moveTo(tail[p].x, tail[p].y);
          }
          context.lineTo(tail[p].x, tail[p].y);
          //console.log("point:",  j, points[j].x, points[j].y);
          baseLineStyle();
          // context.shadowColor = lineArray[i].color;

          context.stroke();
        }
      }
    }
    // cleanup

    if (lineArray[i].line.length == 0) {
      lineArray.splice(i);
    }
    //console.log(" at cleanup lineArray Length:", lineArray.length);

    // if the lineArray is empty turn off the fadder

    if (lineArray.length == 0) {
      fade = false;
      toggleFade();
      //console.log("botton of drawCanvaslineArray, fade:", fade);
    }
  }
}

// toggle the interval for the fade effect

function toggleFade() {

  if (fadeSwitch == true) {
    if (fade == true) {
      fade = true;
      fadeTimer = setInterval(drawCanvaslineArray, 75);
      console.log("fade timer turned ON in in toggleFade", fade);
    } else {
      fade == false;
      console.log("fade timer turned OFF in in toggleFade", fade);
      clearInterval(fadeTimer);
    }
  }
  if (fadeSwitch == false) {
    fade == false;
    console.log("fade timer turned OFF in in toggleFade with fadeSwitch", fade);
    clearInterval(fadeTimer);
  }
}

function getColorValues( color ){
  var values = { red:null, green:null, blue:null, alpha:null };
  if( typeof color == 'string' ){
    /* hex */
    if( color.indexOf('#') === 0 ){
      color = color.substr(1)
      if( color.length == 3 )
        values = {
          red:   parseInt( color[0]+color[0], 16 ),
          green: parseInt( color[1]+color[1], 16 ),
          blue:  parseInt( color[2]+color[2], 16 ),
          alpha: 1
        }
      else
        values = {
          red:   parseInt( color.substr(0,2), 16 ),
          green: parseInt( color.substr(2,2), 16 ),
          blue:  parseInt( color.substr(4,2), 16 ),
          alpha: 1
        }
    /* rgb */
    }else if( color.indexOf('rgb(') === 0 ){
      var pars = color.indexOf(',');
      values = {
        red:   parseInt(color.substr(4,pars)),
        green: parseInt(color.substr(pars+1,color.indexOf(',',pars))),
        blue:  parseInt(color.substr(color.indexOf(',',pars+1)+1,color.indexOf(')'))),
        alpha: 1
      }
    /* rgba */
    }else if( color.indexOf('rgba(') === 0 ){
      var pars = color.indexOf(','),
        repars = color.indexOf(',',pars+1);
      values = {
        red:   parseInt(color.substr(5,pars)),
        green: parseInt(color.substr(pars+1,repars)),
        blue:  parseInt(color.substr(color.indexOf(',',pars+1)+1,color.indexOf(',',repars))),
        alpha: parseFloat(color.substr(color.indexOf(',',repars+1)+1,color.indexOf(')')))
      }
    /* verbous */
    }else{
      var stdCol = { acqua:'#0ff',   teal:'#008080',   blue:'#00f',      navy:'#000080',
               yellow:'#ff0',  olive:'#808000',  lime:'#0f0',      green:'#008000',
               fuchsia:'#f0f', purple:'#800080', red:'#f00',       maroon:'#800000',
               white:'#fff',   gray:'#808080',   silver:'#c0c0c0', black:'#000' };
      if( stdCol[color]!=undefined )
        values = getColorValues(stdCol[color]);
    }
  }
  return values
}

function emitDraw(data) {
  var sessionId = socketServer.sessionid;
  socketServer.emit('drawLine', data, sessionId);
}

socketServer.on('drawLine', function(data) {
  recieveLineFromServer(data);
});







