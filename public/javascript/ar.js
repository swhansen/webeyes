var arDeviceOrientation = {};
var arSelectObjectArray = [];
var animateZ = false;
animateSheep = false;
var selectedArObject;
var clock = new THREE.Clock();
var sheep;

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

  clock.start();
  setUpArLayer( participantState );
  setupArInteractionEvents( participantState );
   }

  function receiveArObject( data ) {

    console.log( 'recieve AR data:', data );

    if ( data.operation === 'moveObject' ) {
       var arObject = scene.getObjectByName( data.name );
           arObject.position.x = data.position.x;
           arObject.position.y = data.position.y;
           arObject.position.z = data.position.z;

        //   arObject.rotation.x = data.rotation.x;
        //   arObject.rotation.y = data.rotation.y;
        //   arObject.rotation.z = data.rotation.z;

           arObject.material.color.setRGB( data.color.r, data.color.g, data.color.b );
       }

    if ( data.operation === 'newObject' ) {

      var materialTorus1 = new THREE.MeshLambertMaterial( { color: 0x1947D1 } );
      var geometryTorus1 = new THREE.TorusGeometry( 0.3, 0.2, 100, 16 );
      var torus1 = new THREE.Mesh( geometryTorus1, materialTorus1 );
      torus1.position.set( data.x, data.y, data.z );
      torus1.name = 'torus1';
      scene.add( torus1 );
      arSelectObjectArray.push( torus1 );
    }
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

  renderer = new THREE.WebGLRenderer( { canvas: ar0, alpha: true } );
  renderer.setSize( box0Width, box0Width );
  renderer.setClearColor( 0x000000, 0 );

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

  sphereN = new THREE.Mesh( geometrySphere, materialO );
  sphereS = new THREE.Mesh( geometrySphere, materialO );
  sphereE = new THREE.Mesh( geometrySphere, materialO );
  sphereW = new THREE.Mesh( geometrySphere, materialO );

  sphereN.position.set( 0.0, 0.0, 6.0 );
  sphereS.position.set( 0.0, 0.0, -6.0 );
  sphereE.position.set( 6.0, 0.0, 0.0 );
  sphereW.position.set( -6.0, 0.0, 0.0 );

  scene.add( sphereN );
  scene.add( sphereS );
  scene.add( sphereE );
  scene.add( sphereW );

  cube1.position.set( 0.0, 0.0,  -4.0 );
  cube2.position.set( -2.0, 0.0, -6.0 );
  sphere.position.set( 1.2, -0.2, -4.0 );
  knot.position.set( 0.5, 0.22, -5.0 );

  cube2.rotateZ = 10.00;

  var loader = new THREE.JSONLoader();
  loader.load( '../armodels/sheep2.json', function( model ) {
    var material = new THREE.MeshPhongMaterial( { color: 0xFF69B4 } );
    sheep = new THREE.Mesh( model, material );

    sheep.scale.set( 0.1, 0.1, 0.1 );
    sheep.position.set( -2.0, -0.4, 0.0 );
    sheep.rotation.x = Math.PI / 2;
    sheep.rotation.y = ( Math.PI / 2 ) * 0.5;
    sheep.rotation.z = ( Math.PI / 2 ) * 0.3;
    sheep.name = 'sheep';
    scene.add( sheep );
    arSelectObjectArray.push( sheep );
  } );

  //scene.add( cube1 );

  scene.add( cube2 );
  scene.add( sphere );
  scene.add( knot );

  cube1.name = 'cube1';
  cube2.name = 'cube2';
  knot.name = 'knot';

  var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
  scene.add( light );

  var planeGeometry = new THREE.PlaneGeometry( 5, 3, 1, 1 );
  var planeMaterial = new THREE.MeshLambertMaterial( { color: 0x5F6E7D, side: THREE.DoubleSide } );
  var plane = new THREE.Mesh( planeGeometry, planeMaterial );

  plane.rotation.x = -0.5 * Math.PI;
  plane.position.set( 1.5, -0.35, -5.5 );
  scene.add( plane );

  var axisHelper = new THREE.AxisHelper( 10 );
  axisHelper.position.set( 1.5, -0.35, -5.5 );
  scene.add( axisHelper );

// add to the selection array

 // arSelectObjectArray.push( cube1 );

  arSelectObjectArray.push( cube2 );
  arSelectObjectArray.push( knot );

  //arSelectObjectArray.push( sheep );

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

    var dt = clock.getDelta();

    step += dt * 0.5;
    sphere.position.x =  1.4 + ( 0.8 * ( Math.cos( step ) ) ) ;
    sphere.position.y = -0.2 + ( 0.9 * Math.abs( Math.sin( step ) ) );

    knot.position.y = -0.22 + ( 1.4 * Math.abs( Math.sin( step ) ) );

    if ( animateZ === true ) {
        knot.rotation.y += 0.03;
        knot.rotation.z += 0.03;
        knot.position.z = -5.0 + ( -45.0 * Math.abs( Math.sin( step ) ) );
    }
    if ( animateSheep === true ) {
      sheep.rotation.z += 0.01;
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

//
// Place an object with a long click
//

$( '#ar-canvas' ).longpress( function( event ) {

  var v1 = new THREE.Vector3( ( event.clientX - offsetX ) / viewWidth * 2 - 1,
                            -( event.clientY - offsetY ) / viewHeight * 2 + 1, 0.5 );
  v1.unproject( cameraDriver );
  var dir = v1.sub( cameraDriver.position ).normalize();
  var distance =  ( -4.0 - cameraDriver.position.z )  / dir.z;
  var pos = cameraDriver.position.clone().add( dir.multiplyScalar( distance ) );

  console.log( 'cameraDriver:', cameraDriver );
  console.log( 'distance:', distance );
  console.log( 'dir:', dir );
  console.log( 'pos:', pos );

      arShareData.operation = 'newObject';
      arShareData.x = pos.x;
      arShareData.y = pos.y;
      arShareData.z = pos.z;

// add the object locally and tell everyone else

    addArObject( pos.x, pos.y, pos.z );
    emitArObject( arShareData );

  return;
} );

function addArObject( x, y, z ) {
    var materialTorus1 = new THREE.MeshLambertMaterial( { color: 0x1947D1 } );
    var geometryTorus1 = new THREE.TorusGeometry( 0.3, 0.2, 100, 16 );
    var torus1 = new THREE.Mesh( geometryTorus1, materialTorus1 );
    torus1.position.set( x, y, z );
    scene.add( torus1 );
    torus1.name = 'torus1';
    arSelectObjectArray.push( torus1 );
  }

// Select an object

  ar0.addEventListener( 'click', function( event ) {
    event.preventDefault();

  var vector = new THREE.Vector3( ( event.clientX - offsetX ) / viewWidth * 2 - 1,
                            -( event.clientY - offsetY ) / viewHeight * 2 + 1, 0.5 );

    projector.unprojectVector( vector, cameraDriver );
    vector.sub( cameraDriver.position );
    vector.normalize();
    var rayCaster = new THREE.Raycaster( cameraDriver.position, vector );
    var intersects = rayCaster.intersectObjects( arSelectObjectArray );

// do things with the selected object

    if ( intersects[0].object.name === 'knot' ) {
      animateZ = !animateZ;
      return;
    }

   if ( intersects[0].object.name === 'sheep' ) {
     intersects[0].object.material.color.setRGB( Math.random(), Math.random(), Math.random() );
     animateSheep = !animateSheep;
     return;
    }

    if ( intersects.length > 0 ) {
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

      console.log( 'arShareData:', arShareData );

      emitArObject( arShareData );
    }

  }, false );

}
