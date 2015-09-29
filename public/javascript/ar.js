
arData = {};


function orientationAr() {

  document.getElementById( 'cube' ).style.visibility = 'visible';
  document.getElementById( 'cube' ).style.zIndex = '99';

  if ( !window.DeviceOrientationEvent ) {
            console.log( "no device orientation" );
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
  arData.alpha = event.alpha
  arData.beta = event.beta
  arData.gamma = event.gamma

  var sessionId = socketServer.sessionid;
  socketServer.emit( 'arOrientation', arData, sessionId );
  } )
}

  // Load the ar Models
  // participants can be focus or peer

function loadArModel( participantType ) {

  var arCanvas = document.getElementById( 'arcanvaspane' );
  var ar0 = document.getElementById( 'ar-canvas' );

  document.getElementById( "arcanvaspane" ).className = "canvascenter";

  ar0.style.width = '100%';
  ar0.style.height = '100%';
  ar0.width = ar0.offsetWidth;
  ar0.height = ar0.offsetHeight;

  arCanvas.style.visibility = 'visible';
  arCanvas.offsetHeight = document.getElementById( 'box0' ).offsetHeight;
  arCanvas.offsetWidth = document.getElementById( 'box0' ).offsetWidth;

  var container, sensorDrivenCamera, broadcastDrivenCamera, scene, renderer, mesh,
    CANVAS_WIDTH = 300,
    CANVAS_HEIGHT = 300;

scene = new THREE.Scene();

sensorDrivenCamera = new THREE.PerspectiveCamera( 50, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000 );
broadcastDrivenCamera = new THREE.PerspectiveCamera( 50, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000 );

// set the renderer to the AR canvas

renderer = new THREE.WebGLRenderer( { canvas: ar0, alpha: true } );
renderer.setSize( box0Width, box0Width );

renderer.setClearColor( 0x000000, 0 );

//sphere

var radius = .3,
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

var cubeGeometry = new THREE.BoxGeometry( -0.5, -0.5, -0.5 );
var sphereGeometry1 = new THREE.SphereGeometry( .5, 16, 16 );
//
material = new THREE.MeshLambertMaterial( { color: 'red' } );
material1 = new THREE.MeshLambertMaterial( { color: 0x008000 } );
material2 = new THREE.MeshPhongMaterial( { color: 'blue' } );
sphereMaterial1 = new THREE.MeshLambertMaterial( { color: 'yellow' } );
sphereMaterial2 = new THREE.MeshLambertMaterial( { color: 0x0066FF } );
orbitSphereMaterial = new THREE.MeshLambertMaterial( { color: 0xB24700 } );
//
var cube = new THREE.Mesh( cubeGeometry, material );
var cube1 = new THREE.Mesh( cubeGeometry, material );
var cube2 = new THREE.Mesh( cubeGeometry, material1 );
var cube3 = new THREE.Mesh( cubeGeometry, material2 );
var sphere1 = new THREE.Mesh( sphereGeometry1, sphereMaterial );
var sphere2 = new THREE.Mesh( sphereGeometry1, sphereMaterial1 );
var sphere3 = new THREE.Mesh( sphereGeometry1, sphereMaterial2 );

cube1.position.set( 0.1, 1.0, -2.0 ); //red
cube2.position.set( 0.2, 0.5,  -4.0 ); //green
cube3.position.set( 0.3, 0.0, -6.0 ); //blue

sphere1.position.set( -2.0, 1.0, 1.0 ); //blue
sphere2.position.set( -4.0, 1.0, 1.0 ); //yellow
sphere3.position.set( -6.0, 1.0, 1.0 ); //blue

scene.add( cube1 );
scene.add( cube2 );
scene.add( cube3 );
scene.add( sphere1 );
scene.add( sphere2 );
scene.add( sphere3 );

var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
scene.add( light );

sensorCameraControls = new THREE.DeviceOrientationControls( sensorDrivenCamera );

broadcastCameraControls = new THREE.BroadcastOrientationControls( broadcastDrivenCamera );

arConnectionController( userContext.participantState );


function connectDeviceSensors() {

  sensorCameraControls.update();

  renderer.render( scene, sensorDrivenCamera );

  requestAnimationFrame( connectDeviceSensors );
}


function connectBroadcastSensors() {

  broadcastCameraControls.update();

  renderer.render( scene, broadcastDrivenCamera );

  requestAnimationFrame( connectBroadcastSensors );

  //console.log(broadcastCameraControls);

}


function arConnectionController( participantType ) {
  if( participantType === 'focus') {
      console.log( 'at call to connectDeviceSensors with', participantType );

      sensorDrivenCamera.lookAt( scene.position );

      //  drive the virtual camera with the orientation sensors

      connectDeviceSensors();
    }
    else if ( participantType === 'peer' ) {
      console.log( 'at call to connectBroadcastSensors with', participantType );

      //broadcastDrivenCamera.lookAt(scene.position);

      connectBroadcastSensors();

     //renderer.render( scene, broadcastDrivenCamera );


     //socketServer.on( 'arOrientation', function( arBroadcastData ) {
     ////  console.log( arBroadcastData );

     //  broadcastDrivenCamera.rotation.order = 'XYZ';

     //  broadcastDrivenCamera.rotation.x = arBroadcastData.beta;
     //  broadcastDrivenCamera.rotation.y = arBroadcastData.gamma;
     //  broadcastDrivenCamera.rotation.z = arBroadcastData.alpha;

     //  broadcastDrivenCamera.lookAt( scene.position );

     //  renderer.render( scene, broadcastDrivenCamera );

     //} );

      //connectDeviceSensors( arBroadcastData );
    }

  }

}
