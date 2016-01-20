
function loadLeap( participantState ) {

console.log( 'at setUpLeapLayer' );

// list the z-factors

// $( '*' ).filter( function() {
//   return $( this ).css( 'z-index' ) >= 10;
// } ).each( function() {
//   console.log( 'z-index:', $( this ), 'is:', $( this ).css( 'z-index' ) );
// } );

// tell all peers to initalize leap-recieve and subscribe to the broadcast.

// If the device is mobile then no physical device - hack

//if ( userContext.mobile === false && userContext.isLeap && participantState === 'focus' ) {
  runLeap( participantState );
//}

function runLeap( participantState ) {

  console.log( 'runLeap-state:', participantState );

if (participantState === 'peer' ) {

  socketServer.on( 'leapShare', function( data ) {
    console.log( 'at runLeap-frame:', data );
    } );
  } else {

console.log( 'runLeap-state:', participantState );

 var leapfull = document.getElementById( 'leapfull' );

  var baseBoneRotation = ( new THREE.Quaternion ).setFromEuler( new THREE.Euler( 0, 0, Math.PI / 2 ) );
  var armMeshes = [];
  var boneMeshes = [];

  var renderer, scene, camera, controls;

  //init();
  var controller = new Leap.loop( {background: true}, leapAnimate ).connect();

    renderer = new THREE.WebGLRenderer( { canvas: leapfull, alpha: 1, antialias: true, clearColor: 0xffffff }  );
    renderer.setSize( window.innerWidth, window.innerHeight );
  //  document.body.appendChild( renderer.domElement );

    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 5000 );
    camera.position.set( -500, 500, 500 );

    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.maxDistance = 1000;

    scene = new THREE.Scene();

// helpers
  //  var gridHelper = new THREE.GridHelper( 150, 10 );
  //  scene.add( gridHelper );
//
  //  var axisHelper = new THREE.AxisHelper( 150 );
  //  scene.add( axisHelper );

//  var geometry = new THREE.BoxGeometry( 300, 20, 300 );
//  var material = new THREE.MeshNormalMaterial();
//  var mesh = new THREE.Mesh( geometry, material );
//  mesh.position.set( 0, -10, 0 );
//  scene.add( mesh );

//  window.addEventListener( 'resize', onWindowResize, false );

  //}

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

  function emitLeap( data ) {
    var sessionId = socketServer.sessionid;
    socketServer.emit( 'leapShare', data, sessionId );
  }

var target = 200;
var counter = 0;

  function leapAnimate( frame ) {

counter++;

if ( counter === target ) {
 //   emitLeap( frame );
 console.log( frame );
 var jsonFrame = JSON.stringify( frame );
  emitLeap( jsonframe );
    counter = 0;
  }



    var countBones = 0;
    var countArms = 0;

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
    controls.update();
  }
}
}
}



