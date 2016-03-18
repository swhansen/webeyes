//
// Implements a peer side Leap hand based on raw tracking JSON data from
// a socket.io broadcast sent by leap-focus
//

function initLeapPeerHand() {

socketServer.on( 'leapSphere', function( data ) {
    leapAnimate( data );
      } );

 var leapFull = document.getElementById( 'leappane' );

    leapFull.style.width      = '100%';
    leapFull.style.height     = '100%';
    leapFull.style.position   = 'absolute';
    leapFull.style.top        = '0px';
    leapFull.style.left       = '0px';
    leapFull.style.zIndex = 300;

// General-purpose event handler for mouse events.

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

    leapFull.addEventListener( 'mousedown', evCanvas, false );
    leapFull.addEventListener( 'mousemove', evCanvas, false );
    leapFull.addEventListener( 'mouseup', evCanvas, false );

    var baseBoneRotation = ( new THREE.Quaternion ).setFromEuler( new THREE.Euler( 0, 0, Math.PI / 2 ) );
    var armMeshes = [];
    var boneMeshes = [];

    var renderer, scene, camera, controls;
    var peerSelected = false;

    renderer = new THREE.WebGLRenderer( { canvas: leapfull, alpha: true }  );
    renderer.setClearColor( 0xffffff, 0 );
    renderer.setSize( window.innerWidth, window.innerHeight );

    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 5000 );
    camera.position.set( -500, 500, 500 );

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
    peerSphere.visible = false;
    scene.add( peerSphere );

    var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    var aLight = new THREE.AmbientLight( 0x333333 );
    scene.add( light );
    scene.add( aLight );

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

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

      console.log( 'intersected:', intersects );


    var leapX = ( ev._x / window.innerWidth * 2 - 1 ) * 278.5;
    var leapY = -( ev._y / window.innerHeight * 2 - 1 ) * 278.5;
    var spherePos = [ leapX, leapY, 0 ];

    updateData.name = 'peerSphere';
    updateData.operation = 'start';
    updateData.originRtcId = userContext.rtcId;
    updateData.visible = peerSphere.visible;
    updateData.position = spherePos;
    //updateData.color = peerSphere.material.color;
    updateData.source = 'peer';
    updateData.setHueState = false;

    scene.remove( handSphere );

    updatePeerSphere( updateData );

    }
  };

  this.mousemove = function( ev ) {

  if ( tool.started && peerSelected ) {

    var leapX = ( ev._x / window.innerWidth * 2 - 1 ) * 278.5;
    var leapY = -( ev._y / window.innerHeight * 2 - 1 ) * 278.5;
    var spherePos = [ leapX, leapY, 0 ];

// normalize to set color rgb (0-1)

    var normalizedSphere = [];
    normalizedSphere[0] = ev._x / window.innerWidth;
    normalizedSphere[1] = ev._y / window.innerHeight;
    normalizedSphere[2] = 0.5;

    peerSphere.material.color.setRGB(
              normalizedSphere[0],
              normalizedSphere[1],
              normalizedSphere[2] );

    updateData.name = 'handSphere';
    updateData.operation = 'mouseMove';
    updateData.originRtcId = userContext.rtcId;
    updateData.visible = true;
    updateData.position = spherePos;
    updateData.color = peerSphere.material.color;
    updateData.source = 'peer';
    updateData.setHueState = false;

    leapAnimate( updateData );
  }
};

  this.mouseup = function( ev ) {
    console.log( 'up:', ev.x, ev.y );
    tool.down = false;
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

    updateData.name = 'peerSphere';
    updateData.operation = 'mouseUp';
    updateData.originRtcId = userContext.rtcId;
    updateData.visible = false;
    updateData.position = spherePos;
    updateData.color = peerSphere.material.color;
    updateData.source = 'peer';
    updateData.setHueState = true;

    //updatePeerSphere( updateData );
    leapAnimate( updateData );
    tool.started = false;

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

  if ( data.operation === 'mouseMove' ) {
    scene.add( peerSphere );
    scene.remove( handSphere );
    peerSelected = true;

    peerSphere.position.fromArray( data.position );
    peerSphere.material.color.setRGB(
                data.color.r,
                data.color.g,
                data.color.b );
      peerSphere.visible = data.visible;

   var sessionId = socketServer.sessionid;
      socketServer.emit( 'leapSphere', data, sessionId );

  } else if ( data.operation === 'mouseUp' ) {
     scene.remove( peerSphere );

     var sessionId = socketServer.sessionid;
      socketServer.emit( 'leapSphere', data, sessionId );
    }
}

function updateHandSphere( data ) {

 if ( data.inChooseState === true &&  peerSelected === false ) {
  scene.add( handSphere );
 }

  handSphere.position.fromArray( data.position );
  handSphere.material.color.setRGB(
                data.color.r,
                data.color.g,
                data.color.b );
 // handSphere.visible = data.visible;
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
  scene.remove( peerSphere );


  updatePeerSphere( data );
  updateHandSphere( data );

  //requestAnimationFrame( leapAnimate );

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
