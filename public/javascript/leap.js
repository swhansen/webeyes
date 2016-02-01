
function loadLeap( participantState ) {

  var renderer, scene, camera, controls;

console.log( 'at setUpLeapLayer' );

// list the z-factors

// $( '*' ).filter( function() {
//   return $( this ).css( 'z-index' ) >= 10;
// } ).each( function() {
//   console.log( 'z-index:', $( this ), 'is:', $( this ).css( 'z-index' ) );
// } );

// tell all peers to initalize leap-recieve and subscribe to the broadcast.


if ( participantState === 'peer' ) {
  leapPeer();
  } else {
   leapFocus();
 }

function leapPeer() {

  console.log( ' at leapPeer' );

  socketServer.on( 'leapShare', function( data ) {
    //console.log( 'at runLeap-frame:', JSON.parse( data ) );
    leapAnimate( data );
    } );

  var leapfull = document.getElementById( 'leapfull' );

  var baseBoneRotation = ( new THREE.Quaternion ).setFromEuler( new THREE.Euler( 0, 0, Math.PI / 2 ) );
  var armMeshes = [];
  var boneMeshes = [];

//  var renderer, scene, camera, controls;


//  sphere = new THREE.Mesh( new THREE.SphereGeometry(1), new THREE.MeshBasicMaterial(0x0000ff) );
//  scene.add( sphere );

    renderer = new THREE.WebGLRenderer( { canvas: leapfull, alpha: 1, antialias: true, clearColor: 0xffffff }  );
    renderer.setSize( window.innerWidth, window.innerHeight );

    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 5000 );
    camera.position.set( -500, 500, 500 );

    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.maxDistance = 1000;

    scene = new THREE.Scene();

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


  function leapAnimate( data ) {

  frame = JSON.parse( data );

  //console.log('peer leapAnimate..parse:', frame );



   var countBones = 0;
   var countArms = 0;

   //armMeshes.forEach( function( item ) { scene.remove( item ); } );
   //boneMeshes.forEach( function( item ) { scene.remove( item ); } );

   //for ( var hand of frame.hands ) {

    if (frame.pointables.length > 0) {
    var position = frame.pointables[2].stabilizedTipPosition;

    var element = document.getElementById( 'position' );

    element.style.left =  Math.abs( position[0] );
    element.style.top =  position[1];
    var normalized = [];

for  ( i = 0; i < position.lenght; i++ ) {

normalized[i] = ( ( position[i] - frame.interactionBox.center[i] ) / frame.interactionBox.size[i] ) + 0.5 ;

console.log( 'normalized:', normalized[i] );
}
console.log( 'normalized:', normalized[i] );


//InteractionBox.prototype.normalizePoint = function(position, clamp) {
//  var vec = vec3.fromValues(
//    ((position[0] - this.center[0]) / this.size[0]) + 0.5,
//    ((position[1] - this.center[1]) / this.size[1]) + 0.5,
//    ((position[2] - this.center[2]) / this.size[2]) + 0.5
//  );

    element.style.left =  window.innerWidth * normalized[0] + 'px' ;
    element.style.top =  window.innerHeight * (1 - normalized[1]) + 'px';


   // var normalized = frame.interactionBox.normalizePoint(position);

   // var x = window.innerWidth * normalized[0];
    //var y = window.innerHeight * (1 - normalized[1]);

    console.log("X: " + Math.abs( position[0] ) + " Y: " + position[1] );
    console.log( 'interactionBox:', frame.interactionBox );

    //console.log( 'boneTest:', bone);
  }

   // for ( var finger of hand.fingers ) {

   //   for ( var bone of finger.bones ) {

   //     if ( countBones++ === 0 ) { continue; }

   //     var boneMesh = boneMeshes [ countBones ] || addMesh( boneMeshes );
   //     updateMesh( bone, boneMesh );
   //   }
   // }

   //  var arm = hand.arm;
   //  var armMesh = armMeshes [ countArms++ ] || addMesh( armMeshes );
   //  updateMesh( arm, armMesh );
   //  armMesh.scale.set( arm.width / 4, arm.width / 2, arm.length );
  // }

  // renderer.render( scene, camera );
  // controls.update();
  }
}

function leapFocus() {

  console.log( ' at leepFocus' );

 var leapfull = document.getElementById( 'leapfull' );

  var baseBoneRotation = ( new THREE.Quaternion ).setFromEuler( new THREE.Euler( 0, 0, Math.PI / 2 ) );
  var armMeshes = [];
  var boneMeshes = [];

  var renderer, scene, camera, controls;

  var controller = Leap.loop( {background: true}, leapAnimate );
  controller.connect();

function emitLeap( data ) {
    var sessionId = socketServer.sessionid;
    socketServer.emit( 'leapShare', JSON.stringify( data ), sessionId );
  }

    controller.on( 'beforeFrameCreated', function( frameData ) { emitLeap (frameData); });

    renderer = new THREE.WebGLRenderer( { canvas: leapfull, alpha: 1, antialias: true, clearColor: 0xffffff }  );
    renderer.setSize( window.innerWidth, window.innerHeight );

camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 5000 );
    camera.position.set( -500, 500, 500 );

    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.maxDistance = 1000;

    scene = new THREE.Scene();

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

  function leapAnimate( frame ) {

 //console.log( 'leapFocus-frame:', frame );

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
