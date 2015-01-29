var canvas = document.getElementById('canvas0');
var context = canvas.getContext("2d");
var data = {};
var points = [];
var line = [];
var lineArray = [];
var s = 0;

context.lineWidth = 5;

tool = new tool_pencil();

var Line = function (line, c, client){
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

  document.getElementById("canvaspane").className = "canvascenter";

  canvas.style.width ='100%';
  canvas.style.height='100%';
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  box0Height = document.getElementById("box0").offsetHeight;
  box0Width = document.getElementById("box0").offsetWidth;

  document.getElementById("canvaspane").style.visibility = "visible";
  document.getElementById("canvaspane").offsetHeight = box0Height;
  document.getElementById("canvaspane").offsetWidth = box0Width;

  document.getElementById("toolbar").style.visibility = "visible";


$( ".slider" ).slider({
  animate: true,
      range: "min",
      value: 2,
      min: 1,
      max: 10,
      step: 1,
      //this gets a live reading of the value and prints it on the page
      slide: function( event, ui ) {
          $( "#slider-result" ).html( ui.value );
      },
      //this updates the hidden form field so we can submit the data using a form
      change: function(event, ui) {
      $('#hidden').attr('value', ui.value);
      }
      });
}

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

// grab the mouse state and "emit" is TO the server

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
      context.lineTo(data.x, data.y);
      context.lineWidth = 5;
      context.stroke();
    // build the array of points coming in
      points.push({x: data.x, y: data.y, color: data.color, client: data.client});
      //arr = [data.x, data.y];
      line.push({x: data.x, y: data.y});
      break;
    case "mouseUp":
      context.lineTo(data.x, data.y);
      context.stroke();

      // add the new complete line
      lineArray.push(new Line(line, data.color, data.client));
      //zero the line fron the server
      line= [];
      context.beginPath();

 //     console.log("new line added ---------------------------");

      drawCanvaslineArray();
      break;
  }
}

function drawCanvaslineArray () {

// run through the array of lines
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < lineArray.length; i++) {

   //console.log("Line number:", i);
   //console.log("Line length:", lineArray[i].line.length);
   //console.log("Line color:", lineArray[i].color);
   //console.log("Line client:", lineArray[i].client);

    var points = lineArray[i].line;
  //  context.strokeStyle = lineArray[i].color
   // console.log("points length", points.length);

// draw the points for a line

  for (var j = 0; j < points.length; j++) {
      context.strokeStyle = lineArray[i].color;
    if(j === 0) {
      context.beginPath();
      context.moveTo(points[j].x, points[j].y);
    }
      context.lineTo(points[j].x, points[j].y);
       // console.log("point:", points[j].x, points[j].y);
       context.lineWidth = 5;
      context.stroke();
    }
//
// create the "comet tail, dripping watter, etc. effect
//
    lineArray[i].line.shift();

// modify the alpha

  foo = getColorValues(lineArray[i].color);
  bar = (foo.alpha / 1.2)
  if (bar < .02) { bar = .02};
  a = (bar) + ")";
  lineArray[i].color = lineArray[i].color.replace(/[\d\.]+\)$/g, a);

  // cleanup

  if (lineArray[i].line.length ==0) {
    lineArray.splice(i);
  }
  }
  setTimeout(drawCanvaslineArray, 1000);
}

//drawCanvaslineArray();

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

socketServer.on('drawLine', function (data) {
  recieveLineFromServer(data);
});