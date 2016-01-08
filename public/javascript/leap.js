
function setUpLeapLayer() {

  console.log( 'at setUpLeapLayer');

var arCanvas = document.getElementById( 'leapcanvas' );

Leap.loop()
    .use('boneHand', {
      targetEl: document.getElementById(leap),
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
    console.log('hand found');
    document.getElementById('canvas').style.display = 'block';
  }).on('handLost', function(hand){
    console.log('hand lost');
    if (Leap.loopController.frame(0).hands.length === 0){
      document.getElementById('canvas').style.display = 'none';
    }
  });

//  document.getElementById('view-source').href = "view-source:" + window.location.href;
//  document.getElementById('view-source').target = "_blank";
}