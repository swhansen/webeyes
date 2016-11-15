function setUpArLayer() {

  scene = null;

// if ( scene ) { scene.remove };

  renderer = null;

  var step = 0;

  var arCanvas = document.getElementById( 'arcanvaspane' );
  var ar0 = document.getElementById( 'arcanvas' );
  document.getElementById( 'canvaspane' ).style.zIndex = '10';
  document.getElementById( 'arcanvaspane' ).style.zIndex = '50';

 // document.getElementById( 'arcanvaspane' ).className = 'canvascenter';

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

// Fix for re-entry to VR mode to prevent multipe handlers, etc

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

// set the renderer based on the device type

if ( userContext.mobile === true ) {
  renderer.setSize( ar0.offsetWidth, ar0.offsetHeight );
  } else { renderer.setSize( box0Width, box0Width ); }

//  renderer.setSize( box0Width, box0Width );
//  renderer.setSize( ar0.offsetWidth, ar0.offsetHeight );

  renderer.setClearColor( 0x000000, 0 );

//
// AR world model
//


// build the cardinal orientation and trigger elements


  var cardinalMat = new THREE.MeshLambertMaterial( { color: 'red' } );
  var triggerMat = new THREE.MeshPhongMaterial( { color: 0x99c2ff } );
  var geometrySphere = new THREE.SphereGeometry( 0.15, 16, 16 );

  sphereN = new THREE.Mesh( geometrySphere, cardinalMat );
  sphereS = new THREE.Mesh( geometrySphere, cardinalMat );
  sphereE = new THREE.Mesh( geometrySphere, cardinalMat );
  sphereW = new THREE.Mesh( geometrySphere, cardinalMat );
  sphereU = new THREE.Mesh( geometrySphere, cardinalMat );
  sphereD = new THREE.Mesh( geometrySphere, cardinalMat );

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

  trigger1 = new THREE.Mesh( geometrySphere, triggerMat );
  trigger1.position.set( 1.0, 2.0, -4.0 );
  scene.add( trigger1 );
  trigger1.userData.isSelectable = true;



  var geometryCube1 = new THREE.BoxGeometry( 0.5, 0.5, 0.5, 2, 2, 2 );
  var geometryCube2 = new THREE.BoxGeometry( 0.8, 0.8, 0.8 );
  var geometryKnot = new THREE.TorusKnotGeometry( 0.3, 0.3, 100, 16 );

  var material1 = new THREE.MeshLambertMaterial( { color: 0xff0000 } );
  var material2 = new THREE.MeshPhongMaterial( { color: 'blue' } );
  var material3 = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
  var materialKnot = new THREE.MeshPhongMaterial( { color: 0xffff00 } );
  var materialO = new THREE.MeshLambertMaterial( { color: 'red' } );


  var cube1 = new THREE.Mesh( geometryCube1, material1 );
  var cube2 = new THREE.Mesh( geometryCube2, material2 );
  var sphere = new THREE.Mesh( geometrySphere, material3 );
  var knot = new THREE.Mesh( geometryKnot, materialKnot );
  knot.userData.isSelectable = true;


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

  var hueGeometrySphere = new THREE.SphereGeometry( 0.2, 16, 16 );

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

  hueLightmaterial4 = new THREE.MeshPhongMaterial ( {
    color: 0xff00ff,
    shininess: 66,
    opacity:0.5,
    transparent: true
} );

  hueLight1 = new THREE.Mesh( hueGeometrySphere, hueLightmaterial1 );
  hueLight2 = new THREE.Mesh( hueGeometrySphere, hueLightmaterial2 );
  hueLight3 = new THREE.Mesh( hueGeometrySphere, hueLightmaterial3 );
  hueLight4 = new THREE.Mesh( hueGeometrySphere, hueLightmaterial4 );

  hueLight1.position.set( -0.809, -0.737, -5.227 );
  hueLight2.position.set( 1.077, 1.606, -5.17 );
  hueLight3.position.set( -2.785, 1.606, -5.17 );
  hueLight4.position.set( -0.809, 1.606, -5.17 );

  hueLight1.userData.isSelectable = true;
  hueLight2.userData.isSelectable = true;
  hueLight3.userData.isSelectable = true;
  hueLight4.userData.isSelectable = true;

  hueLight1.name = 'hueLight1';
  hueLight2.name = 'hueLight2';
  hueLight3.name = 'hueLight3';
  hueLight4.name = 'hueLight4';

  hueLight1.userData.isIot = true;
  hueLight2.userData.isIot = true;
  hueLight3.userData.isIot = true;
  hueLight4.userData.isIot = true;

  hueLight1.userData.iotDeviceId = 1;
  hueLight2.userData.iotDeviceId = 2;
  hueLight3.userData.iotDeviceId = 3;
  hueLight4.userData.iotDeviceId = 4;

  hueLight1.userData.isOn = false;
  hueLight2.userData.isOn = false;
  hueLight3.userData.isOn = false;
  hueLight4.userData.isOn = false;

  scene.add( hueLight1 );
  scene.add( hueLight2 );
  scene.add( hueLight3 );
  scene.add( hueLight4 );

  arSelectObjectArray.push( hueLight1 );
  arSelectObjectArray.push( hueLight2 );
  arSelectObjectArray.push( hueLight3 );
  arSelectObjectArray.push( hueLight4 );

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

function arConnectionController() {

  socketServer.removeAllListeners( 'arObjectShare' );

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

 arConnectionController();

  }