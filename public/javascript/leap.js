
function initLeap() {

  console.log( 'at setUpLeapLayer' );

  var leapFullScreen = document.getElementById( 'leapfull' );

Leap.loop()
    .use( 'boneHand', {
      targetEl: leapFullScreen,
      arm: true,
      opacity: 0.5
    } );

  // Set up scene

  var scene    = Leap.loopController.plugins.boneHand.scene;
  var camera   = Leap.loopController.plugins.boneHand.camera;
  var renderer = Leap.loopController.plugins.boneHand.renderer;

//  var plane = new THREE.Mesh(
//    new THREE.PlaneGeometry(80,80),
//    new THREE.MeshPhongMaterial({wireframe: false})
//  );
//
//
  plane.scale.set(2,2,2);
  plane.position.set(0,200,-100);

  camera.lookAt( plane.position );

//  scene.add(plane);

  var axisHelper = new THREE.AxisHelper( 100 );
  scene.add( axisHelper );

  var controls = new THREE.OrbitControls( camera, renderer.domElement );

  Leap.loopController.on( 'handFound' , function( hand ) {
    document.getElementById( 'canvas' ).style.display = 'block';
  } ).on( 'handLost', function( hand ) {
    if ( Leap.loopController.frame( 0 ).hands.length === 0 ) {
      document.getElementById( 'canvas' ).style.display = 'none';
    }
  } );

}
