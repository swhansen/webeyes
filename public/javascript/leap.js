
function setUpLeapLayer() {

  var leapCanvas = document.getElementById( 'leapcanvaspane' );
  var l0 = document.getElementById( 'leap-canvas' );
  var mouseVector;

  document.getElementById( 'leapcanvaspane' ).className = 'canvascenter';

  l0.style.width = '100%';
  l0.style.height = '100%';
  l0.width = ar0.offsetWidth;
  l0.height = ar0.offsetHeight;

  leapCanvas.style.visibility = 'visible';


Leap.loop()
    .use('boneHand', {
      targetEl: document.body,
      arm: true,
      opacity: 0.5
    } );

  // Set up scene

  var scene    = Leap.loopController.plugins.boneHand.scene;
  var camera   = Leap.loopController.plugins.boneHand.camera;
  var renderer = Leap.loopController.plugins.boneHand.renderer;

  var plane = new THREE.Mesh(
    new THREE.PlaneGeometry(80,80),
    new THREE.MeshPhongMaterial({wireframe: false})
  );


  plane.scale.set(2,2,2);
  plane.position.set(0,200,-100);

  camera.lookAt( plane.position );

//  scene.add(plane);

  var axisHelper = new THREE.AxisHelper( 100 );
  scene.add( axisHelper );

  var controls = new THREE.OrbitControls( camera, renderer.domElement );


  Leap.loopController.on('handFound', function(hand) {
    document.querySelector('l0').style.display = 'block';
  }).on('handLost', function(hand){
    if (Leap.loopController.frame(0).hands.length === 0){
      document.querySelector('lo').style.display = 'none';
    }
  });

}