
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

function emitArOrientation( data ) {
  var sessionId = socketServer.sessionid;
  socketServer.emit( 'arOrientation', data, sessionId );
}

socketServer.on( 'arOrientation', function( data ) {
  if ( userContext.participantState === 'peer' ) {

    console.log( 'peer position:', data);
//    arOrientClient( data );
  }
} );

function peerArScene( position ) {

    //arOrientPeer(position);
  }

function loadArModel() {

if (userContext.participantState = 'focus' ) {
  if ( userContext.arCapable === true ) {
    window.addEventListener( 'deviceorientation', function( event ) {
    arData.alpha = event.alpha
    arData.beta = event.beta
    arData.gamma = event.gamma
    emitArOrientation( arData );
    } )
  }
}

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

  var container, sensorDrivenCamera, scene, renderer, mesh,
    CANVAS_WIDTH = 300,
    CANVAS_HEIGHT = 300;

scene = new THREE.Scene();

sensorDrivenCamera = new THREE.PerspectiveCamera( 50, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000 );

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

//pivotPoint = new THREE.Object3D();
//pivotPoint.rotation.x = 0.4;
//sphere.add( pivotPoint );
//
//// add the sphere to the scene
////scene.add(sphere);
//
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
//cube.castShadow = true;

//pivotPoint.add( cube );

//var orbitCube = new THREE.Mesh( cubeGeometry, material );
//orbitCube.castShadow = true;
//orbitCube.position.set( 2.5, 1.0, 1.0 );
//scene.add( orbitCube );

//var knotGeometry = new THREE.TorusKnotGeometry( .2, .15, 100, 16 );
//var knotMaterial = new THREE.MeshPhongMaterial( { color: 0xffff00 } );
//var orbitKnot = new THREE.Mesh( knotGeometry, knotMaterial );
//orbitKnot.position.set( 3.5, 1.0, 1.0 );
//scene.add( orbitKnot );

var cube1 = new THREE.Mesh( cubeGeometry, material );
var cube2 = new THREE.Mesh( cubeGeometry, material1 );
var cube3 = new THREE.Mesh( cubeGeometry, material2 );
var sphere1 = new THREE.Mesh( sphereGeometry1, sphereMaterial );
var sphere2 = new THREE.Mesh( sphereGeometry1, sphereMaterial1 );
var sphere3 = new THREE.Mesh( sphereGeometry1, sphereMaterial2 );

//cube1.position.set( 1.0, 1.0, 1.0 ); //red
//cube2.position.set( 3.0, 1.0, 1.0 ); //green
//cube3.position.set( 5.0, 1.0, 1.0 ); //blue

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
//
//// orbiting sphere
//
//var orbitSphere = new THREE.Mesh( new THREE.SphereGeometry(
//    radius,
//    segments,
//    rings ),
//  orbitSphereMaterial );
////
//orbitSphere.position.set( 5.0, 1.0, .5 );
//scene.add( orbitSphere );

//var orbitSphereFocus = new THREE.Mesh( new THREE.SphereGeometry(
//    radius,
//    segments,
//    rings ),
//  orbitSphereMaterial );
//scene.add( orbitSphereFocus );
////
//var orbitSpherePivotPoint = new THREE.Object3D();
//orbitSpherePivotPoint.position.set( 4.0, 3.0, 0.0 );
//orbitSpherePivotPoint.rotation.x = 0.7;
//orbitSphereFocus.add( orbitSpherePivotPoint );
//orbitSpherePivotPoint.add( orbitKnot );

//  canera and light

  //camera.position.x = 4;
  //camera.position.y = 4;
  //camera.position.z = 4;

sensorDrivenCamera.lookAt( scene.position );

// dataDrivenCamera( scene.position );

var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
scene.add( light );

//  drive the virtual camera with the orientation sensors

arCameraControls = new THREE.DeviceOrientationControls( sensorDrivenCamera );


function connectSensors() {

  arCameraControls.update();

 //pivotPoint.rotation.x += .05;
 //pivotPoint.rotation.y += .05;
//
 //cube.rotation.x += 0.05;
 //cube.rotation.y += 0.05;
//
 //orbitKnot.rotation.x += 0.05;
 //orbitKnot.rotation.y += 0.05;
//
 //orbitSpherePivotPoint.rotation.y += 0.01;
//
 //////orbitSpherePivotPoint.rotation.x += 0.02;
//
 //cube1.rotation.x += 0.05;
 //cube1.rotation.y += 0.05;

 //cube2.rotation.x += 0.05;
 //cube2.rotation.y += 0.05;

  renderer.render( scene, sensorDrivenCamera );

  requestAnimationFrame( connectSensors );

}

if(userContext.participantState === 'focus') {
    connectSensors();
    }
else {
  // connect to socket sensor feed
};

}