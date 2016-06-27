// Implements peer side Leap hand interaction
//  - listens to  leapShare ( Leap frame data JSON )
//  - listens to leapSphere for leap hand sphere
//  - emits peerSphere to leapFocus for peer IOT  position and state change

function initLeapPeerHand() {

var leapFrame;

 var leapPane = document.getElementById( 'leappane' );
 var leapFull = document.getElementById( 'leapfull' );
 document.getElementById( 'leappane' ).className = 'canvascenter';

 leapFull.style.width = '100%';
 leapFull.style.height = '100%';
 leapFull.width =  leapPane.offsetWidth;
 leapFull.height = leapPane.offsetHeight;

 leapFull.style.visibility = 'visible';
 leapPane.style.visibility = 'visible';

  leapFull.style.zIndex = 60;
  leapPane.style.zIndex = 60;

  moveLayertoTop( 'leappane' );
  moveLayertoTop( 'leapfull' );

  leapFull.addEventListener( 'mousedown', evCanvas, false );
  leapFull.addEventListener( 'mousemove', evCanvas, false );
  leapFull.addEventListener( 'mouseup', evCanvas, false );

//  function onWindowResize() {
//      camera.aspect = window.innerWidth / window.innerHeight;
//      camera.updateProjectionMatrix();
//      renderer.setSize( window.innerWidth, window.innerHeight );
//  }

// General-purpose event handler for mouse events

function evCanvas( ev ) {

// Firefox
  if ( ev.layerX || ev.layerX === 0 ) {
    ev._x = -ev.layerX;
    ev._y = -ev.layerY;

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
    renderer.setSize( box0Width, box0Height );

    camera = new THREE.PerspectiveCamera( 40, leapFull.width / leapFull.height, 1, 5000 );

// reverse the camera for peer to orient the hands

    camera.position.set( 0, -600, -100 );

   controls = new THREE.OrbitControls( camera, renderer.domElement );
   controls.enableRotate = false;
   controls.enabled= false;
   controls.maxDistance = 1000;

    var raycaster = new THREE.Raycaster();
    var projector = new THREE.Projector();

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

    var mouseVector = new THREE.Vector3( ( ev._x / box0Width ) * 2 - 1,
                            -( ev._y / box0Height ) * 2 + 1, 0.5 );
    raycaster.setFromCamera( mouseVector, camera );
    var intersects = raycaster.intersectObjects( scene.children );

    if ( intersects.length > 0 ) {
      peerSelected = true;
      scene.remove( handSphere );
      scene.add( peerSphere );

      var mouseSphereX = ( ev._x / box0Width * 2 - 1 ) * 278.5;
      var mouseSphereY = -( ev._y / box0Height * 2 - 1 ) * 278.5;
      var spherePos = [ mouseSphereX, mouseSphereY, 0 ];
      peerSphere.position.fromArray( spherePos );

      var normalizedRGB = [];
      normalizedRGB[0] = ev._x  / box0Width;
      normalizedRGB[1] = ev._y  / box0Height;
      normalizedRGB[2] = lastHandSphereColor.b;

      peerSphere.material.color.setRGB(
                normalizedRGB[0],
                normalizedRGB[1],
                normalizedRGB[2] );

      data.operation = 'mouseDown';
      data.position = spherePos;
      data.setHueState = false;

      var sessionId = socketServer.sessionid;
      socketServer.emit( 'peerSphere', data, sessionId );

    }
  };

  this.mousemove = function( ev ) {

    if ( tool.started && peerSelected ) {

      var mouseSphereX = ( ev._x  / box0Width * 2 - 1 ) * 278.5;
      var mouseSphereY = -( ev._y  / box0Height * 2 - 1 ) * 278.5;
      var spherePos = [ mouseSphereX, mouseSphereY, 0 ];
      peerSphere.position.x = mouseSphereX;
      peerSphere.position.y = mouseSphereY;
      peerSphere.position.z = 0;

// normalize to set color rgb (0-1)

      var normalizedRGB = [];
      normalizedRGB[0] = ev._x  / box0Width;
      normalizedRGB[1] = ev._y  / box0Height;
      normalizedRGB[2] = lastHandSphereColor.b;

      peerSphere.material.color.setRGB(
                normalizedRGB[0],
                normalizedRGB[1],
                normalizedRGB[2] );

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
    tool.down = false;

  if ( tool.started && peerSelected ) {

    peerSelected = false;
    scene.remove( peerSphere );

    var mouseSphereX = ( ev._x / box0Width * 2 - 1 ) * 278.5;
    var mouseSphereY = -( ev._y / box0Width * 2 - 1 ) * 278.5;
    var spherePos = [ mouseSphereX, mouseSphereY, 0 ];

   // rgb (0-1)

    var normalizedRGB = [];
    normalizedRGB[0] = ev._x / box0Width;
    normalizedRGB[1] = ev._y / box0Width;
    normalizedRGB[2] = lastHandSphereColor.b;

    peerSphere.material.color.setRGB(
              normalizedRGB[0],
              normalizedRGB[1],
              normalizedRGB[2] );

    data.operation = 'mouseUp';
    data.position = spherePos;
    data.color = normalizedRGB;
    data.setHueState = true;

    leapAnimate( data );

    var sessionId = socketServer.sessionid;
      socketServer.emit( 'peerSphere', data, sessionId );

    tool.started = false;

    setDomPointerEvent( 'leappane', 'none' );
    setDomPointerEvent( 'canvaspane', 'auto' );
    }
  };
}

var tool = new arObjMover();

//------------------------

 function addMesh( meshes ) {
   var geometry = new THREE.BoxGeometry( 1, 1, 1 );
   var material = new THREE.MeshNormalMaterial();
   var mesh = new THREE.Mesh( geometry, material );
   meshes.push( mesh );
   return mesh;
 }
 function updateMesh( bone, mesh ) {
     mesh.position.fromArray( bone.center() );
     mesh.setRotationFromMatrix( ( new THREE.Matrix4 ).fromArray( bone.matrix() ) );
     mesh.quaternion.multiply( baseBoneRotation );
     mesh.scale.set( bone.width, bone.width, bone.length );
     scene.add( mesh );
 }

// function updatePeerSphere( data ) {
//
// if ( data.operation === 'mouseDown' ) {}
//
// if ( data.operation === 'mouseMove' ) {}
//
// if ( data.operation === 'mouseUp' ) {}
// }

function updateHandSphere( data ) {

 // setDomPointerEvent( 'leappane', 'auto' );
 // setDomPointerEvent( 'canvaspane', 'none' );

  document.getElementById( 'leappane' ).style.pointerEvents = 'auto';
  document.getElementById( 'canvaspane' ).style.pointerEvents = 'none';

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

function sphereAnimate( data ) {

  scene.remove( handSphere );

  updateHandSphere( data );
//
  renderer.render( scene, camera );
 // controls.update();
 }

  function leapAnimate( leapFrame ) {

    var frame = new Leap.Frame( leapFrame );
    var countBones = 0;
    var countArms = 0;

    scene.remove( handSphere );
    armMeshes.forEach( function( item ) { scene.remove( item ); } );
    boneMeshes.forEach( function( item ) { scene.remove( item ); } );

    for ( var hand of frame.hands ) {
      for ( var finger of hand.fingers ) {
        for ( var bone of finger.bones ) {
          if ( countBones++ === 0 ) { continue; }
          var boneMesh = boneMeshes [ countBones ] || addMesh( boneMeshes );
          updateMesh( bone, boneMesh );
        }
      }

      var arm = hand.arm;
      var armMesh = armMeshes [ countArms++ ] || addMesh( armMeshes );
      updateMesh( arm, armMesh );
      armMesh.scale.set( arm.width / 4, arm.width / 2, arm.length );
    }
    renderer.render( scene, camera );
    //controls.update();
  }

// ------------------------------------------------------------------------------

  socketServer.on( 'leapShare', function( leapData ) {

// case where hand is remove on focus

    if ( leapData === 'remove' ) {
      armMeshes.forEach( function( item ) { scene.remove( item ); } );
      boneMeshes.forEach( function( item ) { scene.remove( item ); } );
      renderer.render( scene, camera );
     // controls.update();
    }
    leapFrame = JSON.parse( leapData );
    leapAnimate( leapFrame );
    } );

  socketServer.on( 'leapSphere', function( data ) {
    sphereAnimate( data );
      } );

 }
