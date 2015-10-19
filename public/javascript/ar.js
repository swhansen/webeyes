var arDeviceOrientation = {};
var arObjectArray = [];
var animateCube;
var intersects;
var selectedArObject;

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

//
// ----------  Main Loader  --------------------------
//

function loadAr( participantState ) {

  var arContainer, sensorDrivenCamera, broadcastDrivenCamera, scene, renderer;
  var knot;

    setUpArLayer( participantState );

    setupArInteractionEvents( participantState );

   }

  function receiveArObject( data ) {

      console.log( 'receiveArObject got arObjectData:', data );

   var arObject = scene.getObjectByName( data.name );
       arObject.position.x = data.position.x;
       arObject.position.y = data.position.y;
       arObject.position.z = data.position.z;

       //arObject.position = data.position;

       arObject.material.color = data.color;
   }

function setUpArLayer( participantState ) {

  var step = 0;

  var arCanvas = document.getElementById( 'arcanvaspane' );
  var ar0 = document.getElementById( 'ar-canvas' );
  var mouseVector;

  document.getElementById( 'arcanvaspane' ).className = 'canvascenter';

  ar0.style.width = '100%';
  ar0.style.height = '100%';

  ar0.width = ar0.offsetWidth;
  ar0.height = ar0.offsetHeight;

  arCanvas.style.visibility = 'visible';
  arCanvas.offsetHeight = document.getElementById( 'box0' ).offsetHeight;
  arCanvas.offsetWidth = document.getElementById( 'box0' ).offsetWidth;

var CANVAS_WIDTH = 300,
    CANVAS_HEIGHT = 300;

scene = new THREE.Scene();

sensorDrivenCamera = new THREE.PerspectiveCamera( 50, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000 );
broadcastDrivenCamera = new THREE.PerspectiveCamera( 50, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000 );

// set the renderer to the AR canvas

renderer = new THREE.WebGLRenderer( { canvas: ar0, alpha: true } );
renderer.setSize( box0Width, box0Width );

renderer.setClearColor( 0x000000, 0 );

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
var cube3Geometry = new THREE.BoxGeometry( 0.8, 0.8, 0.8 );
var sphereGeometry1 = new THREE.SphereGeometry( 0.15, 16, 16 );

material = new THREE.MeshLambertMaterial( { color: 'red' } );
material1 = new THREE.MeshLambertMaterial( { color: 0x008000 } );
material2 = new THREE.MeshPhongMaterial( { color: 'blue' } );
sphereMaterial1 = new THREE.MeshLambertMaterial( { color: 'yellow' } );
sphereMaterial2 = new THREE.MeshLambertMaterial( { color: 0x0066FF } );
orbitSphereMaterial = new THREE.MeshLambertMaterial( { color: 0xB24700 } );

var cube = new THREE.Mesh( cubeGeometry, material );
var cube1 = new THREE.Mesh( cubeGeometry, material );
var cube2 = new THREE.Mesh( cubeGeometry, material1 );
var cube3 = new THREE.Mesh( cube3Geometry, material2 );
var sphere1 = new THREE.Mesh( sphereGeometry1, sphereMaterial );
var sphere2 = new THREE.Mesh( sphereGeometry1, sphereMaterial1 );
var sphere3 = new THREE.Mesh( sphereGeometry1, sphereMaterial2 );

// red, green, blue

cube1.position.set( 0.0, 1.0, -2.0 );
cube2.position.set( 0.0, 0.5,  -4.0 );
cube3.position.set( 1.0, -0.15, -6.0 );

// z - away from vertical screen forward( negative forward)
// y - up from vertical screen
// x - R(positive)  from screen

//red cube blue ball same y

cube3.rotateZ = 10.00;

sphere1.position.set( -2.0, 1.0, 1.0 );
sphere2.position.set( -3.0, 1.0, 1.0 );
sphere3.position.set( 1.2, -0.2, -4.0 );

scene.add( cube1 );
scene.add( cube2 );
scene.add( cube3 );
scene.add( sphere1 );
scene.add( sphere2 );
scene.add( sphere3 );

cube2.name = 'cube2';
cube3.name = 'cube3';

var knotGeometry = new THREE.TorusKnotGeometry( 0.15, 0.1, 100, 16 );
var knotMaterial = new THREE.MeshPhongMaterial( { color: 0xffff00 } );
knot = new THREE.Mesh( knotGeometry, knotMaterial );
knot.position.set( 3.5, 1.0, 1.0 );
knot.name = 'knot';
scene.add( knot );

var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
scene.add( light );

  var planeGeometry = new THREE.PlaneGeometry( 4, 2, 1, 1 );
  var planeMaterial = new THREE.MeshLambertMaterial( { color: 0xffffff, side: THREE.DoubleSide } );
  var plane = new THREE.Mesh( planeGeometry, planeMaterial );

  plane.rotation.x = -0.5 * Math.PI;
  plane.position.set( 1.5, -0.35, -5.5 );
  scene.add( plane );

  var axisHelper = new THREE.AxisHelper( 10 );
  axisHelper.position.set( 1.5, -0.35, -5.5 );
  scene.add( axisHelper );

arObjectArray.push( cube2 );
arObjectArray.push( cube3 );
arObjectArray.push( knot );

function arConnectionController( participantState ) {

//   Based on participantState(focus or peer)
//    focus - device sensors
//    peer - broadcast feed sensors

  if ( participantState === 'focus' ) {
      sensorDrivenCamera.lookAt( scene.position );
      connectToDeviceSensors();
      socketServer.on( 'arObjectShare', function( data ) {
           receiveArObject( data );
      } );

    } else if ( participantState === 'peer' ) {
      broadcastDrivenCamera.lookAt( scene.position );
      connectToBroadcastSensors();
      socketServer.on( 'arObjectShare', function( data ) {
           receiveArObject( data );
      } );
    }
  }

// Attach the cameras to orientation provider
//  - sensors for a mobile initiator
//  - broadcast for all peers

sensorCameraControls = new THREE.DeviceOrientationControls( sensorDrivenCamera );

broadcastCameraControls = new WEBEYES.BroadcastOrientationControls( broadcastDrivenCamera );

arConnectionController( participantState );

function animateArObjects() {

  cube2.rotation.x += 0.03;
  cube2.rotation.y += 0.03;

  knot.rotation.y += 0.03;
  knot.rotation.z += 0.03;

  step += 0.02;
  sphere3.position.x = 1.2 + ( 0.8 * ( Math.cos( step ) ) );
  sphere3.position.y = -0.2 + ( 1.0 * Math.abs( Math.sin( step ) ) ) ;

  if ( animateCube === true ) {
    cube3.position.z = -6.0 + ( -8.0 * Math.abs( Math.sin( step ) ) );
  }

}

function connectToDeviceSensors() {

  sensorCameraControls.update();

  animateArObjects();

  renderer.render( scene, sensorDrivenCamera );

  requestAnimationFrame( connectToDeviceSensors );
}

function connectToBroadcastSensors() {

  broadcastCameraControls.update();

  animateArObjects();

  renderer.render( scene, broadcastDrivenCamera );

  requestAnimationFrame( connectToBroadcastSensors );
}

arConnectionController( participantState );

}

function setupArInteractionEvents( participantState ) {

  function emitArObject( data ) {
   var sessionId = socketServer.sessionid;
   socketServer.emit( 'arObjectShare', data, sessionId );
  }

  var cameraDriver;
  var arShareData = {};

//
// Select an AR object and do something cool
//

  var ar0 = document.getElementById( 'ar-canvas' );
  var rect = ar0.getBoundingClientRect();
  offsetX = rect.left;
  offsetY = rect.top;

  var viewWidth = ar0.width;
  var viewHeight = ar0.height;

  var projector = new THREE.Projector();

    if ( participantState === 'focus' ) {
      cameraDriver = sensorDrivenCamera;
    } else if ( participantState === 'peer' ) {
      cameraDriver = broadcastDrivenCamera;
    }

  ar0.addEventListener( 'mousedown', function( event ) {
    event.preventDefault();

  var vector = new THREE.Vector3( ( event.clientX - offsetX ) / viewWidth * 2 - 1,
                            -( event.clientY - offsetY ) / viewHeight * 2 + 1, 0.5 );

    projector.unprojectVector( vector, cameraDriver );

    vector.sub( cameraDriver.position );
    vector.normalize();

    var rayCaster = new THREE.Raycaster( cameraDriver.position, vector );

    intersects = rayCaster.intersectObjects( arObjectArray );

    console.log( 'Selected Object:', intersects[0].object.name );

   // selectedArObject = scene.getObjectByName( intersects[0].object.name );

    if ( intersects[0].object.name === 'cube3' ) {

      animateCube = true;

    }

    console.log( 'intersects:', intersects );

    if ( intersects.length > 0 ) {
      intersects[0].object.material.color.setRGB( Math.random(), Math.random(), Math.random() );
      intersects[0].object.position.x += Math.round( Math.random() ) * 2 - 1;

//  AR object data for sharing

      arShareData.name = intersects[0].object.name;
      arShareData.x = intersects[0].object.position.x;
      arShareData.y = intersects[0].object.position.y;
      arShareData.z = intersects[0].object.position.z;
      arShareData.position = intersects[0].object.position;
      arShareData.color = intersects[0].object.material.color;

      console.log( 'arShareData:', arShareData );

      emitArObject( arShareData );
    }

  }, false );

}
