var scene = new THREE.Scene();
var dollyOn = true;
var forBack = 1;
var b = getCenterBoxId();
var boxFocus = $( '#' + b );
var arSelectObjectArray = [];
var cameraDriver;
var cRaycaster = new THREE.Raycaster();
var v2 = new THREE.Vector2();

// to build a Dimensional Layer Object


function createDimensionalLayer( layerName ) {
  var t1 = document.createElement( 'div' );
  t1.setAttribute( 'title', "Test" );
  t1.setAttribute( 'width', "440" );
  t1.setAttribute( 'height', "390" );
  t1.setAttribute( 'frameborder', "0" );
  var fp = document.getElementById( "fullpage" );
  fp.appendChild( t1 );
}








createDimensionalLayer( 'foo-bar' );


var spherePane = document.getElementById( 'spherepane' );
var sphereCanvas = document.getElementById( 'spherecanvas' );
spherePane.style.visibility = 'visible';
var box0Focus = $( '#box0' );
var boxPosition = box0Focus.offset();
var boxWidth = box0Focus.outerWidth();
var boxHeight = box0Focus.outerHeight();
var curCanvas = $( '#spherecanvas' );
var curPane = $( '#spherecanvas' );

curCanvas.css( boxPosition );
curCanvas.css( 'width', boxWidth );
curCanvas.css( 'height', boxHeight );
curCanvas.css( 'z-index', 200 );
curPane.css( 'z-index', 200 );
curPane.css( boxPosition );
curPane.css( 'width', boxWidth );
curPane.css( 'height', boxHeight );
curPane.css( 'z-index', 200 );

var arCanvasPane = document.getElementById( 'arcanvaspane' );
var arCanvas = document.getElementById( 'arcanvas' );
document.getElementById( 'canvaspane' ).style.zIndex = '10';
document.getElementById( 'arcanvaspane' ).style.zIndex = '50';

userContext.addDimensionalLayer( 'arcanvaspane' );

const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 300;

if ( arSelectObjectArray ) { arSelectObjectArray = []; }

//  Camera and Broadcast Controllers
//  Attach the cameras to orientation provider
//  - sensors for a mobile initiator ( ar mode )
//  - mouse x-y ( VR mode )
//  - broadcast for all

if ( typeof sensorDrivenCameraControls === 'undefined' && userContext.participantState === 'focus' ) {
  const sensorDrivenCamera = new THREE.PerspectiveCamera( 50, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000 );
  sensorDrivenCamera.name = 'arSensorDrivenCamera';
  const sensorCameraControls = new WEBEYES.DeviceOrientationControls( sensorDrivenCamera );
}

if ( typeof broadcastCameraControls === 'undefined' && userContext.participantState === 'peer' ) {
  var broadcastDrivenCamera = new THREE.PerspectiveCamera( 50, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000 );
  broadcastDrivenCamera.name = 'arBroadcastDrivenCamera';
  var broadcastCameraControls = new WEBEYES.BroadcastOrientationControls( broadcastDrivenCamera );
}

if ( typeof vrBroadcastCameraControls === 'undefined' && userContext.participantState === 'peer' ) {
  var vrBroadcastDrivenCamera = new THREE.PerspectiveCamera( 50, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000 );
  vrBroadcastDrivenCamera.name = 'vrBroadcastDrivenCamera';
  var vrBroadcastCameraControls = new WEBEYES.SphereMouseControls( vrBroadcastDriveCamera );
}

if ( typeof sphereDrivenCameraControls === 'undefined' && userContext.participantState === 'focus' ) {
  var sphereDrivenCamera = new THREE.PerspectiveCamera( 45, CANVAS_WIDTH / CANVAS_HEIGHT, 0.2, 1000 );
  sphereDrivenCamera.name = 'vrDrivenCamera';
  var sphereDrivenCameraControls = new WEBEYES.SphereMouseControls( sphereDrivenCamera );
  sphereDrivenCameraControls.connect();
}

// --------- AR world model -------------

// Background Sphere

const sphere = new LoadSphericalImage( 'circlesphere', 'circle.jpg' );

// HUD Panel Objects

const hud1 = new HudObjectImage( 'hudImage1', sphereDrivenCamera, 'exploded.png', -3.0, 0.0, -2.0 );
const hud2 = new HudObjectRtc( 'hudVideo1', sphereDrivenCamera, 'box0', 3.0, 0.0, -2.0 );

var renderer = new THREE.WebGLRenderer( { canvas: sphereCanvas } );
renderer.setSize( boxWidth, boxHeight );
spherePane.appendChild( renderer.domElement );

//  create a frustum center pointer

const frustumCenter = new FrustumObject( sphereDrivenCamera );

arConnectionController();

const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
light.name = 'HemisphereLight';
scene.add( light );

// build the cardinal orientation points

const cardinalPoints = [ 'N', 'S', 'E', 'W', 'U', 'D' ];
cardinalPoints.forEach( ( e ) => {
  new CardinalObject( e );
} );

const testRealtive = new SpatialObjectRelative( {
  loc: [ 5.0, 2.0, -5.0 ], size: [ 1, 1, 1 ], name: 'testfromRelative', color: '#800000'
} );

// Selectable Objects

let sData = { size: 0.5, name: 'testselectable', color: '#800000', creator: 'swhansen' };
sData.loc = [ -9, -3, -13 ];
const select1 = new SpatialObjectSelectable( sData );
sData.loc = [ 4, -3, -12 ];
var select2 = new SpatialObjectSelectable( sData );
sData.loc = [ -15, -3, -2 ];
var select3 = new SpatialObjectSelectable( sData );

const iData = {
  size: [ 2.5, 1.5, 1 ],
  name: 'imagepane',
  color: '#800000',
  creator: 'swhansen',
  img: 'mappoints.png',
  loc: [ 0.0, 2.5, -7.5 ],
  rotation: [ 0, 0, 0 ]
};
const imagePane = new SpatialImageSelectable( iData );

// Bring in the objects from geo-mongo
//  - based on a search center

const officeBase = [ 42.622035, -71.609048 ];
const circleBase = [ 42.6222430007, -71.609691107 ];
getGeoArObjects( circleBase );

// ----------- End AR World --------------------

//   Set up the camera drivers and connection feed
//   Based on participantState(focus or peer)
//    focus - device sensors
//    peer - broadcast fed sensors
//    ar - sensor driven
//    vr - mouse driven

function arConnectionController() {
  socketServer.removeAllListeners( 'arObjectShare' );
  socketServer.on( 'arObjectShare', function( data ) {
    arObjectBroadcastHandler( data );
  } );

  if ( userContext.participantState === 'focus' && userContext.mode === 'vr' ) {
    cameraDriver = sphereDrivenCamera;
    connectToVrController();
  }

  if ( userContext.participantState === 'peer' && userContext.mode === 'vr' ) {
    cameraDriver = vrBroadcastDrivenCamera;

//    vrBroadcastDrivenCamera.lookAt( scene.position );
    connectToVrBroadcast();
  }

  if ( userContext.participantState === 'focus' && userContext.mode === 'ar' ) {
    cameraDriver = sensorDrivenCamera;
    connectToDeviceSensors();
    socketServer.on( 'arObjectShare', function( data ) {
      arObjectBroadcastHandler( data );
    } );
  }

  if ( userContext.participantState === 'peer' && userContext.mode === 'ar' ) {
    cameraDriver = broadcastDrivenCamera;
    broadcastDrivenCamera.lookAt( scene.position );
    connectToBroadcastSensors();
    socketServer.on( 'arObjectShare', function( data ) {
      arObjectBroadcastHandler( data );
    } );
  }
}

function connectToVrController() {
  sphereDrivenCameraControls.update();
  animateArObjects();
  cameraIntersectsHandler();
  renderer.render( scene, sphereDrivenCamera );
  hud1.update();
  hud2.update();
  requestAnimationFrame( connectToVrController );
}

function connectToVrBroadcast() {
  vrBroadcastCameraControls.update();
  animateArObjects();
  renderer.render( scene, vrBroadcastDrivenCamera );
  requestAnimationFrame( connectToVrBroadcast );
}
function connectToDeviceSensors() {
  if ( userContext.participantState === 'focus' && userContext.mode === 'ar' ) {

  //  cameraIntersectsHandler();
  }
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

function cameraIntersectsHandler() {
  arSelectObjectArray.forEach( ( obj ) => {
    obj.material.opacity = 0.4;
    obj.material.color.set( 0xffff00 );
    obj.scale.set( 1, 1, 1 );
    if ( obj.name === 'imagepane' ) {
      obj.material.opacity = 0.3;
      obj.material.color.set( 0xffffff );
    }
  } );

  cRaycaster.setFromCamera( v2, sphereDrivenCamera );
  var cameraIntersects = cRaycaster.intersectObjects( arSelectObjectArray );

  cameraIntersects.forEach( ( obj ) => {
    obj.object.material.opacity = 1.0;
    obj.object.material.color.set( 0xff0000 );
    obj.object.scale.set( 3, 3, 3 );

    if ( obj.object.name === 'imagepane' ) {
      obj.object.material.opacity = 1.0;
      obj.object.material.color.set( 0xffffff );
    }
  } );
}

document.addEventListener( 'keyup', ( event ) => {
  if ( event.keyCode === 70 ) { forBack = -1; }
  if ( event.keyCode === 66 ) { forBack = 1; }
  if ( event.keyCode === 83 ) {
    dollyOn = !dollyOn;
  }
  return dollyOn;
} );

var cameraDir = -1.0;
var cameraZ = 0.0;
var cameraY = 0.0;

function animateArObjects() {
  const zMax = 18.0;
  const zMin = -18.0;
  let dt = clock.getDelta();

  arSelectObjectArray.forEach( ( arObj ) => {
    if ( arObj.name === 'torus' &&
      arObj.userData.isAnimated === true ) {
      arObj.rotation.y += dt * 1.0;
    }
    if ( arObj.name === 'sheep' &&
          arObj.userData.isAnimated === true ) {
      arObj.rotation.z += dt * 2.0;
    }
    if ( arObj.name === 'swordGuyMesh' &&
          arObj.userData.isAnimated === true ) {
      mixer.update( dt );
    }
  } );

  if ( dollyOn ) {
    cameraDir = forBack;
    if ( sphereDrivenCamera.position.z < zMin ) {
      cameraDir = 1;
      forBack = 1;
    }
    if ( sphereDrivenCamera.position.z > zMax ) {
      cameraDir = -1;
      forBack = -1;
    }

    cameraZ += dt * cameraDir * 2.0;
    cameraY = 0.1 * ( Math.cos( cameraZ ) );

    sphereDrivenCamera.position.z = cameraZ;
    sphereDrivenCamera.position.y = cameraY;
  }
}

//    var foo = clock.getElapsedTime() - clock.startTime;

//    sphere.position.x =  1.4 + ( 0.8 * ( Math.cos( foo ) ) ) ;
//    sphere.position.y = -0.2 + ( 0.9 * Math.abs( Math.sin( foo ) ) );

//    knot.position.y = -0.22 + ( 1.4 * Math.abs( Math.sin( foo ) ) );

//    if ( isAnimateKnot === true ) {
//        knot.rotation.y += 0.03;
//        knot.rotation.z += 0.03;
//        knot.position.z = -5.0 + ( -45.0 * Math.abs( Math.sin( foo ) ) );
//    }

//    if ( isAnimateSheep === true ) {
//        sheep.rotation.z += dt * 2;
//    }

// var animatedArObjects = [ 'torus', 'sheep', 'swordGuy' ];

//    for ( var i = 0; i < arSelectObjectArray.length; i++ ) {
//
//
//        if ( arSelectObjectArray[i].userData.objectType === 'torus' &&
//              arSelectObjectArray[i].userData.isAnimated === true ) {
//          arSelectObjectArray[i].rotation.y += dt * 1.0;
//        }
//
//        if ( arSelectObjectArray[i].name === 'sheep' &&
//              arSelectObjectArray[i].userData.isAnimated === true ) {
//          arSelectObjectArray[i].rotation.z += dt * 2.0;
//        }
//
//        if ( arSelectObjectArray[i].name === 'swordGuyMesh' &&
//              arSelectObjectArray[i].userData.isAnimated === true ) {
//                 mixer.update( dt );
//        }
//    }

