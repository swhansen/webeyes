
WEBEYES.MouseControls = function( object ) {

  var scope = this;
  var PI_2 = Math.PI / 2;
  var mouseQuat = {
    x: new THREE.Quaternion(),
    y: new THREE.Quaternion()
  };

  //this.object = object;
  var xVector = new THREE.Vector3( 1, 0, 0 );
  var yVector = new THREE.Vector3( 0, 1, 0 );

 object.rotation.reorder( 'YXZ' );

var setObjectQuaternion = function () {

    var zee = new THREE.Vector3( 0, 0, 1 );

    var euler = new THREE.Euler();

    var q0 = new THREE.Quaternion();

    var q1 = new THREE.Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) ); // - PI/2 around the x-axis

    return function ( quaternion, alpha, beta, gamma ) {

      euler.set( beta, alpha, - gamma, 'YXZ' );                       // 'ZXY' for the device, but 'YXZ' for us

      quaternion.setFromEuler( euler );                               // orient the device

      quaternion.multiply( q1 );                                      // camera looks out the back of the device, not the top

    //  quaternion.multiply( q0.setFromAxisAngle( zee, - orient ) );    // adjust for screen orientation

    };

  }();


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

      orientation.y += movementX * 0.1;
      orientation.x += movementY * 0.1;
    //  orientation.y = Math.max( -PI_2, Math.min( PI_2, orientation.x ) );
      orientation.z = 0.0;

     // console.log( 'orientation', orientation.x, orientation.y );

// emit movement

      var sessionId = socketServer.sessionid;
        socketServer.emit( 'vrMouseMovement', orientation, sessionId );
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

this.update = function () {

    if ( scope.enabled === false ) return;

    var alpha = scope.orientation.y ? THREE.Math.degToRad( scope.orientation.y ) : 0; // Z
    var beta  = scope.orientation.x  ? THREE.Math.degToRad( scope.orientation.x  ) : 0; // X'
    var gamma = scope.orientation.z ? THREE.Math.degToRad( scope.orientation.z ) : 0; // Y''
    //var orient = scope.screenOrientation       ? THREE.Math.degToRad( scope.screenOrientation       ) : 0; // O

    setObjectQuaternion( object.quaternion, alpha, beta, gamma );

  };

// this.update = function() {

//   if ( this.enabled === false ) { return; }

//   mouseQuat.x.setFromAxisAngle( xVector, this.orientation.x );
//   mouseQuat.y.setFromAxisAngle( yVector, this.orientation.y );
//   object.quaternion.copy( mouseQuat.y ).multiply( mouseQuat.x );
//  //console.log( 'vrControls:', this.orientation.x, this.orientation.y );
//   return;
// };

  document.addEventListener( 'mousemove', onMouseMove, false );
  document.addEventListener( 'mouseup', onMouseUp, false );
  document.addEventListener( 'mousedown', onMouseDown, false );
};
