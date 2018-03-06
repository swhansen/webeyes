console.log( 'ar-load-geo loading' );
scene = null;
renderer = null;
var dollyOn = true;
var b = getCenterBoxId();
var boxFocus = $( '#' + b );
var arSelectObjectArray = [];

//  var boxPosition = boxFocus.offset();
//  var boxWidth = boxFocus.outerWidth();
//  var boxHeight = boxFocus.outerHeight();

var spherePane = document.getElementById( 'spherepane' );
var sphereCanvas = document.getElementById( 'spherecanvas' );
spherePane.style.visibility = 'visible';
var box0Focus = $( '#box0' );
var boxPosition = box0Focus.offset();
var boxWidth = box0Focus.outerWidth();
var boxHeight = box0Focus.outerHeight();
$( '#spherecanvas' ).css( boxPosition );
$( '#spherecanvas' ).css( 'width', boxWidth );
$( '#spherecanvas' ).css( 'height', boxHeight );
$( '#spherepane' ).css( 'z-index', 200 );
$( '#spherecanvas' ).css( 'z-index', 200 );
$( '#spherepane' ).css( boxPosition );
$( '#spherepane' ).css( 'width', boxWidth );
$( '#spherepane' ).css( 'height', boxHeight );
$( '#spherepane' ).css( 'z-index', 200 );


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
var movieGeometry = new THREE.PlaneGeometry( 1.5, 1.5, 1.5, 1 );
var movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
//movieScreen.position.set( -4.0, 0.0, -4.0 );
movieScreen.rotation.set( 0, -1.0, 0 );
movieScreen.name = 'videoscreen';

var texture1 = THREE.ImageUtils.loadTexture( '../../spheres/circle.jpg' );
var material1 = new THREE.MeshBasicMaterial( { map: texture1 } );

var sphere = new THREE.Mesh(
  new THREE.SphereGeometry( 25, 20, 20 ), material1 );

var arCanvasPane = document.getElementById( 'arcanvaspane' );
var arCanvas = document.getElementById( 'arcanvas' );
document.getElementById( 'canvaspane' ).style.zIndex = '10';
document.getElementById( 'arcanvaspane' ).style.zIndex = '50';

userContext.addDimensionalLayer( 'arcanvaspane' );

//var b = getCenterBoxId();
//var boxFocus = $( '#' + b );
//
//var boxPosition = boxFocus.offset();
//var boxWidth = boxFocus.outerWidth();
//var boxHeight = boxFocus.outerHeight();

// console.log( 'userContext:', userContext );
//  console.log( 'setUpArLayer:', boxPosition, boxWidth, boxHeight );

//  $( '#arcanvaspane' ).css( boxPosition );
//  $( '#arcanvaspane' ).css( 'width', boxWidth );
//  $( '#arcanvaspane' ).css( 'height', boxHeight );
//   $( '#arcanvaspane' ).css( 'z-index', 50 );

//  $( '#arcanvas' ).css( boxPosition );
//  arCanvas.width = arCanvasPane.clientWidth;
//  arCanvas.height = arCanvasPane.clientHeight;

//  console.log( 'ar-load-core: box0-position:', boxPosition );
//  console.log( 'ar-load-core: box0:', box0Width, box0Height );

//  arCanvasPane.style.visibility = 'visible';
//  arCanvas.style.visibility = 'visible';

var CANVAS_WIDTH = 300;
var CANVAS_HEIGHT = 300;

if ( arSelectObjectArray ) { arSelectObjectArray = []; }

var scene = new THREE.Scene();

scene.add( movieScreen );

var hudSphere = new THREE.Mesh( geometrySphere, cardinalMat );
hudSphere.name = 'hudsphere';
scene.add( hudSphere );

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

function noStream( e ) {
  var msg = 'No camera available.';
  if ( e.code == 1 )
  { msg = 'User denied access to use camera.'; }
  document.getElementById( 'errorMessage' ).textContent = msg;
}

var cRaycaster = new THREE.Raycaster();
var v2 = new THREE.Vector2();

// Attach the cameras to orientation provider
//  - sensors for a mobile initiator ( ar mode )
//  - mouse x-y ( VR mode )
//  - broadcast for all peers

if ( typeof sensorDrivenCameraControls === 'undefined' && userContext.participantState === 'focus' ) {
  var sensorDrivenCamera = new THREE.PerspectiveCamera( 50, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000 );
  sensorDrivenCamera.name = 'arSensorDrivenCamera';
  var sensorCameraControls = new WEBEYES.DeviceOrientationControls( sensorDrivenCamera );
 // var frustumCenter = new FrustumObject( sensorDrivenCamera );
  console.log( ' sensorDrivenCamera Loaded');
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
  vrBroadcastCameraControls = new WEBEYES.SphereMouseControls( vrBroadcastDriveCamera );
}

var sphereDrivenCamera = new THREE.PerspectiveCamera( 45, CANVAS_WIDTH / CANVAS_HEIGHT, .1, 1000 );
sphereDrivenCamera.name = 'vrDrivenCamera';
var sphereDrivenCameraControls = new WEBEYES.SphereMouseControls( sphereDrivenCamera );
sphereDrivenCameraControls.connect();

// add a center frustum object to the camera

//  var frustumCenter = new FrustumObject( sensorDrivenCamera );

var renderer = new THREE.WebGLRenderer( { canvas: sphereCanvas } );
  renderer.setSize( boxWidth, boxHeight );

// set the renderer based on the device type

//if ( userContext.mobile === true ) {
//  renderer.setSize( arCanvas.offsetWidth, arCanvas.offsetHeight );
//} else { renderer.setSize( boxWidth, boxHeight ); }

//renderer.setClearColor( 0x000000, 0 );

arConnectionController();

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

sphere.scale.x = -1;
scene.add( sphere );
var axis = new THREE.Vector3( 0.0,1.0,0 );
sphere.rotateOnAxis( axis, -1.57 );

// hardwired selectable objects

var geo = new THREE.SphereGeometry( 0.5, 16, 16 );
var mat = new THREE.MeshPhongMaterial( {
  color: 0xffff00,
  shininess: 66,
  opacity: 0.5,
  transparent: true
} );
var cir1 = new THREE.Mesh( geo, mat );
cir1.name = 'select-cir1';
scene.add( cir1 );
cir1.position.set( -9, -3, -13 );
arSelectObjectArray.push( cir1 );
var cir2 = new THREE.Mesh( geo, mat );
cir2.name = 'select-cir2';
scene.add( cir2 );
cir2.position.set( 4, -3, -12 );
arSelectObjectArray.push( cir2 );

var cir3 = new THREE.Mesh( geo, mat );
cir3.name = 'select-cir3';
scene.add( cir3 );
cir3.position.set( -15, -3, -2 );
arSelectObjectArray.push( cir3 );

imagePaneTexture = new THREE.TextureLoader().load( '../../img/mappoints.png' );
imagePaneMaterial = new THREE.MeshBasicMaterial( {
  map: imagePaneTexture,
  transparent: true,
  opacity: 1.0
} );
var imagePaneGeometry = new THREE.PlaneGeometry( 2.5, 1.5, 1, 1 );
var imagePane = new THREE.Mesh( imagePaneGeometry, imagePaneMaterial );
imagePane.position.set( 5.0, 1.0, -7.5 );
imagePane.name = 'imagepane';
imagePane.visible = true;
arSelectObjectArray.push( imagePane );
scene.add( imagePane );


// Bring in the objects from geo-mongo

var officeBase = [ 42.622035, -71.609048 ];
var circleBase = [ 42.6222430007, -71.609691107 ];
getGeoArObjects( circleBase );

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
    cameraDriver = sphereDrivenCamera;
    sphereDrivenCamera.lookAt( scene.position );
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

    // sensorDrivenCamera.lookAt( scene.position );

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

spherePane.appendChild( renderer.domElement );

function connectToVrController() {
  sphereDrivenCameraControls.update();
  animateArObjects();
  cameraIntersectsHandler();
  renderer.render( scene, sphereDrivenCamera );
  requestAnimationFrame( connectToVrController );

  if ( video.readyState === video.HAVE_ENOUGH_DATA ) {
    videoImageContext.drawImage( video, 0, 0, videoImage.width, videoImage.height );
    if ( videoTexture ) {
      videoTexture.needsUpdate = true;
    }
  }
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
  };
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

var frustumCenter = new FrustumObject( sphereDrivenCamera );

function cameraIntersectsHandler() {
  arSelectObjectArray.forEach( function( obj ) {
    obj.material.opacity = 0.4;
    obj.material.color.set( 0xffff00 );
    obj.scale.set( 1, 1, 1 );
    if ( obj.name == 'imagepane' ) {
      obj.material.opacity = 0.3;
      obj.material.color.set( 0xffffff );
    }
  }
  );
  cRaycaster.setFromCamera( v2, sphereDrivenCamera );
  var cameraIntersects = cRaycaster.intersectObjects( arSelectObjectArray );

  cameraIntersects.forEach( function( obj ) {

// if ( obj.object.name !== 'northpane' ) {
//   obj.object.material.color.set( 0x993399 );

    obj.object.material.opacity = 1.0;
    obj.object.material.color.set( 0xff0000 );
    obj.object.scale.set( 3, 3, 3 );

if ( obj.object.name == 'imagepane' ) {
      obj.object.material.opacity = 1.0;
      obj.object.material.color.set( 0xffffff );
    }
}

  //  if ( obj.object.name == 'northpane' ) {
  //    obj.object.visible = true;
  //    console.log( 'intersected northpane' );
  //  }

  );
}

var counter = 0;
var forBack = 1;

document.addEventListener( 'keyup', function ( event ) {
  counter += 1;
  if ( event.keyCode == 70 ) { forBack = -1; }
  if ( event.keyCode == 66 ) { forBack = 1; }
  if ( event.keyCode == 83 ) {
    if ( counter % 2 == 0 ) {
      dollyOn = dollyOn ? false : true;
      return dollyOn;
    }
  }
} );

var zMax = 18.0;
var zMin = -18.0;
var dir = -1.0;
var cameraZ = 0.0;
var cameraY = 0.0;

function animateArObjects() {
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
  if ( dollyOn ) {
    dir = forBack;
    if ( sphereDrivenCamera.position.z < zMin ) {
      dir = 1;
      forBack = 1;
    }
    if ( sphereDrivenCamera.position.z > zMax ) {
      dir = -1;
      forback = -1;
    }

cameraZ += dt * dir * 2.0;
cameraY = 0.1 * ( Math.cos( cameraZ ) );

sphereDrivenCamera.position.z = cameraZ;
sphereDrivenCamera.position.y = cameraY;

 hudSphere.position.x = sphereDrivenCamera.position.x + -2.0;
 hudSphere.position.y = sphereDrivenCamera.position.y;
 hudSphere.position.z = sphereDrivenCamera.position.z - 2.0;

 movieScreen.position.x = sphereDrivenCamera.position.x + 4.0;
 movieScreen.position.y = sphereDrivenCamera.position.y;
 movieScreen.position.z = sphereDrivenCamera.position.z - 2.0;

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

