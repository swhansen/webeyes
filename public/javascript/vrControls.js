/**
 * @author dmarcos / http://github.com/dmarcos
 *
 * This controls allow to change the orientation of the camera using the mouse
 */

WEBEYES.MouseControls = function ( object ) {

  var scope = this;
  var PI_2 = Math.PI / 2;
  var mouseQuat = {
    x: new THREE.Quaternion(),
    y: new THREE.Quaternion()
  };
  var object = object;
  var moveState = false;
  var xVector = new THREE.Vector3( 1, 0, 0 );
  var yVector = new THREE.Vector3( 0, 1, 0 );

  var mouseDown = false;


  var onMouseDown = function( event ) {

    mouseDown = true;

    if ( scope.enabled === false ) return;

    var orientation = scope.orientation;
    var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
    orientation.y += movementX * 0.005;
    orientation.x += movementY * 0.005;
    orientation.x = Math.max( - PI_2, Math.min( PI_2, orientation.x ) );

    document.addEventListener( 'mousemove', onMouseMove, false );
    document.addEventListener( 'mouseup', onMouseUp, false );
  };

  var onMouseMove = function( event ) {



    if ( scope.enabled === false ) return;

    if ( mouseDown === true ) {

    var orientation = scope.orientation;
    var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
    orientation.y += movementX * 0.005;
    orientation.x += movementY * 0.005;
    orientation.x = Math.max( - PI_2, Math.min( PI_2, orientation.x ) );
    console.log( 'vrC-down:', orientation.x, orientation.y );
  }
};

var onMouseUp = function( event ) {

  if ( mouseDown === true ) {

    document.removeEventListener( 'mousemove', onMouseMove, false );
    document.removeEventListener( 'mouseup', onMouseUp, false );
    scope.dispatchEvent( endEvent );
    mouseDown = false;
  }
};


  this.enabled = true;

  this.orientation = {
    x: 0,
    y: 0
  };

  this.update = function() {

    if ( this.enabled === false ) return;

    mouseQuat.x.setFromAxisAngle( xVector, this.orientation.x );
    mouseQuat.y.setFromAxisAngle( yVector, this.orientation.y );
    object.quaternion.copy( mouseQuat.y ).multiply( mouseQuat.x );
    return;

  };

  document.addEventListener( 'mousedown', onMouseDown, false );

};
