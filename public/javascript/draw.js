
canvas = document.getElementById('canvas0');
context = canvas.getContext("2d");

tool = new tool_pencil();

canvas.addEventListener('mousedown', ev_canvas, false);
canvas.addEventListener('mousemove', ev_canvas, false);
canvas.addEventListener('mouseup',   ev_canvas, false);

function tool_pencil () {

    var tool = this;
    context.lineWidth = 1;
    this.started = false;
    context.strokeStyle = "red";

    this.mousedown = function (ev) {
            context.beginPath();
            context.moveTo(ev._x , ev._y );
            tool.started = true;
    };

    this.mousemove = function (ev) {
        if (tool.started) {

        var data = { x: ev._x, y: ev._y};

        drawline(data);

        // emit the draw events
        //    socketServer.emit( "canvasDraw", data )
        emitDraw(data);
            }
    };

    // This is called when you release the mouse button
    this.mouseup = function (ev) {
        if (tool.started) {
            tool.mousemove(ev);
            tool.started = false;
        }
    };
}

// The general-purpose event handler. This function just determines
// the mouse position relative to the <canvas> element
    function ev_canvas(ev) {
        // Firefox
        if (ev.layerX || ev.layerX == 0) {
            ev._x = ev.layerX;
            ev._y = ev.layerY;
            // Opera
        } else if (ev.offsetX || ev.offsetX == 0) {
            ev._x = ev.offsetX;
            ev._y = ev.offsetY;
        }
        // Call the event handler of the tool (tool_pencil)
        var func = tool[ev.type];
        if (func) {
            func(ev);
        }
    }

function drawline (data) {
    context.lineTo(data.x,  data.y);
    context.stroke();
 }

function emitDraw(data) {

    var sessionId = socketServer.sessionid;

    // send a 'drawLine event with data and sessionId to the server
    socketServer.emit( 'drawLine', data, sessionId);
    console.log( data );
 }

socketServer.on( 'drawLine', function( data ) {
  console.log( 'drawLine event recieved:', data );
  // Draw the line using the data recieved
  drawline( data);
});
