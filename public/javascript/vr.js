var arDeviceOrientation = {};
var arSelectObjectArray = [];
var isAnimateKnot = false;
var isAnimateSheep = false;
var isAnimateSwordGuy = false;
var selectedArObject;
var clock = new THREE.Clock();
var sheep;
var flyingPig;
var pigModel;
var pivotPoint;
var lamp;
var arUserCreatedObject;
var mixer;

var arContainer, sensorDrivenCamera, broadcastDrivenCamera, scene, renderer;
  var orbitCameraControls, orbitDrivenCamera, controls, camera;
  var knot;

//
// ----------  Main Loader  --------------------------
//

function loadVr( participantState ) {

  //clock.start();
  setUpArLayer( participantState );
  animate();
 // setupArInteractionEvents( participantState );
   }

function setUpArLayer( participantState ) {

  var step = 0;

  var arCanvas = document.getElementById( 'arcanvaspane' );
  var ar0 = document.getElementById( 'arcanvas' );
  var mouseVector;

  document.getElementById( 'arcanvaspane' ).className = 'canvascenter';

  ar0.style.width = '100%';
  ar0.style.height = '100%';
  ar0.width = ar0.offsetWidth;
  ar0.height = ar0.offsetHeight;

  arCanvas.style.visibility = 'visible';
  ar0.style.visibility = 'visible';

  arcanvas.style.zIndex = 30;

  //arCanvas.offsetHeight = document.getElementById( 'box0' ).offsetHeight;
  //arCanvas.offsetWidth = document.getElementById( 'box0' ).offsetWidth;

  var CANVAS_WIDTH = 300,
      CANVAS_HEIGHT = 300;

  scene = new THREE.Scene();

 // sensorDrivenCamera = new THREE.PerspectiveCamera( 50, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000 );
 // broadcastDrivenCamera = new THREE.PerspectiveCamera( 50, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000 );
  camera = new THREE.PerspectiveCamera( 50, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000 );

  camera.position.set( 1, 1, 1 );

  renderer = new THREE.WebGLRenderer( { canvas: arcanvas, alpha: true } );
  renderer.setSize( box0Width, box0Width );
  renderer.setClearColor( 0x000000, 0 );

  controls = new THREE.OrbitControls( camera, renderer.domElement );

  controls.maxDistance = 5000;
  //controls.addEventListener( 'change', render );




  var geometryCube1 = new THREE.BoxGeometry( 0.5, 0.5, 0.5, 2, 2, 2 );
  var geometryCube2 = new THREE.BoxGeometry( 0.8, 0.8, 0.8 );
  var geometrySphere = new THREE.SphereGeometry( 0.15, 16, 16 );
  var geometryKnot = new THREE.TorusKnotGeometry( 0.3, 0.3, 100, 16 );

  var material1 = new THREE.MeshLambertMaterial( { color: 0xff0000 } );
  var material2 = new THREE.MeshPhongMaterial( { color: 'blue' } );
  var material3 = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
  var materialO = new THREE.MeshLambertMaterial( { color: 'red' } );
  var materialKnot = new THREE.MeshPhongMaterial( { color: 0xffff00 } );

  var cube1 = new THREE.Mesh( geometryCube1, material1 );
  var cube2 = new THREE.Mesh( geometryCube2, material2 );
  var sphere = new THREE.Mesh( geometrySphere, material3 );
  var knot = new THREE.Mesh( geometryKnot, materialKnot );
  knot.userData.isSelectable = true;

  sphereN = new THREE.Mesh( geometrySphere, materialO );
  sphereS = new THREE.Mesh( geometrySphere, materialO );
  sphereE = new THREE.Mesh( geometrySphere, materialO );
  sphereW = new THREE.Mesh( geometrySphere, materialO );
  sphereU = new THREE.Mesh( geometrySphere, materialO );
  sphereD = new THREE.Mesh( geometrySphere, materialO );

  sphereN.position.set( 0.0, 0.0, 6.0 );
  sphereS.position.set( 0.0, 0.0, -6.0 );
  sphereE.position.set( 6.0, 0.0, 0.0 );
  sphereW.position.set( -6.0, 0.0, 0.0 );
  sphereU.position.set( 0.0, 6.0, 0.0 );
  sphereD.position.set( 0.0, -6.0, 0.0 );

  scene.add( sphereN );
  scene.add( sphereS );
  scene.add( sphereE );
  scene.add( sphereW );
  scene.add( sphereU );
  scene.add( sphereD );

  lampSphere = new THREE.Mesh( geometrySphere, materialO );
  lampSphere.position.set( -19.0, 16.0, 8.0 );
  scene.add( lampSphere );

  cube1.position.set( 0.0, 0.0,  -4.0 );
  cube2.position.set( -2.0, 0.0, -6.0 );
  sphere.position.set( 1.2, -0.2, -4.0 );
  knot.position.set( 0.5, 0.22, -5.0 );

  cube2.rotateZ = 10.00;

  var loader = new THREE.JSONLoader();

  loader.load( '../armodels/sheep3.json', function( model ) {
    var material = new THREE.MeshPhongMaterial( { color: 0xFF69B4 } );

    sheep = new THREE.Mesh( model, material );
    sheep.scale.set( 0.1, 0.1, 0.1 );
    sheep.position.set( -2.0, -0.4, 0.0 );
    sheep.rotation.x = Math.PI / 2;
    sheep.rotation.y = ( Math.PI / 2 ) * 0.5;
    sheep.rotation.z = ( Math.PI / 2 ) * 0.3;
    sheep.name = 'sheep';
    sheep.userData.isSelectable = true;
    scene.add( sheep );
    arSelectObjectArray.push( sheep );

    flyingPig = new THREE.Mesh( model, material );
    flyingPig.scale.set( 0.1, 0.1, 0.1 );
    flyingPig.position.set( 0.9, 0.9, 0.9 );
    flyingPig.rotation.x = Math.PI / 2;
    flyingPig.rotation.y = ( Math.PI / 2 ) * 0.5;
    flyingPig.rotation.z = ( Math.PI / 2 ) * 0.3;
    flyingPig.name = 'flyingPig';
    scene.add( flyingPig );

// note: position of child(flyingPig) is relative to pivotPoint

   pivotPoint = new THREE.Object3D();
   pivotPoint.position.set( -6.75, 4.0, 2.0 );
   scene.add( pivotPoint );
   pivotPoint.add( flyingPig );

  } );

  loader.load( '../armodels/lamp2.json', function( model ) {
    var material = new THREE.MeshPhongMaterial( { color: 0xFF69B4 } );

    lamp = new THREE.Mesh( model, material );
    lamp.scale.set( 4.0, 4.0, 4.0 );
    lamp.position.set( -6.75, 4.0, 2.0 );

    //lamp.rotation.x = Math.PI / 2;
    //lamp.rotation.y = ( Math.PI / 2 ) * 0.5;
    //lamp.rotation.z = ( Math.PI / 2 ) * 0.3;

    lamp.name = 'lamp';
    scene.add( lamp );
    } );

// Sword guy

  loader.load( '../armodels/knight.js', function( geometry, materials ) {
          createSwordGuy( geometry, materials, 0, -15.0, 65.0, 3.0 );
        } );

  function createSwordGuy( geometry, materials, x, y, z, s ) {
        geometry.computeBoundingBox();
        var bb = geometry.boundingBox;
        for ( var i = 0; i < materials.length; i++ ) {
          var m = materials[ i ];
          m.skinning = true;
          m.morphTargets = true;
          m.specular.setHSL( 0, 0, 0.1 );
          m.color.setHSL( 0.6, 0, 0.6 );
        }
        swordGuyMesh = new THREE.SkinnedMesh( geometry, new THREE.MeshFaceMaterial( materials ) );
        swordGuyMesh.position.set( x, y - bb.min.y * s, z );
        swordGuyMesh.scale.set( s, s, s );
        swordGuyMesh.rotation.y =  -Math.PI;
        swordGuyMesh.name = 'swordGuy';

        swordGuyMesh.userData.objectType =  'swordGuyMesh';
        swordGuyMesh.userData.isAnimated = false;
        swordGuyMesh.userData.isUserCreated = false;
        swordGuyMesh.userData.isSelectable = true;
        swordGuyMesh.userData.createdBy = 'system';

        scene.add( swordGuyMesh );

     //   swordGuyMesh.castShadow = true;
     //   swordGuyMesh.receiveShadow = true;

        helper = new THREE.SkeletonHelper( swordGuyMesh );
        helper.material.linewidth = 3;
        helper.visible = false;
        scene.add( helper );

        var clipMorpher = THREE.AnimationClip.CreateFromMorphTargetSequence( 'facialExpressions', swordGuyMesh.geometry.morphTargets, 3 );
        var clipBones = geometry.animations[0];

        mixer = new THREE.AnimationMixer( swordGuyMesh );
        mixer.addAction( new THREE.AnimationAction( clipMorpher ) );
        mixer.addAction( new THREE.AnimationAction( clipBones ) );

        arSelectObjectArray.push( swordGuyMesh );
      }

// hue light control objects

  var hueGeometrySphere = new THREE.SphereGeometry( 0.3, 16, 16 );

  hueLightmaterial1 = new THREE.MeshPhongMaterial ( {
    color: 0xff00ff,
    shininess: 66,
    opacity:0.5,
    transparent: true
} );

  hueLightmaterial2 = new THREE.MeshPhongMaterial ( {
    color: 0xff00ff,
    shininess: 66,
    opacity:0.5,
    transparent: true
} );

  hueLightmaterial3 = new THREE.MeshPhongMaterial ( {
    color: 0xff00ff,
    shininess: 66,
    opacity:0.5,
    transparent: true
} );

  hueLight1 = new THREE.Mesh( hueGeometrySphere, hueLightmaterial1 );
  hueLight2 = new THREE.Mesh( hueGeometrySphere, hueLightmaterial2 );
  hueLight3 = new THREE.Mesh( hueGeometrySphere, hueLightmaterial3 );

  hueLight1.position.set( -0.809, -0.737, -5.227 );
  hueLight2.position.set( 1.077, 1.606, -5.17 );
  hueLight3.position.set( -2.785, 1.606, -5.17 );

  hueLight1.userData.isSelectable = true;
  hueLight2.userData.isSelectable = true;
  hueLight3.userData.isSelectable = true;

  hueLight1.name = 'hueLight1';
  hueLight2.name = 'hueLight2';
  hueLight3.name = 'hueLight3';

  hueLight1.userData.isIot = true;
  hueLight2.userData.isIot = true;
  hueLight3.userData.isIot = true;

  hueLight1.userData.iotDeviceId = 1;
  hueLight2.userData.iotDeviceId = 2;
  hueLight3.userData.iotDeviceId = 3;

  hueLight1.userData.isOn = false;
  hueLight2.userData.isOn = false;
  hueLight3.userData.isOn = false;

  scene.add( hueLight1 );
  scene.add( hueLight2 );
  scene.add( hueLight3 );

  arSelectObjectArray.push( hueLight1 );
  arSelectObjectArray.push( hueLight2 );
  arSelectObjectArray.push( hueLight3 );

// end hue light objects

  scene.add( cube2 );
  scene.add( sphere );
  scene.add( knot );

  cube1.name = 'cube1';
  cube2.name = 'cube2';
  knot.name = 'knot';

  var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
  scene.add( light );

  arSelectObjectArray.push( cube2 );
  arSelectObjectArray.push( knot );
animate();

}

function animate() {
        requestAnimationFrame( animate );
       controls.update(); // required if controls.enableDamping = true, or if controls.autoRotate = true
       // stats.update();
        render();
      }

function render() {
  renderer.render( scene, camera );
}
