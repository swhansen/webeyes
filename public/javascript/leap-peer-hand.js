//
// Implements a peer side Leap hand based on raw tracking JSON data from
// a socket.io broadcast sent by leap-focus
//

function initLeapPeerHand() {

// $( '*' ).filter( function() {
//    return $( this ).css( 'z-index' ) >= 10;
//  } ).each( function() {
//    console.log( 'z-index:', $( this ), 'is:', $( this ).css( 'z-index' ) );
//  } );

socketServer.on( 'leapSphere', function( data ) {
  //console.log( 'handSphere - data:', data );
    leapAnimate( data );
      } );

 var leapFull = document.getElementById( 'leappane' );

    leapFull.style.width      = '100%';
    leapFull.style.height     = '100%';
    leapFull.style.position   = 'absolute';
    leapFull.style.top        = '0px';
    leapFull.style.left       = '0px';
    leapFull.style.zIndex = 300;

    leapFull.addEventListener( 'mousedown', evCanvas, false );
    leapFull.addEventListener( 'mousemove', evCanvas, false );
    leapFull.addEventListener( 'mouseup', evCanvas, false );

    var baseBoneRotation = ( new THREE.Quaternion ).setFromEuler( new THREE.Euler( 0, 0, Math.PI / 2 ) );
    var armMeshes = [];
    var boneMeshes = [];

    var renderer, scene, camera, controls;

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

    var selectState = false;

    scene = new THREE.Scene();

    var handGeometry = new THREE.SphereGeometry( 40, 16, 16 );
    var handMaterial = new THREE.MeshLambertMaterial( { color: 'red' } );
    var handSphere = new THREE.Mesh( handGeometry, handMaterial );
    handSphere.name = 'handSphere';
    handSphere.userData.rtiId = userContext.rtcId;
    scene.add( handSphere );

    var testGeometry = new THREE.SphereGeometry( 20, 16, 16 );
    var testMaterial = new THREE.MeshLambertMaterial( { color: 'red' } );
    var testSphere = new THREE.Mesh( testGeometry, testMaterial );
    testSphere.position.set( 0.0, 0.0, 0.0 );
    scene.add( testSphere );

    var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    var aLight = new THREE.AmbientLight( 0x333333 );
    scene.add( light );
    scene.add( aLight );

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }

// The general-purpose event handler for mouse events.

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

  this.mousedown = function( ev ) {
    tool.down = true;

  var mouseVector = new THREE.Vector3( ( ev._x / window.innerWidth ) * 2 - 1,
                            -( ev._y / window.innerHeight ) * 2 + 1, 0.5 );
  raycaster.setFromCamera( mouseVector, camera );
  var intersects = raycaster.intersectObjects( scene.children );

  if ( intersects.length > 0 ) {
    console.log( 'intersects:', intersects );
    selectState = true;
    }
  };

  this.mousemove = function( ev ) {
    if ( tool.down && selectState ) {
  //  console.log( 'moving object:', ev.x, ev.y );

    var leapX = ( ev._x / window.innerWidth * 2 - 1 ) * 278.5;
    var leapY = -( ev._y / window.innerHeight * 2 + 1) * 278.5;


    //var leapY = -( 400 + 52) / ( window.innerWidth ) * ev._y;

    console.log( 'mx, w.inner, leapX:', ex._x, window.innerWidth, leapX)

   var leapPos = [ leapX, leapY, 0 ];



; //  var mouseVector = new THREE.Vector3( ( ev._x / window.innerWidth )  * 2 - 1,
 //                          -( ev._y / window.innerHeight )  * 2 + 1, 1.0 );

 //  console.log( 'mouseVector:', mouseVector );

 //  //var foo = raycaster.setFromCamera( mouseVector, camera );

 // mouseVector.unproject( camera );
 // console.log( 'mv-unProject:', mouseVector );

 // var dir = mouseVector.sub( camera.position ).normalize();
 // console.log( 'dir:', dir );

 // var distance = -camera.position.z / dir.z;
 // console.log( 'distance:', distance );

 // var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );

    //var ray = new THREE.Ray( camera.position, mouseVector.subSelf( camera.position ).normalize() );
//console.log( 'ray:', ray );

        var updateData = {};
        updateData.operation = 'move';
        updateData.visible = handSphere.visible;
        updateData.position = leapPos;
        updateData.color = handSphere.material.color;
        updateData.name = 'handSphere';
        updateData.originRtcId = userContext.rtcId;

        console.log( 'mouseMove-updateData:', updateData );


        leapAnimate( updateData );
    }
  };

  this.mouseup = function( ev ) {
      console.log( 'up:', ev.x, ev.y );
      tool.down = false;
      selectState = false;
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

  function updateLeapSphere( data ) {

    handSphere.position.fromArray( data.position );
    handSphere.material.color.setRGB(
              data.color.r,
              data.color.g,
              data.color.b );
    handSphere.visible = data.visible;

   // console.log('screen from three:', ThreeToScreenPosition( handSphere, camera ) );
  }

// convert the three object into screen coordinates

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

// get it to (-1 to 1) to match normalized mouse
// normalizeSphere = ( sphere.x / interactionbox.x) * 2 - 1;

  //scene.remove( handSphere );
  updateLeapSphere( data );
  renderer.render( scene, camera );

 // var sphereScreenCoord = ThreeToScreenPosition( handSphere, camera );
 // console.log( 'obj Screen Coord:', sphereScreenCoord.x, sphereScreenCoord.y );

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
