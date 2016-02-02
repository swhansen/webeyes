
function loadLeap( participantState ) {

  var renderer, scene, camera, controls;

//console.log( 'at setUpLeapLayer' );

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

const MAX_HANDS = 2; //More than 1 hand drops DOM performance
const FINGER_COUNT = 5;
const LEAP_MIN = { 'x':-15.0, 'y':15.0, 'z':-20.0 };
const LEAP_MAX = { 'x': 15.0, 'y':26.0, 'z': 20.0 };
const LABEL_OFFSET = { 'x': 30.0, 'y': -20 };
const PALM_HTML = "<div class='palm'><img src='images/palm.png' /></div>";
const DIP_HTML  = "<div class='dip'><img src='images/dip.png' /></div>";
const PIP_HTML  = "<div class='pip'><img src='images/pip.png' /></div>";
const MCP_HTML  = "<div class='mcp'><img src='images/mcp.png' /></div>";
const LABEL_HTML = "<div class='finger_label'></div>";

var showLabels = true;
var screenWidth, screenHeight;
var normalToScreen = 1.0;
      //Symantic sugar. Maps finger names to IDs.
      const fingerMap = {
        'thumb': 0,
        'index': 1,
        'middle':2,
        'ring': 3,
        'pinky': 4,
        0: 'thumb',
        1: 'index',
        2: 'middle',
        3: 'ring',
        4: 'pinky'
      };



  socketServer.on( 'leapShare', function( data ) {
    //console.log( 'at runLeap-frame:', JSON.parse( data ) );
    leapAnimate( data );
    } );

//  var leapfull = document.getElementById( 'leapfull' );
//
//  var baseBoneRotation = ( new THREE.Quaternion ).setFromEuler( new THREE.Euler( 0, 0, Math.PI / 2 ) );
//  var armMeshes = [];
//  var boneMeshes = [];
//
////  var renderer, scene, camera, controls;
//
//    renderer = new THREE.WebGLRenderer( { canvas: leapfull, alpha: 1, antialias: true, clearColor: 0xffffff }  );
//    renderer.setSize( window.innerWidth, window.innerHeight );
//
//    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 5000 );
//    camera.position.set( -500, 500, 500 );
//
//    controls = new THREE.OrbitControls( camera, renderer.domElement );
//    controls.maxDistance = 1000;
//
//    scene = new THREE.Scene();
//
//  function onWindowResize() {
//    camera.aspect = window.innerWidth / window.innerHeight;
//    camera.updateProjectionMatrix();
//    renderer.setSize( window.innerWidth, window.innerHeight );
//  }
//
//  function addMesh( meshes ) {
//    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
//    var material = new THREE.MeshNormalMaterial();
//    var mesh = new THREE.Mesh( geometry, material );
//    meshes.push( mesh );
//    return mesh;
//  }
//
//  function updateMesh( bone, mesh ) {
//      mesh.position.fromArray( bone.center() );
//      mesh.setRotationFromMatrix( ( new THREE.Matrix4 ).fromArray( bone.matrix() ) );
//      mesh.quaternion.multiply( baseBoneRotation );
//      mesh.scale.set( bone.width, bone.width, bone.length );
//      scene.add( mesh );
//  }


function leapAnimate( data ) {

 var lCanvas = document.getElementById( 'leapcanvas' );
 var leapctx = lCanvas.getContext( '2d' );
 leapctx.clearRect(0, 0, leapctx.canvas.width, leapctx.canvas.height);

  frame = JSON.parse( data );

  //console.log( 'frame:', frame );

   var countBones = 0;
   var countArms = 0;

   //armMeshes.forEach( function( item ) { scene.remove( item ); } );
   //boneMeshes.forEach( function( item ) { scene.remove( item ); } );

   //for ( var hand of frame.hands ) {

if (frame.pointables.length > 0) {

  frame.pointables.forEach( function( pointable ) {

   function normalizePosition( pos ) {
     var norm = [];
     for ( i = 0; i < pos.length; i++ ) {
       norm[i] = ( ( pos[i] - lCenter[i] ) / lSize[i] ) + 0.5 ;
     }
     return  norm;
     }

  //for(var f=0; f < FINGER_COUNT; f++) {
  //        var mcpPosition = normalizeVector(leap_hand.fingers[f].mcpPosition).multiplyScalar(normalToScreen);
  //        var pipPosition = normalizeVector(leap_hand.fingers[f].pipPosition).multiplyScalar(normalToScreen);
  //        var dipPosition = normalizeVector(leap_hand.fingers[f].dipPosition).multiplyScalar(normalToScreen);
  //        var labelPosition = dipPosition;
  //  }

  var tipPosition = pointable.stabilizedTipPosition;
  var dipPosition = pointable.dipPosition;
  var pipPosition = pointable.pipPosition;
  var mcpPosition = pointable.mcpPosition;
  var carpPosition = pointable.carpPosition;

  var lCenter = frame.interactionBox.center;
  var lSize = frame.interactionBox.size;

  var tipx =  leapctx.canvas.width * normalizePosition( tipPosition )[0];
  var tipy =  leapctx.canvas.width * ( 1 - normalizePosition( tipPosition )[1]);

  var dipx =  leapctx.canvas.width * normalizePosition( dipPosition )[0];
  var dipy =  leapctx.canvas.width * ( 1 - normalizePosition( dipPosition )[1]);

  var pipx =  leapctx.canvas.width * normalizePosition( pipPosition )[0];
  var pipy =  leapctx.canvas.width * ( 1 - normalizePosition( pipPosition )[1]);

  var mcpx =  leapctx.canvas.width * normalizePosition( mcpPosition )[0];
  var mcpy =  leapctx.canvas.width * ( 1 - normalizePosition( mcpPosition )[1]);

  var carpx =  leapctx.canvas.width * normalizePosition( carpPosition )[0];
  var carpy =  leapctx.canvas.width * ( 1 - normalizePosition( carpPosition )[1]);

  //var normalizedPosition =  normalizePosition( tipPosition );
  //var x = leapctx.canvas.width * normalizedPosition[0];
  //var y = leapctx.canvas.height * (1 - normalizedPosition[1]);

  leapctx.beginPath();
  leapctx.fillStyle = 'red';
  leapctx.fillRect(tipx, tipy, 5, 5);
  //leapctx.fill();

  leapctx.fillStyle = 'blue';
  leapctx.fillRect(dipx, dipy, 5, 5);
  //leapctx.fill();

  leapctx.fillStyle = 'yellow';
  leapctx.fillRect(pipx, dipy, 5, 5);
 // leapctx.fill();

  leapctx.fillStyle = 'green';
  leapctx.fillRect(mcpx, dipy, 5, 5);
  //leapctx.fill();

  leapctx.fillStyle = 'orange';
  leapctx.fillRect(carpx, carpy, 5, 5);
  //leapctx.fill();

  } );
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
