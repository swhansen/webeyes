// Implements peer side Leap hand interaction
//  - listens to  leapShare ( Leap frame data JSON )
//  - listens to leapSphere for leap hand sphere
//  - emits peerSphere to leapFocus for peer IOT  change

function initLeapPeerHand() {

socketServer.on( 'leapSphere', function( data ) {
    leapAnimate( data );
      } );

 var boxRect = leapfull.getBoundingClientRect();
 console.log( 'boxRect:', boxRect );

 var leapPane = document.getElementById( 'leappane' );
 var leapFull = document.getElementById( 'leapfull' );
 document.getElementById( 'leappane' ).className = 'leapcenter';

 //leapFull.style.width = '100%';
 //leapFull.style.height = '100%';
 leapFull.width =  leapPane.offsetWidth;
 leapFull.height = leapPane.offsetHeight;

 leapFull.style.visibility = 'visible';
 leapPane.style.visibility = 'visible';

  leapFull.style.zIndex = 10;

  leapFull.addEventListener( 'mousedown', evCanvas, false );
  leapFull.addEventListener( 'mousemove', evCanvas, false );
  leapFull.addEventListener( 'mouseup', evCanvas, false );

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

// General-purpose event handler for mouse events

function evCanvas( ev ) {
// Firefox
  if ( ev.layerX || ev.layerX === 0 ) {
    ev._x = ev.layerX;
    ev._y = ev.layerY;

// Opera
  } else if ( ev.offsetX || ev.offsetX === 0 ) {
    ev._x = ev.offsetX;
    ev._y = ev.offsetY;
  }
  var func = tool[ ev.type ];

  if ( func ) {
    func( ev );
  }
}

    var baseBoneRotation = ( new THREE.Quaternion ).setFromEuler( new THREE.Euler( 0, 0, Math.PI / 2 ) );
    var armMeshes = [];
    var boneMeshes = [];

    var renderer, scene, camera, controls;
    var peerSelected = false;
    var lastHandSphereColor;

    renderer = new THREE.WebGLRenderer( { canvas: leapfull, alpha: true }  );
    renderer.setClearColor( 0xffffff, 0 );
    renderer.setSize( window.innerWidth, window.innerHeight );

    camera = new THREE.PerspectiveCamera( 40, leapFull.width / leapFull.height, 1, 5000 );
    camera.position.set( 0, 500, 500 );

    var raycaster = new THREE.Raycaster();
    var projector = new THREE.Projector();

    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.noRotate = true;
    controls.maxDistance = 1000;

    scene = new THREE.Scene();

    var handGeometry = new THREE.SphereGeometry( 40, 16, 16 );
    var handMaterial = new THREE.MeshLambertMaterial( { color: 'red' } );
    var handSphere = new THREE.Mesh( handGeometry, handMaterial );
    handSphere.name = 'handSphere';
    handSphere.userData.rtiId = userContext.rtcId;
    scene.add( handSphere );

    var peerSphereGeometry = new THREE.SphereGeometry( 40, 16, 16 );
    var peerSphereMaterial = new THREE.MeshLambertMaterial( { color: 'red' } );
    var peerSphere = new THREE.Mesh( peerSphereGeometry, peerSphereMaterial );
    peerSphere.name = 'peerSphere';

    //peerSphere.visible = false;
    //scene.add( peerSphere );

    var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    var aLight = new THREE.AmbientLight( 0x333333 );
    scene.add( light );
    scene.add( aLight );

function arObjMover() {
  var tool = this;
  this.down = false;
  var updateData = {};

  this.mousedown = function( ev ) {
    ev.preventDefault();
    tool.started = true;

    var mouseVector = new THREE.Vector3( ( ev._x / window.innerWidth ) * 2 - 1,
                            -( ev._y / window.innerHeight ) * 2 + 1, 0.5 );
    raycaster.setFromCamera( mouseVector, camera );
    var intersects = raycaster.intersectObjects( scene.children );

    if ( intersects.length > 0 ) {
      peerSelected = true;
      scene.remove( handSphere );
      scene.add( peerSphere );

      var leapX = ( ev._x / window.innerWidth * 2 - 1 ) * 278.5;
      var leapY = -( ev._y / window.innerHeight * 2 - 1 ) * 278.5;
      var spherePos = [ leapX, leapY, 0 ];
      peerSphere.position.fromArray( spherePos );

      data.operation = 'mouseDown';
      data.position = spherePos;
      data.setHueState = false;

      var sessionId = socketServer.sessionid;
      socketServer.emit( 'peerSphere', data, sessionId );

     // updatePeerSphere( updateData );
    }
  };

  this.mousemove = function( ev ) {

    if ( tool.started && peerSelected ) {

      var leapX = ( ev._x  / window.innerWidth * 2 - 1 ) * 278.5;
      var leapY = -( ev._y  / window.innerHeight * 2 - 1 ) * 278.5;
      var spherePos = [ leapX, leapY, 0 ];
      peerSphere.position.x = leapX;
      peerSphere.position.y = leapY;
      peerSphere.position.z = 0;

// normalize to set color rgb (0-1)

      var normalizedSphere = [];
      normalizedSphere[0] = ev._x  / window.innerWidth;
      normalizedSphere[1] = ev._y  / window.innerHeight;
      normalizedSphere[2] = 0.5;

      peerSphere.material.color.setRGB(
                normalizedSphere[0],
                normalizedSphere[1],
                normalizedSphere[2] );

      data.operation = 'mouseMove';
      data.position = spherePos;
      data.color = peerSphere.material.color;
      data.setHueState = false;

      var sessionId = socketServer.sessionid;
      socketServer.emit( 'peerSphere', data, sessionId );

      // note: need to fire animate

      leapAnimate( data );
  }
};

  this.mouseup = function( ev ) {
    console.log( 'up:', ev.x, ev.y );
    tool.down = false;

  if ( tool.started && peerSelected ) {

    peerSelected = false;
    scene.remove( peerSphere );

    var leapX = ( ev._x / window.innerWidth * 2 - 1 ) * 278.5;
    var leapY = -( ev._y / window.innerHeight * 2 - 1 ) * 278.5;
    var spherePos = [ leapX, leapY, 0 ];

   // rgb (0-1)

    var normalizedSphere = [];
    normalizedSphere[0] = ev._x / window.innerWidth;
    normalizedSphere[1] = ev._y / window.innerHeight;
    normalizedSphere[2] = 0.5;

    peerSphere.material.color.setRGB(
              normalizedSphere[0],
              normalizedSphere[1],
              normalizedSphere[2] );

    data.operation = 'mouseUp';
    data.position = spherePos;
    data.color = peerSphere.material.color;
    data.setHueState = true;

    leapAnimate( data );

 var sessionId = socketServer.sessionid;
      socketServer.emit( 'peerSphere', data, sessionId );

    tool.started = false;
    }
  };
}

var tool = new arObjMover();

//------------------------

// function addMesh( meshes ) {
//   var geometry = new THREE.BoxGeometry( 1, 1, 1 );
//   var material = new THREE.MeshNormalMaterial();
//   var mesh = new THREE.Mesh( geometry, material );
//   meshes.push( mesh );
//   return mesh;
// }

// function updateMesh( bone, mesh ) {
//     mesh.position.fromArray( bone.center() );
//     mesh.setRotationFromMatrix( ( new THREE.Matrix4 ).fromArray( bone.matrix() ) );
//     mesh.quaternion.multiply( baseBoneRotation );
//     mesh.scale.set( bone.width, bone.width, bone.length );
//     scene.add( mesh );
// }

function updatePeerSphere( data ) {

if ( data.operation === 'mouseDown' ) {}

if ( data.operation === 'mouseMove' ) {}

if ( data.operation === 'mouseUp' ) {}
}

function updateHandSphere( data ) {

  setDomMouseEvent( 'leapfull', 'auto' );
  setDomMouseEvent( 'canvas0', 'none' );

  if ( data.inChooseState === true &&  peerSelected === false ) {
  scene.add( handSphere );

  lastHandSphereColor = data.color;

  handSphere.position.fromArray( data.position );
  handSphere.material.color.setRGB(
                data.color.r,
                data.color.g,
                data.color.b );
  }

  if ( data.inChooseState === false ) {
        scene.remove( handSphere );
  }
}

function ThreeToScreenPosition( obj, camera ) {
    var vector = new THREE.Vector3();

    var widthHalf = 0.5 * renderer.context.canvas.width;
    var heightHalf = 0.5 * renderer.context.canvas.height;

    obj.updateMatrixWorld();
    vector.setFromMatrixPosition( obj.matrixWorld );
    vector.project( camera );

    vector.x = ( vector.x * widthHalf ) + widthHalf;
    vector.y = -( vector.y * heightHalf ) + heightHalf;

    return {
        x: vector.x,
        y: vector.y
    };
}

function leapAnimate( data ) {

  scene.remove( handSphere );

  updatePeerSphere( data );
  updateHandSphere( data );

  renderer.render( scene, camera );
  controls.update();
 }

//  function leapAnimate( data ) {
//
//    var frame = new Leap.Frame( data );
//    var countBones = 0;
//    var countArms = 0;
//
//    scene.remove( handSphere );
//    armMeshes.forEach( function( item ) { scene.remove( item ); } );
//    boneMeshes.forEach( function( item ) { scene.remove( item ); } );
//
//    for ( var hand of frame.hands ) {
//      for ( var finger of hand.fingers ) {
//        for ( var bone of finger.bones ) {
//          if ( countBones++ === 0 ) { continue; }
//          var boneMesh = boneMeshes [ countBones ] || addMesh( boneMeshes );
//          updateMesh( bone, boneMesh );
//        }
//      }
//
//      var arm = hand.arm;
//      var armMesh = armMeshes [ countArms++ ] || addMesh( armMeshes );
//      updateMesh( arm, armMesh );
//      armMesh.scale.set( arm.width / 4, arm.width / 2, arm.length );
//    }
//    renderer.render( scene, camera );
//    controls.update();
//  }

// ------------------------------------------------------------------------------

//  socketServer.on( 'leapShare', function( data ) {
//    frame = JSON.parse( data );

//    animateTrackingData( data );
//    leapAnimate( frame );
//    } );
 }
