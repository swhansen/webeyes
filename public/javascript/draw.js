var canvas     = document.getElementById( 'canvas0' );
var context    = canvas.getContext( '2d' );
var data       = {};
var points     = [];
var line       = [];
var lineArray  = [];
var fade       = false;
var fadeTimer;
var fadeSwitch = true;

function baseLineStyle() {
  context.lineWidth = 2;
  context.lineJoin = 'round';
  context.lineCap = 'round';
  context.shadowBlur = 2;
}

var tool = new toolPencil();

var Line = function( line, c, client ) {
  this.line = line;
  this.color = c;
  this.client = client;
};

function initDraw() {

  line.length = 0;
  lineArray.length = 0;

  canvas.addEventListener( 'mousedown', evCanvas, false );
  canvas.addEventListener( 'mousemove', evCanvas, false );
  canvas.addEventListener( 'mouseup', evCanvas, false );

  canvas.addEventListener( 'touchstart', touchStartHandler, false );
  canvas.addEventListener( 'touchmove', touchMoveHandler, false );
  canvas.addEventListener( 'touchend', touchEndHandler, false );

  document.getElementById( 'canvaspane' ).className = 'canvascenter';

  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  var box0Height = document.getElementById( 'box0' ).offsetHeight;
  var box0Width = document.getElementById( 'box0' ).offsetWidth;

  document.getElementById( 'canvaspane' ).style.visibility = 'visible';
  document.getElementById( 'canvaspane' ).offsetHeight = box0Height;
  document.getElementById( 'canvaspane' ).offsetWidth = box0Width;

  baseLineStyle();
  //drawUI()

  // list the z-factors

 //$( '*' ).filter( function() {
 //  return $( this ).css( 'z-index' ) >= 10;
 //} ).each( function() {
 //  console.log( 'z-index:', $( this ), 'is:', $( this ).css( 'z-index' ) );
 //} );
}

function clearDrawCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

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

  // Call the event handler of the tool (tool_pencil)
  var func = tool[ev.type];
  if ( func ) {

    //console.log('at func:', ev._x, ev._y);
    //console.log('at func:', func);
    func( ev );
  }
}

// Handlers fot touch events

function touchStartHandler( e ) {
  e.preventDefault();
    tool.started = true;
    data.pointerState = 'pointerDown';
    console.log( 'touchstart:', data );
    emitDraw( data );
  }

function touchMoveHandler( e ) {
  e.preventDefault();
  if ( tool.started ) {
    var touches = e.touches.item( 0 );
    var canvasLocation = canvas.getBoundingClientRect();
    data.x = Math.round( touches.clientX - canvasLocation.left );
    data.y = Math.round( touches.clientY - canvasLocation.top );
    data.pointerState = 'pointerMove';
    emitDraw( data );
  }
}

  function touchEndHandler( e ) {
    e.preventDefault();
    if ( tool.started ) {
      data.pointerState = 'pointerUp';

     // console.log('touchend:', data)
      emitDraw( data );
      tool.started = false;
    }
  }

// grab the mouse state and 'emit' to the server

function toolPencil() {
  var tool = this;
  this.started = false;

  this.mousedown = function() {

    //context.beginPath();
    // context.moveTo(ev._x, ev._y);
    tool.started = true;
    data.pointerState = 'pointerDown';
    emitDraw( data );
  };

  this.mousemove = function( ev ) {
    if ( tool.started ) {
      data.x = Math.round( ev._x );
      data.y = Math.round( ev._y );
      data.pointerState = 'pointerMove';
      emitDraw( data );
    }
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

//
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

      // add the new complete line
      line.reverse;
      lineArray.push( new Line( line, data.color, data.client ) );
      line = [];
      context.beginPath();
      drawCanvaslineArray();
      break;
  }
}

// Rendering and fading of the line arrays

function drawCanvaslineArray() {

  if ( data === false ) {
    data = true;
    toggleFade();
  }
  context.clearRect( 0, 0, canvas.width, canvas.height );
  for ( var i = 0; i < lineArray.length; i++ ) {var points = lineArray[i].line;
    points.slice( 10, points.length );

    // draw the points for a line
    for ( var j = 0; j < points.length; j++ ) {
      context.strokeStyle = lineArray[i].line[j].color;
      context.shadowColor = lineArray[i].line[j].shadowColor;
      if ( j === 0 ) {
        context.beginPath();
        context.moveTo( lineArray[i].line[j].x, lineArray[i].line[j].y );
      }
      context.lineTo( lineArray[i].line[j].x, lineArray[i].line[j].y );

      //console.log('point:',  j, points[j].x, points[j].y);
      baseLineStyle();
      context.stroke();
    }

    if ( fadeSwitch === true ) {

      console.log('at fadeSwitch:', fadeSwitch);

      // create the fade 'comet tail, dripping water, etc.'

      //  var tail = [];
      //  tail = lineArray[i].line.slice(0, 5);

      //  tail.reverse;

      lineArray[i].line.shift( 10 );

      //
      //  var l = lineArray[i].line.length;

      //  for (var k = 0; k < l; k++) {
      //
      // console.log('tail', tail);
      //
      //for (var p = 0; p < tail.length; p++) {
      //
      //      //foo = getColorValues(tail[p].color);
      //      //
      //      //console.log(foo);
      //      //
      //      //var r = f//oo.red;
      //      //var g = f//oo.green;
      //      //var b = f//oo.blue;
      //      //var alpha// = foo.alpha;
      //      //
      //      //bar = foo.blue - 10;
      //      //// baz = foo.red - 10;
      //      //
      //      //tail[p].color = 'rgba(' + r + ', ' + g + ', ' + b +' , ' + alpha + ' )';
      //
      //      //a = (bar) + ')';
      //      //tail[p].color = lineArray[i].color.replace(/[\d\.]+\)$/g, a);

      //      //context.strokeStyle = tail[p].color;
      //      //if (p === 0) {
      //      //  context.beginPath();
      //      //  context.moveTo(tail[p].x, tail[p].y);
      //      //}
      //      //context.lineTo(tail[p].x, tail[p].y);
      //      //console.log('point:',  j, points[j].x, points[j].y);
      //      baseLineStyle();
      //      // context.shadowColor = lineArray[i].color;
      //
      context.stroke();

      //    }
      //  }
    }

    // cleanup

    if ( lineArray[i].line.length === 0 ) {
      lineArray.splice( i );
    }

    // if the lineArray is empty turn off the fadder
    if ( lineArray.length === 0 ) {
      fade = false;
      toggleFade();
    }
  }
}

// toggle the interval for the fade effect

function toggleFade() {

  if ( fadeSwitch === true ) {
    if ( fade === true ) {

      //fade == true;
      console.log('at toggleFade - fadeSwitch:', fadeSwitch, 'fade:', fade  );
      fadeTimer = setInterval( drawCanvaslineArray, 100 );
    } else {
      fade = false;
      clearInterval( fadeTimer );
    }
  }
  if ( fadeSwitch === false ) {

    //fade == false;
    clearInterval( fadeTimer );
  }
}

function emitDraw( data ) {
  var sessionId = socketServer.sessionid;
  socketServer.emit( 'drawLine', data, sessionId );
}

socketServer.on( 'drawLine', function( data ) {
  receiveLineFromClient( data );
} );
