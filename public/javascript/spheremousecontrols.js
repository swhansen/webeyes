
WEBEYES.SphereMouseControls = function( object ) {

  var scope = this;
  var PI_2 = Math.PI / 2;
  var mouseQuat = {
    x: new THREE.Quaternion(),
    y: new THREE.Quaternion()
  };

  //this.object = object;
  var xVector = new THREE.Vector3( 1, 0, 0 );
  var yVector = new THREE.Vector3( 0, 1, 0 );

  var mouseDown = false;

  var onMouseDown = function( event ) {

    if ( scope.enabled === false ) { return; }

        mouseDown = true;
    };

  var onMouseMove = function( event ) {

    if ( scope.enabled === false ) { return; }

    if ( mouseDown ) {

      var orientation = scope.orientation;

      var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
      var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

      orientation.x += movementY * 0.005;
      orientation.y += movementX * 0.005;
      orientation.x = Math.max( -PI_2, Math.min( PI_2, orientation.x ) );

// emit movement to peers

      var sessionId = socketServer.sessionid;
      orientation.sessionId = userContext.sessionId;
      socketServer.emit( 'vrOrientation', orientation, sessionId );
    }
  };

  var onMouseUp = function( event ) {
      mouseDown = false;
    };

  this.enabled = true;

  this.orientation = {
    x: 0,
    y: 0
  };

  this.update = function() {

    if ( this.enabled === false ) { return; }

    mouseQuat.x.setFromAxisAngle( xVector, this.orientation.x );
    mouseQuat.y.setFromAxisAngle( yVector, this.orientation.y );
    object.quaternion.copy( mouseQuat.y ).multiply( mouseQuat.x );
    return;
  };

  this.connect = function() {

    var sphereCanvas = document.getElementById( 'spherecanvas' );
    var spherepane = document.getElementById( 'spherepane' );

    sphereCanvas.addEventListener( 'mousedown', onMouseDown, false );
    sphereCanvas.addEventListener( 'mousemove', onMouseMove, false );
    sphereCanvas.addEventListener( 'mouseup', onMouseUp, false );
    sphereCanvas.addEventListener( 'touchstart', onMouseDown, false );
    sphereCanvas.addEventListener( 'touchmove', onMouseMove, false );
    sphereCanvas.addEventListener( 'touchend', onMouseUp, false );
};

this.disconnect = function() {

    var sphereCanvas = document.getElementById( 'spherecanvaspane' );
    var ar0 = document.getElementById( 'spherecanvas' );
    if ( arCanvas.removeEventListener ) {
    sphereCanvas.removeEventListener( 'mousemove', onMouseMove );
    sphereCanvas.removeEventListener( 'mouseup', onMouseUp );
    sphereCanvas.removeEventListener( 'mousedown', onMouseDown );
  }
};
};
