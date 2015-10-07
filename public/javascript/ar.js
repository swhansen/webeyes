arDeviceOrientation = {};

arObjectArray = [];

function orientationAr() {

  document.getElementById( 'cube' ).style.visibility = 'visible';
  document.getElementById( 'cube' ).style.zIndex = '99';

  if ( !window.DeviceOrientationEvent ) {
            console.log( 'no device orientation' );
     } else {
        window.addEventListener( 'deviceorientation', function( event ) {
           document.getElementById( 'cube' ).style.webkitTransform =
           document.getElementById( 'cube' ).style.transform =
                   'rotateX(' + event.beta + 'deg) ' +
                   'rotateY(' + event.gamma + 'deg) ' +
                   'rotateZ(' + event.alpha + 'deg)';
        } );
     }
   }

function emitArOrientationData() {
  window.addEventListener( 'deviceorientation', function( event ) {
  arDeviceOrientation.alpha = event.alpha;
  arDeviceOrientation.beta = event.beta;
  arDeviceOrientation.gamma = event.gamma;

  var sessionId = socketServer.sessionid;
  socketServer.emit( 'arOrientation', arDeviceOrientation, sessionId );
  } );
}

  // Load the ar Models
  //  - participantState can be focus or peer

function loadAr( participantState ) {

  var arCanvas = document.getElementById( 'arcanvaspane' );
  var ar0 = document.getElementById( 'ar-canvas' );

  document.getElementById( 'arcanvaspane' ).className = 'canvascenter';

  ar0.style.width = '100%';
  ar0.style.height = '100%';
  ar0.width = ar0.offsetWidth;
  ar0.height = ar0.offsetHeight;

  arCanvas.style.visibility = 'visible';
  arCanvas.offsetHeight = document.getElementById( 'box0' ).offsetHeight;
  arCanvas.offsetWidth = document.getElementById( 'box0' ).offsetWidth;

var CANVAS_WIDTH = ar0.innerWidth,
    CANVAS_HEIGHT = ar0.innerHeight;

var container, sensorDrivenCamera, broadcastDrivenCamera, scene, renderer;

scene = new THREE.Scene();

sensorDrivenCamera = new THREE.PerspectiveCamera( 50, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000 );
broadcastDrivenCamera = new THREE.PerspectiveCamera( 50, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000 );

// set the renderer to the AR canvas

renderer = new THREE.WebGLRenderer( { canvas: ar0, alpha: true } );
renderer.setSize( box0Width, box0Width );

renderer.setClearColor( 0x000000, 0 );

//
// Selecting an object
//

//var projector = new THREE.Projector();
//
//ar0.addEventListener('mousedown', function(event) {
//  var vector = new THREE.Vector3(
//     ar0.devicePixelRatio * (event.pageX - this.offsetLeft) / this.width * 2 - 1,
//    -ar0.devicePixelRatio * (event.pageY - this.offsetTop) / this.height * 2 + 1,
//    0
//    );
//  projector.unprojectVector(vector, camera);
//
//  var raycaster = new THREE.Raycaster(
//    camera.position,
//    vector.sub(camera.position).normalize()
//  );
//  var intersects = raycaster.intersectObjects(OBJECTS);
//  if (intersects.length) {
//    // intersects[0] describes the clicked object
//  }
//}, false);

//sphere

var radius = 0.3,
    segments = 16,
    rings = 16;

  var sphereMaterial = new THREE.MeshLambertMaterial( { color: 'blue' } );

var sphere = new THREE.Mesh( new THREE.SphereGeometry(
    radius,
    segments,
    rings ),
  sphereMaterial );

sphere.position.set( 0.5, 0.0, 0.0 );
scene.add( sphere );

var cubeGeometry = new THREE.BoxGeometry( 0.5, 0.5, 0.5 );
var sphereGeometry1 = new THREE.SphereGeometry( 0.5, 16, 16 );

material = new THREE.MeshLambertMaterial( { color: 'red' } );
material1 = new THREE.MeshLambertMaterial( { color: 0x008000 } );
material2 = new THREE.MeshPhongMaterial( { color: 'blue' } );
sphereMaterial1 = new THREE.MeshLambertMaterial( { color: 'yellow' } );
sphereMaterial2 = new THREE.MeshLambertMaterial( { color: 0x0066FF } );
orbitSphereMaterial = new THREE.MeshLambertMaterial( { color: 0xB24700 } );

var cube = new THREE.Mesh( cubeGeometry, material );
var cube1 = new THREE.Mesh( cubeGeometry, material );
var cube2 = new THREE.Mesh( cubeGeometry, material1 );
var cube3 = new THREE.Mesh( cubeGeometry, material2 );
var sphere1 = new THREE.Mesh( sphereGeometry1, sphereMaterial );
var sphere2 = new THREE.Mesh( sphereGeometry1, sphereMaterial1 );
var sphere3 = new THREE.Mesh( sphereGeometry1, sphereMaterial2 );

// red, green, blue

cube1.position.set( 0.0, 1.0, -2.0 );
cube2.position.set( 0.0, 0.5,  -4.0 );
cube3.position.set( 0.0, 0.0, -6.0 );

// z - away from vertical screen forward( negative forward)
// y - up from vertical screen
// x - R(positive)  from screen

//red cube blue ball same y

cube3.rotateY = 10.00;

cube2.name = 'cube-green';

sphere1.position.set( -2.0, 1.0, 1.0 );
sphere2.position.set( -3.0, 1.0, 1.0 );
sphere3.position.set( -6.0, 1.0, 1.0 );

scene.add( cube1 );
scene.add( cube2 );
scene.add( cube3 );
scene.add( sphere1 );
scene.add( sphere2 );
scene.add( sphere3 );

var knotGeometry = new THREE.TorusKnotGeometry( 0.2, 0.15, 100, 16 );
var knotMaterial = new THREE.MeshPhongMaterial( { color: 0xffff00 } );
var knot = new THREE.Mesh( knotGeometry, knotMaterial );
knot.position.set( 3.5, 1.0, 1.0 );
scene.add( knot );

var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
scene.add( light );

//
//   based on participantState(focus or peer)
//   use device sensors or broadcast feed

function arConnectionController( participantState ) {
console.log( 'arConnectionController:', participantState );
  if ( participantState === 'focus' ) {
      sensorDrivenCamera.lookAt( scene.position );
      connectToDeviceSensors();
    } else if ( participantState === 'peer' ) {
      connectToBroadcastSensors();
    }
  }

sensorCameraControls = new THREE.DeviceOrientationControls( sensorDrivenCamera );

broadcastCameraControls = new WEBEYES.BroadcastOrientationControls( broadcastDrivenCamera );

arObjectArray.push( cube2 );
console.log( 'arObjectArray:', arObjectArray );

arConnectionController( participantState );

function connectToDeviceSensors() {

  console.log( 'at connectToDeviceSensors' );

  sensorCameraControls.update();

  cube2.rotation.x += 0.05;
  cube2.rotation.y += 0.05;

  knot.rotation.y += 0.05;
  knot.rotation.z += 0.05;

  renderer.render( scene, sensorDrivenCamera );

  requestAnimationFrame( connectToDeviceSensors );

}

function connectToBroadcastSensors() {

  console.log( 'at connectBroadcastSensors' );

  broadcastCameraControls.update();

  cube2.rotation.x += 0.05;
  cube2.rotation.y += 0.05;

  knot.rotation.y += 0.05;
  knot.rotation.z += 0.05;

  renderer.render( scene, broadcastDrivenCamera );

  requestAnimationFrame( connectToBroadcastSensors );
  }
}
