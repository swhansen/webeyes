/**
 *
 * Utility to "neck" a camera based on broadcast of mose based VR control
 * orientation data(alpha, beta, gamma) from a peer device over socket.io
 *
 *    --swh 9/27/15
 *
 * Based on
 * @author richt / http://richt.me
 * @author WestLangley / http://github.com/WestLangley
 *
 * W3C Device Orientation control (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
 */


WEBEYES.BroadcastVrControls = function( object ) {

  var scope = this;
  var PI_2 = Math.PI / 2;
  var mouseQuat = {
    x: new THREE.Quaternion(),
    y: new THREE.Quaternion()
  };

  this.object = object;
  var xVector = new THREE.Vector3( 1, 0, 0 );
  var yVector = new THREE.Vector3( 0, 1, 0 );

var orientation = scope.orientation;

  this.connect = function() {

 //   onScreenOrientationChangeEvent(); // run once on load

    socketServer.on( 'vrOrientation', function( vrBroadcastData ) {
      scope.orientation = vrBroadcastData;
      console.log( 'vr orientation broadcast recieve:', scope.orientation );

} );
    scope.enabled = true;

  };

  this.disconnect = function() {

    window.removeEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
    window.removeEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

    scope.enabled = false;

  };

  this.update = function() {

    if ( this.enabled === false ) { return; }

    mouseQuat.x.setFromAxisAngle( xVector, scope.orientation.x );
    mouseQuat.y.setFromAxisAngle( yVector, scope.orientation.y );
    object.quaternion.copy( mouseQuat.y ).multiply( mouseQuat.x );
    return;
  };

  this.connect();

};
