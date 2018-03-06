//function setUpArLayer() {
console.log( 'ar-load-core loading' );

scene = null;
renderer = null;

var arCanvasPane = document.getElementById( 'arcanvaspane' );
var arCanvas = document.getElementById( 'arcanvas' );
document.getElementById( 'canvaspane' ).style.zIndex = '10';
document.getElementById( 'arcanvaspane' ).style.zIndex = '50';

userContext.addDimensionalLayer( 'arcanvaspane' );

var b = getCenterBoxId();
var boxFocus = $( '#' + b );

var boxPosition = boxFocus.offset();
var boxWidth = boxFocus.outerWidth();
var boxHeight = boxFocus.outerHeight();

// console.log( 'userContext:', userContext );
//  console.log( 'setUpArLayer:', boxPosition, boxWidth, boxHeight );

$( '#arcanvaspane' ).css( boxPosition );
$( '#arcanvaspane' ).css( 'width', boxWidth );
$( '#arcanvaspane' ).css( 'height', boxHeight );
$( '#arcanvaspane' ).css( 'z-index', 50 );

$( '#arcanvas' ).css( boxPosition );
arCanvas.width = arCanvasPane.clientWidth;
arCanvas.height = arCanvasPane.clientHeight;

//  console.log( 'ar-load-core: box0-position:', boxPosition );
//  console.log( 'ar-load-core: box0:', box0Width, box0Height );

arCanvasPane.style.visibility = 'visible';
arCanvas.style.visibility = 'visible';

var CANVAS_WIDTH = 300;
var CANVAS_HEIGHT = 300;

if ( arSelectObjectArray ) { arSelectObjectArray = []; }

scene = new THREE.Scene();

// Video Pane Stuff

var camvideo = document.getElementById( 'box0' );

if ( !navigator.getUserMedia ) {
  document.getElementById( 'errorMessage' ).innerHTML =
    'Sorry. <code>navigator.getUserMedia()</code> is not available.';
} else {
  navigator.getUserMedia( { video: true }, gotStream, noStream );
}

function gotStream( stream ) {
  if ( window.URL )
  { camvideo.src = window.URL.createObjectURL( stream ); }
  else // Opera
  { camvideo.src = stream; }
  camvideo.onerror = function( e )
  { stream.stop(); };
  stream.onended = noStream;
}

function noStream(e) {
  var msg = 'No camera available.';
  if ( e.code == 1 )
  {   msg = 'User denied access to use camera.'; }
  document.getElementById( 'errorMessage' ).textContent = msg;
}






//
// AR world model
//

var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
 light.name = 'HemisphereLight';
 scene.add( light );

// build the cardinal orientation points

var cardinalMat = new THREE.MeshLambertMaterial( { color: 'red' } );
 var geometrySphere = new THREE.SphereGeometry( 0.1, 16, 16 );

var sphereN = new THREE.Mesh( geometrySphere, cardinalMat );
 var sphereS = new THREE.Mesh( geometrySphere, cardinalMat );
 var sphereE = new THREE.Mesh( geometrySphere, cardinalMat );
 var sphereW = new THREE.Mesh( geometrySphere, cardinalMat );
 var sphereU = new THREE.Mesh( geometrySphere, cardinalMat );
 var sphereD = new THREE.Mesh( geometrySphere, cardinalMat );

sphereS.position.set( 0.0, 0.0, -20.0 );
 sphereS.name = 'sphereS';

sphereN.position.set( 0.0, 0.0, 20.0 );
 sphereN.name = 'sphereN';

sphereE.position.set( 20.0, 0.0, 0.0 );
 sphereE.name = 'sphereE';

sphereW.position.set( -20.0, 0.0, 0.0 );
 sphereW.name = 'sphereW';

sphereU.position.set( 0.0, 20.0, 0.0 );
 sphereU.name = 'sphereU';

sphereD.position.set( 0.0, -20.0, 0.0 );
 sphereD.name = 'sphereD';

scene.add( sphereN );
 scene.add( sphereS );
 scene.add( sphereE );
 scene.add( sphereW );
 scene.add( sphereU );
 scene.add( sphereD );

// var testIot = new IotObject( 'testIot', 'steve', 5 );
// testIot.setPosition( 1.5, 0.0, -5.0 );

var iot1 = new IotObject( 'iot1', 'steve', 1 );
iot1.setPosition( -1.0, 0.0, -5.0 );

var iot2 = new IotObject( 'iot2', 'steve', 2 );
iot2.setPosition( 0.2, 1.3, -5.17 );

var iot3 = new IotObject( 'iot3', 'steve', 3 );
iot3.setPosition( -4.5, 1.3, -5.17 );

var iot4 = new IotObject( 'iot4', 'steve', 4 );
iot4.setPosition( -1.0, 1.606, -5.17 );

var iot5 = new IotObject( 'iot5', 'steve', 5 );
iot5.setPosition( 0.75, -0.5, -4.0 );

// Make an object on the desk

var geometryCube2 = new THREE.BoxGeometry( 0.8, 0.8, 0.8 );
var material2 = new THREE.MeshPhongMaterial( { color: 'blue' } );
var cube2 = new THREE.Mesh( geometryCube2, material2 );
cube2.position.set( -2.0, 0.0, -6.0 );
cube2.rotateZ = 10.00;
cube2.name = 'cube2';
cube2.userData.isSelectable = true;
cube2.userData.isAnimated = false;
arSelectObjectArray.push( cube2 );
scene.add( cube2 );

//  var tgeometry = new THREE.CubeGeometry( 1, 1, 1 );
//  var tmaterial = new THREE.MeshNormalMaterial( {
//    transparent: true,
//    opacity: 0.5,
//    side: THREE.DoubleSide
//  } );

//  var tmesh = new THREE.Mesh( tgeometry, tmaterial );
//  tmesh.position.set( -2.5, 2.0, -6.0 );
//  scene.add( tmesh );

var planeGeometry = new THREE.PlaneGeometry( 4, 2, 1, 1 );
var planeMaterial = new THREE.MeshNormalMaterial( {
  transparent: true,
  opacity: 0.1,
  side: THREE.DoubleSide
} );

var plane = new THREE.Mesh( planeGeometry, planeMaterial );

plane.rotation.x = -0.5 * Math.PI;
plane.position.set( 1.0, -0.15, -2.5 );
scene.add( plane );


// a 2D image pane

imagePaneTexture = new THREE.TextureLoader().load( '../../img/field.jpg' );
imagePaneMaterial = new THREE.MeshBasicMaterial( {
  map: imagePaneTexture,
  transparent: true,
  opacity: 1.0
} );
var imagePaneGeometry = new THREE.PlaneGeometry( 3.5, 2.5, 1, 1 );
var imagePane = new THREE.Mesh( imagePaneGeometry, imagePaneMaterial );
imagePane.position.set( -0.75, 0.0, -6.5 );
imagePane.name = 'northpane';
imagePane.visible = true;
arSelectObjectArray.push( imagePane );
scene.add( imagePane );

var axisHelper = new THREE.AxisHelper( 10 );
axisHelper.position.set( 0.0, 0.0, -3.0 );
scene.add( axisHelper );

// VIDEO Pane Experiment

video = document.getElementById( 'box0' );
videoImage = document.getElementById( 'videoImage' );
videoImageContext = videoImage.getContext( '2d' );
// background color if no video present
videoImageContext.fillStyle = '#000000';
videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );
videoTexture = new THREE.Texture( videoImage );
videoTexture.minFilter = THREE.LinearFilter;
videoTexture.magFilter = THREE.LinearFilter;

var movieMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: true, side: THREE.DoubleSide } );
var movieGeometry = new THREE.PlaneGeometry( 2, 2, 1, 1 );
var movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
movieScreen.position.set( -4.0, 0.0, -4.0 );
movieScreen.rotation.set( 0, 0.7, 0 );
movieScreen.name = 'videoscreen';
scene.add( movieScreen );

//
// Functional Stuff
//

var cRaycaster = new THREE.Raycaster();
var v2 = new THREE.Vector2();

function arConnectionController() {
  socketServer.removeAllListeners( 'arObjectShare' );

  socketServer.on( 'arObjectShare', function( data ) {
    console.log( 'getting socketServer-arObjectStare:', data );
    arObjectBroadcastHandler( data );
  } );

  //   Set up the camera drivers and connection feed
  //   Based on participantState(focus or peer)
  //    focus - device sensors
  //    peer - broadcast fed sensors
  //    ar - sensor driven
  //    vr - mouse driven

  if ( userContext.participantState === 'focus' && userContext.mode === 'vr' ) {
    cameraDriver = vrDrivenCamera;
    vrDrivenCamera.lookAt( scene.position );
    connectToVrController();
  }

  if ( userContext.participantState === 'peer' && userContext.mode === 'vr' ) {
    cameraDriver = vrBroadcastDrivenCamera;
    vrBroadcastDrivenCamera.lookAt( scene.position );
    connectToVrBroadcast();

  //   socketServer.on( 'arObjectShare', function( data ) {
  //        arObjectBroadcastHandler( data );
  //   } );
  }

  if ( userContext.participantState === 'focus' && userContext.mode === 'ar' ) {
    cameraDriver = sensorDrivenCamera;
    sensorDrivenCamera.lookAt( scene.position );
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


if ( typeof sensorCameraControls === 'undefined' && userContext.participantState === 'focus' ) {
  sensorDrivenCamera = new THREE.PerspectiveCamera( 50, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000 );
  sensorDrivenCamera.name = 'arSensorDrivenCamera';
  sensorCameraControls = new WEBEYES.DeviceOrientationControls( sensorDrivenCamera );
}

if ( typeof broadcastCameraControls === 'undefined' && userContext.participantState === 'peer' ) {
  broadcastDrivenCamera = new THREE.PerspectiveCamera( 50, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000 );
  broadcastDrivenCamera.name = 'arBroadcastDrivenCamera';
  broadcastCameraControls = new WEBEYES.BroadcastOrientationControls( broadcastDrivenCamera );
}

 // Fix for re-entry to VR mode to prevent multipe handlers, etc

if ( typeof vrBroadcastCameraControls === 'undefined' && userContext.participantState === 'peer' ) {
   vrBroadcastDrivenCamera = new THREE.PerspectiveCamera( 50, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000 );
   vrBroadcastDrivenCamera.name = 'vrBroadcastDrivenCamera';
   vrBroadcastCameraControls = new WEBEYES.BroadcastVrControls( vrBroadcastDrivenCamera );
 }

if ( typeof vrDrivenCameraControls === 'undefined' && userContext.participantState === 'focus' ) {
   vrDrivenCamera = new THREE.PerspectiveCamera( 50, CANVAS_WIDTH / CANVAS_HEIGHT, .1, 1000 );
   vrDrivenCamera.name = 'vrDrivenCamera';
   vrDrivenCameraControls = new WEBEYES.MouseControls( vrDrivenCamera );
   vrDrivenCameraControls.connect();
 }

// add a center frustum object to the camera

var frustumCenter = new FrustumObject( sensorDrivenCamera );

renderer = new THREE.WebGLRenderer( { canvas: arCanvas, alpha: true } );

// set the renderer based on the device type

if ( userContext.mobile === true ) {
  renderer.setSize( arCanvas.offsetWidth, arCanvas.offsetHeight );
  } else { renderer.setSize( boxWidth, boxHeight ); }

renderer.setClearColor( 0x000000, 0 );

arConnectionController();

function connectToVrController() {
  vrDrivenCameraControls.update();
  animateArObjects();
  renderer.render( scene, vrDrivenCamera );
  requestAnimationFrame( connectToVrController );

}

function connectToVrBroadcast() {
  vrBroadcastCameraControls.update();
  animateArObjects();
  renderer.render( scene, vrBroadcastDrivenCamera );
  requestAnimationFrame( connectToVrBroadcast );
}

function connectToDeviceSensors() {
  cameraIntersectsHandler();
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
  arSelectObjectArray.forEach( function( obj ) {
        obj.material.opacity = 0.1;
  }
  );
  cRaycaster.setFromCamera( v2, sensorDrivenCamera );
  var cameraIntersects = cRaycaster.intersectObjects( arSelectObjectArray );

  cameraIntersects.forEach( function( obj ) {
   // if ( obj.object.name !== 'northpane' ) {
   //   obj.object.material.color.set( 0x993399 );
      obj.object.material.opacity = 0.9;
    }

  //  if ( obj.object.name == 'northpane' ) {
  //    obj.object.visible = true;
  //    console.log( 'intersected northpane' );
  //  }

  );
}


function animateArObjects() {

  if ( video.readyState === video.HAVE_ENOUGH_DATA ) {
    videoImageContext.drawImage( video, 0, 0, videoImage.width, videoImage.height );
    if ( videoTexture ) {
      videoTexture.needsUpdate = true;
    }
  }
  var dt = clock.getDelta();

  arSelectObjectArray.forEach( function( arObj ) {
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
  }
  );
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

//var animatedArObjects = [ 'torus', 'sheep', 'swordGuy' ];

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
