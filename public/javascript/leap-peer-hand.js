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
    leapAnimate( data );
      } );

 var leapFull = document.getElementById( 'leapfull' );

    leapFull.style.width      = '100%';
    leapFull.style.height     = '100%';
    leapFull.style.position   = 'absolute';
    leapFull.style.top        = '0px';
    leapFull.style.left       = '0px';
    leapFull.style.zIndex = 10;

    var baseBoneRotation = ( new THREE.Quaternion ).setFromEuler( new THREE.Euler( 0, 0, Math.PI / 2 ) );
    var armMeshes = [];
    var boneMeshes = [];

    var renderer, scene, camera, controls;

    renderer = new THREE.WebGLRenderer( { canvas: leapFull, alpha: true }  );
    renderer.setClearColor( 0xffffff, 0 );
    renderer.setSize( window.innerWidth, window.innerHeight );

    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 5000 );
    camera.position.set( -500, 500, 500 );

    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.maxDistance = 1000;



    leapFull.addEventListener( 'mousemove', onDocumentMouseMove, false );
    leapFull.addEventListener( 'mousedown', onDocumentMouseDown, false );
    leapFull.addEventListener( 'mouseup', onDocumentMouseUp, false );

    scene = new THREE.Scene();

    var handGeometry = new THREE.SphereGeometry( 40, 16, 16 );
    var handMaterial = new THREE.MeshLambertMaterial( { color: 'red' } );
    var handSphere = new THREE.Mesh( handGeometry, handMaterial );
    handSphere.name = 'handSphere';
    handSphere.userData.rtiId = userContext.rtcId;
    scene.add( handSphere );

    var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    var aLight = new THREE.AmbientLight( 0x333333 );
    scene.add( light );
    scene.add( aLight );

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }

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

  function updateLeapSphere( data ) {

    handSphere.position.fromArray( data.position );
    handSphere.material.color.setRGB(
              data.color.r,
              data.color.g,
              data.color.b );
    handSphere.visible = data.visible;
    scene.add( handSphere );
  }

function leapAnimate( data ) {

  scene.remove( handSphere );
  updateLeapSphere( data );
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

// ---------------------------------------------------------------------------

function onDocumentMouseMove( event ) {

  event.preventDefault();


  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  console.log( mouse.x, mouse.y );

        //

        var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
        projector.unprojectVector( vector, camera );

        var ray = new THREE.Ray( camera.position, vector.subSelf( camera.position ).normalize() );

        console.log( vector );

    }


// onDocumentMouseMove: function (event) {
//   event.preventDefault();

//   // Get mouse position
//   var mouseX = (event.clientX / window.innerWidth) * 2 - 1;
//   var mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

//   // Get 3D vector from 3D mouse position using 'unproject' function
//   var vector = new THREE.Vector3(mouseX, mouseY, 1);
//   vector.unproject( camera );

//   // Set the raycaster position
//   raycaster.set( camera.position, vector.sub( camera.position ).normalize() );

//   if ( selection) {
//     // Check the position where the plane is intersected
//     var intersects = lesson10.raycaster.intersectObject(lesson10.plane);
//     // Reposition the object based on the intersection point with the plane
//     lesson10.selection.position.copy(intersects[0].point.sub(lesson10.offset));
//   } else {
//     // Update position of the plane if need
//     var intersects = lesson10.raycaster.intersectObjects(lesson10.objects);
//     if (intersects.length > 0) {
//       lesson10.plane.position.copy(intersects[0].object.position);
//       lesson10.plane.lookAt(lesson10.camera.position);
//     }
//   }
// };

// onDocumentMouseUp: function (event) {
//   // Enable the controls
//   lesson10.controls.enabled = true;
//   lesson10.selection = null;
// }








// ------------------------------------------------------------------------------

socketServer.on( 'leapShare', function( data ) {
    frame = JSON.parse( data );

//    animateTrackingData( data );
    leapAnimate( frame );
    } );
}
