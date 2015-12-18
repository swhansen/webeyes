var canvas     = document.getElementById( 'canvas0' );
var canvasPane = document.getElementById( 'canvaspane' );
var context    = canvas.getContext( '2d' );
var data       = {};
var points     = [];
var line       = [];
var lineArray  = [];
var fade       = false;
var fadeTimer;
var fadeSwitch = true;
var drawPixCartScale = 10;

function baseLineStyle() {
  context.lineWidth = 2;
  context.lineJoin = 'round';
  context.lineCap = 'round';
  context.shadowBlur = 2;
}

var Line = function( line, c, client ) {
  this.line = line;
  this.color = c;
  this.client = client;
};

// animate();

function drawCanvaslineArray() {

  context.clearRect( 0, 0, canvas.width, canvas.height );

  for ( var i = 0; i < lineArray.length; i++ ) {
    var points = lineArray[i].line;

    for ( var j = 0; j < points.length; j++ ) {
      context.strokeStyle = lineArray[i].line[j].color;

   //   context.shadowColor = lineArray[i].line[j].shadowColor;

      if ( j === 0 ) {
        context.beginPath();
        context.moveTo( lineArray[i].line[j].x, lineArray[i].line[j].y );
      }
      context.lineTo( lineArray[i].line[j].x, lineArray[i].line[j].y );

      baseLineStyle();
      context.stroke();
    }

// fade logic

    if ( fadeSwitch === true ) {
       lineArray[i].line.shift();
    }

// cleanup

 //   if ( lineArray[i].line.length === 0 ) {
 //     lineArray.splice( i );
 //  }

// if lineArray is empty turn off the fadder and clear array

    if ( lineArray.length === 0 ) {
      lineArray = [];
      fade = false;
      clearInterval( fadeTimer );
    }
  }
}

// toggle the interval for the fade effect

function toggleFade() {

  if ( fadeSwitch === true && fade === true  ) {
      fadeTimer = setInterval( function() { drawCanvaslineArray(); }, 100 );
    }
  if ( fade === false || fadeSwitch === false ) {
      clearInterval( fadeTimer );
    }
  }

// collect the points FROM the server and build the canvas lineArray
//   - draw the initial line in real-time to provide the live drawing effect

function receiveLineFromClient( data ) {

  switch ( data.pointerState ) {
    case 'pointerDown':
      context.beginPath();
      context.moveTo( data.x, data.y );
      context.beginPath();
      points.length = 0;
      break;
    case 'pointerMove':
      context.strokeStyle = data.color;
      context.shadowColor = data.color;
      context.lineTo( data.x, data.y );
      baseLineStyle();
      context.stroke();

  // build the array of points coming in from the channel

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
      context.beginPath();
      fade = true;
      if ( fadeSwitch === true && fade === true  ) {
      fadeTimer = setInterval( function() { drawCanvaslineArray(); }, 100 );
    }
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

//handlers for mouse events, 'emit' to the server

function toolPencil() {
  var lastx = 0;
  var lasty = 0;
  var d;
  var tool = this;
  this.started = false;

  this.mousedown = function() {
    tool.started = true;
    data.pointerState = 'pointerDown';
    emitDraw( data );
  };

  this.mousemove = function( ev ) {
    if ( tool.started ) {
      data.x = Math.round( ev._x );
      data.y = Math.round( ev._y );

   d = Math.sqrt( Math.pow( lastx - data.x, 2.0 ) + Math.pow( lasty - data.y, 2.0 ) );
    if ( d < drawPixCartScale ) {
     // data.x = lastx;
    //  data.y = lasty;
      console.log( 'Small Mouse move:', d );
      } else {
      data.pointerState = 'pointerMove';
      console.log( 'pointerMove x:', data.x );
      emitDraw( data );
      }
  }
    lastx = data.x;
    lasty = data.y;
  };

  this.mouseup = function() {
    if ( tool.started ) {

      //  tool.mousemove(ev);

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

// Handlers for touch events, 'emit' to the server

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

    d = Math.sqrt( Math.pow( lastx - data.x, 2.0 ) + Math.pow( lasty - data.y, 2.0 ) );
    if ( d < drawPixCartScale ) {
     // data.x = lastx;
    //  data.y = lasty;
      console.log( 'Small Mouse move:', d );
      } else {
      data.pointerState = 'pointerMove';
      console.log( 'x-move:', datax );
      emitDraw( data );
      }
  }

    lastx = data.x;
    lasty = data.y;

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
  canvasPane.offsetHeight = document.getElementById( 'box0' ).offsetHeight;
  canvasPane.offsetWidth = document.getElementById( 'box0' ).offsetWidth;

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

  // list the z-factors

 //$( '*' ).filter( function() {
 //  return $( this ).css( 'z-index' ) >= 10;
 //} ).each( function() {
 //  console.log( 'z-index:', $( this ), 'is:', $( this ).css( 'z-index' ) );
 //} );
}

function clearDrawCanvas() {
  context.clearRect( 0, 0, canvas.width, canvas.height );
}
