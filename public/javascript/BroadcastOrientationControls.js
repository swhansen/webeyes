/**
 *
 * Utility to "neck" a camera based on broadcast
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

var WEBEYES = {};

WEBEYES.BroadcastOrientationControls = function ( object ) {

  var scope = this;

  this.object = object;
  this.object.rotation.reorder( "YXZ" );

  this.enabled = true;

  this.deviceOrientation = {};
  this.screenOrientation = 0;

  var onDeviceOrientationChangeEvent = function ( event ) {

    scope.deviceOrientation = event;

  };

  var onScreenOrientationChangeEvent = function () {

    scope.screenOrientation = window.orientation || 0;

  };

  // The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

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

    }

  }();

  this.connect = function() {

    onScreenOrientationChangeEvent(); // run once on load

    socketServer.on( 'arOrientation', function( arBroadcastData ) {
      scope.deviceOrientation = arBroadcastData;
      //console.log( 'broadcastOrientationContorls:', arBroadcastData );
})
    scope.enabled = true;

  };

  this.disconnect = function() {

    window.removeEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
    window.removeEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

    scope.enabled = false;

  };

  this.update = function () {

    if ( scope.enabled === false ) return;

    var alpha = scope.deviceOrientation.alpha ? THREE.Math.degToRad( scope.deviceOrientation.alpha ) : 0; // Z
    var beta  = scope.deviceOrientation.beta  ? THREE.Math.degToRad( scope.deviceOrientation.beta  ) : 0; // X'
    var gamma = scope.deviceOrientation.gamma ? THREE.Math.degToRad( scope.deviceOrientation.gamma ) : 0; // Y''
    //var orient = scope.screenOrientation       ? THREE.Math.degToRad( scope.screenOrientation       ) : 0; // O

    setObjectQuaternion( scope.object.quaternion, alpha, beta, gamma );

  };

  this.connect();

};
