var canvasPane = document.getElementById( 'canvaspane' );
var canvas     = document.getElementById( 'canvas0' );
var context    = canvas.getContext( '2d' );
var data       = {};
var points     = [];
var line       = [];
var lineArray  = [];
var fade       = false;
var fadeTimer;
var fadeSwitch = true;
var drawPixCartScale = 25;

function baseLineStyle() {
  context.lineWidth = 5;
  context.lineJoin = 'round';
  context.lineCap = 'round';
  context.shadowBlur = 8;
}

var Line = function( line, c, client ) {
  this.line = line;
  this.color = c;
  this.client = client;
};

function drawCanvaslineArray() {

  context.clearRect( 0, 0, canvas.width, canvas.height );
  baseLineStyle();

  for ( var i = 0; i < lineArray.length; i++ ) {
    var points = lineArray[i].line;
    context.strokeStyle = lineArray[i].color;
    context.shadowColor = lineArray[i].color;

    for ( var j = 0; j < points.length; j++ ) {
      if ( j === 0 ) {
        context.beginPath();
        context.moveTo( points[j].x, points[j].y );
      }
      context.lineTo( points[j].x, points[j].y );
      context.stroke();
    }
    if ( fadeSwitch === true ) {
       lineArray[i].line.shift();
    }
  }

    if ( lineArray.length === 0 ) {
      lineArray.length = 0;
      fade = false;
      clearInterval( fadeTimer );
    }
}

function toggleFade() {
if ( fadeTimer ) {return;}
  if ( fadeSwitch === true && fade === true  ) {
      fadeTimer = setInterval( function() { drawCanvaslineArray(); }, 20 );
    }
  if ( fade === false || fadeSwitch === false ) {
      clearInterval( fadeTimer );
    }
  }

// collect the points FROM the server and build the canvas lineArray
// - draw the line when the data is recieved

function receiveLineFromClient( data ) {

  baseLineStyle();
  context.strokeStyle = data.color;
  context.shadowColor = data.color;

  switch ( data.pointerState ) {
    case 'pointerDown':
      points.length = 0;
      context.moveTo( data.x, data.y );
      context.beginPath();
      break;
    case 'pointerMove':
      context.lineTo( data.x, data.y );
      context.stroke();
      points.push( {
        x: data.x,
        y: data.y,
        color: data.color,
        client: data.client
      } );
      line.push( {
        x: data.x,
        y: data.y,
        color: data.color
      } );
      break;
    case 'pointerUp':
     context.lineTo( data.x, data.y );
     context.stroke();
      lineArray.push( new Line( line, data.color, data.client ) );
      line = [];
      points = [];

      fade = true;
      toggleFade();
      break;
    case 'hold':
    break;
    }
}

// socket.io communication


function emitDraw( data ) {
  var sessionId = socketServer.sessionid;
  socketServer.emit( 'drawLine', data, sessionId );
}

socketServer.on( 'drawLine', function( data ) {
  receiveLineFromClient( data );
} );

//mouse event handlers, 'emit' to the server

function toolPencil() {
  var lastx = 0;
  var lasty = 0;
  var d;
  var tool = this;
  this.started = false;

  this.mousedown = function( ev ) {
    tool.started = true;
    data.x = Math.round( ev._x );
    data.y = Math.round( ev._y );
    lastx = data.x;
    lasty = data.y;
    data.pointerState = 'pointerDown';
    emitDraw( data );
  };

  this.mousemove = function( ev ) {
    if ( tool.started ) {
      data.x = Math.round( ev._x );
      data.y = Math.round( ev._y );

  // only capture point if the cartesian distance exceeds the sample limit

   d = Math.sqrt( Math.pow( lastx - data.x, 2.0 ) + Math.pow( lasty - data.y, 2.0 ) );
    if ( d < drawPixCartScale ) {
        data.pointerState = 'hold';
      } else {
      lastx = data.x;
      lasty = data.y;
      data.pointerState = 'pointerMove';
      emitDraw( data );
      }
    }
  };

  this.mouseup = function( ev ) {
    if ( tool.started ) {
      data.x = Math.round( ev._x );
      data.y = Math.round( ev._y );
      data.pointerState = 'pointerUp';
      emitDraw( data );
      tool.started = false;
    }
  };
}

var tool = new toolPencil();

// The general-purpose event handler for mouse events.

function evCanvas( ev ) {

// Firefox
  if ( ev.layerX || ev.layerX === 0 ) {
    ev._x = ev.layerX;
    ev._y = ev.layerY;

// Opera
  } else if ( ev.offsetX || ev.offsetX === 0 ) {
    ev._x = ev.offsetX;
    ev._y = ev.offsetY;
  }

  var func = tool[ev.type];
  if ( func ) {
    func( ev );
  }
}

// touch event handlers, 'emit' to the server

function touchStartHandler( e ) {
  e.preventDefault();
    tool.started = true;
    data.pointerState = 'pointerDown';
    emitDraw( data );
  }

function touchMoveHandler( e ) {
  var lastx = 0;
  var lasty = 0;
  var d;
  e.preventDefault();
  if ( tool.started ) {
    var touches = e.touches.item( 0 );
    var canvasLocation = canvas.getBoundingClientRect();
    data.x = Math.round( touches.clientX - canvasLocation.left );
    data.y = Math.round( touches.clientY - canvasLocation.top );

  // only capture point if the cartesian distance exceeds the sample limit

   d = Math.sqrt( Math.pow( lastx - data.x, 2.0 ) + Math.pow( lasty - data.y, 2.0 ) );
    if ( d < drawPixCartScale ) {
        data.pointerState = 'hold';
      } else {
       lastx = data.x;
       lasty = data.y;
       data.pointerState = 'pointerMove';
       emitDraw( data );
      }
    }
  }

  function touchEndHandler( e ) {
    e.preventDefault();
    if ( tool.started ) {
      data.pointerState = 'pointerUp';
      emitDraw( data );
      tool.started = false;
    }
  }

function initDraw() {

  document.getElementById( 'canvaspane' ).className = 'canvascenter';

  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  canvasPane.style.visibility = 'visible';
  //canvasPane.offsetHeight = document.getElementById( 'box0' ).offsetHeight;
  //canvasPane.offsetWidth = document.getElementById( 'box0' ).offsetWidth;

  line.length = 0;
  lineArray.length = 0;

  canvas.addEventListener( 'mousedown', evCanvas, false );
  canvas.addEventListener( 'mousemove', evCanvas, false );
  canvas.addEventListener( 'mouseup', evCanvas, false );

  canvas.addEventListener( 'touchstart', touchStartHandler, false );
  canvas.addEventListener( 'touchmove', touchMoveHandler, false );
  canvas.addEventListener( 'touchend', touchEndHandler, false );

  baseLineStyle();

  // Turn off pointer events to the canvas

  canvas.style.pointerEvents = 'none';

}

function clearDrawCanvas() {
  context.clearRect( 0, 0, canvas.width, canvas.height );
}
