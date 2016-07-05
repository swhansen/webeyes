// Implements peer side Leap hand interaction
//  - listens to  leapShare ( Leap frame data JSON )
//  - listens to leapSphere for leap hand sphere
//  - emits peerSphere to leapFocus for peer IOT  position and state change

function initLeapPeerHand() {

var leapFrame;

 var leapPane = document.getElementById( 'leappane' );
 var leapFull = document.getElementById( 'leapfull' );
 document.getElementById( 'leappane' ).className = 'canvascenter';
 document.getElementById( 'leapfull' ).className = 'canvascenter';

 leapFull.style.width = '100%';
 leapFull.style.height = '100%';

// leapFull.width =  leapPane.offsetWidth;
// leapFull.height = leapPane.offsetHeight;

  var rect = leapFull.getBoundingClientRect();
  var offsetX = rect.left;
  var offsetY = rect.top;

  var viewWidth = leapFull.offsetWidth;
  var viewHeight = leapFull.offsetHeight;

  console.log( 'offset-XY:', offsetX, offsetY, 'viewWidth-WH:', viewWidth , viewHeight );

 leapFull.style.visibility = 'visible';
 leapPane.style.visibility = 'visible';

  leapFull.style.zIndex = 60;
  leapPane.style.zIndex = 60;

  moveLayertoTop( 'leappane' );
  moveLayertoTop( 'leapfull' );

  leapFull.addEventListener( 'mousedown', evCanvas, false );
  leapFull.addEventListener( 'mousemove', evCanvas, false );
  leapFull.addEventListener( 'mouseup', evCanvas, false );

    var baseBoneRotation = ( new THREE.Quaternion ).setFromEuler( new THREE.Euler( 0, 0, Math.PI / 2 ) );
    var armMeshes = [];
    var boneMeshes = [];

    var renderer, scene, camera, controls;
    var peerHands;
    var peerSelected = false;
    var lastHandSphereColor;

    renderer = new THREE.WebGLRenderer( { canvas: leapfull, alpha: true }  );
    renderer.setClearColor( 0xffffff, 0 );
    renderer.setSize( viewWidth, viewHeight );

    camera = new THREE.PerspectiveCamera( 40, leapFull.width / leapFull.height, 1, 5000 );
    peerHands = new THREE.Object3D();

// reverse the camera for peer to orient the hands

    camera.position.set( 0, 0, 420 );

//   controls = new THREE.OrbitControls( camera, renderer.domElement );
//   controls.enableRotate = false;
//   controls.enabled= false;
//   controls.maxDistance = 1000;

    var raycaster = new THREE.Raycaster();
    var projector = new THREE.Projector();

    scene = new THREE.Scene();

    var handGeometry = new THREE.SphereGeometry( 30, 16, 16 );
    var handMaterial = new THREE.MeshLambertMaterial( { color: 'red' } );
    var handSphere = new THREE.Mesh( handGeometry, handMaterial );
    handSphere.name = 'handSphere';
    handSphere.userData.rtiId = userContext.rtcId;
    scene.add( handSphere );

    var peerSphereGeometry = new THREE.SphereGeometry( 40, 16, 16 );
    var peerSphereMaterial = new THREE.MeshLambertMaterial( { color: 'red' } );
    var peerSphere = new THREE.Mesh( peerSphereGeometry, peerSphereMaterial );
    peerSphere.name = 'peerSphere';

    var testSphereGeometry = new THREE.SphereGeometry( 10, 16, 16 );
    var testSphere = new THREE.Mesh( testSphereGeometry, peerSphereMaterial );
    testSphere.name = 'testSphere';
      testSphere.position.x = 0;
      testSphere.position.y = 0;
      testSphere.position.z = 0;
    scene.add(testSphere);

    var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    var aLight = new THREE.AmbientLight( 0x333333 );
    scene.add( light );
    scene.add( aLight );

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

function arObjMover() {
  var tool = this;
  this.down = false;
  var data = {};
  var mp = {};
  var spherePos;

  this.mousedown = function( ev ) {
    ev.preventDefault();
    tool.started = true;

   var mouseVector = new THREE.Vector3( ( ev._x / viewWidth ) * 2 - 1,
                           -( ev._y / viewHeight ) * 2 + 1, 0.5 );
   raycaster.setFromCamera( mouseVector, camera );
   var intersects = raycaster.intersectObjects( scene.children );
   console.log( 'intersects', intersects );

    if ( intersects.length > 0 ) {
      peerSelected = true;
      scene.remove( handSphere );
      scene.add( peerSphere );

      // normalized in canvas

      mp.x = ( ev._x - offsetX ) / viewWidth * 2 - 1;
      mp.y = -( ev._y - offsetY ) / viewHeight * 2 + 1;

      var mouseSphereX = mp.x * 278.5;
      var mouseSphereY = mp.y * 278.5;

      console.log( 'box0:', box0Width, box0Height );
      console.log( 'offset:', offsetX, offsetY );
      console.log( 'viewWidth:', viewWidth, viewHeight );

      console.log( 'down-mp:', mp.x, mp.y );

      spherePos = [ mouseSphereX, mouseSphereY, 0 ];

    //  peerSphere.position.fromArray( spherePos );

      peerSphere.position.x = mouseSphereX;
      peerSphere.position.y = mouseSphereY;
      peerSphere.position.z = 0;

      var normalizedRGB = [];
      normalizedRGB[0] = ev._x  / box0Width;
      normalizedRGB[1] = ev._y  / box0Height;
     // normalizedRGB[2] = lastHandSphereColor.b;
      normalizedRGB[2] = 0.5;
      peerSphere.material.color.setRGB(
                normalizedRGB[0],
                normalizedRGB[1],
                normalizedRGB[2] );

      data.operation = 'mouseDown';
      data.position = spherePos;
      data.setHueState = false;

      renderer.render( scene, camera );

      var sessionId = socketServer.sessionid;
      socketServer.emit( 'peerSphere', data, sessionId );
    }
  };

  this.mousemove = function( ev ) {

    if ( tool.started === true && peerSelected === true ) {

      mp.x = ( ev._x - offsetX ) / viewWidth * 2 - 1;
      mp.y = -( ev._y - offsetY ) / viewHeight * 2 + 1;

      console.log( 'move-mp:', mp.x, mp.y );

    //  var mouseSphereX = ( ev._x  / box0Width ) * 2 - 1 ;
    //  var mouseSphereY = -( ev._y  / box0Height ) * 2 + 1 ;

      var mouseSphereX = mp.x * 278.5;
      var mouseSphereY = mp.y * 278.5;
      spherePos = [ mouseSphereX, mouseSphereY, 0 ];
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

 //     console.log( 'peer mouseMove', data );

      renderer.render( scene, camera );

      var sessionId = socketServer.sessionid;
      socketServer.emit( 'peerSphere', data, sessionId );
  }
};

  this.mouseup = function( ev ) {
    tool.down = false;

  if ( tool.started && peerSelected ) {

    peerSelected = false;
    scene.remove( peerSphere );

     var mouseSphereX = (( ev._x / box0Width * 2 - 1 ) * 278.5 ) - 285.5;
     var mouseSphereY = -( ( ev._y / box0Width * 2 - 1 ) * 278.5 ) + 278.5;

   // rgb (0-1)

    var normalizedRGB = [];
    normalizedRGB[0] = ev._x / box0Width;
    normalizedRGB[1] = ev._y / box0Width;
  //  normalizedRGB[2] = lastHandSphereColor.b;
    normalizedRGB[2] = 0.5;

    peerSphere.material.color.setRGB(
              normalizedRGB[0],
              normalizedRGB[1],
              normalizedRGB[2] );

    spherePos = [ mouseSphereX, mouseSphereY, 0 ];
    data.operation = 'mouseUp';
    data.position = spherePos;
    data.color = normalizedRGB;
    data.setHueState = true;

    console.log( 'peer mouse up', data );

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
    peerHands.add( mesh );

// rotate the hands to come at the user

    peerHands.rotation.x = -0.8;
    peerHands.rotation.y = Math.PI;
    peerHands.position.set( 0.0, -100.0, 0.0 );
    peerHands.scale.set( 1.5, 1.5, 1.5 );

    scene.add( peerHands );

     window.scene = scene;
 }

function updateHandSphere( data ) {

 // setDomPointerEvent( 'leappane', 'auto' );
 // setDomPointerEvent( 'canvaspane', 'none' );

  document.getElementById( 'leappane' ).style.pointerEvents = 'auto';
  document.getElementById( 'canvaspane' ).style.pointerEvents = 'none';

  if ( data.inChooseState === true &&  peerSelected === false ) {
  scene.add( handSphere );

  lastHandSphereColor = data.color;

  handSphere.position.fromArray( data.position);

// change orientation due to reverse of hand on peer
// adjust Y due to hand position

  handSphere.position.x = handSphere.position.x * -1.0;
  handSphere.position.y = handSphere.position.y  - 150.0;

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

// the focus sphere

function sphereAnimate( data ) {
  scene.remove( handSphere );
  updateHandSphere( data );
  renderer.render( scene, camera );
 }

  function leapAnimate( leapFrame ) {

    var frame = new Leap.Frame( leapFrame );
    var countBones = 0;
    var countArms = 0;

    scene.remove( handSphere );
    scene.remove( peerHands );
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
}

// ------------------------------------------------------------------------------

  socketServer.on( 'leapShare', function( leapData ) {

// case where hand is removed on focus side

    if ( leapData === 'remove' ) {
      console.log( 'focus hand remove' );
      scene.remove( peerHands );
 //     armMeshes.forEach( function( item ) { scene.remove( item ); } );
 //     boneMeshes.forEach( function( item ) { scene.remove( item ); } );
      renderer.render( scene, camera );
  //    controls.update();
    } else {
    leapFrame = JSON.parse( leapData );
    leapAnimate( leapFrame );
    } } );

// sphere coming in from focus

  socketServer.on( 'leapSphere', function( data ) {
    sphereAnimate( data );
      } );

 }
