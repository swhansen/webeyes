
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
var knot;
var arUserCreatedObject;
var mixer;

function orientationAr( data ) {

  emitArOrientationData();
  document.getElementById( 'compassCube' ).style.zIndex = '99';

  if ( data ) {
    document.getElementById( 'compassCube' ).style.visibility = 'visible';
    } else {
    document.getElementById( 'compassCube' ).style.visibility = 'hidden';
  }
  if ( userContext.participantState === 'focus' ) {
      window.addEventListener( 'deviceorientation', function( event ) {
      document.getElementById( 'compassCube' ).style.webkitTransform =
      document.getElementById( 'compassCube' ).style.transform =
                 'rotateX(' + event.beta + 'deg) ' +
                 'rotateY(' + event.gamma + 'deg) ' +
                 'rotateZ(' + event.alpha + 'deg)';
      }
    );
  }
  if ( userContext.participantState === 'peer' ) {
    socketServer.on( 'arOrientation', function( data ) {
         document.getElementById( 'compassCube' ).style.webkitTransform =
         document.getElementById( 'compassCube' ).style.transform =
                 'rotateX(' + data.beta + 'deg) ' +
                 'rotateY(' + data.gamma + 'deg) ' +
                 'rotateZ(' + data.alpha + 'deg)';
      }
    );
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

//  function emitVrOrientationData( data ) {
//    vrDeviceOrientation.alpha = data.alpha;
//    vrDeviceOrientation.beta = data.beta;
//    vrDeviceOrientation.gamma = data.gamma;
//    var sessionId = socketServer.sessionid;
//    socketServer.emit( 'arOrientation', vrDeviceOrientation, sessionId );
//
//  }

socketServer.on( 'toggleCompass', function( data ) {
  orientationAr( data );
  } );

function removeUserCreatedArObjects() {
    for ( var i = 0; i < scene.children.length; i++ ) {
      if ( scene.children[i].userData.isUserCreated ) {
        scene.remove( scene.children[i] );
      }
    }
    for ( var j = 0; j < arSelectObjectArray.length; j++ ) {
      if ( arSelectObjectArray[j].userData.isUserCreated === true ) {
        arSelectObjectArray.splice( j, 1 );
      }
    }
  }

//
// ----------  Main Loader  --------------------------
//

function loadAr( participantState ) {

 var scene, renderer, arContainer;
 var sensorDrivenCamera, broadcastDrivenCamera, sensorCameraControls, broadcastCameraControls ;
 var vrDrivenCamera, vrBroadcastDrivenCamera, vrDrivenCameraControls, vrBroadcastCameraControls;
 var projector;
 var cameraDriver;
  isAnimateKnot = false;
  isAnimateSheep = false;
  isAnimateSwordGuy = false;

  $( '#arcanvas' ).click.off;

  document.getElementById( 'canvaspane' ).style.zIndex = '10';
  document.getElementById( 'arcanvaspane' ).style.zIndex = '50';
  document.getElementById( 'sticky-ui-container' ).style.zIndex = '50';
  document.getElementById( 'sticky-ui-container' ).style.display = 'visible';
  setDomPointerEvent( 'canvas0', 'none' );
  setDomPointerEvent( 'arcanvaspane', 'auto' );
  clock.stop();
  clock.start();
  setUpArLayer( participantState );
  setupArInteractionEvents( participantState );
   }

  function receiveArObject( data ) {

    switch ( data.operation ) {
      case 'moveObject':
        var arObject = scene.getObjectByName( data.name );
        arObject.material.color.setRGB( data.color.r, data.color.g, data.color.b );
        arMoveObject( data );
      break;

      case 'newObject':
        var materialTorus1 = new THREE.MeshLambertMaterial( { color: 0x1947D1 } );
        var geometryTorus1 = new THREE.TorusGeometry( 0.3, 0.2, 100, 16 );
        var arUserCreatedObject = new THREE.Mesh( geometryTorus1, materialTorus1 );

        arUserCreatedObject.position.set( data.x, data.y, data.z );
        arUserCreatedObject.name = data.id;
        scene.add( arUserCreatedObject );

        arUserCreatedObject.userData.id = data.id;
        arUserCreatedObject.userData.isAnimated = false;
        arUserCreatedObject.userData.isUserCreated = true;
        arUserCreatedObject.userData.isSelectable = true;
        arUserCreatedObject.userData.createdBy = data.createdBy;
        arUserCreatedObject.userData.objectType = data.objectType;

        arSelectObjectArray.push( arUserCreatedObject );
      break;

      case 'animateSelectedObject':
        if ( data.name === 'sheep' ) {
            arObject = scene.getObjectByName( data.name );
            arObject.rotation.x = data.rotation._x;
            arObject.rotation.y = data.rotation._y;
            arObject.rotation.z = data.rotation._z;
            arObject.material.color.setRGB( data.color.r, data.color.g, data.color.b );
            isAnimateSheep = data.animate;
          }

        if ( data.name === 'swordGuyMesh' ) { isAnimateSwordGuy = data.animate; }

        // User Created Objects

        var tempObj = scene.getObjectByName( data.name );
        tempObj.userData.isAnimated = data.isAnimated;
      break;

      case 'hideSelectedObject':

      break;

      case  'toggleIot':
        hueSetLightStateXY( data.iotDeviceId, data.isOn, [ 0.5, 0.5 ], 100 );
        arObject = scene.getObjectByName( data.name );
        arObject.material.opacity = data.arObjectOpacity;
      break;
  }
}

  function arMoveObject( data ) {
    var arObject = scene.getObjectByName( data.name );
      if ( data.position ) {
          arObject.position.x = data.position.x;
          arObject.position.y = data.position.y;
          arObject.position.z = data.position.z;
        }
      if ( data.rotation ) {
          arObject.rotation.x = data.rotation._x;
          arObject.rotation.y = data.rotation._y;
          arObject.rotation.z = data.rotation._z;
        }
  }

function setUpArLayer( participantState ) {

  scene = null;
  renderer = null;

  var step = 0;

  var arCanvas = document.getElementById( 'arcanvaspane' );
  var ar0 = document.getElementById( 'arcanvas' );
  document.getElementById( 'canvaspane' ).style.zIndex = '10';
  document.getElementById( 'arcanvaspane' ).style.zIndex = '50';

  document.getElementById( 'arcanvaspane' ).className = 'canvascenter';

  ar0.style.width = '100%';
  ar0.style.height = '100%';
  ar0.width = ar0.offsetWidth;
  ar0.height = ar0.offsetHeight;

  arCanvas.style.visibility = 'visible';
  ar0.style.visibility = 'visible';

  var CANVAS_WIDTH = 300,
      CANVAS_HEIGHT = 300;

  if ( arSelectObjectArray ) { arSelectObjectArray = []; }

  scene = new THREE.Scene();

// Attach the cameras to orientation provider
//  - sensors for a mobile initiator ( ar mode )
//  - mouse x-y ( VR mode )
//  - broadcast for all peers

  sensorDrivenCamera = new THREE.PerspectiveCamera( 50, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000 );
  sensorDrivenCamera.name = 'arSensorDrivenCamera';
  broadcastDrivenCamera = new THREE.PerspectiveCamera( 50, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000 );
  broadcastDrivenCamera.name = 'arBroadcastDrivenCamera';

  sensorCameraControls = new THREE.DeviceOrientationControls( sensorDrivenCamera );
  broadcastCameraControls = new WEBEYES.BroadcastOrientationControls( broadcastDrivenCamera );


// Fix for re-entry to VR mode.

if ( typeof vrBroadcastCameraControls === 'undefined' ) {
  vrBroadcastDrivenCamera = new THREE.PerspectiveCamera( 50, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000 );
  vrBroadcastDrivenCamera.name = 'vrBroadcastDrivenCamera';
  vrBroadcastCameraControls = new WEBEYES.BroadcastVrControls( vrBroadcastDrivenCamera );
}

if ( typeof vrDrivenCameraControls === 'undefined' ) {
  vrDrivenCamera = new THREE.PerspectiveCamera( 50, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000 );
  vrDrivenCamera.name = 'vrDrivenCamera';
  vrDrivenCameraControls = new WEBEYES.MouseControls( vrDrivenCamera );
  vrDrivenCameraControls.connect();
}

  renderer = new THREE.WebGLRenderer( { canvas: ar0, alpha: true } );
  renderer.setSize( box0Width, box0Width );
  renderer.setClearColor( 0x000000, 0 );

//
// AR world model
//

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
       swordGuyMesh.name = 'swordGuyMesh';

       swordGuyMesh.userData.objectType =  'swordGuyMesh';
       swordGuyMesh.userData.isAnimated = false;
       swordGuyMesh.userData.isUserCreated = false;
       swordGuyMesh.userData.isSelectable = true;
       swordGuyMesh.userData.createdBy = 'system';

       scene.add( swordGuyMesh );
       arSelectObjectArray.push( swordGuyMesh );

    //   swordGuyMesh.castShadow = true;
    //   swordGuyMesh.receiveShadow = true;

       helper = new THREE.SkeletonHelper( swordGuyMesh );
       helper.material.linewidth = 3;
       helper.visible = false;
       scene.add( helper );

       var clipMorpher = THREE.AnimationClip.CreateFromMorphTargetSequence( 'facialExpressions', swordGuyMesh.geometry.morphTargets, 3 );

     //  var clipMorpher = THREE.AnimationClip;
     //  clipMorpher.CreateFromMorphTargetSequence( 'facialExpressions', swordGuyMesh.geometry.morphTargets, 3 );

       var clipBones = geometry.animations[0];

       mixer = new THREE.AnimationMixer( swordGuyMesh );
       mixer.addAction( new THREE.AnimationAction( clipMorpher ) );
       mixer.addAction( new THREE.AnimationAction( clipBones ) );
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

  console.log( 'End of AR world build' );

// Orietation plane and axis

// var planeGeometry = new THREE.PlaneGeometry( 5, 3, 1, 1 );
// var planeMaterial = new THREE.MeshLambertMaterial( { color: 0x5F6E7D, side: THREE.DoubleSide } );
// var plane = new THREE.Mesh( planeGeometry, planeMaterial );

//  plane.rotation.x = -0.5 * Math.PI;
//  plane.position.set( 1.5, -0.35, -5.5 );
//  scene.add( plane );

// var axisHelper = new THREE.AxisHelper( 10 );
// axisHelper.position.set( 1.5, -0.35, -5.5 );
// scene.add( axisHelper );

  // Create spline for "flying pig" trajecory

//var numPoints = 20;

//pigSpline = new THREE.SplineCurve3(
//[
//  new THREE.Vector3( 2.0, 0.0, 0.1 ),
//  new THREE.Vector3( 2.2, 1.0, -0.15 ),
//  new THREE.Vector3( 2.3, 1.6, -1.0 ),
//  new THREE.Vector3( 2.2, 1.8, -2.0 ),
//  new THREE.Vector3( 2.1, 2.0, -4.0 )
//] );

//var material = new THREE.LineBasicMaterial( { color: 0xff00f0 } );

//  var geometry = new THREE.Geometry();
//  var splinePoints = pigSpline.getPoints( numPoints );

//  for ( var i = 0; i < splinePoints.length; i++ ) {
//      geometry.vertices.push( splinePoints[i] );
//  }

//  var line = new THREE.Line( geometry, material );
//  scene.add( line );

//r geometryBox = new THREE.BoxGeometry( 0.4, 0.4, 0.4 );
//  var box = new THREE.Mesh( geometryBox, material1 );
//box.position.set( 2.0, 0.0, 0.1 );
//scene.add( box );

// ... end AR world model

function arConnectionController( participantState ) {

  socketServer.removeAllListeners( 'arObjectShare' );

//   Set up the camera drivers and connection feed
//   Based on participantState(focus or peer)
//    focus - device sensors
//    peer - broadcast feed sensors
//    ar - sensor driven
//    vr - mouse driven

  if ( userContext.participantState === 'focus' && userContext.mode === 'vr' ) {
    cameraDriver = vrDrivenCamera;
    vrDrivenCamera.lookAt( scene.position );
    connectToVrController();
    socketServer.on( 'arObjectShare', function( data ) {
           receiveArObject( data );
      } );
  }

    if ( userContext.participantState === 'peer' && userContext.mode === 'vr' ) {
      cameraDriver = vrBroadcastDrivenCamera;
      vrBroadcastDrivenCamera.lookAt( scene.position );
      connectToVrBroadcast();
      socketServer.on( 'arObjectShare', function( data ) {
           receiveArObject( data );
      } );
    }

  if ( userContext.participantState === 'focus' && userContext.mode === 'ar' ) {
      cameraDriver = sensorDrivenCamera;
      sensorDrivenCamera.lookAt( scene.position );
      connectToDeviceSensors();
      socketServer.on( 'arObjectShare', function( data ) {
           receiveArObject( data );
      } );
      }

  if ( userContext.participantState === 'peer' && userContext.mode === 'ar' ) {
      cameraDriver = broadcastDrivenCamera;
      broadcastDrivenCamera.lookAt( scene.position );
      connectToBroadcastSensors();
      socketServer.on( 'arObjectShare', function( data ) {
           receiveArObject( data );
        } );
      }
}

// end  arConnectionController

// Attach the cameras to orientation provider
//  - sensors for a mobile initiator ( ar mode )
//  - mouse x-y ( VR mode )
//  - broadcast for all peers

// sensorCameraControls = new THREE.DeviceOrientationControls( sensorDrivenCamera );
// broadcastCameraControls = new WEBEYES.BroadcastOrientationControls( broadcastDrivenCamera );
// vrDrivenCameraControls = new WEBEYES.MouseControls( vrDrivenCamera );
// vrBroadcastCameraControls = new WEBEYES.BroadcastVrControls( vrBroadcastDrivenCamera );

  function animateArObjects() {

    var dt = clock.getDelta();
    step += dt;

    var foo = clock.getElapsedTime() - clock.startTime;

    sphere.position.x =  1.4 + ( 0.8 * ( Math.cos( foo ) ) ) ;
    sphere.position.y = -0.2 + ( 0.9 * Math.abs( Math.sin( foo ) ) );

    knot.position.y = -0.22 + ( 1.4 * Math.abs( Math.sin( foo ) ) );

    if ( isAnimateKnot === true ) {
        knot.rotation.y += 0.03;
        knot.rotation.z += 0.03;
        knot.position.z = -5.0 + ( -45.0 * Math.abs( Math.sin( foo ) ) );
    }

    if ( isAnimateSheep === true ) {
        sheep.rotation.z += dt * 2;
    }

// Flying  Pig
    if ( flyingPig !== undefined ) {
      pivotPoint.rotation.y += dt * 1.0;
    }

// Sword Guy
    if ( isAnimateSwordGuy === true ) {
         mixer.update( dt );
          helper.update();
    }

// User Created Objects - as of now only torus

    for ( var i = 0; i < arSelectObjectArray.length; i++ ) {
        if ( arSelectObjectArray[i].userData.objectType === 'bagel' &&
              arSelectObjectArray[i].userData.isAnimated === true ) {
          arSelectObjectArray[i].rotation.y += dt * 1.0;
        }
    }
  }

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

  // end setup AR Layer

function setupArInteractionEvents( participantState ) {

//
// Establish the user interation with the AR objects
//  - set the cameraDriver based on AR/VR and focus/peer
//

var arCanvas = document.getElementById( 'arcanvaspane' );
var ar0 = document.getElementById( 'arcanvas' );

setDomPointerEvent( 'arcanvas', 'auto' );
setDomPointerEvent( 'arcanvaspane', 'auto' );

ar0.style.display = 'visible';
arCanvas.style.display = 'visible';

ar0.style.zIndex = '50';
arCanvas.style.zIndex = '50';

$( '#arcanvas' ).unbind( 'click' );

$( function() {
  $( '#arcanvas' ).click( function( e ) {
      onArSelect( e );
    }
  );
} );

  function emitArObject( data ) {
    var sessionId = socketServer.sessionid;
    socketServer.emit( 'arObjectShare', data, sessionId );
  }

  var arShareData = {};

  var rect = ar0.getBoundingClientRect();
  offsetX = rect.left;
  offsetY = rect.top;

  var viewWidth = ar0.offsetWidth;
  var viewHeight = ar0.offsetHeight;

  projector = new THREE.Projector();

  function toggleArAnimation( arObject ) {
    if ( arObject.userData.isAnimated === false ) {
          arObject.userData.isAnimated = true;
      } else {
        arObject.userData.isAnimated = false;
      }
    }

//
// Place an object with a long click
//

  $( '#arcanvas' ).longpress( function( event ) {

    console.log( 'longpress' );

    event.preventDefault();

    var mouse3D = new THREE.Vector3( ( event.clientX - offsetX ) / viewWidth * 2 - 1,
                              -( event.clientY - offsetY ) / viewHeight * 2 + 1, 0.5 );

    mouse3D.unproject( cameraDriver );
    var dir = mouse3D.sub( cameraDriver.position ).normalize();
    var raycaster = new THREE.Raycaster( cameraDriver.position, mouse3D );

    var scale = 4.0;

    var pos = cameraDriver.position.clone().add( dir.multiplyScalar( 6 ) );

        arShareData.operation = 'newObject';
        arShareData.x = pos.x;
        arShareData.y = pos.y;
        arShareData.z = pos.z;

  // add the object locally and tell everyone else

    addNewArObjectToWorld( arShareData );
    return false;
    },

  function( e ) {
      return false;
  }, 750 );

  function addNewArObjectToWorld( d ) {
      var materialTorus1 = new THREE.MeshLambertMaterial( { color: 0x1947D1 } );
      var geometryTorus1 = new THREE.TorusGeometry( 0.3, 0.2, 100, 16 );
      var arUserCreatedObject = new THREE.Mesh( geometryTorus1, materialTorus1 );

      arUserCreatedObject.position.set( d.x, d.y, d.z );
      arUserCreatedObject.userData.id = arUserCreatedObject.id;
      arUserCreatedObject.userData.objectType =  'bagel';
      arUserCreatedObject.name = arUserCreatedObject.id;
      arUserCreatedObject.userData.isAnimated = false;
      arUserCreatedObject.userData.isUserCreated = true;
      arUserCreatedObject.userData.isSelectable = true;
      arUserCreatedObject.userData.createdBy = userContext.rtcId;

      scene.add( arUserCreatedObject );
      arSelectObjectArray.push( arUserCreatedObject );

  // push the new object to peers

      var newArObj = {};
      newArObj.operation = 'newObject';
      newArObj.x = d.x;
      newArObj.y = d.y;
      newArObj.z = d.z;
      newArObj.id = arUserCreatedObject.id;
      newArObj.createdBy = userContext.rtcId;
      newArObj.isSelectable = true;
      newArObj.isUserCreated = true;
      newArObj.objectType = 'bagel';

      emitArObject( newArObj );
    }

    function pushNewArObject( d ) {
      var newArObj = {};
      newArObj.operation = 'newObject';
      newArObj.x = d.x;
      newArObj.y = d.y;
      newArObj.z = d.z;
      newArObj.id = arUserCreatedObject.id;
      newArObj.createdBy = userContext.rtcId;

      emitArObject( newArObj );
    }

// Select an AR object  with a single click

 function onArSelect( event ) {

     event.preventDefault();

     var vector = new THREE.Vector3( ( event.clientX - offsetX ) / viewWidth * 2 - 1,
                             -( event.clientY - offsetY ) / viewHeight * 2 + 1, 0.5 );

     projector.unprojectVector( vector, cameraDriver );
     vector.sub( cameraDriver.position );
     vector.normalize();
     var rayCaster = new THREE.Raycaster( cameraDriver.position, vector );
     var intersects = rayCaster.intersectObjects( arSelectObjectArray );
     var selectedObject = intersects[0].object ;
     console.log( 'intersects:', intersects, selectedObject );

 // IOT Lights

     if ( intersects.length > 0 ) {

       if ( selectedObject.userData.isIot === true ) {

         if ( selectedObject.userData.isOn === false ) {
               selectedObject.userData.isOn = true;
               selectedObject.material.opacity = 0.1;
               } else {
               selectedObject.userData.isOn = false;
               selectedObject.material.opacity = 0.5;
             }

         hueSetLightState( selectedObject.userData.iotDeviceId, selectedObject.userData.isOn );

         arShareData.operation = 'toggleIot';
         arShareData.isOn = selectedObject.userData.isOn;
         arShareData.iotDeviceId = selectedObject.userData.iotDeviceId;
         arShareData.arObjectOpacity = selectedObject.material.opacity;
         arShareData.name = selectedObject.name;

         // animateArObjects();

         emitArObject( arShareData );
         return;
       }

 // User created objects

       if ( selectedObject.userData.isUserCreated === true ) {

      //     toggleArAnimation( selectedObject );

        if ( selectedObject.userData.isAnimated === false ) {
          selectedObject.userData.isAnimated = true;
          } else {
          selectedObject.userData.isAnimated = false;
        }

         arShareData.operation = 'animateSelectedObject';
         arShareData.id = selectedObject.userData.iotDeviceId;
         arShareData.isAnimated = selectedObject.userData.isAnimated;

         emitArObject( arShareData );

         return;
       }

    // Special Cases - Hardwired

     if ( intersects[0].object.name === 'knot' ) {
         isAnimateKnot = !isAnimateKnot;

         animateArObjects();

         return;
     }

     if ( intersects[0].object.name === 'sheep' ) {
        isAnimateSheep = !isAnimateSheep;

        if ( !isAnimateSheep ) {
         intersects[0].object.material.color.setRGB( Math.random(), Math.random(), Math.random() );
        }

          arShareData.animate = isAnimateSheep;
          arShareData.operation = 'animateSelectedObject';
          arShareData.name = intersects[0].object.name;
          arShareData.x = intersects[0].object.position.x;
          arShareData.y = intersects[0].object.position.y;
          arShareData.z = intersects[0].object.position.z;
          arShareData.position = intersects[0].object.position;
          arShareData.rotation = intersects[0].object.rotation;
          arShareData.color = intersects[0].object.material.color;

          // animateArObjects();

          emitArObject( arShareData );
     }

     if ( intersects[0].object.name === 'swordGuyMesh' ) {
       isAnimateSwordGuy = !isAnimateSwordGuy;

       arShareData.animate = isAnimateSwordGuy;
       arShareData.operation = 'animateSelectedObject';
       arShareData.name = intersects[0].object.name;

       // animateArObjects();

       emitArObject( arShareData );
     }

     if ( intersects[0].object.name === 'cube2' ) {
       intersects[0].object.material.color.setRGB( Math.random(), Math.random(), Math.random() );
       intersects[0].object.position.x += Math.round( Math.random() ) * 2 - 1;

      // intersects[0].object.rotation.y += Math.PI / 180.0 * 45.0;

       arShareData.operation = 'moveObject';
       arShareData.name = intersects[0].object.name;
       arShareData.x = intersects[0].object.position.x;
       arShareData.y = intersects[0].object.position.y;
       arShareData.z = intersects[0].object.position.z;
       arShareData.position = intersects[0].object.position;
       arShareData.rotation = intersects[0].object.rotation;
       arShareData.color = intersects[0].object.material.color;

       emitArObject( arShareData );
     }
   }

   }

}
