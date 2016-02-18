
// var data = require( './data/tracking-data' );
// var Frame = require( './lib/frame' );
// var Hand = require( './lib/hand' );
// var Finger = require( './lib/finger' );
// var Pointable = require( './lib/pointable' );
// var Bone = require( './lib/bone' );
// var Gesture = require( './lib/gesture' );
// var InteractionBox = require( './lib/interaction_box' );
//
// var glMatrix = require( 'gl-matrix' );
// var mat3 = glMatrix.mat3;
// var vec3 = glMatrix.vec3;
// var _ = require( 'underscore' );

// ---------------------------------------
function initLeapPeerHand() {

console.log( 'at leapPeerHand' );

var myFrame = new Frame( data() );
console.log( 'frame:', myFrame );

var myHands = myFrame.hands;
console.log( 'hands:', myHands );

var myFingers = myFrame.fingers;
console.log( 'fingers:', myFingers );

var myHand = myFrame.hands[0];
console.log( 'hand[0]:', myHand );

var myFinger = myFrame.fingers[1];
console.log( 'fingers[1]:', myFinger );

console.log( 'finger[1]-bone[1]:', myFinger.bones[1] );

console.log( 'finger-bone-1.center:', myFinger.bones[1].center() );
console.log( 'finger-bones.width:', myFrame.fingers[1].bones[3].width );
console.log( 'finger-bones.length:', myFinger.bones[1].length );

console.log( 'hand-arm', myHand.arm );
console.log( 'hand-arm.width', myHand.arm.width );
console.log( 'hand-arm.length', myHand.arm.length );

var myInteractionBox = myFrame.interactionBox;
console.log( 'interactionBox:', myInteractionBox );
console.log( 'interactionBox-size:', myInteractionBox.size );
console.log( 'interactionBox-center:', myInteractionBox.center );
}




//socketServer.on( 'leapShare', function( data ) {
//    frame = JSON.parse( data );
//
//    update();



// var leapFull = document.getElementById( 'leapfull' );

//    leapFull.style.width      = '100%';
//    leapFull.style.height     = '100%';
//    leapFull.style.position   = 'absolute';
//    leapFull.style.top        = '0px';
//    leapFull.style.left       = '0px';
//    leapFull.style.zIndex = 10;

//    var baseBoneRotation = ( new THREE.Quaternion ).setFromEuler( new THREE.Euler( 0, 0, Math.PI / 2 ) );
//    var armMeshes = [];
//    var boneMeshes = [];

//    var renderer, scene, camera, controls;

//    var controller = Leap.loop( { background: false }, leapAnimate );

//    //controller.connect();



//    renderer = new THREE.WebGLRenderer( { canvas: leapfull, alpha: true }  );
//    renderer.setClearColor( 0xffffff, 0 );
//    renderer.setSize( window.innerWidth, window.innerHeight );

//    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 5000 );
//    camera.position.set( -500, 500, 500 );

//    controls = new THREE.OrbitControls( camera, renderer.domElement );
//    controls.maxDistance = 1000;

//    scene = new THREE.Scene();

//  function onWindowResize() {
//    camera.aspect = window.innerWidth / window.innerHeight;
//    camera.updateProjectionMatrix();
//    renderer.setSize( window.innerWidth, window.innerHeight );
//  }

//  function addMesh( meshes ) {
//    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
//    var material = new THREE.MeshNormalMaterial();
//    var mesh = new THREE.Mesh( geometry, material );
//    meshes.push( mesh );
//    return mesh;
//  }

//  function updateMesh( bone, mesh ) {
//      mesh.position.fromArray( bone.center() );
//      mesh.setRotationFromMatrix( ( new THREE.Matrix4 ).fromArray( bone.matrix() ) );
//      mesh.quaternion.multiply( baseBoneRotation );
//      mesh.scale.set( bone.width, bone.width, bone.length );
//      scene.add( mesh );
//  }



//  function leapAnimate( frame ) {

//    var countBones = 0;
//    var countArms = 0;

//    armMeshes.forEach( function( item ) { scene.remove( item ); } );
//    boneMeshes.forEach( function( item ) { scene.remove( item ); } );

//    for ( var hand of frame.hands ) {
//      for ( var finger of hand.fingers ) {
//        for ( var bone of finger.bones ) {
//          if ( countBones++ === 0 ) { continue; }
//          var boneMesh = boneMeshes [ countBones ] || addMesh( boneMeshes );
//          updateMesh( bone, boneMesh );
//        }
//      }

//      var arm = hand.arm;
//      var armMesh = armMeshes [ countArms++ ] || addMesh( armMeshes );
//      updateMesh( arm, armMesh );
//      armMesh.scale.set( arm.width / 4, arm.width / 2, arm.length );
//    }

//    renderer.render( scene, camera );
//    controls.update();
//  }
//
