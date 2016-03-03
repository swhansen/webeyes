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

    renderer = new THREE.WebGLRenderer( { canvas: leapfull, alpha: true }  );
    renderer.setClearColor( 0xffffff, 0 );
    renderer.setSize( window.innerWidth, window.innerHeight );

    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 5000 );
    camera.position.set( -500, 500, 500 );

    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.maxDistance = 1000;

    scene = new THREE.Scene();

    var handGeometry = new THREE.SphereGeometry( 40, 16, 16 );
    var handMaterial = new THREE.MeshLambertMaterial( { color: 'red' } );
    var handSphere = new THREE.Mesh( handGeometry, handMaterial );
    handSphere.name = 'handSphere';
    scene.add( handSphere );

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
    console.log( 'updateLeapSphere:', data);

    handSphere.position.fromArray( data.position );
    handSphere.material.color.setRGB(
              data.color[0],
              data.color[1],
              data.color[2] );
    handSphere.visibility = data.visibility;
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

socketServer.on( 'leapShare', function( data ) {
    frame = JSON.parse( data );
//    animateTrackingData( data );
    leapAnimate( frame );
    } );
}
