
  //function setUpArLayer() {
  console.log( 'ar-load-geo loading' );

  scene = null;
  renderer = null;

  var b = getCenterBoxId();
  var boxFocus = $( '#' + b );

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


var texture1 = THREE.ImageUtils.loadTexture( '../../spheres/circle.jpg' );
var material1 = new THREE.MeshBasicMaterial( { map: texture1 } );

  var sphere = new THREE.Mesh(
      new THREE.SphereGeometry( 25, 20, 20 ), material1 );



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

  var cRaycaster = new THREE.Raycaster();
  var v2 = new THREE.Vector2();

  // Attach the cameras to orientation provider
  //  - sensors for a mobile initiator ( ar mode )
  //  - mouse x-y ( VR mode )
  //  - broadcast for all peers


  if ( typeof sensorDrivenCameraControls === 'undefined' && userContext.participantState === 'focus' ) {
  sensorDrivenCamera = new THREE.PerspectiveCamera( 50, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000 );
  sensorDrivenCamera.name = 'arSensorDrivenCamera';
  sensorCameraControls = new WEBEYES.DeviceOrientationControls( sensorDrivenCamera );
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

  sphereDrivenCamera = new THREE.PerspectiveCamera( 45, CANVAS_WIDTH / CANVAS_HEIGHT, .1, 1000 );
  sphereDrivenCamera.name = 'vrDrivenCamera';
  sphereDrivenCameraControls = new WEBEYES.SphereMouseControls( sphereDrivenCamera );
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

// var geo = new THREE.CircleGeometry( 0.5, 32 );
// var mat = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
// var cir = new THREE.Mesh( geo, mat );
// scene.add( cir );
// cir.position.set( -10, -2, -10 );
// cir.rotation.set(new THREE.Vector3( 0,  Math.PI / 2, 0) );


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
  renderer.render( scene, sphereDrivenCamera );
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

  if ( sphereDrivenCamera.position.z < zMin ) dir = 1;
  if ( sphereDrivenCamera.position.z > zMax ) dir = -1;

  cameraZ += dt * dir * 2.0;
  cameraY = 0.1 * ( Math.cos( cameraZ ) );

  sphereDrivenCamera.position.z = cameraZ;
  sphereDrivenCamera.position.y = cameraY;
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

